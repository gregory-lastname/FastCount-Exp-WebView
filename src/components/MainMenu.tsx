import React, { useEffect } from 'react';
import {
  BarChart3,
  Calculator,
  ChevronDown,
  Divide,
  Flame,
  Gift,
  Grid,
  Home,
  Keyboard,
  ListFilter,
  Minus,
  Music,
  Play,
  Plus,
  Shuffle,
  Sliders,
  Sparkles,
  Timer,
  User,
  Users,
  X,
  Zap,
} from 'lucide-react';
import {
  DifficultyLevel,
  GameMode,
  InputMode,
  NumberBondTarget,
  PrizePet,
  SessionSettings,
  SoundTheme,
  TableRange,
  UserProfile,
  UserStats,
} from '../types/math';
import { soundManager } from '../utils/audio';

interface MainMenuProps {
  settings: SessionSettings;
  stats: UserStats;
  currentUser?: UserProfile;
  achievementsCount: { unlocked: number; total: number };
  prizesCount: { unlocked: number; total: number };
  latestPrize?: PrizePet | null;
  onUpdateSettings: (newSettings: Partial<SessionSettings>) => void;
  onStartGame: () => void;
  onOpenAchievements: () => void;
  onOpenPrizes: () => void;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
  onOpenUsers: () => void;
  onOpenDashboard: () => void;
}

export function MainMenu({
  settings,
  stats,
  currentUser,
  achievementsCount,
  prizesCount,
  latestPrize,
  onUpdateSettings,
  onStartGame,
  onOpenAchievements,
  onOpenPrizes,
  onOpenUsers,
  onOpenDashboard,
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
      id: 'number_bonds',
      title: 'Состав числа',
      formula: '🏠 Домик',
      example: '10 = 7 + ?',
      iconComponent: <Home className="w-4 h-4 text-amber-600 stroke-[2.5]" />,
    },
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

  const isNumberBond = settings.mode === 'number_bonds';
  const isAdaptive = settings.mode === 'adaptive_training';

  return (
    <div className="w-full max-w-5xl mx-auto my-auto flex flex-col gap-2.5 px-2 py-1 select-none animate-pop-in">
      {/* 1. TOP BAR: Welcoming status, user profile & dashboard */}
      <div className="bg-white rounded-2xl px-4 py-2 border border-amber-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
          {/* Active User Switcher Pill */}
          {currentUser && (
            <button
              onClick={() => {
                soundManager.playKeyTap();
                onOpenUsers();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100/90 hover:bg-amber-200 border border-amber-300 rounded-xl text-amber-950 font-black text-xs shadow-2xs transition-colors cursor-pointer"
              title="Сменить ученика или добавить нового"
            >
              <span className="text-base leading-none">{currentUser.avatar}</span>
              <span className="truncate max-w-[100px] sm:max-w-[130px]">{currentUser.name}</span>
              <span className="text-[10px] text-amber-800 font-semibold hidden sm:inline">
                ({currentUser.grade || '2 класс'})
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-amber-800 ml-0.5" />
            </button>
          )}

          <div className="hidden md:block">
            <h2 className="text-sm font-black text-slate-900 leading-tight">
              Тренажёр устного счёта · 2 класс
            </h2>
            <p className="text-[11px] text-slate-500 font-semibold">
              Выбери режим счёта и начни тренировку
            </p>
          </div>
        </div>

        {/* Right mini stats strip & Dashboard Button */}
        <div className="flex items-center gap-2 sm:gap-2.5 text-xs font-black">
          {/* Personal Report & Dashboard Button */}
          <button
            onClick={() => {
              soundManager.playKeyTap();
              onOpenDashboard();
            }}
            className="flex items-center gap-1.5 text-sky-950 bg-sky-100 hover:bg-sky-200 px-3 py-1.5 rounded-xl border border-sky-300 shadow-2xs transition-colors cursor-pointer"
            title="Открыть персональный дашборд успехов и распечатать похвальную грамоту"
          >
            <BarChart3 className="w-3.5 h-3.5 text-sky-700" />
            <span>Отчёт и Грамота</span>
          </button>

          <div className="flex items-center gap-1 text-slate-700 bg-slate-100 px-2.5 py-1 rounded-xl">
            <span>Решено:</span>
            <span className="text-slate-900 font-mono text-xs">{stats.totalSolved}</span>
          </div>

          <div className="flex items-center gap-1 text-amber-900 bg-amber-100/80 px-2.5 py-1 rounded-xl border border-amber-200">
            <span>⭐</span>
            <span className="font-mono text-xs">{stats.totalStars}</span>
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

      {/* 2. MODE SELECTION BENTO BLOCK */}
      <div className="bg-white rounded-2xl p-3 sm:p-3.5 border border-slate-200 shadow-2xs space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-amber-500 text-white font-black text-xs flex items-center justify-center shadow-2xs">
              1
            </span>
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Режим счёта
            </span>
          </div>
          <span className="text-[11px] font-semibold text-slate-400 hidden sm:inline">
            Выбери один из 8 режимов тренировки
          </span>
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

        {/* 7 SPECIALIZED & CLASSIC MODES (Grid: Addition, Subtraction, Number Bonds, 3 Terms, Mult, Div, Super-Mix) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {classicModes.map((m) => {
            const isSelected = settings.mode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => {
                  soundManager.playKeyTap();
                  onUpdateSettings({ mode: m.id });
                }}
                className={`btn-tactile h-[68px] sm:h-[72px] px-2.5 py-1.5 rounded-xl border-2 text-left flex flex-col justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50/90 ring-2 ring-amber-300 shadow-2xs'
                    : 'border-slate-200 bg-white hover:border-amber-300 hover:bg-slate-50/80'
                }`}
              >
                {/* Top: Large crisp formula & SVG Icon */}
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`font-mono text-xs font-black px-1.5 py-0.5 rounded tracking-wider transition-colors ${
                      isSelected
                        ? 'bg-amber-500 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-900 border border-slate-200'
                    }`}
                  >
                    {m.formula}
                  </span>
                  <div className="p-0.5 rounded bg-slate-50 border border-slate-200 shadow-2xs">
                    {m.iconComponent}
                  </div>
                </div>

                {/* Bottom: Title & Example */}
                <div className="w-full mt-1">
                  <div className="text-xs font-black text-slate-900 truncate">
                    {m.title}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono font-medium truncate">
                    {m.example}
                  </div>
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
            <div className="flex items-center justify-between gap-2 min-h-[36px]">
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
                  <span>Тест (варианты)</span>
                </button>
              </div>
            </div>

            {/* Unified Difficulty Row (Contextual for each mode: Number Bonds, Multiplication, Arithmetic) */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 min-h-[38px]">
              <span className="font-bold text-slate-700 whitespace-nowrap">
                {isNumberBond ? 'Состав числа:' : isTableApplicable && settings.mode !== 'all_mixed' ? 'Диапазон:' : 'Сложность:'}
              </span>

              {isNumberBond ? (
                /* Number Bonds mode: Auto, All to 10, to 20, Specific Number Dropdown */
                <div className="flex gap-1.5 flex-1 max-w-sm justify-end items-center flex-wrap sm:flex-nowrap">
                  <button
                    onClick={() => {
                      soundManager.playKeyTap();
                      onUpdateSettings({ difficulty: 'differential', numberBondTarget: 'auto' });
                    }}
                    className={`btn-tactile px-2 py-1 rounded-xl border text-xs font-black flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap ${
                      settings.difficulty === 'differential' || settings.numberBondTarget === 'auto'
                        ? 'border-amber-500 bg-amber-400 text-amber-950 shadow-2xs'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>⚡ Авто</span>
                    <span className="text-[10px] opacity-75 font-mono">(1–5)</span>
                  </button>

                  <button
                    onClick={() => {
                      soundManager.playKeyTap();
                      onUpdateSettings({ difficulty: 2, numberBondTarget: 'all_to_10' });
                    }}
                    className={`btn-tactile px-2 py-1 rounded-xl border text-xs font-black flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap ${
                      settings.difficulty !== 'differential' && settings.numberBondTarget === 'all_to_10'
                        ? 'border-amber-500 bg-amber-400 text-amber-950 shadow-2xs'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>Все до 10</span>
                  </button>

                  <button
                    onClick={() => {
                      soundManager.playKeyTap();
                      onUpdateSettings({ difficulty: 3, numberBondTarget: 'to_20' });
                    }}
                    className={`btn-tactile px-2 py-1 rounded-xl border text-xs font-black flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap ${
                      settings.difficulty !== 'differential' && settings.numberBondTarget === 'to_20'
                        ? 'border-amber-500 bg-amber-400 text-amber-950 shadow-2xs'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>до 20</span>
                  </button>

                  <select
                    value={
                      ['5', '6', '7', '8', '9', '10'].includes(settings.numberBondTarget) &&
                      settings.difficulty !== 'differential'
                        ? settings.numberBondTarget
                        : ''
                    }
                    onChange={(e) => {
                      soundManager.playKeyTap();
                      const val = e.target.value as NumberBondTarget;
                      if (val) {
                        onUpdateSettings({ difficulty: 2, numberBondTarget: val });
                      }
                    }}
                    className={`btn-tactile px-2 py-1 rounded-xl border text-xs font-black transition-all cursor-pointer outline-hidden ${
                      ['5', '6', '7', '8', '9', '10'].includes(settings.numberBondTarget) &&
                      settings.difficulty !== 'differential'
                        ? 'border-amber-500 bg-amber-400 text-amber-950 shadow-2xs'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <option value="" disabled>Число ▾</option>
                    <option value="5">Состав 5</option>
                    <option value="6">Состав 6</option>
                    <option value="7">Состав 7</option>
                    <option value="8">Состав 8</option>
                    <option value="9">Состав 9</option>
                    <option value="10">Состав 10</option>
                  </select>
                </div>
              ) : isTableApplicable && settings.mode !== 'all_mixed' ? (
                /* Multiplication / Division mode: Auto, up to 5x5, up to 9x9 */
                <div className="flex gap-1.5 flex-1 max-w-sm justify-end items-center flex-wrap sm:flex-nowrap">
                  <button
                    onClick={() => {
                      soundManager.playKeyTap();
                      onUpdateSettings({ difficulty: 'differential' });
                    }}
                    className={`btn-tactile px-2.5 py-1 rounded-xl border text-xs font-black flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap ${
                      settings.difficulty === 'differential'
                        ? 'border-amber-500 bg-amber-400 text-amber-950 shadow-2xs'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>⚡ Авто</span>
                    <span className="text-[10px] opacity-75 font-mono">(1–5)</span>
                  </button>

                  <button
                    onClick={() => {
                      soundManager.playKeyTap();
                      onUpdateSettings({ difficulty: 1, tableRange: 'up_to_5' });
                    }}
                    className={`btn-tactile px-2.5 py-1 rounded-xl border text-xs font-black flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap ${
                      settings.difficulty !== 'differential' && settings.tableRange === 'up_to_5'
                        ? 'border-amber-500 bg-amber-400 text-amber-950 shadow-2xs'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>до 5 × 5</span>
                  </button>

                  <button
                    onClick={() => {
                      soundManager.playKeyTap();
                      onUpdateSettings({ difficulty: 2, tableRange: 'up_to_9' });
                    }}
                    className={`btn-tactile px-2.5 py-1 rounded-xl border text-xs font-black flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap ${
                      settings.difficulty !== 'differential' && settings.tableRange === 'up_to_9'
                        ? 'border-amber-500 bg-amber-400 text-amber-950 shadow-2xs'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>до 9 × 9</span>
                  </button>
                </div>
              ) : (
                /* Classic Arithmetic modes & Adaptive Training */
                <div className="flex gap-1.5 flex-1 max-w-sm justify-end flex-wrap sm:flex-nowrap">
                  {[
                    { level: 'differential' as const, name: '⚡ Авто', tag: '1–5' },
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
                      disabled={isAdaptive && d.level !== 'differential'}
                      className={`btn-tactile px-2 py-1 rounded-xl border text-xs font-black flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap ${
                        (isAdaptive ? d.level === 'differential' : settings.difficulty === d.level)
                          ? 'border-amber-500 bg-amber-400 text-amber-950 shadow-2xs'
                          : isAdaptive
                          ? 'border-slate-100 bg-slate-50/60 text-slate-300 cursor-not-allowed opacity-40'
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
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 min-h-[38px]">
              <span className="font-bold text-slate-700 whitespace-nowrap">Примеров:</span>
              <div className="flex gap-1.5 flex-1 max-w-xs justify-end">
                {([10, 20, 30] as const).map((len) => (
                  <button
                    key={len}
                    onClick={() => {
                      soundManager.playKeyTap();
                      onUpdateSettings({ sessionLength: len });
                    }}
                    disabled={isAdaptive}
                    className={`btn-tactile px-3 py-1 rounded-xl border text-xs font-black transition-all cursor-pointer ${
                      (isAdaptive ? len === 30 : settings.sessionLength === len)
                        ? 'border-amber-500 bg-amber-400 text-amber-950 shadow-2xs'
                        : isAdaptive
                        ? 'border-slate-100 bg-slate-50/60 text-slate-300 cursor-not-allowed opacity-40'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {len}
                  </button>
                ))}
              </div>
            </div>

            {/* Timer & Sound Row: CLEAR & DIRECT TIMER TOGGLE + SECONDS SELECTION */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 flex-wrap">
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
                      ? 'border-emerald-500 bg-emerald-500 text-white shadow-2xs'
                      : 'border-slate-200 bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                  title={settings.timerEnabled ? 'Выключить таймер' : 'Включить таймер'}
                >
                  {settings.timerEnabled ? 'ВКЛ' : 'ВЫКЛ'}
                </button>

                {/* Duration options directly visible when timer is on */}
                {settings.timerEnabled && (
                  <div className="flex items-center gap-1 animate-pop-in">
                    {([5, 8, 10, 15] as const).map((sec) => (
                      <button
                        key={sec}
                        onClick={() => {
                          soundManager.playKeyTap();
                          onUpdateSettings({ timerSeconds: sec });
                        }}
                        className={`px-1.5 py-0.5 rounded text-[11px] font-black border transition-all cursor-pointer ${
                          settings.timerSeconds === sec
                            ? 'bg-amber-400 border-amber-500 text-amber-950 shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {sec}с
                      </button>
                    ))}
                  </div>
                )}
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

