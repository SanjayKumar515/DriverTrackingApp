import React, { FC, memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Driver } from '../../../../types/driver';

type Props = {
  driver: Driver;
  distanceKm: number;
  favorite: boolean;
  onPress: (d: Driver) => void;
  onDetails: (d: Driver) => void;
  styles: any;
};

const DriverCardItem: FC<Props> = ({ driver, distanceKm, favorite, onPress, onDetails, styles }) => {
  return (
    <TouchableOpacity style={styles.driverCard} activeOpacity={0.92} onPress={() => onPress(driver)}>
      <View style={styles.driverCardRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.driverName} numberOfLines={1}>
            {driver.name}
          </Text>
          <Text style={styles.driverMeta} numberOfLines={1}>
            {driver.vehicleType} • Rating {driver.rating}
          </Text>
        </View>
        <View style={[styles.pillBadge, favorite ? styles.pillBadgeOn : styles.pillBadgeOff]}>
          <Text style={[styles.pillBadgeText, favorite ? styles.pillBadgeTextOn : styles.pillBadgeTextOff]}>
            {favorite ? 'Favorite' : 'Driver'}
          </Text>
        </View>
      </View>
      <View style={styles.driverStatsRow}>
        <View style={styles.driverStat}>
          <Text style={styles.driverStatLabel}>Distance</Text>
          <Text style={styles.driverStatValue}>{distanceKm.toFixed(1)} km</Text>
        </View>
        <View style={styles.driverStat}>
          <Text style={styles.driverStatLabel}>Phone</Text>
          <Text style={styles.driverStatValue} numberOfLines={1}>
            {driver.phone || 'N/A'}
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.driverDetailsMiniBtn} onPress={() => onDetails(driver)}>
        <Text style={styles.driverDetailsMiniText}>View details</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default memo(DriverCardItem);

