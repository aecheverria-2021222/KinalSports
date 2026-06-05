// c:/gitIN6AM/KinalSports/client-user/src/features/tournaments/screens/MyTournaments.jsx
import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useTournaments } from '../hooks/useTournaments.js';
import { Card, LoadingSpinner, EmptyState } from '../../../shared/components/common/Common.jsx';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme.js';

const MyTournaments = () => {
  const { myTournaments, loading, error, fetchMyTournaments } = useTournaments();

  useEffect(() => {
    fetchMyTournaments();
  }, [fetchMyTournaments]);

  if (loading && myTournaments.length === 0) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <FlatList
        data={myTournaments}
        keyExtractor={item => item._id || item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchMyTournaments} />}
        ListEmptyComponent={!loading && <EmptyState message="No estás en ningún torneo" />}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Text style={styles.title}>{item.name}</Text>
          </Card>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  listContent: { padding: SPACING.md },
  errorText: { color: COLORS.error, textAlign: 'center', margin: SPACING.md },
  card: { marginBottom: SPACING.md },
  title: { fontSize: FONT_SIZE.lg, fontWeight: 'bold', color: COLORS.text }
});

export default MyTournaments;
