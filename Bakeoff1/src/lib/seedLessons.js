import Lesson from '@/lib/models/Lesson';

const seed = [
  {
    slug: 'ingredient-substitutions',
    title: 'Ingredient Substitutions',
    description: 'Learn what to use when you run out of pantry staples.',
    difficulty: 'beginner',
    questions: [
      {
        prompt: 'What can replace buttermilk in a pinch?',
        options: ['Milk + lemon juice', 'Orange juice', 'Water', 'Soy sauce'],
        correctIndex: 0,
        points: 20,
        explanation:
          'Stirring 1 tbsp of lemon juice (or white vinegar) into 1 cup of milk gives you the acidity of buttermilk.',
      },
      {
        prompt: 'Out of eggs while baking — what is a common 1-egg substitute?',
        options: ['1/4 cup applesauce', '1 cup flour', '1 tbsp salt', '1 cup water'],
        correctIndex: 0,
        points: 20,
        explanation:
          '1/4 cup unsweetened applesauce replaces one egg in many baked goods (cakes, muffins, brownies).',
      },
    ],
  },
  {
    slug: 'safe-chicken-temperature',
    title: 'Safe Chicken Temperature',
    description: 'Cook poultry to the right temperature and avoid foodborne illness.',
    difficulty: 'intermediate',
    questions: [
      {
        prompt: 'What is the minimum safe internal temperature for chicken breasts?',
        options: ['165°F (74°C)', '145°F (63°C)', '135°F (57°C)', '125°F (52°C)'],
        correctIndex: 0,
        points: 20,
        explanation:
          'USDA guidelines recommend 165°F for poultry. Use a thermometer in the thickest part of the meat.',
      },
      {
        prompt: 'When is it safe to serve chicken after cooking?',
        options: [
          'When juices run clear and it reaches 165°F',
          'When the outside looks browned',
          'After resting for 2 minutes only',
          'When it smells done',
        ],
        correctIndex: 0,
        points: 20,
        explanation:
          'Color and smell are unreliable. An instant-read thermometer at 165°F is the safest check.',
      },
      {
        prompt: 'How long can raw chicken safely sit in the fridge?',
        options: ['1–2 days', '5–7 days', '2 weeks', 'Until the sell-by date regardless'],
        correctIndex: 0,
        points: 10,
        explanation:
          'Use or freeze raw chicken within 1–2 days of purchase for best safety and quality.',
      },
    ],
  },
  {
    slug: 'pasta-basics',
    title: 'Pasta Basics',
    description: 'Boil, season, and sauce pasta like a pro.',
    difficulty: 'beginner',
    questions: [
      {
        prompt: 'How much salt should you add to pasta water?',
        options: [
          'Enough to taste like the sea',
          'A pinch per gallon',
          'None — salt the sauce only',
          '1 cup per pot',
        ],
        correctIndex: 0,
        points: 20,
        explanation:
          'Well-salted water seasons the pasta from the inside. It should taste noticeably salty.',
      },
      {
        prompt: 'When should you add pasta to the pot?',
        options: [
          'After the water is at a rolling boil',
          'While the water is still cold',
          'After turning off the heat',
          'Only after the sauce is ready',
        ],
        correctIndex: 0,
        points: 20,
        explanation:
          'A rolling boil keeps pasta moving so it cooks evenly and does not stick together.',
      },
    ],
  },
  {
    slug: 'knife-safety',
    title: 'Knife Safety',
    description: 'Handle sharp tools confidently and cut without injury.',
    difficulty: 'beginner',
    questions: [
      {
        prompt: 'What is the safest way to hold food while chopping?',
        options: [
          'Curl fingertips under in a claw grip',
          'Lay fingers flat on top of the food',
          'Hold food with your palm facing down',
          'Chop quickly without stabilizing',
        ],
        correctIndex: 0,
        points: 20,
        explanation:
          'The claw grip keeps knuckles ahead of your fingertips so the blade hits bone, not skin.',
      },
      {
        prompt: 'Where should you store knives when not in use?',
        options: [
          'In a block or on a magnetic strip',
          'Loose in a drawer with other utensils',
          'In the sink to soak',
          'Balanced on the counter edge',
        ],
        correctIndex: 0,
        points: 20,
        explanation:
          'A dedicated block or strip protects the edge and prevents accidental cuts when reaching in a drawer.',
      },
    ],
  },
  {
    slug: 'food-storage',
    title: 'Food Storage',
    description: 'Keep leftovers fresh and your fridge organized.',
    difficulty: 'intermediate',
    questions: [
      {
        prompt: 'How long is cooked rice safe in the refrigerator?',
        options: ['3–4 days', '2 weeks', '24 hours only', 'Until it smells fine'],
        correctIndex: 0,
        points: 20,
        explanation:
          'Cooked rice should be refrigerated within 2 hours and eaten within 3–4 days.',
      },
      {
        prompt: 'What temperature should your refrigerator stay at?',
        options: ['40°F (4°C) or below', '50°F (10°C)', '32°F (0°C)', 'Room temperature'],
        correctIndex: 0,
        points: 20,
        explanation:
          'At 40°F or below, bacterial growth slows significantly. Check with a fridge thermometer.',
      },
    ],
  },
  {
    slug: 'seasoning-fundamentals',
    title: 'Seasoning Fundamentals',
    description: 'Balance salt, acid, and heat in everyday cooking.',
    difficulty: 'beginner',
    questions: [
      {
        prompt: 'When is the best time to taste and adjust seasoning in a soup?',
        options: [
          'Near the end of cooking',
          'Only before serving, never while cooking',
          'Only at the very start',
          'After it has cooled completely',
        ],
        correctIndex: 0,
        points: 20,
        explanation:
          'Flavors concentrate as liquid reduces. Taste near the end so you do not over-salt early.',
      },
      {
        prompt: 'What does a squeeze of lemon often fix in a dish?',
        options: [
          'Flat or overly rich flavors',
          'Undercooked protein',
          'Burnt garlic',
          'Raw flour taste',
        ],
        correctIndex: 0,
        points: 20,
        explanation:
          'Acid brightens flavors and balances fat and salt — a common pro move before serving.',
      },
    ],
  },
  {
    slug: 'egg-doneness',
    title: 'Egg Doneness',
    description: 'Soft, jammy, or hard — know the timing.',
    difficulty: 'intermediate',
    questions: [
      {
        prompt: 'How long for a jammy soft-boiled egg in boiling water?',
        options: ['6–7 minutes', '2 minutes', '12–14 minutes', '20 minutes'],
        correctIndex: 0,
        points: 20,
        explanation:
          'Six to seven minutes gives a set white and runny yolk. Shock in ice water to stop cooking.',
      },
      {
        prompt: 'What is the white film on boiled eggs from overcooking?',
        options: [
          'Iron sulfide from yolk and white reacting',
          'Soap residue',
          'Extra protein you should eat',
          'A sign the egg is unsafe',
        ],
        correctIndex: 0,
        points: 20,
        explanation:
          'The green-gray ring is harmless but means the egg was cooked too hot or too long.',
      },
    ],
  },
  {
    slug: 'baking-pantry-math',
    title: 'Baking Pantry Math',
    description: 'Quick conversions every home baker should know.',
    difficulty: 'advanced',
    questions: [
      {
        prompt: 'How many teaspoons are in one tablespoon?',
        options: ['3', '2', '4', '6'],
        correctIndex: 0,
        points: 15,
        explanation: '3 teaspoons = 1 tablespoon. Memorizing this saves recipe mistakes.',
      },
      {
        prompt: 'What does "cream butter and sugar" mean?',
        options: [
          'Beat until light and fluffy',
          'Melt butter into sugar',
          'Mix with a spoon once',
          'Add cream to the bowl',
        ],
        correctIndex: 0,
        points: 20,
        explanation:
          'Creaming traps air in the butter, which helps cakes and cookies rise and stay tender.',
      },
      {
        prompt: 'Why do many recipes call for room-temperature eggs?',
        options: [
          'They emulsify better with butter',
          'They cook faster on the counter',
          'Cold eggs are unsafe',
          'It is only for tradition',
        ],
        correctIndex: 0,
        points: 15,
        explanation:
          'Cold eggs can make batters curdle or separate. Room-temp eggs blend smoothly into creamed butter.',
      },
    ],
  },
];

export default async function seedLessons() {
  for (const lesson of seed) {
    await Lesson.updateOne({ slug: lesson.slug }, { $setOnInsert: lesson }, { upsert: true });
  }
  console.log('[db] seed lessons ensured');
}
