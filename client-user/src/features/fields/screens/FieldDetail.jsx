// c:/gitIN6AM/KinalSports/client-user/src/features/fields/screens/FieldDetail.jsx
import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Button from '../../../shared/components/common/Button.jsx';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme.js';

const FieldDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { field } = route.params || {};

  if (!field) return null;

  return (
    <ScrollView style={styles.container}>
      {field.image && <Image source={{ uri: field.image }} style={styles.image} />}
      <View style={styles.content}>
        <Text style={styles.title}>{field.name}</Text>
        <Text style={styles.location}>{field.location}</Text>
        <Text style={[styles.status, { color: field.isAvailable ? COLORS.success : COLORS.error }]}>
          {field.isAvailable ? 'Disponible para reserva' : 'Actualmente no disponible'}
        </Text>
        
        {field.description && (
          <Text style={styles.description}>{field.description}</Text>
        )}

        <Button 
          title="Reservar Cancha" 
          onPress={() => navigation.navigate('CreateReservation', { field })}
          disabled={!field.isAvailable}
          style={styles.button}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  image: { width: '100%', height: 250 },
  content: { padding: SPACING.lg },
  title: { fontSize: FONT_SIZE.xxl, fontWeight: 'bold', color: COLORS.text, marginBottom: SPACING.sm },
  location: { fontSize: FONT_SIZE.md, color: COLORS.textLight, marginBottom: SPACING.md },
  status: { fontSize: FONT_SIZE.md, fontWeight: 'bold', marginBottom: SPACING.lg },
  description: { fontSize: FONT_SIZE.md, color: COLORS.text, marginBottom: SPACING.xl, lineHeight: 24 },
  button: { marginTop: SPACING.xl }
});

export default FieldDetail;
