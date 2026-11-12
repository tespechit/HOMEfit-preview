import React, { useMemo, useState } from 'react';
import { Brain, Sparkles } from 'lucide-react';
import { Workout } from '../types';
import {
  GuidedPlanInput,
  GuidedGoal,
  GuidedRegion,
  GuidedSex,
  GuidedWorkoutType,
  GuidedExperience,
  generateGuidedWorkouts,
} from '../utils/aiWorkoutGenerator';

interface AiGuidedWorkoutPanelProps {
  onSaveGeneratedWorkouts: (workouts: Workout[]) => void;
}

const GOAL_OPTIONS: Array<{ value: GuidedGoal; label: string }> = [
  { value: 'emagrecimento', label: 'Emagrecimento' },
  { value: 'hipertrofia', label: 'Hipertrofia / ganho de força' },
  { value: 'condicionamento', label: 'Condicionamento físico' },
  { value: 'mobilidade', label: 'Mobilidade e flexibilidade' },
];

const TYPE_OPTIONS: Array<{ value: GuidedWorkoutType; label: string }> = [
  { value: 'forca', label: 'Força' },
  { value: 'cardio', label: 'Cardio / HIIT' },
  { value: 'mobilidade', label: 'Mobilidade / Alongamento' },
  { value: 'misto', label: 'Misto' },
];

const REGION_OPTIONS: Array<{ value: GuidedRegion; label: string }> = [
  { value: 'corpo_todo', label: 'Corpo todo' },
  { value: 'membros_superiores', label: 'Membros superiores' },
  { value: 'membros_inferiores', label: 'Membros inferiores' },
  { value: 'abdomen_core', label: 'Abdômen / Core' },
  { value: 'gluteos', label: 'Glúteos' },
  { value: 'costas', label: 'Costas' },
  { value: 'peito_ombros', label: 'Peito e ombros' },
];

const EXPERIENCE_OPTIONS: Array<{ value: GuidedExperience; label: string }> = [
  { value: 'iniciante', label: 'Iniciante' },
  { value: 'intermediario', label: 'Intermediário' },
  { value: 'avancado', label: 'Avançado' },
];

export const AiGuidedWorkoutPanel: React.FC<AiGuidedWorkoutPanelProps> = ({ onSaveGeneratedWorkouts }) => {
  const [sex, setSex] = useState<GuidedSex>('feminino');
  const [age, setAge] = useState(30);
  const [weightKg, setWeightKg] = useState(70);
  const [heightCm, setHeightCm] = useState(170);
  const [goal, setGoal] = useState<GuidedGoal>('condicionamento');
  const [workoutType, setWorkoutType] = useState<GuidedWorkoutType>('misto');
  const [usesEquipment, setUsesEquipment] = useState(false);
  const [targetRegion, setTargetRegion] = useState<GuidedRegion>('corpo_todo');
  const [trainingDays, setTrainingDays] = useState(4);
  const [sessionMinutes, setSessionMinutes] = useState(25);
  const [experienceLevel, setExperienceLevel] = useState<GuidedExperience>('iniciante');

  const [generated, setGenerated] = useState<Workout[]>([]);
  const [savedCount, setSavedCount] = useState(0);

  const bmi = useMemo(() => {
    const meters = Math.max(1.2, heightCm / 100);
    return (weightKg / (meters * meters)).toFixed(1);
  }, [weightKg, heightCm]);

  const handleGenerate = () => {
    const input: GuidedPlanInput = {
      sex,
      age: Math.max(14, age),
      weightKg: Math.max(35, weightKg),
      heightCm: Math.max(130, heightCm),
      goal,
      workoutType,
      usesEquipment,
      targetRegion,
      trainingDays: Math.max(1, Math.min(14, trainingDays)),
      sessionMinutes: Math.max(10, Math.min(90, sessionMinutes)),
      experienceLevel,
    };

    const plan = generateGuidedWorkouts(input);
    setGenerated(plan);
    setSavedCount(0);
  };

  const handleSaveAll = () => {
    if (generated.length === 0) return;
    onSaveGeneratedWorkouts(generated);
    setSavedCount(generated.length);
  };

  return (
    <section className="p-5 rounded-3xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-zinc-900 dark:to-zinc-900 border border-orange-200/70 dark:border-zinc-800 shadow-xs space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-900/50">
            <Brain className="w-3.5 h-3.5" />
            IA Coach
          </p>
          <h3 className="mt-2 text-base font-black text-zinc-900 dark:text-zinc-100">
            Criar plano de treino guiado por IA
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1 max-w-2xl">
            Informe seu perfil e objetivo. A IA usa apenas sua base de exercícios para montar treinos por dia com variedade e coerência.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-300">
          Sexo
          <select value={sex} onChange={e => setSex(e.target.value as GuidedSex)} className="mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-xs">
            <option value="feminino">Feminino</option>
            <option value="masculino">Masculino</option>
            <option value="outro">Outro</option>
          </select>
        </label>

        <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-300">
          Idade
          <input type="number" min={14} max={95} value={age} onChange={e => setAge(Number(e.target.value) || 14)} className="mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-xs" />
        </label>

        <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-300">
          Peso (kg)
          <input type="number" min={35} max={260} value={weightKg} onChange={e => setWeightKg(Number(e.target.value) || 35)} className="mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-xs" />
        </label>

        <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-300">
          Altura (cm)
          <input type="number" min={130} max={230} value={heightCm} onChange={e => setHeightCm(Number(e.target.value) || 130)} className="mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-xs" />
        </label>

        <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-300">
          Objetivo do treino
          <select value={goal} onChange={e => setGoal(e.target.value as GuidedGoal)} className="mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-xs">
            {GOAL_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </label>

        <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-300">
          Tipo de treino
          <select value={workoutType} onChange={e => setWorkoutType(e.target.value as GuidedWorkoutType)} className="mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-xs">
            {TYPE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </label>

        <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-300">
          Região alvo
          <select value={targetRegion} onChange={e => setTargetRegion(e.target.value as GuidedRegion)} className="mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-xs">
            {REGION_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </label>

        <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-300">
          Nível de experiência
          <select value={experienceLevel} onChange={e => setExperienceLevel(e.target.value as GuidedExperience)} className="mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-xs">
            {EXPERIENCE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </label>

        <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-300">
          Número de dias de treino
          <input type="number" min={1} max={14} value={trainingDays} onChange={e => setTrainingDays(Number(e.target.value) || 1)} className="mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-xs" />
        </label>

        <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-300">
          Duração de cada treino (min)
          <input type="number" min={10} max={90} value={sessionMinutes} onChange={e => setSessionMinutes(Number(e.target.value) || 10)} className="mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-xs" />
        </label>
      </div>

      <label className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
        <input type="checkbox" checked={usesEquipment} onChange={e => setUsesEquipment(e.target.checked)} className="w-4 h-4 rounded border-zinc-300 accent-orange-600" />
        Usar equipamentos quando disponíveis
      </label>

      <div className="flex flex-wrap items-center gap-2 pt-1">
        <button
          type="button"
          onClick={handleGenerate}
          className="py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-sm shadow-orange-600/30 inline-flex items-center gap-1.5"
        >
          <Sparkles className="w-4 h-4" />
          Gerar treinos com IA
        </button>

        {generated.length > 0 && (
          <button
            type="button"
            onClick={handleSaveAll}
            className="py-2.5 px-4 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-90 text-xs font-bold"
          >
            Salvar {generated.length} treinos no Builder
          </button>
        )}

        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          IMC estimado: {bmi}
        </span>
      </div>

      {savedCount > 0 && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
          {savedCount} treinos criados e salvos com sucesso.
        </div>
      )}

      {generated.length > 0 && (
        <div className="space-y-2 border-t border-orange-200/70 dark:border-zinc-800 pt-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
            Prévia do plano gerado
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {generated.map((workout) => (
              <div key={workout.id} className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800">
                <h5 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{workout.title}</h5>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">{workout.description}</p>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-300 mt-2">
                  {workout.exercises.length} exercícios • {workout.estimatedMinutes || 0} min • {workout.difficulty}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
