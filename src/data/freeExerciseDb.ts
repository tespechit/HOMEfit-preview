import records from './free-exercise-db.json';
import { Exercise, FreeExerciseMedia } from '../types';

type FreeExerciseRecord = {
  id: string;
  name: string;
  aliases?: string[];
  shortDescription?: string;
  secondaryMuscles?: string[];
  steps?: string[];
  formCues?: string[];
  breathing?: string;
  videos?: { male?: string; female?: string };
  thumbnails?: { male?: string; female?: string };
};

const FREE_EXERCISES = records as FreeExerciseRecord[];

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');

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

const findRecord = (exercise: Exercise) => {
  const candidates = sourceByHomefitId[exercise.id] || [exercise.name];
  return FREE_EXERCISES.find(record => {
    const names = [record.name, ...(record.aliases || [])].map(normalize);
    return candidates.some(candidate => names.includes(normalize(candidate)));
  });
};

export const getFreeExerciseMedia = (exercise: Exercise): FreeExerciseMedia | undefined => {
  const record = findRecord(exercise);
  if (!record || (!record.videos?.male && !record.videos?.female)) return undefined;

  return {
    id: record.id,
    sourceName: record.name,
    shortDescription: record.shortDescription || '',
    secondaryMuscles: record.secondaryMuscles || [],
    steps: record.steps || [],
    formCues: record.formCues || [],
    breathing: record.breathing || '',
    videos: record.videos || {},
    thumbnails: record.thumbnails || {},
  };
};
