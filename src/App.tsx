import React, { useState, useEffect, useMemo } from 'react';
import {
  UserProfile,
  WorkoutLog,
  WeightEntry,
  Workout,
  ActiveProgramState,
  Exercise,
} from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { calculateStreak, getTodayString } from './utils/fitness';
import { PROGRAMS_BY_ID } from './data/programs';
import { EXERCISES_BY_ID } from './data/exercises';
import { Navbar } from './components/Navbar';
import { BottomNav, TabType } from './components/BottomNav';
import { OnboardingModal } from './components/OnboardingModal';
import { WorkoutPlayer } from './components/WorkoutPlayer';
import { ExerciseModal } from './components/ExerciseModal';
import { HomeView } from './components/views/HomeView';
import { WorkoutsView } from './components/views/WorkoutsView';
import { CustomBuilderView } from './components/views/CustomBuilderView';
import { ProgressView } from './components/views/ProgressView';
import { ProfileView } from './components/views/ProfileView';
import { LanguageProvider } from './i18n';

// Default initial user profile
const DEFAULT_PROFILE: UserProfile = {
  goal: 'stay_fit',
  fitnessLevel: 'beginner',
  availableMinutes: 20,
  equipment: 'none',
  weeklyGoalDays: 4,
  weightUnit: 'kg',
  currentWeight: 70,
  targetWeight: 66,
  soundEnabled: true,
  vibrationEnabled: true,
  hasCompletedOnboarding: false,
};

// Seed demo workout logs so charts & streaks are immediately rewarding
const INITIAL_LOGS: WorkoutLog[] = [
  {
    id: 'seed-log-1',
    date: '2026-10-27',
    timestamp: Date.now() - 2 * 86400000,
    workoutTitle: 'Full Body Ignite',
    workoutCategory: 'Full Body',
    durationMinutes: 15,
    durationSeconds: 900,
    caloriesBurned: 135,
    exercisesCompleted: 5,
    feeling: 'great',
  },
  {
    id: 'seed-log-2',
    date: '2026-10-28',
    timestamp: Date.now() - 86400000,
    workoutTitle: 'Core Stability & Spine',
    workoutCategory: 'Core/Abs',
    durationMinutes: 14,
    durationSeconds: 840,
    caloriesBurned: 120,
    exercisesCompleted: 5,
    feeling: 'good',
  },
];

// Seed weight history for Recharts
const INITIAL_WEIGHTS: WeightEntry[] = [
  { id: 'w-1', date: '2026-10-01', weight: 72.0, note: 'Starting HomeFit' },
  { id: 'w-2', date: '2026-10-08', weight: 71.4 },
  { id: 'w-3', date: '2026-10-15', weight: 70.8 },
  { id: 'w-4', date: '2026-10-22', weight: 70.4 },
  { id: 'w-5', date: '2026-10-29', weight: 70.0, note: 'Consistent workouts' },
];

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<TabType>('home');

  // Dark Mode State
  const [darkMode, setDarkMode] = useLocalStorage<boolean>('homefit_darkmode', false);

  // User Profile
  const [profile, setProfile] = useLocalStorage<UserProfile>('homefit_profile', DEFAULT_PROFILE);

  // Workout Logs
  const [workoutLogs, setWorkoutLogs] = useLocalStorage<WorkoutLog[]>('homefit_workout_logs', INITIAL_LOGS);

  // Custom Workouts
  const [customWorkouts, setCustomWorkouts] = useLocalStorage<Workout[]>('homefit_custom_workouts', [
    {
      id: 'custom-preset-1',
      title: 'Morning Energy Booster',
      description: 'Quick morning jumpstart for full body tone.',
      category: 'Full Body',
      difficulty: 'Beginner',
      estimatedMinutes: 12,
      isCustom: true,
      exercises: [
        { exerciseId: 'jumping-jacks', workSec: 40, restSec: 20 },
        { exerciseId: 'bodyweight-squats', workSec: 40, restSec: 20 },
        { exerciseId: 'standard-pushups', workSec: 35, restSec: 20 },
        { exerciseId: 'forearm-plank', workSec: 45, restSec: 20 },
      ],
    },
  ]);

  // Weight History
  const [weightEntries, setWeightEntries] = useLocalStorage<WeightEntry[]>('homefit_weight_entries', INITIAL_WEIGHTS);

  // Active Program
  const [activeProgram, setActiveProgram] = useLocalStorage<ActiveProgramState | null>(
    'homefit_active_program',
    {
      programId: '7-day-kickstart',
      currentDay: 3,
      completedDays: [1, 2],
      startDate: '2026-10-27',
    }
  );

  // Active Overlays
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
  const [selectedExerciseForModal, setSelectedExerciseForModal] = useState<Exercise | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Support ?autostart=1 or initial check
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const autostart = params.get('autostart') === '1';

    if (autostart) {
      if (!profile.hasCompletedOnboarding) {
        setProfile(p => ({ ...p, hasCompletedOnboarding: true }));
      }
      setShowOnboarding(false);
    } else if (!profile.hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  }, [profile.hasCompletedOnboarding, setProfile]);

  // Sync dark mode class with html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Calculate streaks
  const { currentStreak, bestStreak } = useMemo(() => {
    const dates = workoutLogs.map(l => l.date);
    return calculateStreak(dates, getTodayString());
  }, [workoutLogs]);

  // Start Workout Handlers
  const handleStartWorkout = (workout: Workout) => {
    setActiveWorkout(workout);
  };

  const handleFinishWorkout = (log: WorkoutLog) => {
    setWorkoutLogs(prev => [log, ...prev]);
    setActiveWorkout(null);

    // If workout was part of active program, advance program day!
    if (activeProgram) {
      const prog = PROGRAMS_BY_ID.get(activeProgram.programId);
      if (prog) {
        const nextDay = Math.min(prog.durationDays, activeProgram.currentDay + 1);
        setActiveProgram({
          ...activeProgram,
          completedDays: Array.from(new Set([...activeProgram.completedDays, activeProgram.currentDay])),
          currentDay: nextDay,
        });
      }
    }
  };

  const handleStartSingleExercise = (exercise: Exercise) => {
    const singleWorkout: Workout = {
      id: 'single-' + exercise.id,
      title: exercise.name,
      description: `Focus session: ${exercise.name}`,
      category: exercise.category,
      difficulty: exercise.difficulty,
      estimatedMinutes: 2,
      exercises: [
        {
          exerciseId: exercise.id,
          workSec: exercise.defaultDuration || 40,
          restSec: 15,
        },
      ],
    };
    setSelectedExerciseForModal(null);
    setActiveWorkout(singleWorkout);
  };

  const handleSelectProgramDay = (programId: string, dayNumber: number) => {
    const prog = PROGRAMS_BY_ID.get(programId);
    if (!prog) return;
    const day = prog.days.find(d => d.dayNumber === dayNumber);
    if (!day || day.isRestDay || day.exercises.length === 0) return;

    const dayWorkout: Workout = {
      id: `${programId}-day-${dayNumber}`,
      title: `${prog.title} (Day ${dayNumber})`,
      description: day.title + ' — ' + day.focus,
      category: prog.category as any,
      difficulty: prog.difficulty,
      estimatedMinutes: day.durationMinutes,
      exercises: day.exercises,
    };

    setActiveWorkout(dayWorkout);
  };

  const handleEnrollProgram = (programId: string) => {
    setActiveProgram({
      programId,
      currentDay: 1,
      completedDays: [],
      startDate: getTodayString(),
    });
  };

  const handleSaveCustomWorkout = (workout: Workout) => {
    setCustomWorkouts(prev => {
      const existsIndex = prev.findIndex(w => w.id === workout.id);
      if (existsIndex >= 0) {
        const updated = [...prev];
        updated[existsIndex] = workout;
        return updated;
      }
      return [workout, ...prev];
    });
  };

  const handleDeleteCustomWorkout = (workoutId: string) => {
    setCustomWorkouts(prev => prev.filter(w => w.id !== workoutId));
  };

  const handleAddWeight = (entry: WeightEntry) => {
    setWeightEntries(prev => [...prev, entry]);
    setProfile(prev => ({
      ...prev,
      currentWeight: entry.weight,
    }));
  };

  const handleDeleteLog = (id: string) => {
    setWorkoutLogs(prev => prev.filter(l => l.id !== id));
  };

  const handleDeleteWeight = (id: string) => {
    setWeightEntries(prev => prev.filter(w => w.id !== id));
  };

  const handleResetAllData = () => {
    setWorkoutLogs([]);
    setWeightEntries([]);
    setCustomWorkouts([]);
    setActiveProgram(null);
    setProfile(DEFAULT_PROFILE);
    setShowOnboarding(true);
  };

  // Quick Start handler from Navbar
  const handleQuickStartNavbar = () => {
    handleStartWorkout({
      id: 'quick-start-sweat',
      title: '15-Min Quick Sweat',
      description: 'Zero-equipment full body sweat workout.',
      category: 'Full Body',
      difficulty: profile.fitnessLevel === 'advanced' ? 'Advanced' : 'Intermediate',
      estimatedMinutes: 15,
      exercises: [
        { exerciseId: 'jumping-jacks', workSec: 40, restSec: 20 },
        { exerciseId: 'bodyweight-squats', workSec: 40, restSec: 20 },
        { exerciseId: 'standard-pushups', workSec: 35, restSec: 20 },
        { exerciseId: 'mountain-climbers', workSec: 35, restSec: 20 },
        { exerciseId: 'forearm-plank', workSec: 45, restSec: 20 },
      ],
    });
  };

  return (
    <LanguageProvider>
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Header Navbar */}
      <Navbar
        currentStreak={currentStreak}
        darkMode={darkMode}
        soundEnabled={profile.soundEnabled}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onToggleSound={() => setProfile(p => ({ ...p, soundEnabled: !p.soundEnabled }))}
        onQuickStart={handleQuickStartNavbar}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 pt-5 pb-20">
        {activeTab === 'home' && (
          <HomeView
            profile={profile}
            streak={currentStreak}
            workoutLogs={workoutLogs}
            activeProgram={activeProgram}
            onStartWorkout={handleStartWorkout}
            onNavigateTab={setActiveTab}
            onSelectProgramDay={handleSelectProgramDay}
          />
        )}

        {activeTab === 'workouts' && (
          <WorkoutsView
            activeProgram={activeProgram}
            onSelectExercise={ex => setSelectedExerciseForModal(ex)}
            onStartWorkout={handleStartWorkout}
            onEnrollProgram={handleEnrollProgram}
            onSelectProgramDay={handleSelectProgramDay}
          />
        )}

        {activeTab === 'custom' && (
          <CustomBuilderView
            customWorkouts={customWorkouts}
            onSaveCustomWorkout={handleSaveCustomWorkout}
            onDeleteCustomWorkout={handleDeleteCustomWorkout}
            onStartWorkout={handleStartWorkout}
          />
        )}

        {activeTab === 'progress' && (
          <ProgressView
            logs={workoutLogs}
            weightEntries={weightEntries}
            profile={profile}
            currentStreak={currentStreak}
            bestStreak={bestStreak}
            onAddWeight={handleAddWeight}
            onDeleteLog={handleDeleteLog}
            onDeleteWeight={handleDeleteWeight}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            profile={profile}
            onUpdateProfile={setProfile}
            onRetakeOnboarding={() => setShowOnboarding(true)}
            onResetAllData={handleResetAllData}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} />

      {/* Onboarding Questionnaire Modal */}
      <OnboardingModal
        initialProfile={profile}
        isOpen={showOnboarding}
        onSave={updated => {
          setProfile(updated);
          setShowOnboarding(false);
        }}
        onClose={profile.hasCompletedOnboarding ? () => setShowOnboarding(false) : undefined}
      />

      {/* Exercise Details Modal */}
      <ExerciseModal
        exercise={selectedExerciseForModal}
        onClose={() => setSelectedExerciseForModal(null)}
        onStartSingle={handleStartSingleExercise}
        onAddToCustom={ex => {
          setActiveTab('custom');
          setSelectedExerciseForModal(null);
        }}
      />

      {/* Full-Screen Workout Player */}
      {activeWorkout && (
        <WorkoutPlayer
          workout={activeWorkout}
          soundEnabled={profile.soundEnabled}
          vibrationEnabled={profile.vibrationEnabled}
          userWeightKg={profile.currentWeight || 70}
          onClose={() => setActiveWorkout(null)}
          onFinishWorkout={handleFinishWorkout}
          onToggleSound={() => setProfile(p => ({ ...p, soundEnabled: !p.soundEnabled }))}
        />
      )}
    </div>
    </LanguageProvider>
  );
}
