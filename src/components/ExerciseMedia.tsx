import React, { useState } from 'react';
import { UserRound } from 'lucide-react';
import { FreeExerciseMedia } from '../types';

interface ExerciseMediaProps {
  media?: FreeExerciseMedia;
  className?: string;
  compact?: boolean;
}

export const ExerciseMedia: React.FC<ExerciseMediaProps> = ({ media, className = '', compact = false }) => {
  const [model, setModel] = useState<'male' | 'female'>('female');
  const videoUrl = media?.videos?.[model] || media?.videos?.male || media?.videos?.female;
  const posterUrl = media?.thumbnails?.[model] || media?.thumbnails?.male || media?.thumbnails?.female;

  if (!media || !videoUrl) return null;

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-zinc-950 ${className}`}>
      <video
        key={videoUrl}
        className="w-full h-full object-cover"
        src={videoUrl}
        poster={posterUrl}
        controls
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
      />
      {!compact && (
        <div className="absolute left-3 top-3 flex gap-1.5">
          {(['female', 'male'] as const).map(option => (
            <button
              key={option}
              type="button"
              onClick={() => setModel(option)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold capitalize flex items-center gap-1 ${
                model === option ? 'bg-orange-600 text-white' : 'bg-black/60 text-zinc-200'
              }`}
            >
              <UserRound className="w-3 h-3" />
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
