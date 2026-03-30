import React, { FC, useMemo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import Colors from '../../../constant/colors';
import { useDrivers } from '../../../features/drivers/driversContext';

type Params = {
  DriverDetailsScreen: { driverId: string };
};

const DriverDetailsScreen: FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<Params, 'DriverDetailsScreen'>>();
  const { driverId } = route.params;
  const { drivers, toggleFavorite, isFavorite } = useDrivers();

  const driver = useMemo(() => drivers.find(d => d.id === driverId) || null, [drivers, driverId]);
  const region: Region | null = useMemo(() => {
    if (!driver) return null;
    return {
      latitude: driver.coordinate.latitude,
      longitude: driver.coordinate.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    };
  }, [driver]);

  if (!driver) {
    return (
      <View style={styles.container}>
        <Text style={styles.name}>Driver not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.headerIconBtn} onPress={() => (navigation as any).goBack()}>
            <Text style={styles.headerIconText}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Driver details</Text>
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => toggleFavorite(driver.id)}
          >
            <Text style={styles.headerIconText}>{isFavorite(driver.id) ? '♥' : '♡'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatarWrap}>
          <Image source={{ uri: driver.imageUrl }} style={styles.avatar} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{driver.name}</Text>
          <Text style={styles.subTitle}>{driver.vehicleType}</Text>
          <View style={styles.badgesRow}>
            <View style={[styles.badge, styles.badgePrimary]}>
              <Text style={styles.badgeTextPrimary}>Rating {driver.rating}</Text>
            </View>
            <View style={[styles.badge, styles.badgeNeutral]}>
              <Text style={styles.badgeTextNeutral}>
                {driver.coordinate.latitude.toFixed(2)}, {driver.coordinate.longitude.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Phone</Text>
          <Text style={styles.infoValue}>{driver.phone || 'N/A'}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Vehicle</Text>
          <Text style={styles.infoValue}>{driver.vehicleType}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Location</Text>
          <Text style={styles.infoValue}>
            {driver.coordinate.latitude.toFixed(5)}, {driver.coordinate.longitude.toFixed(5)}
          </Text>
        </View>
      </View>

      {region && (
        <View style={styles.mapCard}>
          <MapView
            style={StyleSheet.absoluteFill}
            initialRegion={region}
            provider={PROVIDER_GOOGLE}
            showsUserLocation
            showsMyLocationButton
          >
            <Marker
              coordinate={driver.coordinate}
              title={driver.name}
              description="Driver location"
            />
          </MapView>
          <View style={styles.mapOverlayPill} pointerEvents="none">
            <Text style={styles.mapOverlayText}>Driver location</Text>
          </View>
        </View>
      )}

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.btn, styles.btnSecondary]}
          onPress={() => {
            // mock call button
          }}
        >
          <Text style={[styles.btnText, styles.btnTextSecondary]}>Call</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn} onPress={() => toggleFavorite(driver.id)}>
          <Text style={styles.btnText}>{isFavorite(driver.id) ? 'Unfavorite' : 'Favorite'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DriverDetailsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F9' },
  header: {
    backgroundColor: '#111214',
    paddingTop: 14,
    paddingBottom: 14,
    paddingHorizontal: 14,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconText: { color: '#fff', fontWeight: '900', fontSize: 18 },
  headerTitle: { color: '#fff', fontWeight: '900', fontSize: 18 },

  profileCard: {
    marginTop: 12,
    marginHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  avatarWrap: {
    width: 64,
    height: 64,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#E9ECF2',
  },
  avatar: { width: '100%', height: '100%' },
  name: { fontSize: 18, fontWeight: '900', color: '#111214', marginBottom: 2 },
  subTitle: { color: '#6B7280', fontWeight: '800' },
  badgesRow: { flexDirection: 'row', gap: 8, marginTop: 10, flexWrap: 'wrap' },
  badge: { paddingHorizontal: 10, paddingVertical: 7, borderRadius: 999 },
  badgePrimary: { backgroundColor: 'rgba(108,99,255,0.14)' },
  badgeNeutral: { backgroundColor: 'rgba(107,114,128,0.12)' },
  badgeTextPrimary: { color: '#6C63FF', fontWeight: '900', fontSize: 12 },
  badgeTextNeutral: { color: '#6B7280', fontWeight: '900', fontSize: 12 },

  infoCard: {
    marginTop: 12,
    marginHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
  },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, paddingVertical: 8 },
  infoLabel: { color: '#9CA3AF', fontWeight: '900' },
  infoValue: { color: '#111214', fontWeight: '900', flex: 1, textAlign: 'right' },
  divider: { height: 1, backgroundColor: '#EEF0F5' },

  mapCard: {
    marginTop: 12,
    marginHorizontal: 12,
    height: 210,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#E9ECF2',
  },
  mapOverlayPill: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(17,18,20,0.85)',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
  },
  mapOverlayText: { color: '#fff', fontWeight: '900', fontSize: 12 },

  actions: { marginTop: 14, marginHorizontal: 12, flexDirection: 'row', gap: 10 },
  btn: {
    flex: 1,
    backgroundColor: '#6C63FF',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  btnSecondary: {
    backgroundColor: '#E9ECF2',
  },
  btnText: { color: Colors.white, fontWeight: '800' },
  btnTextSecondary: { color: '#111214' },
});

