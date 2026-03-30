import React, {
  FC,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import NetInfo from '@react-native-community/netinfo';
import { UserService } from '../../services/apiServices';
import { Driver } from '../../types/driver';
import { mapRandomUserToDriver } from './driverMapper';
import {
  readDriversCache,
  readFavorites,
  saveDriversCache,
  saveFavorites,
} from './driversStorage';

type State = {
  drivers: Driver[];
  favorites: Record<string, true>;
  loading: boolean;
  error: string | null;
  isOffline: boolean;
};

type Action =
  | { type: 'SET_LOADING'; value: boolean }
  | { type: 'SET_ERROR'; value: string | null }
  | { type: 'SET_DRIVERS'; drivers: Driver[] }
  | { type: 'SET_OFFLINE'; value: boolean }
  | { type: 'SET_FAVORITES'; value: Record<string, true> };

const initialState: State = {
  drivers: [],
  favorites: {},
  loading: false,
  error: null,
  isOffline: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.value };
    case 'SET_ERROR':
      return { ...state, error: action.value };
    case 'SET_DRIVERS':
      return { ...state, drivers: action.drivers };
    case 'SET_OFFLINE':
      return { ...state, isOffline: action.value };
    case 'SET_FAVORITES':
      return { ...state, favorites: action.value };
    default:
      return state;
  }
}

type Ctx = State & {
  refreshDrivers: (results?: number) => Promise<void>;
  toggleFavorite: (driverId: string) => Promise<void>;
  isFavorite: (driverId: string) => boolean;
  updateDriverPositions: () => void;
};

const DriversContext = createContext<Ctx | null>(null);

export const DriversProvider: FC<{ children?: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const unsub = NetInfo.addEventListener(s => {
      dispatch({ type: 'SET_OFFLINE', value: !s.isConnected });
    });
    return unsub;
  }, []);

  useEffect(() => {
    (async () => {
      const fav = await readFavorites();
      dispatch({ type: 'SET_FAVORITES', value: fav });
    })();
  }, []);

  const refreshDrivers = useCallback(async (results: number = 10) => {
    dispatch({ type: 'SET_LOADING', value: true });
    dispatch({ type: 'SET_ERROR', value: null });
    try {
      const net = await NetInfo.fetch();
      const offline = !net.isConnected;
      dispatch({ type: 'SET_OFFLINE', value: offline });

      if (offline) {
        const cached = await readDriversCache();
        if (cached?.length) {
          dispatch({ type: 'SET_DRIVERS', drivers: cached });
        } else {
          dispatch({ type: 'SET_ERROR', value: 'Offline and no cached drivers found.' });
        }
        return;
      }

      const data = await UserService.getUsers(results);
      const mapped: Driver[] = (data?.results || [])
        .map(mapRandomUserToDriver)
        .filter(Boolean) as Driver[];

      dispatch({ type: 'SET_DRIVERS', drivers: mapped });
      await saveDriversCache(mapped);
    } catch (e: any) {
      dispatch({
        type: 'SET_ERROR',
        value: e?.message ? String(e.message) : 'Failed to load drivers.',
      });
      const cached = await readDriversCache();
      if (cached?.length) dispatch({ type: 'SET_DRIVERS', drivers: cached });
    } finally {
      dispatch({ type: 'SET_LOADING', value: false });
    }
  }, []);

  const toggleFavorite = useCallback(
    async (driverId: string) => {
      const next = { ...state.favorites };
      if (next[driverId]) {
        delete next[driverId];
      } else {
        next[driverId] = true;
      }
      dispatch({ type: 'SET_FAVORITES', value: next });
      await saveFavorites(next);
    },
    [state.favorites]
  );

  const isFavorite = useCallback(
    (driverId: string) => {
      return !!state.favorites[driverId];
    },
    [state.favorites]
  );

  const updateDriverPositions = useCallback(() => {
    if (!state.drivers.length) return;
    // small random deltas (~0-200m). Keep in valid lat/lon bounds.
    const next = state.drivers.map(d => {
      const dLat = (Math.random() - 0.5) * 0.002;
      const dLon = (Math.random() - 0.5) * 0.002;
      const latitude = clamp(d.coordinate.latitude + dLat, -85, 85);
      const longitude = wrapLon(d.coordinate.longitude + dLon);
      return { ...d, coordinate: { latitude, longitude } };
    });
    dispatch({ type: 'SET_DRIVERS', drivers: next });
    saveDriversCache(next);
  }, [state.drivers]);

  const value = useMemo<Ctx>(
    () => ({
      ...state,
      refreshDrivers,
      toggleFavorite,
      isFavorite,
      updateDriverPositions,
    }),
    [state, refreshDrivers, toggleFavorite, isFavorite, updateDriverPositions]
  );

  return <DriversContext.Provider value={value}>{children}</DriversContext.Provider>;
};

export function useDrivers(): Ctx {
  const ctx = useContext(DriversContext);
  if (!ctx) throw new Error('useDrivers must be used within DriversProvider');
  return ctx;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function wrapLon(lon: number) {
  let x = lon;
  while (x < -180) x += 360;
  while (x > 180) x -= 360;
  return x;
}

