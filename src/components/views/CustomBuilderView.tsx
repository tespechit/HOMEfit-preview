import React, { useState } from 'react';
import {
  Plus,
  Play,
  Trash2,
  Edit2,
  ChevronUp,
  ChevronDown,
  Clock,
  Dumbbell,
  Sparkles,
  Search,
  Check,
  X,
} from 'lucide-react';
import { Workout, WorkoutExerciseItem, Exercise } from '../../types';
import { EXERCISES, EXERCISES_BY_ID } from '../../data/exercises';
import { calculateWorkoutDuration, estimateCaloriesBurned, formatTime } from '../../utils/fitness';
import { ExerciseModal } from '../ExerciseModal';

interface CustomBuilderViewProps {
  customWorkouts: Workout[];
  onSaveCustomWorkout: (workout: Workout) => void;
  onDeleteCustomWorkout: (workoutId: string) => void;
  onStartWorkout: (workout: Workout) => void;
}

export const CustomBuilderView: React.FC<CustomBuilderViewProps> = ({
  customWorkouts,
  onSaveCustomWorkout,
  onDeleteCustomWorkout,
  onStartWorkout,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [items, setItems] = useState<WorkoutExerciseItem[]>([
    { exerciseId: 'bodyweight-squats', workSec: 40, restSec: 20 },
    { exerciseId: 'standard-pushups', workSec: 35, restSec: 20 },
    { exerciseId: 'forearm-plank', workSec: 45, restSec: 20 },
  ]);

  // Exercise Picker Modal
  const [showPicker, setShowPicker] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');
  const [pickerType, setPickerType] = useState('Todos');
  const [pickerRegion, setPickerRegion] = useState('Todas');
  const [pickerMuscle, setPickerMuscle] = useState('');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const handleOpenNew = () => {
    setTitle('My Custom Routine');
    setDescription('Tailored bodyweight circuit');
    setItems([
      { exerciseId: 'jumping-jacks', workSec: 40, restSec: 20 },
      { exerciseId: 'bodyweight-squats', workSec: 40, restSec: 20 },
      { exerciseId: 'standard-pushups', workSec: 35, restSec: 20 },
      { exerciseId: 'forearm-plank', workSec: 45, restSec: 20 },
    ]);
    setEditingId(null);
    setIsEditing(true);
  };

  const handleEditWorkout = (workout: Workout) => {
    setTitle(workout.title);
    setDescription(workout.description || '');
    setItems([...workout.exercises]);
    setEditingId(workout.id);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!title.trim() || items.length === 0) return;

    const totalSec = calculateWorkoutDuration(items, 5);
    const newWorkout: Workout = {
      id: editingId || 'custom-' + Date.now(),
      title: title.trim(),
      description: description.trim() || 'Custom created workout',
      category: 'Mixed',
      difficulty: 'Intermediate',
      exercises: items,
      isCustom: true,
      createdAt: new Date().toISOString(),
      estimatedMinutes: Math.max(1, Math.round(totalSec / 60)),
    };

    onSaveCustomWorkout(newWorkout);
    setIsEditing(false);
    setEditingId(null);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;
    const updated = [...items];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setItems(updated);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, idx) => idx !== index));
  };

  const updateItemDuration = (index: number, field: 'workSec' | 'restSec', value: number) => {
    const updated = [...items];
    updated[index] = {
      ...updated[index],
      [field]: Math.max(5, value),
    };
    setItems(updated);
  };

  const addExerciseFromPicker = (exerciseId: string) => {
    setItems(prev => [
      ...prev,
      { exerciseId, workSec: 40, restSec: 20 },
    ]);
    setShowPicker(false);
  };

  const getExerciseType = (exercise: Exercise) => {
    if (exercise.category === 'Cardio/HIIT') return 'Aeróbico';
    if (exercise.category === 'Stretching/Yoga') return 'Alongamento';
    return 'Força';
  };

  const getExerciseRegion = (exercise: Exercise) => {
    const text = `${exercise.name} ${exercise.targetMuscles.join(' ')}`.toLowerCase();
    if (exercise.category === 'Full Body' || /cardio|cardiovascular|full body|burpee|jumping|high knee|mountain climber/.test(text)) {
      return 'Todo o corpo';
    }
    if (/glute|glúteo|hip|quadril/.test(text)) return 'Glúteo';
    if (/abs|core|waist|oblique|abdom|rectus/.test(text)) return 'Abdome';
    if (/quad|hamstring|calf|leg|thigh|lower body|knee|glute/.test(text)) return 'Membros inferiores';
    if (/back|lat|tricep|bicep|shoulder|chest|pectoral|arm|upper body/.test(text)) {
      return /back|lat|tricep/.test(text)
        ? 'Membros superiores - Posterior'
        : 'Membros superiores - Anterior';
    }
    return 'Todo o corpo';
  };

  const pickerTypes = ['Todos', 'Aeróbico', 'Força', 'Alongamento'];
  const pickerTypeExercises = EXERCISES.filter(ex => pickerType === 'Todos' || getExerciseType(ex) === pickerType);
  const pickerRegions = [
    'Todas',
    ...Array.from(new Set(pickerTypeExercises.map(getExerciseRegion))).sort(),
  ];
  const muscleNames = Array.from(
    new Set(
      pickerTypeExercises.flatMap(ex => [
        ...ex.targetMuscles,
        ...(ex.freeExercise?.secondaryMuscles || []),
      ])
    )
  ).sort((a, b) => a.localeCompare(b));
  const muscleSuggestions = pickerMuscle.length >= 2
    ? muscleNames.filter(muscle => muscle.toLowerCase().includes(pickerMuscle.toLowerCase())).slice(0, 6)
    : [];

  const estDurationSec = calculateWorkoutDuration(items, 5);
  const estCalories = estimateCaloriesBurned(estDurationSec, 8.5);

  const filteredLibrary = pickerTypeExercises.filter(ex => {
    const search = pickerSearch.toLowerCase();
    const muscles = [...ex.targetMuscles, ...(ex.freeExercise?.secondaryMuscles || [])];
    return (
      (ex.name.toLowerCase().includes(search) ||
        ex.category.toLowerCase().includes(search) ||
        muscles.some(m => m.toLowerCase().includes(search))) &&
      (pickerRegion === 'Todas' || getExerciseRegion(ex) === pickerRegion) &&
      (!pickerMuscle || muscles.some(m => m.toLowerCase().includes(pickerMuscle.toLowerCase())))
    );
  });

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      {/* Header with New Routine action */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-zinc-900 dark:text-white">
            Custom Workout Builder
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Create, customize, and save your own routines.
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={handleOpenNew}
            className="py-2 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-orange-600/25 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create New</span>
          </button>
        )}
      </div>

      {/* EDITING FORM */}
      {isEditing ? (
        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              {editingId ? 'Edit Workout Routine' : 'Build Custom Routine'}
            </h3>
            <button
              onClick={() => setIsEditing(false)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Inputs */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                Workout Title
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Morning Core & Pushup Blast"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                Short Description / Goal
              </label>
              <input
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="e.g. 15-minute quick burn before shower"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Live Calculations Preview */}
          <div className="grid grid-cols-3 gap-2.5 p-3 rounded-2xl bg-orange-50/60 dark:bg-orange-950/20 border border-orange-200/60 dark:border-orange-900/40 text-center">
            <div>
              <span className="text-[10px] uppercase font-bold text-orange-700 dark:text-orange-300">
                Exercises
              </span>
              <p className="text-sm font-black text-orange-900 dark:text-orange-200">{items.length}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-orange-700 dark:text-orange-300">
                Est. Duration
              </span>
              <p className="text-sm font-black text-orange-900 dark:text-orange-200">{formatTime(estDurationSec)}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-orange-700 dark:text-orange-300">
                Est. Burn
              </span>
              <p className="text-sm font-black text-orange-900 dark:text-orange-200">~{estCalories} kcal</p>
            </div>
          </div>

          {/* Exercises Order List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
                Workout Sequence ({items.length})
              </h4>
              <button
                type="button"
                onClick={() => {
                  setPickerSearch('');
                  setPickerType('Todos');
                  setPickerRegion('Todas');
                  setPickerMuscle('');
                  setShowPicker(true);
                }}
                className="py-1 px-3 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 text-xs font-bold hover:bg-orange-200 dark:hover:bg-orange-900 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Exercise</span>
              </button>
            </div>

            {items.length === 0 ? (
              <div className="p-6 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-600 dark:text-zinc-300">
                No exercises added yet. Tap "Add Exercise" to select from the library!
              </div>
            ) : (
              <div className="space-y-2.5">
                {items.map((item, idx) => {
                  const ex = EXERCISES_BY_ID.get(item.exerciseId);
                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/60 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl">{ex?.icon || '💪'}</span>
                          <div>
                            <h5 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                              {idx + 1}. {ex?.name || item.exerciseId}
                            </h5>
                            <span className="text-[10px] text-zinc-600 dark:text-zinc-300">
                              {ex?.category} • {ex?.targetMuscles.slice(0, 2).join(', ')}
                            </span>
                          </div>
                        </div>

                        {/* Move Up / Down & Remove */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => moveItem(idx, 'up')}
                            className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 disabled:opacity-20"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === items.length - 1}
                            onClick={() => moveItem(idx, 'down')}
                            className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 disabled:opacity-20"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeItem(idx)}
                            className="p-1 rounded-md text-red-400 hover:text-red-600 ml-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Work and Rest sliders */}
                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div>
                          <div className="flex justify-between text-[10px] font-semibold text-zinc-600 dark:text-zinc-300 mb-1">
                            <span>Work Interval</span>
                            <span className="text-orange-600 dark:text-orange-400 font-bold">{item.workSec}s</span>
                          </div>
                          <input
                            type="range"
                            min="15"
                            max="90"
                            step="5"
                            value={item.workSec}
                            onChange={e => updateItemDuration(idx, 'workSec', Number(e.target.value))}
                            className="w-full accent-orange-600"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-[10px] font-semibold text-zinc-600 dark:text-zinc-300 mb-1">
                            <span>Rest Interval</span>
                            <span className="text-cyan-600 dark:text-cyan-400 font-bold">{item.restSec}s</span>
                          </div>
                          <input
                            type="range"
                            min="5"
                            max="60"
                            step="5"
                            value={item.restSec}
                            onChange={e => updateItemDuration(idx, 'restSec', Number(e.target.value))}
                            className="w-full accent-cyan-600"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Save / Cancel buttons */}
          <div className="flex gap-2.5 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex-1 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!title.trim() || items.length === 0}
              onClick={handleSave}
              className="flex-1 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-orange-600/30 flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Save Routine</span>
            </button>
          </div>
        </div>
      ) : null}

      {/* SAVED CUSTOM WORKOUTS LIST */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
          Saved Custom Workouts ({customWorkouts.length})
        </h3>

        {customWorkouts.length === 0 ? (
          <div className="p-8 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 text-center space-y-3 bg-zinc-50/50 dark:bg-zinc-900/30">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center text-2xl">
              ✨
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                No custom workouts yet
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-xs mx-auto">
                Mix your favorite push-ups, squats, and planks into your own personalized circuit!
              </p>
            </div>
            <button
              onClick={handleOpenNew}
              className="py-2.5 px-5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-md shadow-orange-600/20 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              Build Your First Routine
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {customWorkouts.map(cw => {
              const totalSec = calculateWorkoutDuration(cw.exercises, 5);
              const estKcal = estimateCaloriesBurned(totalSec, 8.5);

              return (
                <div
                  key={cw.id}
                  className="p-4 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs flex flex-col justify-between space-y-3 hover:border-zinc-300 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded-md bg-orange-50 dark:bg-orange-950/40">
                        Custom Circuit
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEditWorkout(cw)}
                          aria-label={`Edit ${cw.title}`}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteCustomWorkout(cw.id)}
                          aria-label={`Delete ${cw.title}`}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-2">
                      {cw.title}
                    </h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-0.5">
                      {cw.description}
                    </p>

                    <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-medium mt-2">
                      <span>{cw.exercises.length} Exercises</span>
                      <span>•</span>
                      <span>{formatTime(totalSec)}</span>
                      <span>•</span>
                      <span>~{estKcal} kcal</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onStartWorkout(cw)}
                    className="w-full py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-98 transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Start Workout</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* EXERCISE PICKER MODAL */}
      {showPicker && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4"
        >
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                Pick Exercise to Add
              </h3>
              <button
                onClick={() => setShowPicker(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative my-3">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={pickerSearch}
                onChange={e => setPickerSearch(e.target.value)}
                placeholder="Search bodyweight exercises..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Tipo de exercício
                <select
                  value={pickerType}
                  onChange={e => {
                    setPickerType(e.target.value);
                    setPickerRegion('Todas');
                  }}
                  className="mt-1 w-full rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100"
                >
                  {pickerTypes.map(type => <option key={type}>{type}</option>)}
                </select>
              </label>
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Região trabalhada
                <select
                  value={pickerRegion}
                  onChange={e => setPickerRegion(e.target.value)}
                  className="mt-1 w-full rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100"
                >
                  {pickerRegions.map(region => <option key={region}>{region}</option>)}
                </select>
              </label>
            </div>

            <div className="relative mb-3">
              <input
                type="text"
                value={pickerMuscle}
                onChange={e => setPickerMuscle(e.target.value)}
                placeholder="Filtrar por músculo (ex.: glúteos, quadríceps)"
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                role="combobox"
                aria-autocomplete="list"
              />
              {muscleSuggestions.length > 0 && (
                <div className="absolute z-10 left-0 right-0 mt-1 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-xl overflow-hidden">
                  {muscleSuggestions.map(muscle => (
                    <button
                      key={muscle}
                      type="button"
                      onClick={() => setPickerMuscle(muscle)}
                      className="block w-full text-left px-3 py-2 text-xs text-zinc-700 dark:text-zinc-200 hover:bg-orange-50 dark:hover:bg-orange-950/30"
                    >
                      {muscle}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-zinc-500">
                {filteredLibrary.length} exercícios encontrados
              </span>
              {pickerMuscle && (
                <button type="button" onClick={() => setPickerMuscle('')} className="text-[11px] text-orange-600 font-bold">
                  Limpar músculo
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {filteredLibrary.map(ex => (
                <div
                  key={ex.id}
                  onClick={() => {
                    setSelectedExercise(ex);
                    setShowPicker(false);
                  }}
                  className="p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:bg-orange-50/60 dark:hover:bg-orange-950/30 hover:border-orange-200 cursor-pointer flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{ex.icon}</span>
                    <div>
                      <h5 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                        {ex.name}
                      </h5>
                      <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                        {ex.category} • {ex.difficulty}
                      </span>
                    </div>
                  </div>
                  <Plus className="w-4 h-4 text-orange-600" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <ExerciseModal
        exercise={selectedExercise}
        onClose={() => setSelectedExercise(null)}
        onAddToCustom={exercise => addExerciseFromPicker(exercise.id)}
        intervalSeconds={selectedExercise?.defaultDuration}
      />
    </div>
  );
};
