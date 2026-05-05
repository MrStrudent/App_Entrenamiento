import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useWorkout, HistoryExerciseDetail } from '@/context/WorkoutContext';

/** Formatea la fecha ISO completa */
function formatFullDate(isoDate: string): string {
  const date = new Date(isoDate);
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  const formatted = date.toLocaleDateString('es-MX', options);
  // Capitalizar primera letra
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export default function HistoryDetailScreen() {
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme() ?? 'dark';
  const theme = Colors[colorScheme];
  const { history, deleteHistoryWorkout } = useWorkout();
  const router = useRouter();

  const workout = history.find(h => h.id === id);

  if (!workout) {
    return (
      <>
        <Stack.Screen options={{ title: 'Resumen', headerStyle: { backgroundColor: theme.background }, headerTintColor: theme.text }} />
        <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
          <MaterialCommunityIcons name="alert-circle-outline" size={48} color={theme.textMuted} style={{ marginBottom: 12 }} />
          <Text style={{ color: theme.textMuted, fontSize: 16 }}>Entrenamiento no encontrado</Text>
        </View>
      </>
    );
  }

  const totalSets = workout.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);

  const handleDelete = () => {
    Alert.alert(
      'Eliminar sesión',
      '¿Seguro que deseas eliminar esta sesión del historial?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            deleteHistoryWorkout(workout.id);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Resumen',
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.text,
          headerRight: () => (
            <TouchableOpacity onPress={handleDelete} style={{ marginRight: 8 }}>
              <MaterialCommunityIcons name="trash-can-outline" size={22} color={theme.danger} />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]} showsVerticalScrollIndicator={false}>
        
        {/* Summary Card */}
        <View style={[styles.summaryCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.title, { color: theme.text }]}>{workout.name}</Text>
          <Text style={[styles.date, { color: theme.textMuted }]}>{formatFullDate(workout.date)}</Text>
          
          <View style={[styles.statsGrid, { borderTopColor: theme.border }]}>
            <View style={styles.statBox}>
              <MaterialCommunityIcons name="clock-outline" size={22} color={theme.tint} style={{ marginBottom: 4 }} />
              <Text style={[styles.statValue, { color: theme.text }]}>{workout.duration}</Text>
              <Text style={[styles.statLabel, { color: theme.textMuted }]}>Duración</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
            <View style={styles.statBox}>
              <MaterialCommunityIcons name="weight" size={22} color={theme.tint} style={{ marginBottom: 4 }} />
              <Text style={[styles.statValue, { color: theme.text }]}>{workout.volume}</Text>
              <Text style={[styles.statLabel, { color: theme.textMuted }]}>Volumen</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
            <View style={styles.statBox}>
              <MaterialCommunityIcons name="format-list-numbered" size={22} color={theme.tint} style={{ marginBottom: 4 }} />
              <Text style={[styles.statValue, { color: theme.text }]}>{totalSets}</Text>
              <Text style={[styles.statLabel, { color: theme.textMuted }]}>Series</Text>
            </View>
          </View>
        </View>

        {/* Exercises Section */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Ejercicios ({workout.exercises.length})
        </Text>
        
        {workout.exercises.map((ex: HistoryExerciseDetail, exIndex: number) => (
          <View key={exIndex} style={[styles.exerciseCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            {/* Exercise header */}
            <View style={styles.exerciseHeader}>
              <View style={[styles.exerciseIndexBadge, { backgroundColor: theme.tint + '20' }]}>
                <Text style={[styles.exerciseIndex, { color: theme.tint }]}>{exIndex + 1}</Text>
              </View>
              <Text style={[styles.exerciseName, { color: theme.text }]}>{ex.name}</Text>
              <Text style={[styles.exerciseSetCount, { color: theme.textMuted }]}>
                {ex.sets.length} {ex.sets.length === 1 ? 'serie' : 'series'}
              </Text>
            </View>

            {/* Table header */}
            <View style={[styles.tableHeader, { borderBottomColor: theme.border }]}>
              <Text style={[styles.colHeader, { flex: 0.6, color: theme.textMuted }]}>Serie</Text>
              <Text style={[styles.colHeader, { flex: 1, color: theme.textMuted }]}>Peso (kg)</Text>
              <Text style={[styles.colHeader, { flex: 1, color: theme.textMuted }]}>Reps</Text>
            </View>

            {/* Sets */}
            {ex.sets.map((set, setIndex) => (
              <View
                key={setIndex}
                style={[
                  styles.setRow,
                  setIndex % 2 === 0 && { backgroundColor: theme.background + '40' },
                ]}
              >
                <Text style={[styles.setCell, { flex: 0.6, color: theme.textMuted }]}>{setIndex + 1}</Text>
                <Text style={[styles.setCell, { flex: 1, color: theme.text, fontWeight: '600' }]}>
                  {set.weight}
                </Text>
                <Text style={[styles.setCell, { flex: 1, color: theme.text, fontWeight: '600' }]}>
                  {set.reps}
                </Text>
              </View>
            ))}
          </View>
        ))}

        {/* Spacer inferior */}
        <View style={{ height: 32 }} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },

  // Summary card
  summaryCard: { padding: 20, borderRadius: 16, borderWidth: 1, marginBottom: 24 },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  date: { fontSize: 13, textAlign: 'center', marginTop: 4, marginBottom: 16 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 16, borderTopWidth: 1 },
  statBox: { alignItems: 'center', flex: 1 },
  statDivider: { width: 1, alignSelf: 'stretch', marginVertical: 4 },
  statValue: { fontSize: 18, fontWeight: 'bold' },
  statLabel: { fontSize: 11, marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.5 },

  // Section
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 14 },

  // Exercise card
  exerciseCard: { borderRadius: 14, borderWidth: 1, marginBottom: 14, overflow: 'hidden' },
  exerciseHeader: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 10 },
  exerciseIndexBadge: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  exerciseIndex: { fontSize: 13, fontWeight: 'bold' },
  exerciseName: { fontSize: 16, fontWeight: '600', flex: 1 },
  exerciseSetCount: { fontSize: 12 },

  // Table
  tableHeader: { flexDirection: 'row', paddingHorizontal: 14, paddingVertical: 8, borderBottomWidth: 1 },
  colHeader: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  setRow: { flexDirection: 'row', paddingHorizontal: 14, paddingVertical: 10 },
  setCell: { fontSize: 15 },
});
