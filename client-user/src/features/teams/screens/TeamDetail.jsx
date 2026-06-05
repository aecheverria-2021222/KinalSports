// c:/gitIN6AM/KinalSports/client-user/src/features/teams/screens/TeamDetail.jsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTeams } from '../hooks/useTeams.js';
import Button from '../../../shared/components/common/Button.jsx';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme.js';
import { useAuthStore } from '../../../shared/store/authStore.js';

const TeamDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { team } = route.params || {};
  const { joinTeam, leaveTeam, loading } = useTeams();
  const user = useAuthStore(state => state.user);

  if (!team) return null;

  const isMember = team.members?.some(m => m._id === user?._id || m === user?._id);

  const handleJoin = async () => {
    const success = await joinTeam(team._id || team.id);
    if (success) {
      Alert.alert('Éxito', 'Te has unido al equipo', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    }
  };

  const handleLeave = async () => {
    const success = await leaveTeam(team._id || team.id);
    if (success) {
      Alert.alert('Éxito', 'Has salido del equipo', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{team.name}</Text>
      <Text style={styles.subtitle}>Miembros ({team.members?.length || 0})</Text>
      
      {team.members?.map((member, idx) => (
        <Text key={idx} style={styles.memberText}>• {member.name || member.username || 'Usuario'}</Text>
      ))}

      <View style={styles.actions}>
        {isMember ? (
          <Button title="Salir del Equipo" variant="secondary" onPress={handleLeave} loading={loading} />
        ) : (
          <Button title="Unirse al Equipo" onPress={handleJoin} loading={loading} />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg },
  title: { fontSize: FONT_SIZE.xxl, fontWeight: 'bold', color: COLORS.text, marginBottom: SPACING.lg },
  subtitle: { fontSize: FONT_SIZE.lg, fontWeight: 'bold', color: COLORS.textLight, marginBottom: SPACING.sm },
  memberText: { fontSize: FONT_SIZE.md, color: COLORS.text, marginBottom: SPACING.xs },
  actions: { marginTop: SPACING.xl }
});

export default TeamDetail;
