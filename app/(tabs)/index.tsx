import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MOCK_USER, MOCK_HISTORY, MOCK_EXERCISES } from '@/constants/mockData';

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'dark';
  const theme = Colors[colorScheme];

  const lastWorkout = MOCK_HISTORY[0];
  const recentExercises = MOCK_EXERCISES.slice(0, 3);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.textMuted }]}>Hola,</Text>
            <Text style={[styles.name, { color: theme.text }]}>{MOCK_USER.name}</Text>
          </View>
          <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
            <Text style={styles.avatarText}>{MOCK_USER.name.charAt(0)}</Text>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <MaterialCommunityIcons name="lightning-bolt" size={24} color={theme.tint} />
            <Text style={[styles.statValue, { color: theme.text }]}>{MOCK_USER.workoutsThisWeek}</Text>
            <Text style={[styles.statLabel, { color: theme.textMuted }]}>Esta Semana</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <MaterialCommunityIcons name="timer-sand" size={24} color={theme.secondary} />
            <Text style={[styles.statValue, { color: theme.text }]}>00:00</Text>
            <Text style={[styles.statLabel, { color: theme.textMuted }]}>Descanso</Text>
          </View>
        </View>

        {/* Last Workout Card */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Último Entrenamiento</Text>
        <TouchableOpacity 
          style={[styles.mainCard, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={() => router.push('/history')}
          activeOpacity={0.8}
        >
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>{lastWorkout.name}</Text>
            <Text style={[styles.cardSubtitle, { color: theme.textMuted }]}>{lastWorkout.date}</Text>
          </View>
          <View style={styles.cardDetails}>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="clock-outline" size={16} color={theme.textMuted} />
              <Text style={[styles.detailText, { color: theme.textMuted }]}>{lastWorkout.duration}</Text>
            </View>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="weight" size={16} color={theme.textMuted} />
              <Text style={[styles.detailText, { color: theme.textMuted }]}>{lastWorkout.volume}</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Quick Links */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Accesos Rápidos</Text>
        <View style={styles.quickLinksRow}>
          <TouchableOpacity 
            style={[styles.quickLink, { backgroundColor: theme.tint + '20' }]}
            onPress={() => router.push('/workout')}
          >
            <MaterialCommunityIcons name="play-circle" size={32} color={theme.tint} />
            <Text style={[styles.quickLinkLabel, { color: theme.tint }]}>Entrenar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.quickLink, { backgroundColor: theme.secondary + '20' }]}
            onPress={() => router.push('/exercises')}
          >
            <MaterialCommunityIcons name="format-list-bulleted" size={32} color={theme.secondary} />
            <Text style={[styles.quickLinkLabel, { color: theme.secondary }]}>Ejercicios</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Exercises Preview */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Ejercicios Populares</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {recentExercises.map((ex) => (
            <TouchableOpacity 
              key={ex.id} 
              style={[styles.exerciseCard, { backgroundColor: theme.card, borderColor: theme.border }]}
              onPress={() => router.push('/exercises')}
            >
              <Image source={{ uri: ex.image }} style={styles.exerciseImage} />
              <View style={styles.exerciseInfo}>
                <Text style={[styles.exerciseName, { color: theme.text }]} numberOfLines={1}>{ex.name}</Text>
                <Text style={[styles.exerciseMuscle, { color: theme.textMuted }]}>{ex.muscle}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  greeting: { fontSize: 16, fontWeight: '500' },
  name: { fontSize: 28, fontWeight: 'bold', marginTop: 4 },
  avatar: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#000', fontSize: 20, fontWeight: 'bold' },
  statsRow: { flexDirection: 'row', gap: 16, marginBottom: 24 },
  statCard: { flex: 1, padding: 16, borderRadius: 16, borderWidth: 1, alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: 'bold', marginTop: 8 },
  statLabel: { fontSize: 12, marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, marginTop: 8 },
  mainCard: { padding: 20, borderRadius: 16, borderWidth: 1, marginBottom: 24 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  cardTitle: { fontSize: 18, fontWeight: '600' },
  cardSubtitle: { fontSize: 14 },
  cardDetails: { flexDirection: 'row', gap: 16 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  detailText: { fontSize: 14 },
  quickLinksRow: { flexDirection: 'row', gap: 16, marginBottom: 24 },
  quickLink: { flex: 1, padding: 20, borderRadius: 16, alignItems: 'center', justifyContent: 'center', gap: 8 },
  quickLinkLabel: { fontSize: 16, fontWeight: '600' },
  horizontalScroll: { marginHorizontal: -20, paddingHorizontal: 20 },
  exerciseCard: { width: 140, borderRadius: 16, borderWidth: 1, overflow: 'hidden', marginRight: 16 },
  exerciseImage: { width: '100%', height: 100 },
  exerciseInfo: { padding: 12 },
  exerciseName: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  exerciseMuscle: { fontSize: 12 },
});
