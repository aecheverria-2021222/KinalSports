// c:/gitIN6AM/KinalSports/client-user/src/features/auth/screens/RegisterScreen.jsx
import React from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth.js';
import Input from '../../../shared/components/common/Input.jsx';
import Button from '../../../shared/components/common/Button.jsx';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme.js';

const RegisterScreen = () => {
  const { control, handleSubmit, formState: { errors } } = useForm();
  const navigation = useNavigation();
  const { handleRegister, loading, error } = useAuth();

  const onSubmit = async (data) => {
    const success = await handleRegister(data);
    if (success) {
      Alert.alert('Éxito', 'Cuenta creada correctamente', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Crear Cuenta</Text>
        <Text style={styles.subtitle}>Únete a KinalSports</Text>

        <View style={styles.formContainer}>
          {error && <Text style={styles.errorText}>{error}</Text>}

          <Controller
            control={control}
            name="name"
            rules={{ required: 'El nombre es requerido' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input label="Nombre" placeholder="Tu nombre" onBlur={onBlur} onChangeText={onChange} value={value} error={errors.name?.message} />
            )}
          />

          <Controller
            control={control}
            name="surname"
            rules={{ required: 'El apellido es requerido' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input label="Apellido" placeholder="Tu apellido" onBlur={onBlur} onChangeText={onChange} value={value} error={errors.surname?.message} />
            )}
          />

          <Controller
            control={control}
            name="username"
            rules={{ required: 'El nombre de usuario es requerido' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input label="Usuario" placeholder="Nombre de usuario" autoCapitalize="none" onBlur={onBlur} onChangeText={onChange} value={value} error={errors.username?.message} />
            )}
          />

          <Controller
            control={control}
            name="email"
            rules={{ 
              required: 'El correo es requerido',
              pattern: { value: /\S+@\S+\.\S+/, message: 'Correo inválido' }
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input label="Correo Electrónico" placeholder="tu@correo.com" keyboardType="email-address" autoCapitalize="none" onBlur={onBlur} onChangeText={onChange} value={value} error={errors.email?.message} />
            )}
          />

          <Controller
            control={control}
            name="password"
            rules={{ required: 'La contraseña es requerida', minLength: { value: 6, message: 'Mínimo 6 caracteres' } }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input label="Contraseña" placeholder="Tu contraseña" secureTextEntry onBlur={onBlur} onChangeText={onChange} value={value} error={errors.password?.message} />
            )}
          />

          <Controller
            control={control}
            name="phone"
            rules={{ required: 'El teléfono es requerido' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input label="Teléfono" placeholder="Tu número" keyboardType="phone-pad" onBlur={onBlur} onChangeText={onChange} value={value} error={errors.phone?.message} />
            )}
          />

          <Button title="Registrarse" onPress={handleSubmit(onSubmit)} loading={loading} style={styles.registerButton} />

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
            <Text style={styles.loginLink} onPress={() => navigation.navigate('Login')}>Inicia Sesión</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.lg,
    justifyContent: 'center',
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textLight,
    marginBottom: SPACING.xl,
  },
  formContainer: {
    width: '100%',
  },
  errorText: {
    color: COLORS.error,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  registerButton: {
    marginTop: SPACING.md,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  loginText: {
    color: COLORS.textLight,
  },
  loginLink: {
    color: COLORS.primary,
    fontWeight: 'bold',
  }
});

export default RegisterScreen;
