import React, { useState } from 'react';
import {
  User,
  Target,
  Zap,
  Clock,
  Dumbbell,
  Volume2,
  VolumeX,
  Vibrate,
  RotateCcw,
  Scale,
  Calendar,
  Check,
  AlertTriangle,
  Award
} from 'lucide-react';
import { UserProfile, FitnessGoal } from '../../types';

interface ProfileViewProps {
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onRetakeOnboarding: () => void;
  onResetAllData: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  onUpdateProfile,
  onRetakeOnboarding,
  onResetAllData,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [targetWeight, setTargetWeight] = useState(
    profile.targetWeight ? String(profile.targetWeight) : ''
  );
  const [currentWeight, setCurrentWeight] = useState(
    profile.currentWeight ? String(profile.currentWeight) : ''
  );

  const handleUpdate = (partial: Partial<UserProfile>) => {
    onUpdateProfile({
      ...profile,
      ...partial,
    });
  };

  const handleWeightSave = () => {
    const tw = parseFloat(targetWeight);
    const cw = parseFloat(currentWeight);
    onUpdateProfile({
      ...profile,
      targetWeight: isNaN(tw) ? undefined : tw,
      currentWeight: isNaN(cw) ? undefined : cw,
    });
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      {/* Title */}
      <div>
        <h2 className="text-lg font-black text-zinc-900 dark:text-white">
          Settings & Profile
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Customize your workout preferences, targets, and sound effects.
        </p>
      </div>

      {/* Fitness Profile Preferences */}
      <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-orange-500" />
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
              Fitness Targets & Level
            </h3>
          </div>
          <button
            onClick={onRetakeOnboarding}
            className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline"
          >
            Retake Quiz
          </button>
        </div>

        {/* Goal Selector */}
        <div>
          <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-2">
            Primary Goal
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'lose_weight', label: 'Lose Weight 🔥' },
              { id: 'build_muscle', label: 'Build Muscle 💪' },
              { id: 'stay_fit', label: 'Stay Fit ⚡' },
              { id: 'flexibility', label: 'Flexibility 🧘' },
            ].map(g => (
              <button
                key={g.id}
                type="button"
                onClick={() => handleUpdate({ goal: g.id as FitnessGoal })}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  profile.goal === g.id
                    ? 'border-orange-500 bg-orange-500 text-white shadow-xs'
                    : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Level Selector */}
        <div>
          <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-2">
            Fitness Level
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['beginner', 'intermediate', 'advanced'].map(lvl => (
              <button
                key={lvl}
                type="button"
                onClick={() => handleUpdate({ fitnessLevel: lvl as any })}
                className={`py-2 px-2.5 rounded-xl border text-xs font-bold capitalize transition-all ${
                  profile.fitnessLevel === lvl
                    ? 'border-orange-500 bg-orange-500 text-white shadow-xs'
                    : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Preferred Duration */}
        <div>
          <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-2">
            Daily Workout Time
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[10, 20, 30, 45].map(min => (
              <button
                key={min}
                type="button"
                onClick={() => handleUpdate({ availableMinutes: min as any })}
                className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                  profile.availableMinutes === min
                    ? 'border-orange-500 bg-orange-500 text-white shadow-xs'
                    : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                {min}m
              </button>
            ))}
          </div>
        </div>

        {/* Weekly Goal Days */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
              Weekly Target
            </label>
            <span className="text-xs font-black text-orange-600 dark:text-orange-400">
              {profile.weeklyGoalDays} days / week
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="7"
            value={profile.weeklyGoalDays}
            onChange={e => handleUpdate({ weeklyGoalDays: Number(e.target.value) })}
            className="w-full accent-orange-600 cursor-pointer"
          />
        </div>
      </div>

      {/* Bodyweight & Target Metrics */}
      <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-orange-500" />
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
              Weight & Body Metrics
            </h3>
          </div>
          <div className="p-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex text-xs font-bold">
            <button
              type="button"
              onClick={() => handleUpdate({ weightUnit: 'kg' })}
              className={`px-2 py-0.5 rounded-md ${profile.weightUnit === 'kg' ? 'bg-white dark:bg-zinc-700 shadow-xs' : 'text-zinc-400'}`}
            >
              kg
            </button>
            <button
              type="button"
              onClick={() => handleUpdate({ weightUnit: 'lbs' })}
              className={`px-2 py-0.5 rounded-md ${profile.weightUnit === 'lbs' ? 'bg-white dark:bg-zinc-700 shadow-xs' : 'text-zinc-400'}`}
            >
              lbs
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
              Current ({profile.weightUnit})
            </label>
            <input
              type="number"
              step="0.1"
              value={currentWeight}
              onChange={e => setCurrentWeight(e.target.value)}
              onBlur={handleWeightSave}
              placeholder="e.g. 70.0"
              className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-900 dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
              Goal Weight ({profile.weightUnit})
            </label>
            <input
              type="number"
              step="0.1"
              value={targetWeight}
              onChange={e => setTargetWeight(e.target.value)}
              onBlur={handleWeightSave}
              placeholder="e.g. 65.0"
              className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Audio Cues & Haptics */}
      <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-2">
          Timer Audio & Vibration
        </h3>

        <div className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <Volume2 className="w-4 h-4 text-orange-500" />
            <div>
              <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Interval Audio Beeps</h4>
              <p className="text-[11px] text-zinc-500">Audio countdown and transition cues</p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={profile.soundEnabled}
            aria-label="Toggle interval audio beeps"
            onClick={() => handleUpdate({ soundEnabled: !profile.soundEnabled })}
            className={`w-11 h-6 rounded-full transition-colors relative ${
              profile.soundEnabled ? 'bg-orange-600' : 'bg-zinc-300 dark:bg-zinc-700'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform transform mt-1 ml-1 ${
                profile.soundEnabled ? 'translate-x-5' : ''
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2.5">
            <Vibrate className="w-4 h-4 text-cyan-500" />
            <div>
              <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Haptic Vibration</h4>
              <p className="text-[11px] text-zinc-500">Vibrate at interval transitions on mobile</p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={profile.vibrationEnabled}
            aria-label="Toggle haptic vibration"
            onClick={() => handleUpdate({ vibrationEnabled: !profile.vibrationEnabled })}
            className={`w-11 h-6 rounded-full transition-colors relative ${
              profile.vibrationEnabled ? 'bg-cyan-600' : 'bg-zinc-300 dark:bg-zinc-700'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform transform mt-1 ml-1 ${
                profile.vibrationEnabled ? 'translate-x-5' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Reset & Storage Info */}
      <div className="p-5 rounded-3xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
          Data & Local Storage
        </h3>
        <p className="text-xs text-zinc-600 dark:text-zinc-300">
          HomeFit stores 100% of your workouts, routines, and weight logs privately on your device.
        </p>

        <button
          onClick={() => setShowResetConfirm(true)}
          className="w-full py-2.5 px-4 rounded-xl border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-bold transition-colors"
        >
          Reset All Saved App Data
        </button>
      </div>

      {/* Reset confirmation modal */}
      {showResetConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4"
        >
          <div className="w-full max-w-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 text-center space-y-4">
            <AlertTriangle className="w-10 h-10 text-red-500 mx-auto" />
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
              Reset All Data?
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              This will clear all your workout history, streaks, weight logs, and custom routines. This action cannot be undone.
            </p>
            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowResetConfirm(false);
                  onResetAllData();
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-semibold text-white"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
