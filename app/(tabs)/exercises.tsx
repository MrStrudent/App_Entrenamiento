import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MOCK_EXERCISES } from '@/constants/mockData';

const MUSCLE_GROUPS = ['Todos', 'Pecho', 'Espalda', 'Piernas', 'Brazos', 'Hombros', 'Core'];

export default function ExercisesScreen() {
  const colorScheme = useColorScheme() ?? 'dark';
  const theme = Colors[colorScheme];

  const [search, setSearch] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('Todos');

  const filteredExercises = MOCK_EXERCISES.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase());
    const matchesMuscle = selectedMuscle === 'Todos' || ex.muscle === selectedMuscle;
    return matchesSearch && matchesMuscle;
  });

  const renderExercise = ({ item }: { item: typeof MOCK_EXERCISES[0] }) => (
    <View style={[styles.exerciseCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Image source={{ uri: item.image }} style={styles.exerciseImage} />
      <View style={styles.exerciseInfo}>
        <Text style={[styles.exerciseName, { color: theme.text }]}>{item.name}</Text>
        <Text style={[styles.exerciseDetail, { color: theme.textMuted }]}>
          {item.muscle} • {item.equipment}
        </Text>
      </View>
      <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.tint + '20' }]}>
        <MaterialCommunityIcons name="plus" size={24} color={theme.tint} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Ejercicios</Text>
      </View>

      <View style={styles.searchSection}>
        <View style={[styles.searchBar, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <MaterialCommunityIcons name="magnify" size={24} color={theme.textMuted} />
          <TextInput 
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Buscar ejercicio..."
            placeholderTextColor={theme.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <FlatList 
          horizontal
          showsHorizontalScrollIndicator={false}
          data={MUSCLE_GROUPS}
          keyExtractor={(item) => item}
          style={styles.filtersList}
          contentContainerStyle={{ gap: 10, paddingHorizontal: 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[
                styles.filterChip, 
                { backgroundColor: item === selectedMuscle ? theme.tint : theme.card, borderColor: theme.border }
              ]}
              onPress={() => setSelectedMuscle(item)}
            >
              <Text style={[
                styles.filterText, 
                { color: item === selectedMuscle ? '#000' : theme.text }
              ]}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={filteredExercises}
        keyExtractor={(item) => item.id}
        renderItem={renderExercise}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: theme.textMuted }]}>No se encontraron ejercicios.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 16, borderBottomWidth: 1 },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  searchSection: { paddingVertical: 16 },
  searchBar: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, paddingHorizontal: 16, height: 48, borderRadius: 24, borderWidth: 1, marginBottom: 16 },
  searchInput: { flex: 1, marginLeft: 12, fontSize: 16 },
  filtersList: { maxHeight: 40 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  filterText: { fontWeight: '600' },
  listContent: { padding: 16, paddingBottom: 40 },
  exerciseCard: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 16, borderWidth: 1, marginBottom: 12 },
  exerciseImage: { width: 60, height: 60, borderRadius: 8 },
  exerciseInfo: { flex: 1, marginLeft: 16 },
  exerciseName: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  exerciseDetail: { fontSize: 14 },
  addButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  emptyText: { textAlign: 'center', marginTop: 40, fontSize: 16 }
});
