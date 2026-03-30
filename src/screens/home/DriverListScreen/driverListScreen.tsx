import React, { FC, memo, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useNetInfo } from "@react-native-community/netinfo";
import Colors from "../../../constant/colors";
import { useDrivers } from "../../../features/drivers/driversContext";
import { Driver } from "../../../types/driver";
import styles from "./driverListScreen.styles";

const DriverListScreen: FC = () => {
  const navigation = useNavigation();
  const { drivers, loading, error, refreshDrivers, isFavorite } = useDrivers();
  const netInfo = useNetInfo();

  const [query, setQuery] = useState("");
  const [filterRating, setFilterRating] = useState(false);
  const [filterFav, setFilterFav] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshDrivers(10);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!drivers.length) refreshDrivers(10);
  }, [drivers.length, refreshDrivers]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = drivers;
    if (q) list = list.filter((d) => d.name.toLowerCase().includes(q));
    if (filterRating) list = list.filter((d) => d.rating > 4);
    if (filterFav) list = list.filter((d) => isFavorite(d.id));
    return list;
  }, [drivers, query, filterRating, filterFav, isFavorite]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
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
          <SegmentButton
            label="All"
            active={!filterRating && !filterFav}
            onPress={() => {
              setFilterRating(false);
              setFilterFav(false);
            }}
          />
          <SegmentButton
            label="Rating > 4"
            active={filterRating}
            onPress={() => {
              setFilterRating((v) => !v);
              if (!filterRating) setFilterFav(false);
            }}
          />
          <SegmentButton
            label="Favorites"
            active={filterFav}
            onPress={() => {
              setFilterFav((v) => !v);
              if (!filterFav) setFilterRating(false);
            }}
          />
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
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => refreshDrivers(10)}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={filtered}
        keyExtractor={(d) => d.id}
        contentContainerStyle={{ padding: 12, gap: 12, paddingBottom: 90 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#6C63FF"
            title="Pull to refresh"
            titleColor="#6C63FF"
          />
        }
        renderItem={({ item }) => (
          <DriverListCard
            driver={item}
            favorite={isFavorite(item.id)}
            onPress={() =>
              (navigation as any).navigate("DriverDetailsScreen", {
                driverId: item.id,
              })
            }
          />
        )}
      />
    </View>
  );
};

export default DriverListScreen;

const SegmentButton: FC<{
  label: string;
  active: boolean;
  onPress: () => void;
}> = memo(({ label, active, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.segmentBtn, active && styles.segmentBtnActive]}
      activeOpacity={0.9}
    >
      <Text
        style={[styles.segmentText, active && styles.segmentTextActive]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
});

const DriverListCard: FC<{
  driver: Driver;
  favorite: boolean;
  onPress: () => void;
}> = memo(({ driver, favorite, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.92}
      onPress={onPress}
    >
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

        <View
          style={[
            styles.badge,
            favorite ? styles.badgeFav : styles.badgeNeutral,
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              favorite ? styles.badgeTextFav : styles.badgeTextNeutral,
            ]}
          >
            {favorite ? "Favorite" : "Driver"}
          </Text>
        </View>
      </View>

      <View style={styles.cardDivider} />

      <View style={styles.cardBottomRow}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Phone</Text>
          <Text style={styles.statValue} numberOfLines={1}>
            {driver.phone || "N/A"}
          </Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Coordinates</Text>
          <Text style={styles.statValue} numberOfLines={1}>
            {driver.coordinate.latitude.toFixed(2)},{" "}
            {driver.coordinate.longitude.toFixed(2)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});


