// c:/gitIN6AM/KinalSports/client-user/src/features/fields/screens/FieldsList.jsx
import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFields } from '../hooks/useFields.js';
import { Card, LoadingSpinner, EmptyState } from '../../../shared/components/common/Common.jsx';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme.js';

const FieldsList = () => {
  const { fields, loading, error, refetch } = useFields();
  const navigation = useNavigation();

  if (loading && fields.length === 0) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <FlatList
        data={fields}
        keyExtractor={item => item._id || item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
        ListEmptyComponent={!loading && <EmptyState message="No hay canchas disponibles" />}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('FieldDetail', { field: item })}>
            <Card style={styles.card}>
              {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
              <View style={styles.cardBody}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.location}>{item.location}</Text>
                <Text style={[styles.status, { color: item.isAvailable ? COLORS.success : COLORS.error }]}>
                  {item.isAvailable ? 'Disponible' : 'No disponible'}
                </Text>
              </View>
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
  card: { marginBottom: SPACING.md, padding: 0, overflow: 'hidden' },
  image: { width: '100%', height: 150 },
  cardBody: { padding: SPACING.md },
  title: { fontSize: FONT_SIZE.lg, fontWeight: 'bold', color: COLORS.text, marginBottom: SPACING.xs },
  location: { color: COLORS.textLight, marginBottom: SPACING.xs },
  status: { fontWeight: 'bold' }
});

export default FieldsList;
