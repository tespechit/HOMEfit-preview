import React, { useState } from 'react';
import { Target, Zap, Clock, ShieldCheck, ChevronRight, Check } from 'lucide-react';
import { UserProfile, FitnessGoal } from '../types';

interface OnboardingModalProps {
  initialProfile: UserProfile;
  isOpen: boolean;
  onSave: (profile: UserProfile) => void;
  onClose?: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  initialProfile,
  isOpen,
  onSave,
  onClose,
}) => {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState<FitnessGoal>(initialProfile.goal || 'stay_fit');
  const [fitnessLevel, setFitnessLevel] = useState<'beginner' | 'intermediate' | 'advanced'>(
    initialProfile.fitnessLevel || 'beginner'
  );
  const [availableMinutes, setAvailableMinutes] = useState<10 | 20 | 30 | 45>(
    initialProfile.availableMinutes || 20
  );
  const [equipment, setEquipment] = useState<'none' | 'dumbbells' | 'resistance_bands'>(
    initialProfile.equipment || 'none'
  );
  const [weeklyGoalDays, setWeeklyGoalDays] = useState<number>(initialProfile.weeklyGoalDays || 4);

  if (!isOpen) return null;

  const totalSteps = 4;

  const handleFinish = () => {
    onSave({
      ...initialProfile,
      goal,
      fitnessLevel,
      availableMinutes,
      equipment,
      weeklyGoalDays,
      hasCompletedOnboarding: true,
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto"
    >
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-2xl relative animate-in zoom-in-95 duration-200">
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4].map(s => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === step
                    ? 'w-8 bg-orange-600'
                    : s < step
                    ? 'w-4 bg-orange-400'
                    : 'w-4 bg-zinc-200 dark:bg-zinc-800'
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300">
            Step {step} of {totalSteps}
          </span>
        </div>

        {/* STEP 1: Goal */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="text-left">
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                <Target className="w-3.5 h-3.5" />
                Personalize Your Path
              </span>
              <h2 id="onboarding-title" className="text-xl font-black text-zinc-900 dark:text-zinc-50 mt-1">
                What is your primary fitness goal?
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                We'll calibrate your daily recommendations and training intensity.
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              {[
                { id: 'lose_weight', label: 'Lose Weight & Burn Fat', icon: '🔥', desc: 'Metabolic calorie burners and cardio intervals' },
                { id: 'build_muscle', label: 'Build Muscle & Strength', icon: '💪', desc: 'Progressive bodyweight resistance and power' },
                { id: 'stay_fit', label: 'Stay Fit & Energized', icon: '⚡', desc: 'Balanced stamina, joint durability, and tone' },
                { id: 'flexibility', label: 'Flexibility & Mobility', icon: '🧘', desc: 'Posture alignment, spinal relief, and yoga' },
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setGoal(item.id as FitnessGoal)}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    goal === item.id
                      ? 'border-orange-500 bg-orange-50/70 dark:bg-orange-950/30 shadow-xs'
                      : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{item.label}</h3>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{item.desc}</p>
                    </div>
                  </div>
                  {goal === item.id && (
                    <div className="w-5 h-5 rounded-full bg-orange-600 text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Level */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="text-left">
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                <Zap className="w-3.5 h-3.5" />
                Fitness Experience
              </span>
              <h2 id="onboarding-title" className="text-xl font-black text-zinc-900 dark:text-zinc-50 mt-1">
                What is your current fitness level?
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Choose the level that feels comfortable right now. You can adjust anytime.
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              {[
                { id: 'beginner', label: 'Beginner', badge: 'New to workouts', desc: 'Gentle pacing, foundational movement patterns, longer rest periods.' },
                { id: 'intermediate', label: 'Intermediate', badge: 'Active 2-3x/week', desc: 'Standard work intervals (35-40s), moderate cardio and bodyweight volume.' },
                { id: 'advanced', label: 'Advanced', badge: 'High stamina', desc: 'High intensity HIIT, explosive plyometrics, strict rest windows.' },
              ].map(lvl => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setFitnessLevel(lvl.id as any)}
                  className={`w-full p-4 rounded-2xl border text-left flex items-start justify-between transition-all ${
                    fitnessLevel === lvl.id
                      ? 'border-orange-500 bg-orange-50/70 dark:bg-orange-950/30 shadow-xs'
                      : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{lvl.label}</h3>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                        {lvl.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">{lvl.desc}</p>
                  </div>
                  {fitnessLevel === lvl.id && (
                    <div className="w-5 h-5 rounded-full bg-orange-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Available Time */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="text-left">
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                <Clock className="w-3.5 h-3.5" />
                Schedule & Commitment
              </span>
              <h2 id="onboarding-title" className="text-xl font-black text-zinc-900 dark:text-zinc-50 mt-1">
                How much time do you have per day?
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Consistency beats duration every single time.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              {[
                { min: 10, label: '10 Minutes', sub: 'Quick blast' },
                { min: 20, label: '20 Minutes', sub: 'Sweet spot (Recommended)' },
                { min: 30, label: '30 Minutes', sub: 'Deep burn' },
                { min: 45, label: '45 Minutes', sub: 'Athlete conditioning' },
              ].map(t => (
                <button
                  key={t.min}
                  type="button"
                  onClick={() => setAvailableMinutes(t.min as any)}
                  className={`p-4 rounded-2xl border text-center transition-all ${
                    availableMinutes === t.min
                      ? 'border-orange-500 bg-orange-500 text-white shadow-md shadow-orange-500/20'
                      : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100'
                  }`}
                >
                  <div className="text-xl font-black">{t.min}m</div>
                  <div className={`text-[11px] font-medium mt-0.5 ${availableMinutes === t.min ? 'text-orange-100' : 'text-zinc-500 dark:text-zinc-400'}`}>
                    {t.sub}
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-2">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-2">
                Weekly workout target: <span className="text-orange-600 dark:text-orange-400">{weeklyGoalDays} days / week</span>
              </label>
              <input
                type="range"
                min="1"
                max="7"
                value={weeklyGoalDays}
                onChange={e => setWeeklyGoalDays(Number(e.target.value))}
                className="w-full accent-orange-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-600 dark:text-zinc-300 mt-1">
                <span>1 day</span>
                <span>4 days (Recommended)</span>
                <span>7 days</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Equipment */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="text-left">
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                Equipment Setup
              </span>
              <h2 id="onboarding-title" className="text-xl font-black text-zinc-900 dark:text-zinc-50 mt-1">
                What equipment do you have at home?
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                HomeFit is built for 100% bodyweight workouts, but you can incorporate gear if you have it!
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              {[
                { id: 'none', label: 'Zero Equipment (100% Bodyweight)', icon: '🧘', desc: 'No gear needed! Just your body and floor space.' },
                { id: 'dumbbells', label: 'Dumbbells / Water Bottles', icon: '🏋️', desc: 'Optional extra load for upper and lower strength.' },
                { id: 'resistance_bands', label: 'Resistance Bands', icon: '🪢', desc: 'Elastic resistance for tension and joint stability.' },
              ].map(eq => (
                <button
                  key={eq.id}
                  type="button"
                  onClick={() => setEquipment(eq.id as any)}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    equipment === eq.id
                      ? 'border-orange-500 bg-orange-50/70 dark:bg-orange-950/30 shadow-xs'
                      : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{eq.icon}</span>
                    <div>
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{eq.label}</h3>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{eq.desc}</p>
                    </div>
                  </div>
                  {equipment === eq.id && (
                    <div className="w-5 h-5 rounded-full bg-orange-600 text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Modal Buttons */}
        <div className="mt-7 flex items-center justify-between gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(s => s - 1)}
              className="px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 font-semibold text-xs text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
            >
              Back
            </button>
          ) : onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 rounded-xl font-semibold text-xs text-zinc-600 dark:text-zinc-300 hover:text-zinc-700"
            >
              Close
            </button>
          ) : (
            <div />
          )}

          {step < totalSteps ? (
            <button
              type="button"
              onClick={() => setStep(s => s + 1)}
              className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 font-bold text-xs text-white shadow-lg shadow-orange-600/25 flex items-center gap-1.5 transition-all active:scale-98"
            >
              Next Step
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 font-bold text-xs text-white shadow-lg shadow-orange-600/25 flex items-center gap-1.5 transition-all active:scale-98"
            >
              Complete & Start
              <Check className="w-4 h-4 stroke-[3]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
