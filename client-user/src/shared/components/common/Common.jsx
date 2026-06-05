// c:/gitIN6AM/KinalSports/client-user/src/shared/components/common/Common.jsx
import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from '../../constants/theme.js';

export const LoadingSpinner = () => (
  <View style={[styles.center, styles.full]}>
    <ActivityIndicator size="large" color={COLORS.primary} />
  </View>
);

export const EmptyState = ({ message = "No hay datos disponibles" }) => (
  <View style={[styles.center, styles.full, styles.emptyContainer]}>
    <Text style={styles.emptyText}>{message}</Text>
  </View>
);

export const Card = ({ children, style }) => (
  <View style={[styles.card, style]}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  full: {
    flex: 1,
  },
  emptyContainer: {
    padding: SPACING.xl,
  },
  emptyText: {
    color: COLORS.textLight,
    fontSize: FONT_SIZE.lg,
    textAlign: 'center',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    ...SHADOWS.medium,
  }
});
