// c:/gitIN6AM/KinalSports/client-user/src/features/auth/screens/LoginScreen.jsx
import React from 'react';
import { View, Text, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth.js';
import Input from '../../../shared/components/common/Input.jsx';
import Button from '../../../shared/components/common/Button.jsx';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme.js';

const LoginScreen = () => {
  const { control, handleSubmit, formState: { errors } } = useForm();
  const navigation = useNavigation();
  const { handleLogin, loading, error } = useAuth();

  const onSubmit = async (data) => {
    await handleLogin(data);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../../../assets/kinal_sports.png')} 
            style={styles.logo}
            resizeMode="contain"
            defaultSource={null}
          />
          <Text style={styles.title}>Bienvenido a KinalSports</Text>
        </View>

        <View style={styles.formContainer}>
          {error && <Text style={styles.errorText}>{error}</Text>}
          
          <Controller
            control={control}
            name="emailOrUsername"
            rules={{ required: 'Este campo es requerido' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Correo o Usuario"
                placeholder="Ingresa tu correo o usuario"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.emailOrUsername?.message}
                autoCapitalize="none"
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            rules={{ required: 'La contraseña es requerida' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Contraseña"
                placeholder="Ingresa tu contraseña"
                secureTextEntry
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.password?.message}
              />
            )}
          />

          <Button 
            title="Iniciar Sesión" 
            onPress={handleSubmit(onSubmit)} 
            loading={loading}
            style={styles.loginButton}
          />

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>¿No tienes cuenta? </Text>
            <Text 
              style={styles.registerLink} 
              onPress={() => navigation.navigate('Register')}
            >
              Regístrate aquí
            </Text>
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
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  formContainer: {
    width: '100%',
  },
  errorText: {
    color: COLORS.error,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  loginButton: {
    marginTop: SPACING.md,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.lg,
  },
  registerText: {
    color: COLORS.textLight,
  },
  registerLink: {
    color: COLORS.primary,
    fontWeight: 'bold',
  }
});

export default LoginScreen;
