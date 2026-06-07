// c:\gitIN6AM\KinalSports\client-user\src\features\auth\screens\LoginScreen.jsx
import React from 'react';
import { View, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Input } from '../../../shared/components/common/Input.jsx';
import { Button } from '../../../shared/components/common/Button.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { COLORS, SPACING } from '../../../shared/constants/theme.js';

export const LoginScreen = ({ navigation }) => {
  const { handleLogin, loading, error } = useAuth();
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      emailOrUsername: '',
      password: ''
    }
  });

  const onSubmit = async (data) => {
    const success = await handleLogin(data);
    if (!success && error) {
      Alert.alert('Error', error);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Usamos un fallback si no existe el logo aún */}
        <View style={styles.logoContainer}>
            <Image 
              source={require('../../../../assets/icon.png')} // Usamos el icon default como logo temporal
              style={styles.logo}
              resizeMode="contain"
            />
        </View>

        <View style={styles.formContainer}>
          <Controller
            control={control}
            rules={{ required: 'Este campo es requerido' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Email o Usuario"
                placeholder="Ingresa tu email o usuario"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.emailOrUsername?.message}
                autoCapitalize="none"
              />
            )}
            name="emailOrUsername"
          />

          <Controller
            control={control}
            rules={{ required: 'La contraseña es requerida' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Contraseña"
                placeholder="••••••••"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.password?.message}
                secureTextEntry
              />
            )}
            name="password"
          />

          <Button 
            title="Iniciar Sesión" 
            onPress={handleSubmit(onSubmit)} 
            loading={loading}
            style={styles.loginButton}
          />

          <Button 
            title="¿No tienes cuenta? Regístrate" 
            variant="secondary"
            onPress={() => navigation.navigate('Register')} 
            disabled={loading}
          />
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
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  logo: {
    width: 150,
    height: 150,
  },
  formContainer: {
    width: '100%',
  },
  loginButton: {
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  }
});
