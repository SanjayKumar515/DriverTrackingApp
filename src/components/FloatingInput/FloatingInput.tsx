import React, { useRef, useState } from 'react';
import { View, TextInput, Animated, Platform, StyleSheet } from 'react-native';

interface FloatingInputProps {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'email-address' | 'default';
  autoCapitalize?: 'none' | 'sentences';
  rightElement?: React.ReactNode;
  error?: boolean;
}

const FloatingInput: React.FC<FloatingInputProps> = ({
  label,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType = 'default',
  autoCapitalize = 'none',
  rightElement,
  error,
}) => {
  const [focused, setFocused] = useState(false);
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  const handleFocus = () => {
    setFocused(true);
    Animated.timing(anim, { toValue: 1, duration: 180, useNativeDriver: false }).start();
  };

  const handleBlur = () => {
    setFocused(false);
    if (!value) {
      Animated.timing(anim, { toValue: 0, duration: 180, useNativeDriver: false }).start();
    }
  };

  const labelTop = anim.interpolate({ inputRange: [0, 1], outputRange: [18, 4] });
  const labelSize = anim.interpolate({ inputRange: [0, 1], outputRange: [16, 11] });
  const labelColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#9CA3AF', focused ? '#6C63FF' : '#6B7280'],
  });

  const borderColor = error ? '#EF4444' : focused ? '#6C63FF' : '#E5E7EB';

  return (
    <View style={[styles.wrapper, { borderColor, borderWidth: focused || error ? 1.5 : 1 }]}> 
      <Animated.Text
        style={[styles.label, { top: labelTop, fontSize: labelSize, color: labelColor }]}
        pointerEvents="none"
      >
        {label}
      </Animated.Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
        placeholderTextColor="transparent"
      />
      {rightElement && <View style={styles.right}>{rightElement}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 14,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
    marginBottom: 16,
    position: 'relative',
  },
  label: {
    position: 'absolute',
    left: 16,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    letterSpacing: 0.2,
  },
  input: {
    fontSize: 16,
    color: '#111827',
    paddingRight: 48,
    paddingTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  right: {
    position: 'absolute',
    right: 14,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
});

export default FloatingInput;
