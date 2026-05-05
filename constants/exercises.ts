export interface Exercise {
  id: string;
  name: string;
  muscle: string;
  equipment: string;
  image: string;
  description: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  benefits: string;
  level: 'Principiante' | 'Intermedio' | 'Avanzado';
}

export const EXERCISES: Exercise[] = [
  // Pecho
  {
    id: 'chest-1',
    name: 'Press de Banca',
    muscle: 'Pecho',
    equipment: 'Barra',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop',
    description: 'Acuéstate en el banco, agarra la barra con las manos un poco más anchas que los hombros. Baja la barra hasta la mitad del pecho y empuja hacia arriba.',
    primaryMuscles: ['Pectoral mayor'],
    secondaryMuscles: ['Tríceps', 'Deltoides anterior'],
    benefits: 'Desarrolla fuerza y volumen en el tren superior.',
    level: 'Intermedio'
  },
  {
    id: 'chest-2',
    name: 'Flexiones de Pecho (Push-ups)',
    muscle: 'Pecho',
    equipment: 'Peso corporal',
    image: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=1332&auto=format&fit=crop',
    description: 'En posición de plancha, baja el cuerpo doblando los codos hasta que el pecho casi toque el suelo, luego empuja hacia arriba.',
    primaryMuscles: ['Pectoral mayor'],
    secondaryMuscles: ['Tríceps', 'Deltoides anterior', 'Core'],
    benefits: 'Ejercicio fundamental sin equipo para fortalecer el pecho.',
    level: 'Principiante'
  },
  {
    id: 'chest-3',
    name: 'Aperturas con Mancuernas',
    muscle: 'Pecho',
    equipment: 'Mancuernas',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1470&auto=format&fit=crop',
    description: 'Acostado en un banco, sostén las mancuernas sobre el pecho con los brazos ligeramente flexionados. Abre los brazos en un arco amplio hasta sentir el estiramiento y regresa.',
    primaryMuscles: ['Pectoral mayor'],
    secondaryMuscles: ['Deltoides anterior'],
    benefits: 'Aísla el músculo pectoral y mejora la flexibilidad del pecho.',
    level: 'Principiante'
  },

  // Espalda
  {
    id: 'back-1',
    name: 'Dominadas (Pull-ups)',
    muscle: 'Espalda',
    equipment: 'Peso corporal',
    image: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=1332&auto=format&fit=crop',
    description: 'Cuélgate de una barra con agarre prono. Tira de tu cuerpo hacia arriba hasta que la barbilla pase la barra, luego baja de forma controlada.',
    primaryMuscles: ['Dorsal ancho'],
    secondaryMuscles: ['Bíceps', 'Romboides', 'Trapecios'],
    benefits: 'El mejor ejercicio de peso corporal para desarrollar la amplitud de la espalda.',
    level: 'Intermedio'
  },
  {
    id: 'back-2',
    name: 'Remo con Barra',
    muscle: 'Espalda',
    equipment: 'Barra',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop',
    description: 'Con el torso inclinado hacia adelante y espalda recta, tira de la barra hacia el ombligo contrayendo la espalda.',
    primaryMuscles: ['Dorsal ancho', 'Romboides'],
    secondaryMuscles: ['Bíceps', 'Erectores espinales'],
    benefits: 'Desarrolla el grosor de la espalda y mejora la postura.',
    level: 'Intermedio'
  },
  {
    id: 'back-3',
    name: 'Jalón al Pecho',
    muscle: 'Espalda',
    equipment: 'Máquina',
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1469&auto=format&fit=crop',
    description: 'Sentado en la máquina, agarra la barra ancha. Tira de la barra hacia la parte superior del pecho juntando las escápulas.',
    primaryMuscles: ['Dorsal ancho'],
    secondaryMuscles: ['Bíceps', 'Braquial'],
    benefits: 'Excelente alternativa a las dominadas para principiantes.',
    level: 'Principiante'
  },

  // Piernas
  {
    id: 'legs-1',
    name: 'Sentadilla (Squat)',
    muscle: 'Piernas',
    equipment: 'Barra',
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1469&auto=format&fit=crop',
    description: 'Con la barra sobre los trapecios, baja las caderas hacia atrás y abajo como si te sentaras en una silla, manteniendo el pecho erguido.',
    primaryMuscles: ['Cuádriceps', 'Glúteos'],
    secondaryMuscles: ['Isquiotibiales', 'Core'],
    benefits: 'Desarrolla fuerza masiva en el tren inferior y el core.',
    level: 'Intermedio'
  },
  {
    id: 'legs-2',
    name: 'Peso Muerto (Deadlift)',
    muscle: 'Piernas',
    equipment: 'Barra',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop',
    description: 'Con la barra en el suelo, agarra la barra, mantén la espalda recta y levanta el peso extendiendo caderas y rodillas simultáneamente.',
    primaryMuscles: ['Isquiotibiales', 'Glúteos', 'Erectores espinales'],
    secondaryMuscles: ['Cuádriceps', 'Antebrazos', 'Trapecios'],
    benefits: 'Trabaja toda la cadena posterior del cuerpo.',
    level: 'Avanzado'
  },
  {
    id: 'legs-3',
    name: 'Prensa de Piernas',
    muscle: 'Piernas',
    equipment: 'Máquina',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1470&auto=format&fit=crop',
    description: 'Sentado en la máquina, coloca los pies en la plataforma. Empuja el peso extendiendo las rodillas y baja lentamente sin que las rodillas superen las puntas de los pies en exceso.',
    primaryMuscles: ['Cuádriceps'],
    secondaryMuscles: ['Glúteos', 'Isquiotibiales'],
    benefits: 'Permite mover mucho peso de forma segura y aislar las piernas.',
    level: 'Principiante'
  },

  // Hombros
  {
    id: 'shoulders-1',
    name: 'Press Militar',
    muscle: 'Hombros',
    equipment: 'Barra / Mancuernas',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop',
    description: 'De pie o sentado, empuja la barra o mancuernas desde la altura de los hombros hasta extender los brazos por completo sobre la cabeza.',
    primaryMuscles: ['Deltoides anterior', 'Deltoides medio'],
    secondaryMuscles: ['Tríceps', 'Trapecio superior'],
    benefits: 'Constructor principal para el tamaño y fuerza de los hombros.',
    level: 'Intermedio'
  },
  {
    id: 'shoulders-2',
    name: 'Elevaciones Laterales',
    muscle: 'Hombros',
    equipment: 'Mancuernas',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1470&auto=format&fit=crop',
    description: 'De pie, con una mancuerna en cada mano, levanta los brazos hacia los lados hasta que queden paralelos al suelo, manteniendo una ligera flexión de codo.',
    primaryMuscles: ['Deltoides medio'],
    secondaryMuscles: ['Trapecio'],
    benefits: 'Aísla la cabeza lateral del hombro, dándole un aspecto más ancho.',
    level: 'Principiante'
  },

  // Brazos
  {
    id: 'arms-1',
    name: 'Curl de Bíceps',
    muscle: 'Brazos',
    equipment: 'Mancuernas / Barra',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1470&auto=format&fit=crop',
    description: 'Manteniendo los codos fijos a los lados del cuerpo, levanta el peso flexionando los codos y contrae los bíceps arriba.',
    primaryMuscles: ['Bíceps braquial'],
    secondaryMuscles: ['Braquial anterior', 'Antebrazos'],
    benefits: 'Desarrolla el tamaño y fuerza del bíceps.',
    level: 'Principiante'
  },
  {
    id: 'arms-2',
    name: 'Extensión de Tríceps en Polea',
    muscle: 'Brazos',
    equipment: 'Máquina',
    image: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=1332&auto=format&fit=crop',
    description: 'De pie frente a la polea, sujeta la cuerda o barra y empuja hacia abajo extendiendo los codos por completo. Mantén los codos fijos.',
    primaryMuscles: ['Tríceps braquial'],
    secondaryMuscles: ['Ancóneo'],
    benefits: 'Aísla el tríceps con tensión constante a lo largo del movimiento.',
    level: 'Principiante'
  },

  // Core
  {
    id: 'core-1',
    name: 'Plancha Abdominal (Plank)',
    muscle: 'Core',
    equipment: 'Peso corporal',
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1469&auto=format&fit=crop',
    description: 'Apóyate en los antebrazos y las puntas de los pies, manteniendo el cuerpo en línea recta desde la cabeza hasta los talones. Contrae el abdomen.',
    primaryMuscles: ['Recto abdominal', 'Transverso abdominal'],
    secondaryMuscles: ['Oblicuos', 'Hombros', 'Erectores espinales'],
    benefits: 'Fortalece toda la faja abdominal de manera isométrica.',
    level: 'Principiante'
  },
  {
    id: 'core-2',
    name: 'Crunch Abdominal',
    muscle: 'Core',
    equipment: 'Peso corporal',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1470&auto=format&fit=crop',
    description: 'Acostado boca arriba con las rodillas flexionadas, levanta los hombros del suelo contrayendo el abdomen, sin tirar del cuello.',
    primaryMuscles: ['Recto abdominal'],
    secondaryMuscles: ['Oblicuos'],
    benefits: 'Aísla el músculo recto abdominal (el "six pack").',
    level: 'Principiante'
  }
];
