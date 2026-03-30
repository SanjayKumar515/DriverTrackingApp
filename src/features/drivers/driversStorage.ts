import { LocalStorage } from '../../helpers/localStorage';
import { Driver } from '../../types/driver';

const DRIVERS_KEY = '@drivers_cache_v1';
const FAVORITES_KEY = '@favorites_v1';

export async function saveDriversCache(drivers: Driver[]) {
  return LocalStorage.save(DRIVERS_KEY, { drivers, savedAt: Date.now() });
}

export async function readDriversCache(): Promise<Driver[] | null> {
  const data = await LocalStorage.read(DRIVERS_KEY);
  if (!data || !Array.isArray(data?.drivers)) return null;
  return data.drivers as Driver[];
}

export async function readFavorites(): Promise<Record<string, true>> {
  const data = await LocalStorage.read(FAVORITES_KEY);
  if (!data || typeof data !== 'object') return {};
  return data as Record<string, true>;
}

export async function saveFavorites(favorites: Record<string, true>) {
  return LocalStorage.save(FAVORITES_KEY, favorites);
}

