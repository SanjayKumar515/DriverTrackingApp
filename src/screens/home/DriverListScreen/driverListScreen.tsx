import React, { FC, memo, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Colors from '../../../constant/colors';
import { useDrivers } from '../../../features/drivers/driversContext';
import { Driver } from '../../../types/driver';

const DriverListScreen: FC = () => {
  const navigation = useNavigation();
  const { drivers, loading, error, refreshDrivers, isFavorite } = useDrivers();

  const [query, setQuery] = useState('');
  const [filterRating, setFilterRating] = useState(false);
  const [filterFav, setFilterFav] = useState(false);

  useEffect(() => {
    if (!drivers.length) refreshDrivers(10);
  }, [drivers.length, refreshDrivers]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = drivers;
    if (q) list = list.filter(d => d.name.toLowerCase().includes(q));
    if (filterRating) list = list.filter(d => d.rating > 4);
    if (filterFav) list = list.filter(d => isFavorite(d.id));
    return list;
  }, [drivers, query, filterRating, filterFav, isFavorite]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.headerIconBtn} onPress={() => (navigation as any).goBack()}>
            <Text style={styles.headerIconText}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Drivers</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.searchPill}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Search driver"
            placeholderTextColor="rgba(255,255,255,0.6)"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.segmentRow}>
          <SegmentButton label="All" active={!filterRating && !filterFav} onPress={() => { setFilterRating(false); setFilterFav(false); }} />
          <SegmentButton label="Rating > 4" active={filterRating} onPress={() => { setFilterRating(v => !v); if (!filterRating) setFilterFav(false); }} />
          <SegmentButton label="Favorites" active={filterFav} onPress={() => { setFilterFav(v => !v); if (!filterFav) setFilterRating(false); }} />
        </View>
      </View>

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator color="#6C63FF" />
        </View>
      )}

      {!!error && !loading && (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => refreshDrivers(10)}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={filtered}
        keyExtractor={d => d.id}
        contentContainerStyle={{ padding: 12, gap: 12, paddingBottom: 18 }}
        renderItem={({ item }) => (
          <DriverListCard
            driver={item}
            favorite={isFavorite(item.id)}
            onPress={() => (navigation as any).navigate('DriverDetailsScreen', { driverId: item.id })}
          />
        )}
      />
    </View>
  );
};

export default DriverListScreen;

const SegmentButton: FC<{ label: string; active: boolean; onPress: () => void }> = memo(
  ({ label, active, onPress }) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[styles.segmentBtn, active && styles.segmentBtnActive]}
        activeOpacity={0.9}
      >
        <Text style={[styles.segmentText, active && styles.segmentTextActive]} numberOfLines={1}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  }
);

const DriverListCard: FC<{
  driver: Driver;
  favorite: boolean;
  onPress: () => void;
}> = memo(({ driver, favorite, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.92} onPress={onPress}>
      <View style={styles.cardTopRow}>
        <View style={styles.avatarWrap}>
          <Image source={{ uri: driver.imageUrl }} style={styles.avatar} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name} numberOfLines={1}>
            {driver.name}
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            {driver.vehicleType} • Rating {driver.rating}
          </Text>
        </View>

        <View style={[styles.badge, favorite ? styles.badgeFav : styles.badgeNeutral]}>
          <Text style={[styles.badgeText, favorite ? styles.badgeTextFav : styles.badgeTextNeutral]}>
            {favorite ? 'Favorite' : 'Driver'}
          </Text>
        </View>
      </View>

      <View style={styles.cardDivider} />

      <View style={styles.cardBottomRow}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Phone</Text>
          <Text style={styles.statValue} numberOfLines={1}>
            {driver.phone || 'N/A'}
          </Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Coordinates</Text>
          <Text style={styles.statValue} numberOfLines={1}>
            {driver.coordinate.latitude.toFixed(2)}, {driver.coordinate.longitude.toFixed(2)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

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
  headerTitle: { color: '#fff', fontWeight: '900', fontSize: 22 },
  searchPill: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  searchIcon: { color: 'rgba(255,255,255,0.7)', fontSize: 16, fontWeight: '900' },
  searchInput: { flex: 1, color: '#fff', fontWeight: '700' },
  segmentRow: { marginTop: 12, flexDirection: 'row', gap: 8 },
  segmentBtn: {
    flex: 1,
    height: 34,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  segmentBtnActive: {
    backgroundColor: '#6C63FF',
  },
  segmentText: { color: 'rgba(255,255,255,0.85)', fontWeight: '800', fontSize: 12 },
  segmentTextActive: { color: '#fff' },
  center: { padding: 16 },
  errorText: { color: Colors.ERROR[200], fontWeight: '800', marginBottom: 10 },
  retryBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#6C63FF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryText: { color: Colors.white, fontWeight: '800' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#E9ECF2',
  },
  avatar: { width: '100%', height: '100%' },
  name: { fontSize: 16, fontWeight: '900', color: '#111214', marginBottom: 2 },
  meta: { color: '#6B7280', fontWeight: '800' },
  badge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  badgeFav: { backgroundColor: 'rgba(34,197,94,0.15)' },
  badgeNeutral: { backgroundColor: 'rgba(107,114,128,0.12)' },
  badgeText: { fontWeight: '900', fontSize: 12 },
  badgeTextFav: { color: '#16A34A' },
  badgeTextNeutral: { color: '#6B7280' },
  cardDivider: { height: 1, backgroundColor: '#EEF0F5', marginVertical: 12 },
  cardBottomRow: { flexDirection: 'row', gap: 12 },
  stat: { flex: 1 },
  statLabel: { color: '#9CA3AF', fontWeight: '900', fontSize: 11, marginBottom: 4 },
  statValue: { color: '#111214', fontWeight: '900' },
});

