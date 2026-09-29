import {
  Achievement,
  DifficultyLevel,
  GameMode,
  PrizePet,
  PrizeRarity,
  SessionResult,
  SessionSettings,
  UserStats,
} from '../types/math';

const SETTINGS_KEY = 'schitayu_bystro_settings';
const STATS_KEY = 'schitayu_bystro_stats';
const ACHIEVEMENTS_KEY = 'schitayu_bystro_achievements';
const HISTORY_KEY = 'schitayu_bystro_history';
const PRIZES_KEY = 'schitayu_bystro_prizes';

export const PET_CATALOG: PrizePet[] = [
  // 1. COMMON (Обычные - 6 питомцев за базовые режимы)
  {
    id: 'cat_meow',
    name: 'Котёнок Мяу-Счетовод',
    title: 'Ловец правильных ответов',
    emoji: '🐱',
    rarity: 'common',
    quote: 'Мурр! Складывать в уме так же весело, как ловить солнечных зайчиков!',
  },
  {
    id: 'dog_bark',
    name: 'Щенок Тяф-Тяф',
    title: 'Быстрый как стрела',
    emoji: '🐶',
    rarity: 'common',
    quote: 'Гав! Ни секунды промедления — ответ готов за миг!',
  },
  {
    id: 'bunny_hop',
    name: 'Зайка Прыг-Скок',
    title: 'Прыгун по числовой прямой',
    emoji: '🐰',
    rarity: 'common',
    quote: 'Прыг на 2, скок на 5 — вот и десяточка!',
  },
  {
    id: 'hamster_cheese',
    name: 'Хомячок Сырник',
    title: 'Хранитель круглых десятков',
    emoji: '🐹',
    rarity: 'common',
    quote: 'Прячу десятки за щёчки — математика сытная наука!',
  },
  {
    id: 'hedgehog_apple',
    name: 'Ёжик Яблочкин',
    title: 'Собиратель единиц',
    emoji: '🦔',
    rarity: 'common',
    quote: 'Ношу на колючках только проверенные ответы без ошибок!',
  },
  {
    id: 'koala_nap',
    name: 'Коала-Умница',
    title: 'Спокойный счётчик',
    emoji: '🐨',
    rarity: 'common',
    quote: 'Спокойно, без спешки, каждый пример решается играючи!',
  },
  {
    id: 'bear_honey',
    name: 'Медвежонок Мёдович',
    title: 'Любитель сладких пятёрок',
    emoji: '🐻',
    rarity: 'common',
    quote: 'Правильный счёт слаще самого вкусного липового мёда!',
  },
  {
    id: 'turtle_steady',
    name: 'Черепашка Спринтер',
    title: 'Уверенный и точный',
    emoji: '🐢',
    rarity: 'common',
    quote: 'Тише едешь — точнее сосчитаешь, а потом ускоришься!',
  },

  // 2. RARE (Редкие - 6 питомцев за 2 уровень и уверенный счёт)
  {
    id: 'fox_clever',
    name: 'Лисичка-Отличница',
    title: 'Знаток секретных формул',
    emoji: '🦊',
    rarity: 'rare',
    quote: 'Главная хитрость математики — считать парами и не спешить!',
  },
  {
    id: 'racoon_coder',
    name: 'Енот-Шпион Кодов',
    title: 'Расшифровщик примеров',
    emoji: '🦝',
    rarity: 'rare',
    quote: 'Любой сложный пример я разберу на запчасти и решу!',
  },
  {
    id: 'owl_wise',
    name: 'Совёнок-Профессор',
    title: 'Магистр ночных вычислений',
    emoji: '🦉',
    rarity: 'rare',
    quote: 'У-гу! Внимательность и спокойствие всегда приводят к успеху.',
  },
  {
    id: 'penguin_pilot',
    name: 'Пингвин-Штурман',
    title: 'Покоритель ледяных примеров',
    emoji: '🐧',
    rarity: 'rare',
    quote: 'Держи курс на правильный ответ и не скользи на минусах!',
  },
  {
    id: 'beaver_builder',
    name: 'Бобр-Архитектор',
    title: 'Строитель числовых мостов',
    emoji: '🦫',
    rarity: 'rare',
    quote: 'Строю мост от девяти к десяти надёжно и быстро!',
  },
  {
    id: 'squirrel_nuts',
    name: 'Белочка-Калькулятор',
    title: 'Мастер таблицы сложения',
    emoji: '🐿️',
    rarity: 'rare',
    quote: 'Щёлкаю трудные примерчики как сладкие орешки!',
  },

  // 3. EPIC (Эпические - 6 питомцев за 3 уровень, 3 слагаемых и умножение)
  {
    id: 'cyber_bot',
    name: 'Кибер-Кот 2.0',
    title: 'Квантовый калькулятор с хвостом',
    emoji: '🤖',
    rarity: 'epic',
    quote: 'Бип-буп! Ответ вычислен в процессоре за 0.05 секунды!',
  },
  {
    id: 'panda_zen',
    name: 'Панда Дзен-Математик',
    title: 'Мастер абсолютного спокойствия',
    emoji: '🐼',
    rarity: 'epic',
    quote: 'Вдохни глубже, вспомни состав числа и умножай на пять.',
  },
  {
    id: 'space_dog',
    name: 'Космический Пёс Астро',
    title: 'Исследователь числовых галактик',
    emoji: '🐕‍🦺',
    rarity: 'epic',
    quote: 'Хьюстон, все примеры решены без единой ошибки, летим на Марс!',
  },
  {
    id: 'tiger_champ',
    name: 'Тигрёнок-Чемпион',
    title: 'Гроза примеров с тремя числами',
    emoji: '🐯',
    rarity: 'epic',
    quote: 'Р-р-мяу! Сложные вычисления только разжигают мой азарт!',
  },
  {
    id: 'alien_logic',
    name: 'Инопланетянин Квант',
    title: 'Гость из созвездия Вычислений',
    emoji: '👽',
    rarity: 'epic',
    quote: 'На вашей планете такие красивые примеры с тремя слагаемыми!',
  },
  {
    id: 'falcon_speed',
    name: 'Сокол-Спринтер',
    title: 'Сверхзвуковой ответ',
    emoji: '🦅',
    rarity: 'epic',
    quote: 'Стремительный полёт мысли: увидел пример — выдал точный ответ!',
  },

  // 4. LEGENDARY (Легендарные - 6 питомцев ТОЛЬКО за особые заслуги)
  {
    id: 'gold_dragon',
    name: 'Золотой Дракон Десяток',
    title: 'Повелитель совершенного счёта',
    emoji: '🐉',
    rarity: 'legendary',
    quote: 'Пламя чистых пятёрок пылает в твоих руках, юный повелитель чисел!',
  },
  {
    id: 'phoenix_math',
    name: 'Феникс Без Ошибок',
    title: 'Возродитель победных серий',
    emoji: '🔥',
    rarity: 'legendary',
    quote: 'Твоя математическая меткость ослепляет даже звёзды!',
  },
  {
    id: 'galaxy_whale',
    name: 'Галактический Кит',
    title: 'Хранитель таблицы умножения',
    emoji: '🐋',
    rarity: 'legendary',
    quote: 'Бескрайний океан математических истин покорился твоему разуму!',
  },
  {
    id: 'royal_lion',
    name: 'Королевский Лев',
    title: 'Владыка всех знаков и чисел',
    emoji: '🦁',
    rarity: 'legendary',
    quote: 'Корона абсолютного чемпиона устного счёта твоя по праву!',
  },
  {
    id: 'cosmic_unicorn',
    name: 'Звёздный Единорог Разума',
    title: 'Магистр безупречной точности',
    emoji: '🦄',
    rarity: 'legendary',
    quote: 'Радужный свет идеального счёта освещает твой путь к великим открытиям!',
  },
  {
    id: 'mecha_titan',
    name: 'Титан Вычислений',
    title: 'Абсолютный чемпион адаптивной тренировки',
    emoji: '🦾',
    rarity: 'legendary',
    quote: 'Протокол победы выполнен на 100%! Ты истинный гений математики!',
  },
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_step',
    title: 'Первый шаг',
    description: 'Заверши свою первую тренировку',
    icon: '🌱',
    unlocked: false,
  },
  {
    id: 'first_ten_streak',
    title: 'Первый десяток',
    description: 'Дай 10 правильных ответов подряд без ошибок',
    icon: '🔥',
    unlocked: false,
  },
  {
    id: 'lightning',
    title: 'Молния',
    description: 'Среднее время ответа менее 3 секунд за сессию',
    icon: '⚡',
    unlocked: false,
  },
  {
    id: 'no_mistakes',
    title: 'Без единой ошибки',
    description: 'Заверши тренировку на 100% без ошибок',
    icon: '🎯',
    unlocked: false,
  },
  {
    id: 'addition_master',
    title: 'Мастер сложения',
    description: 'Заверши тренировку сложения 3 уровня с 5 звёздами',
    icon: '➕',
    unlocked: false,
  },
  {
    id: 'subtraction_master',
    title: 'Мастер вычитания',
    description: 'Заверши тренировку вычитания 3 уровня с 5 звёздами',
    icon: '➖',
    unlocked: false,
  },
  {
    id: 'super_streak',
    title: 'Супер-серия',
    description: 'Набери серию из 20 правильных ответов',
    icon: '👑',
    unlocked: false,
  },
  {
    id: 'century',
    title: 'Сотня решений',
    description: 'Реши 100 математических примеров суммарно',
    icon: '💯',
    unlocked: false,
    progress: { current: 0, max: 100 },
  },
  {
    id: 'adaptive_champ',
    title: 'Адаптивный чемпион',
    description: 'Достигни 4 или 5 уровня сложности в умной тренировке',
    icon: '⚡',
    unlocked: false,
  },
  {
    id: 'pet_collector',
    title: 'Зоопарк гениев',
    description: 'Собери 10 или более питомцев в коллекции наград',
    icon: '🎁',
    unlocked: false,
    progress: { current: 0, max: 10 },
  },
];

export const DEFAULT_SETTINGS: SessionSettings = {
  mode: 'addition',
  difficulty: 2,
  inputMode: 'keyboard',
  tableRange: 'up_to_5',
  soundTheme: 'funny',
  soundEnabled: true,
  timerEnabled: false,
  timerSeconds: 8,
  sessionLength: 10,
};

export const DEFAULT_STATS: UserStats = {
  totalSolved: 0,
  totalCorrect: 0,
  totalMistakes: 0,
  totalStars: 0,
  totalSessions: 0,
  highestStreak: 0,
};

export function loadSettings(): SessionSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    }
  } catch {
    // fallback
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: SessionSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

export function loadStats(): UserStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (raw) {
      return { ...DEFAULT_STATS, ...JSON.parse(raw) };
    }
  } catch {
    // fallback
  }
  return DEFAULT_STATS;
}

export function saveStats(stats: UserStats): void {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // ignore
  }
}

export function loadAchievements(): Achievement[] {
  try {
    const raw = localStorage.getItem(ACHIEVEMENTS_KEY);
    if (raw) {
      const stored = JSON.parse(raw) as Achievement[];
      return INITIAL_ACHIEVEMENTS.map((initial) => {
        const found = stored.find((s) => s.id === initial.id);
        return found ? { ...initial, ...found } : initial;
      });
    }
  } catch {
    // fallback
  }
  return INITIAL_ACHIEVEMENTS;
}

export function saveAchievements(achievements: Achievement[]): void {
  try {
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
  } catch {
    // ignore
  }
}

export function loadPrizes(): PrizePet[] {
  try {
    const raw = localStorage.getItem(PRIZES_KEY);
    if (raw) {
      const stored = JSON.parse(raw) as PrizePet[];
      return stored;
    }
  } catch {
    // fallback
  }
  return [];
}

export function savePrizes(prizes: PrizePet[]): void {
  try {
    localStorage.setItem(PRIZES_KEY, JSON.stringify(prizes));
  } catch {
    // ignore
  }
}

/**
 * Rolls an exciting prize based on merit: mode, difficulty and accuracy.
 * Prevents giving Legendary / Epic pets for trivial Level 1 exercises!
 */
export function rollPrize(
  result: {
    stars: number;
    accuracy: number;
    mode: GameMode;
    difficulty: DifficultyLevel;
    totalProblems: number;
    adaptiveMaxTier?: number;
    bestStreak?: number;
  },
  currentPrizes: PrizePet[]
): PrizePet {
  const ownedIds = new Set(currentPrizes.map((p) => p.id));
  const { stars, accuracy, mode, difficulty, totalProblems, adaptiveMaxTier = 1, bestStreak = 0 } = result;

  // Strict merit-based tier classification:
  // Legendary is ONLY given for extraordinary accomplishments ("за особые заслуги"):
  const isSuperMerit =
    // Adaptive training mastery (Tier 5 with >= 95% accuracy and >= 15 problems solved)
    (mode === 'adaptive_training' && adaptiveMaxTier >= 5 && accuracy >= 95 && totalProblems >= 15) ||
    // 3-terms mastery on level 3 with 5 stars and 100% accuracy
    (mode === 'three_terms' && difficulty === 3 && stars === 5 && accuracy === 100 && totalProblems >= 10) ||
    // Super streak of 20+
    (bestStreak >= 20 && stars === 5 && accuracy === 100);

  const isHardChallenge =
    (difficulty === 3 && stars === 5 && accuracy >= 95 && totalProblems >= 10) ||
    (mode === 'three_terms' && stars === 5 && accuracy >= 90) ||
    (mode === 'adaptive_training' && adaptiveMaxTier >= 4 && accuracy >= 90 && totalProblems >= 15) ||
    (mode === 'all_mixed' && difficulty >= 2 && stars === 5 && accuracy >= 90);

  const isMediumChallenge =
    (difficulty === 2 && stars === 5 && accuracy === 100 && totalProblems >= 15) ||
    (difficulty === 3 && stars >= 3) ||
    (mode === 'adaptive_training' && adaptiveMaxTier >= 3);

  let allowedRarities: PrizeRarity[] = ['common'];

  if (isSuperMerit) {
    // Only here can a child earn a Legendary pet!
    const roll = Math.random();
    allowedRarities = roll < 0.35 ? ['legendary'] : ['epic'];
  } else if (isHardChallenge) {
    const roll = Math.random();
    allowedRarities = roll < 0.35 ? ['epic'] : ['rare'];
  } else if (isMediumChallenge) {
    const roll = Math.random();
    allowedRarities = roll < 0.25 ? ['rare'] : ['common'];
  } else {
    // Basic beginner levels (difficulty 1, simple test mode, short sessions, few problems):
    // STRICTLY COMMON PETS!
    allowedRarities = ['common'];
  }

  // Filter catalog to matching rarities
  const eligiblePets = PET_CATALOG.filter((pet) => allowedRarities.includes(pet.rarity));

  // Find unowned pets in eligible pool first
  const unownedEligible = eligiblePets.filter((pet) => !ownedIds.has(pet.id));

  let chosenPet: PrizePet;
  if (unownedEligible.length > 0) {
    chosenPet = unownedEligible[Math.floor(Math.random() * unownedEligible.length)];
  } else {
    // If all pets in this specific rarity are owned, look for any unowned in lower rarities
    const lowerUnowned = PET_CATALOG.filter(
      (p) => !ownedIds.has(p.id) && (allowedRarities.includes(p.rarity) || p.rarity === 'common')
    );
    if (lowerUnowned.length > 0) {
      chosenPet = lowerUnowned[Math.floor(Math.random() * lowerUnowned.length)];
    } else {
      chosenPet = eligiblePets[Math.floor(Math.random() * eligiblePets.length)];
    }
  }

  const unlockedPet: PrizePet = {
    ...chosenPet,
    unlockedAt: new Date().toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
    }),
  };

  if (!ownedIds.has(unlockedPet.id)) {
    const updated = [...currentPrizes, unlockedPet];
    savePrizes(updated);
  }

  return unlockedPet;
}

export function loadHistory(): SessionResult[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  return [];
}

export function saveSessionResult(result: SessionResult): void {
  try {
    const history = loadHistory();
    history.unshift(result);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 30)));
  } catch {
    // ignore
  }
}

export function resetAllData(): void {
  try {
    localStorage.removeItem(SETTINGS_KEY);
    localStorage.removeItem(STATS_KEY);
    localStorage.removeItem(ACHIEVEMENTS_KEY);
    localStorage.removeItem(HISTORY_KEY);
    localStorage.removeItem(PRIZES_KEY);
  } catch {
    // ignore
  }
}
