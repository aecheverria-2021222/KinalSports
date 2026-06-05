// c:/gitIN6AM/KinalSports/client-user/src/features/teams/screens/TeamsList.jsx
import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTeams } from '../hooks/useTeams.js';
import { Card, LoadingSpinner, EmptyState } from '../../../shared/components/common/Common.jsx';
import Button from '../../../shared/components/common/Button.jsx';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme.js';

const TeamsList = () => {
  const { teams, loading, error, fetchTeams } = useTeams();
  const navigation = useNavigation();

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  if (loading && teams.length === 0) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      {error && <Text style={styles.errorText}>{error}</Text>}
      
      <View style={styles.header}>
        <Button 
          title="Mis Equipos" 
          variant="secondary"
          onPress={() => navigation.navigate('MyTeams')} 
          style={styles.headerBtn}
        />
        <Button 
          title="Crear Equipo" 
          onPress={() => navigation.navigate('CreateTeam')} 
          style={styles.headerBtn}
        />
      </View>

      <FlatList
        data={teams}
        keyExtractor={item => item._id || item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchTeams} />}
        ListEmptyComponent={!loading && <EmptyState message="No hay equipos registrados" />}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('TeamDetail', { team: item })}>
            <Card style={styles.card}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.members}>Miembros: {item.members?.length || 0}</Text>
            </Card>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: SPACING.md, backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerBtn: { flex: 0.48, paddingVertical: SPACING.sm },
  listContent: { padding: SPACING.md },
  errorText: { color: COLORS.error, textAlign: 'center', margin: SPACING.md },
  card: { marginBottom: SPACING.md },
  title: { fontSize: FONT_SIZE.lg, fontWeight: 'bold', color: COLORS.text, marginBottom: SPACING.xs },
  members: { color: COLORS.textLight }
});

export default TeamsList;
