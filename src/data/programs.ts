import { Program, ProgramDay } from '../types';

// Helper to create program days easily
function createDay(
  dayNumber: number,
  title: string,
  focus: string,
  durationMinutes: number,
  exerciseIds: string[],
  workSec = 40,
  restSec = 20,
  isRest = false,
  recoveryTip?: string
): ProgramDay {
  if (isRest) {
    return {
      dayNumber,
      isRestDay: true,
      title: title || 'Rest & Recovery Day',
      focus: focus || 'Full body recovery, hydration and muscle repair',
      durationMinutes: 0,
      exercises: [],
      recoveryTip:
        recoveryTip ||
        'Take a 20-minute relaxing walk, drink plenty of water, and do 5 minutes of gentle breathing or light stretching.'
    };
  }

  return {
    dayNumber,
    isRestDay: false,
    title,
    focus,
    durationMinutes,
    exercises: exerciseIds.map(id => ({
      exerciseId: id,
      workSec,
      restSec,
    })),
    recoveryTip,
  };
}

export const PROGRAMS: Program[] = [
  {
    id: '7-day-kickstart',
    title: '7-Day Kickstart',
    subtitle: 'Ignite your home fitness habit in just 15 minutes a day',
    description:
      'The perfect launchpad for home fitness. Master foundational bodyweight movements, boost daily energy, and establish an unbroken workout streak without equipment.',
    durationDays: 7,
    difficulty: 'Beginner',
    category: 'Full Body',
    badgeColor: 'bg-emerald-500',
    days: [
      createDay(1, 'Full Body Ignite', 'Foundation movement & stamina', 15, [
        'jumping-jacks',
        'bodyweight-squats',
        'wall-pushups',
        'forearm-plank',
        'glute-bridges'
      ], 35, 20),
      createDay(2, 'Core Stability & Spine', 'Abdominal strength & posture', 14, [
        'dead-bug',
        'bird-dog',
        'shoulder-taps',
        'glute-bridges',
        'forearm-plank'
      ], 35, 20),
      createDay(3, 'Rest & Active Recovery', 'Recovery & muscle repair', 0, [], 0, 0, true,
        'Active recovery day! Take a brisk 15-minute walk outside and hydrate well with at least 2 liters of water.'
      ),
      createDay(4, 'Lower Body Power', 'Quads, glutes & hamstrings', 16, [
        'bodyweight-squats',
        'forward-lunges',
        'sumo-squats',
        'wall-sit',
        'calf-raises'
      ], 40, 20),
      createDay(5, 'Upper Body Sculpt', 'Chest, arms & shoulders', 16, [
        'wall-pushups',
        'tricep-dips',
        'shoulder-taps',
        'standard-pushups'
      ], 35, 20),
      createDay(6, 'Cardio Sweat Blast', 'Calorie burn & endurance', 18, [
        'jumping-jacks',
        'mountain-climbers',
        'skater-hops',
        'butt-kicks',
        'high-knees'
      ], 40, 20),
      createDay(7, 'Complete Reset & Stretch', 'Flexibility & relaxation', 0, [], 0, 0, true,
        'Congratulations on finishing your 7-Day Kickstart! Treat your muscles to a gentle hot bath and 10 minutes of deep breathing.'
      )
    ]
  },
  {
    id: '30-day-fat-burn',
    title: '30-Day Fat Burn',
    subtitle: 'High-intensity metabolic conditioning & full-body transformation',
    description:
      'A structured 30-day progressive bodyweight program alternating high-intensity interval training, full-body resistance, and planned recovery days to accelerate metabolic burn.',
    durationDays: 30,
    difficulty: 'Intermediate',
    category: 'Cardio/HIIT',
    badgeColor: 'bg-orange-500',
    days: Array.from({ length: 30 }, (_, idx) => {
      const day = idx + 1;
      const isRest = day % 4 === 0; // Every 4th day is recovery
      if (isRest) {
        return createDay(
          day,
          `Day ${day}: Rest & Mobility`,
          'Cellular recovery & tissue restoration',
          0,
          [],
          0,
          0,
          true,
          'Give your central nervous system rest. Practice 10 minutes of gentle yoga or foam rolling today.'
        );
      }

      if (day % 3 === 1) {
        return createDay(
          day,
          `Day ${day}: HIIT Turbo Burn`,
          'Cardio & maximal oxygen consumption',
          20,
          ['burpees', 'jumping-jacks', 'mountain-climbers', 'skater-hops', 'high-knees', 'half-burpees'],
          40,
          20
        );
      } else if (day % 3 === 2) {
        return createDay(
          day,
          `Day ${day}: Total Strength Blitz`,
          'Full-body muscular resistance',
          22,
          ['bodyweight-squats', 'standard-pushups', 'reverse-lunges', 'tricep-dips', 'forearm-plank'],
          45,
          15
        );
      } else {
        return createDay(
          day,
          `Day ${day}: Core & Athleticism`,
          'Rotational power and midsection definition',
          18,
          ['bicycle-crunches', 'russian-twists', 'shoulder-taps', 'flutter-kicks', 'side-plank'],
          40,
          20
        );
      }
    })
  },
  {
    id: 'abs-in-4-weeks',
    title: 'Abs in 4 Weeks',
    subtitle: 'Targeted core sculpting, deep transverse engagement & waist taper',
    description:
      '28 days of progressive core workouts targeting the upper abs, lower abs, obliques, and transverse abdominis with active rest days to prevent lumbar strain.',
    durationDays: 28,
    difficulty: 'Intermediate',
    category: 'Core/Abs',
    badgeColor: 'bg-amber-500',
    days: Array.from({ length: 28 }, (_, idx) => {
      const day = idx + 1;
      const isRest = day % 3 === 0;
      if (isRest) {
        return createDay(
          day,
          `Day ${day}: Core Recovery & Spine Decompression`,
          'Lumbar relaxation & stretch',
          0,
          [],
          0,
          0,
          true,
          'Your abdominal wall rebuilds stronger while resting. Do 5 minutes of Cat-Cow and Child Pose stretches.'
        );
      }

      const isOdd = day % 2 === 1;
      return createDay(
        day,
        isOdd ? `Day ${day}: Deep Core & Obliques` : `Day ${day}: Six-Pack Builder`,
        isOdd ? 'Rotational stability and anti-extension' : 'Upper & lower rectus abdominis focus',
        16,
        isOdd
          ? ['forearm-plank', 'bicycle-crunches', 'russian-twists', 'side-plank', 'mountain-climber-twists']
          : ['leg-raises', 'dead-bug', 'flutter-kicks', 'hollow-body-hold', 'v-ups'],
        35,
        15
      );
    })
  },
  {
    id: 'beginner-strength',
    title: 'Beginner Bodyweight Strength',
    subtitle: 'Build solid lean muscle and joint resilience with zero equipment',
    description:
      '14-day masterclass on progressive overload without weights. Learn to generate maximum tension through deliberate tempo and full range of motion.',
    durationDays: 14,
    difficulty: 'Beginner',
    category: 'Upper Body',
    badgeColor: 'bg-blue-500',
    days: Array.from({ length: 14 }, (_, idx) => {
      const day = idx + 1;
      const isRest = day % 2 === 0;
      if (isRest) {
        return createDay(
          day,
          `Day ${day}: Muscle Synthesis & Rest`,
          'Rest for muscular adaptation',
          0,
          [],
          0,
          0,
          true,
          'Adequate sleep (7-8 hours) is when muscle repair occurs. Ensure you hit your protein and water goals!'
        );
      }
      return createDay(
        day,
        `Day ${day}: Upper & Lower Strength`,
        'Compound bodyweight movements',
        18,
        ['standard-pushups', 'bodyweight-squats', 'tricep-dips', 'reverse-lunges', 'forearm-plank'],
        40,
        25
      );
    })
  },
  {
    id: 'daily-mobility-yoga',
    title: '7-Day Mobility & Yoga Flow',
    subtitle: 'Unlock stiff joints, relieve lower back tightness, and restore posture',
    description:
      'Gentle yet transformative routines designed for desk workers, athletes, and anyone wanting to improve flexibility, reduce stress, and restore spinal alignment.',
    durationDays: 7,
    difficulty: 'Beginner',
    category: 'Stretching/Yoga',
    badgeColor: 'bg-teal-500',
    days: [
      createDay(1, 'Spine & Neck Decompress', 'Cervical & thoracic release', 12, ['cat-cow-stretch', 'childs-pose', 'cobra-stretch'], 45, 15),
      createDay(2, 'Hip Opener Flow', 'Relieve tight hips & pelvic tilt', 14, ['pigeon-pose', 'worlds-greatest-stretch', 'childs-pose'], 45, 15),
      createDay(3, 'Posterior Chain Stretch', 'Hamstrings, calves & glutes', 14, ['downward-dog', 'standing-quad-stretch', 'pigeon-pose'], 45, 15),
      createDay(4, 'Full Body Mobility Flow', 'Total movement integration', 16, ['worlds-greatest-stretch', 'cat-cow-stretch', 'downward-dog', 'childs-pose'], 45, 15),
      createDay(5, 'Chest & Shoulder Openers', 'Counteract slouching & screen time', 12, ['cobra-stretch', 'childs-pose', 'cat-cow-stretch'], 45, 15),
      createDay(6, 'Deep Restorative Unwind', 'Nervous system relaxation', 15, ['childs-pose', 'downward-dog', 'pigeon-pose', 'cobra-stretch'], 50, 15),
      createDay(7, 'Ultimate Sunday Reset', 'Full body renewed vitality', 15, ['cat-cow-stretch', 'worlds-greatest-stretch', 'standing-quad-stretch', 'childs-pose'], 50, 15),
    ]
  }
];

export const PROGRAMS_BY_ID = new Map(PROGRAMS.map(p => [p.id, p]));
