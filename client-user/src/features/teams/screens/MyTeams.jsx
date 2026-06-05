// c:/gitIN6AM/KinalSports/client-user/src/features/teams/screens/MyTeams.jsx
import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTeams } from '../hooks/useTeams.js';
import { Card, LoadingSpinner, EmptyState } from '../../../shared/components/common/Common.jsx';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme.js';

const MyTeams = () => {
  const { myTeams, loading, error, fetchMyTeams } = useTeams();
  const navigation = useNavigation();

  useEffect(() => {
    fetchMyTeams();
  }, [fetchMyTeams]);

  if (loading && myTeams.length === 0) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <FlatList
        data={myTeams}
        keyExtractor={item => item._id || item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchMyTeams} />}
        ListEmptyComponent={!loading && <EmptyState message="No perteneces a ningún equipo" />}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('TeamDetail', { team: item })}>
            <Card style={styles.card}>
              <Text style={styles.title}>{item.name}</Text>
            </Card>
          </TouchableOpacity>
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

export default MyTeams;
