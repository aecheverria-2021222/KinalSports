// c:/gitIN6AM/KinalSports/client-user/src/features/tournaments/screens/TournamentDetail.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTournaments } from '../hooks/useTournaments.js';
import { useTeams } from '../../teams/hooks/useTeams.js';
import Button from '../../../shared/components/common/Button.jsx';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme.js';

const TournamentDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { tournament } = route.params || {};
  const { registerTeam, loading } = useTournaments();
  const { myTeams, fetchMyTeams } = useTeams();
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    fetchMyTeams();
  }, [fetchMyTeams]);

  if (!tournament) return null;

  const handleRegister = async () => {
    if (!selectedTeam) {
      Alert.alert('Error', 'Debes seleccionar un equipo primero');
      return;
    }
    const success = await registerTeam(tournament._id || tournament.id, selectedTeam._id || selectedTeam.id);
    if (success) {
      Alert.alert('Éxito', 'Equipo inscrito correctamente', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{tournament.name}</Text>
      <Text style={styles.subtitle}>Equipos Inscritos: {tournament.teams?.length || 0}</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Inscribir uno de tus equipos:</Text>
        {myTeams.map(team => (
          <Button 
            key={team._id || team.id}
            title={team.name}
            variant={selectedTeam?._id === team._id ? 'primary' : 'secondary'}
            onPress={() => setSelectedTeam(team)}
            style={styles.teamBtn}
          />
        ))}
      </View>

      <Button title="Inscribir al Torneo" onPress={handleRegister} loading={loading} style={styles.submitBtn} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg },
  title: { fontSize: FONT_SIZE.xxl, fontWeight: 'bold', color: COLORS.text, marginBottom: SPACING.sm },
  subtitle: { fontSize: FONT_SIZE.lg, color: COLORS.textLight, marginBottom: SPACING.xl },
  section: { marginBottom: SPACING.xl },
  sectionTitle: { fontSize: FONT_SIZE.md, fontWeight: 'bold', marginBottom: SPACING.md },
  teamBtn: { marginBottom: SPACING.sm },
  submitBtn: { marginTop: SPACING.lg }
});

export default TournamentDetail;
