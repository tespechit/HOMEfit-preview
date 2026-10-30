import React, { useState } from 'react';
import {
  Flame,
  Clock,
  Award,
  Calendar as CalendarIcon,
  Plus,
  Scale,
  Trash2,
  TrendingDown,
  CheckCircle,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import { WorkoutLog, WeightEntry, UserProfile } from '../../types';
import { formatTime, getTodayString, convertWeight } from '../../utils/fitness';

interface ProgressViewProps {
  logs: WorkoutLog[];
  weightEntries: WeightEntry[];
  profile: UserProfile;
  currentStreak: number;
  bestStreak: number;
  onAddWeight: (entry: WeightEntry) => void;
  onDeleteLog: (id: string) => void;
  onDeleteWeight: (id: string) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  logs,
  weightEntries,
  profile,
  currentStreak,
  bestStreak,
  onAddWeight,
  onDeleteLog,
  onDeleteWeight,
}) => {
  // Calendar month state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDayLogDate, setSelectedDayLogDate] = useState<string | null>(null);

  // Weight entry modal state
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [inputWeight, setInputWeight] = useState(profile.currentWeight ? String(profile.currentWeight) : '70');
  const [inputDate, setInputDate] = useState(getTodayString());
  const [inputNote, setInputNote] = useState('');

  // Unit display
  const [displayUnit, setDisplayUnit] = useState<'kg' | 'lbs'>(profile.weightUnit || 'kg');

  // Total stats
  const totalWorkouts = logs.length;
  const totalMinutes = Math.round(logs.reduce((acc, l) => acc + l.durationSeconds, 0) / 60);
  const totalCalories = logs.reduce((acc, l) => acc + l.caloriesBurned, 0);

  // Calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Create a map of YYYY-MM-DD -> WorkoutLog[]
  const logsByDate = new Map<string, WorkoutLog[]>();
  logs.forEach(l => {
    const existing = logsByDate.get(l.date) || [];
    existing.push(l);
    logsByDate.set(l.date, existing);
  });

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleSaveWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(inputWeight);
    if (isNaN(num) || num <= 0) return;

    // Convert to kg for uniform storage if entered in lbs
    const weightKg = displayUnit === 'lbs' ? convertWeight(num, 'lbs', 'kg') : num;

    onAddWeight({
      id: 'weight-' + Date.now(),
      date: inputDate,
      weight: weightKg,
      note: inputNote.trim() || undefined,
    });

    setShowWeightModal(false);
    setInputNote('');
  };

  // Prepare chart data sorted ascending by date
  const chartData = [...weightEntries]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(entry => {
      const val = displayUnit === 'lbs' ? convertWeight(entry.weight, 'kg', 'lbs') : entry.weight;
      return {
        date: entry.date.slice(5), // MM-DD
        fullDate: entry.date,
        weight: val,
        note: entry.note,
      };
    });

  const targetWeightDisplay = profile.targetWeight
    ? displayUnit === 'lbs'
      ? convertWeight(profile.targetWeight, 'kg', 'lbs')
      : profile.targetWeight
    : null;

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      {/* Title */}
      <div>
        <h2 className="text-lg font-black text-zinc-900 dark:text-white">
          Progress & Analytics
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Track consistency streaks, active workout time, and weight progression.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs">
          <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-300 text-xs font-bold uppercase">
            <span>Streak</span>
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-zinc-900 dark:text-white">
            {currentStreak} <span className="text-xs font-normal text-zinc-600 dark:text-zinc-300">days</span>
          </div>
          <div className="text-[10px] text-zinc-600 dark:text-zinc-300 mt-0.5">Best: {bestStreak} days</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs">
          <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-300 text-xs font-bold uppercase">
            <span>Workouts</span>
            <Award className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-zinc-900 dark:text-white">
            {totalWorkouts}
          </div>
          <div className="text-[10px] text-zinc-600 dark:text-zinc-300 mt-0.5">Sessions logged</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs">
          <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-300 text-xs font-bold uppercase">
            <span>Active Time</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-zinc-900 dark:text-white">
            {totalMinutes} <span className="text-xs font-normal text-zinc-600 dark:text-zinc-300">min</span>
          </div>
          <div className="text-[10px] text-zinc-600 dark:text-zinc-300 mt-0.5">No equipment used</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs">
          <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-300 text-xs font-bold uppercase">
            <span>Est. Burn</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-zinc-900 dark:text-white">
            ~{totalCalories}
          </div>
          <div className="text-[10px] text-zinc-600 dark:text-zinc-300 mt-0.5">Total calories</div>
        </div>
      </div>

      {/* INTERACTIVE CALENDAR WITH STREAKS */}
      <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-orange-500" />
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
              {monthNames[month]} {year}
            </h3>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              aria-label="Previous month"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              aria-label="Next month"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-zinc-600 dark:text-zinc-300 uppercase">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d, i) => (
            <div key={i} className="py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1.5 text-center">
          {/* Empty prefix slots */}
          {Array.from({ length: firstDayOfMonth }, (_, idx) => (
            <div key={`empty-${idx}`} className="h-9" />
          ))}

          {/* Days */}
          {Array.from({ length: daysInMonth }, (_, idx) => {
            const dayNum = idx + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const dayLogs = logsByDate.get(dateStr) || [];
            const hasWorkout = dayLogs.length > 0;
            const isToday = dateStr === getTodayString();
            const isSelected = selectedDayLogDate === dateStr;

            return (
              <button
                key={dayNum}
                onClick={() => setSelectedDayLogDate(hasWorkout ? dateStr : null)}
                className={`h-9 rounded-xl flex flex-col items-center justify-center text-xs relative transition-all ${
                  hasWorkout
                    ? 'bg-orange-500 text-white font-black shadow-xs hover:bg-orange-600'
                    : isToday
                    ? 'border-2 border-orange-500 text-orange-600 font-bold bg-orange-50/50 dark:bg-orange-950/20'
                    : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                } ${isSelected ? 'ring-2 ring-zinc-900 dark:ring-white' : ''}`}
              >
                <span>{dayNum}</span>
                {hasWorkout && (
                  <span className="w-1 h-1 rounded-full bg-white mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Day popup if clicked */}
        {selectedDayLogDate && (
          <div className="p-3.5 rounded-2xl bg-orange-50/80 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/60 flex items-center justify-between text-xs animate-in fade-in">
            <div>
              <span className="font-bold text-orange-800 dark:text-orange-300">
                Workouts on {selectedDayLogDate}:
              </span>
              <div className="space-y-0.5 mt-1 text-zinc-700 dark:text-zinc-300">
                {logsByDate.get(selectedDayLogDate)?.map(l => (
                  <div key={l.id} className="flex items-center gap-2">
                    <span className="font-semibold">{l.workoutTitle}</span>
                    <span className="text-[11px] text-zinc-500">({formatTime(l.durationSeconds)})</span>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={() => setSelectedDayLogDate(null)}
              className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* WEIGHT TRACKING SECTION WITH RECHARTS LINE CHART */}
      <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-orange-500" />
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                Weight Tracking & Trends
              </h3>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Visualize your progress and stay on target.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Unit toggle */}
            <div className="p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex text-xs font-bold">
              <button
                type="button"
                onClick={() => setDisplayUnit('kg')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  displayUnit === 'kg'
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-2xs'
                    : 'text-zinc-400'
                }`}
              >
                kg
              </button>
              <button
                type="button"
                onClick={() => setDisplayUnit('lbs')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  displayUnit === 'lbs'
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-2xs'
                    : 'text-zinc-400'
                }`}
              >
                lbs
              </button>
            </div>

            <button
              onClick={() => {
                setInputDate(getTodayString());
                setShowWeightModal(true);
              }}
              className="py-1.5 px-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1 shadow-xs active:scale-95 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Weight</span>
            </button>
          </div>
        </div>

        {/* Recharts Chart */}
        {chartData.length > 0 ? (
          <div className="w-full h-56 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#88888820" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: '#888888' }}
                  tickLine={false}
                />
                <YAxis
                  domain={['dataMin - 1', 'dataMax + 1']}
                  tick={{ fontSize: 10, fill: '#888888' }}
                  tickLine={false}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-2.5 rounded-xl bg-zinc-900 text-white text-xs shadow-lg border border-zinc-800">
                          <div className="font-bold">{data.fullDate}</div>
                          <div className="text-orange-400 font-extrabold mt-0.5">
                            {data.weight} {displayUnit}
                          </div>
                          {data.note && (
                            <div className="text-[11px] text-zinc-400 mt-1 italic">
                              "{data.note}"
                            </div>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                {targetWeightDisplay && (
                  <ReferenceLine
                    y={targetWeightDisplay}
                    stroke="#10b981"
                    strokeDasharray="4 4"
                    label={{
                      value: `Target: ${targetWeightDisplay} ${displayUnit}`,
                      fill: '#10b981',
                      fontSize: 10,
                      position: 'top',
                    }}
                  />
                )}
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#ea580c"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#ea580c', stroke: '#fff', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#ea580c' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="p-8 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl text-xs text-zinc-400">
            No weight entries logged yet. Tap "Log Weight" above to start your trend chart!
          </div>
        )}

        {/* Recent Weight logs list */}
        {weightEntries.length > 0 && (
          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-300 font-semibold mb-2">
              <span>Recent Weight Logs</span>
              <span>{weightEntries.length} entries</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {[...weightEntries]
                .sort((a, b) => b.date.localeCompare(a.date))
                .slice(0, 6)
                .map(item => {
                  const val = displayUnit === 'lbs' ? convertWeight(item.weight, 'kg', 'lbs') : item.weight;
                  return (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/60 shrink-0 text-left min-w-[90px]"
                    >
                      <div className="text-[10px] text-zinc-600 dark:text-zinc-300">{item.date}</div>
                      <div className="text-xs font-black text-zinc-900 dark:text-zinc-100 mt-0.5">
                        {val} {displayUnit}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>

      {/* WORKOUT HISTORY LOG */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
          Completed Workout History ({logs.length})
        </h3>

        {logs.length === 0 ? (
          <div className="p-8 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 text-center space-y-2 bg-zinc-50/50 dark:bg-zinc-900/30">
            <div className="text-3xl">🏃</div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              No completed sessions yet
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Your finished workouts and calories will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {logs.map(log => (
              <div
                key={log.id}
                className="p-4 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center font-black">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      {log.workoutTitle}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300 font-medium mt-0.5">
                      <span>{log.date}</span>
                      <span>•</span>
                      <span>{formatTime(log.durationSeconds)}</span>
                      <span>•</span>
                      <span>~{log.caloriesBurned} kcal</span>
                      <span>•</span>
                      <span>{log.exercisesCompleted} ex</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-semibold capitalize">
                    {log.feeling || 'Good'}
                  </span>
                  <button
                    onClick={() => onDeleteLog(log.id)}
                    aria-label="Delete log entry"
                    className="p-2 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* WEIGHT LOG MODAL */}
      {showWeightModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4"
        >
          <div className="w-full max-w-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                Log Bodyweight Entry
              </h3>
              <button
                onClick={() => setShowWeightModal(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveWeight} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                  Weight ({displayUnit})
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={inputWeight}
                  onChange={e => setInputWeight(e.target.value)}
                  placeholder={`e.g. ${displayUnit === 'kg' ? '72.5' : '160.0'}`}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm font-black text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={inputDate}
                  onChange={e => setInputDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                  Note (Optional)
                </label>
                <input
                  type="text"
                  value={inputNote}
                  onChange={e => setInputNote(e.target.value)}
                  placeholder="e.g. Morning fasted, feeling lighter"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWeightModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-600 dark:text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md shadow-orange-600/30"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
