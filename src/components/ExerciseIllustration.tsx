import React from 'react';

interface ExerciseIllustrationProps {
  type?: 'squat' | 'pushup' | 'lunge' | 'jumping_jack' | 'plank' | 'burpee' | 'crunch' | 'stretch' | 'cardio';
  isPaused?: boolean;
  className?: string;
  icon?: string;
}

export const ExerciseIllustration: React.FC<ExerciseIllustrationProps> = ({
  type = 'squat',
  isPaused = false,
  className = '',
  icon = '💪'
}) => {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-emerald-500/10 dark:from-orange-500/20 dark:via-zinc-800 dark:to-emerald-500/10 border border-orange-200/50 dark:border-zinc-700/60 p-6 ${className}`}
    >
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.15)_0%,transparent_70%)] pointer-events-none" />

      {/* SVG Vector Animation Representation */}
      <div className={`relative flex flex-col items-center justify-center transition-transform ${isPaused ? '' : 'animate-pulse'}`}>
        <svg
          viewBox="0 0 160 160"
          className="w-32 h-32 text-orange-600 dark:text-orange-400 stroke-current drop-shadow-sm"
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {type === 'pushup' && (
            <g className="transition-all">
              {/* Floor */}
              <line x1="20" y1="130" x2="140" y2="130" stroke="currentColor" strokeWidth="4" strokeDasharray="4 4" className="opacity-40" />
              {/* Head */}
              <circle cx="120" cy="70" r="10" fill="currentColor" />
              {/* Torso & Legs */}
              <line x1="115" y1="78" x2="40" y2="120" stroke="currentColor" strokeWidth="8" />
              {/* Arms */}
              <polyline points="105,85 105,128 115,128" stroke="currentColor" strokeWidth="6" />
              {/* Feet */}
              <line x1="38" y1="120" x2="30" y2="128" stroke="currentColor" strokeWidth="6" />
            </g>
          )}

          {type === 'squat' && (
            <g>
              {/* Floor */}
              <line x1="20" y1="140" x2="140" y2="140" stroke="currentColor" strokeWidth="4" strokeDasharray="4 4" className="opacity-40" />
              {/* Head */}
              <circle cx="80" cy="40" r="11" fill="currentColor" />
              {/* Spine/Torso */}
              <line x1="80" y1="52" x2="70" y2="88" stroke="currentColor" strokeWidth="8" />
              {/* Arms reaching forward for balance */}
              <polyline points="78,64 105,62 125,60" stroke="currentColor" strokeWidth="6" />
              {/* Thighs parallel to floor */}
              <line x1="70" y1="88" x2="105" y2="90" stroke="currentColor" strokeWidth="8" />
              {/* Lower leg */}
              <line x1="105" y1="90" x2="95" y2="138" stroke="currentColor" strokeWidth="7" />
              {/* Foot */}
              <line x1="95" y1="138" x2="115" y2="138" stroke="currentColor" strokeWidth="6" />
            </g>
          )}

          {type === 'lunge' && (
            <g>
              <line x1="20" y1="140" x2="140" y2="140" stroke="currentColor" strokeWidth="4" strokeDasharray="4 4" className="opacity-40" />
              {/* Head */}
              <circle cx="75" cy="40" r="10" fill="currentColor" />
              {/* Torso upright */}
              <line x1="75" y1="50" x2="75" y2="85" stroke="currentColor" strokeWidth="8" />
              {/* Front Leg */}
              <polyline points="75,85 105,86 105,138" stroke="currentColor" strokeWidth="7" />
              {/* Back Leg */}
              <polyline points="75,85 45,95 45,135" stroke="currentColor" strokeWidth="7" />
            </g>
          )}

          {type === 'plank' && (
            <g>
              <line x1="15" y1="130" x2="145" y2="130" stroke="currentColor" strokeWidth="4" strokeDasharray="4 4" className="opacity-40" />
              {/* Head */}
              <circle cx="125" cy="75" r="10" fill="currentColor" />
              {/* Straight body line */}
              <line x1="120" y1="80" x2="35" y2="115" stroke="currentColor" strokeWidth="8" />
              {/* Forearm */}
              <polyline points="110,85 110,126 126,126" stroke="currentColor" strokeWidth="7" />
              {/* Toes */}
              <line x1="35" y1="115" x2="30" y2="126" stroke="currentColor" strokeWidth="6" />
            </g>
          )}

          {type === 'jumping_jack' && (
            <g>
              {/* Head */}
              <circle cx="80" cy="35" r="10" fill="currentColor" />
              {/* Torso */}
              <line x1="80" y1="46" x2="80" y2="92" stroke="currentColor" strokeWidth="8" />
              {/* Overhead spread arms */}
              <line x1="80" y1="60" x2="120" y2="35" stroke="currentColor" strokeWidth="6" />
              <line x1="80" y1="60" x2="40" y2="35" stroke="currentColor" strokeWidth="6" />
              {/* Spread legs */}
              <line x1="80" y1="92" x2="115" y2="138" stroke="currentColor" strokeWidth="7" />
              <line x1="80" y1="92" x2="45" y2="138" stroke="currentColor" strokeWidth="7" />
            </g>
          )}

          {type === 'burpee' && (
            <g>
              {/* Head */}
              <circle cx="80" cy="30" r="10" fill="currentColor" />
              {/* Explosive vertical leap */}
              <line x1="80" y1="42" x2="80" y2="85" stroke="currentColor" strokeWidth="8" />
              {/* High clap */}
              <polyline points="50,25 80,18 110,25" stroke="currentColor" strokeWidth="6" />
              <line x1="80" y1="52" x2="50" y2="25" stroke="currentColor" strokeWidth="6" />
              <line x1="80" y1="52" x2="110" y2="25" stroke="currentColor" strokeWidth="6" />
              {/* Feet tucked */}
              <polyline points="80,85 95,110 85,135" stroke="currentColor" strokeWidth="7" />
              <polyline points="80,85 65,110 75,135" stroke="currentColor" strokeWidth="7" />
            </g>
          )}

          {type === 'crunch' && (
            <g>
              <line x1="20" y1="130" x2="140" y2="130" stroke="currentColor" strokeWidth="4" strokeDasharray="4 4" className="opacity-40" />
              {/* Head raised */}
              <circle cx="45" cy="85" r="10" fill="currentColor" />
              {/* Curved torso */}
              <polyline points="45,95 65,115 90,126" stroke="currentColor" strokeWidth="8" />
              {/* Knees up */}
              <polyline points="90,126 120,80 135,126" stroke="currentColor" strokeWidth="7" />
              {/* Hands behind neck */}
              <polyline points="60,105 50,92 42,90" stroke="currentColor" strokeWidth="5" />
            </g>
          )}

          {type === 'stretch' && (
            <g>
              {/* Calm flowing stretch */}
              <circle cx="80" cy="45" r="11" fill="currentColor" />
              <path d="M 80 58 Q 70 85 85 105" stroke="currentColor" strokeWidth="8" />
              <line x1="80" y1="68" x2="120" y2="55" stroke="currentColor" strokeWidth="6" />
              <line x1="80" y1="68" x2="40" y2="60" stroke="currentColor" strokeWidth="6" />
              <polyline points="85,105 105,140" stroke="currentColor" strokeWidth="7" />
              <polyline points="85,105 60,140" stroke="currentColor" strokeWidth="7" />
            </g>
          )}

          {type === 'cardio' && (
            <g>
              {/* Runner motion */}
              <circle cx="95" cy="40" r="10" fill="currentColor" />
              <line x1="90" y1="52" x2="75" y2="90" stroke="currentColor" strokeWidth="8" />
              {/* Dynamic running arms */}
              <polyline points="88,62 110,75 125,65" stroke="currentColor" strokeWidth="6" />
              <polyline points="88,62 60,60 48,78" stroke="currentColor" strokeWidth="6" />
              {/* High Knee Leg */}
              <polyline points="75,90 100,85 100,120" stroke="currentColor" strokeWidth="7" />
              {/* Trailing Leg */}
              <polyline points="75,90 50,110 40,138" stroke="currentColor" strokeWidth="7" />
            </g>
          )}
        </svg>

        <div className="mt-3 flex items-center gap-1.5 px-3 py-1 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm rounded-full border border-orange-200 dark:border-zinc-700 shadow-xs">
          <span className="text-base">{icon}</span>
          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 capitalize">
            {type.replace('_', ' ')} Focus
          </span>
        </div>
      </div>
    </div>
  );
};
