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
  'Daily Motivation': 'Motivação diária',
  'New motivational quote': 'Nova frase motivacional',
  'Workout Streak': 'Sequência de treinos',
  days: 'dias',
  'Keep the momentum going!': 'Continue mantendo o ritmo!',
  'Complete a workout to start!': 'Complete um treino para começar!',
  'Weekly Goal': 'Meta semanal',
  'Goal achieved! 🔥': 'Meta alcançada! 🔥',
  'more to hit goal': 'restantes para atingir a meta',
  'Active Program': 'Programa ativo',
  'View Plan': 'Ver plano',
  completed: 'concluídos',
  'Rest Day Today 🧘': 'Dia de descanso hoje 🧘',
  'Start Day': 'Iniciar dia',
  "Today's Recommended Workout": 'Treino recomendado de hoje',
  mins: 'min',
  'Start Workout Now': 'Iniciar treino agora',
  'Quick Start Sessions': 'Sessões rápidas',
  'All Workouts →': 'Todos os treinos →',
  'Recent Activity': 'Atividade recente',
  'Full Log →': 'Histórico completo →',
  'No workouts logged yet.': 'Nenhum treino registrado ainda.',
  "Start today's recommended workout above to begin your fitness log!": 'Inicie o treino recomendado acima para começar seu histórico.',
  Completed: 'Concluído',
  'Daily Vitality & Tone': 'Vitalidade e tonificação diária',
  'Balanced full-body movement to elevate heart rate, tone muscle, and boost energy.': 'Movimentos equilibrados para elevar a frequência cardíaca, tonificar e aumentar a energia.',
  'High-Tempo Metabolic Burn': 'Queima metabólica acelerada',
  'Dynamic bodyweight intervals to ignite your metabolism and torch calories.': 'Intervalos dinâmicos com peso corporal para acelerar o metabolismo e queimar calorias.',
  'Bodyweight Muscle Builder': 'Construtor de músculos com peso corporal',
  'Controlled progressive overload targeting chest, shoulders, legs, and abs.': 'Sobrecarga progressiva controlada para peito, ombros, pernas e abdome.',
  'Spinal Decompress & Hip Opener': 'Descompressão da coluna e abertura do quadril',
  'Restorative yoga flow and gentle joint mobility to release deep stiffness.': 'Fluxo restaurador de yoga e mobilidade suave para aliviar a rigidez.',
  '10-Min Quick Sweat': 'Suor rápido de 10 minutos',
  'Fast, high-efficiency bodyweight blast for busy days.': 'Treino rápido e eficiente com peso corporal para dias corridos.',
  '7-Min Core Crusher': 'Desafio de abdome em 7 minutos',
  'Non-stop burn for sculpted, stable abdominals.': 'Queima contínua para um abdome definido e estável.',
  'Upper Body Pump': 'Potência para membros superiores',
  'Push-up variations and tricep burns for chest and arms.': 'Variações de flexão e trabalho de tríceps para peito e braços.',
  'Evening Relax & Unwind': 'Relaxamento noturno',
  'Release daily tension, decompress the spine, and sleep better.': 'Libere a tensão diária, descomprima a coluna e durma melhor.',
  "You don't have to be extreme, just consistent.": 'Você não precisa ser extremo, apenas consistente.',
  'The body achieves what the mind believes.': 'O corpo alcança aquilo em que a mente acredita.',
  'Action is the foundational key to all success.': 'A ação é a base de todo sucesso.',
  'No gym? No problem. Your body is your greatest gym.': 'Sem academia? Sem problema. Seu corpo é sua melhor academia.',
  'Small daily improvements over time lead to stunning results.': 'Pequenas melhorias diárias geram resultados incríveis com o tempo.',
  'Energy flows where focus goes.': 'A energia flui para onde está o foco.',
  'A 20-minute workout is only 1.4% of your entire day.': 'Um treino de 20 minutos representa apenas 1,4% do seu dia.',
  'HomeFit Philosophy': 'Filosofia HomeFit',
  'Calisthenics Proverb': 'Provérbio de calistenia',
  'Daily Reminder': 'Lembrete diário',
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
