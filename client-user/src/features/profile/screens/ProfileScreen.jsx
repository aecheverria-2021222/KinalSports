// c:\gitIN6AM\KinalSports\client-user\src\features\profile\screens\ProfileScreen.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Alert, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { MaterialIcons } from '@expo/vector-icons';
import { userClient } from '../../../shared/api/userClient.js';
import { useAuthStore } from '../../../shared/store/authStore.js';
import { Input } from '../../../shared/components/common/Input.jsx';
import { Button } from '../../../shared/components/common/Button.jsx';
import { LoadingSpinner } from '../../../shared/components/common/Common.jsx';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme.js';

export const ProfileScreen = () => {
  const { logout, updateUser, user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarUri, setAvatarUri] = useState(null);

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      displayName: '',
      phone: '',
      favoriteSports: ''
    }
  });

  const loadProfile = async () => {
    setLoading(true);
    try {
      const response = await userClient.get('/users/profile');
      const data = response.data?.data || response.data;
      
      setAvatarUri(data.avatar);
      reset({
        displayName: data.displayName || data.name || '',
        phone: data.phone || '',
        favoriteSports: Array.isArray(data.favoriteSports) ? data.favoriteSports.join(', ') : (data.favoriteSports || '')
      });
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSave = async (formData) => {
    setSaving(true);
    try {
      const payload = {
        ...formData,
        favoriteSports: formData.favoriteSports.split(',').map(s => s.trim()).filter(s => s)
      };

      await userClient.put('/users/profile', payload);
      updateUser(payload);
      setIsEditing(false);
      Alert.alert('Éxito', 'Perfil actualizado');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'No se pudo actualizar el perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoutClick = () => {
    Alert.alert('Cerrar Sesión', '¿Estás seguro que deseas cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sí, Cerrar', style: 'destructive', onPress: logout }
    ]);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatar} />
            ) : (
              <Image source={require('../../../../assets/icon.png')} style={styles.avatar} /> // Fallback temporario
            )}
            {isEditing && (
              <TouchableOpacity style={styles.editAvatarBadge}>
                <MaterialIcons name="edit" size={16} color={COLORS.surface} />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.username}>@{user?.username || 'usuario'}</Text>
          <Text style={styles.email}>{user?.email || 'email@kinalsports.com'}</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Información Personal</Text>
            <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
              <Text style={styles.editText}>{isEditing ? 'Cancelar' : 'Editar'}</Text>
            </TouchableOpacity>
          </View>

          <Controller
            control={control}
            name="displayName"
            render={({ field: { onChange, value } }) => (
              <Input label="Nombre a mostrar" value={value} onChangeText={onChange} editable={isEditing} />
            )}
          />

          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, value } }) => (
              <Input label="Teléfono" value={value} onChangeText={onChange} editable={isEditing} keyboardType="phone-pad" />
            )}
          />

          <Controller
            control={control}
            name="favoriteSports"
            render={({ field: { onChange, value } }) => (
              <Input 
                label="Deportes Favoritos (separados por coma)" 
                value={value} 
                onChangeText={onChange} 
                editable={isEditing} 
                placeholder="Ej: Fútbol, Baloncesto"
              />
            )}
          />

          {isEditing && (
            <Button 
              title="Guardar Cambios" 
              onPress={handleSubmit(handleSave)} 
              loading={saving}
              style={styles.saveButton}
            />
          )}
        </View>

        <View style={styles.logoutContainer}>
          <Button 
            title="Cerrar Sesión" 
            variant="secondary"
            onPress={handleLogoutClick}
            textStyle={{ color: COLORS.error }}
            style={{ borderColor: COLORS.error }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { flexGrow: 1, padding: SPACING.lg },
  header: { alignItems: 'center', marginBottom: SPACING.xl, marginTop: SPACING.md },
  avatarContainer: { position: 'relative', marginBottom: SPACING.sm },
  avatar: { width: 120, height: 120, borderRadius: 60, backgroundColor: COLORS.border },
  editAvatarBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: COLORS.primary, padding: 8, borderRadius: 20, borderWidth: 2, borderColor: COLORS.surface },
  username: { fontSize: FONT_SIZE.xl, fontWeight: 'bold', color: COLORS.text, marginBottom: 4 },
  email: { fontSize: FONT_SIZE.sm, color: COLORS.secondary },
  formContainer: { backgroundColor: COLORS.surface, padding: SPACING.lg, borderRadius: 16, marginBottom: SPACING.xl },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  sectionTitle: { fontSize: FONT_SIZE.lg, fontWeight: 'bold', color: COLORS.text },
  editText: { fontSize: FONT_SIZE.md, color: COLORS.primary, fontWeight: '600' },
  saveButton: { marginTop: SPACING.md },
  logoutContainer: { marginTop: 'auto', paddingBottom: SPACING.xl }
});
