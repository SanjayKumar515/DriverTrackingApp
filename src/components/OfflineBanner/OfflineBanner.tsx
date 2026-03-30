import React, { FC, memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Colors from '../../constant/colors';

type Props = {
  visible: boolean;
};

const OfflineBanner: FC<Props> = ({ visible }) => {
  if (!visible) return null;
  return (
    <View style={styles.container} pointerEvents="none">
      <Text style={styles.text}>You are offline. Showing cached drivers.</Text>
    </View>
  );
};

export default memo(OfflineBanner);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: Colors.ERROR[300],
  },
  text: {
    color: Colors.NEUTRAL[100],
    fontWeight: '700',
    textAlign: 'center',
  },
});

