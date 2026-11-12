import React, { useMemo, useState } from 'react';
import { Play, ChevronLeft, ChevronRight, MonitorPlay } from 'lucide-react';
import { Exercise, Workout, WorkoutLog } from './types';
import { PROGRAMS } from './data/programs';
import { EXERCISES_BY_ID } from './data/exercises';
import { ExerciseMedia } from './components/ExerciseMedia';
import { WorkoutPlayer } from './components/WorkoutPlayer';
import { LanguageProvider, useLanguage } from './i18n';

const TV_WORKOUTS: Workout[] = PROGRAMS.flatMap(program =>
  program.days
    .filter(day => !day.isRestDay && day.exercises.length > 0)
    .slice(0, 2)
    .map(day => ({
      id: `tv-${program.id}-${day.dayNumber}`,
      title: day.title,
      description: day.focus,
      category: program.category as Workout['category'],
      difficulty: program.difficulty,
      estimatedMinutes: day.durationMinutes,
      exercises: day.exercises,
    })),
);

function TvContent() {
  const { language } = useLanguage();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
  const selectedWorkout = TV_WORKOUTS[selectedIndex];

  const exercisePreviews = useMemo(
    () => selectedWorkout.exercises
      .map(item => EXERCISES_BY_ID.get(item.exerciseId))
      .filter((exercise): exercise is Exercise => Boolean(exercise)),
    [selectedWorkout],
  );

  const moveSelection = (direction: number) => {
    setSelectedIndex(index => (index + direction + TV_WORKOUTS.length) % TV_WORKOUTS.length);
  };

  const finishWorkout = (_log: WorkoutLog) => setActiveWorkout(null);

  if (activeWorkout) {
    return (
      <WorkoutPlayer
        workout={activeWorkout}
        soundEnabled
        vibrationEnabled={false}
        onClose={() => setActiveWorkout(null)}
        onFinishWorkout={finishWorkout}
        onToggleSound={() => undefined}
      />
    );
  }

  return (
    <main
      className="tv-shell min-h-screen bg-zinc-950 text-white p-10 lg:p-16"
      tabIndex={0}
      onKeyDown={event => {
        if (event.key === 'ArrowLeft') moveSelection(-1);
        if (event.key === 'ArrowRight') moveSelection(1);
        if (event.key === 'Enter' || event.key === ' ') setActiveWorkout(selectedWorkout);
      }}
    >
      <header className="flex items-center justify-between max-w-[1500px] mx-auto">
        <div>
          <div className="flex items-center gap-4">
            <span className="text-5xl">🏠</span>
            <h1 className="text-5xl font-black tracking-tight">
              Home<span className="text-orange-500">Fit</span>
            </h1>
          </div>
          <p className="mt-3 text-xl text-zinc-400">Treinos em casa na sua TV</p>
        </div>
        <div className="flex items-center gap-3 text-zinc-400 text-lg">
          <MonitorPlay className="w-7 h-7 text-orange-500" />
          <span>{language === 'pt-BR' ? 'Modo TV' : 'TV mode'}</span>
        </div>
      </header>

      <section className="max-w-[1500px] mx-auto mt-14 grid grid-cols-[1.15fr_0.85fr] gap-12 items-stretch">
        <div className="rounded-[2rem] border border-zinc-800 bg-zinc-900/80 p-10 shadow-2xl">
          <span className="text-lg font-bold uppercase tracking-[0.25em] text-orange-400">
            Workout selecionado
          </span>
          <h2 className="mt-5 text-6xl font-black leading-tight">{selectedWorkout.title}</h2>
          <p className="mt-5 max-w-2xl text-2xl leading-relaxed text-zinc-300">{selectedWorkout.description}</p>

          <div className="mt-8 flex gap-4 text-lg text-zinc-300">
            <span className="rounded-xl bg-zinc-800 px-5 py-3">{selectedWorkout.estimatedMinutes} min</span>
            <span className="rounded-xl bg-zinc-800 px-5 py-3">{selectedWorkout.difficulty}</span>
            <span className="rounded-xl bg-zinc-800 px-5 py-3">{exercisePreviews.length} exercícios</span>
          </div>

          <button
            type="button"
            autoFocus
            onClick={() => setActiveWorkout(selectedWorkout)}
            className="mt-12 flex items-center gap-4 rounded-2xl bg-orange-600 px-8 py-5 text-2xl font-black shadow-lg shadow-orange-600/30 focus:outline-none focus:ring-4 focus:ring-orange-300"
          >
            <Play className="h-8 w-8 fill-current" />
            Iniciar treino
          </button>
        </div>

        <div className="rounded-[2rem] border border-zinc-800 bg-zinc-900/80 p-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black">Exercícios</h3>
            <div className="flex gap-2">
              <button type="button" onClick={() => moveSelection(-1)} aria-label="Treino anterior" className="rounded-xl bg-zinc-800 p-3 focus:ring-4 focus:ring-orange-300">
                <ChevronLeft className="h-7 w-7" />
              </button>
              <button type="button" onClick={() => moveSelection(1)} aria-label="Próximo treino" className="rounded-xl bg-zinc-800 p-3 focus:ring-4 focus:ring-orange-300">
                <ChevronRight className="h-7 w-7" />
              </button>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            {exercisePreviews.map((exercise, index) => (
              <div key={exercise.id} className="flex items-center gap-5 rounded-2xl bg-zinc-800/70 p-4">
                <span className="text-3xl">{exercise.icon}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xl font-bold">{index + 1}. {exercise.name}</p>
                  <p className="mt-1 truncate text-base text-zinc-400">{exercise.targetMuscles.slice(0, 3).join(' · ')}</p>
                </div>
                {exercise.freeExercise && (
                  <ExerciseMedia media={exercise.freeExercise} compact className="h-20 w-32 shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="mx-auto mt-10 flex max-w-[1500px] justify-between text-lg text-zinc-500">
        <span>Use ◀ ▶ para trocar o treino · OK/Enter para iniciar</span>
        <span>{selectedIndex + 1} / {TV_WORKOUTS.length}</span>
      </footer>
    </main>
  );
}

export default function TvApp() {
  return (
    <LanguageProvider>
      <TvContent />
    </LanguageProvider>
  );
}
