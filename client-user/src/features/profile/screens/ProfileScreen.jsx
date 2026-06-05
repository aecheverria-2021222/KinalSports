// c:/gitIN6AM/KinalSports/client-user/src/features/profile/screens/ProfileScreen.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import userClient from '../../../shared/api/userClient.js';
import { useAuthStore } from '../../../shared/store/authStore.js';
import { useAuth } from '../../auth/hooks/useAuth.js';
import Input from '../../../shared/components/common/Input.jsx';
import Button from '../../../shared/components/common/Button.jsx';
import { Card, LoadingSpinner } from '../../../shared/components/common/Common.jsx';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme.js';

const ProfileScreen = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState(null);
  
  const { updateUser } = useAuthStore();
  const { logout } = useAuth();
  
  const { control, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userClient.get('/users/profile');
      const data = response.data?.data || response.data;
      setProfileData(data);
      reset({
        displayName: data.displayName || data.name || '',
        phone: data.phone || '',
        favoriteSports: data.favoriteSports ? data.favoriteSports.join(', ') : ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Error al obtener perfil');
    } finally {
      setLoading(false);
    }
  }, [reset]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const sportsArray = data.favoriteSports
        ? data.favoriteSports.split(',').map(s => s.trim()).filter(s => s)
        : [];
        
      const payload = {
        displayName: data.displayName,
        phone: data.phone,
        favoriteSports: sportsArray
      };

      const response = await userClient.put('/users/profile', payload);
      const updatedUser = response.data?.data || response.data;
      
      updateUser(updatedUser);
      setProfileData(updatedUser);
      setIsEditing(false);
      Alert.alert('Éxito', 'Perfil actualizado correctamente');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Cerrar Sesión', '¿Estás seguro que deseas salir?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', onPress: logout, style: 'destructive' }
    ]);
  };

  if (loading && !profileData) return <LoadingSpinner />;

  const avatarUri = profileData?.photo?.startsWith('http') 
    ? { uri: profileData.photo } 
    : require('../../../../assets/avatarDefault.png');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {error && <Text style={styles.errorText}>{error}</Text>}
      
      <Card style={styles.card}>
        <View style={styles.header}>
          <Image source={avatarUri} style={styles.avatar} defaultSource={null} />
          <Text style={styles.emailText}>{profileData?.email}</Text>
        </View>

        <Controller
          control={control}
          name="displayName"
          rules={{ required: 'El nombre es requerido' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Nombre a mostrar"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.displayName?.message}
              editable={isEditing}
            />
          )}
        />

        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Teléfono"
              keyboardType="phone-pad"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.phone?.message}
              editable={isEditing}
            />
          )}
        />

        <Controller
          control={control}
          name="favoriteSports"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Deportes favoritos (separados por coma)"
              placeholder="Fútbol, Baloncesto..."
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.favoriteSports?.message}
              editable={isEditing}
            />
          )}
        />

        {isEditing ? (
          <View style={styles.actionRow}>
            <Button title="Cancelar" variant="secondary" onPress={() => setIsEditing(false)} style={styles.actionBtn} disabled={loading} />
            <Button title="Guardar" onPress={handleSubmit(onSubmit)} style={styles.actionBtn} loading={loading} />
          </View>
        ) : (
          <Button title="Editar Perfil" onPress={() => setIsEditing(true)} style={styles.editBtn} />
        )}
      </Card>

      <Button title="Cerrar sesión" variant="secondary" onPress={handleLogout} style={styles.logoutBtn} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md },
  errorText: { color: COLORS.error, textAlign: 'center', marginBottom: SPACING.md },
  card: { padding: SPACING.lg },
  header: { alignItems: 'center', marginBottom: SPACING.xl },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: SPACING.sm, backgroundColor: COLORS.border },
  emailText: { fontSize: FONT_SIZE.md, color: COLORS.textLight, fontWeight: '500' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: SPACING.md },
  actionBtn: { flex: 0.48 },
  editBtn: { marginTop: SPACING.md },
  logoutBtn: { marginTop: SPACING.xl, alignSelf: 'center', width: '100%' }
});

export default ProfileScreen;
