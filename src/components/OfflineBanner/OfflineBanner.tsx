import React, { FC, memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../../constant/colors';

type Props = {
  visible: boolean;
  position?: 'top' | 'bottom';
  retryLabel?: string;
  onRetry?: () => void;
};

const OfflineBanner: FC<Props> = ({ visible, position = 'top', retryLabel = 'Retry', onRetry }) => {
  if (!visible) return null;
  return (
    <View style={[styles.container, position === 'bottom' ? styles.bottom : styles.top]} pointerEvents="box-none">
      <Text style={styles.text}>Network is not connected. Please check your internet.</Text>
      {onRetry ? (
        <TouchableOpacity style={styles.retryBtn} onPress={onRetry}>
          <Text style={styles.retryText}>{retryLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default memo(OfflineBanner);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 999,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: Colors.ERROR[300],
  },
  top: {
    top: 0,
  },
  bottom: {
    bottom: 0,
  },
  text: {
    color: Colors.NEUTRAL[100],
    fontWeight: '700',
    textAlign: 'center',
  },
  retryBtn: {
    marginTop: 8,
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: Colors.NEUTRAL[100],
  },
  retryText: {
    color: Colors.ERROR[700],
    fontWeight: '700',
  },
});

