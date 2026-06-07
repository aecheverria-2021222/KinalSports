// c:\gitIN6AM\KinalSports\client-user\src\features\auth\screens\RegisterScreen.jsx
import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, Text } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Input } from '../../../shared/components/common/Input.jsx';
import { Button } from '../../../shared/components/common/Button.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme.js';

export const RegisterScreen = ({ navigation }) => {
  const { handleRegister, loading, error } = useAuth();
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      surname: '',
      username: '',
      email: '',
      password: '',
      phone: ''
    }
  });

  const onSubmit = async (data) => {
    const success = await handleRegister(data);
    if (success) {
      Alert.alert('Éxito', 'Registro completado. Por favor, inicia sesión.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
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
        <Text style={styles.title}>Crea tu cuenta</Text>
        
        <View style={styles.formContainer}>
          <Controller
            control={control}
            rules={{ required: 'Nombre es requerido' }}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input label="Nombre" placeholder="Tu nombre" onBlur={onBlur} onChangeText={onChange} value={value} error={errors.name?.message} />
            )}
          />
          <Controller
            control={control}
            rules={{ required: 'Apellido es requerido' }}
            name="surname"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input label="Apellido" placeholder="Tu apellido" onBlur={onBlur} onChangeText={onChange} value={value} error={errors.surname?.message} />
            )}
          />
          <Controller
            control={control}
            rules={{ required: 'Usuario es requerido' }}
            name="username"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input label="Usuario" placeholder="Tu nombre de usuario" onBlur={onBlur} onChangeText={onChange} value={value} error={errors.username?.message} autoCapitalize="none" />
            )}
          />
          <Controller
            control={control}
            rules={{ 
              required: 'Email es requerido',
              pattern: { value: /\S+@\S+\.\S+/, message: 'Email inválido' }
            }}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input label="Email" placeholder="Tu correo electrónico" onBlur={onBlur} onChangeText={onChange} value={value} error={errors.email?.message} autoCapitalize="none" keyboardType="email-address" />
            )}
          />
          <Controller
            control={control}
            rules={{ required: 'Contraseña es requerida', minLength: { value: 6, message: 'Mínimo 6 caracteres' } }}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input label="Contraseña" placeholder="••••••••" onBlur={onBlur} onChangeText={onChange} value={value} error={errors.password?.message} secureTextEntry />
            )}
          />
          <Controller
            control={control}
            rules={{ required: 'Teléfono es requerido' }}
            name="phone"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input label="Teléfono" placeholder="Tu número de teléfono" onBlur={onBlur} onChangeText={onChange} value={value} error={errors.phone?.message} keyboardType="phone-pad" />
            )}
          />

          <Button 
            title="Registrarse" 
            onPress={handleSubmit(onSubmit)} 
            loading={loading}
            style={styles.registerButton}
          />
          
          <Button 
            title="Volver al Login" 
            variant="secondary"
            onPress={() => navigation.goBack()} 
            disabled={loading}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { flexGrow: 1, padding: SPACING.xl, justifyContent: 'center' },
  title: { fontSize: FONT_SIZE.title, fontWeight: 'bold', color: COLORS.primary, marginBottom: SPACING.xl, textAlign: 'center' },
  formContainer: { width: '100%' },
  registerButton: { marginTop: SPACING.md, marginBottom: SPACING.sm }
});
