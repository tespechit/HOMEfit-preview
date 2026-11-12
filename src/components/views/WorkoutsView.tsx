import React, { useState } from 'react';
import { Search, Filter, Play, CheckCircle, Calendar, Dumbbell, Info, Sparkles } from 'lucide-react';
import { Exercise, Program, Workout, ActiveProgramState, ExerciseCategory } from '../../types';
import { EXERCISES, CATEGORIES } from '../../data/exercises';
import { PROGRAMS } from '../../data/programs';
import { useLanguage } from '../../i18n';

interface WorkoutsViewProps {
  activeProgram: ActiveProgramState | null;
  onSelectExercise: (exercise: Exercise) => void;
  onStartWorkout: (workout: Workout) => void;
  onEnrollProgram: (programId: string) => void;
  onSelectProgramDay: (programId: string, dayNumber: number) => void;
  onAddToCustom?: (exercise: Exercise) => void;
}

export const WorkoutsView: React.FC<WorkoutsViewProps> = ({
  activeProgram,
  onSelectExercise,
  onStartWorkout,
  onEnrollProgram,
  onSelectProgramDay,
}) => {
  const { tx } = useLanguage();
  const [subTab, setSubTab] = useState<'programs' | 'library'>('programs');

  // Exercise Library Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  // Selected Program expanded view
  const [expandedProgramId, setExpandedProgramId] = useState<string>(
    activeProgram ? activeProgram.programId : PROGRAMS[0].id
  );

  // Filter exercises
  const filteredExercises = EXERCISES.filter(ex => {
    const matchesCategory = selectedCategory === 'All' || ex.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || ex.difficulty === selectedDifficulty;
    const matchesSearch =
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.targetMuscles.some(m => m.toLowerCase().includes(searchQuery.toLowerCase())) ||
      ex.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  const currentProgram = PROGRAMS.find(p => p.id === expandedProgramId) || PROGRAMS[0];

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      {/* Top Segmented Sub-Tab Switcher */}
      <div className="p-1 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex">
        <button
          onClick={() => setSubTab('programs')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
            subTab === 'programs'
              ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-xs'
              : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900'
          }`}
        >
          {tx('Ready-Made Programs')} ({PROGRAMS.length})
        </button>
        <button
          onClick={() => setSubTab('library')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
            subTab === 'library'
              ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-xs'
              : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900'
          }`}
        >
          {tx('Exercise Library')} ({EXERCISES.length})
        </button>
      </div>

      {/* SUBTAB 1: READY-MADE PROGRAMS */}
      {subTab === 'programs' && (
        <div className="space-y-6">
          {/* Program Selectors list (horizontal swipe or grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PROGRAMS.map(prog => {
              const isEnrolled = activeProgram?.programId === prog.id;
              const isSelected = expandedProgramId === prog.id;

              return (
                <div
                  key={prog.id}
                  onClick={() => setExpandedProgramId(prog.id)}
                  className={`p-4 rounded-3xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/20 shadow-sm ring-1 ring-orange-500'
                      : 'border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                      {prog.durationDays} Days • {prog.difficulty}
                    </span>
                    {isEnrolled && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        {tx('Enrolled')}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-black text-zinc-900 dark:text-white mt-2">
                    {prog.title}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">
                    {prog.subtitle}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Expanded Program Day-by-Day Plan */}
          <div className="rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 p-5 space-y-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                  {currentProgram.category} • {currentProgram.durationDays} Days
                </span>
                <h3 className="text-xl font-black text-zinc-900 dark:text-white mt-0.5">
                  {currentProgram.title}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  {currentProgram.description}
                </p>
              </div>

              <div>
                {activeProgram?.programId === currentProgram.id ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold">
                    <CheckCircle className="w-4 h-4" />
                    Currently Active
                  </span>
                ) : (
                  <button
                    onClick={() => onEnrollProgram(currentProgram.id)}
                    className="w-full sm:w-auto py-2 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-xs transition-all active:scale-95"
                  >
                    {tx('Enroll in This Program')}
                  </button>
                )}
              </div>
            </div>

            {/* Days list */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
                {tx('Program Schedule & Workouts')}
              </h4>

              <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                {currentProgram.days.map(day => {
                  const isCompleted =
                    activeProgram?.programId === currentProgram.id &&
                    activeProgram.completedDays.includes(day.dayNumber);

                  const isCurrentDay =
                    activeProgram?.programId === currentProgram.id &&
                    activeProgram.currentDay === day.dayNumber;

                  return (
                    <div
                      key={day.dayNumber}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        isCurrentDay
                          ? 'border-orange-500 bg-orange-50/40 dark:bg-orange-950/20 shadow-2xs'
                          : day.isRestDay
                          ? 'border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-800/20'
                          : 'border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                              isCompleted
                                ? 'bg-emerald-500 text-white'
                                : isCurrentDay
                                ? 'bg-orange-600 text-white'
                                : day.isRestDay
                                ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                            }`}
                          >
                            {isCompleted ? <CheckCircle className="w-4 h-4" /> : day.dayNumber}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                                {day.title}
                              </h5>
                              {day.isRestDay && (
                                <span className="text-[10px] px-2 py-0.5 rounded-md bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-semibold">
                                  Rest Day
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                              {day.isRestDay ? day.recoveryTip : `${day.focus} • ${day.durationMinutes} min`}
                            </p>
                          </div>
                        </div>

                        {!day.isRestDay && (
                          <button
                            onClick={() => onSelectProgramDay(currentProgram.id, day.dayNumber)}
                            className="py-1.5 px-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold flex items-center gap-1 shadow-xs active:scale-95 transition-all"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>{tx('Start')}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: EXERCISE LIBRARY */}
      {subTab === 'library' && (
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search 40+ exercises, muscles, techniques..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Horizontal Category Chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Difficulty Filter Pills */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">
              Level:
            </span>
            {['All', 'Beginner', 'Intermediate', 'Advanced'].map(diff => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  selectedDifficulty === diff
                    ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                    : 'bg-zinc-100 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>

          {/* Results Count */}
          <div className="text-xs text-zinc-600 dark:text-zinc-300 font-medium">
            Showing {filteredExercises.length} bodyweight exercises
          </div>

          {/* Exercise Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredExercises.map(ex => (
              <div
                key={ex.id}
                onClick={() => onSelectExercise(ex)}
                className="p-4 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 hover:border-orange-500/50 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl p-2 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-100 dark:border-orange-900/40 shrink-0">
                      {ex.icon}
                    </span>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                        {ex.category}
                      </span>
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                        {ex.name}
                      </h4>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-0.5">
                        {ex.targetMuscles.join(', ')}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${
                      ex.difficulty === 'Beginner'
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                        : ex.difficulty === 'Intermediate'
                        ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                        : 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300'
                    }`}
                  >
                    {ex.difficulty}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800/80 text-xs">
                  <span className="text-[11px] text-zinc-600 dark:text-zinc-300 font-medium">
                    ~{ex.estCaloriesPerMin} kcal/min • {ex.defaultDuration}s interval
                  </span>

                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onSelectExercise(ex);
                    }}
                    className="font-bold text-orange-600 dark:text-orange-400 text-xs hover:underline flex items-center gap-1"
                  >
                    <Info className="w-3.5 h-3.5" />
                    Instructions
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
