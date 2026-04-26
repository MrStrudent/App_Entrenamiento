import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useWorkout, HistoryWorkout } from '@/context/WorkoutContext';

export default function HistoryScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'dark';
  const theme = Colors[colorScheme];
  const { history } = useWorkout();

  const renderItem = ({ item }: { item: HistoryWorkout }) => (
    <TouchableOpacity 
      style={[styles.historyCard, { backgroundColor: theme.card, borderColor: theme.border }]}
      onPress={() => router.push(`/history-detail?id=${item.id}`)}
    >
      <View style={styles.cardHeader}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>{item.name}</Text>
        <Text style={[styles.cardDate, { color: theme.textMuted }]}>{item.date}</Text>
      </View>
      
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <MaterialCommunityIcons name="clock-outline" size={16} color={theme.textMuted} />
          <Text style={[styles.statText, { color: theme.textMuted }]}>{item.duration}</Text>
        </View>
        <View style={styles.statItem}>
          <MaterialCommunityIcons name="weight" size={16} color={theme.textMuted} />
          <Text style={[styles.statText, { color: theme.textMuted }]}>{item.volume}</Text>
        </View>
        {item.records > 0 && (
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="trophy-outline" size={16} color={theme.tint} />
            <Text style={[styles.statText, { color: theme.tint }]}>{item.records} PRs</Text>
          </View>
        )}
      </View>

      <Text style={[styles.exercisePreview, { color: theme.textMuted }]} numberOfLines={1}>
        {item.exercises.map(e => `${e.sets}x ${e.name}`).join(', ')}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Historial</Text>
      </View>
      {history.length > 0 ? (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 24 }]}>
          <MaterialCommunityIcons name="history" size={64} color={theme.border} style={{ marginBottom: 16 }} />
          <Text style={{ color: theme.textMuted, fontSize: 16, textAlign: 'center' }}>
            Aún no hay entrenamientos registrados.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 16, borderBottomWidth: 1 },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  listContent: { padding: 16 },
  historyCard: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardTitle: { fontSize: 18, fontWeight: 'bold' },
  cardDate: { fontSize: 14 },
  statsRow: { flexDirection: 'row', gap: 16, marginBottom: 12 },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statText: { fontSize: 14, fontWeight: '500' },
  exercisePreview: { fontSize: 14, fontStyle: 'italic' }
});
