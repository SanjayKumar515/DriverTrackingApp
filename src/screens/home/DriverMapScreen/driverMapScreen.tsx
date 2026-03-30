import React, { FC, memo, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { AnimatedRegion, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import Colors from '../../../constant/colors';
import { useDrivers } from '../../../features/drivers/driversContext';
import { Driver } from '../../../types/driver';
import { distanceKm } from '../../../helpers/geo';
import { useNavigation } from '@react-navigation/native';
import styles from './driverMapScreen.styles';
import HeaderOverlay from './components/HeaderOverlay';
import DriverMarker from './components/DriverMarker';
import DriverCardItem from './components/DriverCardItem';
import SelectedDriverModal from './components/SelectedDriverModal';

const DriverMapScreen: FC = () => {
  const navigation = useNavigation();
  const { drivers, loading, error, isOffline, refreshDrivers, updateDriverPositions, isFavorite } =
    useDrivers();

  const [selected, setSelected] = useState<Driver | null>(null);
  const [query, setQuery] = useState('');
  const [filterRating, setFilterRating] = useState(false);
  const [filterNearest, setFilterNearest] = useState(false);
  const [userCoord, setUserCoord] = useState<{ latitude: number; longitude: number } | null>(null);

  const mapRef = useRef<MapView | null>(null);
  const animatedById = useRef<Record<string, AnimatedRegion>>({});

  useEffect(() => {
    refreshDrivers(10);
  }, [refreshDrivers]);

  useEffect(() => {
    const t = setInterval(() => {
      updateDriverPositions();
    }, 3000);
    return () => clearInterval(t);
  }, [updateDriverPositions]);

  // Keep AnimatedRegion objects stable per driver id
  useEffect(() => {
    for (const d of drivers) {
      if (!animatedById.current[d.id]) {
        animatedById.current[d.id] = new AnimatedRegion({
          latitude: d.coordinate.latitude,
          longitude: d.coordinate.longitude,
          latitudeDelta: 0,
          longitudeDelta: 0,
        });
      }
    }
  }, [drivers]);


  useEffect(() => {
    for (const d of drivers) {
      const region = animatedById.current[d.id];
      if (!region) continue;
      (region as any)
        .timing({
          toValue: {
            latitude: d.coordinate.latitude,
            longitude: d.coordinate.longitude,
          },
          duration: 800,
          useNativeDriver: false,
        })
        .start();
    }
  }, [drivers]);

  const driversWithDistance = useMemo(() => {
    return drivers.map(d => {
      const km =
        userCoord ? distanceKm(userCoord, d.coordinate) : 1 + Math.random() * 20;
      return { d, km };
    });
  }, [drivers, userCoord]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = driversWithDistance;
    if (q) list = list.filter(x => x.d.name.toLowerCase().includes(q));
    if (filterRating) list = list.filter(x => x.d.rating > 4);
    // "Nearest" sorts by distance (keeps all drivers visible).
    if (filterNearest) list = [...list].sort((a, b) => a.km - b.km);
    return list;
  }, [driversWithDistance, query, filterRating, filterNearest]);

  const initialRegion: Region = useMemo(() => {
    const first = filtered[0]?.d || drivers[0];
    const latitude = first?.coordinate.latitude ?? 37.78825;
    const longitude = first?.coordinate.longitude ?? -122.4324;
    return { latitude, longitude, latitudeDelta: 0.2, longitudeDelta: 0.2 };
  }, [filtered, drivers]);

  const onPressDriver = (d: Driver) => {
    setSelected(d);
  };

  const focusDriverOnMap = (d: Driver) => {
    mapRef.current?.animateToRegion(
      {
        latitude: d.coordinate.latitude,
        longitude: d.coordinate.longitude,
        latitudeDelta: 0.06,
        longitudeDelta: 0.06,
      },
      450
    );
    setSelected(d);
  };

  const openDetails = (d: Driver) => {
    setSelected(null);
    (navigation as any).navigate('DriverDetailsScreen', { driverId: d.id });
  };

  const selectedDistanceText = useMemo(() => {
    if (!selected) return '';
    return userCoord
      ? `${distanceKm(userCoord, selected.coordinate).toFixed(1)} km`
      : `${(1 + Math.random() * 20).toFixed(1)} km`;
  }, [selected, userCoord]);

  return (
    <View style={styles.container}>
      <View style={styles.mapWrap}>
        <MapView
          ref={r => {
            mapRef.current = r;
          }}
          style={StyleSheet.absoluteFill}
          initialRegion={initialRegion}
          showsUserLocation
          showsMyLocationButton
          onUserLocationChange={e => {
            const c = e?.nativeEvent?.coordinate;
            if (c?.latitude && c?.longitude) setUserCoord({ latitude: c.latitude, longitude: c.longitude });
          }}
          provider={PROVIDER_GOOGLE}
        >
          {filtered.map(({ d }) => (
            <DriverMarker
              key={d.id}
              driver={d}
              animated={animatedById.current[d.id]}
              onPress={onPressDriver}
            />
          ))}
        </MapView>

        <HeaderOverlay
          title="Driver Tracking"
          query={query}
          onChangeQuery={setQuery}
          filterRating={filterRating}
          filterNearest={filterNearest}
          onPressAll={() => {
            setFilterRating(false);
            setFilterNearest(false);
          }}
          onToggleRating={() => setFilterRating(v => !v)}
          onToggleNearest={() => setFilterNearest(v => !v)}
          onPressList={() => (navigation as any).navigate('DriverListScreen')}
          styles={styles}
        />

        {/* Driver cards from randomuser.me API */}
        <View style={styles.cardsWrap} pointerEvents="box-none">
          <FlatList
            data={filtered}
            keyExtractor={item => item.d.id}
             showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.cardsContent}
            initialNumToRender={6}
            maxToRenderPerBatch={8}
            windowSize={5}
            removeClippedSubviews
            renderItem={({ item }) => (
              <DriverCardItem
                driver={item.d}
                distanceKm={item.km}
                favorite={isFavorite(item.d.id)}
                onPress={focusDriverOnMap}
                onDetails={openDetails}
                styles={styles}
              />
            )}
          />
        </View>

        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator color={Colors.PRIMARY[400]} />
          </View>
        )}

        {!!error && (
          <View style={styles.errorOverlay}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={() => refreshDrivers(10)}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {isOffline && drivers.length > 0 && (
          <View style={styles.offlineHint}>
            <Text style={styles.offlineHintText}>Offline: using cached drivers</Text>
          </View>
        )}
      </View>

      <SelectedDriverModal
        visible={!!selected}
        driver={selected}
        favorite={selected ? isFavorite(selected.id) : false}
        distanceText={selectedDistanceText}
        onClose={() => setSelected(null)}
        onDetails={openDetails}
        styles={styles}
      />
    </View>
  );
};

export default DriverMapScreen;
