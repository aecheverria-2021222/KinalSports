// c:\gitIN6AM\KinalSports\client-user\src\features\teams\screens\TeamDetailScreen.jsx
import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { Button } from '../../../shared/components/common/Button.jsx';
import { useTeams } from '../hooks/useTeams.js';
import { useAuthStore } from '../../../shared/store/authStore.js';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme.js';

export const TeamDetailScreen = ({ route, navigation }) => {
  const { team } = route.params;
  const { joinTeam, leaveTeam, loading, error } = useTeams();
  const currentUser = useAuthStore(state => state.user);

  // Lógica básica para determinar si es miembro. (Ajustar según estructura del backend)
  const isMember = team.members?.some(m => (m._id || m.id || m) === (currentUser?._id || currentUser?.id));

  const handleJoin = async () => {
    const success = await joinTeam(team.id);
    if (success) {
      Alert.alert('Éxito', 'Te has unido al equipo');
      navigation.goBack();
    } else if (error) {
      Alert.alert('Error', error);
    }
  };

  const handleLeave = () => {
    Alert.alert('Abandonar equipo', '¿Seguro que quieres salir de este equipo?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: async () => {
          const success = await leaveTeam(team.id);
          if (success) {
            Alert.alert('Éxito', 'Has abandonado el equipo');
            navigation.goBack();
          } else if (error) {
            Alert.alert('Error', error);
          }
      }}
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        {team.logo ? (
          <Image source={{ uri: team.logo }} style={styles.logo} />
        ) : (
          <View style={styles.placeholderLogo}><Text style={styles.placeholderText}>{team.name?.[0]?.toUpperCase()}</Text></View>
        )}
        <Text style={styles.name}>{team.name}</Text>
        <Text style={styles.sport}>{team.sport}</Text>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.sectionTitle}>Miembros ({team.members?.length || 0})</Text>
        {/* Aquí se podría iterar y mostrar lista de miembros si el endpoint lo retorna poblado */}
        
        <View style={styles.actionContainer}>
          {isMember ? (
            <Button 
              title="Abandonar Equipo" 
              variant="secondary"
              onPress={handleLeave} 
              loading={loading}
              textStyle={{ color: COLORS.error }}
              style={{ borderColor: COLORS.error }}
            />
          ) : (
            <Button 
              title="Unirse al Equipo" 
              onPress={handleJoin} 
              loading={loading}
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingBottom: SPACING.xxl },
  header: { alignItems: 'center', padding: SPACING.xl, backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  logo: { width: 100, height: 100, borderRadius: 50, marginBottom: SPACING.md },
  placeholderLogo: { width: 100, height: 100, borderRadius: 50, backgroundColor: COLORS.primary, marginBottom: SPACING.md, justifyContent: 'center', alignItems: 'center' },
  placeholderText: { color: COLORS.surface, fontSize: 36, fontWeight: 'bold' },
  name: { fontSize: FONT_SIZE.xl, fontWeight: 'bold', color: COLORS.text, marginBottom: 4 },
  sport: { fontSize: FONT_SIZE.md, color: COLORS.secondary },
  detailsContainer: { padding: SPACING.lg },
  sectionTitle: { fontSize: FONT_SIZE.lg, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.md },
  actionContainer: { marginTop: SPACING.xl }
});
