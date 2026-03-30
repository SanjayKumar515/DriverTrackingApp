import React, { FC, memo } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

type Props = {
  title: string;
  query: string;
  onChangeQuery: (v: string) => void;
  filterRating: boolean;
  filterNearest: boolean;
  onPressAll: () => void;
  onToggleRating: () => void;
  onToggleNearest: () => void;
  onPressList: () => void;
  styles: any;
};

const HeaderOverlay: FC<Props> = ({
  title,
  query,
  onChangeQuery,
  filterRating,
  filterNearest,
  onPressAll,
  onToggleRating,
  onToggleNearest,
  onPressList,
  styles,
}) => {
  return (
    <View style={styles.headerOverlay} pointerEvents="box-none">
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.searchPill}>
        <Text style={styles.searchIcon}>⌕</Text>
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={onChangeQuery}
          placeholder="Search driver"
          placeholderTextColor="rgba(255,255,255,0.6)"
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.headerRightBtn} onPress={onPressList}>
          <Text style={styles.headerRightBtnText}>List</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.segmentRow}>
        <TouchableOpacity
          style={[styles.segmentBtn, !filterRating && !filterNearest && styles.segmentBtnActive]}
          onPress={onPressAll}
        >
          <Text style={[styles.segmentText, !filterRating && !filterNearest && styles.segmentTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.segmentBtn, filterRating && styles.segmentBtnActive]} onPress={onToggleRating}>
          <Text style={[styles.segmentText, filterRating && styles.segmentTextActive]}>Rating &gt; 4</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.segmentBtn, filterNearest && styles.segmentBtnActive]}
          onPress={onToggleNearest}
        >
          <Text style={[styles.segmentText, filterNearest && styles.segmentTextActive]}>Nearest</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default memo(HeaderOverlay);

