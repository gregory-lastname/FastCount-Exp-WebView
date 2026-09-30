import {
  Achievement,
  DifficultyLevel,
  GameMode,
  PrizePet,
  PrizeRarity,
  SessionResult,
  SessionSettings,
  UserProfile,
  UserStats,
} from '../types/math';

const USERS_LIST_KEY = 'schitayu_bystro_users_v2';
const ACTIVE_USER_ID_KEY = 'schitayu_bystro_active_user_v2';

const BASE_SETTINGS_KEY = 'schitayu_bystro_settings';
const BASE_STATS_KEY = 'schitayu_bystro_stats';
const BASE_ACHIEVEMENTS_KEY = 'schitayu_bystro_achievements';
const BASE_HISTORY_KEY = 'schitayu_bystro_history';
const BASE_PRIZES_KEY = 'schitayu_bystro_prizes';

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
  {
    id: 'bond_master',
    title: 'Мастер состава числа',
    description: 'Заверши тренировку состава числа с 5 звёздами',
    icon: '🏠',
    unlocked: false,
  },
];

export const DEFAULT_SETTINGS: SessionSettings = {
  mode: 'number_bonds',
  difficulty: 2,
  inputMode: 'keyboard',
  tableRange: 'up_to_5',
  numberBondTarget: 'all_to_10',
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

export const DEFAULT_USER: UserProfile = {
  id: 'user_default',
  name: 'Ученик',
  avatar: '🦁',
  createdAt: new Date().toISOString(),
  grade: '2 класс',
};

// --- USER PROFILES MANAGEMENT ---

export function loadUsers(): UserProfile[] {
  try {
    const raw = localStorage.getItem(USERS_LIST_KEY);
    if (raw) {
      const list = JSON.parse(raw) as UserProfile[];
      if (Array.isArray(list) && list.length > 0) {
        return list;
      }
    }
  } catch {
    // fallback
  }

  // First time or legacy migration: create default user and migrate legacy un-scoped data
  const defaultList = [DEFAULT_USER];
  saveUsers(defaultList);
  setCurrentUserId(DEFAULT_USER.id);
  migrateLegacyData(DEFAULT_USER.id);
  return defaultList;
}

export function saveUsers(users: UserProfile[]): void {
  try {
    localStorage.setItem(USERS_LIST_KEY, JSON.stringify(users));
  } catch {
    // ignore
  }
}

export function getCurrentUserId(): string {
  try {
    const active = localStorage.getItem(ACTIVE_USER_ID_KEY);
    if (active) return active;
  } catch {
    // ignore
  }
  return DEFAULT_USER.id;
}

export function setCurrentUserId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_USER_ID_KEY, id);
  } catch {
    // ignore
  }
}

export function getCurrentUser(): UserProfile {
  const users = loadUsers();
  const currentId = getCurrentUserId();
  const found = users.find((u) => u.id === currentId);
  if (found) return found;
  if (users.length > 0) {
    setCurrentUserId(users[0].id);
    return users[0];
  }
  return DEFAULT_USER;
}

export function createUser(name: string, avatar: string, grade: string = '2 класс'): UserProfile {
  const users = loadUsers();
  const newUser: UserProfile = {
    id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: name.trim() || 'Новый ученик',
    avatar: avatar || '🐱',
    createdAt: new Date().toISOString(),
    grade,
  };
  const updated = [...users, newUser];
  saveUsers(updated);
  setCurrentUserId(newUser.id);
  return newUser;
}

export function updateUser(user: UserProfile): void {
  const users = loadUsers();
  const updated = users.map((u) => (u.id === user.id ? user : u));
  saveUsers(updated);
}

export function deleteUser(id: string): boolean {
  const users = loadUsers();
  if (users.length <= 1) {
    // Do not delete the last remaining user
    return false;
  }
  const updated = users.filter((u) => u.id !== id);
  saveUsers(updated);
  resetUserData(id);

  if (getCurrentUserId() === id) {
    setCurrentUserId(updated[0].id);
  }
  return true;
}

function userKey(baseKey: string, userId?: string): string {
  const uid = userId || getCurrentUserId();
  return `${baseKey}_${uid}`;
}

// Migrate old data that was saved without user prefix
function migrateLegacyData(defaultUserId: string) {
  try {
    const legacyStats = localStorage.getItem(BASE_STATS_KEY);
    if (legacyStats && !localStorage.getItem(userKey(BASE_STATS_KEY, defaultUserId))) {
      localStorage.setItem(userKey(BASE_STATS_KEY, defaultUserId), legacyStats);
    }

    const legacySettings = localStorage.getItem(BASE_SETTINGS_KEY);
    if (legacySettings && !localStorage.getItem(userKey(BASE_SETTINGS_KEY, defaultUserId))) {
      localStorage.setItem(userKey(BASE_SETTINGS_KEY, defaultUserId), legacySettings);
    }

    const legacyAch = localStorage.getItem(BASE_ACHIEVEMENTS_KEY);
    if (legacyAch && !localStorage.getItem(userKey(BASE_ACHIEVEMENTS_KEY, defaultUserId))) {
      localStorage.setItem(userKey(BASE_ACHIEVEMENTS_KEY, defaultUserId), legacyAch);
    }

    const legacyHistory = localStorage.getItem(BASE_HISTORY_KEY);
    if (legacyHistory && !localStorage.getItem(userKey(BASE_HISTORY_KEY, defaultUserId))) {
      localStorage.setItem(userKey(BASE_HISTORY_KEY, defaultUserId), legacyHistory);
    }

    const legacyPrizes = localStorage.getItem(BASE_PRIZES_KEY);
    if (legacyPrizes && !localStorage.getItem(userKey(BASE_PRIZES_KEY, defaultUserId))) {
      localStorage.setItem(userKey(BASE_PRIZES_KEY, defaultUserId), legacyPrizes);
    }
  } catch {
    // ignore
  }
}

// --- USER-SCOPED DATA STORAGE ---

export function loadSettings(userId?: string): SessionSettings {
  try {
    const raw = localStorage.getItem(userKey(BASE_SETTINGS_KEY, userId));
    if (raw) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    }
  } catch {
    // fallback
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: SessionSettings, userId?: string): void {
  try {
    localStorage.setItem(userKey(BASE_SETTINGS_KEY, userId), JSON.stringify(settings));
  } catch {
    // ignore
  }
}

export function loadStats(userId?: string): UserStats {
  try {
    const raw = localStorage.getItem(userKey(BASE_STATS_KEY, userId));
    if (raw) {
      return { ...DEFAULT_STATS, ...JSON.parse(raw) };
    }
  } catch {
    // fallback
  }
  return DEFAULT_STATS;
}

export function saveStats(stats: UserStats, userId?: string): void {
  try {
    localStorage.setItem(userKey(BASE_STATS_KEY, userId), JSON.stringify(stats));
  } catch {
    // ignore
  }
}

export function loadAchievements(userId?: string): Achievement[] {
  try {
    const raw = localStorage.getItem(userKey(BASE_ACHIEVEMENTS_KEY, userId));
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

export function saveAchievements(achievements: Achievement[], userId?: string): void {
  try {
    localStorage.setItem(userKey(BASE_ACHIEVEMENTS_KEY, userId), JSON.stringify(achievements));
  } catch {
    // ignore
  }
}

export function loadPrizes(userId?: string): PrizePet[] {
  try {
    const raw = localStorage.getItem(userKey(BASE_PRIZES_KEY, userId));
    if (raw) {
      return JSON.parse(raw) as PrizePet[];
    }
  } catch {
    // fallback
  }
  return [];
}

export function savePrizes(prizes: PrizePet[], userId?: string): void {
  try {
    localStorage.setItem(userKey(BASE_PRIZES_KEY, userId), JSON.stringify(prizes));
  } catch {
    // ignore
  }
}

export function loadHistory(userId?: string): SessionResult[] {
  try {
    const raw = localStorage.getItem(userKey(BASE_HISTORY_KEY, userId));
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  return [];
}

export function saveSessionResult(result: SessionResult, userId?: string): void {
  try {
    const history = loadHistory(userId);
    history.unshift(result);
    localStorage.setItem(userKey(BASE_HISTORY_KEY, userId), JSON.stringify(history.slice(0, 50)));
  } catch {
    // ignore
  }
}

export function resetUserData(userId?: string): void {
  try {
    const uid = userId || getCurrentUserId();
    localStorage.removeItem(userKey(BASE_SETTINGS_KEY, uid));
    localStorage.removeItem(userKey(BASE_STATS_KEY, uid));
    localStorage.removeItem(userKey(BASE_ACHIEVEMENTS_KEY, uid));
    localStorage.removeItem(userKey(BASE_HISTORY_KEY, uid));
    localStorage.removeItem(userKey(BASE_PRIZES_KEY, uid));
  } catch {
    // ignore
  }
}

export function resetAllData(): void {
  try {
    localStorage.clear();
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
    (mode === 'all_mixed' && (difficulty === 'differential' || (typeof difficulty === 'number' && difficulty >= 2)) && stars === 5 && accuracy >= 90);

  const isMediumChallenge =
    ((difficulty === 2 || difficulty === 'differential') && stars === 5 && accuracy === 100 && totalProblems >= 15) ||
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

