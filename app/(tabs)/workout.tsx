import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MOCK_WORKOUT_TEMPLATE } from '@/constants/mockData';

export default function WorkoutScreen() {
  const colorScheme = useColorScheme() ?? 'dark';
  const theme = Colors[colorScheme];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Entrenamiento Activo</Text>
        <Text style={[styles.headerSubtitle, { color: theme.textMuted }]}>00:15:32</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.workoutName, { color: theme.tint }]}>{MOCK_WORKOUT_TEMPLATE.name}</Text>
        
        {MOCK_WORKOUT_TEMPLATE.exercises.map((item, index) => (
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
              <View key={setIndex} style={[styles.setRow, set.completed && { backgroundColor: theme.tint + '15' }]}>
                <Text style={[styles.setNumber, { flex: 0.5, color: theme.text }]}>{setIndex + 1}</Text>
                
                <View style={[styles.inputContainer, { flex: 1, backgroundColor: theme.background }]}>
                  <TextInput 
                    style={[styles.input, { color: theme.text }]} 
                    defaultValue={set.weight.toString()}
                    keyboardType="numeric"
                  />
                </View>
                
                <View style={[styles.inputContainer, { flex: 1, backgroundColor: theme.background }]}>
                  <TextInput 
                    style={[styles.input, { color: theme.text }]} 
                    defaultValue={set.reps.toString()}
                    keyboardType="numeric"
                  />
                </View>

                <TouchableOpacity 
                  style={[
                    styles.checkButton, 
                    { flex: 0.5, backgroundColor: set.completed ? theme.tint : theme.border }
                  ]}
                >
                  <MaterialCommunityIcons 
                    name="check" 
                    size={20} 
                    color={set.completed ? '#000' : theme.textMuted} 
                  />
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity style={[styles.addSetButton, { backgroundColor: theme.background }]}>
              <Text style={[styles.addSetText, { color: theme.text }]}>+ Añadir Set</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={[styles.finishButton, { backgroundColor: theme.tint }]}>
          <Text style={styles.finishButtonText}>Finalizar Entrenamiento</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 16, borderBottomWidth: 1, alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  headerSubtitle: { fontSize: 16, marginTop: 4, fontFamily: 'monospace' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  workoutName: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
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
  finishButton: { padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  finishButtonText: { color: '#000', fontSize: 16, fontWeight: 'bold' },
});
