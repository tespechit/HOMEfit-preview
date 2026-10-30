import React from 'react';
import {
  Play,
  Flame,
  Award,
  Clock,
  Sparkles,
  ChevronRight,
  RefreshCw,
  Calendar,
  CheckCircle,
  Dumbbell
} from 'lucide-react';
import { UserProfile, Workout, WorkoutLog, ActiveProgramState } from '../../types';
import { MOTIVATIONAL_QUOTES } from '../../data/quotes';
import { PROGRAMS_BY_ID } from '../../data/programs';
import { calculateWeeklyProgress, formatTime } from '../../utils/fitness';

interface HomeViewProps {
  profile: UserProfile;
  streak: number;
  workoutLogs: WorkoutLog[];
  activeProgram: ActiveProgramState | null;
  onStartWorkout: (workout: Workout) => void;
  onNavigateTab: (tab: 'home' | 'workouts' | 'custom' | 'progress' | 'profile') => void;
  onSelectProgramDay: (programId: string, dayNumber: number) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  profile,
  streak,
  workoutLogs,
  activeProgram,
  onStartWorkout,
  onNavigateTab,
  onSelectProgramDay,
}) => {
  const [quoteIndex, setQuoteIndex] = React.useState(0);
  const currentQuote = MOTIVATIONAL_QUOTES[quoteIndex % MOTIVATIONAL_QUOTES.length];

  const cycleQuote = () => {
    setQuoteIndex(prev => prev + 1);
  };

  // Weekly goal calculation
  const workoutDates = workoutLogs.map(l => l.date);
  const weekly = calculateWeeklyProgress(workoutDates, profile.weeklyGoalDays);

  // Derive Today's Recommended Workout based on User Goal & Available Minutes
  const getRecommendedWorkout = (): Workout => {
    if (profile.goal === 'lose_weight') {
      return {
        id: 'rec-fat-burn',
        title: 'High-Tempo Metabolic Burn',
        description: 'Dynamic bodyweight intervals to ignite your metabolism and torch calories.',
        category: 'Cardio/HIIT',
        difficulty: profile.fitnessLevel === 'advanced' ? 'Advanced' : 'Intermediate',
        estimatedMinutes: profile.availableMinutes,
        exercises: [
          { exerciseId: 'jumping-jacks', workSec: 40, restSec: 20 },
          { exerciseId: 'bodyweight-squats', workSec: 40, restSec: 20 },
          { exerciseId: 'mountain-climbers', workSec: 35, restSec: 20 },
          { exerciseId: 'burpees', workSec: 35, restSec: 25 },
          { exerciseId: 'high-knees', workSec: 40, restSec: 20 },
          { exerciseId: 'forearm-plank', workSec: 45, restSec: 20 },
        ],
      };
    } else if (profile.goal === 'build_muscle') {
      return {
        id: 'rec-muscle-strength',
        title: 'Bodyweight Muscle Builder',
        description: 'Controlled progressive overload targeting chest, shoulders, legs, and abs.',
        category: 'Upper Body',
        difficulty: profile.fitnessLevel === 'advanced' ? 'Advanced' : 'Intermediate',
        estimatedMinutes: profile.availableMinutes,
        exercises: [
          { exerciseId: 'standard-pushups', workSec: 40, restSec: 25 },
          { exerciseId: 'bodyweight-squats', workSec: 45, restSec: 20 },
          { exerciseId: 'tricep-dips', workSec: 40, restSec: 20 },
          { exerciseId: 'forward-lunges', workSec: 40, restSec: 20 },
          { exerciseId: 'shoulder-taps', workSec: 40, restSec: 20 },
          { exerciseId: 'glute-bridges', workSec: 45, restSec: 20 },
        ],
      };
    } else if (profile.goal === 'flexibility') {
      return {
        id: 'rec-mobility-flow',
        title: 'Spinal Decompress & Hip Opener',
        description: 'Restorative yoga flow and gentle joint mobility to release deep stiffness.',
        category: 'Stretching/Yoga',
        difficulty: 'Beginner',
        estimatedMinutes: profile.availableMinutes,
        exercises: [
          { exerciseId: 'cat-cow-stretch', workSec: 50, restSec: 15 },
          { exerciseId: 'downward-dog', workSec: 45, restSec: 15 },
          { exerciseId: 'childs-pose', workSec: 60, restSec: 15 },
          { exerciseId: 'pigeon-pose', workSec: 50, restSec: 20 },
          { exerciseId: 'worlds-greatest-stretch', workSec: 50, restSec: 20 },
        ],
      };
    } else {
      // stay_fit
      return {
        id: 'rec-stay-fit-daily',
        title: 'Daily Vitality & Tone',
        description: 'Balanced full-body movement to elevate heart rate, tone muscle, and boost energy.',
        category: 'Full Body',
        difficulty: profile.fitnessLevel === 'advanced' ? 'Advanced' : 'Intermediate',
        estimatedMinutes: profile.availableMinutes,
        exercises: [
          { exerciseId: 'jumping-jacks', workSec: 35, restSec: 20 },
          { exerciseId: 'standard-pushups', workSec: 35, restSec: 20 },
          { exerciseId: 'bodyweight-squats', workSec: 40, restSec: 20 },
          { exerciseId: 'forearm-plank', workSec: 40, restSec: 20 },
          { exerciseId: 'glute-bridges', workSec: 40, restSec: 20 },
          { exerciseId: 'skater-hops', workSec: 35, restSec: 20 },
        ],
      };
    }
  };

  const recommendedWorkout = getRecommendedWorkout();

  // Active Program Information
  const currentProgram = activeProgram ? PROGRAMS_BY_ID.get(activeProgram.programId) : null;
  const currentProgramDay = currentProgram
    ? currentProgram.days.find(d => d.dayNumber === activeProgram?.currentDay)
    : null;

  // Preset Quick Start Workouts
  const quickStartWorkouts: { title: string; min: number; category: string; icon: string; workout: Workout }[] = [
    {
      title: '10-Min Quick Sweat',
      min: 10,
      category: 'Cardio',
      icon: '⚡',
      workout: {
        id: 'qs-10min',
        title: '10-Min Quick Sweat',
        description: 'Fast, high-efficiency bodyweight blast for busy days.',
        category: 'Cardio/HIIT',
        difficulty: 'Beginner',
        exercises: [
          { exerciseId: 'jumping-jacks', workSec: 35, restSec: 15 },
          { exerciseId: 'bodyweight-squats', workSec: 40, restSec: 15 },
          { exerciseId: 'mountain-climbers', workSec: 35, restSec: 15 },
          { exerciseId: 'high-knees', workSec: 35, restSec: 15 },
          { exerciseId: 'forearm-plank', workSec: 40, restSec: 15 },
        ],
      },
    },
    {
      title: '7-Min Core Crusher',
      min: 7,
      category: 'Core',
      icon: '🔥',
      workout: {
        id: 'qs-core',
        title: '7-Min Core Crusher',
        description: 'Non-stop burn for sculpted, stable abdominals.',
        category: 'Core/Abs',
        difficulty: 'Intermediate',
        exercises: [
          { exerciseId: 'bicycle-crunches', workSec: 35, restSec: 15 },
          { exerciseId: 'russian-twists', workSec: 35, restSec: 15 },
          { exerciseId: 'forearm-plank', workSec: 40, restSec: 15 },
          { exerciseId: 'dead-bug', workSec: 40, restSec: 15 },
          { exerciseId: 'flutter-kicks', workSec: 35, restSec: 15 },
        ],
      },
    },
    {
      title: 'Upper Body Pump',
      min: 12,
      category: 'Upper',
      icon: '💪',
      workout: {
        id: 'qs-upper',
        title: 'Upper Body Pump',
        description: 'Push-up variations and tricep burns for chest and arms.',
        category: 'Upper Body',
        difficulty: 'Intermediate',
        exercises: [
          { exerciseId: 'standard-pushups', workSec: 35, restSec: 20 },
          { exerciseId: 'shoulder-taps', workSec: 40, restSec: 20 },
          { exerciseId: 'tricep-dips', workSec: 35, restSec: 20 },
          { exerciseId: 'wide-grip-pushups', workSec: 35, restSec: 25 },
        ],
      },
    },
    {
      title: 'Evening Relax & Unwind',
      min: 10,
      category: 'Yoga',
      icon: '🌙',
      workout: {
        id: 'qs-relax',
        title: 'Evening Relax & Unwind',
        description: 'Release daily tension, decompress the spine, and sleep better.',
        category: 'Stretching/Yoga',
        difficulty: 'Beginner',
        exercises: [
          { exerciseId: 'cat-cow-stretch', workSec: 50, restSec: 10 },
          { exerciseId: 'childs-pose', workSec: 60, restSec: 10 },
          { exerciseId: 'downward-dog', workSec: 45, restSec: 10 },
          { exerciseId: 'standing-quad-stretch', workSec: 45, restSec: 10 },
        ],
      },
    },
  ];

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      {/* Motivational Quote Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/5 dark:from-orange-950/40 dark:via-zinc-900 dark:to-orange-950/20 border border-orange-200/80 dark:border-zinc-800 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 dark:text-orange-400">
              Daily Motivation
            </span>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 italic leading-snug">
              "{currentQuote.quote}"
            </p>
            <span className="text-xs text-zinc-600 dark:text-zinc-300 font-medium block">
              — {currentQuote.author}
            </span>
          </div>
          <button
            onClick={cycleQuote}
            aria-label="New motivational quote"
            className="p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-100/50 dark:hover:bg-zinc-800 transition-colors shrink-0"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Highlights Grid: Streak + Weekly Goal Progress Ring */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {/* Streak Card */}
        <div className="p-4 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">
              Workout Streak
            </span>
            <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center text-orange-600 dark:text-orange-400">
              <Flame className={`w-4 h-4 ${streak > 0 ? 'fill-current' : ''}`} />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
                {streak}
              </span>
              <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300">days</span>
            </div>
            <p className="text-[11px] text-zinc-600 dark:text-zinc-300 mt-1">
              {streak > 0 ? 'Keep the momentum going!' : 'Complete a workout to start!'}
            </p>
          </div>
        </div>

        {/* Weekly Goal Progress Card */}
        <div className="p-4 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">
              Weekly Goal
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
                  {weekly.count}
                </span>
                <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300">
                  / {weekly.target}d
                </span>
              </div>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-300 mt-1">
                {weekly.isCompleted ? 'Goal achieved! 🔥' : `${weekly.target - weekly.count} more to hit goal`}
              </p>
            </div>

            {/* Small circular ring */}
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-12 h-12 -rotate-90 transform">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  className="text-zinc-100 dark:text-zinc-800"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeDasharray={2 * Math.PI * 20}
                  strokeDashoffset={2 * Math.PI * 20 - (weekly.percentage / 100) * (2 * Math.PI * 20)}
                  strokeLinecap="round"
                  fill="transparent"
                  className="text-emerald-500 transition-all duration-500"
                />
              </svg>
              <span className="absolute text-[10px] font-black text-zinc-700 dark:text-zinc-300">
                {weekly.percentage}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Enrolled Program Card (if any) */}
      {currentProgram && (
        <div className="rounded-3xl bg-gradient-to-br from-zinc-900 to-zinc-950 text-white p-5 border border-zinc-800 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-[10px] font-black uppercase tracking-wider border border-orange-500/30">
              Active Program
            </span>
            <button
              onClick={() => onNavigateTab('workouts')}
              className="text-xs text-zinc-400 hover:text-white flex items-center gap-0.5"
            >
              View Plan <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <h3 className="text-lg font-black text-white">{currentProgram.title}</h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Day {activeProgram?.currentDay || 1} of {currentProgram.durationDays}:{' '}
            <span className="text-zinc-200 font-semibold">{currentProgramDay?.title}</span>
          </p>

          <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <Calendar className="w-4 h-4 text-orange-400" />
              <span>
                {activeProgram?.completedDays?.length || 0} completed
              </span>
            </div>

            {currentProgramDay?.isRestDay ? (
              <span className="px-3 py-1.5 rounded-xl bg-zinc-800 text-xs font-semibold text-zinc-300">
                Rest Day Today 🧘
              </span>
            ) : (
              <button
                onClick={() => {
                  if (activeProgram && currentProgramDay) {
                    onSelectProgramDay(activeProgram.programId, activeProgram.currentDay);
                  }
                }}
                className="py-2 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-orange-600/30 active:scale-95 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Start Day {activeProgram?.currentDay}
              </button>
            )}
          </div>
        </div>
      )}

      {/* TODAY'S RECOMMENDED WORKOUT (HERO CARD) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 p-6 text-white shadow-xl shadow-orange-500/20">
        <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-black uppercase tracking-wider text-white">
              <Sparkles className="w-3.5 h-3.5" />
              Today's Recommended Workout
            </div>
            <h3 className="text-2xl font-black tracking-tight text-white pt-1">
              {recommendedWorkout.title}
            </h3>
            <p className="text-xs text-white/90 leading-relaxed max-w-sm">
              {recommendedWorkout.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-semibold text-white/90">
            <span className="flex items-center gap-1 bg-black/20 px-2.5 py-1 rounded-lg">
              <Clock className="w-3.5 h-3.5" />
              {recommendedWorkout.estimatedMinutes} mins
            </span>
            <span className="flex items-center gap-1 bg-black/20 px-2.5 py-1 rounded-lg">
              <Dumbbell className="w-3.5 h-3.5" />
              {recommendedWorkout.exercises.length} Exercises
            </span>
            <span className="bg-black/20 px-2.5 py-1 rounded-lg">
              {recommendedWorkout.difficulty}
            </span>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onStartWorkout(recommendedWorkout)}
              className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-white hover:bg-zinc-100 text-zinc-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all"
            >
              <Play className="w-4 h-4 fill-current text-orange-600" />
              Start Workout Now
            </button>
          </div>
        </div>
      </div>

      {/* QUICK START PRESETS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
            Quick Start Sessions
          </h2>
          <button
            onClick={() => onNavigateTab('workouts')}
            className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline"
          >
            All Workouts →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickStartWorkouts.map(item => (
            <button
              key={item.title}
              onClick={() => onStartWorkout(item.workout)}
              className="p-3.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-left hover:border-orange-500/50 hover:shadow-xs transition-all active:scale-95 group"
            >
              <span className="text-2xl block mb-2">{item.icon}</span>
              <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                {item.title}
              </h3>
              <div className="flex items-center gap-1 text-[11px] text-zinc-600 dark:text-zinc-300 font-medium mt-1">
                <Clock className="w-3 h-3 text-zinc-600 dark:text-zinc-300" />
                <span>{item.min} min</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* RECENT WORKOUT HISTORY PREVIEW */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
            Recent Activity
          </h2>
          <button
            onClick={() => onNavigateTab('progress')}
            className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline"
          >
            Full Log →
          </button>
        </div>

        {workoutLogs.length === 0 ? (
          <div className="p-6 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 text-center space-y-2 bg-zinc-50/50 dark:bg-zinc-900/30">
            <div className="text-2xl">🌱</div>
            <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
              No workouts logged yet.
            </p>
            <p className="text-[11px] text-zinc-600 dark:text-zinc-300">
              Start today's recommended workout above to begin your fitness log!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {workoutLogs.slice(0, 3).map(log => (
              <div
                key={log.id}
                className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      {log.workoutTitle}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-zinc-600 dark:text-zinc-300 font-medium">
                      <span>{log.date}</span>
                      <span>•</span>
                      <span>{formatTime(log.durationSeconds)}</span>
                      <span>•</span>
                      <span>~{log.caloriesBurned} kcal</span>
                    </div>
                  </div>
                </div>

                <span className="text-xs px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-semibold capitalize">
                  {log.feeling || 'Completed'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
