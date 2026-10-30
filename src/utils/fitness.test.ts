import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateWorkoutDuration,
  estimateCaloriesBurned,
  formatTime,
  calculateStreak,
  calculateWeeklyProgress,
  convertWeight,
} from './fitness';

test('calculateWorkoutDuration handles empty list', () => {
  assert.equal(calculateWorkoutDuration([]), 0);
});

test('calculateWorkoutDuration calculates work and rest with warmup', () => {
  // 3 exercises: 40s work, 20s rest each.
  // warmup: 5s
  // ex1: 40s work + 20s rest = 60s
  // ex2: 40s work + 20s rest = 60s
  // ex3: 40s work (no rest at end) = 40s
  // Total: 5 + 60 + 60 + 40 = 165s
  const exercises = [
    { workSec: 40, restSec: 20 },
    { workSec: 40, restSec: 20 },
    { workSec: 40, restSec: 20 },
  ];
  assert.equal(calculateWorkoutDuration(exercises, 5), 165);
});

test('estimateCaloriesBurned scales with duration and weight', () => {
  // 600s = 10 min. 10 * 8.5 * (70/70) = 85 kcal
  assert.equal(estimateCaloriesBurned(600, 8.5, 70), 85);
  // Higher weight burns proportionally more: 10 * 8.5 * (105/70) = 10 * 8.5 * 1.5 = 127.5 => 128
  assert.equal(estimateCaloriesBurned(600, 8.5, 105), 128);
});

test('formatTime formats MM:SS and HH:MM:SS correctly', () => {
  assert.equal(formatTime(0), '00:00');
  assert.equal(formatTime(45), '00:45');
  assert.equal(formatTime(125), '02:05');
  assert.equal(formatTime(3665), '01:01:05');
});

test('calculateStreak detects active consecutive streaks', () => {
  const dates = ['2026-10-29', '2026-10-28', '2026-10-27'];
  const res = calculateStreak(dates, '2026-10-29');
  assert.equal(res.currentStreak, 3);
  assert.equal(res.bestStreak, 3);

  // Worked out yesterday but not yet today
  const resYesterday = calculateStreak(['2026-10-28', '2026-10-27'], '2026-10-29');
  assert.equal(resYesterday.currentStreak, 2);

  // Missed 2 days, streak broken
  const resBroken = calculateStreak(['2026-10-26', '2026-10-25'], '2026-10-29');
  assert.equal(resBroken.currentStreak, 0);
  assert.equal(resBroken.bestStreak, 2);
});

test('calculateWeeklyProgress counts unique workout days this week', () => {
  // Assume Thursday 2026-10-29. Monday is 2026-10-26.
  const dates = ['2026-10-26', '2026-10-28', '2026-10-29', '2026-10-15'];
  const res = calculateWeeklyProgress(dates, 4, '2026-10-29');
  assert.equal(res.count, 3);
  assert.equal(res.target, 4);
  assert.equal(res.percentage, 75);
  assert.equal(res.isCompleted, false);
});

test('convertWeight converts kg and lbs accurately', () => {
  assert.equal(convertWeight(70, 'kg', 'lbs'), 154.3);
  assert.equal(convertWeight(154.3, 'lbs', 'kg'), 70.0);
  assert.equal(convertWeight(75, 'kg', 'kg'), 75);
});
