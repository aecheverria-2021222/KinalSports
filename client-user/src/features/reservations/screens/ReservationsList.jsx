// c:/gitIN6AM/KinalSports/client-user/src/features/reservations/screens/ReservationsList.jsx
import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, Alert, RefreshControl } from 'react-native';
import { useReservations } from '../hooks/useReservations.js';
import { Card, LoadingSpinner, EmptyState } from '../../../shared/components/common/Common.jsx';
import Button from '../../../shared/components/common/Button.jsx';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme.js';

const ReservationsList = () => {
  const { reservations, loading, error, fetchHistory, cancelReservation } = useReservations();

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleCancel = (id) => {
    Alert.alert('Cancelar Reserva', '¿Estás seguro que deseas cancelar esta reserva?', [
      { text: 'No', style: 'cancel' },
      { text: 'Sí, cancelar', onPress: () => cancelReservation(id), style: 'destructive' }
    ]);
  };

  if (loading && reservations.length === 0) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <FlatList
        data={reservations}
        keyExtractor={item => item._id || item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchHistory} />}
        ListEmptyComponent={!loading && <EmptyState message="No tienes reservas en el historial" />}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <View style={styles.row}>
              {item.field?.image && <Image source={{ uri: item.field.image }} style={styles.image} />}
              <View style={styles.info}>
                <Text style={styles.title}>{item.field?.name || 'Cancha desconocida'}</Text>
                <Text style={styles.date}>Fecha: {item.date || 'Sin fecha'}</Text>
                <Text style={[styles.status, { color: item.normalizedStatus === 'CANCELLED' ? COLORS.error : COLORS.primary }]}>
                  Estado: {item.normalizedStatus}
                </Text>
              </View>
            </View>
            {item.normalizedStatus !== 'CANCELLED' && (
              <Button 
                title="Cancelar" 
                variant="secondary" 
                onPress={() => handleCancel(item._id || item.id)} 
                style={styles.cancelBtn} 
              />
            )}
          </Card>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  listContent: { padding: SPACING.md },
  errorText: { color: COLORS.error, textAlign: 'center', margin: SPACING.md },
  card: { marginBottom: SPACING.md },
  row: { flexDirection: 'row', alignItems: 'center' },
  image: { width: 80, height: 80, borderRadius: 8, marginRight: SPACING.md },
  info: { flex: 1 },
  title: { fontSize: FONT_SIZE.lg, fontWeight: 'bold', color: COLORS.text, marginBottom: SPACING.xs },
  date: { color: COLORS.textLight, marginBottom: SPACING.xs },
  status: { fontWeight: 'bold', fontSize: FONT_SIZE.sm },
  cancelBtn: { marginTop: SPACING.md }
});

export default ReservationsList;
