import React, { useState } from 'react';
import { Lightbulb, Keyboard, X, Sparkles, Gift } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  const [activeTab, setActiveTab] = useState<'guide' | 'shortcuts' | 'prizes'>('guide');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border-3 border-sky-300 overflow-hidden animate-pop-in">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-sky-100 bg-sky-50/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-sky-500 text-white flex items-center justify-center text-xl shadow-xs">
              📖
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 leading-tight">
                Памятка родителям и ученику
              </h3>
              <p className="text-xs text-slate-500 font-semibold">
                Как тренироваться эффективно и горячие клавиши ПК
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playKeyTap();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-slate-200 px-4 pt-2.5 gap-2 bg-slate-50/50">
          <button
            onClick={() => {
              soundManager.playKeyTap();
              setActiveTab('guide');
            }}
            className={`pb-2 px-3 text-xs font-black border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'guide'
                ? 'border-sky-500 text-sky-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Методика счёта</span>
          </button>

          <button
            onClick={() => {
              soundManager.playKeyTap();
              setActiveTab('shortcuts');
            }}
            className={`pb-2 px-3 text-xs font-black border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'shortcuts'
                ? 'border-sky-500 text-sky-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>Клавиши (ПК)</span>
          </button>

          <button
            onClick={() => {
              soundManager.playKeyTap();
              setActiveTab('prizes');
            }}
            className={`pb-2 px-3 text-xs font-black border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'prizes'
                ? 'border-sky-500 text-sky-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Gift className="w-3.5 h-3.5" />
            <span>Призы и питомцы</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-slate-700 text-xs sm:text-sm">
          {activeTab === 'guide' && (
            <div className="space-y-3">
              <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl">
                <h4 className="font-black text-amber-900 text-sm mb-1">
                  🎯 Главная цель во 2 классе:
                </h4>
                <p className="text-xs text-amber-950/80 leading-relaxed">
                  Довести сложение, вычитание, цепочки из 3 чисел и базовое умножение/деление до автоматизма.
                  Ребёнок учится мгновенно оперировать составом чисел (7 — это 3 и 4, 10 — это 7 и 3, 2 × 4 = 8).
                </p>
              </div>

              <div className="space-y-1.5">
                <h5 className="font-black text-slate-900 text-xs uppercase tracking-wider">
                  Рекомендации:
                </h5>
                <ul className="space-y-1.5 text-xs list-disc pl-4 text-slate-600">
                  <li>
                    <strong className="text-slate-800">5–10 минут в день:</strong> Короткие регулярные
                    сессии по 10–20 примеров приносят наибольший эффект без усталости.
                  </li>
                  <li>
                    <strong className="text-slate-800">Режим «Тест»:</strong> Если ребёнок только начинает знакомиться с умножением или цепочками, тест из 4 вариантов развивает насмотренность.
                  </li>
                  <li>
                    <strong className="text-slate-800">Ввод с клавиатуры:</strong> Развивает моторику и концентрацию, идеален для работы за компьютером.
                  </li>
                  <li>
                    <strong className="text-slate-800">Работа над ошибками:</strong> Ошибочные примеры автоматически повторяются в конце сессии, пока ответ не закрепится.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'shortcuts' && (
            <div className="space-y-2.5">
              <p className="text-xs text-slate-600">
                Тренажёр спроектирован для быстрого управления с физической клавиатуры ПК без лишних кликов мышью:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="font-black text-slate-900 text-xs mb-0.5 flex items-center gap-1.5">
                    <kbd className="px-1.5 py-0.5 bg-white rounded border border-slate-300 font-mono text-[11px]">0–9</kbd>
                    <span>Цифры ответа</span>
                  </div>
                  <div className="text-[11px] text-slate-500">Прямой ввод ответа в поле</div>
                </div>

                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="font-black text-slate-900 text-xs mb-0.5 flex items-center gap-1.5">
                    <kbd className="px-1.5 py-0.5 bg-white rounded border border-slate-300 font-mono text-[11px]">Enter</kbd>
                    <span>Ответить</span>
                  </div>
                  <div className="text-[11px] text-slate-500">Подтвердить введённый результат</div>
                </div>

                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="font-black text-slate-900 text-xs mb-0.5 flex items-center gap-1.5">
                    <kbd className="px-1.5 py-0.5 bg-white rounded border border-slate-300 font-mono text-[11px]">1–4</kbd>
                    <span>Выбор в тесте</span>
                  </div>
                  <div className="text-[11px] text-slate-500">Выбор одного из 4 вариантов ответа</div>
                </div>

                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="font-black text-slate-900 text-xs mb-0.5 flex items-center gap-1.5">
                    <kbd className="px-1.5 py-0.5 bg-white rounded border border-slate-300 font-mono text-[11px]">Backspace</kbd>
                    <span>Стереть</span>
                  </div>
                  <div className="text-[11px] text-slate-500">Удалить последнюю цифру</div>
                </div>

                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="font-black text-slate-900 text-xs mb-0.5 flex items-center gap-1.5">
                    <kbd className="px-1.5 py-0.5 bg-white rounded border border-slate-300 font-mono text-[11px]">Пробел</kbd>
                    <span>Старт / Ещё раз</span>
                  </div>
                  <div className="text-[11px] text-slate-500">Быстрый запуск из меню или результатов</div>
                </div>

                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="font-black text-slate-900 text-xs mb-0.5 flex items-center gap-1.5">
                    <kbd className="px-1.5 py-0.5 bg-white rounded border border-slate-300 font-mono text-[11px]">Esc</kbd>
                    <span>Выход в меню</span>
                  </div>
                  <div className="text-[11px] text-slate-500">Вернуться на главный экран</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'prizes' && (
            <div className="space-y-3">
              <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl">
                <h4 className="font-black text-amber-900 text-sm mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  Коллекция из 16 питомцев:
                </h4>
                <p className="text-xs text-amber-950/80 leading-relaxed">
                  После каждой сессии открывается призовой сундук. За высокое качество счёта выпадают редкие, эпические и легендарные питомцы.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-xl">
                  <span className="font-black text-amber-900">👑 5 звёзд:</span>
                  <p className="text-[11px] text-slate-600 mt-0.5">Шанс открыть легендарного дракона или феникса</p>
                </div>
                <div className="p-2.5 bg-purple-50 border border-purple-300 rounded-xl">
                  <span className="font-black text-purple-900">💜 4 звезды:</span>
                  <p className="text-[11px] text-slate-600 mt-0.5">Эпические кибер-коты, панды и роботы</p>
                </div>
                <div className="p-2.5 bg-sky-50 border border-sky-300 rounded-xl">
                  <span className="font-black text-sky-900">💙 3 звезды:</span>
                  <p className="text-[11px] text-slate-600 mt-0.5">Редкие лисички, совята и пингвины</p>
                </div>
                <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl">
                  <span className="font-black text-emerald-900">💚 1–2 звезды:</span>
                  <p className="text-[11px] text-slate-600 mt-0.5">Обычные весёлые котята, щенки и зайки</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 px-5 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={() => {
              soundManager.playKeyTap();
              onClose();
            }}
            className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-black rounded-xl text-xs sm:text-sm transition-colors shadow-2xs"
          >
            Понятно!
          </button>
        </div>
      </div>
    </div>
  );
}
