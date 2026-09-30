import React, { useState } from 'react';
import {
  Award,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Flame,
  Printer,
  Sparkles,
  Star,
  Target,
  Trophy,
  X,
  Zap,
} from 'lucide-react';
import { GameMode, PrizePet, SessionResult, UserProfile, UserStats } from '../types/math';
import { soundManager } from '../utils/audio';

interface UserDashboardModalProps {
  isOpen: boolean;
  user: UserProfile;
  stats: UserStats;
  history: SessionResult[];
  prizes: PrizePet[];
  onClose: () => void;
}

const MODE_LABELS: Record<GameMode, { name: string; emoji: string; color: string }> = {
  addition: { name: 'Сложение', emoji: '➕', color: 'bg-emerald-500' },
  subtraction: { name: 'Вычитание', emoji: '➖', color: 'bg-rose-500' },
  number_bonds: { name: 'Состав числа', emoji: '🏠', color: 'bg-amber-500' },
  three_terms: { name: '3 слагаемых', emoji: '🧮', color: 'bg-blue-500' },
  multiplication: { name: 'Умножение', emoji: '✖️', color: 'bg-purple-500' },
  division: { name: 'Деление', emoji: '➗', color: 'bg-amber-600' },
  all_mixed: { name: 'Супер-микс', emoji: '🔀', color: 'bg-indigo-500' },
  adaptive_training: { name: 'Умная тренировка', emoji: '⚡', color: 'bg-yellow-500' },
};

export function UserDashboardModal({
  isOpen,
  user,
  stats,
  history,
  prizes,
  onClose,
}: UserDashboardModalProps) {
  const [activeTab, setActiveTab] = useState<'analytics' | 'diploma'>('analytics');

  if (!isOpen) return null;

  const accuracy =
    stats.totalSolved > 0
      ? Math.round((stats.totalCorrect / stats.totalSolved) * 100)
      : 100;

  // Group history by mode
  const modeBreakdown: Record<
    GameMode,
    { solved: number; correct: number; sessions: number }
  > = {
    addition: { solved: 0, correct: 0, sessions: 0 },
    subtraction: { solved: 0, correct: 0, sessions: 0 },
    number_bonds: { solved: 0, correct: 0, sessions: 0 },
    three_terms: { solved: 0, correct: 0, sessions: 0 },
    multiplication: { solved: 0, correct: 0, sessions: 0 },
    division: { solved: 0, correct: 0, sessions: 0 },
    all_mixed: { solved: 0, correct: 0, sessions: 0 },
    adaptive_training: { solved: 0, correct: 0, sessions: 0 },
  };

  history.forEach((sess) => {
    if (modeBreakdown[sess.mode]) {
      modeBreakdown[sess.mode].solved += sess.totalProblems;
      modeBreakdown[sess.mode].correct += sess.correctCount;
      modeBreakdown[sess.mode].sessions += 1;
    }
  });

  const handlePrint = () => {
    soundManager.playKeyTap();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:fixed print:inset-0">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[94vh] flex flex-col shadow-2xl border-3 border-sky-300 overflow-hidden print:border-none print:shadow-none print:max-h-none print:w-full print:rounded-none animate-pop-in">
        {/* Top Header - Hidden in Print */}
        <div className="p-4 sm:p-5 border-b border-sky-200/80 bg-sky-50/80 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white border-2 border-sky-300 flex items-center justify-center text-3xl shadow-xs shrink-0">
              {user.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-slate-900 leading-tight">
                  Дашборд успехов · {user.name}
                </h3>
                <span className="text-xs font-bold text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded-full border border-sky-200">
                  {user.grade || '2 класс'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-semibold">
                Аналитика точности, скорости и похвальная грамота
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab switch */}
            <div className="flex bg-white p-1 rounded-xl border border-sky-200 shadow-2xs">
              <button
                onClick={() => {
                  soundManager.playKeyTap();
                  setActiveTab('analytics');
                }}
                className={`px-3 py-1 text-xs font-black rounded-lg transition-all cursor-pointer ${
                  activeTab === 'analytics'
                    ? 'bg-sky-500 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                📊 Аналитика
              </button>
              <button
                onClick={() => {
                  soundManager.playKeyTap();
                  setActiveTab('diploma');
                }}
                className={`px-3 py-1 text-xs font-black rounded-lg transition-all cursor-pointer ${
                  activeTab === 'diploma'
                    ? 'bg-amber-500 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🏆 Похвальная грамота
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="p-2 rounded-xl text-sky-900 bg-sky-100 hover:bg-sky-200 border border-sky-300 transition-colors shadow-2xs flex items-center gap-1.5 text-xs font-bold cursor-pointer"
              title="Распечатать отчёт или диплом"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Печать</span>
            </button>

            <button
              onClick={() => {
                soundManager.playKeyTap();
                onClose();
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 print:p-0 print:overflow-visible">
          {activeTab === 'analytics' ? (
            /* TAB 1: ANALYTICS DASHBOARD */
            <div className="space-y-5">
              {/* KPI Cards Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-center shadow-2xs">
                  <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
                    <Target className="w-3.5 h-3.5" />
                    <span>Точность</span>
                  </div>
                  <div className="text-2xl font-black text-emerald-950 font-mono">
                    {accuracy}%
                  </div>
                  <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                    {stats.totalCorrect} из {stats.totalSolved}
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-center shadow-2xs">
                  <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>Звёзды</span>
                  </div>
                  <div className="text-2xl font-black text-amber-950 font-mono">
                    {stats.totalStars}
                  </div>
                  <div className="text-[10px] text-amber-700 font-semibold mt-0.5">
                    {stats.totalSessions} сессий
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-2xl p-3 text-center shadow-2xs">
                  <div className="text-[11px] font-bold text-orange-800 uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-orange-600" />
                    <span>Лучшая серия</span>
                  </div>
                  <div className="text-2xl font-black text-orange-950 font-mono">
                    {stats.highestStreak}
                  </div>
                  <div className="text-[10px] text-orange-700 font-semibold mt-0.5">
                    без ошибок
                  </div>
                </div>

                <div className="bg-sky-50 border border-sky-200 rounded-2xl p-3 text-center shadow-2xs">
                  <div className="text-[11px] font-bold text-sky-800 uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Скорость</span>
                  </div>
                  <div className="text-2xl font-black text-sky-950 font-mono">
                    {stats.bestTimeSec ? `${stats.bestTimeSec}с` : '—'}
                  </div>
                  <div className="text-[10px] text-sky-700 font-semibold mt-0.5">
                    в среднем на ответ
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-2xl p-3 text-center shadow-2xs">
                  <div className="text-[11px] font-bold text-purple-800 uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
                    <Trophy className="w-3.5 h-3.5 text-purple-600" />
                    <span>Питомцы</span>
                  </div>
                  <div className="text-2xl font-black text-purple-950 font-mono">
                    {prizes.length}
                  </div>
                  <div className="text-[10px] text-purple-700 font-semibold mt-0.5">
                    из 24 открыто
                  </div>
                </div>

                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 text-center shadow-2xs">
                  <div className="text-[11px] font-bold text-rose-800 uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-rose-600" />
                    <span>Ошибки</span>
                  </div>
                  <div className="text-2xl font-black text-rose-950 font-mono">
                    {stats.totalMistakes}
                  </div>
                  <div className="text-[10px] text-rose-700 font-semibold mt-0.5">
                    исправлено в игре
                  </div>
                </div>
              </div>

              {/* Progress by Game Modes */}
              <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4 text-sky-600" />
                    <span>Результаты по разделам математики</span>
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">
                    Успеваемость ученика
                  </span>
                </div>

                <div className="space-y-2.5">
                  {(Object.keys(MODE_LABELS) as GameMode[]).map((m) => {
                    const data = modeBreakdown[m];
                    const modeAcc =
                      data.solved > 0 ? Math.round((data.correct / data.solved) * 100) : 0;
                    const meta = MODE_LABELS[m];

                    return (
                      <div key={m} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="flex items-center gap-1.5 text-slate-800">
                            <span>{meta.emoji}</span>
                            <span>{meta.name}</span>
                          </span>
                          <span className="text-slate-600 font-mono">
                            {data.solved > 0 ? (
                              <span>
                                {modeAcc}%{' '}
                                <span className="text-[10px] text-slate-400">
                                  ({data.correct}/{data.solved})
                                </span>
                              </span>
                            ) : (
                              <span className="text-slate-400 font-normal">Ещё не тренировался</span>
                            )}
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-200">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${meta.color}`}
                            style={{ width: `${modeAcc}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pedagogical recommendations & strengths */}
              <div className="bg-amber-50/70 border border-amber-300 rounded-2xl p-4 shadow-2xs space-y-2">
                <div className="flex items-center gap-2 text-xs font-black text-amber-950 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Педагогический отзыв и рекомендации</span>
                </div>
                <div className="text-xs text-amber-950 space-y-1.5 font-medium leading-relaxed">
                  {stats.totalSolved < 10 ? (
                    <p>
                      🌱 <strong>Начало пути:</strong> Ученик только начинает тренировки.
                      Рекомендуется начать с режима <strong>«Состав числа»</strong> и{' '}
                      <strong>«Сложение (1-2 уровень)»</strong> для закрепления базовых навыков.
                    </p>
                  ) : accuracy >= 90 ? (
                    <p>
                      🌟 <strong>Отличный уровень счёта:</strong> Точность составляет{' '}
                      <strong>{accuracy}%</strong>. Ученик прекрасно справляется с вычислениями
                      в уме. Можно переходить к режимам с ограничением по времени и{' '}
                      <strong>«3 слагаемых»</strong>!
                    </p>
                  ) : (
                    <p>
                      💪 <strong>Есть куда расти:</strong> Точность составляет{' '}
                      <strong>{accuracy}%</strong>. Рекомендуется регулярно повторять{' '}
                      <strong>«Состав числа до 10»</strong> (числовые домики) для доведения счёта
                      до автоматизма без ошибок.
                    </p>
                  )}
                </div>
              </div>

              {/* Recent Sessions History Table */}
              <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-slate-600" />
                    <span>История последних тренировок</span>
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Всего сессий: {history.length}
                  </span>
                </div>

                {history.length === 0 ? (
                  <div className="text-center py-6 text-slate-400 text-xs font-medium">
                    Пока нет завершённых сессий. Начни тренировку прямо сейчас! 🚀
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto">
                    {history.slice(0, 10).map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className="py-2 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span>{MODE_LABELS[item.mode]?.emoji || '🧮'}</span>
                          <div>
                            <div className="font-bold text-slate-800">
                              {MODE_LABELS[item.mode]?.name || item.mode}
                            </div>
                            <div className="text-[10px] text-slate-400">{item.date}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-mono text-emerald-600 font-bold">
                            {item.accuracy}%
                          </span>
                          <span className="text-amber-500 font-bold">
                            {'★'.repeat(item.stars)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* TAB 2: CERTIFICATE OF EXCELLENCE / ПОХВАЛЬНАЯ ГРАМОТА */
            <div className="p-4 sm:p-8 flex justify-center">
              <div className="w-full max-w-2xl bg-linear-to-b from-amber-50 via-white to-orange-50 border-8 border-double border-amber-500 rounded-3xl p-6 sm:p-10 shadow-xl text-center relative overflow-hidden print:border-8 print:border-amber-600 print:shadow-none">
                {/* Decorative corner ribbons */}
                <div className="absolute top-2 left-2 text-2xl select-none">✨</div>
                <div className="absolute top-2 right-2 text-2xl select-none">✨</div>
                <div className="absolute bottom-2 left-2 text-2xl select-none">🏆</div>
                <div className="absolute bottom-2 right-2 text-2xl select-none">🌟</div>

                {/* Big Medal Icon */}
                <div className="w-20 h-20 mx-auto rounded-3xl bg-linear-to-tr from-amber-400 to-amber-300 border-4 border-amber-500 flex items-center justify-center text-4xl shadow-md mb-3">
                  🏅
                </div>

                <div className="text-xs font-black uppercase tracking-widest text-amber-800 mb-1">
                  РОССИЙСКАЯ НАЧАЛЬНАЯ ШКОЛА · ТРЕНАЖЁР УСТНОГО СЧЁТА
                </div>

                <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
                  ПОХВАЛЬНАЯ ГРАМОТА
                </h1>

                <p className="text-xs sm:text-sm font-semibold text-slate-600 mb-4">
                  Награждается за отличные успехи, усердие и мастерство в устном счёте:
                </p>

                {/* Student Name */}
                <div className="my-4 inline-block bg-white px-8 py-3 rounded-2xl border-3 border-amber-400 shadow-md">
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-3xl select-none">{user.avatar}</span>
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
                      {user.name}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-amber-800 mt-1">
                    {user.grade || '2 класс'}
                  </div>
                </div>

                {/* Student Merit Badges */}
                <div className="grid grid-cols-3 gap-3 my-5 max-w-md mx-auto">
                  <div className="bg-white p-2.5 rounded-xl border border-amber-300 shadow-2xs">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Решено</div>
                    <div className="text-lg font-black text-slate-900 font-mono">
                      {stats.totalSolved}
                    </div>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-amber-300 shadow-2xs">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Точность</div>
                    <div className="text-lg font-black text-emerald-600 font-mono">
                      {accuracy}%
                    </div>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-amber-300 shadow-2xs">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Звёзды</div>
                    <div className="text-lg font-black text-amber-500 font-mono">
                      ⭐ {stats.totalStars}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 italic font-medium max-w-lg mx-auto mb-6">
                  «Математика — царица наук. Твоя целеустремлённость и быстрый счёт в уме открывают двери к великим знаниям!»
                </p>

                {/* Signature and Date Footer */}
                <div className="pt-4 border-t-2 border-dashed border-amber-300 flex items-center justify-between text-xs text-slate-600 px-4">
                  <div className="text-left">
                    <div className="text-[10px] font-bold uppercase text-slate-400">Дата выдачи</div>
                    <div className="font-bold text-slate-800 mt-0.5">
                      {new Date().toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] font-bold uppercase text-slate-400">Подпись учителя / родителя</div>
                    <div className="w-36 border-b-2 border-slate-400 mt-4" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-3.5 px-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between print:hidden">
          <button
            onClick={handlePrint}
            className="btn-tactile px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Распечатать {activeTab === 'diploma' ? 'грамоту' : 'отчёт'}</span>
          </button>

          <button
            onClick={() => {
              soundManager.playKeyTap();
              onClose();
            }}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-xl text-xs sm:text-sm transition-colors cursor-pointer"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}
