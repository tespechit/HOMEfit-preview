import React, { createContext, useContext, useMemo } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';

export type Language = 'en' | 'pt-BR';

const translations = {
  en: {
    home: 'Home', workouts: 'Workouts', builder: 'Builder', progress: 'Progress', profile: 'Profile',
    noEquipment: 'No Gym Equipment', quickStart: 'Quick Start', language: 'Language',
    customBuilder: 'Custom Workout Builder', createNew: 'Create New', addExercise: 'Add Exercise',
    exerciseSearch: 'Search by exercise name or muscle...',
    all: 'All', aerobic: 'Aerobic', strength: 'Strength', stretching: 'Stretching',
    allRegions: 'All regions', exercisesFound: 'exercises found',
  },
  'pt-BR': {
    home: 'Início', workouts: 'Treinos', builder: 'Montar', progress: 'Progresso', profile: 'Perfil',
    noEquipment: 'Sem equipamentos', quickStart: 'Começar rápido', language: 'Idioma',
    customBuilder: 'Montar treino personalizado', createNew: 'Criar novo', addExercise: 'Adicionar exercício',
    exerciseSearch: 'Buscar por nome do exercício ou músculo...',
    all: 'Todos', aerobic: 'Aeróbico', strength: 'Força', stretching: 'Alongamento',
    allRegions: 'Todas as regiões', exercisesFound: 'exercícios encontrados',
  },
} as const;

type TranslationKey = keyof typeof translations.en;

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useLocalStorage<Language>('homefit_language', 'pt-BR');
  const value = useMemo(() => ({
    language,
    setLanguage,
    t: (key: TranslationKey) => translations[language][key],
  }), [language, setLanguage]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider');
  return context;
};
