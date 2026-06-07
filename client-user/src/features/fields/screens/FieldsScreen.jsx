// c:\gitIN6AM\KinalSports\client-user\src\features\fields\screens\FieldsScreen.jsx
import React from 'react';
import { View, FlatList, StyleSheet, Text, Image, TouchableOpacity, RefreshControl } from 'react-native';
import { useFields } from '../hooks/useFields.js';
import { Card, LoadingSpinner, EmptyState } from '../../../shared/components/common/Common.jsx';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme.js';

export const FieldsScreen = ({ navigation }) => {
  const { fields, loading, error, refetch } = useFields();

  if (loading && !fields.length) return <LoadingSpinner />;
  if (error && !fields.length) return <EmptyState icon="error-outline" message={error} />;

  const renderItem = ({ item }) => (
    <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.navigate('FieldDetail', { field: item })}>
      <Card style={styles.cardContainer}>
        {item.image ? (
           <Image source={{ uri: item.image }} style={styles.image} />
        ) : (
           <View style={styles.placeholderImage} />
        )}
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.location}>{item.location}</Text>
          <Text style={[styles.status, { color: item.isAvailable ? COLORS.success : COLORS.error }]}>
            {item.isAvailable ? 'Disponible' : 'No disponible'}
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={fields}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} colors={[COLORS.primary]} />
        }
        ListEmptyComponent={!loading ? <EmptyState icon="sports-soccer" message="No hay canchas disponibles" /> : null}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  listContainer: { padding: SPACING.md },
  cardContainer: { padding: 0, overflow: 'hidden' },
  image: { width: '100%', height: 180, backgroundColor: COLORS.border },
  placeholderImage: { width: '100%', height: 180, backgroundColor: COLORS.border },
  infoContainer: { padding: SPACING.md },
  name: { fontSize: FONT_SIZE.lg, fontWeight: 'bold', color: COLORS.text, marginBottom: 4 },
  location: { fontSize: FONT_SIZE.sm, color: COLORS.secondary, marginBottom: 8 },
  status: { fontSize: FONT_SIZE.sm, fontWeight: '600' }
});
