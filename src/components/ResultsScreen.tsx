import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Award,
  CheckCircle2,
  Clock,
  Flame,
  Gift,
  RotateCcw,
  Sliders,
  Sparkles,
  Trophy,
  XCircle,
} from 'lucide-react';
import { Achievement, SessionResult } from '../types/math';
import { soundManager } from '../utils/audio';

interface ResultsScreenProps {
  result: SessionResult;
  newAchievements: Achievement[];
  onPlayAgain: () => void;
  onChangeMode: () => void;
  onGoHome: () => void;
  onOpenPrizes: () => void;
}

export function ResultsScreen({
  result,
  newAchievements,
  onPlayAgain,
  onChangeMode,
  onGoHome,
  onOpenPrizes,
}: ResultsScreenProps) {
  const [chestOpened, setChestOpened] = useState<boolean>(false);

  // Confetti and star sound orchestration
  useEffect(() => {
    soundManager.playCelebration();

    if (result.stars >= 4) {
      const count = 180;
      const defaults = { origin: { y: 0.65 } };
      function fire(particleRatio: number, opts: confetti.Options) {
        confetti({ ...defaults, ...opts, particleCount: Math.floor(count * particleRatio) });
      }
      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    } else {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.65 } });
    }

    const starTimers: number[] = [];
    for (let i = 0; i < result.stars; i++) {
      const timer = window.setTimeout(() => {
        soundManager.playStar(i);
      }, 300 + i * 200);
      starTimers.push(timer);
    }

    // Auto-open chest after 800ms
    const chestTimer = window.setTimeout(() => {
      setChestOpened(true);
      soundManager.playChestOpen();
    }, 900);

    return () => {
      starTimers.forEach((t) => clearTimeout(t));
      clearTimeout(chestTimer);
    };
  }, [result.stars]);

  // Keyboard shortcuts: Space -> play again, Esc -> go home
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        soundManager.playKeyTap();
        onPlayAgain();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        soundManager.playKeyTap();
        onGoHome();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onPlayAgain, onGoHome]);

  const getPraiseMessage = () => {
    if (result.stars === 5) {
      return {
        title: 'Блестяще! Высший класс! 🌟',
        subtitle: 'Ты считаешь быстро и абсолютно точно, настоящий чемпион!',
        badge: 'Супер-результат',
      };
    } else if (result.stars === 4) {
      return {
        title: 'Отличная работа! 🚀',
        subtitle: 'Ты отлично справляешься! Ещё немного — и будет 5 звёзд!',
        badge: 'Отличник',
      };
    } else if (result.stars === 3) {
      return {
        title: 'Хороший результат! 👍',
        subtitle: 'Ты делаешь успехи. Повтори ещё разок, чтобы закрепить счёт!',
        badge: 'Уверенный счётчик',
      };
    } else {
      return {
        title: 'Ты учишься! Молодец! 🌱',
        subtitle: 'Ошибки помогают нам расти. Давай попробуем ещё разок!',
        badge: 'Шаг вперёд',
      };
    }
  };

  const praise = getPraiseMessage();
  const prize = result.prizeAwarded;

  const rarityLabels = {
    legendary: { label: '👑 Легендарный питомец', bg: 'bg-amber-100 text-amber-900 border-amber-300' },
    epic: { label: '💜 Эпический питомец', bg: 'bg-purple-100 text-purple-900 border-purple-300' },
    rare: { label: '💙 Редкий питомец', bg: 'bg-sky-100 text-sky-900 border-sky-300' },
    common: { label: '💚 Обычный питомец', bg: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
  };

  return (
    <div className="w-full h-full max-h-[calc(100vh-60px)] flex flex-col justify-between py-2 sm:py-3 px-4 max-w-5xl mx-auto overflow-hidden animate-pop-in">
      {/* Top Praise Header */}
      <div className="text-center shrink-0">
        <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-0.5 rounded-full border border-amber-300 inline-block mb-1">
          {praise.badge}
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
          {praise.title}
        </h2>
        <p className="text-xs text-slate-600 max-w-md mx-auto line-clamp-1">{praise.subtitle}</p>

        {/* Stars Display */}
        <div className="flex items-center justify-center gap-2 py-1">
          {Array.from({ length: 5 }).map((_, idx) => {
            const isEarned = idx < result.stars;
            return (
              <span
                key={idx}
                className={`text-3xl sm:text-4xl transition-all duration-300 transform ${
                  isEarned
                    ? 'scale-110 drop-shadow-xs animate-bounce'
                    : 'grayscale opacity-25 scale-85'
                }`}
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                ⭐
              </span>
            );
          })}
        </div>
      </div>

      {/* Main 2-Column Split: Stats on Left, Prize Box on Right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 my-auto flex-1 min-h-0 items-center">
        {/* Left: Performance Stats Grid (7 cols) */}
        <div className="md:col-span-7 flex flex-col justify-between gap-2.5 h-full max-h-[300px]">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 flex-1">
            {/* Correct */}
            <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-2xl flex flex-col justify-between shadow-2xs">
              <div className="flex items-center justify-between text-emerald-600">
                <span className="text-[11px] font-bold">Правильно</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div className="text-xl font-black text-emerald-950 mt-1">
                {result.correctCount}{' '}
                <span className="text-xs font-bold text-emerald-600">/ {result.totalProblems}</span>
              </div>
            </div>

            {/* Accuracy */}
            <div className="bg-sky-50 border border-sky-200 p-2.5 rounded-2xl flex flex-col justify-between shadow-2xs">
              <div className="flex items-center justify-between text-sky-600">
                <span className="text-[11px] font-bold">Точность</span>
                <Trophy className="w-3.5 h-3.5" />
              </div>
              <div className="text-xl font-black text-sky-950 mt-1">{result.accuracy}%</div>
            </div>

            {/* Average time */}
            <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-2xl flex flex-col justify-between shadow-2xs">
              <div className="flex items-center justify-between text-amber-700">
                <span className="text-[11px] font-bold">Ср. время</span>
                <Clock className="w-3.5 h-3.5" />
              </div>
              <div className="text-xl font-black text-amber-950 mt-1">
                {result.averageTimeSec}{' '}
                <span className="text-xs font-bold text-amber-700">сек</span>
              </div>
            </div>

            {/* Best Streak */}
            <div className="bg-orange-50 border border-orange-200 p-2.5 rounded-2xl flex flex-col justify-between shadow-2xs">
              <div className="flex items-center justify-between text-orange-600">
                <span className="text-[11px] font-bold">Серия</span>
                <Flame className="w-3.5 h-3.5 fill-orange-500" />
              </div>
              <div className="text-xl font-black text-orange-950 mt-1">
                {result.bestStreak}{' '}
                <span className="text-xs font-bold text-orange-600">подряд</span>
              </div>
            </div>
          </div>

          {/* Mistakes / Rescue status note */}
          {result.mistakesCount > 0 ? (
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-amber-950 bg-amber-50/90 py-1.5 px-3 rounded-xl border border-amber-300 shrink-0">
              <span className="text-sm">🛟</span>
              <span>Примеров спасено: {result.mistakesCount} (все отработаны и решены на отлично!)</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 py-1.5 px-3 rounded-xl border border-emerald-200 shrink-0">
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              <span>Идеальный результат: ни одному примеру не потребовалась помощь!</span>
            </div>
          )}

          {/* New achievements unlock banner */}
          {newAchievements.length > 0 && (
            <div className="bg-amber-100/90 border border-amber-300 rounded-xl p-2 flex items-center justify-between text-xs text-amber-950 font-bold shrink-0">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-700" />
                Новое достижение: {newAchievements[0].title}
              </span>
              <span className="text-lg">{newAchievements[0].icon}</span>
            </div>
          )}
        </div>

        {/* Right: Interactive Prize Box (5 cols) */}
        <div className="md:col-span-5 h-full max-h-[300px]">
          <div className="bg-linear-to-b from-amber-50 via-orange-50 to-amber-100/80 rounded-2xl p-4 border-2 border-amber-300 shadow-sm h-full flex flex-col items-center justify-between text-center relative overflow-hidden">
            {!chestOpened ? (
              /* Mystery Chest closed */
              <button
                onClick={() => {
                  setChestOpened(true);
                  soundManager.playChestOpen();
                  confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
                }}
                className="my-auto flex flex-col items-center group cursor-pointer"
              >
                <div className="text-6xl sm:text-7xl animate-bounce drop-shadow-md group-hover:scale-110 transition-transform">
                  🎁
                </div>
                <div className="mt-3 font-black text-amber-950 text-sm sm:text-base flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600 animate-spin" />
                  Нажми, чтобы открыть приз!
                </div>
                <div className="text-[11px] text-amber-800 font-semibold mt-0.5">
                  Награда за {result.stars} ⭐ в тренировке
                </div>
              </button>
            ) : prize ? (
              /* Prize Revealed */
              <div className="flex flex-col items-center justify-between h-full w-full animate-pop-in">
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-black uppercase text-amber-900 flex items-center gap-1">
                    <Gift className="w-3.5 h-3.5 text-amber-700" />
                    Твой новый приз:
                  </span>
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                      rarityLabels[prize.rarity].bg
                    }`}
                  >
                    {rarityLabels[prize.rarity].label}
                  </span>
                </div>

                <div className="my-1 flex flex-col items-center">
                  <div className="text-5xl sm:text-6xl drop-shadow-sm animate-pop-in">
                    {prize.emoji}
                  </div>
                  <div className="text-base sm:text-lg font-black text-slate-900 mt-1">
                    {prize.name}
                  </div>
                  <div className="text-xs font-medium text-slate-600">{prize.title}</div>
                  <p className="text-[11px] text-amber-950 italic font-semibold mt-1 max-w-xs leading-tight">
                    «{prize.quote}»
                  </p>
                </div>

                <button
                  onClick={() => {
                    soundManager.playKeyTap();
                    onOpenPrizes();
                  }}
                  className="w-full py-1.5 px-3 bg-white hover:bg-amber-50 text-amber-900 font-black text-xs rounded-xl border border-amber-300 shadow-2xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Gift className="w-3.5 h-3.5" />
                  <span>Посмотреть всю коллекцию питомцев</span>
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Action Buttons Strip */}
      <div className="flex flex-col sm:flex-row gap-2 pt-1 shrink-0">
        {/* Play Again (Primary) */}
        <button
          onClick={() => {
            soundManager.playKeyTap();
            onPlayAgain();
          }}
          className="btn-tactile flex-1 py-3 px-4 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-black text-sm sm:text-base rounded-xl shadow-md border border-emerald-600 flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4 stroke-[2.5]" />
          <span>Ещё раз</span>
          <kbd className="hidden sm:inline px-1.5 py-0.5 bg-emerald-600 rounded text-[10px] font-mono text-emerald-100">
            Пробел
          </kbd>
        </button>

        {/* Change Mode */}
        <button
          onClick={() => {
            soundManager.playKeyTap();
            onChangeMode();
          }}
          className="btn-tactile flex-1 py-3 px-4 bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-amber-950 font-black text-sm sm:text-base rounded-xl shadow-2xs border border-amber-500 flex items-center justify-center gap-2"
        >
          <Sliders className="w-4 h-4" />
          <span>Сменить режим</span>
        </button>

        {/* Go Home */}
        <button
          onClick={() => {
            soundManager.playKeyTap();
            onGoHome();
          }}
          className="btn-tactile sm:w-auto py-3 px-4 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-bold text-sm sm:text-base rounded-xl border border-slate-300 flex items-center justify-center gap-1.5"
        >
          <span>В меню</span>
          <kbd className="hidden sm:inline px-1.5 py-0.5 bg-white rounded text-[10px] font-mono text-slate-500">
            Esc
          </kbd>
        </button>
      </div>
    </div>
  );
}
