export interface WorkoutDurationParams {
  workSec: number;
  restSec: number;
}

/**
 * Calculates total duration of a workout in seconds, including initial countdown.
 */
export function calculateWorkoutDuration(
  exercises: WorkoutDurationParams[],
  warmupSec: number = 5
): number {
  if (!exercises || exercises.length === 0) return 0;
  let total = warmupSec;
  for (let i = 0; i < exercises.length; i++) {
    total += exercises[i].workSec;
    // Don't add rest after the very last exercise
    if (i < exercises.length - 1) {
      total += exercises[i].restSec;
    }
  }
  return total;
}

/**
 * Estimates total calories burned during a workout based on active duration,
 * intensity (kcal/min), and user bodyweight in kg (reference 70kg baseline).
 */
export function estimateCaloriesBurned(
  durationSec: number,
  avgKcalPerMin: number = 8.5,
  userWeightKg: number = 70
): number {
  if (durationSec <= 0) return 0;
  const minutes = durationSec / 60;
  const weightFactor = Math.max(0.6, Math.min(2.0, userWeightKg / 70));
  const estimated = minutes * avgKcalPerMin * weightFactor;
  return Math.max(1, Math.round(estimated));
}

/**
 * Formats seconds into MM:SS or HH:MM:SS string.
 */
export function formatTime(totalSeconds: number): string {
  const sec = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(sec / 3600);
  const minutes = Math.floor((sec % 3600) / 60);
  const seconds = sec % 60;

  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');

  if (hours > 0) {
    const hh = String(hours).padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  }
  return `${mm}:${ss}`;
}

/**
 * Returns today's date formatted as YYYY-MM-DD.
 */
export function getTodayString(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Calculates current consecutive streak and all-time best streak.
 * A streak is considered active if a workout was logged today or yesterday.
 */
export function calculateStreak(
  workoutDates: string[],
  todayStr: string = getTodayString()
): { currentStreak: number; bestStreak: number } {
  if (!workoutDates || workoutDates.length === 0) {
    return { currentStreak: 0, bestStreak: 0 };
  }

  // Deduplicate and sort descending (newest first)
  const uniqueDates = Array.from(new Set(workoutDates)).sort((a, b) => b.localeCompare(a));
  if (uniqueDates.length === 0) {
    return { currentStreak: 0, bestStreak: 0 };
  }

  const parseDate = (dStr: string) => {
    const [year, month, day] = dStr.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day));
  };

  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  const todayDate = parseDate(todayStr);

  // Check if today or yesterday has a workout for the current streak
  const mostRecent = parseDate(uniqueDates[0]);
  const diffFromToday = Math.round((todayDate.getTime() - mostRecent.getTime()) / MS_PER_DAY);

  let currentStreak = 0;
  if (diffFromToday <= 1 && diffFromToday >= 0) {
    currentStreak = 1;
    let prevDate = mostRecent;

    for (let i = 1; i < uniqueDates.length; i++) {
      const currDate = parseDate(uniqueDates[i]);
      const diff = Math.round((prevDate.getTime() - currDate.getTime()) / MS_PER_DAY);
      if (diff === 1) {
        currentStreak++;
        prevDate = currDate;
      } else if (diff === 0) {
        // duplicate day, ignore
      } else {
        break;
      }
    }
  }

  // Calculate best all-time streak
  let bestStreak = 0;
  if (uniqueDates.length > 0) {
    let runningStreak = 1;
    let prevDate = parseDate(uniqueDates[0]);

    for (let i = 1; i < uniqueDates.length; i++) {
      const currDate = parseDate(uniqueDates[i]);
      const diff = Math.round((prevDate.getTime() - currDate.getTime()) / MS_PER_DAY);
      if (diff === 1) {
        runningStreak++;
      } else {
        bestStreak = Math.max(bestStreak, runningStreak);
        runningStreak = 1;
      }
      prevDate = currDate;
    }
    bestStreak = Math.max(bestStreak, runningStreak, currentStreak);
  }

  return { currentStreak, bestStreak };
}

/**
 * Calculates workout completions for the current calendar week (Monday to Sunday).
 */
export function calculateWeeklyProgress(
  workoutDates: string[],
  targetDays: number = 4,
  todayStr: string = getTodayString()
): { count: number; target: number; percentage: number; isCompleted: boolean } {
  const [year, month, day] = todayStr.split('-').map(Number);
  const now = new Date(Date.UTC(year, month - 1, day));

  // Determine Monday of this week
  const dayOfWeek = now.getUTCDay(); // 0 is Sunday, 1 is Monday...
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(now.getTime() + diffToMonday * 24 * 60 * 60 * 1000);
  const sunday = new Date(monday.getTime() + 6 * 24 * 60 * 60 * 1000);

  const startStr = getTodayString(new Date(monday.getUTCFullYear(), monday.getUTCMonth(), monday.getUTCDate()));
  const endStr = getTodayString(new Date(sunday.getUTCFullYear(), sunday.getUTCMonth(), sunday.getUTCDate()));

  const uniqueDatesThisWeek = new Set(
    workoutDates.filter(d => d >= startStr && d <= endStr)
  );

  const count = uniqueDatesThisWeek.size;
  const target = Math.max(1, targetDays);
  const percentage = Math.min(100, Math.round((count / target) * 100));

  return {
    count,
    target,
    percentage,
    isCompleted: count >= target,
  };
}

/**
 * Converts weight between kg and lbs.
 */
export function convertWeight(
  val: number,
  fromUnit: 'kg' | 'lbs',
  toUnit: 'kg' | 'lbs'
): number {
  if (fromUnit === toUnit) return Number(val.toFixed(1));
  if (fromUnit === 'kg' && toUnit === 'lbs') {
    return Number((val * 2.20462).toFixed(1));
  }
  return Number((val / 2.20462).toFixed(1));
}
