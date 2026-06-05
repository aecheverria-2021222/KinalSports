// c:/gitIN6AM/KinalSports/client-user/src/features/reservations/screens/CreateReservation.jsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useReservations } from '../hooks/useReservations.js';
import Input from '../../../shared/components/common/Input.jsx';
import Button from '../../../shared/components/common/Button.jsx';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme.js';

const CreateReservation = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { field } = route.params || {};
  const { control, handleSubmit, formState: { errors } } = useForm();
  const { createReservation, loading, error } = useReservations();

  const onSubmit = async (data) => {
    try {
      await createReservation({ ...data, fieldId: field?._id || field?.id });
      Alert.alert('Éxito', 'Reserva creada correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (err) {
      // Error handled in hook
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Reservar {field?.name}</Text>
      
      {error && <Text style={styles.errorText}>{error}</Text>}

      <Controller
        control={control}
        name="date"
        rules={{ required: 'La fecha es requerida' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input label="Fecha (YYYY-MM-DD)" placeholder="2023-12-01" onBlur={onBlur} onChangeText={onChange} value={value} error={errors.date?.message} />
        )}
      />

      <Controller
        control={control}
        name="time"
        rules={{ required: 'La hora es requerida' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input label="Hora (HH:MM)" placeholder="14:00" onBlur={onBlur} onChangeText={onChange} value={value} error={errors.time?.message} />
        )}
      />

      <Button title="Confirmar Reserva" onPress={handleSubmit(onSubmit)} loading={loading} style={styles.submitBtn} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg },
  title: { fontSize: FONT_SIZE.xl, fontWeight: 'bold', color: COLORS.primary, marginBottom: SPACING.xl },
  errorText: { color: COLORS.error, marginBottom: SPACING.md, textAlign: 'center' },
  submitBtn: { marginTop: SPACING.lg }
});

export default CreateReservation;
