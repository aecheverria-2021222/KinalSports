// c:/gitIN6AM/KinalSports/client-user/src/features/tournaments/screens/TournamentsList.jsx
import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTournaments } from '../hooks/useTournaments.js';
import { Card, LoadingSpinner, EmptyState } from '../../../shared/components/common/Common.jsx';
import Button from '../../../shared/components/common/Button.jsx';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme.js';

const TournamentsList = () => {
  const { tournaments, loading, error, fetchTournaments } = useTournaments();
  const navigation = useNavigation();

  useEffect(() => {
    fetchTournaments();
  }, [fetchTournaments]);

  if (loading && tournaments.length === 0) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      {error && <Text style={styles.errorText}>{error}</Text>}
      
      <View style={styles.header}>
        <Button 
          title="Mis Torneos" 
          variant="secondary"
          onPress={() => navigation.navigate('MyTournaments')} 
        />
      </View>

      <FlatList
        data={tournaments}
        keyExtractor={item => item._id || item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchTournaments} />}
        ListEmptyComponent={!loading && <EmptyState message="No hay torneos activos" />}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('TournamentDetail', { tournament: item })}>
            <Card style={styles.card}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.date}>Inicio: {item.startDate || 'Próximamente'}</Text>
            </Card>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: SPACING.md, backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  listContent: { padding: SPACING.md },
  errorText: { color: COLORS.error, textAlign: 'center', margin: SPACING.md },
  card: { marginBottom: SPACING.md },
  title: { fontSize: FONT_SIZE.lg, fontWeight: 'bold', color: COLORS.text, marginBottom: SPACING.xs },
  date: { color: COLORS.textLight }
});

export default TournamentsList;
