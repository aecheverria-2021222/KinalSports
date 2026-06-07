// c:\gitIN6AM\KinalSports\client-user\src\features\teams\screens\MyTeamsScreen.jsx
import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, Image, TouchableOpacity, RefreshControl } from 'react-native';
import { useTeams } from '../hooks/useTeams.js';
import { Card, LoadingSpinner, EmptyState } from '../../../shared/components/common/Common.jsx';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme.js';

export const MyTeamsScreen = ({ navigation }) => {
  const { myTeams, loading, error, fetchMyTeams } = useTeams();

  useEffect(() => {
    fetchMyTeams();
  }, [fetchMyTeams]);

  if (loading && !myTeams.length) return <LoadingSpinner />;
  if (error && !myTeams.length) return <EmptyState icon="error-outline" message={error} />;

  const renderItem = ({ item }) => (
    <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.navigate('TeamDetail', { team: item })}>
      <Card style={styles.cardContainer}>
        <View style={styles.row}>
          {item.logo ? (
            <Image source={{ uri: item.logo }} style={styles.logo} />
          ) : (
            <View style={styles.placeholderLogo}><Text style={styles.placeholderText}>{item.name?.[0]?.toUpperCase()}</Text></View>
          )}
          <View style={styles.infoContainer}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.sport}>{item.sport}</Text>
            <Text style={styles.role}>Miembro</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={myTeams}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchMyTeams} colors={[COLORS.primary]} />}
        ListEmptyComponent={!loading ? <EmptyState icon="groups" message="No te has unido a ningún equipo" submessage="Explora equipos en la pestaña general" /> : null}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  listContainer: { padding: SPACING.md },
  cardContainer: { padding: SPACING.md },
  row: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.border, marginRight: SPACING.md },
  placeholderLogo: { width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.primary, marginRight: SPACING.md, justifyContent: 'center', alignItems: 'center' },
  placeholderText: { color: COLORS.surface, fontSize: FONT_SIZE.xl, fontWeight: 'bold' },
  infoContainer: { flex: 1 },
  name: { fontSize: FONT_SIZE.lg, fontWeight: 'bold', color: COLORS.text, marginBottom: 4 },
  sport: { fontSize: FONT_SIZE.sm, color: COLORS.secondary },
  role: { fontSize: FONT_SIZE.xs, color: COLORS.primary, marginTop: 4, fontWeight: '600' }
});
