import { Exercise } from '../types';
import { getFreeExerciseMedia } from './freeExerciseDb';

export const EXERCISES: Exercise[] = [
  // --- FULL BODY (7) ---
  {
    id: 'burpees',
    name: 'Burpees',
    category: 'Full Body',
    targetMuscles: ['Chest', 'Quads', 'Glutes', 'Core', 'Cardiovascular System'],
    difficulty: 'Intermediate',
    equipment: 'None',
    defaultDuration: 40,
    defaultReps: 12,
    estCaloriesPerMin: 12,
    icon: '⚡',
    animationType: 'burpee',
    instructions: [
      'Stand with your feet shoulder-width apart and arms by your sides.',
      'Drop your hands to the floor just outside your feet and kick your feet back into a push-up plank.',
      'Lower your chest completely to the floor in a controlled motion.',
      'Press back up, jump your feet back forward toward your hands.',
      'Explode upward into a vertical jump, clapping your hands overhead.'
    ],
    commonMistakes: [
      'Sagging your lower back during the plank or push-up phase.',
      'Landing on stiff knees instead of softly absorbing impact.',
      'Pacing too fast early and compromising form.'
    ],
    proTip: 'For low-impact, step your feet back one at a time instead of jumping back.'
  },
  {
    id: 'jumping-jacks',
    name: 'Jumping Jacks',
    category: 'Full Body',
    targetMuscles: ['Calves', 'Shoulders', 'Cardio', 'Glutes'],
    difficulty: 'Beginner',
    equipment: 'None',
    defaultDuration: 45,
    defaultReps: 30,
    estCaloriesPerMin: 9,
    icon: '⭐',
    animationType: 'jumping_jack',
    instructions: [
      'Stand upright with feet together and arms resting comfortably at your sides.',
      'Bend knees slightly and jump outward while sweeping arms out and overhead.',
      'Clap or tap fingertips lightly above your head.',
      'Jump back to starting position landing softly on the balls of your feet.'
    ],
    commonMistakes: [
      'Landing heavily on flat feet without knee bend.',
      'Shortening the arm range of motion.'
    ],
    proTip: 'Stay on your toes and keep a rhythmic, steady breathing pace throughout.'
  },
  {
    id: 'mountain-climbers',
    name: 'Mountain Climbers',
    category: 'Full Body',
    targetMuscles: ['Core', 'Shoulders', 'Hip Flexors', 'Quads'],
    difficulty: 'Intermediate',
    equipment: 'None',
    defaultDuration: 35,
    defaultReps: 25,
    estCaloriesPerMin: 10,
    icon: '🧗',
    animationType: 'cardio',
    instructions: [
      'Begin in a tall push-up plank position with hands beneath shoulders.',
      'Engage your abdominal wall and keep hips aligned with shoulders.',
      'Drive your right knee up toward your chest without touching the floor with your right foot.',
      'Quickly switch legs, extending the right back while driving the left knee forward.'
    ],
    commonMistakes: [
      'Bouncing hips high in the air.',
      'Letting shoulders drift behind your wrists.'
    ],
    proTip: 'Focus on core tension and knee drive rather than just foot speed.'
  },
  {
    id: 'bear-crawl',
    name: 'Bear Crawl Hold / Steps',
    category: 'Full Body',
    targetMuscles: ['Core', 'Shoulders', 'Quads', 'Triceps'],
    difficulty: 'Intermediate',
    equipment: 'None',
    defaultDuration: 30,
    defaultReps: 16,
    estCaloriesPerMin: 8.5,
    icon: '🐻',
    animationType: 'plank',
    instructions: [
      'Start on all fours with hands under shoulders and knees directly under hips.',
      'Tuck toes and hover your knees 1-2 inches off the ground.',
      'Keep back flat like a tabletop and core braced tight.',
      'Step opposing hand and foot forward smoothly without rocking hips.'
    ],
    commonMistakes: [
      'Lifting hips too high in the air.',
      'Arching lower back downwards.'
    ],
    proTip: 'Imagine balancing a glass of water on your lower back.'
  },
  {
    id: 'star-jumps',
    name: 'Star Jumps',
    category: 'Full Body',
    targetMuscles: ['Quads', 'Glutes', 'Calves', 'Shoulders'],
    difficulty: 'Advanced',
    equipment: 'None',
    defaultDuration: 30,
    defaultReps: 15,
    estCaloriesPerMin: 11,
    icon: '✨',
    animationType: 'jumping_jack',
    instructions: [
      'Begin in a quarter crouch with feet close together and hands touching your shins.',
      'Explode upward off the balls of both feet into the air.',
      'Spread arms and legs outward diagonally to form an "X" or star shape mid-air.',
      'Bring limbs back in quickly to land softly in the quarter crouch.'
    ],
    commonMistakes: [
      'Landing with locked stiff knees.',
      'Slouching the thoracic spine.'
    ],
    proTip: 'Focus on explosive hip extension and controlled soft landings.'
  },
  {
    id: 'inchworms',
    name: 'Inchworms',
    category: 'Full Body',
    targetMuscles: ['Hamstrings', 'Shoulders', 'Core', 'Chest'],
    difficulty: 'Beginner',
    equipment: 'None',
    defaultDuration: 40,
    defaultReps: 10,
    estCaloriesPerMin: 7.5,
    icon: '🐛',
    animationType: 'plank',
    instructions: [
      'Stand tall with feet hip-width apart.',
      'Hinge forward from the hips with a slight bend in knees to touch the floor.',
      'Walk your hands forward one at a time until you reach a full high plank.',
      'Pause briefly to squeeze your glutes and core, then walk hands back toward feet.'
    ],
    commonMistakes: [
      'Sagging hips at the plank transition.',
      'Forcing straight legs if hamstrings are tight.'
    ],
    proTip: 'Bend your knees slightly if your hamstrings feel overly tight.'
  },
  {
    id: 'high-knees',
    name: 'High Knees',
    category: 'Full Body',
    targetMuscles: ['Hip Flexors', 'Quads', 'Calves', 'Cardiovascular'],
    difficulty: 'Beginner',
    equipment: 'None',
    defaultDuration: 40,
    defaultReps: 40,
    estCaloriesPerMin: 10.5,
    icon: '🏃',
    animationType: 'cardio',
    instructions: [
      'Stand in place with feet hip-distance apart.',
      'Drive one knee up toward your hip level while pumping the opposite arm.',
      'Quickly switch sides, landing softly on the ball of the foot.',
      'Maintain an upright posture and brisk cadence.'
    ],
    commonMistakes: [
      'Leaning backward to compensate for hip height.',
      'Slapping heels loudly onto the floor.'
    ],
    proTip: 'Keep torso tall and hold elbows at 90-degree angles as you pump.'
  },

  // --- UPPER BODY (8) ---
  {
    id: 'standard-pushups',
    name: 'Standard Push-ups',
    category: 'Upper Body',
    targetMuscles: ['Chest', 'Anterior Deltoids', 'Triceps', 'Core'],
    difficulty: 'Intermediate',
    equipment: 'None',
    defaultDuration: 40,
    defaultReps: 15,
    estCaloriesPerMin: 8,
    icon: '💪',
    animationType: 'pushup',
    instructions: [
      'Set hands slightly wider than shoulder-width, fingers pointing forward or slightly out.',
      'Form a straight line from heels to ears, squeezing your glutes and abdominal wall.',
      'Lower your body by bending elbows at roughly 45 degrees until chest is just above floor.',
      'Push firmly through palm centers to lock out elbows cleanly at top.'
    ],
    commonMistakes: [
      'Flaring elbows out to 90 degrees.',
      'Dropping hips or sticking buttocks up in the air.',
      'Craning head toward floor instead of lowering full chest.'
    ],
    proTip: 'Screw your hands into the floor to activate your lats and stabilize shoulders.'
  },
  {
    id: 'diamond-pushups',
    name: 'Diamond Push-ups',
    category: 'Upper Body',
    targetMuscles: ['Triceps', 'Inner Chest', 'Shoulders'],
    difficulty: 'Advanced',
    equipment: 'None',
    defaultDuration: 30,
    defaultReps: 10,
    estCaloriesPerMin: 8.5,
    icon: '💎',
    animationType: 'pushup',
    instructions: [
      'Get into a plank position and bring index fingers and thumbs together to form a diamond shape directly under chest.',
      'Keep your body rigid in a straight line.',
      'Lower chest slowly toward the center of the diamond.',
      'Press through triceps back up to full extension.'
    ],
    commonMistakes: [
      'Spreading elbows excessively wide.',
      'Losing pelvic tilt and sagging lower back.'
    ],
    proTip: 'Perform from knees if needed to maintain smooth elbow track.'
  },
  {
    id: 'wide-grip-pushups',
    name: 'Wide-Grip Push-ups',
    category: 'Upper Body',
    targetMuscles: ['Outer Chest', 'Shoulders', 'Serratus Anterior'],
    difficulty: 'Intermediate',
    equipment: 'None',
    defaultDuration: 35,
    defaultReps: 12,
    estCaloriesPerMin: 8,
    icon: '🦅',
    animationType: 'pushup',
    instructions: [
      'Place hands noticeably wider than shoulder-width (approx 1.5x shoulder width).',
      'Lower chest towards floor feeling an expanded stretch across pectoral muscles.',
      'Drive palms hard into the floor to return to starting position.'
    ],
    commonMistakes: [
      'Dropping head down before chest.',
      'Letting shoulders shrug up toward ears.'
    ],
    proTip: 'Keep shoulder blades depressed and retracted at bottom.'
  },
  {
    id: 'pike-pushups',
    name: 'Pike Push-ups',
    category: 'Upper Body',
    targetMuscles: ['Overhead Deltoids', 'Triceps', 'Upper Back'],
    difficulty: 'Advanced',
    equipment: 'None',
    defaultDuration: 35,
    defaultReps: 10,
    estCaloriesPerMin: 8.5,
    icon: '📐',
    animationType: 'pushup',
    instructions: [
      'Start in a downward dog or high V-shape with hips hinged high in the air.',
      'Look toward your feet or hands to keep neck neutral.',
      'Bend elbows backwards to lower the crown of your head toward the floor in front of hands.',
      'Push up and back through the shoulders to return to the pike position.'
    ],
    commonMistakes: [
      'Turning it into a standard horizontal push-up by lowering hips.',
      'Flaring elbows out sideways.'
    ],
    proTip: 'Step feet closer to hands to increase the vertical load on your deltoids.'
  },
  {
    id: 'decline-pushups',
    name: 'Decline Push-ups',
    category: 'Upper Body',
    targetMuscles: ['Upper Chest', 'Deltoids', 'Core'],
    difficulty: 'Advanced',
    equipment: 'Chair/Wall',
    defaultDuration: 30,
    defaultReps: 12,
    estCaloriesPerMin: 9,
    icon: '🪜',
    animationType: 'pushup',
    instructions: [
      'Place toes elevated on a couch, sturdy chair, or step.',
      'Place hands on floor slightly wider than shoulder-width.',
      'Lower chest to hover above floor, keeping core engaged.',
      'Press through chest and shoulders to push up.'
    ],
    commonMistakes: [
      'Arching lower back under the elevated angle.',
      'Rushing reps and cutting range of motion.'
    ],
    proTip: 'Tuck pelvis slightly to maintain lumbar protection throughout.'
  },
  {
    id: 'tricep-dips',
    name: 'Tricep Chair / Floor Dips',
    category: 'Upper Body',
    targetMuscles: ['Triceps', 'Chest', 'Front Delts'],
    difficulty: 'Beginner',
    equipment: 'Chair/Wall',
    defaultDuration: 40,
    defaultReps: 14,
    estCaloriesPerMin: 7,
    icon: '🪑',
    animationType: 'pushup',
    instructions: [
      'Sit on the edge of a sturdy chair or floor with hands beside hips, fingers gripping front edge.',
      'Slide hips slightly off the edge with knees bent at 90 degrees (or legs straight for harder challenge).',
      'Lower torso by bending elbows to about 90 degrees, keeping back close to chair.',
      'Drive through heels of hands to straighten arms back up.'
    ],
    commonMistakes: [
      'Drifting hips too far away from the chair, straining anterior shoulder caps.',
      'Shrugging shoulders into ears.'
    ],
    proTip: 'Keep elbows pointing directly backward, never outward.'
  },
  {
    id: 'shoulder-taps',
    name: 'Plank Shoulder Taps',
    category: 'Upper Body',
    targetMuscles: ['Shoulders', 'Obliques', 'Transverse Abdominis'],
    difficulty: 'Beginner',
    equipment: 'None',
    defaultDuration: 40,
    defaultReps: 24,
    estCaloriesPerMin: 7.5,
    icon: '🖐️',
    animationType: 'plank',
    instructions: [
      'Assume a solid high plank with feet slightly wider than hip-width for balance.',
      'Without rotating hips, lift right hand to tap left shoulder.',
      'Place right hand down slowly, then lift left hand to tap right shoulder.',
      'Keep glutes tight and core braced against twisting.'
    ],
    commonMistakes: [
      'Swinging hips side to side with every tap.',
      'Holding your breath.'
    ],
    proTip: 'Widen your feet to make it easier, or bring feet together for an intense anti-rotation challenge.'
  },
  {
    id: 'wall-pushups',
    name: 'Wall Push-ups',
    category: 'Upper Body',
    targetMuscles: ['Chest', 'Triceps', 'Shoulders'],
    difficulty: 'Beginner',
    equipment: 'Chair/Wall',
    defaultDuration: 45,
    defaultReps: 18,
    estCaloriesPerMin: 5.5,
    icon: '🧱',
    animationType: 'pushup',
    instructions: [
      'Stand about arm’s-length away from a wall, feet shoulder-width.',
      'Place palms flat on the wall at shoulder height and width.',
      'Bend elbows to bring chest smoothly toward wall.',
      'Push back out until arms are extended.'
    ],
    commonMistakes: [
      'Bending at waist instead of keeping straight spine.',
      'Standing too close or too far for balance.'
    ],
    proTip: 'Great for beginners or warm-ups before heavier upper body routines.'
  },

  // --- LOWER BODY (9) ---
  {
    id: 'bodyweight-squats',
    name: 'Bodyweight Squats',
    category: 'Lower Body',
    targetMuscles: ['Quads', 'Glutes', 'Hamstrings', 'Core'],
    difficulty: 'Beginner',
    equipment: 'None',
    defaultDuration: 45,
    defaultReps: 20,
    estCaloriesPerMin: 8,
    icon: '🏋️',
    animationType: 'squat',
    instructions: [
      'Stand tall with feet slightly wider than shoulder-width, toes turned 15-30 degrees outward.',
      'Brace core and send hips backward and down as if sitting into an invisible chair.',
      'Descend until thighs are parallel to the ground or as deep as comfortable.',
      'Drive through your heels and mid-foot to stand back up, squeezing glutes at top.'
    ],
    commonMistakes: [
      'Knees collapsing inward (valgus collapse).',
      'Heels lifting off the ground.',
      'Rounding the lower back.'
    ],
    proTip: 'Keep your chest proud and gaze forward at eye level.'
  },
  {
    id: 'jump-squats',
    name: 'Jump Squats',
    category: 'Lower Body',
    targetMuscles: ['Quads', 'Glutes', 'Calves', 'Cardio Power'],
    difficulty: 'Intermediate',
    equipment: 'None',
    defaultDuration: 35,
    defaultReps: 15,
    estCaloriesPerMin: 11,
    icon: '🚀',
    animationType: 'squat',
    instructions: [
      'Begin in standard squat stance.',
      'Lower smoothly into a parallel squat.',
      'Explosively drive through the whole foot and jump vertically into the air.',
      'Land softly by immediately bending knees and rolling into the next squat.'
    ],
    commonMistakes: [
      'Stiff-legged landing.',
      'Collapsing knees on takeoff or touchdown.'
    ],
    proTip: 'Use your arms to generate upward momentum and control your landing.'
  },
  {
    id: 'forward-lunges',
    name: 'Alternating Forward Lunges',
    category: 'Lower Body',
    targetMuscles: ['Quads', 'Glutes', 'Hamstrings', 'Balance'],
    difficulty: 'Beginner',
    equipment: 'None',
    defaultDuration: 40,
    defaultReps: 16,
    estCaloriesPerMin: 8,
    icon: '🦵',
    animationType: 'lunge',
    instructions: [
      'Stand upright with hands on hips or clasped at chest.',
      'Step forward about 2-3 feet with right foot.',
      'Lower hips until both front and back knees bend to approximately 90 degrees.',
      'Drive through the right heel to push back to starting position, then repeat left.'
    ],
    commonMistakes: [
      'Front knee shooting far beyond toes with heel lifting.',
      'Torso slouching forward over front thigh.'
    ],
    proTip: 'Ensure back knee hovers just an inch above the floor without banging down.'
  },
  {
    id: 'reverse-lunges',
    name: 'Reverse Lunges',
    category: 'Lower Body',
    targetMuscles: ['Glutes', 'Hamstrings', 'Quads'],
    difficulty: 'Beginner',
    equipment: 'None',
    defaultDuration: 40,
    defaultReps: 16,
    estCaloriesPerMin: 7.5,
    icon: '🔙',
    animationType: 'lunge',
    instructions: [
      'Stand tall, take a controlled step backward with one leg.',
      'Lower rear knee toward floor until front thigh is parallel.',
      'Push through front foot heel to return to tall standing stance.',
      'Alternate legs smoothly.'
    ],
    commonMistakes: [
      'Putting too much weight on rear foot.',
      'Wobbling side to side due to narrow foot track.'
    ],
    proTip: 'Keep feet hip-width apart as if walking along railroad tracks, not a tightrope.'
  },
  {
    id: 'bulgarian-split-squats',
    name: 'Bulgarian Split Squats',
    category: 'Lower Body',
    targetMuscles: ['Gluteus Maximus', 'Quads', 'Hamstrings', 'Hip Stabilizers'],
    difficulty: 'Advanced',
    equipment: 'Chair/Wall',
    defaultDuration: 40,
    defaultReps: 12,
    estCaloriesPerMin: 9,
    icon: '🎯',
    animationType: 'lunge',
    instructions: [
      'Stand about 2 feet in front of a chair or couch facing away.',
      'Rest the top of your rear foot on the elevated surface.',
      'Lower your hips straight down until front thigh is nearly parallel to floor.',
      'Drive up through the front heel to return to top.'
    ],
    commonMistakes: [
      'Standing too close to chair cramping knee angle.',
      'Hyperextending spine.'
    ],
    proTip: 'Lean torso slightly forward (15-20 deg) to place maximum emphasis on glutes.'
  },
  {
    id: 'sumo-squats',
    name: 'Sumo Squats',
    category: 'Lower Body',
    targetMuscles: ['Inner Thighs (Adductors)', 'Glutes', 'Quads'],
    difficulty: 'Beginner',
    equipment: 'None',
    defaultDuration: 40,
    defaultReps: 18,
    estCaloriesPerMin: 7.5,
    icon: '🥋',
    animationType: 'squat',
    instructions: [
      'Adopt a wide stance with feet wider than shoulders, toes pointed outwards at 45 degrees.',
      'Keep torso upright and lower hips down.',
      'Push knees out along the line of your toes.',
      'Squeeze inner thighs and glutes to rise up.'
    ],
    commonMistakes: [
      'Allowing knees to cave inward away from toe angle.',
      'Leaning forward excessively.'
    ],
    proTip: 'Actively push the floor away and feel adductors stretch at the bottom.'
  },
  {
    id: 'wall-sit',
    name: 'Wall Sit Hold',
    category: 'Lower Body',
    targetMuscles: ['Quads (Isometric)', 'Glutes', 'Calves'],
    difficulty: 'Intermediate',
    equipment: 'Chair/Wall',
    defaultDuration: 45,
    defaultReps: 1,
    estCaloriesPerMin: 6.5,
    icon: '🧘‍♂️',
    animationType: 'squat',
    instructions: [
      'Lean back against a flat wall and slide down until thighs are parallel to floor.',
      'Ensure knees are directly over ankles forming 90-degree angles.',
      'Press entire spine and head firmly against the wall.',
      'Keep hands off thighs and hold the position breathing calmly.'
    ],
    commonMistakes: [
      'Resting hands or forearms on knees to cheat.',
      'Not sliding down low enough to reach parallel.'
    ],
    proTip: 'Breathe deeply and focus on an anchor point across the room.'
  },
  {
    id: 'glute-bridges',
    name: 'Glute Bridges',
    category: 'Lower Body',
    targetMuscles: ['Glutes', 'Hamstrings', 'Erector Spinae'],
    difficulty: 'Beginner',
    equipment: 'None',
    defaultDuration: 40,
    defaultReps: 20,
    estCaloriesPerMin: 6.5,
    icon: '🌉',
    animationType: 'lunge',
    instructions: [
      'Lie face up on floor with knees bent and feet flat, hip-distance apart.',
      'Arms resting by sides palms down.',
      'Drive through your heels to lift hips upward until thighs and torso align.',
      'Hold a peak squeeze at top for 2 seconds, then lower under control.'
    ],
    commonMistakes: [
      'Over-arching lumbar spine instead of squeezing glutes.',
      'Pushing through toes instead of heels.'
    ],
    proTip: 'Tilt your pelvis posterior (tuck tailbone) before lifting to isolate glutes.'
  },
  {
    id: 'calf-raises',
    name: 'Single-Leg & Double Calf Raises',
    category: 'Lower Body',
    targetMuscles: ['Gastrocnemius', 'Soleus', 'Ankle Stabilizers'],
    difficulty: 'Beginner',
    equipment: 'None',
    defaultDuration: 40,
    defaultReps: 25,
    estCaloriesPerMin: 6,
    icon: '🦶',
    animationType: 'squat',
    instructions: [
      'Stand tall on a flat floor or on the edge of a step for increased stretch.',
      'Press through the balls of both feet to lift heels as high as possible.',
      'Pause for 1 second at the peak contraction.',
      'Slowly lower down until heels touch or drop slightly below step level.'
    ],
    commonMistakes: [
      'Rolling weight onto outer edge of feet.',
      'Bouncing rapidly without pausing at the top.'
    ],
    proTip: 'Focus pressure through big toe mound for optimal calf recruitment.'
  },

  // --- CORE / ABS (11) ---
  {
    id: 'forearm-plank',
    name: 'Forearm Plank',
    category: 'Core/Abs',
    targetMuscles: ['Transverse Abdominis', 'Rectus Abdominis', 'Shoulders', 'Lower Back'],
    difficulty: 'Beginner',
    equipment: 'None',
    defaultDuration: 45,
    defaultReps: 1,
    estCaloriesPerMin: 6,
    icon: '🪵',
    animationType: 'plank',
    instructions: [
      'Lie face down, resting on forearms with elbows directly under shoulders.',
      'Tuck toes and raise body so weight is on forearms and balls of feet.',
      'Create a rigid line from crown of head to heels, squeezing quads and glutes.',
      'Keep head neutral, looking at floor slightly ahead of fingers.'
    ],
    commonMistakes: [
      'Sagging hips putting strain on lower back.',
      'Piking hips too high in the air.',
      'Holding breath.'
    ],
    proTip: 'Actively pull elbows toward toes to create intense full-body tension.'
  },
  {
    id: 'side-plank',
    name: 'Side Plank (Alternating)',
    category: 'Core/Abs',
    targetMuscles: ['Obliques', 'Quadratus Lumborum', 'Shoulder Stabilizers'],
    difficulty: 'Intermediate',
    equipment: 'None',
    defaultDuration: 40,
    defaultReps: 1,
    estCaloriesPerMin: 6,
    icon: '📐',
    animationType: 'plank',
    instructions: [
      'Lie on your right side with legs extended and feet stacked or staggered.',
      'Place right elbow directly beneath right shoulder.',
      'Lift hips off the floor until body forms a straight diagonal line.',
      'Hold, switch sides halfway through interval.'
    ],
    commonMistakes: [
      'Allowing top hip to rotate forward or collapse downward.',
      'Elbow placed too far ahead of shoulder.'
    ],
    proTip: 'Raise top arm straight to the ceiling to improve balance and chest openness.'
  },
  {
    id: 'bicycle-crunches',
    name: 'Bicycle Crunches',
    category: 'Core/Abs',
    targetMuscles: ['Rectus Abdominis', 'Internal/External Obliques'],
    difficulty: 'Intermediate',
    equipment: 'None',
    defaultDuration: 40,
    defaultReps: 24,
    estCaloriesPerMin: 8,
    icon: '🚴',
    animationType: 'crunch',
    instructions: [
      'Lie on back with lower spine pressed into floor and hands lightly behind ears.',
      'Bring knees to 90 degrees and lift shoulder blades off ground.',
      'Extend right leg out at 45 degrees while rotating torso to bring right elbow to left knee.',
      'Switch smoothly, bringing left elbow to right knee.'
    ],
    commonMistakes: [
      'Yanking neck with hands.',
      'Rushing reps without achieving thoracic rotation.'
    ],
    proTip: 'Slow down each rotation to feel deep oblique engagement.'
  },
  {
    id: 'russian-twists',
    name: 'Russian Twists',
    category: 'Core/Abs',
    targetMuscles: ['Obliques', 'Transverse Abdominis', 'Hip Flexors'],
    difficulty: 'Intermediate',
    equipment: 'None',
    defaultDuration: 35,
    defaultReps: 20,
    estCaloriesPerMin: 7.5,
    icon: '🔄',
    animationType: 'crunch',
    instructions: [
      'Sit on floor with knees bent and heels touching floor (or elevated for more intensity).',
      'Lean back slightly so torso is at 45 degrees, keeping spine neutral.',
      'Clasp hands together and rotate torso side-to-side, tapping hands near floor next to hips.'
    ],
    commonMistakes: [
      'Moving arms only without twisting thoracic spine.',
      'Slumping and rounding lower back.'
    ],
    proTip: 'Follow hands with your eyes to ensure full torso rotation.'
  },
  {
    id: 'hollow-body-hold',
    name: 'Hollow Body Hold',
    category: 'Core/Abs',
    targetMuscles: ['Deep Abdominal Wall', 'Hip Flexors'],
    difficulty: 'Advanced',
    equipment: 'None',
    defaultDuration: 30,
    defaultReps: 1,
    estCaloriesPerMin: 7,
    icon: '🍌',
    animationType: 'plank',
    instructions: [
      'Lie flat on back with legs together and arms extended overhead.',
      'Press lower back firmly into the floor so there is zero gap.',
      'Simultaneously lift shoulder blades, head, and legs 2-6 inches off floor.',
      'Hold banana-like curve maintaining lower back glue to floor.'
    ],
    commonMistakes: [
      'Lower back arching off floor (causes lumbar stress).',
      'Holding breath.'
    ],
    proTip: 'Bend knees or bring arms forward to scale down difficulty.'
  },
  {
    id: 'leg-raises',
    name: 'Lying Leg Raises',
    category: 'Core/Abs',
    targetMuscles: ['Lower Rectus Abdominis', 'Hip Flexors'],
    difficulty: 'Intermediate',
    equipment: 'None',
    defaultDuration: 35,
    defaultReps: 15,
    estCaloriesPerMin: 7,
    icon: '📐',
    animationType: 'crunch',
    instructions: [
      'Lie on back with legs straight and hands under lower glutes for support.',
      'Keep legs together and lift them straight up until perpendicular to floor.',
      'Slowly lower legs until they hover just above floor without arching back.',
      'Repeat in a smooth controlled cadence.'
    ],
    commonMistakes: [
      'Using momentum to fling legs up.',
      'Allowing lower back to peel off floor during descent.'
    ],
    proTip: 'Lower legs slowly over 3 seconds to maximize eccentric load.'
  },
  {
    id: 'dead-bug',
    name: 'Dead Bug',
    category: 'Core/Abs',
    targetMuscles: ['Transverse Abdominis', 'Pelvic Floor', 'Contralateral Coordination'],
    difficulty: 'Beginner',
    equipment: 'None',
    defaultDuration: 40,
    defaultReps: 16,
    estCaloriesPerMin: 6,
    icon: '🪲',
    animationType: 'plank',
    instructions: [
      'Lie on back with arms straight toward ceiling and knees bent at 90 degrees directly over hips.',
      'Press lower back into floor.',
      'Slowly lower right arm back overhead while extending left leg forward near floor.',
      'Return to starting point, then repeat opposite arm and leg.'
    ],
    commonMistakes: [
      'Lower back lifting as leg extends.',
      'Moving limbs too fast.'
    ],
    proTip: 'Exhale through pursed lips as you extend opposite limbs.'
  },
  {
    id: 'bird-dog',
    name: 'Bird Dog',
    category: 'Core/Abs',
    targetMuscles: ['Lower Back', 'Glutes', 'Hamstrings', 'Posterior Core'],
    difficulty: 'Beginner',
    equipment: 'None',
    defaultDuration: 40,
    defaultReps: 16,
    estCaloriesPerMin: 6,
    icon: '🐕',
    animationType: 'plank',
    instructions: [
      'Start on hands and knees with neutral spine.',
      'Reach right arm straight ahead while kicking left leg straight behind.',
      'Hold at parallel for 2 seconds, ensuring hips stay square.',
      'Lower and switch to left arm and right leg.'
    ],
    commonMistakes: [
      'Rotating pelvis upward.',
      'Hyper-extending lower back.'
    ],
    proTip: 'Imagine reaching forward to touch a wall and kicking backward to touch another.'
  },
  {
    id: 'flutter-kicks',
    name: 'Flutter Kicks',
    category: 'Core/Abs',
    targetMuscles: ['Lower Abs', 'Hip Flexors', 'Quads'],
    difficulty: 'Intermediate',
    equipment: 'None',
    defaultDuration: 35,
    defaultReps: 30,
    estCaloriesPerMin: 7.5,
    icon: '🌊',
    animationType: 'crunch',
    instructions: [
      'Lie flat on back with hands under hips to safeguard lower back.',
      'Lift both legs 3-6 inches off floor.',
      'Alternate kicking legs up and down in small, rapid, controlled scissor motions.'
    ],
    commonMistakes: [
      'Kicking with bent knees like a bicycle.',
      'Arching lower back.'
    ],
    proTip: 'Point toes and keep legs as straight as steel.'
  },
  {
    id: 'v-ups',
    name: 'V-Ups (V-Sits)',
    category: 'Core/Abs',
    targetMuscles: ['Full Rectus Abdominis', 'Hip Flexors'],
    difficulty: 'Advanced',
    equipment: 'None',
    defaultDuration: 30,
    defaultReps: 12,
    estCaloriesPerMin: 9,
    icon: '✌️',
    animationType: 'crunch',
    instructions: [
      'Lie flat with arms extended overhead and legs straight.',
      'Simultaneously fold torso and legs up into a "V" shape balancing on sitting bones.',
      'Touch hands to shins or toes at the top peak.',
      'Lower under control back to the starting flat position.'
    ],
    commonMistakes: [
      'Bending knees or jerking neck.',
      'Crashing back down to floor.'
    ],
    proTip: 'Exhale forcefully as you hinge up into the V shape.'
  },
  {
    id: 'mountain-climber-twists',
    name: 'Cross-Body Mountain Climbers',
    category: 'Core/Abs',
    targetMuscles: ['Obliques', 'Shoulders', 'Core Stabilizers'],
    difficulty: 'Intermediate',
    equipment: 'None',
    defaultDuration: 35,
    defaultReps: 24,
    estCaloriesPerMin: 9.5,
    icon: '⚡',
    animationType: 'cardio',
    instructions: [
      'Assume high push-up plank position.',
      'Drive right knee diagonally across toward your left elbow.',
      'Quickly switch and drive left knee diagonally toward right elbow.',
      'Maintain strong upper body stability without swaying.'
    ],
    commonMistakes: [
      'Bouncing buttocks into air.',
      'Not rotating enough to target obliques.'
    ],
    proTip: 'Squeeze the oblique muscle each time your knee nears the opposite elbow.'
  },

  // --- CARDIO / HIIT (6) ---
  {
    id: 'skater-hops',
    name: 'Skater Hops',
    category: 'Cardio/HIIT',
    targetMuscles: ['Glutes (Medius)', 'Quads', 'Calves', 'Lateral Agility'],
    difficulty: 'Intermediate',
    equipment: 'None',
    defaultDuration: 40,
    defaultReps: 24,
    estCaloriesPerMin: 10.5,
    icon: '⛸️',
    animationType: 'cardio',
    instructions: [
      'Start in a slight squat and leap laterally to the right side.',
      'Land softly on right foot, sweeping left leg behind in a speed skater stance.',
      'Quickly rebound and leap laterally to the left side, landing on left foot.'
    ],
    commonMistakes: [
      'Landing on stiff upright legs.',
      'Collapsing knee inwards on landing.'
    ],
    proTip: 'Swing opposite arm forward to maintain counterbalance and rhythm.'
  },
  {
    id: 'butt-kicks',
    name: 'Butt Kicks',
    category: 'Cardio/HIIT',
    targetMuscles: ['Hamstrings', 'Calves', 'Cardio Conditioning'],
    difficulty: 'Beginner',
    equipment: 'None',
    defaultDuration: 45,
    defaultReps: 40,
    estCaloriesPerMin: 9,
    icon: '👟',
    animationType: 'cardio',
    instructions: [
      'Stand tall, run in place driving heels back and up toward glutes.',
      'Stay light on the balls of your feet.',
      'Pump arms rhythmically at your sides.'
    ],
    commonMistakes: [
      'Leaning too far forward.',
      'Stomping feet.'
    ],
    proTip: 'Keep knees pointing down toward the floor so the action comes purely from the hamstrings.'
  },
  {
    id: 'shadow-boxing',
    name: 'Shadow Boxing Speed Punches',
    category: 'Cardio/HIIT',
    targetMuscles: ['Shoulders', 'Upper Back', 'Core Rotators', 'Heart Rate'],
    difficulty: 'Beginner',
    equipment: 'None',
    defaultDuration: 45,
    defaultReps: 50,
    estCaloriesPerMin: 8.5,
    icon: '🥊',
    animationType: 'cardio',
    instructions: [
      'Adopt boxer stance with knees slightly bent and hands guarding chin.',
      'Throw rapid straight jabs and crosses with full arm extension.',
      'Pivot on the ball of rear foot when throwing cross to recruit core and hips.',
      'Keep shoulders relaxed and breathe out with each punch.'
    ],
    commonMistakes: [
      'Hyperextending elbows at the end of punches.',
      'Standing flat-footed without hip rotation.'
    ],
    proTip: 'Snap punches back to your chin immediately after extending.'
  },
  {
    id: 'tuck-jumps',
    name: 'Tuck Jumps',
    category: 'Cardio/HIIT',
    targetMuscles: ['Quads', 'Core', 'Calves', 'Explosive Power'],
    difficulty: 'Advanced',
    equipment: 'None',
    defaultDuration: 30,
    defaultReps: 12,
    estCaloriesPerMin: 12,
    icon: '🦘',
    animationType: 'jumping_jack',
    instructions: [
      'Stand with feet hip-width, sink into a quarter squat.',
      'Explode straight up and pull both knees up toward your chest in mid-air.',
      'Lightly touch knees with hands.',
      'Extend legs quickly to land softly with bent knees.'
    ],
    commonMistakes: [
      'Kicking feet back behind instead of pulling knees to chest.',
      'Heavy flat-footed landings.'
    ],
    proTip: 'Land like a ninja—softly and absorb impact through ankles, knees, and hips.'
  },
  {
    id: 'lateral-shuffles',
    name: 'Lateral Shuffles',
    category: 'Cardio/HIIT',
    targetMuscles: ['Glute Medius', 'Adductors', 'Calves'],
    difficulty: 'Beginner',
    equipment: 'None',
    defaultDuration: 40,
    defaultReps: 20,
    estCaloriesPerMin: 8.5,
    icon: '🦀',
    animationType: 'cardio',
    instructions: [
      'Start in an athletic quarter squat, chest upright.',
      'Take 3-4 quick shuffle steps to the right without crossing feet.',
      'Touch floor with right fingertips, then shuffle back 3-4 steps to the left.'
    ],
    commonMistakes: [
      'Crossing feet over, which causes trips.',
      'Standing straight up during the shuffles.'
    ],
    proTip: 'Stay low in your athletic stance the entire interval.'
  },
  {
    id: 'half-burpees',
    name: 'Half Burpees (Squat Thrusts)',
    category: 'Cardio/HIIT',
    targetMuscles: ['Core', 'Quads', 'Shoulders', 'Cardiovascular'],
    difficulty: 'Intermediate',
    equipment: 'None',
    defaultDuration: 35,
    defaultReps: 14,
    estCaloriesPerMin: 10,
    icon: '⚡',
    animationType: 'burpee',
    instructions: [
      'Start in a standing position, drop hands to floor.',
      'Jump feet back into a high plank.',
      'Immediately jump feet forward landing flat beside hands.',
      'Stand tall (without the jump and without chest-to-floor pushup).'
    ],
    commonMistakes: [
      'Sagging hips at the plank.',
      'Landing on toes instead of flat feet.'
    ],
    proTip: 'A great high-tempo metabolic burner with less shoulder fatigue than full burpees.'
  },

  // --- STRETCHING / YOGA (7) ---
  {
    id: 'cat-cow-stretch',
    name: 'Cat-Cow Spinal Flow',
    category: 'Stretching/Yoga',
    targetMuscles: ['Spine', 'Neck', 'Torso', 'Pelvis'],
    difficulty: 'Beginner',
    equipment: 'None',
    defaultDuration: 45,
    defaultReps: 10,
    estCaloriesPerMin: 3.5,
    icon: '🐈',
    animationType: 'stretch',
    instructions: [
      'Begin on hands and knees with wrists under shoulders and knees under hips.',
      'Inhale: drop belly down, lift chest and tailbone upward toward ceiling (Cow pose).',
      'Exhale: round spine upward like an angry cat, tucking chin toward chest (Cat pose).',
      'Move fluidly with your breath.'
    ],
    commonMistakes: [
      'Moving too fast without syncing breath.',
      'Forcing painful extension in neck.'
    ],
    proTip: 'Articulate each individual vertebra as you wave through spine.'
  },
  {
    id: 'downward-dog',
    name: 'Downward-Facing Dog',
    category: 'Stretching/Yoga',
    targetMuscles: ['Hamstrings', 'Calves', 'Shoulders', 'Spine'],
    difficulty: 'Beginner',
    equipment: 'None',
    defaultDuration: 45,
    defaultReps: 1,
    estCaloriesPerMin: 4,
    icon: '🐕‍🦺',
    animationType: 'stretch',
    instructions: [
      'Start on hands and knees, tuck toes and lift knees to drive hips up and back.',
      'Form an inverted "V" shape with your body.',
      'Press firmly through hands, spreading fingers wide and lengthening spine.',
      'Gently pedal heels toward the floor to stretch calves and hamstrings.'
    ],
    commonMistakes: [
      'Rounding back to force heels to the floor.',
      'Collapsing chest into shoulders.'
    ],
    proTip: 'Bend knees generously if hamstrings are tight—a long spine is the top priority.'
  },
  {
    id: 'cobra-stretch',
    name: 'Cobra / Sphinx Stretch',
    category: 'Stretching/Yoga',
    targetMuscles: ['Abdominals', 'Chest', 'Hip Flexors', 'Spine'],
    difficulty: 'Beginner',
    equipment: 'None',
    defaultDuration: 40,
    defaultReps: 1,
    estCaloriesPerMin: 3.5,
    icon: '🐍',
    animationType: 'stretch',
    instructions: [
      'Lie face down with legs extended behind, tops of feet flat on floor.',
      'Place hands under shoulders with elbows hugged in.',
      'Inhale and gently press up to lift chest off the mat, keeping pelvis grounded.',
      'Draw shoulders down and away from ears.'
    ],
    commonMistakes: [
      'Crunching lower back by pressing up too high.',
      'Shrugging shoulders into ears.'
    ],
    proTip: 'Use your back muscles more than arm strength to lift the chest.'
  },
  {
    id: 'childs-pose',
    name: 'Child’s Pose',
    category: 'Stretching/Yoga',
    targetMuscles: ['Hips', 'Thighs', 'Lower Back', 'Lats'],
    difficulty: 'Beginner',
    equipment: 'None',
    defaultDuration: 60,
    defaultReps: 1,
    estCaloriesPerMin: 3,
    icon: '🕊️',
    animationType: 'stretch',
    instructions: [
      'Kneel on floor with big toes touching and knees spread comfortably wide.',
      'Sit hips back onto heels and fold torso forward between thighs.',
      'Extend arms out long on the floor, resting forehead gently on the ground.',
      'Take slow, deep diaphragmatic breaths expanding your back ribs.'
    ],
    commonMistakes: [
      'Tensing shoulders or neck.',
      'Lifting hips too far off heels.'
    ],
    proTip: 'The ultimate restorative rest pose to calm the nervous system between intense sets.'
  },
  {
    id: 'pigeon-pose',
    name: 'Pigeon Pose (Hip Opener)',
    category: 'Stretching/Yoga',
    targetMuscles: ['Gluteus Medius', 'Piriformis', 'Hip Rotators', 'Psoas'],
    difficulty: 'Intermediate',
    equipment: 'None',
    defaultDuration: 50,
    defaultReps: 1,
    estCaloriesPerMin: 3.5,
    icon: '🕊️',
    animationType: 'stretch',
    instructions: [
      'From downward dog or hands and knees, bring right knee behind right wrist.',
      'Angle right foot toward left hip, and slide left leg straight back.',
      'Keep hips level and square to floor.',
      'Lower torso over front leg resting on forearms if comfortable, breathe for 25s, then switch.'
    ],
    commonMistakes: [
      'Rolling weight onto the outer right hip.',
      'Torquing knee instead of rotating from hip socket.'
    ],
    proTip: 'Place a folded towel or pillow under the hip if it does not reach the ground.'
  },
  {
    id: 'worlds-greatest-stretch',
    name: 'World’s Greatest Stretch',
    category: 'Stretching/Yoga',
    targetMuscles: ['Thoracic Spine', 'Hip Flexors', 'Hamstrings', 'Adductors'],
    difficulty: 'Intermediate',
    equipment: 'None',
    defaultDuration: 50,
    defaultReps: 8,
    estCaloriesPerMin: 4.5,
    icon: '🌍',
    animationType: 'stretch',
    instructions: [
      'Step right foot forward into a deep lunge with left hand on the floor.',
      'Drop right elbow toward the inside of your right ankle for a deep groin stretch.',
      'Rotate torso and reach right hand straight up toward ceiling, following with gaze.',
      'Hold 2 seconds, replace hand, step back and alternate left.'
    ],
    commonMistakes: [
      'Rushing through the rotational mobility component.',
      'Collapsing the back leg knee.'
    ],
    proTip: 'Mobilizes your hips, thoracic spine, and ankles all in one fluid movement.'
  },
  {
    id: 'standing-quad-stretch',
    name: 'Standing Quad & Hamstring Flow',
    category: 'Stretching/Yoga',
    targetMuscles: ['Quadriceps', 'Hip Flexors', 'Hamstrings'],
    difficulty: 'Beginner',
    equipment: 'None',
    defaultDuration: 45,
    defaultReps: 2,
    estCaloriesPerMin: 3.5,
    icon: '🧍',
    animationType: 'stretch',
    instructions: [
      'Stand tall on left leg, grab right ankle with right hand.',
      'Gently pull heel toward right glute while pointing knee straight to floor.',
      'Keep pelvis tucked forward to feel deep stretch along the front of the thigh.',
      'Hold 20s, then extend right heel forward with toes up and hinge forward for hamstring stretch. Repeat other side.'
    ],
    commonMistakes: [
      'Arching lower back.',
      'Letting bent knee flare out to the side.'
    ],
    proTip: 'Hold onto a wall or chair if balance is shaky.'
  }
];

export const CATEGORIES = [
  'All',
  'Full Body',
  'Upper Body',
  'Lower Body',
  'Core/Abs',
  'Cardio/HIIT',
  'Stretching/Yoga',
] as const;

EXERCISES.forEach(exercise => {
  exercise.freeExercise = getFreeExerciseMedia(exercise);
  if (exercise.freeExercise?.steps.length) {
    exercise.instructions = exercise.freeExercise.steps;
  }
  if (exercise.freeExercise?.secondaryMuscles.length) {
    exercise.targetMuscles = [...new Set([...exercise.targetMuscles, ...exercise.freeExercise.secondaryMuscles])];
  }
});

export const EXERCISES_BY_ID = new Map(EXERCISES.map(e => [e.id, e]));
