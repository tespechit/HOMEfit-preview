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

const textTranslations: Record<string, string> = {
  'Custom Workout Builder': 'Montar treino personalizado',
  'Create, customize, and save your own routines.': 'Crie, personalize e salve suas rotinas.',
  'Create New': 'Criar novo',
  'Workout Title': 'Título do treino',
  'Short Description / Goal': 'Descrição curta / objetivo',
  'Exercises': 'Exercícios',
  'Est. Duration': 'Duração estimada',
  'Est. Burn': 'Gasto estimado',
  'Workout Sequence': 'Sequência do treino',
  'Add Exercise': 'Adicionar exercício',
  'No exercises added yet. Tap "Add Exercise" to select from the library!': 'Nenhum exercício adicionado. Toque em "Adicionar exercício" para escolher na biblioteca.',
  'Work Interval': 'Intervalo de trabalho',
  'Rest Interval': 'Intervalo de descanso',
  'Save Routine': 'Salvar rotina',
  'Cancel': 'Cancelar',
  'Pick Exercise to Add': 'Escolha o exercício para adicionar',
  'Type of exercise': 'Tipo de exercício',
  'Equipment use': 'Uso de equipamentos',
  'Worked region': 'Região trabalhada',
  'Close details': 'Fechar detalhes',
  'Difficulty': 'Dificuldade',
  'Equipment': 'Equipamento',
  'Target Muscles': 'Músculos trabalhados',
  'Step-by-Step Instructions': 'Instruções passo a passo',
  'Common Mistakes to Avoid': 'Erros comuns a evitar',
  'Form Cues': 'Dicas de execução',
  'Breathing': 'Respiração',
  'Coach Pro Tip': 'Dica do treinador',
  'Ready-Made Programs': 'Programas prontos',
  'Exercise Library': 'Biblioteca de exercícios',
  Enrolled: 'Inscrito',
  'Enroll in This Program': 'Inscrever-se neste programa',
  'Program Schedule & Workouts': 'Agenda e treinos do programa',
  Start: 'Iniciar',
  'Add to Custom': 'Adicionar ao personalizado',
  'Start Quick Exercise': 'Iniciar exercício rápido',
  'Current Exercise': 'Exercício atual',
  'Next Exercise': 'Próximo exercício',
  'First Exercise': 'Primeiro exercício',
  'Get into position': 'Prepare-se para começar',
  'Focus on controlled form': 'Concentre-se em uma execução controlada',
};

type TranslationKey = keyof typeof translations.en;

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
  tx: (text: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useLocalStorage<Language>('homefit_language', 'pt-BR');
  const value = useMemo(() => ({
    language,
    setLanguage,
    t: (key: TranslationKey) => translations[language][key],
    tx: (text: string) => language === 'pt-BR' ? (textTranslations[text] || text) : text,
  }), [language, setLanguage]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider');
  return context;
};
