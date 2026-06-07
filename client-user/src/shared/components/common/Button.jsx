// c:\gitIN6AM\KinalSports\client-user\src\shared\components\common\Button.jsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from '../../constants/theme';

export const Button = ({
  title,
  onPress,
  variant = 'primary', // 'primary' | 'secondary'
  loading = false,
  disabled = false,
  style,
  textStyle
}) => {
  const isPrimary = variant === 'primary';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isPrimary ? styles.primaryButton : styles.secondaryButton,
        disabled && styles.disabledButton,
        style
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? COLORS.surface : COLORS.primary} />
      ) : (
        <Text
          style={[
            styles.text,
            isPrimary ? styles.primaryText : styles.secondaryText,
            disabled && styles.disabledText,
            textStyle
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    ...SHADOWS.small,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  disabledButton: {
    backgroundColor: COLORS.border,
    borderColor: COLORS.border,
    elevation: 0,
    shadowOpacity: 0,
  },
  text: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
  primaryText: {
    color: COLORS.surface,
  },
  secondaryText: {
    color: COLORS.primary,
  },
  disabledText: {
    color: COLORS.textLight,
  }
});
