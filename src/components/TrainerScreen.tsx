import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ArrowLeft,
  Check,
  Coffee,
  Flame,
  RotateCcw,
  Sparkles,
  Timer as TimerIcon,
  X,
  Zap,
} from 'lucide-react';
import { MathProblem, SessionResult, SessionSettings } from '../types/math';
import { soundManager } from '../utils/audio';
import { generateProblem } from '../utils/mathGenerator';
import { TenFrame } from './TenFrame';

interface TrainerScreenProps {
  settings: SessionSettings;
  onFinishSession: (result: SessionResult) => void;
  onExit: () => void;
}

export function TrainerScreen({ settings, onFinishSession, onExit }: TrainerScreenProps) {
  // Adaptive training mode state
  const isAdaptiveMode = settings.mode === 'adaptive_training';
  const [adaptiveTier, setAdaptiveTier] = useState<number>(2);
  const [maxAdaptiveTier, setMaxAdaptiveTier] = useState<number>(2);
  const [consecutiveFastCorrect, setConsecutiveFastCorrect] = useState<number>(0);
  const [tierToast, setTierToast] = useState<string | null>(null);

  // Periodic rest modal in adaptive training
  const [showRestModal, setShowRestModal] = useState<boolean>(false);
  const [restCount, setRestCount] = useState<number>(0);

  // Session queue & state
  const [problemQueue, setProblemQueue] = useState<MathProblem[]>(() => [
    generateProblem(settings.mode, settings.difficulty, settings.tableRange, null, 2),
  ]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState<number>(0);
  const [currentInput, setCurrentInput] = useState<string>('');

  // Feedback state: 'idle' | 'correct' | 'wrong' | 'timeout'
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong' | 'timeout'>('idle');
  const [revealedAnswer, setRevealedAnswer] = useState<number | null>(null);

  // Stats tracking
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [mistakesCount, setMistakesCount] = useState<number>(0);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [responseTimes, setResponseTimes] = useState<number[]>([]);

  // Refs for tracking mutable values across closures/listeners
  const correctCountRef = useRef<number>(0);
  const mistakesCountRef = useRef<number>(0);
  const bestStreakRef = useRef<number>(0);
  const responseTimesRef = useRef<number[]>([]);
  const adaptiveTierRef = useRef<number>(2);
  const maxAdaptiveTierRef = useRef<number>(2);
  const consecutiveFastCorrectRef = useRef<number>(0);

  // Timer state
  const isTimerActive =
    settings.timerEnabled && (isAdaptiveMode || settings.difficulty !== 1);
  const [timeLeft, setTimeLeft] = useState<number>(settings.timerSeconds);
  const timerIntervalRef = useRef<number | null>(null);
  const problemStartTimeRef = useRef<number>(Date.now());

  // Exit confirmation modal
  const [showExitModal, setShowExitModal] = useState<boolean>(false);

  // Sync refs
  useEffect(() => {
    correctCountRef.current = correctCount;
  }, [correctCount]);
  useEffect(() => {
    mistakesCountRef.current = mistakesCount;
  }, [mistakesCount]);
  useEffect(() => {
    bestStreakRef.current = bestStreak;
  }, [bestStreak]);
  useEffect(() => {
    responseTimesRef.current = responseTimes;
  }, [responseTimes]);
  useEffect(() => {
    adaptiveTierRef.current = adaptiveTier;
  }, [adaptiveTier]);
  useEffect(() => {
    maxAdaptiveTierRef.current = maxAdaptiveTier;
  }, [maxAdaptiveTier]);
  useEffect(() => {
    consecutiveFastCorrectRef.current = consecutiveFastCorrect;
  }, [consecutiveFastCorrect]);

  const currentProblem = problemQueue[currentProblemIndex];

  const currentProblemRef = useRef<MathProblem | undefined>(currentProblem);
  useEffect(() => {
    currentProblemRef.current = currentProblem;
  }, [currentProblem]);

  const currentProblemIndexRef = useRef<number>(currentProblemIndex);
  useEffect(() => {
    currentProblemIndexRef.current = currentProblemIndex;
  }, [currentProblemIndex]);

  const feedbackRef = useRef<string>(feedback);
  useEffect(() => {
    feedbackRef.current = feedback;
  }, [feedback]);

  const currentInputRef = useRef<string>(currentInput);
  useEffect(() => {
    currentInputRef.current = currentInput;
  }, [currentInput]);

  // Finish session calculation
  const finishSession = useCallback(() => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    const total = isAdaptiveMode
      ? Math.max(1, currentProblemIndexRef.current + 1)
      : settings.sessionLength;
    const finalCorrect = correctCountRef.current;
    const finalMistakes = mistakesCountRef.current;
    const finalBestStreak = bestStreakRef.current;
    const finalTimes = responseTimesRef.current;

    const accuracy = total > 0 ? Math.round((finalCorrect / total) * 100) : 100;
    const avgTime =
      finalTimes.length > 0
        ? Number((finalTimes.reduce((a, b) => a + b, 0) / finalTimes.length).toFixed(1))
        : 3.0;

    // Calculate stars: 1 to 5
    let stars = 1;
    if (accuracy >= 95) stars = 5;
    else if (accuracy >= 80) stars = 4;
    else if (accuracy >= 65) stars = 3;
    else if (accuracy >= 45) stars = 2;
    else stars = 1;

    const result: SessionResult = {
      id: `session-${Date.now()}`,
      totalProblems: total,
      correctCount: finalCorrect,
      mistakesCount: finalMistakes,
      accuracy,
      averageTimeSec: avgTime,
      bestStreak: finalBestStreak,
      stars,
      mode: settings.mode,
      difficulty: settings.difficulty,
      adaptiveMaxTier: isAdaptiveMode ? maxAdaptiveTierRef.current : undefined,
      date: new Date().toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    onFinishSession(result);
  }, [settings, isAdaptiveMode, onFinishSession]);

  // Advance to next problem
  const moveToNextProblem = useCallback(() => {
    setCurrentInput('');
    currentInputRef.current = '';
    setFeedback('idle');
    feedbackRef.current = 'idle';
    setRevealedAnswer(null);

    const nextIndex = currentProblemIndexRef.current + 1;

    // Check for periodic rest in adaptive mode every 12 problems
    if (isAdaptiveMode && nextIndex > 0 && nextIndex % 12 === 0 && nextIndex !== restCount) {
      setRestCount(nextIndex);
      setShowRestModal(true);
      return;
    }

    if (!isAdaptiveMode && nextIndex >= settings.sessionLength) {
      finishSession();
      return;
    }

    setProblemQueue((prev) => {
      if (nextIndex >= prev.length) {
        const last = prev[prev.length - 1];
        const newProb = generateProblem(
          settings.mode,
          settings.difficulty,
          settings.tableRange,
          last,
          adaptiveTierRef.current
        );
        return [...prev, newProb];
      }
      return prev;
    });

    setCurrentProblemIndex(nextIndex);
    currentProblemIndexRef.current = nextIndex;
    problemStartTimeRef.current = Date.now();
    setTimeLeft(settings.timerSeconds);
  }, [settings, isAdaptiveMode, restCount, finishSession]);

  // Handle timeout
  const handleTimeout = useCallback(() => {
    const prob = currentProblemRef.current;
    if (feedbackRef.current !== 'idle' || !prob) return;

    soundManager.playError();
    setFeedback('timeout');
    feedbackRef.current = 'timeout';
    setRevealedAnswer(prob.answer);

    setMistakesCount((prev) => {
      const next = prev + 1;
      mistakesCountRef.current = next;
      return next;
    });
    setCurrentStreak(0);

    // Adaptive difficulty drop on timeout
    if (isAdaptiveMode) {
      setConsecutiveFastCorrect(0);
      setAdaptiveTier((prev) => Math.max(1, prev - 1));
      setTierToast('Немного снизим темп 🧘');
      setTimeout(() => setTierToast(null), 2000);
    }

    const elapsedSec = (Date.now() - problemStartTimeRef.current) / 1000;
    setResponseTimes((prev) => {
      const next = [...prev, elapsedSec];
      responseTimesRef.current = next;
      return next;
    });

    // Re-queue problem
    const retryProblem: MathProblem = {
      ...prob,
      id: `${prob.id}-retry-${Date.now()}`,
      isRetry: true,
    };

    setProblemQueue((prev) => {
      const copy = [...prev];
      const insertIdx = Math.min(copy.length, currentProblemIndexRef.current + 3);
      copy.splice(insertIdx, 0, retryProblem);
      return copy;
    });

    setTimeout(() => {
      moveToNextProblem();
    }, 1800);
  }, [isAdaptiveMode, moveToNextProblem]);

  // Timer loop
  useEffect(() => {
    if (!isTimerActive || feedback !== 'idle' || !currentProblem || showRestModal || showExitModal) {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      return;
    }

    setTimeLeft(settings.timerSeconds);

    timerIntervalRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
          handleTimeout();
          return 0;
        }
        if (prev <= 4) {
          soundManager.playTimerTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [
    currentProblemIndex,
    isTimerActive,
    feedback,
    currentProblem,
    showRestModal,
    showExitModal,
    settings.timerSeconds,
    handleTimeout,
  ]);

  // Check answer logic
  const submitAnswer = useCallback(
    (numericAnswer: number) => {
      const prob = currentProblemRef.current;
      if (feedbackRef.current !== 'idle' || !prob) return;

      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

      const elapsedSec = (Date.now() - problemStartTimeRef.current) / 1000;
      setResponseTimes((prev) => {
        const next = [...prev, elapsedSec];
        responseTimesRef.current = next;
        return next;
      });

      if (numericAnswer === prob.answer) {
        // CORRECT ANSWER
        soundManager.playSuccess();
        setFeedback('correct');
        feedbackRef.current = 'correct';

        setCorrectCount((prev) => {
          const next = prev + 1;
          correctCountRef.current = next;
          return next;
        });

        setCurrentStreak((prevStreak) => {
          const newStreak = prevStreak + 1;
          setBestStreak((prevBest) => {
            const nextBest = Math.max(prevBest, newStreak);
            bestStreakRef.current = nextBest;
            return nextBest;
          });
          return newStreak;
        });

        // Adaptive difficulty logic: if fast (< 3.8s) and confident, advance tier
        if (isAdaptiveMode) {
          const isFast = elapsedSec < 3.8;
          if (isFast) {
            setConsecutiveFastCorrect((prev) => {
              const next = prev + 1;
              if (next >= 2) {
                setAdaptiveTier((currTier) => {
                  const newTier = Math.min(5, currTier + 1);
                  setMaxAdaptiveTier((m) => Math.max(m, newTier));
                  return newTier;
                });
                setTierToast('Отличная скорость и точность! Сложность повышена 🚀');
                setTimeout(() => setTierToast(null), 2200);
                return 0;
              }
              return next;
            });
          }
        }

        // HOLD EQUATION ON SCREEN FOR ~1250ms SO THE CHILD VISUALLY MEMORIZES THE COMPLETE IDENTITY!
        setTimeout(() => {
          moveToNextProblem();
        }, 1250);
      } else {
        // WRONG ANSWER
        soundManager.playError();
        setFeedback('wrong');
        feedbackRef.current = 'wrong';
        setRevealedAnswer(prob.answer);

        setMistakesCount((prev) => {
          const next = prev + 1;
          mistakesCountRef.current = next;
          return next;
        });
        setCurrentStreak(0);

        // Adaptive adjustment on mistake
        if (isAdaptiveMode) {
          setConsecutiveFastCorrect(0);
          setAdaptiveTier((prev) => Math.max(1, prev - 1));
          setTierToast('Закрепим этот уровень 💪');
          setTimeout(() => setTierToast(null), 2000);
        }

        // Re-queue for reinforcement
        const retryProblem: MathProblem = {
          ...prob,
          id: `${prob.id}-retry-${Date.now()}`,
          isRetry: true,
        };

        setProblemQueue((prev) => {
          const copy = [...prev];
          const insertIdx = Math.min(copy.length, currentProblemIndexRef.current + 3);
          copy.splice(insertIdx, 0, retryProblem);
          return copy;
        });

        setTimeout(() => {
          moveToNextProblem();
        }, 1700);
      }
    },
    [isAdaptiveMode, moveToNextProblem]
  );

  const submitAnswerRef = useRef(submitAnswer);
  useEffect(() => {
    submitAnswerRef.current = submitAnswer;
  }, [submitAnswer]);

  // Physical Keyboard listener (BOTH KEYBOARD MODE AND TEST MODE USE KEYBOARD ONLY!)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showExitModal || showRestModal) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        setShowExitModal(true);
        return;
      }

      if (feedbackRef.current !== 'idle') return;

      // Digits input 0-9
      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        soundManager.playKeyTap();
        setCurrentInput((prev) => {
          const next = prev.length < 3 ? prev + e.key : e.key;
          currentInputRef.current = next;
          return next;
        });
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault();
        soundManager.playKeyTap();
        setCurrentInput((prev) => {
          const next = prev.slice(0, -1);
          currentInputRef.current = next;
          return next;
        });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const val = currentInputRef.current.trim();
        if (val !== '') {
          const parsed = parseInt(val, 10);
          if (!isNaN(parsed)) {
            submitAnswerRef.current(parsed);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showExitModal, showRestModal]);

  if (!currentProblem) return null;

  const totalTarget = isAdaptiveMode ? 30 : settings.sessionLength;
  const progressPercentage = Math.min(
    100,
    Math.round(((currentProblemIndex + 1) / totalTarget) * 100)
  );

  return (
    <div className="w-full h-full max-h-[calc(100vh-60px)] flex flex-col justify-between py-2 sm:py-3 px-4 max-w-4xl mx-auto overflow-hidden">
      {/* Top Status Bar */}
      <div className="flex flex-col gap-2 shrink-0">
        <div className="flex items-center justify-between gap-3">
          {/* Back to Menu */}
          <button
            onClick={() => setShowExitModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-2xs"
            title="Выйти в меню [Esc]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>В меню</span>
            <kbd className="hidden sm:inline px-1 bg-slate-100 rounded text-[10px] text-slate-400 font-mono">
              Esc
            </kbd>
          </button>

          {/* Adaptive Tier Badge or Streak */}
          <div className="flex items-center gap-2">
            {isAdaptiveMode && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 border border-amber-300 text-amber-950 font-black rounded-xl text-xs shadow-2xs">
                <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                <span>Сложность: {adaptiveTier} / 5</span>
              </div>
            )}

            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-100/90 border border-orange-200 text-orange-950 font-black rounded-xl text-xs shadow-2xs">
              <Flame className="w-4 h-4 text-orange-600 fill-orange-500 animate-pulse" />
              <span>Серия: {currentStreak}</span>
            </div>
          </div>

          {/* Optional Timer */}
          {isTimerActive && (
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 font-black rounded-xl text-xs border shadow-2xs transition-colors ${
                timeLeft <= 3
                  ? 'bg-rose-100 border-rose-300 text-rose-700 animate-bounce'
                  : 'bg-amber-100 border-amber-200 text-amber-900'
              }`}
            >
              <TimerIcon className="w-3.5 h-3.5 text-amber-600" />
              <span>{timeLeft} сек</span>
            </div>
          )}
        </div>

        {/* Progress Bar & Counter */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] font-bold text-slate-500">
            <span>
              {isAdaptiveMode
                ? `Решено примеров: ${currentProblemIndex + 1}`
                : `Пример ${Math.min(currentProblemIndex + 1, settings.sessionLength)} из ${settings.sessionLength}`}
            </span>
            <span>
              {isAdaptiveMode ? `Уровень счёта ${adaptiveTier}` : `${progressPercentage}%`}
            </span>
          </div>
          <div className="w-full bg-slate-200 h-2 sm:h-2.5 rounded-full overflow-hidden p-0.5">
            <div
              className="bg-linear-to-r from-amber-400 to-emerald-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Dynamic Tier Toast notification */}
        {tierToast && (
          <div className="bg-amber-500 text-white font-black text-xs px-3 py-1 rounded-xl text-center shadow-md animate-pop-in">
            {tierToast}
          </div>
        )}
      </div>

      {/* Center Math Problem Display (With Visual Imprint & Dynamic Reinforcement) */}
      <div className="my-auto py-2 flex flex-col items-center justify-center flex-1 min-h-0">
        <div
          className={`w-full max-w-2xl border-2 sm:border-3 rounded-3xl p-5 sm:p-7 text-center transition-all duration-300 relative ${
            feedback === 'correct'
              ? 'border-emerald-500 bg-linear-to-b from-emerald-50 via-teal-50 to-emerald-100/60 ring-8 ring-emerald-300/80 shadow-2xl scale-103'
              : feedback === 'wrong' || feedback === 'timeout'
              ? 'border-rose-500 bg-rose-50/60 ring-4 ring-rose-200 shadow-md animate-shake'
              : 'border-amber-300 bg-white shadow-lg'
          }`}
        >
          {/* Visual Memory Imprint Badge when correct */}
          {feedback === 'correct' && (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500 text-white font-black text-xs uppercase tracking-wider mb-2 shadow-md animate-pop-in">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Запомни этот образ: {currentProblem.expression} = {currentProblem.answer}</span>
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          )}

          {/* Retry notice */}
          {currentProblem.isRetry && feedback === 'idle' && (
            <div className="inline-flex items-center gap-1 text-[11px] font-black text-amber-800 bg-amber-100 px-3 py-0.5 rounded-full border border-amber-300 mb-2 animate-pop-in">
              <RotateCcw className="w-3 h-3" />
              <span>Повторение ошибки — закрепим результат!</span>
            </div>
          )}

          {/* Complete Equation Representation (memorized as a single visual truth) */}
          <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-4 text-4xl sm:text-6xl md:text-7xl font-black text-slate-900 tracking-wide select-none">
            <span
              className={
                feedback === 'correct'
                  ? 'text-emerald-950 transition-colors'
                  : 'text-slate-900'
              }
            >
              {currentProblem.expression}
            </span>
            <span
              className={
                feedback === 'correct' ? 'text-emerald-600 font-bold' : 'text-slate-400'
              }
            >
              =
            </span>

            {/* Answer slot */}
            <div
              className={`min-w-16 sm:min-w-24 h-16 sm:h-20 px-3 rounded-2xl flex items-center justify-center font-black transition-all duration-200 ${
                feedback === 'correct'
                  ? 'bg-emerald-500 text-white shadow-xl scale-110 ring-4 ring-emerald-300'
                  : feedback === 'wrong' || feedback === 'timeout'
                  ? 'bg-rose-500 text-white shadow-md'
                  : currentInput
                  ? 'bg-amber-100 border-2 border-amber-400 text-amber-950 shadow-inner'
                  : 'bg-slate-100 border-2 border-dashed border-slate-300 text-slate-400'
              }`}
            >
              {feedback === 'idle' ? (
                currentInput ? (
                  currentInput
                ) : (
                  <span className="text-slate-400 text-3xl animate-pulse">?</span>
                )
              ) : revealedAnswer !== null ? (
                revealedAnswer
              ) : (
                currentProblem.answer
              )}
            </div>
          </div>

          {/* Feedback Banner */}
          <div className="h-8 mt-3 flex items-center justify-center">
            {feedback === 'correct' && (
              <div className="flex items-center gap-2 text-emerald-800 font-black text-base sm:text-lg animate-pop-in">
                <Check className="w-6 h-6 stroke-[3] text-emerald-600" />
                <span>Отлично!</span>
                <span className="font-mono bg-white text-emerald-950 px-2.5 py-0.5 rounded-xl border border-emerald-300 shadow-2xs">
                  {currentProblem.expression} = {currentProblem.answer}
                </span>
                <span>🌟</span>
              </div>
            )}
            {(feedback === 'wrong' || feedback === 'timeout') && (
              <div className="flex items-center gap-1.5 text-rose-600 font-black text-sm sm:text-base animate-pop-in">
                <X className="w-5 h-5 stroke-[3]" />
                <span>
                  {feedback === 'timeout' ? 'Время вышло! ' : 'Ошибка! '}
                  Правильный ответ: <strong className="underline text-lg ml-1">{currentProblem.answer}</strong>
                </span>
              </div>
            )}
            {feedback === 'idle' && (
              <span className="text-xs text-slate-400 font-medium">
                Набирай цифры на клавиатуре и нажимай Enter
              </span>
            )}
          </div>

          {/* Ten-Frame visual aid for 2-term mistakes */}
          {(feedback === 'wrong' || feedback === 'timeout') &&
            currentProblem.operands.length === 2 &&
            currentProblem.operators.length === 1 &&
            (currentProblem.operators[0] === '+' || currentProblem.operators[0] === '−') && (
              <div className="mt-2 animate-pop-in">
                <TenFrame
                  a={currentProblem.operands[0]}
                  b={currentProblem.operands[1]}
                  operator={currentProblem.operators[0] === '+' ? '+' : '-'}
                  showAnswer={true}
                />
              </div>
            )}
        </div>
      </div>

      {/* Bottom Area: Visual options prompt for TEST mode, plus input controls */}
      <div className="shrink-0 pt-1 pb-1 space-y-2">
        {/* TEST MODE: 4 OPTIONS SHOWN AS NON-CLICKABLE VISUAL PROMPT FOR NASMOTRENNOST */}
        {settings.inputMode === 'test' && currentProblem.options && (
          <div className="max-w-xl mx-auto bg-slate-50/90 rounded-2xl p-2.5 border border-slate-200 text-center shadow-2xs">
            <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Варианты для насмотренности (набери ответ на клавиатуре ⌨️)</span>
            </div>
            <div className="grid grid-cols-4 gap-2 pointer-events-none select-none">
              {currentProblem.options.map((opt, idx) => {
                const isSelectedAndCorrect =
                  feedback === 'correct' && opt === currentProblem.answer;
                const isWrongSelected =
                  feedback === 'wrong' && opt === parseInt(currentInput, 10);

                let badgeStyle =
                  'bg-white text-slate-900 border border-slate-300 shadow-2xs';

                if (isSelectedAndCorrect) {
                  badgeStyle =
                    'bg-emerald-500 text-white border-emerald-600 font-black shadow-md scale-105 ring-2 ring-emerald-300';
                } else if (isWrongSelected) {
                  badgeStyle =
                    'bg-rose-500 text-white border-rose-600 font-black shadow-md';
                }

                return (
                  <div
                    key={idx}
                    className={`h-11 sm:h-12 rounded-xl flex items-center justify-center text-xl sm:text-2xl font-black transition-all cursor-default ${badgeStyle}`}
                  >
                    {opt}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action buttons: Backspace and Enter (Mouse click helper or keyboard) */}
        <div className="max-w-md mx-auto flex items-center gap-2">
          <button
            onClick={() => {
              soundManager.playKeyTap();
              setCurrentInput((prev) => prev.slice(0, -1));
            }}
            disabled={feedback !== 'idle' || !currentInput}
            className="btn-tactile flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 disabled:opacity-40 text-slate-700 font-black text-xs sm:text-sm rounded-xl border border-slate-300 flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <span>⌫ Стереть</span>
            <kbd className="hidden sm:inline px-1.5 py-0.5 bg-white rounded text-[10px] font-mono text-slate-500">
              Backspace
            </kbd>
          </button>

          <button
            onClick={() => {
              if (currentInput.trim()) {
                const parsed = parseInt(currentInput, 10);
                if (!isNaN(parsed)) submitAnswer(parsed);
              }
            }}
            disabled={feedback !== 'idle' || !currentInput}
            className="btn-tactile flex-1 py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 disabled:opacity-40 text-white font-black text-xs sm:text-sm rounded-xl border border-emerald-600 flex items-center justify-center gap-2 shadow-md"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Ответить</span>
            <kbd className="hidden sm:inline px-1.5 py-0.5 bg-emerald-600 rounded text-[10px] font-mono text-emerald-100">
              Enter
            </kbd>
          </button>
        </div>

        <div className="text-[11px] text-slate-400 font-medium text-center">
          Клавиатура: цифры <kbd className="font-mono font-bold text-slate-600">0–9</kbd>, стереть{' '}
          <kbd className="font-mono font-bold text-slate-600">Backspace</kbd>, подтвердить{' '}
          <kbd className="font-mono font-bold text-slate-600">Enter</kbd>
        </div>
      </div>

      {/* PERIODIC REST MODAL (Adaptive mode - 1-2 words large text, child decides) */}
      {showRestModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-pop-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl border-3 border-amber-400">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-100 text-amber-800 flex items-center justify-center text-4xl mb-3 shadow-inner">
              ☕
            </div>

            {/* 1-2 words large so child can easily read and decide */}
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
              ОТДОХНИ! 🌈
            </h2>
            <p className="text-sm font-semibold text-slate-600 mb-6">
              Глазки устали? Потянись, сделай глоток воды и реши:
            </p>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => {
                  soundManager.playKeyTap();
                  setShowRestModal(false);
                  setTimeLeft(settings.timerSeconds);
                }}
                className="btn-tactile w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-black text-base rounded-2xl shadow-md border-2 border-emerald-600 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Хочу ещё считать! 🚀</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playKeyTap();
                  setShowRestModal(false);
                  finishSession();
                }}
                className="btn-tactile w-full py-3 bg-slate-100 hover:bg-amber-100 text-slate-800 font-bold text-sm rounded-2xl border border-slate-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Закончить и забрать призы 🎁</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Safety Exit Modal */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl border-2 border-amber-300 animate-pop-in">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-2xl mb-2.5 shadow-inner">
              🤔
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-1">Выйти из тренировки?</h3>
            <p className="text-xs text-slate-600 mb-5">
              Текущий прогресс этой сессии не будет сохранён. Точно хочешь прервать?
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={() => setShowExitModal(false)}
                className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-amber-950 font-black text-xs rounded-xl shadow-2xs transition-colors"
              >
                Продолжить счёт
              </button>
              <button
                onClick={onExit}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
