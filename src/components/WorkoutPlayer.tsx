import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
  ChevronRight,
  Flame,
  Clock,
  Sparkles,
  Smile,
  ThumbsUp,
  Zap,
  BatteryLow
} from 'lucide-react';
import { Workout, Exercise, WorkoutLog } from '../types';
import { EXERCISES_BY_ID } from '../data/exercises';
import { useWorkoutTimer } from '../hooks/useWorkoutTimer';
import { ExerciseIllustration } from './ExerciseIllustration';
import { ExerciseMedia } from './ExerciseMedia';
import { estimateCaloriesBurned, formatTime, getTodayString } from '../utils/fitness';

interface WorkoutPlayerProps {
  workout: Workout;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  userWeightKg?: number;
  onClose: () => void;
  onFinishWorkout: (log: WorkoutLog) => void;
  onToggleSound: () => void;
}

export const WorkoutPlayer: React.FC<WorkoutPlayerProps> = ({
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
  const [feeling, setFeeling] = useState<'great' | 'good' | 'hard' | 'exhausted'>('great');

  const {
    phase,
    currentIndex,
    currentExerciseItem,
    nextExerciseItem,
    timeRemaining,
    currentIntervalTotal,
    isPaused,
    totalElapsedSec,
    togglePause,
    handleNext,
    handlePrevious,
    restartInterval,
    finishEarly,
  } = useWorkoutTimer({
    exercises: workout.exercises,
    warmupSec: 5,
    soundEnabled,
    vibrationEnabled,
    onComplete: (elapsed, count) => {
      const burned = estimateCaloriesBurned(elapsed, 9.0, userWeightKg);
      const log: WorkoutLog = {
        id: 'log-' + Date.now(),
        date: getTodayString(),
        timestamp: Date.now(),
        workoutTitle: workout.title,
        workoutCategory: workout.category,
        durationMinutes: Math.max(1, Math.round(elapsed / 60)),
        durationSeconds: elapsed,
        caloriesBurned: burned,
        exercisesCompleted: count,
        feeling: 'great',
      };
      setCompletedLog(log);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    },
  });

  useEffect(() => {
    const handleRemoteKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        handlePrevious();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        handleNext();
      } else if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        togglePause();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        setShowExitConfirm(true);
      }
    };

    window.addEventListener('keydown', handleRemoteKey);
    return () => window.removeEventListener('keydown', handleRemoteKey);
  }, [handleNext, handlePrevious, togglePause]);

  // Safe exercise lookups
  const currentEx: Exercise | undefined = currentExerciseItem
    ? EXERCISES_BY_ID.get(currentExerciseItem.exerciseId)
    : undefined;

  const nextEx: Exercise | undefined = nextExerciseItem
    ? EXERCISES_BY_ID.get(nextExerciseItem.exerciseId)
    : undefined;

  // Background gradient and color theme based on phase
  const getPhaseStyles = () => {
    switch (phase) {
      case 'warmup':
        return {
          bg: 'bg-zinc-950',
          accent: 'text-amber-400',
          ring: 'stroke-amber-400',
          pillBg: 'bg-amber-400/20 text-amber-300 border-amber-400/40',
          label: 'GET READY',
        };
      case 'work':
        return {
          bg: 'bg-zinc-950',
          accent: 'text-orange-500',
          ring: 'stroke-orange-500',
          pillBg: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
          label: 'WORK IT',
        };
      case 'rest':
        return {
          bg: 'bg-zinc-950',
          accent: 'text-cyan-400',
          ring: 'stroke-cyan-400',
          pillBg: 'bg-cyan-400/20 text-cyan-300 border-cyan-400/40',
          label: 'REST & BREATHE',
        };
      case 'completed':
        return {
          bg: 'bg-zinc-950',
          accent: 'text-emerald-400',
          ring: 'stroke-emerald-400',
          pillBg: 'bg-emerald-400/20 text-emerald-300 border-emerald-400/40',
          label: 'COMPLETE',
        };
    }
  };

  const currentStyles = getPhaseStyles();

  // Circular timer calculation
  const circleRadius = 110;
  const circumference = 2 * Math.PI * circleRadius;
  const progressRatio = currentIntervalTotal > 0 ? timeRemaining / currentIntervalTotal : 0;
  const strokeDashoffset = circumference - progressRatio * circumference;

  // Overall workout progress
  const totalExercises = workout.exercises.length;
  const overallProgress = Math.min(
    100,
    Math.round(((currentIndex + (phase === 'rest' ? 1 : 0.5)) / totalExercises) * 100)
  );

  // If completed, show celebration screen
  if (phase === 'completed' && completedLog) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950 text-white p-4 overflow-y-auto">
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 text-center space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center text-4xl animate-bounce">
            🎉
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Workout Complete
            </span>
            <h2 className="text-2xl font-black mt-1 text-zinc-100">{workout.title}</h2>
            <p className="text-xs text-zinc-400 mt-1">
              Outstanding consistency! Your effort today counts toward your weekly goal.
            </p>
          </div>

          {/* Stats summary */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 rounded-2xl bg-zinc-800/80 border border-zinc-700/60">
              <Clock className="w-4 h-4 mx-auto text-orange-400 mb-1" />
              <div className="text-base font-extrabold text-white">
                {formatTime(completedLog.durationSeconds)}
              </div>
              <div className="text-[10px] text-zinc-400 font-medium">Active Time</div>
            </div>

            <div className="p-3 rounded-2xl bg-zinc-800/80 border border-zinc-700/60">
              <Flame className="w-4 h-4 mx-auto text-red-400 mb-1" />
              <div className="text-base font-extrabold text-white">
                ~{completedLog.caloriesBurned}
              </div>
              <div className="text-[10px] text-zinc-400 font-medium">Est. Kcal</div>
            </div>

            <div className="p-3 rounded-2xl bg-zinc-800/80 border border-zinc-700/60">
              <Sparkles className="w-4 h-4 mx-auto text-amber-400 mb-1" />
              <div className="text-base font-extrabold text-white">
                {completedLog.exercisesCompleted}
              </div>
              <div className="text-[10px] text-zinc-400 font-medium">Exercises</div>
            </div>
          </div>

          {/* How do you feel selector */}
          <div className="text-left space-y-2">
            <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              How did it feel?
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { key: 'great', label: 'Great', icon: Smile, color: 'text-emerald-400' },
                { key: 'good', label: 'Good', icon: ThumbsUp, color: 'text-blue-400' },
                { key: 'hard', label: 'Tough', icon: Zap, color: 'text-amber-400' },
                { key: 'exhausted', label: 'Maxed', icon: BatteryLow, color: 'text-red-400' },
              ].map(f => {
                const Icon = f.icon;
                const isSelected = feeling === f.key;
                return (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setFeeling(f.key as any)}
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                      isSelected
                        ? 'border-orange-500 bg-orange-500/20 text-white font-bold'
                        : 'border-zinc-800 bg-zinc-800/40 text-zinc-400 hover:bg-zinc-800'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${f.color}`} />
                    <span className="text-[11px]">{f.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => {
              onFinishWorkout({
                ...completedLog,
                feeling,
              });
            }}
            className="w-full py-4 rounded-2xl bg-orange-600 hover:bg-orange-500 font-bold text-sm text-white shadow-xl shadow-orange-600/30 active:scale-98 transition-all"
          >
            Save Workout & Finish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      role="region"
      aria-label="Workout Player"
      className={`fixed inset-0 z-50 flex flex-col justify-between ${currentStyles.bg} text-white select-none overflow-hidden transition-colors duration-500`}
    >
      {/* Top Navigation & Status */}
      <div className="p-4 sm:p-6 pb-2">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setShowExitConfirm(true)}
            aria-label="Quit workout"
            className="p-2.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              {workout.title}
            </span>
            <div className="text-xs font-semibold text-zinc-200">
              Exercise {currentIndex + 1} of {totalExercises}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleSound}
              aria-label={soundEnabled ? 'Mute sound' : 'Unmute sound'}
              className="p-2.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-5 h-5 text-orange-400" /> : <VolumeX className="w-5 h-5 text-zinc-500" />}
            </button>
          </div>
        </div>

        {/* Global Workout Progress Bar */}
        <div className="w-full h-1.5 bg-zinc-800/80 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-300"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Main Center Stage */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 max-w-md mx-auto w-full space-y-4">
        {/* Phase Pill */}
        <div className={`px-4 py-1.5 rounded-full border text-xs font-black tracking-widest uppercase transition-all ${currentStyles.pillBg}`}>
          {phase === 'warmup' ? 'GET READY' : phase === 'work' ? 'WORK TIME' : 'REST INTERVAL'}
        </div>

        {/* Circular Countdown Timer */}
        <div className="relative flex items-center justify-center">
          <svg className="w-64 h-64 -rotate-90 transform">
            <circle
              cx="128"
              cy="128"
              r={circleRadius}
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              className="text-zinc-800/70"
            />
            <circle
              cx="128"
              cy="128"
              r={circleRadius}
              stroke="currentColor"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className={`${currentStyles.ring} transition-all duration-500`}
            />
          </svg>

          {/* Center Digital Display */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-6xl sm:text-7xl font-black tracking-tight tabular-nums font-mono drop-shadow-md">
              {timeRemaining}
            </span>
            <span className="text-xs uppercase font-bold tracking-wider text-zinc-400 mt-1">
              Seconds
            </span>
            {isPaused && (
              <span className="mt-1 px-2.5 py-0.5 rounded-full bg-amber-500 text-zinc-950 text-[10px] font-black uppercase tracking-wider">
                Paused
              </span>
            )}
          </div>
        </div>

        {/* Current Exercise Detail Card */}
        <div className="w-full bg-zinc-900/90 border border-zinc-800 rounded-3xl p-4 text-center space-y-2 backdrop-blur-md">
          {phase === 'warmup' ? (
            <div>
              <span className="text-xs text-zinc-400 uppercase font-bold tracking-wider">Starting with</span>
              <h3 className="text-xl font-black text-white mt-0.5">
                {currentEx?.name || 'First Exercise'}
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Take a deep breath and prepare your stance.
              </p>
            </div>
          ) : phase === 'rest' ? (
            <div>
              <span className="text-xs text-cyan-400 uppercase font-bold tracking-wider">Coming Up Next</span>
              <h3 className="text-lg font-black text-white mt-0.5 flex items-center justify-center gap-1.5">
                <span>{nextEx?.icon || '💪'}</span>
                <span>{nextEx?.name || 'Next Exercise'}</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-1 line-clamp-1">
                {nextEx?.instructions?.[0] || 'Get into position'}
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl">{currentEx?.icon || '💪'}</span>
                <h3 className="text-xl font-black text-white">
                  {currentEx?.name || 'Current Exercise'}
                </h3>
              </div>
              <div className="flex items-center justify-center gap-1.5 mt-1.5">
                {currentEx?.targetMuscles.slice(0, 3).map(m => (
                  <span
                    key={m}
                    className="px-2 py-0.5 rounded-md bg-zinc-800 text-[10px] text-zinc-300 font-medium"
                  >
                    {m}
                  </span>
                ))}
              </div>
              <p className="text-xs text-zinc-400 mt-2 line-clamp-2 px-2">
                {currentEx?.instructions?.[0] || 'Focus on controlled form'}
              </p>
            </div>
          )}
        </div>

        {/* Small Exercise Illustration Preview during active work */}
        {phase === 'work' && currentEx && (
          <div className="hidden sm:block w-full">
            {currentEx.freeExercise ? (
              <ExerciseMedia media={currentEx.freeExercise} compact className="w-full h-32" />
            ) : (
              <ExerciseIllustration
                type={currentEx.animationType}
                isPaused={isPaused}
                icon={currentEx.icon}
                className="w-full h-28"
              />
            )}
          </div>
        )}
      </div>

      {/* Bottom Floating Control Bar */}
      <div className="p-4 sm:p-6 pt-2 bg-gradient-to-t from-zinc-950 via-zinc-950 to-transparent">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          {/* Previous Exercise */}
          <button
            onClick={handlePrevious}
            aria-label="Previous exercise"
            className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 flex items-center justify-center transition-all active:scale-95"
          >
            <SkipBack className="w-5 h-5" />
          </button>

          {/* Restart Current Interval */}
          <button
            onClick={restartInterval}
            aria-label="Restart interval"
            className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 flex items-center justify-center transition-all active:scale-95"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          {/* Main Play / Pause Button */}
          <button
            onClick={togglePause}
            aria-label={isPaused ? 'Resume workout' : 'Pause workout'}
            className="flex-1 py-4 px-6 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-orange-600/30 transition-all active:scale-98"
          >
            {isPaused ? (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>Resume</span>
              </>
            ) : (
              <>
                <Pause className="w-5 h-5 fill-current" />
                <span>Pause</span>
              </>
            )}
          </button>

          {/* Skip Next */}
          <button
            onClick={handleNext}
            aria-label="Skip to next"
            className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 flex items-center justify-center transition-all active:scale-95"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Finish early link */}
        <div className="text-center mt-3">
          <button
            onClick={finishEarly}
            className="text-[11px] font-semibold text-zinc-500 hover:text-zinc-300 underline underline-offset-4"
          >
            Finish & Log Early
          </button>
        </div>
      </div>

      {/* Quit Confirmation Dialog */}
      {showExitConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4"
        >
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-5 text-center space-y-4">
            <h3 className="text-lg font-bold text-white">Quit Current Workout?</h3>
            <p className="text-xs text-zinc-400">
              You've already spent {formatTime(totalElapsedSec)} working hard. Are you sure you want to stop now?
            </p>
            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-zinc-800 text-xs font-semibold text-zinc-200 hover:bg-zinc-700"
              >
                Keep Going
              </button>
              <button
                onClick={() => {
                  setShowExitConfirm(false);
                  onClose();
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-600/90 text-xs font-semibold text-white hover:bg-red-500"
              >
                Quit Workout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
