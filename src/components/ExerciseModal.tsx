import React from 'react';
import { X, Play, AlertCircle, CheckCircle2, Lightbulb, Dumbbell } from 'lucide-react';
import { Exercise } from '../types';
import { ExerciseIllustration } from './ExerciseIllustration';
import { ExerciseMedia } from './ExerciseMedia';
import { useLanguage } from '../i18n';

interface ExerciseModalProps {
  exercise: Exercise | null;
  onClose: () => void;
  onStartSingle?: (exercise: Exercise) => void;
  onAddToCustom?: (exercise: Exercise) => void;
  intervalSeconds?: number;
}

export const ExerciseModal: React.FC<ExerciseModalProps> = ({
  exercise,
  onClose,
  onStartSingle,
  onAddToCustom,
  intervalSeconds,
}) => {
  const { tx } = useLanguage();
  if (!exercise) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="exercise-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-t-3xl sm:rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{exercise.icon}</span>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                {exercise.category}
              </span>
              <h2 id="exercise-modal-title" className="text-lg font-bold text-zinc-900 dark:text-zinc-50 leading-tight">
                {exercise.name}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label={tx('Close details')}
            className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Real-person video from Free Exercise DB, with the original illustration as fallback */}
          {exercise.freeExercise ? (
            <ExerciseMedia media={exercise.freeExercise} className="w-full aspect-video" />
          ) : (
            <ExerciseIllustration
              type={exercise.animationType || 'squat'}
              icon={exercise.icon}
              className="w-full h-48"
            />
          )}

          {exercise.freeExercise?.shortDescription && (
            <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">
              {exercise.freeExercise.shortDescription}
            </p>
          )}

          {/* Quick specs pills */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800 text-center">
              <span className="text-[10px] font-semibold text-zinc-600 dark:text-zinc-300 uppercase">{tx('Difficulty')}</span>
              <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">{exercise.difficulty}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800 text-center">
              <span className="text-[10px] font-semibold text-zinc-600 dark:text-zinc-300 uppercase">{tx('Equipment')}</span>
              <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">{exercise.equipment}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800 text-center">
              <span className="text-[10px] font-semibold text-zinc-600 dark:text-zinc-300 uppercase">Avg Burn</span>
              <p className="text-xs font-bold text-orange-600 dark:text-orange-400 mt-0.5">
                ~{Math.round(exercise.estCaloriesPerMin * (intervalSeconds || exercise.defaultDuration) / 60)} kcal / {intervalSeconds || exercise.defaultDuration}s
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200/60 dark:border-orange-900/40 px-3 py-2">
            <span className="text-[11px] font-semibold text-orange-800 dark:text-orange-200">
              Gasto estimado no intervalo padrão
            </span>
            <span className="text-xs font-black text-orange-700 dark:text-orange-300">
              {Math.round(exercise.estCaloriesPerMin * (intervalSeconds || exercise.defaultDuration) / 60)} kcal
            </span>
          </div>

          {/* Target muscles */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-2">
            {tx('Target Muscles')}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {exercise.targetMuscles.map(muscle => (
                <span
                  key={muscle}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border border-orange-200/60 dark:border-orange-800/50"
                >
                  {muscle}
                </span>
              ))}
            </div>
          </div>

          {/* Step by step instructions */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-2.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              {tx('Step-by-Step Instructions')}
            </h3>
            <ol className="space-y-2">
              {exercise.instructions.map((step, idx) => (
                <li key={idx} className="flex gap-2.5 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 flex items-center justify-center font-bold text-[11px]">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Common mistakes */}
          {exercise.commonMistakes && exercise.commonMistakes.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200">
              <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 mb-2 text-amber-700 dark:text-amber-400">
                <AlertCircle className="w-4 h-4" />
                {tx('Common Mistakes to Avoid')}
              </h3>
              <ul className="space-y-1.5 text-xs">
                {exercise.commonMistakes.map((mistake, idx) => (
                  <li key={idx} className="flex gap-1.5">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{mistake}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {exercise.freeExercise?.formCues.length ? (
            <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-900 dark:text-blue-200">
              <h3 className="text-xs font-bold uppercase tracking-wider mb-2 text-blue-700 dark:text-blue-400">
                {tx('Form Cues')}
              </h3>
              <ul className="space-y-1.5 text-xs">
                {exercise.freeExercise.formCues.map(cue => (
                  <li key={cue} className="flex gap-1.5">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>{cue}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {exercise.freeExercise?.breathing && (
            <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-900 dark:text-cyan-200">
              <h3 className="text-xs font-bold uppercase tracking-wider mb-1 text-cyan-700 dark:text-cyan-400">
                {tx('Breathing')}
              </h3>
              <p className="text-xs leading-relaxed">{exercise.freeExercise.breathing}</p>
            </div>
          )}

          {/* Pro tip */}
          {exercise.proTip && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-200">
              <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1 text-emerald-700 dark:text-emerald-400">
                <Lightbulb className="w-4 h-4" />
                {tx('Coach Pro Tip')}
              </h3>
              <p className="text-xs leading-relaxed">{exercise.proTip}</p>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80 flex gap-2.5">
          {onAddToCustom && (
            <button
              onClick={() => {
                onAddToCustom(exercise);
                onClose();
              }}
              className="flex-1 py-3 px-4 rounded-xl border border-zinc-300 dark:border-zinc-700 font-semibold text-xs text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center gap-1.5"
            >
              <Dumbbell className="w-4 h-4" />
              {tx('Add to Custom')}
            </button>
          )}

          {onStartSingle && (
            <button
              onClick={() => {
                onStartSingle(exercise);
                onClose();
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 active:scale-98 font-bold text-xs text-white shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-1.5"
            >
              <Play className="w-4 h-4 fill-current" />
              {tx('Start Quick Exercise')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
