import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useWorkout, HistoryWorkout } from '@/context/WorkoutContext';

/** Formatea una fecha ISO a texto legible en español */
function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 7) return `Hace ${diffDays} días`;

  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('es-MX', options);
}

/** Hora de la sesión */
function formatTime(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
}

export default function HistoryScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'dark';
  const theme = Colors[colorScheme];
  const { history } = useWorkout();

  const totalSets = (workout: HistoryWorkout) =>
    workout.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);

  const renderItem = ({ item }: { item: HistoryWorkout }) => (
    <TouchableOpacity 
      style={[styles.historyCard, { backgroundColor: theme.card, borderColor: theme.border }]}
      onPress={() => router.push(`/history-detail?id=${item.id}`)}
      activeOpacity={0.7}
    >
      {/* Cabecera: nombre + fecha */}
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>{item.name}</Text>
          <Text style={[styles.cardDate, { color: theme.textMuted }]}>
            {formatDate(item.date)} · {formatTime(item.date)}
          </Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={22} color={theme.textMuted} />
      </View>
      
      {/* Stats */}
      <View style={[styles.statsRow, { borderTopColor: theme.border }]}>
        <View style={styles.statItem}>
          <MaterialCommunityIcons name="clock-outline" size={16} color={theme.tint} />
          <Text style={[styles.statText, { color: theme.text }]}>{item.duration}</Text>
        </View>
        <View style={styles.statItem}>
          <MaterialCommunityIcons name="weight" size={16} color={theme.tint} />
          <Text style={[styles.statText, { color: theme.text }]}>{item.volume}</Text>
        </View>
        <View style={styles.statItem}>
          <MaterialCommunityIcons name="dumbbell" size={16} color={theme.tint} />
          <Text style={[styles.statText, { color: theme.text }]}>{item.exercises.length} ejerc.</Text>
        </View>
        <View style={styles.statItem}>
          <MaterialCommunityIcons name="format-list-numbered" size={16} color={theme.tint} />
          <Text style={[styles.statText, { color: theme.text }]}>{totalSets(item)} series</Text>
        </View>
      </View>

      {/* Vista previa de ejercicios */}
      <Text style={[styles.exercisePreview, { color: theme.textMuted }]} numberOfLines={2}>
        {item.exercises.map(e => `${e.sets.length}×${e.name}`).join('  ·  ')}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Historial</Text>
        {history.length > 0 && (
          <Text style={[styles.headerSubtitle, { color: theme.textMuted }]}>
            {history.length} {history.length === 1 ? 'sesión' : 'sesiones'} registradas
          </Text>
        )}
      </View>
      {history.length > 0 ? (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={[styles.emptyContainer]}>
          <View style={[styles.emptyIconCircle, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <MaterialCommunityIcons name="clipboard-text-clock-outline" size={48} color={theme.tint} />
          </View>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>Sin entrenamientos aún</Text>
          <Text style={[styles.emptySubtitle, { color: theme.textMuted }]}>
            Completa tu primer entrenamiento en la pestaña{'\n'}"Entrenar" y aparecerá aquí.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 16, paddingBottom: 12, borderBottomWidth: 1 },
  headerTitle: { fontSize: 26, fontWeight: 'bold' },
  headerSubtitle: { fontSize: 13, marginTop: 4 },
  listContent: { padding: 16 },
  historyCard: { padding: 16, borderRadius: 14, borderWidth: 1, marginBottom: 14 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardTitle: { fontSize: 17, fontWeight: 'bold' },
  cardDate: { fontSize: 13, marginTop: 2 },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, paddingTop: 12, borderTopWidth: 1, marginBottom: 10 },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  statText: { fontSize: 13, fontWeight: '600' },
  exercisePreview: { fontSize: 13, lineHeight: 18 },
  // Empty state
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyIconCircle: { width: 96, height: 96, borderRadius: 48, borderWidth: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  emptySubtitle: { fontSize: 15, textAlign: 'center', lineHeight: 22 },
});
