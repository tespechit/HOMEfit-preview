import React from 'react';
import { Flame, Moon, Sun, Dumbbell, Volume2, VolumeX, Languages } from 'lucide-react';
import { useLanguage } from '../i18n';

interface NavbarProps {
  currentStreak: number;
  darkMode: boolean;
  soundEnabled: boolean;
  onToggleDarkMode: () => void;
  onToggleSound: () => void;
  onQuickStart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentStreak,
  darkMode,
  soundEnabled,
  onToggleDarkMode,
  onToggleSound,
  onQuickStart,
}) => {
  const { language, setLanguage, t } = useLanguage();
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-zinc-950/90 border-b border-zinc-200/80 dark:border-zinc-800/80 transition-colors">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
            <Dumbbell className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-none">
              Home<span className="text-orange-600 dark:text-orange-500">Fit</span>
            </h1>
            <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-300 tracking-wide uppercase">
              {t('noEquipment')}
            </span>
          </div>
        </div>

        {/* Right Action Icons & Streak */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Streak pill */}
          <div
            title={`${currentStreak} day workout streak`}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200/80 dark:border-orange-800/60 text-orange-600 dark:text-orange-400 font-extrabold text-xs"
          >
            <Flame className={`w-3.5 h-3.5 ${currentStreak > 0 ? 'fill-current animate-pulse' : ''}`} />
            <span>{currentStreak}d</span>
          </div>

          {/* Sound toggle */}
          <button
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            className="p-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-orange-500" />
            ) : (
              <VolumeX className="w-4 h-4 text-zinc-400" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setLanguage(language === 'en' ? 'pt-BR' : 'en')}
            aria-label={t('language')}
            title={t('language')}
            className="flex items-center gap-1 px-2 py-1.5 rounded-xl text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <Languages className="w-4 h-4" />
            {language === 'en' ? 'EN' : 'BR'}
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={onToggleDarkMode}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-zinc-700" />
            )}
          </button>

          {/* Quick Start pill button */}
          <button
            onClick={onQuickStart}
            className="hidden sm:flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-xs transition-all active:scale-95"
          >
            <span>{t('quickStart')}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
