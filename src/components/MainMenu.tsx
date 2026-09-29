import React, { useEffect } from 'react';
import {
  Calculator,
  Divide,
  Flame,
  Gift,
  Keyboard,
  ListFilter,
  Minus,
  Music,
  Play,
  Plus,
  Shuffle,
  Sparkles,
  Timer,
  X,
  Zap,
} from 'lucide-react';
import {
  DifficultyLevel,
  GameMode,
  InputMode,
  PrizePet,
  SessionSettings,
  SoundTheme,
  TableRange,
  UserStats,
} from '../types/math';
import { soundManager } from '../utils/audio';

interface MainMenuProps {
  settings: SessionSettings;
  stats: UserStats;
  achievementsCount: { unlocked: number; total: number };
  prizesCount: { unlocked: number; total: number };
  latestPrize?: PrizePet | null;
  onUpdateSettings: (newSettings: Partial<SessionSettings>) => void;
  onStartGame: () => void;
  onOpenAchievements: () => void;
  onOpenPrizes: () => void;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
}

export function MainMenu({
  settings,
  stats,
  achievementsCount,
  prizesCount,
  latestPrize,
  onUpdateSettings,
  onStartGame,
  onOpenAchievements,
  onOpenPrizes,
}: MainMenuProps) {
  // Listen for Enter / Space to start quickly
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        soundManager.playKeyTap();
        onStartGame();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStartGame]);

  const classicModes: {
    id: GameMode;
    title: string;
    formula: string;
    example: string;
    iconComponent: React.ReactNode;
  }[] = [
    {
      id: 'addition',
      title: 'Сложение',
      formula: 'a + b',
      example: '4 + 5 = 9',
      iconComponent: <Plus className="w-4 h-4 text-emerald-600 stroke-[3]" />,
    },
    {
      id: 'subtraction',
      title: 'Вычитание',
      formula: 'a − b',
      example: '9 − 4 = 5',
      iconComponent: <Minus className="w-4 h-4 text-rose-600 stroke-[3]" />,
    },
    {
      id: 'three_terms',
      title: '3 слагаемых',
      formula: 'a + b − c',
      example: '6 + 3 − 2 = 7',
      iconComponent: <Calculator className="w-4 h-4 text-blue-600 stroke-[2.5]" />,
    },
    {
      id: 'multiplication',
      title: 'Умножение',
      formula: 'a \u00D7 b',
      example: '3 \u00D7 4 = 12',
      // Pure SVG icon with 2 diagonal lines: CANNOT turn into a plus sign in any font or build!
      iconComponent: (
        <svg
          viewBox="0 0 24 24"
          className="w-4 h-4 text-purple-600 fill-none stroke-current stroke-[3] stroke-linecap-round stroke-linejoin-round"
          aria-hidden="true"
        >
          <line x1="6" y1="6" x2="18" y2="18" />
          <line x1="18" y1="6" x2="6" y2="18" />
        </svg>
      ),
    },
    {
      id: 'division',
      title: 'Деление',
      formula: 'a : b',
      example: '15 : 3 = 5',
      iconComponent: <Divide className="w-4 h-4 text-amber-600 stroke-[3]" />,
    },
    {
      id: 'all_mixed',
      title: 'Супер-микс',
      formula: '+ − × :',
      example: 'Все 4 действия',
      iconComponent: <Shuffle className="w-4 h-4 text-indigo-600 stroke-[2.5]" />,
    },
  ];

  const isTableApplicable =
    settings.mode === 'multiplication' ||
    settings.mode === 'division' ||
    settings.mode === 'all_mixed';

  const isAdaptive = settings.mode === 'adaptive_training';

  return (
    <div className="w-full max-w-5xl mx-auto my-auto flex flex-col gap-2.5 px-2 py-1 select-none animate-pop-in">
      {/* 1. TOP BAR: Welcoming status and achievements */}
      <div className="bg-white rounded-2xl px-4 py-2 border border-amber-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-400 border border-amber-500 flex items-center justify-center text-lg shadow-2xs">
            🧮
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-black text-slate-900 leading-tight">
              Тренажёр устного счёта · 2 класс
            </h2>
            <p className="text-[11px] text-slate-500 font-semibold">
              Выбери режим счёта и начни тренировку
            </p>
          </div>
        </div>

        {/* Right mini stats strip */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs font-black">
          <div className="flex items-center gap-1 text-slate-700 bg-slate-100 px-2.5 py-1 rounded-xl">
            <span>Решено:</span>
            <span className="text-slate-900 font-mono text-xs">{stats.totalSolved}</span>
          </div>

          <div className="flex items-center gap-1 text-amber-900 bg-amber-100/80 px-2.5 py-1 rounded-xl border border-amber-200">
            <span>⭐</span>
            <span className="font-mono text-xs">{stats.totalStars}</span>
          </div>

          <div className="flex items-center gap-1 text-orange-900 bg-orange-100/80 px-2.5 py-1 rounded-xl border border-orange-200">
            <span>🔥</span>
            <span className="font-mono text-xs">{stats.highestStreak}</span>
          </div>

          <button
            onClick={() => {
              soundManager.playKeyTap();
              onOpenPrizes();
            }}
            className="flex items-center gap-1 text-purple-900 bg-purple-100/80 hover:bg-purple-200 px-2.5 py-1 rounded-xl border border-purple-200 transition-colors cursor-pointer"
            title="Открыть альбом питомцев"
          >
            <Gift className="w-3.5 h-3.5 text-purple-700" />
            <span>Призы:</span>
            <span className="font-mono text-xs">{prizesCount.unlocked}/{prizesCount.total}</span>
          </button>
        </div>
      </div>

      {/* 2. MODE SELECTION BENTO BLOCK: FEATURED ADAPTIVE TRAINING + 6 CLASSIC MODES */}
      <div className="bg-white rounded-2xl p-3 sm:p-3.5 border border-slate-200 shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-amber-500 text-white font-black text-xs flex items-center justify-center shadow-2xs">
              1
            </span>
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Режим счёта
            </span>
          </div>

          {/* Table range switch if applicable */}
          {isTableApplicable && (
            <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-300">
              <span className="text-[11px] font-bold text-amber-950">Таблица:</span>
              <button
                onClick={() => {
                  soundManager.playKeyTap();
                  onUpdateSettings({ tableRange: 'up_to_5' });
                }}
                className={`px-2 py-0.5 text-xs font-black rounded transition-all ${
                  settings.tableRange === 'up_to_5'
                    ? 'bg-amber-400 text-amber-950 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                до 5 × 5
              </button>
              <button
                onClick={() => {
                  soundManager.playKeyTap();
                  onUpdateSettings({ tableRange: 'up_to_9' });
                }}
                className={`px-2 py-0.5 text-xs font-black rounded transition-all ${
                  settings.tableRange === 'up_to_9'
                    ? 'bg-amber-400 text-amber-950 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                до 9 × 9
              </button>
            </div>
          )}
        </div>

        {/* HERO ADAPTIVE TRAINING BUTTON */}
        <button
          onClick={() => {
            soundManager.playKeyTap();
            onUpdateSettings({ mode: 'adaptive_training' });
          }}
          className={`w-full p-2.5 rounded-xl border-2 flex items-center justify-between transition-all cursor-pointer ${
            isAdaptive
              ? 'border-amber-500 bg-amber-100/90 ring-2 ring-amber-300 shadow-2xs'
              : 'border-amber-200 bg-linear-to-r from-amber-50 to-orange-50 hover:bg-amber-100/70'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-400 border border-amber-500 text-amber-950 flex items-center justify-center font-black shadow-2xs">
              <Zap className="w-5 h-5 fill-amber-950 stroke-1" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-black text-slate-900">
                  Умная тренировка
                </span>
                <span className="text-[10px] font-black uppercase bg-amber-500 text-white px-2 py-0.2 rounded-full shadow-2xs">
                  Динамическая сложность
                </span>
              </div>
              <p className="text-[11px] text-amber-950/80 font-semibold leading-tight">
                Автоматически подстраивает сложность под ученика: микс сложения, вычитания, 2 и 3 слагаемых
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1 font-mono text-[11px] font-black text-amber-950 bg-white/80 px-2.5 py-1 rounded-lg border border-amber-300 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Уровни 1–5 с паузами для отдыха</span>
          </div>
        </button>

        {/* 6 CLASSIC MODES (3x2 grid, clean SVG icons, no font bugs!) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {classicModes.map((m) => {
            const isSelected = settings.mode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => {
                  soundManager.playKeyTap();
                  onUpdateSettings({ mode: m.id });
                }}
                className={`btn-tactile h-[68px] sm:h-[72px] px-3 py-1.5 rounded-xl border-2 text-left flex flex-col justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50/90 ring-2 ring-amber-300 shadow-2xs'
                    : 'border-slate-200 bg-white hover:border-amber-300 hover:bg-slate-50/80'
                }`}
              >
                {/* Top: Large crisp formula & SVG Icon */}
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`font-mono text-xs sm:text-sm font-black px-2 py-0.5 rounded-md tracking-wider transition-colors ${
                      isSelected
                        ? 'bg-amber-500 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-900 border border-slate-200'
                    }`}
                  >
                    {m.formula}
                  </span>
                  <div className="p-1 rounded-md bg-slate-50 border border-slate-200 shadow-2xs">
                    {m.iconComponent}
                  </div>
                </div>

                {/* Bottom: Title & Example */}
                <div className="flex items-baseline justify-between w-full mt-1">
                  <span className="text-xs sm:text-sm font-black text-slate-900">
                    {m.title}
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-slate-500 font-mono font-medium">
                    {m.example}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. TRAINING OPTIONS & PET SHOWCASE ROW */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 items-stretch">
        {/* LEFT PANEL (7 cols): Training Options */}
        <div className="md:col-span-7 bg-white rounded-2xl p-3 sm:p-3.5 border border-slate-200 shadow-2xs flex flex-col justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-amber-500 text-white font-black text-xs flex items-center justify-center shadow-2xs">
              2
            </span>
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Параметры тренировки
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {/* Input Mode */}
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-slate-700 whitespace-nowrap">Ввод ответа:</span>
              <div className="flex gap-1.5 flex-1 max-w-xs justify-end">
                <button
                  onClick={() => {
                    soundManager.playKeyTap();
                    onUpdateSettings({ inputMode: 'keyboard' });
                  }}
                  className={`btn-tactile px-2.5 py-1 rounded-xl border text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                    settings.inputMode === 'keyboard'
                      ? 'border-amber-500 bg-amber-400 text-amber-950 shadow-2xs'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Keyboard className="w-3.5 h-3.5" />
                  <span>Клавиатура (0–9)</span>
                </button>

                <button
                  onClick={() => {
                    soundManager.playKeyTap();
                    onUpdateSettings({ inputMode: 'test' });
                  }}
                  className={`btn-tactile px-2.5 py-1 rounded-xl border text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                    settings.inputMode === 'test'
                      ? 'border-amber-500 bg-amber-400 text-amber-950 shadow-2xs'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                  title="На экране показываются 4 варианта ответов для насмотренности, а ввод осуществляется с клавиатуры"
                >
                  <ListFilter className="w-3.5 h-3.5" />
                  <span>Тест (варианты-подсказки)</span>
                </button>
              </div>
            </div>

            {/* Difficulty Level (disabled if adaptive mode) */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
              <span className="font-bold text-slate-700 whitespace-nowrap">Сложность:</span>
              {isAdaptive ? (
                <div className="text-[11px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                  ⚡ Автоподбор (уровни 1–5)
                </div>
              ) : (
                <div className="flex gap-1.5 flex-1 max-w-xs justify-end">
                  {[
                    { level: 1 as const, name: '1 ур.', tag: 'до 5' },
                    { level: 2 as const, name: '2 ур.', tag: 'до 10' },
                    { level: 3 as const, name: '3 ур.', tag: 'до 20' },
                  ].map((d) => (
                    <button
                      key={d.level}
                      onClick={() => {
                        soundManager.playKeyTap();
                        onUpdateSettings({ difficulty: d.level });
                      }}
                      className={`btn-tactile px-2.5 py-1 rounded-xl border text-xs font-black flex items-center gap-1 transition-all cursor-pointer ${
                        settings.difficulty === d.level
                          ? 'border-amber-500 bg-amber-400 text-amber-950 shadow-2xs'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span>{d.name}</span>
                      <span className="text-[10px] opacity-75 font-mono">({d.tag})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Session Length */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
              <span className="font-bold text-slate-700 whitespace-nowrap">Примеров:</span>
              <div className="flex gap-1.5 flex-1 max-w-xs justify-end">
                {([10, 20, 30] as const).map((len) => (
                  <button
                    key={len}
                    onClick={() => {
                      soundManager.playKeyTap();
                      onUpdateSettings({ sessionLength: len });
                    }}
                    className={`btn-tactile px-3 py-1 rounded-xl border text-xs font-black transition-all cursor-pointer ${
                      settings.sessionLength === len
                        ? 'border-amber-500 bg-amber-400 text-amber-950 shadow-2xs'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {len}
                  </button>
                ))}
              </div>
            </div>

            {/* Timer & Sound Row */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <Timer className="w-3.5 h-3.5 text-amber-600" />
                <span className="font-bold text-slate-700">Таймер:</span>
                <button
                  onClick={() => {
                    soundManager.playKeyTap();
                    onUpdateSettings({ timerEnabled: !settings.timerEnabled });
                  }}
                  className={`btn-tactile px-2.5 py-0.5 rounded-lg border text-xs font-black transition-all cursor-pointer ${
                    settings.timerEnabled
                      ? 'border-amber-500 bg-amber-400 text-amber-950'
                      : 'border-slate-200 bg-slate-50 text-slate-500'
                  }`}
                >
                  {settings.timerEnabled ? `${settings.timerSeconds} сек` : 'Выкл'}
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-purple-600" />
                <span className="font-bold text-slate-700">Звуки:</span>
                <button
                  onClick={() => {
                    const next: SoundTheme = settings.soundTheme === 'funny' ? 'classic' : 'funny';
                    soundManager.theme = next;
                    soundManager.playKeyTap();
                    soundManager.playSuccess();
                    onUpdateSettings({ soundTheme: next });
                  }}
                  className="btn-tactile px-2.5 py-0.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-black text-slate-800 transition-all cursor-pointer"
                  title="Переключить звуковую тему"
                >
                  {settings.soundTheme === 'funny' ? '🎪 Шутливые' : '🔔 Классика'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL (5 cols): Pet Showcase Card + Big Primary Start Button */}
        <div className="md:col-span-5 flex flex-col justify-between gap-2.5">
          {/* Pet Showcase Card */}
          <div className="bg-linear-to-br from-amber-50 via-orange-50 to-amber-100/80 rounded-2xl p-3 border border-amber-300 shadow-2xs flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-1">
                <Gift className="w-3.5 h-3.5 text-amber-700" />
                {latestPrize ? 'Твой питомец' : 'Призовой сундук'}
              </span>
              <button
                onClick={() => {
                  soundManager.playKeyTap();
                  onOpenPrizes();
                }}
                className="text-[11px] font-black text-amber-800 hover:text-amber-950 underline cursor-pointer"
              >
                Альбом ({prizesCount.unlocked}/{prizesCount.total})
              </button>
            </div>

            <div className="my-1 flex items-center gap-3">
              <div className="text-4xl select-none drop-shadow-2xs shrink-0">
                {latestPrize ? latestPrize.emoji : '🎁'}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs sm:text-sm font-black text-slate-900 leading-tight truncate">
                  {latestPrize ? latestPrize.name : 'Сундук с питомцами'}
                </div>
                <p className="text-[11px] text-amber-950/80 italic font-medium mt-0.5 line-clamp-2 leading-tight">
                  {latestPrize
                    ? `«${latestPrize.quote}»`
                    : 'Завершай сложные тренировки на отлично и открывай редких питомцев!'}
                </p>
              </div>
            </div>

            <div className="text-[11px] text-amber-800 font-semibold bg-white/60 px-2 py-0.5 rounded-lg border border-amber-200/80 text-center">
              {latestPrize
                ? 'Редкие питомцы даются за 3 уровень и умную тренировку!'
                : 'Открой своего первого питомца за отличный счёт!'}
            </div>
          </div>

          {/* Primary Action Button (Big, bold, high-contrast) */}
          <button
            onClick={() => {
              soundManager.playKeyTap();
              onStartGame();
            }}
            className="btn-tactile w-full h-[52px] sm:h-[56px] rounded-2xl bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-black text-base sm:text-lg shadow-md border-2 border-emerald-600 flex items-center justify-center gap-2.5 tracking-wide shrink-0 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-white stroke-[2]" />
            <span>Начать тренировку!</span>
            <kbd className="hidden sm:inline px-2 py-0.5 bg-emerald-700/60 rounded-md text-[11px] font-mono text-emerald-100">
              Enter / Пробел
            </kbd>
          </button>
        </div>
      </div>
    </div>
  );
}
