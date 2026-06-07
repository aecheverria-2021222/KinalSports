// c:\gitIN6AM\KinalSports\client-user\src\features\reservations\screens\CreateReservationScreen.jsx
import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, Text } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Input } from '../../../shared/components/common/Input.jsx';
import { Button } from '../../../shared/components/common/Button.jsx';
import { useReservations } from '../hooks/useReservations.js';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme.js';

export const CreateReservationScreen = ({ route, navigation }) => {
  const { fieldId, fieldName } = route.params || {};
  const { createReservation, loading, error } = useReservations();
  
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      reservationDate: '', // Ej: YYYY-MM-DD
      startTime: '',       // Ej: 14:00
      endTime: ''          // Ej: 15:00
    }
  });

  const onSubmit = async (data) => {
    if (!fieldId) {
      Alert.alert('Error', 'No se ha seleccionado una cancha.');
      return;
    }

    const payload = {
      fieldId,
      ...data
    };

    const success = await createReservation(payload);
    if (success) {
      Alert.alert('Éxito', 'Reserva creada exitosamente', [
        { text: 'Ir a mis reservas', onPress: () => navigation.navigate('Reservations', { screen: 'ReservationsList' }) }
      ]);
    } else if (error) {
      Alert.alert('Error', error);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Nueva Reserva</Text>
        <Text style={styles.subtitle}>Cancha: {fieldName || 'Seleccionada'}</Text>

        <View style={styles.formContainer}>
          <Controller
            control={control}
            rules={{ required: 'La fecha es requerida' }}
            name="reservationDate"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input label="Fecha (YYYY-MM-DD)" placeholder="Ej: 2024-12-01" onBlur={onBlur} onChangeText={onChange} value={value} error={errors.reservationDate?.message} />
            )}
          />
          <Controller
            control={control}
            rules={{ required: 'Hora de inicio requerida' }}
            name="startTime"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input label="Hora de Inicio (HH:MM)" placeholder="Ej: 14:00" onBlur={onBlur} onChangeText={onChange} value={value} error={errors.startTime?.message} />
            )}
          />
          <Controller
            control={control}
            rules={{ required: 'Hora de fin requerida' }}
            name="endTime"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input label="Hora de Fin (HH:MM)" placeholder="Ej: 15:00" onBlur={onBlur} onChangeText={onChange} value={value} error={errors.endTime?.message} />
            )}
          />

          <Button 
            title="Confirmar Reserva" 
            onPress={handleSubmit(onSubmit)} 
            loading={loading}
            style={styles.submitButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { flexGrow: 1, padding: SPACING.xl, justifyContent: 'center' },
  title: { fontSize: FONT_SIZE.xxl, fontWeight: 'bold', color: COLORS.text, marginBottom: SPACING.xs, textAlign: 'center' },
  subtitle: { fontSize: FONT_SIZE.md, color: COLORS.primary, marginBottom: SPACING.xl, textAlign: 'center', fontWeight: '500' },
  formContainer: { width: '100%' },
  submitButton: { marginTop: SPACING.md }
});
