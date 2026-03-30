import React, { FC, useMemo, useRef } from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import Colors from "../../../constant/colors";
import { useDrivers } from "../../../features/drivers/driversContext";
import styles from "./DriverDetailsScreen.styles";

type Params = {
  DriverDetailsScreen: { driverId: string };
};

const DriverDetailsScreen: FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<Params, "DriverDetailsScreen">>();
  const { driverId } = route.params;
  const { drivers, toggleFavorite, isFavorite } = useDrivers();

  const driver = useMemo(
    () => drivers.find((d) => d.id === driverId) || null,
    [drivers, driverId],
  );
  const region: Region | null = useMemo(() => {
    if (!driver) return null;
    return {
      latitude: driver.coordinate.latitude,
      longitude: driver.coordinate.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    };
  }, [driver]);

  const mapRef = useRef<MapView | null>(null);

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
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => (navigation as any).goBack()}
          >
            <Text style={styles.headerIconText}>{"<"}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Driver details</Text>
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => toggleFavorite(driver.id)}
          >
            <Text style={styles.headerIconText}>
              {isFavorite(driver.id) ? "♥" : "♡"}
            </Text>
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
              <Text style={styles.badgeTextPrimary}>
                Rating {driver.rating}
              </Text>
            </View>
            <View style={[styles.badge, styles.badgeNeutral]}>
              <Text style={styles.badgeTextNeutral}>
                {driver.coordinate.latitude.toFixed(2)},{" "}
                {driver.coordinate.longitude.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Phone</Text>
          <Text style={styles.infoValue}>{driver.phone || "N/A"}</Text>
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
            {driver.coordinate.latitude.toFixed(5)},{" "}
            {driver.coordinate.longitude.toFixed(5)}
          </Text>
        </View>
      </View>

      {region && (
        <View style={styles.mapCard}>
          <MapView
            ref={(ref) => {
              mapRef.current = ref;
            }}
           style={StyleSheet.absoluteFill}
            region={region}
            provider={PROVIDER_GOOGLE}
            showsUserLocation
            showsMyLocationButton
            initialRegion={region}
            showsCompass
            zoomEnabled
            scrollEnabled
            pitchEnabled
            rotateEnabled
            onMapReady={() => {
              if (mapRef.current) {
                mapRef.current.animateToRegion(region, 400);
              }
            }}
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

        <TouchableOpacity
          style={styles.btn}
          onPress={() => toggleFavorite(driver.id)}
        >
          <Text style={styles.btnText}>
            {isFavorite(driver.id) ? "Unfavorite" : "Favorite"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DriverDetailsScreen;

