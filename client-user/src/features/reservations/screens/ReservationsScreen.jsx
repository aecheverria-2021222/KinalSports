// c:\gitIN6AM\KinalSports\client-user\src\features\reservations\screens\ReservationsScreen.jsx
import React from 'react';
import { View, FlatList, StyleSheet, Text, RefreshControl, Alert } from 'react-native';
import { useReservations } from '../hooks/useReservations.js';
import { Card, LoadingSpinner, EmptyState } from '../../../shared/components/common/Common.jsx';
import { Button } from '../../../shared/components/common/Button.jsx';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme.js';

export const ReservationsScreen = () => {
  const { reservations, loading, error, fetchHistory, cancelReservation } = useReservations();

  const handleCancel = (id) => {
    Alert.alert('Cancelar Reserva', '¿Estás seguro de que deseas cancelar esta reserva?', [
      { text: 'No', style: 'cancel' },
      { text: 'Sí, Cancelar', style: 'destructive', onPress: () => cancelReservation(id) }
    ]);
  };

  if (loading && !reservations.length) return <LoadingSpinner />;
  if (error && !reservations.length) return <EmptyState icon="error-outline" message={error} />;

  const renderItem = ({ item }) => {
    const isCancellable = item.status === 'PENDING' || item.status === 'CONFIRMED';
    
    return (
      <Card style={styles.cardContainer}>
        <View style={styles.header}>
          <Text style={styles.fieldName}>{item.field?.fieldName || 'Cancha Desconocida'}</Text>
          <Text style={[
            styles.status, 
            item.status === 'CANCELLED' ? styles.statusCancelled : styles.statusActive
          ]}>
            {item.status}
          </Text>
        </View>
        <Text style={styles.detailText}>Fecha: {item.reservationDate ? new Date(item.reservationDate).toLocaleDateString() : 'N/A'}</Text>
        <Text style={styles.detailText}>Hora: {item.startTime} - {item.endTime}</Text>

        {isCancellable && (
          <Button 
            title="Cancelar Reserva" 
            variant="secondary" 
            style={styles.cancelButton}
            textStyle={styles.cancelButtonText}
            onPress={() => handleCancel(item.id)}
          />
        )}
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={reservations}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchHistory} colors={[COLORS.primary]} />}
        ListEmptyComponent={!loading ? <EmptyState icon="event-busy" message="No tienes reservas en tu historial" /> : null}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  listContainer: { padding: SPACING.md },
  cardContainer: { padding: SPACING.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  fieldName: { fontSize: FONT_SIZE.lg, fontWeight: 'bold', color: COLORS.text, flex: 1 },
  status: { fontSize: FONT_SIZE.xs, fontWeight: 'bold', paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: 12, overflow: 'hidden' },
  statusActive: { backgroundColor: '#e0f2fe', color: COLORS.primary },
  statusCancelled: { backgroundColor: '#fee2e2', color: COLORS.error },
  detailText: { fontSize: FONT_SIZE.md, color: COLORS.secondary, marginBottom: SPACING.xs },
  cancelButton: { marginTop: SPACING.md, borderColor: COLORS.error, minHeight: 40, paddingVertical: SPACING.sm },
  cancelButtonText: { color: COLORS.error, fontSize: FONT_SIZE.sm }
});
