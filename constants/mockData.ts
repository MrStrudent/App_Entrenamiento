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

export const MOCK_HISTORY = [
  {
    id: 'h1',
    date: '2023-10-25',
    name: 'Día de Piernas',
    duration: '1h 15m',
    volume: '8,500 kg',
    records: 2,
    exercises: [
      { name: 'Sentadilla', sets: 4 },
      { name: 'Peso Muerto', sets: 3 },
      { name: 'Prensa', sets: 3 },
    ]
  },
  {
    id: 'h2',
    date: '2023-10-23',
    name: 'Día de Empuje',
    duration: '1h 05m',
    volume: '6,200 kg',
    records: 0,
    exercises: [
      { name: 'Press de Banca', sets: 4 },
      { name: 'Press Militar', sets: 3 },
    ]
  },
  {
    id: 'h3',
    date: '2023-10-21',
    name: 'Día de Tirón',
    duration: '1h 10m',
    volume: '7,100 kg',
    records: 1,
    exercises: [
      { name: 'Dominadas', sets: 4 },
      { name: 'Remo con Barra', sets: 4 },
      { name: 'Curl de Bíceps', sets: 3 },
    ]
  }
];
