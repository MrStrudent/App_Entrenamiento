export type TemplateSet = {
  reps: number;
  weight: number;
};

export type TemplateExercise = {
  exerciseId: string;
  sets: TemplateSet[];
};

export type WorkoutTemplate = {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  exercises: TemplateExercise[];
};

export const TEMPLATES: WorkoutTemplate[] = [
  {
    id: 'push',
    name: 'Push (Empuje)',
    description: 'Enfoque en pecho, hombros y tríceps.',
    icon: 'arrow-up-bold',
    color: '#F43F5E', // Rose
    exercises: [
      {
        exerciseId: 'chest-1', // Press de Banca
        sets: [{ reps: 10, weight: 0 }, { reps: 8, weight: 0 }, { reps: 8, weight: 0 }],
      },
      {
        exerciseId: 'shoulders-1', // Press Militar
        sets: [{ reps: 10, weight: 0 }, { reps: 10, weight: 0 }, { reps: 8, weight: 0 }],
      },
      {
        exerciseId: 'chest-3', // Aperturas
        sets: [{ reps: 12, weight: 0 }, { reps: 12, weight: 0 }, { reps: 10, weight: 0 }],
      },
      {
        exerciseId: 'arms-2', // Extensión Tríceps
        sets: [{ reps: 12, weight: 0 }, { reps: 12, weight: 0 }, { reps: 12, weight: 0 }],
      },
    ]
  },
  {
    id: 'pull',
    name: 'Pull (Tirón)',
    description: 'Enfoque en espalda, bíceps y deltoide posterior.',
    icon: 'arrow-down-bold',
    color: '#3B82F6', // Blue
    exercises: [
      {
        exerciseId: 'back-1', // Dominadas
        sets: [{ reps: 8, weight: 0 }, { reps: 8, weight: 0 }, { reps: 6, weight: 0 }],
      },
      {
        exerciseId: 'back-2', // Remo con Barra
        sets: [{ reps: 10, weight: 0 }, { reps: 10, weight: 0 }, { reps: 8, weight: 0 }],
      },
      {
        exerciseId: 'back-3', // Jalón al Pecho
        sets: [{ reps: 12, weight: 0 }, { reps: 10, weight: 0 }, { reps: 10, weight: 0 }],
      },
      {
        exerciseId: 'arms-1', // Curl Bíceps
        sets: [{ reps: 12, weight: 0 }, { reps: 12, weight: 0 }, { reps: 12, weight: 0 }],
      },
    ]
  },
  {
    id: 'legs',
    name: 'Piernas',
    description: 'Trabajo completo del tren inferior y core.',
    icon: 'human-handsdown',
    color: '#8B5CF6', // Purple
    exercises: [
      {
        exerciseId: 'legs-1', // Sentadilla
        sets: [{ reps: 10, weight: 0 }, { reps: 8, weight: 0 }, { reps: 8, weight: 0 }],
      },
      {
        exerciseId: 'legs-3', // Prensa
        sets: [{ reps: 12, weight: 0 }, { reps: 12, weight: 0 }, { reps: 10, weight: 0 }],
      },
      {
        exerciseId: 'legs-2', // Peso Muerto
        sets: [{ reps: 8, weight: 0 }, { reps: 6, weight: 0 }, { reps: 6, weight: 0 }],
      },
      {
        exerciseId: 'core-1', // Plancha
        sets: [{ reps: 60, weight: 0 }, { reps: 60, weight: 0 }, { reps: 60, weight: 0 }], // Usamos reps como segundos
      },
    ]
  },
  {
    id: 'torso',
    name: 'Torso',
    description: 'Día híbrido para todo el tren superior.',
    icon: 'human',
    color: '#F59E0B', // Amber
    exercises: [
      {
        exerciseId: 'chest-1', // Press Banca
        sets: [{ reps: 10, weight: 0 }, { reps: 8, weight: 0 }, { reps: 8, weight: 0 }],
      },
      {
        exerciseId: 'back-2', // Remo con Barra
        sets: [{ reps: 10, weight: 0 }, { reps: 8, weight: 0 }, { reps: 8, weight: 0 }],
      },
      {
        exerciseId: 'shoulders-1', // Press Militar
        sets: [{ reps: 10, weight: 0 }, { reps: 10, weight: 0 }],
      },
      {
        exerciseId: 'back-3', // Jalón
        sets: [{ reps: 12, weight: 0 }, { reps: 12, weight: 0 }],
      },
    ]
  },
  {
    id: 'fullbody',
    name: 'Full Body',
    description: 'Cuerpo completo en una sola sesión.',
    icon: 'all-inclusive',
    color: '#10B981', // Emerald
    exercises: [
      {
        exerciseId: 'legs-1', // Sentadilla
        sets: [{ reps: 10, weight: 0 }, { reps: 8, weight: 0 }, { reps: 8, weight: 0 }],
      },
      {
        exerciseId: 'chest-1', // Press Banca
        sets: [{ reps: 10, weight: 0 }, { reps: 10, weight: 0 }, { reps: 8, weight: 0 }],
      },
      {
        exerciseId: 'back-2', // Remo
        sets: [{ reps: 10, weight: 0 }, { reps: 10, weight: 0 }, { reps: 8, weight: 0 }],
      },
      {
        exerciseId: 'shoulders-2', // Elevaciones
        sets: [{ reps: 15, weight: 0 }, { reps: 15, weight: 0 }, { reps: 12, weight: 0 }],
      },
    ]
  }
];
