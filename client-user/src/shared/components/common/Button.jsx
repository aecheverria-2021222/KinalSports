// c:/gitIN6AM/KinalSports/client-user/src/shared/components/common/Button.jsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, SPACING, FONT_SIZE } from '../../constants/theme.js';

const Button = ({ title, onPress, variant = 'primary', loading = false, disabled = false, style }) => {
  const isPrimary = variant === 'primary';
  const bgColor = isPrimary ? COLORS.primary : COLORS.secondary;
  const textColor = COLORS.surface;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: disabled || loading ? COLORS.border : bgColor },
        style
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.text, { color: textColor }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
  }
});

export default Button;
