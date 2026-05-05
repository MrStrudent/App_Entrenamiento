import { EXERCISES } from './exercises';

export const MOCK_USER = {
  name: 'Alex',
  lastWorkout: 'Ayer',
  workoutsThisWeek: 3,
};

export const MOCK_WORKOUT_TEMPLATE = {
  name: 'Día de Empuje (Pecho, Hombro, Tríceps)',
  exercises: [
    {
      id: '1',
      exercise: EXERCISES[0], // Press de Banca
      sets: [
        { reps: 10, weight: 60, completed: true },
        { reps: 8, weight: 65, completed: true },
        { reps: 6, weight: 70, completed: false },
      ]
    },
    {
      id: '2',
      exercise: EXERCISES[9], // Press Militar (index 9 is shoulders-1)
      sets: [
        { reps: 10, weight: 20, completed: false },
        { reps: 10, weight: 20, completed: false },
        { reps: 8, weight: 22.5, completed: false },
      ]
    }
  ]
};

