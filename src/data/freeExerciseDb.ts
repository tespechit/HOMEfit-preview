import records from './free-exercise-db.json';
import { Exercise, FreeExerciseMedia } from '../types';

export type FreeExerciseRecord = {
  id: string;
  name: string;
  aliases?: string[];
  bodyPart: string;
  target: string;
  equipment: string;
  difficulty: string;
  shortDescription?: string;
  instructions?: string;
  secondaryMuscles?: string[];
  steps?: string[];
  formCues?: string[];
  commonMistakes?: string[];
  breathing?: string;
  videos?: { male?: string; female?: string };
  thumbnails?: { male?: string; female?: string };
};

export const FREE_EXERCISES = records as FreeExerciseRecord[];

const normalize = (value: string) =>
  value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');

const sourceByHomefitId: Record<string, string[]> = {
  burpees: ['Burpee'],
  'jumping-jacks': ['Jumping Jack'],
  'standard-pushups': ['Push-Up'],
  'diamond-pushups': ['Push-Up'],
  'wide-grip-pushups': ['Push-Up'],
  'pike-pushups': ['Push-Up'],
  'decline-pushups': ['Push-Up'],
  'wall-pushups': ['Push-Up'],
  'bodyweight-squats': ['Squat'],
  'jump-squats': ['Squat'],
  'bulgarian-split-squats': ['Squat'],
  'sumo-squats': ['Squat'],
  'glute-bridges': ['Glute Bridge'],
  'side-plank': ['Side Plank'],
  'leg-raises': ['Lying Leg Raise'],
  'v-ups': ['V-Up'],
  'half-burpees': ['Burpee'],
};

export const findFreeExerciseRecord = (exercise: Exercise) => {
  const candidates = sourceByHomefitId[exercise.id] || [exercise.name];
  return FREE_EXERCISES.find(record => {
    const names = [record.name, ...(record.aliases || [])].map(normalize);
    return candidates.some(candidate => names.includes(normalize(candidate)));
  });
};

export const getFreeExerciseMedia = (exercise: Exercise): FreeExerciseMedia | undefined => {
  const record = findFreeExerciseRecord(exercise);
  if (!record || (!record.videos?.male && !record.videos?.female)) return undefined;
  return {
    id: record.id,
    bodyPart: record.bodyPart,
    target: record.target,
    equipment: record.equipment,
    difficulty: record.difficulty,
    aliases: record.aliases || [],
    sourceName: record.name,
    shortDescription: record.shortDescription || '',
    instructions: record.instructions || '',
    secondaryMuscles: record.secondaryMuscles || [],
    commonMistakes: record.commonMistakes || [],
    steps: record.steps || [],
    formCues: record.formCues || [],
    breathing: record.breathing || '',
    videos: record.videos || {},
    thumbnails: record.thumbnails || {},
  };
};

export const classifyFreeExercise = (record: FreeExerciseRecord): {
  exerciseType: 'Aerobic' | 'Strength' | 'Stretching';
  exerciseRegion: 'Full Body' | 'Upper Front' | 'Upper Back' | 'Lower Body' | 'Abdomen' | 'Glutes';
} => {
  const text = `${record.name} ${record.target} ${record.bodyPart}`.toLowerCase();
  const exerciseType = record.bodyPart === 'cardio' || /jump|run|burpee|high knee|jack|mountain climber|skater|shuffle|kick|boxing/.test(text)
    ? 'Aerobic'
    : /stretch|yoga|mobility|pose|flexibility|cat cow|cobra|child/.test(text)
      ? 'Stretching'
      : 'Strength';
  const exerciseRegion = record.bodyPart === 'cardio' || /full body|burpee|jumping jack|high knee|mountain climber/.test(text)
    ? 'Full Body'
    : /glute|hip/.test(text)
      ? 'Glutes'
      : /waist|ab|core|oblique/.test(text)
        ? 'Abdomen'
        : /upper legs|lower legs|leg|quad|hamstring|calf/.test(text)
          ? 'Lower Body'
          : /back|lat|erector|trapezius|tricep/.test(text)
            ? 'Upper Back'
            : 'Upper Front';
  return { exerciseType, exerciseRegion };
};
