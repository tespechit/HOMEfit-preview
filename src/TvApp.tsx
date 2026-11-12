import React, { useMemo, useState } from 'react';
import { Play, ChevronLeft, ChevronRight, MonitorPlay } from 'lucide-react';
import { Exercise, Workout, WorkoutLog } from './types';
import { PROGRAMS } from './data/programs';
import { EXERCISES_BY_ID } from './data/exercises';
import { ExerciseMedia } from './components/ExerciseMedia';
import { TvWorkoutPlayer } from './components/TvWorkoutPlayer';
import { LanguageProvider, useLanguage } from './i18n';

const TV_WORKOUTS: Workout[] = PROGRAMS.reduce<Workout[]>((acc, program) => {
  const items = program.days
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
    }));

  return acc.concat(items);
}, []);

function TvContent() {
  const { language } = useLanguage();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const selectedWorkout = TV_WORKOUTS[selectedIndex];

  if (TV_WORKOUTS.length === 0 || !selectedWorkout) {
    return (
      <main className="tv-shell tv-empty">
        <div className="tv-empty-content">
          <h1 className="tv-empty-title">HomeFit TV</h1>
          <p className="tv-empty-subtitle">
            {language === 'pt-BR' ? 'Nenhum treino disponivel para TV.' : 'No workouts available for TV mode.'}
          </p>
        </div>
      </main>
    );
  }

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
      <TvWorkoutPlayer
        workout={activeWorkout}
        soundEnabled={soundEnabled}
        vibrationEnabled={false}
        onClose={() => setActiveWorkout(null)}
        onFinishWorkout={finishWorkout}
        onToggleSound={() => setSoundEnabled(prev => !prev)}
      />
    );
  }

  return (
    <main
      className="tv-shell"
      tabIndex={0}
      onKeyDown={event => {
        if (event.key === 'ArrowLeft') moveSelection(-1);
        if (event.key === 'ArrowRight') moveSelection(1);
        if (event.key === 'Enter' || event.key === ' ') setActiveWorkout(selectedWorkout);
      }}
    >
      <header className="tv-header">
        <div>
          <div className="tv-brand-row">
            <span className="tv-brand-emoji">🏠</span>
            <h1 className="tv-brand-title">
              Home<span className="tv-brand-accent">Fit</span>
            </h1>
          </div>
          <p className="tv-brand-subtitle">Treinos em casa na sua TV</p>
        </div>
        <div className="tv-mode-pill">
          <MonitorPlay size={28} />
          <span>{language === 'pt-BR' ? 'Modo TV' : 'TV mode'}</span>
        </div>
      </header>

      <section className="tv-grid">
        <div className="tv-panel tv-main-panel">
          <span className="tv-kicker">
            Workout selecionado
          </span>
          <h2 className="tv-workout-title">{selectedWorkout.title}</h2>
          <p className="tv-workout-description">{selectedWorkout.description}</p>

          <div className="tv-meta-row">
            <span className="tv-chip">{selectedWorkout.estimatedMinutes} min</span>
            <span className="tv-chip">{selectedWorkout.difficulty}</span>
            <span className="tv-chip">{exercisePreviews.length} exercícios</span>
          </div>

          <button
            type="button"
            autoFocus
            onClick={() => setActiveWorkout(selectedWorkout)}
            className="tv-start-button"
          >
            <Play size={30} />
            Iniciar treino
          </button>
        </div>

        <div className="tv-panel tv-list-panel">
          <div className="tv-list-header">
            <h3 className="tv-list-title">Exercícios</h3>
            <div className="tv-nav-buttons">
              <button type="button" onClick={() => moveSelection(-1)} aria-label="Treino anterior" className="tv-icon-button">
                <ChevronLeft size={28} />
              </button>
              <button type="button" onClick={() => moveSelection(1)} aria-label="Próximo treino" className="tv-icon-button">
                <ChevronRight size={28} />
              </button>
            </div>
          </div>
          <div className="tv-exercise-list">
            {exercisePreviews.map((exercise, index) => (
              <div key={exercise.id} className="tv-exercise-row">
                <span className="tv-exercise-icon">{exercise.icon}</span>
                <div className="tv-exercise-text">
                  <p className="tv-exercise-name">{index + 1}. {exercise.name}</p>
                  <p className="tv-exercise-muscles">{exercise.targetMuscles.slice(0, 3).join(' · ')}</p>
                </div>
                {exercise.freeExercise && (
                  <ExerciseMedia media={exercise.freeExercise} compact className="tv-exercise-media" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="tv-footer">
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
