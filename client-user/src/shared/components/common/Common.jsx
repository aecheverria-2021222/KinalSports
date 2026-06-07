// c:\gitIN6AM\KinalSports\client-user\src\shared\components\common\Common.jsx
import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from '../../constants/theme';

export const LoadingSpinner = ({ size = 'large', color = COLORS.primary, style }) => (
  <View style={[styles.centerContainer, style]}>
    <ActivityIndicator size={size} color={color} />
  </View>
);

export const EmptyState = ({ icon = 'inbox', message = 'No hay datos disponibles', submessage }) => (
  <View style={styles.centerContainer}>
    <MaterialIcons name={icon} size={64} color={COLORS.secondary} />
    <Text style={styles.emptyMessage}>{message}</Text>
    {submessage && <Text style={styles.emptySubmessage}>{submessage}</Text>}
  </View>
);

export const Card = ({ children, style }) => (
  <View style={[styles.card, style]}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyMessage: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.text,
    fontWeight: '600',
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  emptySubmessage: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  }
});
