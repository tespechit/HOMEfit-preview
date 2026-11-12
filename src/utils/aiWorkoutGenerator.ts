import { EXERCISES } from '../data/exercises';
import { Exercise, ExerciseCategory, Workout, WorkoutExerciseItem } from '../types';
import { calculateWorkoutDuration } from './fitness';

export type GuidedSex = 'feminino' | 'masculino' | 'outro';
export type GuidedGoal = 'emagrecimento' | 'hipertrofia' | 'condicionamento' | 'mobilidade';
export type GuidedWorkoutType = 'forca' | 'cardio' | 'mobilidade' | 'misto';
export type GuidedRegion =
  | 'corpo_todo'
  | 'membros_superiores'
  | 'membros_inferiores'
  | 'abdomen_core'
  | 'gluteos'
  | 'costas'
  | 'peito_ombros';
export type GuidedExperience = 'iniciante' | 'intermediario' | 'avancado';

export interface GuidedPlanInput {
  sex: GuidedSex;
  age: number;
  weightKg: number;
  heightCm: number;
  goal: GuidedGoal;
  workoutType: GuidedWorkoutType;
  usesEquipment: boolean;
  targetRegion: GuidedRegion;
  trainingDays: number;
  sessionMinutes: number;
  experienceLevel: GuidedExperience;
}

const REGION_CATEGORY_MAP: Record<GuidedRegion, ExerciseCategory[]> = {
  corpo_todo: ['Full Body', 'Cardio/HIIT'],
  membros_superiores: ['Upper Body'],
  membros_inferiores: ['Lower Body'],
  abdomen_core: ['Core/Abs'],
  gluteos: ['Lower Body', 'Full Body'],
  costas: ['Upper Body', 'Full Body'],
  peito_ombros: ['Upper Body'],
};

const GOAL_TITLE: Record<GuidedGoal, string> = {
  emagrecimento: 'Queima Inteligente',
  hipertrofia: 'Forca e Hipertrofia',
  condicionamento: 'Condicionamento Global',
  mobilidade: 'Mobilidade e Controle',
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function estimateBmi(weightKg: number, heightCm: number): number {
  const meters = Math.max(1.2, heightCm / 100);
  return weightKg / (meters * meters);
}

function getAllowedDifficulties(level: GuidedExperience) {
  if (level === 'iniciante') return new Set(['Beginner']);
  if (level === 'intermediario') return new Set(['Beginner', 'Intermediate']);
  return new Set(['Beginner', 'Intermediate', 'Advanced']);
}

function getIntervalProfile(input: GuidedPlanInput): { workSec: number; restSec: number } {
  let workSec = input.experienceLevel === 'iniciante' ? 30 : input.experienceLevel === 'intermediario' ? 40 : 50;
  let restSec = input.experienceLevel === 'iniciante' ? 25 : input.experienceLevel === 'intermediario' ? 20 : 15;

  if (input.goal === 'emagrecimento') {
    workSec += 5;
    restSec -= 5;
  }

  if (input.goal === 'hipertrofia') {
    workSec += 10;
    restSec += 5;
  }

  if (input.goal === 'mobilidade' || input.workoutType === 'mobilidade') {
    workSec = 45;
    restSec = 15;
  }

  const bmi = estimateBmi(input.weightKg, input.heightCm);

  if (input.age >= 55 || bmi >= 30) {
    workSec -= 5;
    restSec += 5;
  }

  return {
    workSec: clamp(workSec, 20, 60),
    restSec: clamp(restSec, 10, 40),
  };
}

function regionMatch(region: GuidedRegion, exercise: Exercise): boolean {
  const name = exercise.name.toLowerCase();
  const targets = exercise.targetMuscles.join(' ').toLowerCase();
  const regionText = (exercise.exerciseRegion || '').toLowerCase();

  if (region === 'corpo_todo') return true;
  if (region === 'membros_superiores') return exercise.category === 'Upper Body';
  if (region === 'membros_inferiores') return exercise.category === 'Lower Body';
  if (region === 'abdomen_core') return exercise.category === 'Core/Abs' || targets.includes('core') || targets.includes('abs');
  if (region === 'gluteos') return targets.includes('glute') || regionText.includes('glute');
  if (region === 'costas') return targets.includes('back') || name.includes('row') || name.includes('pull');
  if (region === 'peito_ombros') return targets.includes('chest') || targets.includes('shoulder');
  return true;
}

function typeMatch(type: GuidedWorkoutType, exercise: Exercise): boolean {
  if (type === 'misto') return true;
  if (type === 'forca') return exercise.exerciseType === 'Strength' || exercise.category === 'Upper Body' || exercise.category === 'Lower Body' || exercise.category === 'Core/Abs';
  if (type === 'cardio') return exercise.exerciseType === 'Aerobic' || exercise.category === 'Cardio/HIIT' || exercise.category === 'Full Body';
  return exercise.exerciseType === 'Stretching' || exercise.category === 'Stretching/Yoga';
}

function computeExerciseCount(targetMinutes: number, workSec: number, restSec: number): number {
  const targetSec = clamp(Math.round(targetMinutes * 60), 600, 3600);
  const basePerExercise = workSec + restSec;
  const approx = Math.round((targetSec - 5) / Math.max(20, basePerExercise));
  return clamp(approx, 4, 10);
}

function categorizePool(input: GuidedPlanInput, exercises: Exercise[]): Exercise[] {
  const preferredCategories = new Set(REGION_CATEGORY_MAP[input.targetRegion]);

  return exercises.filter((ex) => {
    if (input.targetRegion === 'corpo_todo') return true;
    if (preferredCategories.has(ex.category)) return true;
    return regionMatch(input.targetRegion, ex);
  });
}

function pickDayExercises(
  basePool: Exercise[],
  dayIndex: number,
  perDayCount: number,
  usageMap: Map<string, number>,
  previousDayIds: Set<string>
): Exercise[] {
  const selected: Exercise[] = [];
  const localSet = new Set<string>();

  const seededScore = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = (hash * 31 + id.charCodeAt(i) + dayIndex * 13) % 1000;
    }
    return hash;
  };

  const sorted = [...basePool].sort((a, b) => {
    const usageA = usageMap.get(a.id) || 0;
    const usageB = usageMap.get(b.id) || 0;
    const prevPenaltyA = previousDayIds.has(a.id) ? 3 : 0;
    const prevPenaltyB = previousDayIds.has(b.id) ? 3 : 0;

    const scoreA = usageA * 10 + prevPenaltyA + seededScore(a.id) / 1000;
    const scoreB = usageB * 10 + prevPenaltyB + seededScore(b.id) / 1000;
    return scoreA - scoreB;
  });

  for (let i = 0; i < sorted.length && selected.length < perDayCount; i++) {
    const ex = sorted[i];
    if (localSet.has(ex.id)) continue;
    localSet.add(ex.id);
    selected.push(ex);
    usageMap.set(ex.id, (usageMap.get(ex.id) || 0) + 1);
  }

  return selected;
}

function inferWorkoutCategory(exercises: Exercise[]): Workout['category'] {
  const counts = new Map<Workout['category'], number>();

  exercises.forEach((ex) => {
    counts.set(ex.category, (counts.get(ex.category) || 0) + 1);
  });

  const ordered = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  if (ordered.length === 0) return 'Mixed';
  if (ordered.length === 1) return ordered[0][0];
  if ((ordered[0][1] - ordered[1][1]) <= 1) return 'Mixed';
  return ordered[0][0];
}

function inferDifficulty(level: GuidedExperience): Workout['difficulty'] {
  if (level === 'iniciante') return 'Beginner';
  if (level === 'intermediario') return 'Intermediate';
  return 'Advanced';
}

function buildWorkoutDescription(input: GuidedPlanInput, dayNumber: number, exerciseCount: number): string {
  const profileLabel = input.sex === 'feminino'
    ? 'perfil feminino'
    : input.sex === 'masculino'
      ? 'perfil masculino'
      : 'perfil personalizado';

  const objectiveLabel = input.goal === 'emagrecimento'
    ? 'foco em gasto calórico e ritmo'
    : input.goal === 'hipertrofia'
      ? 'foco em força e tensão muscular'
      : input.goal === 'mobilidade'
        ? 'foco em mobilidade e controle'
        : 'foco em condicionamento geral';

  const equipmentLabel = input.usesEquipment ? 'com uso opcional de equipamentos' : 'somente peso corporal';
  return `Dia ${dayNumber}: ${profileLabel}, treino ${objectiveLabel}, ${equipmentLabel}, com ${exerciseCount} exercícios.`;
}

export function generateGuidedWorkouts(input: GuidedPlanInput): Workout[] {
  const allowedDifficulties = getAllowedDifficulties(input.experienceLevel);

  let pool = EXERCISES.filter((exercise) => {
    const matchesDifficulty = allowedDifficulties.has(exercise.difficulty);
    const matchesType = typeMatch(input.workoutType, exercise);
    const matchesRegion = regionMatch(input.targetRegion, exercise);
    const matchesEquipment = input.usesEquipment ? true : exercise.equipment === 'None';
    return matchesDifficulty && matchesType && matchesRegion && matchesEquipment;
  });

  pool = categorizePool(input, pool);

  if (pool.length < 4) {
    pool = EXERCISES.filter((exercise) => {
      const matchesDifficulty = allowedDifficulties.has(exercise.difficulty);
      const matchesEquipment = input.usesEquipment ? true : exercise.equipment === 'None';
      return matchesDifficulty && matchesEquipment;
    });
  }

  if (pool.length < 4) {
    pool = EXERCISES;
  }

  const { workSec, restSec } = getIntervalProfile(input);
  const perDayCount = computeExerciseCount(input.sessionMinutes, workSec, restSec);
  const usageMap = new Map<string, number>();
  let previousDayIds = new Set<string>();

  const workouts: Workout[] = [];
  const now = Date.now();

  for (let day = 1; day <= input.trainingDays; day++) {
    const picked = pickDayExercises(pool, day, perDayCount, usageMap, previousDayIds);
    const items: WorkoutExerciseItem[] = picked.map((exercise) => ({
      exerciseId: exercise.id,
      workSec,
      restSec,
    }));

    const totalDurationSec = calculateWorkoutDuration(items, 5);
    const category = inferWorkoutCategory(picked);

    const workout: Workout = {
      id: `ai-guided-${now}-${day}`,
      title: `IA ${GOAL_TITLE[input.goal]} • Dia ${day}`,
      description: buildWorkoutDescription(input, day, picked.length),
      category,
      difficulty: inferDifficulty(input.experienceLevel),
      exercises: items,
      isCustom: true,
      createdAt: new Date().toISOString(),
      estimatedMinutes: Math.max(1, Math.round(totalDurationSec / 60)),
    };

    workouts.push(workout);
    previousDayIds = new Set(picked.map((exercise) => exercise.id));
  }

  return workouts;
}
