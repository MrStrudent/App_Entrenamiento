import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_EXERCISES, MOCK_HISTORY } from '@/constants/mockData';

export type Exercise = typeof MOCK_EXERCISES[0];

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

export type HistoryWorkout = {
  id: string;
  date: string;
  name: string;
  duration: string;
  volume: string;
  records: number;
  exercises: { name: string; sets: number }[];
};

type WorkoutContextType = {
  activeWorkout: ActiveWorkout | null;
  history: HistoryWorkout[];
  startWorkout: (name?: string) => void;
  finishWorkout: () => void;
  cancelWorkout: () => void;
  addExercise: (exercise: Exercise) => void;
  addSet: (exerciseId: string) => void;
  updateSet: (exerciseId: string, setId: string, field: 'reps' | 'weight', value: number) => void;
  toggleSetComplete: (exerciseId: string, setId: string) => void;
  removeSet: (exerciseId: string, setId: string) => void;
};

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export function WorkoutProvider({ children }: { children: React.ReactNode }) {
  const [activeWorkout, setActiveWorkout] = useState<ActiveWorkout | null>(null);
  const [history, setHistory] = useState<HistoryWorkout[]>(MOCK_HISTORY); // Empezamos con datos de prueba

  const startWorkout = (name = 'Entrenamiento Libre') => {
    setActiveWorkout({
      id: Date.now().toString(),
      name,
      startTime: Date.now(),
      exercises: [],
    });
  };

  const finishWorkout = () => {
    if (!activeWorkout) return;

    // Calcular duración
    const diffMs = Date.now() - activeWorkout.startTime;
    const diffMins = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    const duration = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

    // Calcular volumen total y armar lista de ejercicios
    let totalVolume = 0;
    const historyExercises: { name: string; sets: number }[] = [];

    activeWorkout.exercises.forEach(ex => {
      let completedSetsCount = 0;
      ex.sets.forEach(set => {
        if (set.completed) {
          totalVolume += set.reps * set.weight;
          completedSetsCount++;
        }
      });
      if (completedSetsCount > 0) {
        historyExercises.push({ name: ex.exercise.name, sets: completedSetsCount });
      }
    });

    const newHistoryWorkout: HistoryWorkout = {
      id: activeWorkout.id,
      date: new Date().toISOString().split('T')[0],
      name: activeWorkout.name,
      duration: duration === '0m' ? '1m' : duration,
      volume: `${totalVolume.toLocaleString()} kg`,
      records: 0, // Simplificado para este prototipo
      exercises: historyExercises,
    };

    setHistory([newHistoryWorkout, ...history]);
    setActiveWorkout(null);
  };

  const cancelWorkout = () => {
    setActiveWorkout(null);
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
        removeSet
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
