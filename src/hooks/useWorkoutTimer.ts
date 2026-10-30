import { useState, useEffect, useRef, useCallback } from 'react';
import { WorkoutExerciseItem } from '../types';
import { playCountdownBeep, playTransitionBeep, playFanfare, triggerVibration } from '../utils/sound';

export type TimerPhase = 'warmup' | 'work' | 'rest' | 'completed';

export interface UseWorkoutTimerOptions {
  exercises: WorkoutExerciseItem[];
  warmupSec?: number;
  soundEnabled?: boolean;
  vibrationEnabled?: boolean;
  onComplete?: (totalElapsedSec: number, completedCount: number) => void;
}

export function useWorkoutTimer({
  exercises,
  warmupSec = 5,
  soundEnabled = true,
  vibrationEnabled = true,
  onComplete,
}: UseWorkoutTimerOptions) {
  const [phase, setPhase] = useState<TimerPhase>('warmup');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(warmupSec);
  const [isPaused, setIsPaused] = useState(false);
  const [totalElapsedSec, setTotalElapsedSec] = useState(0);

  // Keep references to options so effect closures don't get stale
  const soundRef = useRef(soundEnabled);
  soundRef.current = soundEnabled;
  const vibrationRef = useRef(vibrationEnabled);
  vibrationRef.current = vibrationEnabled;
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const currentExerciseItem = exercises[currentIndex] || null;
  const nextExerciseItem = exercises[currentIndex + 1] || null;

  // Max duration for the current interval (for circular progress calculation)
  const currentIntervalTotal =
    phase === 'warmup'
      ? warmupSec
      : phase === 'work'
      ? (currentExerciseItem?.workSec || 30)
      : (currentExerciseItem?.restSec || 15);

  const handleNext = useCallback(() => {
    if (phase === 'warmup') {
      // Transition from warmup into first exercise WORK
      setPhase('work');
      setTimeRemaining(exercises[0]?.workSec || 30);
      if (soundRef.current) playTransitionBeep(true);
      if (vibrationRef.current) triggerVibration([200]);
    } else if (phase === 'work') {
      // If there are more exercises and restSec > 0, go to rest
      if (currentIndex < exercises.length - 1 && (currentExerciseItem?.restSec || 0) > 0) {
        setPhase('rest');
        setTimeRemaining(currentExerciseItem?.restSec || 15);
        if (soundRef.current) playTransitionBeep(false);
        if (vibrationRef.current) triggerVibration([100, 50, 100]);
      } else if (currentIndex < exercises.length - 1) {
        // No rest interval, jump straight to next work
        setCurrentIndex(prev => prev + 1);
        setPhase('work');
        setTimeRemaining(exercises[currentIndex + 1]?.workSec || 30);
        if (soundRef.current) playTransitionBeep(true);
        if (vibrationRef.current) triggerVibration([200]);
      } else {
        // Workout complete!
        setPhase('completed');
        setTimeRemaining(0);
        if (soundRef.current) playFanfare();
        if (vibrationRef.current) triggerVibration([200, 100, 200, 100, 400]);
        if (onCompleteRef.current) {
          onCompleteRef.current(totalElapsedSec, exercises.length);
        }
      }
    } else if (phase === 'rest') {
      // Transition from rest to next exercise WORK
      const nextIdx = currentIndex + 1;
      if (nextIdx < exercises.length) {
        setCurrentIndex(nextIdx);
        setPhase('work');
        setTimeRemaining(exercises[nextIdx]?.workSec || 30);
        if (soundRef.current) playTransitionBeep(true);
        if (vibrationRef.current) triggerVibration([200]);
      } else {
        setPhase('completed');
        setTimeRemaining(0);
        if (soundRef.current) playFanfare();
        if (onCompleteRef.current) {
          onCompleteRef.current(totalElapsedSec, exercises.length);
        }
      }
    }
  }, [phase, currentIndex, exercises, currentExerciseItem, totalElapsedSec]);

  const handlePrevious = useCallback(() => {
    if (phase === 'rest') {
      // Jump back to the current work
      setPhase('work');
      setTimeRemaining(currentExerciseItem?.workSec || 30);
    } else if (currentIndex > 0) {
      // Jump back to previous exercise
      const prevIdx = currentIndex - 1;
      setCurrentIndex(prevIdx);
      setPhase('work');
      setTimeRemaining(exercises[prevIdx]?.workSec || 30);
    } else {
      // Reset back to warmup
      setPhase('warmup');
      setTimeRemaining(warmupSec);
    }
  }, [phase, currentIndex, exercises, currentExerciseItem, warmupSec]);

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  const restartInterval = useCallback(() => {
    setTimeRemaining(currentIntervalTotal);
  }, [currentIntervalTotal]);

  const finishEarly = useCallback(() => {
    setPhase('completed');
    setTimeRemaining(0);
    if (soundRef.current) playFanfare();
    if (onCompleteRef.current) {
      onCompleteRef.current(totalElapsedSec, Math.max(1, currentIndex + (phase === 'work' ? 1 : 0)));
    }
  }, [totalElapsedSec, currentIndex, phase]);

  // Main countdown ticker
  useEffect(() => {
    if (phase === 'completed' || isPaused || exercises.length === 0) return;

    const interval = setInterval(() => {
      setTotalElapsedSec(prev => prev + 1);

      setTimeRemaining(prevTime => {
        // Sound countdown blips on 3, 2, 1
        if (prevTime <= 4 && prevTime > 1 && soundRef.current) {
          playCountdownBeep(prevTime === 2 ? 500 : 440);
        }

        if (prevTime <= 1) {
          // Trigger next phase on next tick
          handleNext();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase, isPaused, exercises.length, handleNext]);

  return {
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
  };
}
