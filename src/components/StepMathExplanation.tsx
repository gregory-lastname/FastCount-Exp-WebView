import React from 'react';
import { ArrowRight, Lightbulb, Sparkles } from 'lucide-react';
import { MathProblem } from '../types/math';
import { soundManager } from '../utils/audio';

interface StepMathExplanationProps {
  problem: MathProblem;
  onNext?: () => void;
}

export function StepMathExplanation({ problem, onNext }: StepMathExplanationProps) {
  const { operands, operators, answer } = problem;

  const renderNextButton = () => (
    <button
      onClick={() => {
        soundManager.playKeyTap();
        onNext?.();
      }}
      className="btn-tactile w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-black text-xs sm:text-sm shadow-md border-2 border-emerald-600 flex items-center justify-center gap-2 cursor-pointer transition-all mt-2"
    >
      <span>Понятно, дальше</span>
      <ArrowRight className="w-4 h-4" />
      <kbd className="hidden sm:inline px-1.5 py-0.5 bg-emerald-700/60 rounded text-[10px] font-mono text-emerald-100">
        Enter / Пробел
      </kbd>
    </button>
  );

  // 1. ADDITION BRIDGING 10 (e.g. 8 + 5: 8 + 2 = 10, 10 + 3 = 13)
  if (
    operands.length === 2 &&
    operators.length === 1 &&
    operators[0] === '+' &&
    operands[0] < 10 &&
    operands[1] < 10 &&
    answer > 10
  ) {
    const a = operands[0];
    const b = operands[1];
    const toTen = 10 - a;
    const remainder = b - toTen;

    return (
      <div className="w-full bg-linear-to-b from-amber-50/90 to-orange-50/90 rounded-2xl p-3 sm:p-4 border-2 border-amber-300 shadow-md animate-pop-in space-y-2.5">
        <div className="flex items-center justify-between gap-2 border-b border-amber-200 pb-1.5">
          <div className="flex items-center gap-1.5 text-xs font-black text-amber-950 uppercase tracking-wide">
            <Lightbulb className="w-4 h-4 text-amber-600 fill-amber-400" />
            <span>Пошаговое объяснение · Счёт через десяток</span>
          </div>
          <span className="text-[11px] font-bold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-lg font-mono">
            {b} = {toTen} + {remainder}
          </span>
        </div>

        {/* Step-by-step breakdown container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-center">
          {/* Step 1: Дополняем до 10 */}
          <div className="bg-white rounded-xl p-2.5 border-2 border-sky-300 shadow-xs flex flex-col items-center justify-between">
            <span className="text-[11px] font-bold text-sky-800 mb-1">
              Шаг 1. Дополняем {a} до 10:
            </span>
            <div className="text-xl sm:text-2xl font-black font-mono text-sky-950 bg-sky-50 px-3 py-1 rounded-lg border border-sky-200">
              <span className="text-slate-900">{a}</span> +{' '}
              <span className="text-sky-600 underline decoration-2">{toTen}</span> ={' '}
              <span className="text-sky-700 font-extrabold">10</span>
            </div>
          </div>

          {/* Step 2: Прибавляем остаток */}
          <div className="bg-white rounded-xl p-2.5 border-2 border-emerald-300 shadow-xs flex flex-col items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-800 mb-1">
              Шаг 2. Прибавляем остаток {remainder}:
            </span>
            <div className="text-xl sm:text-2xl font-black font-mono text-emerald-950 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
              <span className="text-sky-700">10</span> +{' '}
              <span className="text-emerald-600 underline decoration-2">{remainder}</span> ={' '}
              <span className="text-emerald-700 font-extrabold">{answer}</span>
            </div>
          </div>
        </div>

        {/* Complete summary line */}
        <div className="flex items-center justify-center gap-2 bg-amber-200/70 py-1.5 px-3 rounded-xl border border-amber-300 text-xs sm:text-sm font-black text-amber-950 font-mono">
          <span>{a} + {b}</span>
          <ArrowRight className="w-3.5 h-3.5 text-amber-700" />
          <span>{a} + {toTen} + {remainder}</span>
          <ArrowRight className="w-3.5 h-3.5 text-amber-700" />
          <span className="text-emerald-800 bg-white px-2 py-0.5 rounded-md border border-emerald-300 shadow-2xs">
            {answer}
          </span>
        </div>

        {renderNextButton()}
      </div>
    );
  }

  // 2. SUBTRACTION BRIDGING 10 (e.g. 13 - 5: 13 - 3 = 10, 10 - 2 = 8)
  if (
    operands.length === 2 &&
    operators.length === 1 &&
    operators[0] === '−' &&
    operands[0] > 10 &&
    operands[0] < 20 &&
    operands[1] < 10
  ) {
    const a = operands[0];
    const b = operands[1];
    const toTen = a - 10;
    const remainder = b - toTen;

    return (
      <div className="w-full bg-linear-to-b from-sky-50/90 to-blue-50/90 rounded-2xl p-3 sm:p-4 border-2 border-sky-300 shadow-md animate-pop-in space-y-2.5">
        <div className="flex items-center justify-between gap-2 border-b border-sky-200 pb-1.5">
          <div className="flex items-center gap-1.5 text-xs font-black text-sky-950 uppercase tracking-wide">
            <Lightbulb className="w-4 h-4 text-sky-600 fill-sky-400" />
            <span>Пошаговое объяснение · Вычитание по частям</span>
          </div>
          <span className="text-[11px] font-bold text-sky-800 bg-sky-200/80 px-2 py-0.5 rounded-lg font-mono">
            {b} = {toTen} + {remainder}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-center">
          {/* Step 1: Вычитаем до 10 */}
          <div className="bg-white rounded-xl p-2.5 border-2 border-amber-300 shadow-xs flex flex-col items-center justify-between">
            <span className="text-[11px] font-bold text-amber-800 mb-1">
              Шаг 1. Вычитаем до круглого 10:
            </span>
            <div className="text-xl sm:text-2xl font-black font-mono text-amber-950 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200">
              <span className="text-slate-900">{a}</span> −{' '}
              <span className="text-amber-600 underline decoration-2">{toTen}</span> ={' '}
              <span className="text-amber-700 font-extrabold">10</span>
            </div>
          </div>

          {/* Step 2: Вычитаем остаток из 10 */}
          <div className="bg-white rounded-xl p-2.5 border-2 border-emerald-300 shadow-xs flex flex-col items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-800 mb-1">
              Шаг 2. Вычитаем остаток {remainder} из 10:
            </span>
            <div className="text-xl sm:text-2xl font-black font-mono text-emerald-950 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
              <span className="text-amber-700">10</span> −{' '}
              <span className="text-emerald-600 underline decoration-2">{remainder}</span> ={' '}
              <span className="text-emerald-700 font-extrabold">{answer}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 bg-sky-200/70 py-1.5 px-3 rounded-xl border border-sky-300 text-xs sm:text-sm font-black text-sky-950 font-mono">
          <span>{a} − {b}</span>
          <ArrowRight className="w-3.5 h-3.5 text-sky-700" />
          <span>{a} − {toTen} − {remainder}</span>
          <ArrowRight className="w-3.5 h-3.5 text-sky-700" />
          <span className="text-emerald-800 bg-white px-2 py-0.5 rounded-md border border-emerald-300 shadow-2xs">
            {answer}
          </span>
        </div>

        {renderNextButton()}
      </div>
    );
  }

  // 3. THREE TERMS (e.g. 6 + 4 - 3 = 7)
  if (operands.length === 3 && operators.length === 2) {
    const [a, b, c] = operands;
    const [op1, op2] = operators;
    const intermediate = op1 === '+' ? a + b : a - b;

    return (
      <div className="w-full bg-linear-to-b from-indigo-50/90 to-purple-50/90 rounded-2xl p-3 sm:p-4 border-2 border-indigo-300 shadow-md animate-pop-in space-y-2.5">
        <div className="flex items-center justify-between gap-2 border-b border-indigo-200 pb-1.5">
          <div className="flex items-center gap-1.5 text-xs font-black text-indigo-950 uppercase tracking-wide">
            <Lightbulb className="w-4 h-4 text-indigo-600 fill-indigo-400" />
            <span>Пошаговый порядок действий</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-center">
          <div className="bg-white rounded-xl p-2.5 border-2 border-indigo-200 shadow-xs flex flex-col items-center justify-between">
            <span className="text-[11px] font-bold text-indigo-800 mb-1">
              Действие 1 ({op1}):
            </span>
            <div className="text-xl sm:text-2xl font-black font-mono text-indigo-950 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-200">
              {a} {op1} {b} = <span className="text-indigo-600 underline decoration-2">{intermediate}</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-2.5 border-2 border-emerald-300 shadow-xs flex flex-col items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-800 mb-1">
              Действие 2 ({op2}):
            </span>
            <div className="text-xl sm:text-2xl font-black font-mono text-emerald-950 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
              <span className="text-indigo-600">{intermediate}</span> {op2} {c} = <span className="text-emerald-700 font-extrabold">{answer}</span>
            </div>
          </div>
        </div>

        {renderNextButton()}
      </div>
    );
  }

  // 4. MULTIPLICATION (e.g. 4 × 3 = 4 + 4 + 4 = 12)
  if (operands.length === 2 && operators.length === 1 && operators[0] === '×') {
    const [a, b] = operands;
    const repeated = Array.from({ length: Math.min(b, 6) }, () => a).join(' + ');

    return (
      <div className="w-full bg-linear-to-b from-emerald-50/90 to-teal-50/90 rounded-2xl p-3 sm:p-4 border-2 border-emerald-300 shadow-md animate-pop-in space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-black text-emerald-950 uppercase tracking-wide border-b border-emerald-200 pb-1.5">
          <Lightbulb className="w-4 h-4 text-emerald-600 fill-emerald-400" />
          <span>Умножение — это сложение одинаковых слагаемых</span>
        </div>
        <div className="text-center font-mono bg-white p-2.5 rounded-xl border border-emerald-200 text-sm sm:text-base font-black text-emerald-950">
          <span>{a} × {b}</span> = <span>{repeated}</span> = <strong className="text-emerald-600 text-lg sm:text-xl">{answer}</strong>
        </div>
        {renderNextButton()}
      </div>
    );
  }

  // 5. DIVISION (e.g. 15 : 3 = 5, т.к. 5 × 3 = 15)
  if (operands.length === 2 && operators.length === 1 && operators[0] === ':') {
    const [dividend, divisor] = operands;

    return (
      <div className="w-full bg-linear-to-b from-teal-50/90 to-cyan-50/90 rounded-2xl p-3 sm:p-4 border-2 border-teal-300 shadow-md animate-pop-in space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-black text-teal-950 uppercase tracking-wide border-b border-teal-200 pb-1.5">
          <Lightbulb className="w-4 h-4 text-teal-600 fill-teal-400" />
          <span>Деление проверяем умножением</span>
        </div>
        <div className="text-center font-mono bg-white p-2.5 rounded-xl border border-teal-200 text-sm sm:text-base font-black text-teal-950">
          <span>{dividend} : {divisor} = <strong className="text-teal-700 text-lg sm:text-xl">{answer}</strong></span>
          <span className="text-xs text-slate-500 font-sans block mt-1">
            (потому что {answer} × {divisor} = {dividend})
          </span>
        </div>
        {renderNextButton()}
      </div>
    );
  }

  // 6. DEFAULT SINGLE STEP ARITHMETIC (e.g. 4 + 3 = 7, 8 - 3 = 5)
  return (
    <div className="w-full bg-linear-to-b from-amber-50 to-orange-50 rounded-2xl p-3 border-2 border-amber-300 shadow-sm animate-pop-in text-center space-y-2">
      <div className="flex items-center justify-center gap-1.5 text-xs font-black text-amber-900 uppercase">
        <Sparkles className="w-4 h-4 text-amber-600" />
        <span>Запомни правильный результат:</span>
      </div>
      <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-800 bg-white py-1.5 px-4 rounded-xl inline-block border border-emerald-300 shadow-xs">
        {problem.expression} = {answer}
      </div>
      {renderNextButton()}
    </div>
  );
}
