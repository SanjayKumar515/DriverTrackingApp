import React, { FC, memo } from 'react';
import { Marker } from 'react-native-maps';
import { AnimatedRegion } from 'react-native-maps';
import { Driver } from '../../../../types/driver';

type Props = {
  driver: Driver;
  animated?: AnimatedRegion;
  onPress: (d: Driver) => void;
};

const DriverMarker: FC<Props> = ({ driver, animated, onPress }) => {
  return (
    <Marker.Animated
      coordinate={(animated as any) ?? (driver.coordinate as any)}
      tracksViewChanges={false}
      onPress={() => onPress(driver)}
      title={driver.name}
      description={`${driver.vehicleType} • ${driver.rating}`}
    />
  );
};

export default memo(DriverMarker);

