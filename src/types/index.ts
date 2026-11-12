export type ExerciseCategory =
  | 'Full Body'
  | 'Upper Body'
  | 'Lower Body'
  | 'Core/Abs'
  | 'Cardio/HIIT'
  | 'Stretching/Yoga';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type EquipmentType = 'None' | 'Dumbbells' | 'Resistance Bands' | 'Chair/Wall';
export type EquipmentUse = 'None' | 'Improvised' | 'Gym';

export interface FreeExerciseMedia {
  id: string;
  bodyPart: string;
  target: string;
  equipment: string;
  difficulty: string;
  aliases: string[];
  shortDescription: string;
  instructions: string;
  secondaryMuscles: string[];
  sourceName: string;
  commonMistakes: string[];
  steps: string[];
  formCues: string[];
  breathing: string;
  videos: {
    male?: string;
    female?: string;
  };
  thumbnails: {
    male?: string;
    female?: string;
  };
}

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  targetMuscles: string[];
  difficulty: DifficultyLevel;
  equipment: EquipmentType;
  defaultDuration: number; // in seconds, e.g. 30 or 40
  defaultReps?: number;
  estCaloriesPerMin: number;
  instructions: string[];
  commonMistakes: string[];
  proTip: string;
  icon: string; // emoji or visual cue
  animationType?: 'squat' | 'pushup' | 'lunge' | 'jumping_jack' | 'plank' | 'burpee' | 'crunch' | 'stretch' | 'cardio';
  freeExercise?: FreeExerciseMedia;
  exerciseType?: 'Aerobic' | 'Strength' | 'Stretching';
  exerciseRegion?: 'Full Body' | 'Upper Front' | 'Upper Back' | 'Lower Body' | 'Abdomen' | 'Glutes';
  equipmentUse?: EquipmentUse;
}

export interface WorkoutExerciseItem {
  exerciseId: string;
  workSec: number;
  restSec: number;
  reps?: number;
  sets?: number;
}

export interface Workout {
  id: string;
  title: string;
  description: string;
  category: ExerciseCategory | 'Mixed';
  difficulty: DifficultyLevel;
  exercises: WorkoutExerciseItem[];
  isCustom?: boolean;
  createdAt?: string;
  estimatedMinutes?: number;
}

export interface ProgramDay {
  dayNumber: number;
  isRestDay: boolean;
  title: string;
  focus: string;
  durationMinutes: number;
  exercises: WorkoutExerciseItem[];
  recoveryTip?: string;
}

export interface Program {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  durationDays: number;
  difficulty: DifficultyLevel;
  category: string;
  badgeColor: string;
  days: ProgramDay[];
}

export interface ActiveProgramState {
  programId: string;
  currentDay: number;
  completedDays: number[];
  startDate: string;
}

export interface WorkoutLog {
  id: string;
  date: string; // YYYY-MM-DD
  timestamp: number;
  workoutTitle: string;
  workoutCategory: string;
  durationMinutes: number;
  durationSeconds: number;
  caloriesBurned: number;
  exercisesCompleted: number;
  feeling?: 'great' | 'good' | 'hard' | 'exhausted';
}

export interface WeightEntry {
  id: string;
  date: string; // YYYY-MM-DD
  weight: number; // stored in kg
  note?: string;
}

export type FitnessGoal = 'lose_weight' | 'build_muscle' | 'stay_fit' | 'flexibility';

export interface UserProfile {
  goal: FitnessGoal;
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  availableMinutes: 10 | 20 | 30 | 45;
  equipment: 'none' | 'dumbbells' | 'resistance_bands';
  weeklyGoalDays: number;
  weightUnit: 'kg' | 'lbs';
  targetWeight?: number;
  currentWeight?: number;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  hasCompletedOnboarding: boolean;
}
