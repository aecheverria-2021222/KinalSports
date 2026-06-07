// c:\gitIN6AM\KinalSports\client-user\src\features\teams\screens\CreateTeamScreen.jsx
import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, Text, Image, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { Input } from '../../../shared/components/common/Input.jsx';
import { Button } from '../../../shared/components/common/Button.jsx';
import { useTeams } from '../hooks/useTeams.js';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme.js';

export const CreateTeamScreen = ({ navigation }) => {
  const { createTeam, loading, error } = useTeams();
  const [image, setImage] = useState(null);
  
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      sport: ''
    }
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('sport', data.sport);

    if (image) {
      const filename = image.uri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;
      
      formData.append('logo', {
        uri: Platform.OS === 'ios' ? image.uri.replace('file://', '') : image.uri,
        name: filename,
        type,
      });
    }

    const success = await createTeam(formData);
    if (success) {
      Alert.alert('Éxito', 'Equipo creado exitosamente', [
        { text: 'OK', onPress: () => navigation.goBack() }
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
        <TouchableOpacity style={styles.imagePickerContainer} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image.uri }} style={styles.imagePreview} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <MaterialIcons name="add-a-photo" size={40} color={COLORS.secondary} />
              <Text style={styles.imagePlaceholderText}>Subir Logo</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.formContainer}>
          <Controller
            control={control}
            rules={{ required: 'El nombre del equipo es requerido' }}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input label="Nombre del Equipo" placeholder="Ej: Los Invencibles" onBlur={onBlur} onChangeText={onChange} value={value} error={errors.name?.message} />
            )}
          />
          <Controller
            control={control}
            rules={{ required: 'El deporte es requerido' }}
            name="sport"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input label="Deporte" placeholder="Ej: Fútbol, Baloncesto" onBlur={onBlur} onChangeText={onChange} value={value} error={errors.sport?.message} />
            )}
          />

          <Button 
            title="Crear Equipo" 
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
  scrollContent: { flexGrow: 1, padding: SPACING.xl },
  imagePickerContainer: { alignSelf: 'center', marginBottom: SPACING.xxl, marginTop: SPACING.md },
  imagePreview: { width: 120, height: 120, borderRadius: 60 },
  imagePlaceholder: { width: 120, height: 120, borderRadius: 60, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center' },
  imagePlaceholderText: { fontSize: FONT_SIZE.xs, color: COLORS.secondary, marginTop: SPACING.xs },
  formContainer: { width: '100%' },
  submitButton: { marginTop: SPACING.lg }
});
