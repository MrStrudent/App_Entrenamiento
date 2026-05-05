import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Image, Modal, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { EXERCISES, Exercise } from '@/constants/exercises';

const MUSCLE_GROUPS = ['Todos', 'Pecho', 'Espalda', 'Piernas', 'Brazos', 'Hombros', 'Core'];

export default function ExercisesScreen() {
  const colorScheme = useColorScheme() ?? 'dark';
  const theme = Colors[colorScheme];

  const [search, setSearch] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('Todos');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const filteredExercises = EXERCISES.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase());
    const matchesMuscle = selectedMuscle === 'Todos' || ex.muscle === selectedMuscle;
    return matchesSearch && matchesMuscle;
  });

  const handleExercisePress = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setModalVisible(true);
  };

  const renderExercise = ({ item }: { item: Exercise }) => (
    <TouchableOpacity 
      style={[styles.exerciseCard, { backgroundColor: theme.card, borderColor: theme.border }]}
      onPress={() => handleExercisePress(item)}
    >
      <Image source={{ uri: item.image }} style={styles.exerciseImage} />
      <View style={styles.exerciseInfo}>
        <Text style={[styles.exerciseName, { color: theme.text }]}>{item.name}</Text>
        <Text style={[styles.exerciseDetail, { color: theme.textMuted }]}>
          {item.muscle} • {item.equipment}
        </Text>
      </View>
      <View style={[styles.addButton, { backgroundColor: theme.tint + '20' }]}>
        <MaterialCommunityIcons name="chevron-right" size={24} color={theme.tint} />
      </View>
    </TouchableOpacity>
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

      {/* Modal de Detalle */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
            {selectedExercise && (
              <>
                <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
                  <Text style={[styles.modalTitle, { color: theme.text }]}>{selectedExercise.name}</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                    <MaterialCommunityIcons name="close" size={24} color={theme.text} />
                  </TouchableOpacity>
                </View>
                
                <ScrollView style={styles.modalBody} contentContainerStyle={{ paddingBottom: 40 }}>
                  <Image source={{ uri: selectedExercise.image }} style={styles.modalImage} />
                  
                  <View style={styles.badgesContainer}>
                    <View style={[styles.badge, { backgroundColor: theme.tint + '20' }]}>
                      <Text style={[styles.badgeText, { color: theme.tint }]}>{selectedExercise.muscle}</Text>
                    </View>
                    <View style={[styles.badge, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]}>
                      <Text style={[styles.badgeText, { color: theme.text }]}>{selectedExercise.equipment}</Text>
                    </View>
                    <View style={[styles.badge, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]}>
                      <Text style={[styles.badgeText, { color: theme.text }]}>{selectedExercise.level}</Text>
                    </View>
                  </View>

                  <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Ejecución</Text>
                    <Text style={[styles.sectionText, { color: theme.textMuted }]}>{selectedExercise.description}</Text>
                  </View>

                  <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Músculos Principales</Text>
                    <Text style={[styles.sectionText, { color: theme.textMuted }]}>{selectedExercise.primaryMuscles.join(', ')}</Text>
                  </View>

                  <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Músculos Secundarios</Text>
                    <Text style={[styles.sectionText, { color: theme.textMuted }]}>{selectedExercise.secondaryMuscles.join(', ')}</Text>
                  </View>

                  <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Beneficios</Text>
                    <Text style={[styles.sectionText, { color: theme.textMuted }]}>{selectedExercise.benefits}</Text>
                  </View>
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>

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
  emptyText: { textAlign: 'center', marginTop: 40, fontSize: 16 },
  
  // Modal styles
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { height: '85%', borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  closeButton: { padding: 4 },
  modalBody: { flex: 1 },
  modalImage: { width: '100%', height: 200, resizeMode: 'cover' },
  badgesContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, padding: 16 },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  badgeText: { fontSize: 14, fontWeight: '600' },
  section: { paddingHorizontal: 16, paddingBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  sectionText: { fontSize: 15, lineHeight: 22 },
});
