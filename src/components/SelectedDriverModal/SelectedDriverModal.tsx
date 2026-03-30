import React, { FC, memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import { Driver } from '../../types/driver';

type Props = {
  visible: boolean;
  driver: Driver | null;
  favorite: boolean;
  distanceText: string;
  onClose: () => void;
  onDetails: (d: Driver) => void;
  styles: any;
};

const SelectedDriverModal: FC<Props> = ({
  visible,
  driver,
  favorite,
  distanceText,
  onClose,
  onDetails,
  styles,
}) => {
  return (
    <Modal isVisible={visible} onBackdropPress={onClose} style={styles.modal} backdropOpacity={0.35}>
      {driver && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{driver.name}</Text>
          <Text style={styles.cardMeta}>
            Vehicle: {driver.vehicleType} • Rating: {driver.rating} • Favorite: {favorite ? 'Yes' : 'No'}
          </Text>
          <Text style={styles.cardMeta}>Distance: {distanceText}</Text>
          <TouchableOpacity style={styles.detailsBtn} onPress={() => onDetails(driver)}>
            <Text style={styles.detailsBtnText}>View details</Text>
          </TouchableOpacity>
        </View>
      )}
    </Modal>
  );
};

export default memo(SelectedDriverModal);

