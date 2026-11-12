import React, { useEffect, useMemo, useState } from 'react';
import { Pause, Play, SkipBack, SkipForward, Volume2, VolumeX, X } from 'lucide-react';
import { Exercise, Workout, WorkoutLog } from '../types';
import { EXERCISES_BY_ID } from '../data/exercises';
import { useWorkoutTimer } from '../hooks/useWorkoutTimer';
import { estimateCaloriesBurned, formatTime, getTodayString } from '../utils/fitness';
import { translateExerciseText } from '../i18n';

interface TvWorkoutPlayerProps {
  workout: Workout;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  userWeightKg?: number;
  onClose: () => void;
  onFinishWorkout: (log: WorkoutLog) => void;
  onToggleSound: () => void;
}

export const TvWorkoutPlayer: React.FC<TvWorkoutPlayerProps> = ({
  workout,
  soundEnabled,
  vibrationEnabled,
  userWeightKg = 70,
  onClose,
  onFinishWorkout,
  onToggleSound,
}) => {
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [completedLog, setCompletedLog] = useState<WorkoutLog | null>(null);

  const translate = (text: string) => translateExerciseText(text, 'pt-BR');

  const {
    phase,
    currentIndex,
    currentExerciseItem,
    nextExerciseItem,
    timeRemaining,
    isPaused,
    totalElapsedSec,
    togglePause,
    handleNext,
    handlePrevious,
    finishEarly,
  } = useWorkoutTimer({
    exercises: workout.exercises,
    warmupSec: 5,
    soundEnabled,
    vibrationEnabled,
    onComplete: (elapsed, count) => {
      const log: WorkoutLog = {
        id: 'tv-log-' + Date.now(),
        date: getTodayString(),
        timestamp: Date.now(),
        workoutTitle: workout.title,
        workoutCategory: workout.category,
        durationMinutes: Math.max(1, Math.round(elapsed / 60)),
        durationSeconds: elapsed,
        caloriesBurned: estimateCaloriesBurned(elapsed, 8.8, userWeightKg),
        exercisesCompleted: count,
        feeling: 'good',
      };
      setCompletedLog(log);
    },
  });

  const currentExercise: Exercise | null = currentExerciseItem
    ? EXERCISES_BY_ID.get(currentExerciseItem.exerciseId) || null
    : null;

  const nextExercise: Exercise | null = nextExerciseItem
    ? EXERCISES_BY_ID.get(nextExerciseItem.exerciseId) || null
    : null;

  const displayExercise = useMemo(() => {
    if (phase === 'rest') return nextExercise || currentExercise;
    return currentExercise || nextExercise;
  }, [phase, currentExercise, nextExercise]);

  const displayExerciseName = displayExercise ? translate(displayExercise.name) : 'Exercicio';

  const primaryMuscles = (displayExercise?.targetMuscles || [])
    .map((muscle) => translate(muscle))
    .slice(0, 4)
    .join(' · ');

  const secondaryMuscles = (displayExercise?.freeExercise?.secondaryMuscles || [])
    .map((muscle) => translate(muscle))
    .slice(0, 3)
    .join(' · ');

  const videoSrc = displayExercise?.freeExercise?.videos?.female || displayExercise?.freeExercise?.videos?.male;
  const videoPoster = displayExercise?.freeExercise?.thumbnails?.female || displayExercise?.freeExercise?.thumbnails?.male;
  const isFinalCountdown = (phase === 'work' || phase === 'warmup') && timeRemaining > 0 && timeRemaining <= 5;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        handlePrevious();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        handleNext();
      } else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        if (phase === 'completed' && completedLog) {
          onFinishWorkout(completedLog);
        } else {
          togglePause();
        }
      } else if (event.key === 'Escape') {
        event.preventDefault();
        if (phase === 'completed') {
          onFinishWorkout(completedLog || {
            id: 'tv-log-' + Date.now(),
            date: getTodayString(),
            timestamp: Date.now(),
            workoutTitle: workout.title,
            workoutCategory: workout.category,
            durationMinutes: Math.max(1, Math.round(totalElapsedSec / 60)),
            durationSeconds: totalElapsedSec,
            caloriesBurned: estimateCaloriesBurned(totalElapsedSec, 8.8, userWeightKg),
            exercisesCompleted: Math.max(1, currentIndex + 1),
            feeling: 'good',
          });
        } else {
          setShowExitConfirm(true);
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    handlePrevious,
    handleNext,
    togglePause,
    phase,
    completedLog,
    onFinishWorkout,
    workout,
    totalElapsedSec,
    userWeightKg,
    currentIndex,
  ]);

  const phaseLabel = phase === 'warmup'
    ? 'Aquecimento'
    : phase === 'work'
      ? 'Execucao'
      : phase === 'rest'
        ? 'Descanso'
        : 'Concluido';

  if (phase === 'completed' && completedLog) {
    return (
      <main className="tv-player-shell">
        <section className="tv-player-complete">
          <h2>Treino concluido</h2>
          <p>{workout.title}</p>
          <div className="tv-player-complete-stats">
            <span>Tempo: {formatTime(completedLog.durationSeconds)}</span>
            <span>Exercicios: {completedLog.exercisesCompleted}</span>
            <span>Calorias: {completedLog.caloriesBurned}</span>
          </div>
          <button
            type="button"
            className="tv-player-primary"
            onClick={() => onFinishWorkout(completedLog)}
          >
            Salvar e voltar
          </button>
          <p className="tv-player-hint">OK/Enter para salvar</p>
        </section>
      </main>
    );
  }

  return (
    <main className="tv-player-shell">
      <header className="tv-player-header">
        <div>
          <p className="tv-player-phase">{phaseLabel}</p>
          <h2>{translate(workout.title)}</h2>
          <p>Exercicio {Math.min(currentIndex + 1, workout.exercises.length)} de {workout.exercises.length}</p>
        </div>
        <button
          type="button"
          className="tv-player-close"
          aria-label="Sair treino"
          onClick={() => setShowExitConfirm(true)}
        >
          <X size={26} />
        </button>
      </header>

      {phase === 'rest' ? (
        <section className="tv-player-rest-stage">
          <div className="tv-player-rest-media">
            {videoSrc ? (
              <video
                key={videoSrc + '-rest-' + currentIndex}
                className="tv-player-video"
                src={videoSrc}
                poster={videoPoster}
                muted
                autoPlay
                playsInline
                loop
                preload="metadata"
              />
            ) : (
              <div className="tv-player-video-fallback">
                <span>{displayExercise?.icon || '💪'}</span>
                <p>Video nao disponivel</p>
              </div>
            )}
          </div>
          <div className="tv-player-rest-overlay" />
          <div className="tv-player-rest-center">
            <div className="tv-player-rest-timer">{timeRemaining}</div>
            <p className="tv-player-rest-label">Descanso...</p>
            <h3>Proximo exercicio: {displayExerciseName}</h3>
            <p>{primaryMuscles || 'Músculos principais indisponiveis'}</p>
          </div>
        </section>
      ) : (
        <section className="tv-player-stage">
          <div className="tv-player-video-window">
            {videoSrc ? (
              <video
                key={videoSrc + '-' + phase + '-' + currentIndex}
                className="tv-player-video"
                src={videoSrc}
                poster={videoPoster}
                muted
                autoPlay
                playsInline
                loop
                preload="metadata"
              />
            ) : (
              <div className="tv-player-video-fallback">
                <span>{displayExercise?.icon || '💪'}</span>
                <p>Video nao disponivel</p>
              </div>
            )}

            <div className="tv-player-timer-badge">{timeRemaining}</div>

            {isFinalCountdown && (
              <div className="tv-player-countdown-overlay" aria-live="assertive">
                <div className="tv-player-countdown-circle">{timeRemaining}</div>
              </div>
            )}
          </div>

          <div className="tv-player-info-window">
            <p className="tv-player-info-kicker">{phase === 'warmup' ? 'Preparacao' : 'Exercicio em execucao'}</p>
            <h3>{displayExerciseName}</h3>
            <p><strong>Músculos principais:</strong> {primaryMuscles || 'Indisponivel'}</p>
            <p><strong>Músculos secundários:</strong> {secondaryMuscles || 'Indisponivel'}</p>
            <p><strong>Dificuldade:</strong> {displayExercise ? translate(displayExercise.difficulty) : 'Indisponivel'}</p>
            <p><strong>Equipamento:</strong> {displayExercise ? translate(displayExercise.equipment) : 'Indisponivel'}</p>
            {isPaused && <p className="tv-player-paused">Pausado</p>}
          </div>
        </section>
      )}

      <footer className="tv-player-controls">
        <button type="button" onClick={handlePrevious} aria-label="Exercicio anterior" className="tv-player-icon-btn">
          <SkipBack size={24} />
        </button>

        <button type="button" onClick={togglePause} aria-label={isPaused ? 'Retomar treino' : 'Pausar treino'} className="tv-player-primary">
          {isPaused ? <Play size={22} /> : <Pause size={22} />}
          <span>{isPaused ? 'Retomar' : 'Pausar'}</span>
        </button>

        <button type="button" onClick={handleNext} aria-label="Proximo exercicio" className="tv-player-icon-btn">
          <SkipForward size={24} />
        </button>

        <button type="button" onClick={onToggleSound} aria-label={soundEnabled ? 'Desativar som' : 'Ativar som'} className="tv-player-icon-btn">
          {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </button>

        <button type="button" onClick={finishEarly} aria-label="Finalizar treino cedo" className="tv-player-secondary">
          Finalizar
        </button>
      </footer>

      <p className="tv-player-hint">◀ ▶ trocar exercicio · OK pausar/retomar · ESC sair</p>

      {showExitConfirm && (
        <div className="tv-player-modal-backdrop">
          <div className="tv-player-modal">
            <h3>Encerrar treino?</h3>
            <p>Tempo feito: {formatTime(totalElapsedSec)}</p>
            <div className="tv-player-modal-actions">
              <button type="button" className="tv-player-secondary" onClick={() => setShowExitConfirm(false)}>
                Continuar
              </button>
              <button type="button" className="tv-player-primary" onClick={onClose}>
                Sair
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
