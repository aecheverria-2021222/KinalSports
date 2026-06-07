// c:\gitIN6AM\KinalSports\client-user\src\features\fields\screens\FieldDetailScreen.jsx
import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { Button } from '../../../shared/components/common/Button.jsx';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme.js';

export const FieldDetailScreen = ({ route, navigation }) => {
  const { field } = route.params;

  const handleReserve = () => {
    // Navegar al stack de reservas pasando la cancha
    navigation.navigate('Reservations', { 
      screen: 'CreateReservation', 
      params: { fieldId: field.id, fieldName: field.name } 
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {field.image ? (
        <Image source={{ uri: field.image }} style={styles.image} />
      ) : (
        <View style={styles.placeholderImage} />
      )}
      <View style={styles.detailsContainer}>
        <Text style={styles.name}>{field.name}</Text>
        <Text style={styles.location}>{field.location}</Text>
        <View style={styles.statusBadge}>
            <Text style={[styles.status, { color: field.isAvailable ? COLORS.success : COLORS.error }]}>
              {field.isAvailable ? 'Disponible para reserva' : 'Actualmente no disponible'}
            </Text>
        </View>

        <View style={styles.actionContainer}>
          <Button 
            title="Reservar Cancha" 
            onPress={handleReserve} 
            disabled={!field.isAvailable}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingBottom: SPACING.xxl },
  image: { width: '100%', height: 250, backgroundColor: COLORS.border },
  placeholderImage: { width: '100%', height: 250, backgroundColor: COLORS.border },
  detailsContainer: { padding: SPACING.lg, backgroundColor: COLORS.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: -20 },
  name: { fontSize: FONT_SIZE.xl, fontWeight: 'bold', color: COLORS.text, marginBottom: SPACING.xs },
  location: { fontSize: FONT_SIZE.md, color: COLORS.secondary, marginBottom: SPACING.md },
  statusBadge: { backgroundColor: COLORS.background, padding: SPACING.sm, borderRadius: 8, alignSelf: 'flex-start', marginBottom: SPACING.xl },
  status: { fontSize: FONT_SIZE.sm, fontWeight: '600' },
  actionContainer: { marginTop: SPACING.lg }
});
