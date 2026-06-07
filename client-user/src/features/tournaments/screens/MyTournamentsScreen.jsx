// c:\gitIN6AM\KinalSports\client-user\src\features\tournaments\screens\MyTournamentsScreen.jsx
import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { useTournaments } from '../hooks/useTournaments.js';
import { Card, LoadingSpinner, EmptyState } from '../../../shared/components/common/Common.jsx';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme.js';

export const MyTournamentsScreen = ({ navigation }) => {
  const { myTournaments, loading, error, fetchMyTournaments } = useTournaments();

  useEffect(() => {
    fetchMyTournaments();
  }, [fetchMyTournaments]);

  if (loading && !myTournaments.length) return <LoadingSpinner />;
  if (error && !myTournaments.length) return <EmptyState icon="error-outline" message={error} />;

  const renderItem = ({ item }) => (
    <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.navigate('TournamentDetail', { tournament: item })}>
      <Card style={styles.cardContainer}>
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.sport}>{item.sport}</Text>
          <View style={styles.statusBadge}>
            <Text style={[styles.status, { color: COLORS.primary }]}>Inscrito</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={myTournaments}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchMyTournaments} colors={[COLORS.primary]} />}
        ListEmptyComponent={!loading ? <EmptyState icon="emoji-events" message="No estás inscrito en ningún torneo" /> : null}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  listContainer: { padding: SPACING.md },
  cardContainer: { padding: SPACING.md, borderLeftWidth: 4, borderLeftColor: COLORS.success },
  infoContainer: { flex: 1 },
  name: { fontSize: FONT_SIZE.lg, fontWeight: 'bold', color: COLORS.text, marginBottom: 4 },
  sport: { fontSize: FONT_SIZE.sm, color: COLORS.secondary, marginBottom: 8 },
  statusBadge: { backgroundColor: '#e0f2fe', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start' },
  status: { fontSize: FONT_SIZE.xs, fontWeight: 'bold' }
});
