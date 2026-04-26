import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MOCK_EXERCISES } from '@/constants/mockData';
import { Colors } from '@/constants/theme';
import { Exercise, useWorkout } from '@/context/WorkoutContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function WorkoutScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'dark';
  const theme = Colors[colorScheme];

  const {
    activeWorkout,
    startWorkout,
    finishWorkout,
    cancelWorkout,
    addExercise,
    addSet,
    updateSet,
    toggleSetComplete
  } = useWorkout();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Timer logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (activeWorkout) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - activeWorkout.startTime) / 1000));
      }, 1000);
    } else {
      setElapsedTime(0);
    }
    return () => clearInterval(interval);
  }, [activeWorkout]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleFinish = () => {
    finishWorkout();
    router.navigate('/(tabs)/history');
  };

  const renderExerciseItem = ({ item }: { item: Exercise }) => (
    <TouchableOpacity
      style={[styles.modalExerciseItem, { backgroundColor: theme.background, borderColor: theme.border }]}
      onPress={() => {
        addExercise(item);
        setIsModalVisible(false);
      }}
    >
      <Image source={{ uri: item.image }} style={styles.modalExerciseImage} />
      <View style={styles.modalExerciseInfo}>
        <Text style={[styles.modalExerciseName, { color: theme.text }]}>{item.name}</Text>
        <Text style={[styles.modalExerciseMuscle, { color: theme.textMuted }]}>{item.muscle}</Text>
      </View>
      <MaterialCommunityIcons name="plus-circle-outline" size={24} color={theme.tint} />
    </TouchableOpacity>
  );

  if (!activeWorkout) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent, { backgroundColor: theme.background }]}>
        <MaterialCommunityIcons name="weight-lifter" size={64} color={theme.tint} style={{ marginBottom: 24 }} />
        <Text style={[styles.emptyStateTitle, { color: theme.text }]}>¿Listo para entrenar?</Text>
        <Text style={[styles.emptyStateSubtitle, { color: theme.textMuted }]}>Comienza un nuevo entrenamiento vacío y registra tus progresos.</Text>

        <TouchableOpacity
          style={[styles.startButton, { backgroundColor: theme.tint }]}
          onPress={() => startWorkout('Entrenamiento Libre')}
        >
          <Text style={styles.startButtonText}>Iniciar Entrenamiento</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>{activeWorkout.name}</Text>
        <Text style={[styles.headerSubtitle, { color: theme.textMuted }]}>{formatTime(elapsedTime)}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {activeWorkout.exercises.map((item, index) => (
          <View key={item.id} style={[styles.exerciseContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.exerciseHeader}>
              <Text style={[styles.exerciseTitle, { color: theme.text }]}>
                {index + 1}. {item.exercise.name}
              </Text>
              <TouchableOpacity>
                <MaterialCommunityIcons name="dots-vertical" size={24} color={theme.textMuted} />
              </TouchableOpacity>
            </View>

            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.columnHeader, { flex: 0.5, color: theme.textMuted }]}>Set</Text>
              <Text style={[styles.columnHeader, { flex: 1, color: theme.textMuted }]}>kg</Text>
              <Text style={[styles.columnHeader, { flex: 1, color: theme.textMuted }]}>Reps</Text>
              <Text style={[styles.columnHeader, { flex: 0.5, textAlign: 'center', color: theme.textMuted }]}>✓</Text>
            </View>

            {/* Sets */}
            {item.sets.map((set, setIndex) => (
              <View key={set.id} style={[styles.setRow, set.completed && { backgroundColor: theme.tint + '15' }]}>
                <Text style={[styles.setNumber, { flex: 0.5, color: theme.text }]}>{setIndex + 1}</Text>

                <View style={[styles.inputContainer, { flex: 1, backgroundColor: theme.background }]}>
                  <TextInput
                    style={[styles.input, { color: theme.text }]}
                    value={set.weight.toString()}
                    onChangeText={(val) => updateSet(item.id, set.id, 'weight', Number(val) || 0)}
                    keyboardType="numeric"
                  />
                </View>

                <View style={[styles.inputContainer, { flex: 1, backgroundColor: theme.background }]}>
                  <TextInput
                    style={[styles.input, { color: theme.text }]}
                    value={set.reps.toString()}
                    onChangeText={(val) => updateSet(item.id, set.id, 'reps', Number(val) || 0)}
                    keyboardType="numeric"
                  />
                </View>

                <TouchableOpacity
                  style={[
                    styles.checkButton,
                    { flex: 0.5, backgroundColor: set.completed ? theme.tint : theme.border }
                  ]}
                  onPress={() => toggleSetComplete(item.id, set.id)}
                >
                  <MaterialCommunityIcons
                    name="check"
                    size={20}
                    color={set.completed ? '#000' : theme.textMuted}
                  />
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity
              style={[styles.addSetButton, { backgroundColor: theme.background }]}
              onPress={() => addSet(item.id)}
            >
              <Text style={[styles.addSetText, { color: theme.text }]}>+ Añadir Set</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity
          style={[styles.addExerciseButton, { borderColor: theme.tint }]}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={[styles.addExerciseText, { color: theme.tint }]}>+ Añadir Ejercicio</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.finishButton, { backgroundColor: theme.tint }]} onPress={handleFinish}>
          <Text style={styles.finishButtonText}>Finalizar Entrenamiento</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={cancelWorkout}>
          <Text style={[styles.cancelButtonText, { color: theme.textMuted }]}>Cancelar Entrenamiento</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal para añadir ejercicios */}
      <Modal visible={isModalVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.card }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Seleccionar Ejercicio</Text>
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <MaterialCommunityIcons name="close" size={28} color={theme.text} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={MOCK_EXERCISES}
            keyExtractor={(item) => item.id}
            renderItem={renderExerciseItem}
            contentContainerStyle={styles.modalList}
          />
        </SafeAreaView>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContent: { justifyContent: 'center', alignItems: 'center', padding: 24 },
  emptyStateTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  emptyStateSubtitle: { fontSize: 16, textAlign: 'center', marginBottom: 32, lineHeight: 24 },
  startButton: { paddingVertical: 16, paddingHorizontal: 32, borderRadius: 12, width: '100%', alignItems: 'center' },
  startButtonText: { color: '#000', fontSize: 18, fontWeight: 'bold' },

  header: { padding: 16, borderBottomWidth: 1, alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  headerSubtitle: { fontSize: 16, marginTop: 4, fontFamily: 'monospace' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  exerciseContainer: { borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 20 },
  exerciseHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  exerciseTitle: { fontSize: 18, fontWeight: '600' },
  tableHeader: { flexDirection: 'row', marginBottom: 8, paddingHorizontal: 8 },
  columnHeader: { fontSize: 12, fontWeight: '600' },
  setRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 8, borderRadius: 8, marginBottom: 4, gap: 12 },
  setNumber: { fontSize: 16, fontWeight: '500' },
  inputContainer: { borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  input: { fontSize: 16, fontWeight: '500', textAlign: 'center' },
  checkButton: { borderRadius: 8, paddingVertical: 8, alignItems: 'center', justifyContent: 'center' },
  addSetButton: { marginTop: 12, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  addSetText: { fontSize: 14, fontWeight: '600' },
  addExerciseButton: { padding: 16, borderRadius: 12, borderWidth: 2, borderStyle: 'dashed', alignItems: 'center', marginBottom: 20 },
  addExerciseText: { fontSize: 16, fontWeight: 'bold' },
  finishButton: { padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 16 },
  finishButtonText: { color: '#000', fontSize: 16, fontWeight: 'bold' },
  cancelButton: { padding: 16, alignItems: 'center' },
  cancelButtonText: { fontSize: 16, fontWeight: '500' },

  modalContainer: { flex: 1 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#333' },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  modalList: { padding: 16 },
  modalExerciseItem: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 12 },
  modalExerciseImage: { width: 50, height: 50, borderRadius: 8, marginRight: 16 },
  modalExerciseInfo: { flex: 1 },
  modalExerciseName: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  modalExerciseMuscle: { fontSize: 14 },
});
