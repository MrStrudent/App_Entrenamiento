import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MOCK_USER } from '@/constants/mockData';
import { EXERCISES } from '@/constants/exercises';
import { useWorkout } from '@/context/WorkoutContext';
import { useProgress } from '@/context/ProgressContext';
import ProgressModal from '@/components/ProgressModal';

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'dark';
  const theme = Colors[colorScheme];
  const { history, activeWorkout } = useWorkout();
  const { logs, photos } = useProgress();

  const [isProgressModalVisible, setProgressModalVisible] = useState(false);

  const lastWorkout = history.length > 0 ? history[0] : null;
  const recentExercises = EXERCISES.slice(0, 3);

  const workoutsThisWeek = history.filter(w => {
    const d = new Date(w.date);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays < 7;
  }).length;

  /** Formatea fecha relativa */
  const formatRelativeDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
  };

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

        {/* 1. Entrenar Card */}
        <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 0 }]}>Entrenar</Text>
        <TouchableOpacity 
          style={[styles.mainCard, { backgroundColor: theme.card, borderColor: activeWorkout ? theme.tint : theme.border, borderWidth: activeWorkout ? 2 : 1 }]}
          onPress={() => router.push('/workout')}
          activeOpacity={0.8}
        >
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>
              {activeWorkout ? 'Entrenamiento en curso' : 'Listo para entrenar'}
            </Text>
            <MaterialCommunityIcons name="play-circle" size={28} color={theme.tint} />
          </View>
          <View style={styles.cardDetails}>
            {activeWorkout ? (
              <View style={styles.detailItem}>
                <MaterialCommunityIcons name="dumbbell" size={16} color={theme.textMuted} />
                <Text style={[styles.detailText, { color: theme.textMuted }]}>{activeWorkout.name} • {activeWorkout.exercises.length} ejerc.</Text>
              </View>
            ) : (
              <View style={styles.detailItem}>
                <MaterialCommunityIcons name="information-outline" size={16} color={theme.textMuted} />
                <Text style={[styles.detailText, { color: theme.textMuted }]}>Comienza un nuevo registro de entrenamiento</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>

        {/* 2. Historial Card */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Historial</Text>
        <TouchableOpacity 
          style={[styles.mainCard, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={() => router.push('/history')}
          activeOpacity={0.8}
        >
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>
              {lastWorkout ? 'Último Entrenamiento' : 'Sin historial'}
            </Text>
            <MaterialCommunityIcons name="history" size={28} color={theme.textMuted} />
          </View>
          {lastWorkout ? (
            <>
              <Text style={[styles.cardSubtitle, { color: theme.textMuted, marginBottom: 12 }]}>
                {lastWorkout.name} • {formatRelativeDate(lastWorkout.date)}
              </Text>
              <View style={styles.cardDetails}>
                <View style={styles.detailItem}>
                  <MaterialCommunityIcons name="clock-outline" size={16} color={theme.textMuted} />
                  <Text style={[styles.detailText, { color: theme.textMuted }]}>{lastWorkout.duration}</Text>
                </View>
                <View style={styles.detailItem}>
                  <MaterialCommunityIcons name="weight" size={16} color={theme.textMuted} />
                  <Text style={[styles.detailText, { color: theme.textMuted }]}>{lastWorkout.volume}</Text>
                </View>
                <View style={styles.detailItem}>
                  <MaterialCommunityIcons name="lightning-bolt" size={16} color={theme.textMuted} />
                  <Text style={[styles.detailText, { color: theme.textMuted }]}>{workoutsThisWeek} esta sem.</Text>
                </View>
              </View>
            </>
          ) : (
             <Text style={[styles.detailText, { color: theme.textMuted }]}>Tus entrenamientos aparecerán aquí.</Text>
          )}
        </TouchableOpacity>

        {/* 3 y 4. Descanso y Ejercicios Cards */}
        <View style={styles.quickLinksRow}>
          {/* Descanso */}
          <TouchableOpacity 
            style={[styles.quickLink, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]}
            onPress={() => router.push('/rest')}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="timer-sand" size={32} color={theme.secondary} />
            <Text style={[styles.quickLinkLabel, { color: theme.text }]}>Descanso</Text>
            <Text style={[styles.statLabel, { color: theme.textMuted }]}>Temporizador listo</Text>
          </TouchableOpacity>
          
          {/* Ejercicios */}
          <TouchableOpacity 
            style={[styles.quickLink, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]}
            onPress={() => router.push('/exercises')}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="format-list-bulleted" size={32} color={theme.tint} />
            <Text style={[styles.quickLinkLabel, { color: theme.text }]}>Ejercicios</Text>
            <Text style={[styles.statLabel, { color: theme.textMuted }]}>{EXERCISES.length} disponibles</Text>
          </TouchableOpacity>
        </View>

        {/* Progreso Card */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Progreso</Text>
        <TouchableOpacity 
          style={[styles.mainCard, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={() => setProgressModalVisible(true)}
          activeOpacity={0.8}
        >
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>Seguimiento Físico</Text>
            <MaterialCommunityIcons name="chart-line" size={28} color={theme.textMuted} />
          </View>
          <View style={styles.cardDetails}>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="scale-bathroom" size={16} color={theme.textMuted} />
              <Text style={[styles.detailText, { color: theme.textMuted }]}>
                {logs.length > 0 ? `${logs[0].weight} kg (${new Date(logs[0].date).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })})` : 'Sin registros de peso'}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="camera" size={16} color={theme.textMuted} />
              <Text style={[styles.detailText, { color: theme.textMuted }]}>{photos.length} fotos guardadas</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Ejercicios Populares */}
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
      <ProgressModal visible={isProgressModalVisible} onClose={() => setProgressModalVisible(false)} />
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
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, marginTop: 12 },
  mainCard: { padding: 20, borderRadius: 16, marginBottom: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardTitle: { fontSize: 18, fontWeight: '600' },
  cardSubtitle: { fontSize: 14 },
  cardDetails: { flexDirection: 'row', gap: 16 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  detailText: { fontSize: 14 },
  quickLinksRow: { flexDirection: 'row', gap: 16, marginBottom: 16, marginTop: 8 },
  quickLink: { flex: 1, padding: 20, borderRadius: 16, alignItems: 'center', justifyContent: 'center', gap: 8 },
  quickLinkLabel: { fontSize: 16, fontWeight: '600' },
  statLabel: { fontSize: 12, marginTop: 4 },
  horizontalScroll: { marginHorizontal: -20, paddingHorizontal: 20, marginTop: 4 },
  exerciseCard: { width: 140, borderRadius: 16, borderWidth: 1, overflow: 'hidden', marginRight: 16 },
  exerciseImage: { width: '100%', height: 100 },
  exerciseInfo: { padding: 12 },
  exerciseName: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  exerciseMuscle: { fontSize: 12 },
});
