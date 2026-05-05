import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Exercise } from '@/constants/exercises';

export type { Exercise };

export type SetInfo = {
  id: string;
  reps: number;
  weight: number;
  completed: boolean;
};

export type WorkoutExercise = {
  id: string;
  exercise: Exercise;
  sets: SetInfo[];
};

export type ActiveWorkout = {
  id: string;
  name: string;
  startTime: number;
  exercises: WorkoutExercise[];
};

// Detalle de cada serie guardada en el historial
export type HistorySetDetail = {
  reps: number;
  weight: number;
};

// Detalle de cada ejercicio guardado en el historial
export type HistoryExerciseDetail = {
  name: string;
  sets: HistorySetDetail[];
};

export type HistoryWorkout = {
  id: string;
  date: string;          // ISO date string  e.g. "2026-05-04"
  name: string;
  duration: string;      // e.g. "1h 15m"
  durationSeconds: number; // duración en segundos (para cálculos futuros)
  volume: string;        // e.g. "8,500 kg"
  exercises: HistoryExerciseDetail[];
};

const STORAGE_KEY = '@workout_history';

type WorkoutContextType = {
  activeWorkout: ActiveWorkout | null;
  history: HistoryWorkout[];
  startWorkout: (name?: string, initialExercises?: WorkoutExercise[]) => void;
  finishWorkout: () => void;
  cancelWorkout: () => void;
  addExercise: (exercise: Exercise) => void;
  addSet: (exerciseId: string) => void;
  updateSet: (exerciseId: string, setId: string, field: 'reps' | 'weight', value: number) => void;
  toggleSetComplete: (exerciseId: string, setId: string) => void;
  removeSet: (exerciseId: string, setId: string) => void;
  deleteHistoryWorkout: (id: string) => void;
};

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export function WorkoutProvider({ children }: { children: React.ReactNode }) {
  const [activeWorkout, setActiveWorkout] = useState<ActiveWorkout | null>(null);
  const [history, setHistory] = useState<HistoryWorkout[]>([]);

  // Cargar historial desde AsyncStorage al montar
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          setHistory(JSON.parse(raw));
        }
      } catch (e) {
        console.warn('Error loading workout history:', e);
      }
    };
    loadHistory();
  }, []);

  // Guardar historial en AsyncStorage cada vez que cambie
  useEffect(() => {
    const saveHistory = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(history));
      } catch (e) {
        console.warn('Error saving workout history:', e);
      }
    };
    saveHistory();
  }, [history]);

  const startWorkout = (name = 'Entrenamiento Libre', initialExercises: WorkoutExercise[] = []) => {
    setActiveWorkout({
      id: Date.now().toString(),
      name,
      startTime: Date.now(),
      exercises: initialExercises,
    });
  };

  const finishWorkout = () => {
    if (!activeWorkout) return;

    // Calcular duración
    const diffMs = Date.now() - activeWorkout.startTime;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    const duration = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

    // Calcular volumen total y armar lista de ejercicios con detalle de series
    let totalVolume = 0;
    const historyExercises: HistoryExerciseDetail[] = [];

    activeWorkout.exercises.forEach(ex => {
      const completedSets: HistorySetDetail[] = [];
      ex.sets.forEach(set => {
        if (set.completed) {
          totalVolume += set.reps * set.weight;
          completedSets.push({ reps: set.reps, weight: set.weight });
        }
      });
      if (completedSets.length > 0) {
        historyExercises.push({ name: ex.exercise.name, sets: completedSets });
      }
    });

    const newHistoryWorkout: HistoryWorkout = {
      id: activeWorkout.id,
      date: new Date().toISOString(),
      name: activeWorkout.name,
      duration: duration === '0m' ? '< 1m' : duration,
      durationSeconds: diffSecs,
      volume: `${totalVolume.toLocaleString()} kg`,
      exercises: historyExercises,
    };

    setHistory(prev => [newHistoryWorkout, ...prev]);
    setActiveWorkout(null);
  };

  const cancelWorkout = () => {
    setActiveWorkout(null);
  };

  const deleteHistoryWorkout = (id: string) => {
    setHistory(prev => prev.filter(w => w.id !== id));
  };

  const addExercise = (exercise: Exercise) => {
    if (!activeWorkout) return;
    setActiveWorkout({
      ...activeWorkout,
      exercises: [
        ...activeWorkout.exercises,
        {
          id: Date.now().toString() + Math.random(),
          exercise,
          sets: [{ id: Date.now().toString(), reps: 0, weight: 0, completed: false }],
        },
      ],
    });
  };

  const addSet = (exerciseId: string) => {
    if (!activeWorkout) return;
    setActiveWorkout({
      ...activeWorkout,
      exercises: activeWorkout.exercises.map(ex => {
        if (ex.id === exerciseId) {
          const lastSet = ex.sets[ex.sets.length - 1];
          return {
            ...ex,
            sets: [
              ...ex.sets,
              {
                id: Date.now().toString() + Math.random(),
                reps: lastSet ? lastSet.reps : 0,
                weight: lastSet ? lastSet.weight : 0,
                completed: false,
              },
            ],
          };
        }
        return ex;
      }),
    });
  };

  const updateSet = (exerciseId: string, setId: string, field: 'reps' | 'weight', value: number) => {
    if (!activeWorkout) return;
    setActiveWorkout({
      ...activeWorkout,
      exercises: activeWorkout.exercises.map(ex => {
        if (ex.id === exerciseId) {
          return {
            ...ex,
            sets: ex.sets.map(set => (set.id === setId ? { ...set, [field]: value } : set)),
          };
        }
        return ex;
      }),
    });
  };

  const toggleSetComplete = (exerciseId: string, setId: string) => {
    if (!activeWorkout) return;
    setActiveWorkout({
      ...activeWorkout,
      exercises: activeWorkout.exercises.map(ex => {
        if (ex.id === exerciseId) {
          return {
            ...ex,
            sets: ex.sets.map(set => (set.id === setId ? { ...set, completed: !set.completed } : set)),
          };
        }
        return ex;
      }),
    });
  };

  const removeSet = (exerciseId: string, setId: string) => {
    if (!activeWorkout) return;
    setActiveWorkout({
      ...activeWorkout,
      exercises: activeWorkout.exercises.map(ex => {
        if (ex.id === exerciseId) {
          return {
            ...ex,
            sets: ex.sets.filter(set => set.id !== setId),
          };
        }
        return ex;
      }),
    });
  };

  return (
    <WorkoutContext.Provider
      value={{
        activeWorkout,
        history,
        startWorkout,
        finishWorkout,
        cancelWorkout,
        addExercise,
        addSet,
        updateSet,
        toggleSetComplete,
        removeSet,
        deleteHistoryWorkout,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkout() {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
}
