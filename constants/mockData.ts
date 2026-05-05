export const MOCK_USER = {
  name: 'Alex',
  lastWorkout: 'Ayer',
  workoutsThisWeek: 3,
};

export const MOCK_EXERCISES = [
  { id: '1', name: 'Press de Banca', muscle: 'Pecho', equipment: 'Barra', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop' },
  { id: '2', name: 'Sentadilla', muscle: 'Piernas', equipment: 'Barra', image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1469&auto=format&fit=crop' },
  { id: '3', name: 'Dominadas', muscle: 'Espalda', equipment: 'Peso corporal', image: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=1332&auto=format&fit=crop' },
  { id: '4', name: 'Curl de Bíceps', muscle: 'Brazos', equipment: 'Mancuernas', image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1470&auto=format&fit=crop' },
  { id: '5', name: 'Press Militar', muscle: 'Hombros', equipment: 'Mancuernas', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop' },
  { id: '6', name: 'Peso Muerto', muscle: 'Piernas', equipment: 'Barra', image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1469&auto=format&fit=crop' },
];

export const MOCK_WORKOUT_TEMPLATE = {
  name: 'Día de Empuje (Pecho, Hombro, Tríceps)',
  exercises: [
    {
      id: '1',
      exercise: MOCK_EXERCISES[0], // Press de Banca
      sets: [
        { reps: 10, weight: 60, completed: true },
        { reps: 8, weight: 65, completed: true },
        { reps: 6, weight: 70, completed: false },
      ]
    },
    {
      id: '2',
      exercise: MOCK_EXERCISES[4], // Press Militar
      sets: [
        { reps: 10, weight: 20, completed: false },
        { reps: 10, weight: 20, completed: false },
        { reps: 8, weight: 22.5, completed: false },
      ]
    }
  ]
};


