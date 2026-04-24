import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RestScreen() {
  const colorScheme = useColorScheme() ?? 'dark';
  const theme = Colors[colorScheme];
  
  // Note: Only visual logic, not a real accurate background timer for this mock.
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90); // 1:30

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const adjustTime = (amount: number) => {
    setTimeLeft(prev => Math.max(0, prev + amount));
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Descanso</Text>
      </View>
      
      <View style={styles.content}>
        {/* Visual Circular Timer */}
        <View style={[styles.timerCircle, { borderColor: theme.tint, backgroundColor: theme.card }]}>
          <Text style={[styles.timerText, { color: theme.text }]}>{formatTime(timeLeft)}</Text>
          <Text style={[styles.timerSubtext, { color: theme.textMuted }]}>Tiempo Restante</Text>
        </View>

        {/* Adjust Buttons */}
        <View style={styles.adjustRow}>
          <TouchableOpacity 
            style={[styles.adjustBtn, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => adjustTime(-15)}
          >
            <Text style={[styles.adjustBtnText, { color: theme.text }]}>-15s</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.adjustBtn, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => adjustTime(15)}
          >
            <Text style={[styles.adjustBtnText, { color: theme.text }]}>+15s</Text>
          </TouchableOpacity>
        </View>

        {/* Main Controls */}
        <View style={styles.controlsRow}>
          <TouchableOpacity 
            style={[styles.controlBtn, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => setTimeLeft(90)}
          >
            <MaterialCommunityIcons name="refresh" size={32} color={theme.text} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.playBtn, { backgroundColor: isActive ? theme.secondary : theme.tint }]}
            onPress={() => setIsActive(!isActive)}
          >
            <MaterialCommunityIcons 
              name={isActive ? "pause" : "play"} 
              size={48} 
              color="#000" 
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.controlBtn, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => { setIsActive(false); setTimeLeft(0); }}
          >
            <MaterialCommunityIcons name="stop" size={32} color={theme.text} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 16, borderBottomWidth: 1, alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  timerCircle: { 
    width: 250, 
    height: 250, 
    borderRadius: 125, 
    borderWidth: 8, 
    justifyContent: 'center', 
    alignItems: 'center',
    shadowColor: '#00E676',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 40
  },
  timerText: { fontSize: 64, fontWeight: 'bold', fontFamily: 'monospace' },
  timerSubtext: { fontSize: 16, marginTop: 8 },
  adjustRow: { flexDirection: 'row', gap: 24, marginBottom: 40 },
  adjustBtn: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 24, borderWidth: 1 },
  adjustBtnText: { fontSize: 16, fontWeight: '600' },
  controlsRow: { flexDirection: 'row', alignItems: 'center', gap: 32 },
  controlBtn: { width: 64, height: 64, borderRadius: 32, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  playBtn: { width: 88, height: 88, borderRadius: 44, justifyContent: 'center', alignItems: 'center' },
});
