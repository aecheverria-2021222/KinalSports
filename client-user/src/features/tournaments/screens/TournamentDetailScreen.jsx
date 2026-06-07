// c:\gitIN6AM\KinalSports\client-user\src\features\tournaments\screens\TournamentDetailScreen.jsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Modal, TouchableOpacity } from 'react-native';
import { Button } from '../../../shared/components/common/Button.jsx';
import { useTournaments } from '../hooks/useTournaments.js';
import { useTeams } from '../../teams/hooks/useTeams.js'; // Para seleccionar equipo propio
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme.js';

export const TournamentDetailScreen = ({ route, navigation }) => {
  const { tournament } = route.params;
  const { registerInTournament, loading, error } = useTournaments();
  const { myTeams, loading: loadingTeams } = useTeams();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);

  // Filtrar equipos propios que coincidan con el deporte del torneo
  const eligibleTeams = myTeams.filter(t => t.sport?.toLowerCase() === tournament.sport?.toLowerCase());

  const handleRegisterClick = () => {
    if (eligibleTeams.length === 0) {
      Alert.alert('Aviso', 'No tienes equipos elegibles para este torneo (debes tener un equipo del mismo deporte).');
      return;
    }
    setModalVisible(true);
  };

  const confirmRegistration = async () => {
    if (!selectedTeam) return;
    setModalVisible(false);
    const success = await registerInTournament(tournament.id, selectedTeam.id);
    if (success) {
      Alert.alert('Éxito', 'Equipo registrado en el torneo exitosamente');
      navigation.goBack();
    } else if (error) {
      Alert.alert('Error', error);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.name}>{tournament.name}</Text>
        <Text style={styles.sport}>{tournament.sport}</Text>
        <Text style={styles.dates}>
            {tournament.startDate ? new Date(tournament.startDate).toLocaleDateString() : ''} - {tournament.endDate ? new Date(tournament.endDate).toLocaleDateString() : ''}
        </Text>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.description}>{tournament.description || 'Sin descripción.'}</Text>
        
        <View style={styles.actionContainer}>
          <Button 
            title="Inscribir Equipo" 
            onPress={handleRegisterClick} 
            loading={loading || loadingTeams}
          />
        </View>
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecciona un equipo</Text>
            <ScrollView style={styles.teamList}>
              {eligibleTeams.map(team => (
                <TouchableOpacity 
                  key={team.id} 
                  style={[styles.teamOption, selectedTeam?.id === team.id && styles.teamOptionSelected]}
                  onPress={() => setSelectedTeam(team)}
                >
                  <Text style={[styles.teamOptionText, selectedTeam?.id === team.id && styles.teamOptionTextSelected]}>
                    {team.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.modalActions}>
              <Button title="Cancelar" variant="secondary" onPress={() => setModalVisible(false)} style={styles.modalButton} />
              <Button title="Confirmar" onPress={confirmRegistration} style={styles.modalButton} disabled={!selectedTeam} />
            </View>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingBottom: SPACING.xxl },
  header: { padding: SPACING.xl, backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  name: { fontSize: FONT_SIZE.xl, fontWeight: 'bold', color: COLORS.text, marginBottom: SPACING.sm },
  sport: { fontSize: FONT_SIZE.md, color: COLORS.primary, marginBottom: SPACING.xs, fontWeight: '600' },
  dates: { fontSize: FONT_SIZE.sm, color: COLORS.secondary },
  detailsContainer: { padding: SPACING.lg },
  description: { fontSize: FONT_SIZE.md, color: COLORS.text, lineHeight: 24 },
  actionContainer: { marginTop: SPACING.xl },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: COLORS.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: SPACING.xl, maxHeight: '80%' },
  modalTitle: { fontSize: FONT_SIZE.lg, fontWeight: 'bold', marginBottom: SPACING.md, color: COLORS.text },
  teamList: { maxHeight: 300, marginBottom: SPACING.lg },
  teamOption: { padding: SPACING.md, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.sm },
  teamOptionSelected: { borderColor: COLORS.primary, backgroundColor: '#f0f9ff' },
  teamOptionText: { fontSize: FONT_SIZE.md, color: COLORS.text },
  teamOptionTextSelected: { color: COLORS.primary, fontWeight: 'bold' },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between' },
  modalButton: { flex: 1, marginHorizontal: SPACING.xs }
});
