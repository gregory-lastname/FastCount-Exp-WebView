import React from 'react';
import { Sparkles, ArrowRight, Lightbulb } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface NumberHouseProps {
  target: number;
  knownPart: number;
  missingPosition: 'left' | 'right';
  currentInput: string;
  feedback: 'idle' | 'correct' | 'wrong' | 'timeout';
  correctAnswer: number;
  revealedAnswer?: number | null;
  showAppleAid?: boolean;
  showStepExplanation?: boolean;
  onNext?: () => void;
}

export function NumberHouse({
  target,
  knownPart,
  missingPosition,
  currentInput,
  feedback,
  correctAnswer,
  revealedAnswer = null,
  showAppleAid = false,
  showStepExplanation = false,
  onNext,
}: NumberHouseProps) {
  const isLeftMissing = missingPosition === 'left';
  const isSolved = feedback === 'correct';
  const isError = (feedback === 'wrong' || feedback === 'timeout') && !showStepExplanation;
  const isHighlightedAnswer = showStepExplanation;

  // Value displayed in the missing window:
  const missingValue = isSolved || isHighlightedAnswer || revealedAnswer !== null
    ? correctAnswer
    : currentInput || '?';

  const leftValue = isLeftMissing ? missingValue : knownPart;
  const rightValue = !isLeftMissing ? missingValue : knownPart;

  const leftIsMissing = isLeftMissing;
  const rightIsMissing = !isLeftMissing;

  const leftCount = leftIsMissing ? correctAnswer : knownPart;
  const rightCount = rightIsMissing ? correctAnswer : knownPart;

  // Helper to choose responsive emoji size so all apples are 100% visible with zero scrollbar
  const getAppleGridStyle = (count: number) => {
    if (count <= 4) {
      return {
        gridCols: 'grid-cols-2',
        textSize: 'text-2xl sm:text-3xl',
      };
    }
    if (count <= 6) {
      return {
        gridCols: 'grid-cols-3',
        textSize: 'text-xl sm:text-2xl',
      };
    }
    if (count <= 10) {
      return {
        gridCols: 'grid-cols-3 sm:grid-cols-4',
        textSize: 'text-lg sm:text-xl',
      };
    }
    return {
      gridCols: 'grid-cols-4 sm:grid-cols-5',
      textSize: 'text-base sm:text-lg',
    };
  };

  const leftStyle = getAppleGridStyle(leftCount);
  const rightStyle = getAppleGridStyle(rightCount);

  return (
    <div className="flex flex-col items-center select-none w-full max-w-2xl mx-auto">
      {/* Horizontal row with Flanking Apples on the left and right.
          No scrollbars anywhere - all apples visible at once! */}
      <div className="flex items-end justify-center gap-2 sm:gap-4 w-full">
        {/* LEFT FLANKING APPLE COLUMN (corresponds to left window) */}
        <div
          className={`w-28 sm:w-32 min-h-[190px] shrink-0 flex flex-col items-center justify-end pb-2 transition-opacity duration-300 ${
            showAppleAid ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          aria-hidden={!showAppleAid}
        >
          <div
            className={`w-full p-2 rounded-2xl border-2 flex flex-col items-center gap-1 shadow-xs ${
              leftIsMissing
                ? 'bg-amber-50/95 border-amber-300 ring-2 ring-amber-200/80'
                : 'bg-orange-50/95 border-orange-300'
            }`}
          >
            <span
              className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                leftIsMissing
                  ? 'bg-amber-200 text-amber-950 animate-pulse'
                  : 'bg-orange-200 text-orange-950'
              }`}
            >
              {leftIsMissing ? `Ищем ? 🍎 (Помощь)` : `${knownPart} 🍊`}
            </span>

            {/* All apples/oranges visible simultaneously without any scrollbar */}
            <div className={`grid ${leftStyle.gridCols} gap-0.5 sm:gap-1 items-center justify-center p-1 w-full text-center`}>
              {Array.from({ length: leftCount }).map((_, i) => (
                <span
                  key={i}
                  className={`${leftStyle.textSize} leading-none select-none inline-block ${
                    leftIsMissing ? 'animate-pulse' : ''
                  }`}
                  title={leftIsMissing ? 'Красное яблоко' : 'Спелый апельсин'}
                >
                  {leftIsMissing ? '🍎' : '🍊'}
                </span>
              ))}
            </div>

            <span className="text-[10px] font-bold text-slate-500">
              {leftIsMissing ? `Яблочки (${correctAnswer})` : `Апельсины (${knownPart})`}
            </span>
          </div>
        </div>

        {/* CENTER: NUMBER HOUSE */}
        <div className="relative w-72 sm:w-84 shrink-0 flex flex-col items-center">
          {/* TALL GABLE ROOF WITH SVG SHAPE */}
          <div className="relative z-10 w-full h-36 sm:h-40 flex items-center justify-center">
            {/* Triangular roof */}
            <svg
              viewBox="0 0 384 190"
              className="absolute inset-0 w-full h-full filter drop-shadow-xl"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polygon
                points="192,6 380,188 4,188"
                className={`transition-colors duration-300 stroke-2 ${
                  isSolved
                    ? 'fill-emerald-600 stroke-emerald-700'
                    : isHighlightedAnswer
                    ? 'fill-amber-600 stroke-amber-700'
                    : isError
                    ? 'fill-amber-500 stroke-amber-600'
                    : 'fill-amber-500 stroke-amber-600'
                }`}
              />
            </svg>

            {/* Target Number Circle Placed Centrally in the Roof */}
            <div className="relative z-20 flex items-center justify-center mt-6 sm:mt-7">
              <div
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white border-4 sm:border-5 shadow-2xl flex items-center justify-center ring-6 transition-all ${
                  isSolved
                    ? 'border-emerald-500 ring-emerald-300'
                    : isHighlightedAnswer
                    ? 'border-amber-500 ring-amber-300'
                    : isError
                    ? 'border-amber-400 ring-amber-200/90 animate-shake'
                    : 'border-amber-400 ring-amber-200/90'
                }`}
              >
                <span className="text-4xl sm:text-5xl font-black text-slate-900 font-mono tracking-tight drop-shadow-xs">
                  {target}
                </span>
              </div>
            </div>
          </div>

          {/* HOUSE BODY (WALLS) */}
          <div
            className={`w-full -mt-0.5 rounded-b-3xl border-3 sm:border-4 px-4 sm:px-6 py-4 sm:py-5 transition-all duration-300 relative z-10 shadow-2xl ${
              isSolved
                ? 'bg-linear-to-b from-emerald-50 to-teal-50 border-emerald-500 ring-4 ring-emerald-300/80'
                : isHighlightedAnswer
                ? 'bg-linear-to-b from-amber-50 via-white to-emerald-50 border-amber-500 ring-4 ring-amber-300'
                : isError
                ? 'bg-amber-50/90 border-amber-400 animate-shake'
                : 'bg-linear-to-b from-amber-50 via-white to-orange-50/70 border-amber-400'
            }`}
          >
            {/* Two Component Windows with clear plus sign between them */}
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              {/* Left Window */}
              <div className="flex-1 flex flex-col items-center">
                <div
                  className={`w-full h-20 sm:h-24 rounded-2xl border-3 flex flex-col items-center justify-center text-3xl sm:text-4xl font-black font-mono transition-all shadow-inner relative ${
                    !leftIsMissing
                      ? 'bg-white border-amber-300 text-slate-800 shadow-xs'
                      : isSolved
                      ? 'bg-emerald-500 border-emerald-600 text-white ring-4 ring-emerald-300 scale-105 shadow-md'
                      : isHighlightedAnswer
                      ? 'bg-emerald-500 border-emerald-600 text-white ring-4 ring-amber-300 scale-105 shadow-lg'
                      : isError
                      ? 'bg-amber-100 border-amber-400 text-amber-950 ring-2 ring-amber-300'
                      : currentInput
                      ? 'bg-amber-100 border-amber-400 text-amber-950 ring-2 ring-amber-300'
                      : 'bg-white border-dashed border-slate-300 text-slate-400'
                  }`}
                >
                  <span>{leftValue}</span>
                  {isHighlightedAnswer && leftIsMissing && (
                    <span className="text-[10px] font-black uppercase tracking-wider bg-amber-300 text-amber-950 px-2 py-0.2 rounded-full absolute -top-2.5 shadow-xs">
                      Ответ
                    </span>
                  )}
                </div>
              </div>

              {/* Middle plus sign */}
              <div className="shrink-0 flex items-center justify-center px-1">
                <span className="text-3xl sm:text-4xl font-black text-amber-700 select-none">
                  +
                </span>
              </div>

              {/* Right Window */}
              <div className="flex-1 flex flex-col items-center">
                <div
                  className={`w-full h-20 sm:h-24 rounded-2xl border-3 flex flex-col items-center justify-center text-3xl sm:text-4xl font-black font-mono transition-all shadow-inner relative ${
                    !rightIsMissing
                      ? 'bg-white border-amber-300 text-slate-800 shadow-xs'
                      : isSolved
                      ? 'bg-emerald-500 border-emerald-600 text-white ring-4 ring-emerald-300 scale-105 shadow-md'
                      : isHighlightedAnswer
                      ? 'bg-emerald-500 border-emerald-600 text-white ring-4 ring-amber-300 scale-105 shadow-lg'
                      : isError
                      ? 'bg-amber-100 border-amber-400 text-amber-950 ring-2 ring-amber-300'
                      : currentInput
                      ? 'bg-amber-100 border-amber-400 text-amber-950 ring-2 ring-amber-300'
                      : 'bg-white border-dashed border-slate-300 text-slate-400'
                  }`}
                >
                  <span>{rightValue}</span>
                  {isHighlightedAnswer && rightIsMissing && (
                    <span className="text-[10px] font-black uppercase tracking-wider bg-amber-300 text-amber-950 px-2 py-0.2 rounded-full absolute -top-2.5 shadow-xs">
                      Ответ
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT FLANKING APPLE COLUMN (corresponds to right window) */}
        <div
          className={`w-28 sm:w-32 min-h-[190px] shrink-0 flex flex-col items-center justify-end pb-2 transition-opacity duration-300 ${
            showAppleAid ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          aria-hidden={!showAppleAid}
        >
          <div
            className={`w-full p-2 rounded-2xl border-2 flex flex-col items-center gap-1 shadow-xs ${
              rightIsMissing
                ? 'bg-amber-50/95 border-amber-300 ring-2 ring-amber-200/80'
                : 'bg-orange-50/95 border-orange-300'
            }`}
          >
            <span
              className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                rightIsMissing
                  ? 'bg-amber-200 text-amber-950 animate-pulse'
                  : 'bg-orange-200 text-orange-950'
              }`}
            >
              {rightIsMissing ? `Ищем ? 🍎 (Помощь)` : `${knownPart} 🍊`}
            </span>

            {/* All apples/oranges visible simultaneously without any scrollbar */}
            <div className={`grid ${rightStyle.gridCols} gap-0.5 sm:gap-1 items-center justify-center p-1 w-full text-center`}>
              {Array.from({ length: rightCount }).map((_, i) => (
                <span
                  key={i}
                  className={`${rightStyle.textSize} leading-none select-none inline-block ${
                    rightIsMissing ? 'animate-pulse' : ''
                  }`}
                  title={rightIsMissing ? 'Красное яблоко' : 'Спелый апельсин'}
                >
                  {rightIsMissing ? '🍎' : '🍊'}
                </span>
              ))}
            </div>

            <span className="text-[10px] font-bold text-slate-500">
              {rightIsMissing ? `Яблочки (${correctAnswer})` : `Апельсины (${knownPart})`}
            </span>
          </div>
        </div>
      </div>

      {/* Step-by-step illuminated explanation after apples:
          "разбор правильного ответа задержать до нажатия на кнопку Понятно" */}
      {showStepExplanation && (
        <div className="mt-2.5 w-full max-w-md bg-linear-to-b from-amber-50 to-orange-50 rounded-2xl p-3 sm:p-4 border-2 border-amber-400 shadow-lg animate-pop-in space-y-2.5">
          <div className="flex items-center justify-between border-b border-amber-200 pb-1.5">
            <div className="flex items-center gap-1.5 text-xs font-black text-amber-950 uppercase tracking-wide">
              <Sparkles className="w-4 h-4 text-amber-600 fill-amber-400" />
              <span>Пошаговый разбор состава числа {target}</span>
            </div>
            <span className="text-[10px] font-black text-amber-900 bg-amber-200 px-2 py-0.5 rounded-md">
              Запомни
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-white p-2 rounded-xl border-2 border-orange-300 shadow-2xs">
              <span className="text-[11px] font-bold text-orange-800 block mb-0.5">
                Шаг 1. Известно:
              </span>
              <div className="text-xl sm:text-2xl font-black font-mono text-orange-950 flex items-center justify-center gap-1">
                <span>{knownPart}</span>
                <span className="text-base">🍊</span>
              </div>
            </div>

            <div className="bg-white p-2 rounded-xl border-2 border-emerald-400 shadow-2xs ring-2 ring-emerald-200">
              <span className="text-[11px] font-bold text-emerald-800 block mb-0.5">
                Шаг 2. Не хватает до {target}:
              </span>
              <div className="text-xl sm:text-2xl font-black font-mono text-emerald-700 flex items-center justify-center gap-1 underline decoration-2">
                <span>{correctAnswer}</span>
                <span className="text-base">🍎</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 bg-white py-2 px-3 rounded-xl border-2 border-amber-300 font-mono text-base font-black text-slate-900 shadow-xs">
            <span>{knownPart}</span>
            <span className="text-amber-600">+</span>
            <span className="text-white bg-emerald-500 px-3 py-0.5 rounded-lg border border-emerald-600 shadow-xs ring-2 ring-emerald-300">
              {correctAnswer}
            </span>
            <span className="text-slate-400">=</span>
            <span className="text-slate-900 text-lg font-extrabold">{target}</span>
          </div>

          {/* Button "Понятно, дальше" - holds screen until user clicks or presses Enter/Space */}
          <button
            onClick={() => {
              soundManager.playKeyTap();
              onNext?.();
            }}
            className="btn-tactile w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-black text-xs sm:text-sm shadow-md border-2 border-emerald-600 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <span>Понятно, дальше</span>
            <ArrowRight className="w-4 h-4" />
            <kbd className="hidden sm:inline px-1.5 py-0.5 bg-emerald-700/60 rounded text-[10px] font-mono text-emerald-100">
              Enter / Пробел
            </kbd>
          </button>
        </div>
      )}

      {/* Equation imprint or guidance banner */}
      <div className="h-9 mt-2 flex items-center justify-center text-center">
        {isSolved ? (
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-950 font-black px-4 py-1.5 rounded-full border border-emerald-300 text-sm shadow-xs animate-pop-in">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>
              {target} = {knownPart} + {correctAnswer}!
            </span>
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </div>
        ) : showStepExplanation ? (
          <div className="inline-flex items-center gap-1.5 text-xs text-amber-950 font-black bg-amber-100 px-3 py-1 rounded-full border border-amber-300 animate-pop-in">
            <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
            <span>Нажми кнопку «Понятно, дальше» или клавишу Enter, чтобы перейти к следующему заданию</span>
          </div>
        ) : showAppleAid ? (
          <div className="inline-flex items-center gap-1.5 text-xs text-amber-950 font-bold bg-amber-100/90 px-3 py-1 rounded-full border border-amber-300 animate-pop-in">
            <span>🍊 Известно {knownPart}. Посчитай яблочки 🍎 (сколько нужно добавить до {target}?), набери число и нажми Enter</span>
          </div>
        ) : (
          <span className="text-xs text-slate-400 font-bold">
            Набирай пропущенное число на клавиатуре и нажимай Enter
          </span>
        )}
      </div>
    </div>
  );
}
