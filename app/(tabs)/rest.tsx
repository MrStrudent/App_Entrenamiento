import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Vibration, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

// Preajustes de tiempo en segundos
const PRESETS = [
  { label: '30s', seconds: 30 },
  { label: '60s', seconds: 60 },
  { label: '90s', seconds: 90 },
  { label: '2 min', seconds: 120 },
  { label: '3 min', seconds: 180 },
];

type TimerState = 'idle' | 'running' | 'paused' | 'finished';

export default function RestScreen() {
  const colorScheme = useColorScheme() ?? 'dark';
  const theme = Colors[colorScheme];

  const [totalTime, setTotalTime] = useState(90);       // tiempo inicial seleccionado
  const [timeLeft, setTimeLeft] = useState(90);          // tiempo restante
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [customInput, setCustomInput] = useState('');    // input personalizado
  const [showCustom, setShowCustom] = useState(false);   // toggle input personalizado
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Limpiar intervalo al desmontar
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Lógica del temporizador
  useEffect(() => {
    if (timerState === 'running') {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Tiempo terminado
            clearInterval(intervalRef.current!);
            intervalRef.current = null;
            setTimerState('finished');
            // Vibrar al terminar (solo en dispositivos móviles)
            if (Platform.OS !== 'web') {
              Vibration.vibrate([0, 300, 200, 300, 200, 300]);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [timerState]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Progreso para el anillo visual (0 a 1)
  const progress = totalTime > 0 ? timeLeft / totalTime : 0;

  // Seleccionar un preajuste
  const selectPreset = (seconds: number) => {
    setTotalTime(seconds);
    setTimeLeft(seconds);
    setTimerState('idle');
    setShowCustom(false);
  };

  // Confirmar tiempo personalizado
  const confirmCustomTime = () => {
    const parsed = parseInt(customInput, 10);
    if (!isNaN(parsed) && parsed > 0 && parsed <= 600) {
      selectPreset(parsed);
      setCustomInput('');
      setShowCustom(false);
    }
  };

  // Controles
  const handlePlayPause = () => {
    if (timerState === 'idle' || timerState === 'finished') {
      // Iniciar desde el tiempo configurado
      if (timerState === 'finished') setTimeLeft(totalTime);
      setTimerState('running');
    } else if (timerState === 'running') {
      setTimerState('paused');
    } else if (timerState === 'paused') {
      setTimerState('running');
    }
  };

  const handleReset = () => {
    setTimerState('idle');
    setTimeLeft(totalTime);
  };

  const addTime = (amount: number) => {
    const newTime = Math.max(0, timeLeft + amount);
    setTimeLeft(newTime);
    // Si el temporizador había terminado y se agrega tiempo, también actualizar totalTime
    if (timerState === 'finished' && amount > 0) {
      setTotalTime(prev => prev + amount);
      setTimerState('running');
    }
    // Actualizar totalTime si se agrega tiempo para que el progreso no se rompa
    if (newTime > totalTime) {
      setTotalTime(newTime);
    }
  };

  // Color del anillo según estado
  const getRingColor = () => {
    if (timerState === 'finished') return theme.danger;
    if (timerState === 'paused') return theme.secondary;
    return theme.tint;
  };

  // Texto de estado
  const getStateText = () => {
    switch (timerState) {
      case 'idle': return 'Listo para iniciar';
      case 'running': return 'Descansando...';
      case 'paused': return 'En pausa';
      case 'finished': return '¡Tiempo terminado!';
    }
  };

  // Ícono del botón principal
  const getPlayIcon = (): 'play' | 'pause' | 'replay' => {
    if (timerState === 'finished') return 'replay';
    if (timerState === 'running') return 'pause';
    return 'play';
  };

  // Color del botón principal
  const getPlayColor = () => {
    if (timerState === 'finished') return theme.danger;
    if (timerState === 'running') return theme.secondary;
    return theme.tint;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Descanso</Text>
      </View>

      <View style={styles.content}>

        {/* Temporizador circular */}
        <View style={[
          styles.timerCircle,
          {
            borderColor: getRingColor(),
            backgroundColor: theme.card,
            shadowColor: getRingColor(),
          }
        ]}>
          <Text style={[
            styles.timerText,
            {
              color: timerState === 'finished' ? theme.danger : theme.text,
            }
          ]}>
            {formatTime(timeLeft)}
          </Text>
          <Text style={[styles.timerSubtext, { color: theme.textMuted }]}>
            {getStateText()}
          </Text>
        </View>

        {/* Botones de ajuste rápido +30s / +1min */}
        <View style={styles.adjustRow}>
          <TouchableOpacity
            style={[styles.adjustBtn, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => addTime(30)}
          >
            <Text style={[styles.adjustBtnText, { color: theme.tint }]}>+30s</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.adjustBtn, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => addTime(60)}
          >
            <Text style={[styles.adjustBtnText, { color: theme.tint }]}>+1 min</Text>
          </TouchableOpacity>
        </View>

        {/* Controles principales: Reiniciar / Play-Pause / Stop */}
        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={[styles.controlBtn, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={handleReset}
          >
            <MaterialCommunityIcons name="refresh" size={28} color={theme.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.playBtn, { backgroundColor: getPlayColor() }]}
            onPress={handlePlayPause}
          >
            <MaterialCommunityIcons
              name={getPlayIcon()}
              size={44}
              color="#000"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlBtn, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => {
              setTimerState('idle');
              setTimeLeft(totalTime);
            }}
          >
            <MaterialCommunityIcons name="stop" size={28} color={theme.text} />
          </TouchableOpacity>
        </View>

        {/* Preajustes */}
        <Text style={[styles.presetLabel, { color: theme.textMuted }]}>Preajustes</Text>
        <View style={styles.presetRow}>
          {PRESETS.map(p => {
            const isSelected = totalTime === p.seconds && !showCustom;
            return (
              <TouchableOpacity
                key={p.seconds}
                style={[
                  styles.presetBtn,
                  {
                    backgroundColor: isSelected ? theme.tint + '25' : theme.card,
                    borderColor: isSelected ? theme.tint : theme.border,
                  },
                ]}
                onPress={() => selectPreset(p.seconds)}
              >
                <Text style={[
                  styles.presetBtnText,
                  { color: isSelected ? theme.tint : theme.text },
                ]}>
                  {p.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Tiempo personalizado */}
        {!showCustom ? (
          <TouchableOpacity
            style={[styles.customToggle, { borderColor: theme.border }]}
            onPress={() => setShowCustom(true)}
          >
            <MaterialCommunityIcons name="pencil-outline" size={16} color={theme.textMuted} />
            <Text style={[styles.customToggleText, { color: theme.textMuted }]}>
              Tiempo personalizado
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={[styles.customRow, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <TextInput
              style={[styles.customInput, { color: theme.text, borderColor: theme.border }]}
              placeholder="Segundos (ej. 45)"
              placeholderTextColor={theme.textMuted}
              keyboardType="numeric"
              value={customInput}
              onChangeText={setCustomInput}
              onSubmitEditing={confirmCustomTime}
              maxLength={3}
              autoFocus
            />
            <TouchableOpacity
              style={[styles.customConfirmBtn, { backgroundColor: theme.tint }]}
              onPress={confirmCustomTime}
            >
              <MaterialCommunityIcons name="check" size={20} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.customCancelBtn, { backgroundColor: theme.card, borderColor: theme.border }]}
              onPress={() => { setShowCustom(false); setCustomInput(''); }}
            >
              <MaterialCommunityIcons name="close" size={20} color={theme.textMuted} />
            </TouchableOpacity>
          </View>
        )}

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 16, borderBottomWidth: 1, alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },

  // Temporizador circular
  timerCircle: {
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 6,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 32,
  },
  timerText: { fontSize: 56, fontWeight: 'bold', fontFamily: 'monospace' },
  timerSubtext: { fontSize: 14, marginTop: 6 },

  // Ajustes rápidos
  adjustRow: { flexDirection: 'row', gap: 16, marginBottom: 28 },
  adjustBtn: { paddingVertical: 10, paddingHorizontal: 22, borderRadius: 20, borderWidth: 1 },
  adjustBtnText: { fontSize: 15, fontWeight: '700' },

  // Controles
  controlsRow: { flexDirection: 'row', alignItems: 'center', gap: 28, marginBottom: 32 },
  controlBtn: { width: 56, height: 56, borderRadius: 28, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  playBtn: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center' },

  // Preajustes
  presetLabel: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 },
  presetRow: { flexDirection: 'row', gap: 10, marginBottom: 16, flexWrap: 'wrap', justifyContent: 'center' },
  presetBtn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 16, borderWidth: 1 },
  presetBtnText: { fontSize: 13, fontWeight: '600' },

  // Personalizado
  customToggle: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 16, borderWidth: 1, borderStyle: 'dashed' },
  customToggleText: { fontSize: 13, fontWeight: '500' },
  customRow: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 8, borderRadius: 14, borderWidth: 1 },
  customInput: { width: 120, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10, borderWidth: 1, fontSize: 16, fontWeight: '600', textAlign: 'center' },
  customConfirmBtn: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  customCancelBtn: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
});
