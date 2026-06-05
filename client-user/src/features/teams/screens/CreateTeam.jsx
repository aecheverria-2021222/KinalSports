// c:/gitIN6AM/KinalSports/client-user/src/features/teams/screens/CreateTeam.jsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useTeams } from '../hooks/useTeams.js';
import Input from '../../../shared/components/common/Input.jsx';
import Button from '../../../shared/components/common/Button.jsx';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme.js';

const CreateTeam = () => {
  const { control, handleSubmit, formState: { errors } } = useForm();
  const navigation = useNavigation();
  const { createTeam, loading, error } = useTeams();
  const [photo, setPhoto] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0]);
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    
    if (photo) {
      const localUri = photo.uri;
      const filename = localUri.split('/').pop() || 'photo.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;
      formData.append('photo', { uri: localUri, name: filename, type });
    }

    const success = await createTeam(formData);
    if (success) {
      Alert.alert('Éxito', 'Equipo creado correctamente', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Crear Nuevo Equipo</Text>
      
      {error && <Text style={styles.errorText}>{error}</Text>}

      <Controller
        control={control}
        name="name"
        rules={{ required: 'El nombre es requerido' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input label="Nombre del Equipo" placeholder="Ej: Los Galácticos" onBlur={onBlur} onChangeText={onChange} value={value} error={errors.name?.message} />
        )}
      />

      <View style={styles.imageContainer}>
        <Button title="Seleccionar Foto" variant="secondary" onPress={pickImage} />
        {photo && <Image source={{ uri: photo.uri }} style={styles.preview} />}
      </View>

      <Button title="Crear Equipo" onPress={handleSubmit(onSubmit)} loading={loading} style={styles.submitBtn} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg },
  title: { fontSize: FONT_SIZE.xl, fontWeight: 'bold', color: COLORS.primary, marginBottom: SPACING.xl },
  errorText: { color: COLORS.error, marginBottom: SPACING.md, textAlign: 'center' },
  imageContainer: { marginVertical: SPACING.lg, alignItems: 'center' },
  preview: { width: 100, height: 100, borderRadius: 8, marginTop: SPACING.md },
  submitBtn: { marginTop: SPACING.lg }
});

export default CreateTeam;
