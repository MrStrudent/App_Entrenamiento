import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useWorkout } from '@/context/WorkoutContext';

export default function HistoryDetailScreen() {
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme() ?? 'dark';
  const theme = Colors[colorScheme];
  const { history } = useWorkout();
  const router = useRouter();

  const workout = history.find(h => h.id === id);

  if (!workout) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: theme.text }}>Entrenamiento no encontrado</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Resumen', headerStyle: { backgroundColor: theme.background }, headerTintColor: theme.text }} />
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
        
        <View style={[styles.summaryCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.title, { color: theme.text }]}>{workout.name}</Text>
          <Text style={[styles.date, { color: theme.textMuted }]}>{workout.date}</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: theme.text }]}>{workout.duration}</Text>
              <Text style={[styles.statLabel, { color: theme.textMuted }]}>Tiempo</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: theme.text }]}>{workout.volume}</Text>
              <Text style={[styles.statLabel, { color: theme.textMuted }]}>Volumen</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: theme.tint }]}>{workout.records}</Text>
              <Text style={[styles.statLabel, { color: theme.textMuted }]}>Récords</Text>
            </View>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Ejercicios Realizados</Text>
        
        {workout.exercises.map((ex, index) => (
          <View key={index} style={[styles.exerciseItem, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.exerciseName, { color: theme.text }]}>{ex.name}</Text>
            <Text style={[styles.exerciseSets, { color: theme.textMuted }]}>{ex.sets} series completadas</Text>
          </View>
        ))}

      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  summaryCard: { padding: 20, borderRadius: 16, borderWidth: 1, marginBottom: 24 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  date: { fontSize: 14, textAlign: 'center', marginTop: 4, marginBottom: 20 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  statBox: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 18, fontWeight: 'bold' },
  statLabel: { fontSize: 12, marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  exerciseItem: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 12 },
  exerciseName: { fontSize: 16, fontWeight: '600' },
  exerciseSets: { fontSize: 14, marginTop: 4 }
});
