import React, { useState } from 'react';
import { RotateCcw, Volume2, VolumeX, X, AlertTriangle, Music, Keyboard, ListFilter, Zap } from 'lucide-react';
import { DifficultyLevel, SessionSettings, SoundTheme } from '../types/math';
import { soundManager } from '../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  settings: SessionSettings;
  onUpdateSettings: (newSettings: Partial<SessionSettings>) => void;
  onResetAllData: () => void;
  onClose: () => void;
}

export function SettingsModal({
  isOpen,
  settings,
  onUpdateSettings,
  onResetAllData,
  onClose,
}: SettingsModalProps) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border-3 border-slate-200 overflow-hidden animate-pop-in">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center text-xl shadow-xs">
              ⚙️
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 leading-tight">Настройки</h3>
              <p className="text-xs text-slate-500 font-semibold">Звуки, управление и параметры тренировки</p>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playKeyTap();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* Sound Theme Choice (Requested by user) */}
          <div className="p-3.5 rounded-2xl border border-amber-200 bg-amber-50/50 space-y-2">
            <div className="flex items-center gap-2 text-xs font-black text-amber-950 uppercase tracking-wider">
              <Music className="w-4 h-4 text-amber-600" />
              <span>Звуковая схема</span>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              Выбери характер озвучки при решении примеров:
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => {
                  soundManager.theme = 'classic';
                  soundManager.playKeyTap();
                  soundManager.playSuccess();
                  onUpdateSettings({ soundTheme: 'classic' });
                }}
                className={`btn-tactile p-3 rounded-xl border-2 text-left transition-all ${
                  settings.soundTheme === 'classic'
                    ? 'border-amber-500 bg-amber-400/30 text-amber-950 ring-2 ring-amber-300 font-black'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="text-sm font-black flex items-center gap-1.5">
                  <span>🔔 Классическая</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Спокойные гармоничные колокольчики
                </div>
              </button>

              <button
                onClick={() => {
                  soundManager.theme = 'funny';
                  soundManager.playKeyTap();
                  soundManager.playSuccess();
                  onUpdateSettings({ soundTheme: 'funny' });
                }}
                className={`btn-tactile p-3 rounded-xl border-2 text-left transition-all ${
                  settings.soundTheme === 'funny'
                    ? 'border-amber-500 bg-amber-400/30 text-amber-950 ring-2 ring-amber-300 font-black'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="text-sm font-black flex items-center gap-1.5">
                  <span>🎪 Шутливая</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Мультяшные звуки, подколки и свистки
                </div>
              </button>
            </div>
          </div>

          {/* Sound Mute/Unmute */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                {settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </div>
              <div>
                <div className="text-sm font-black text-slate-900">Включить звуковые эффекты</div>
                <div className="text-xs text-slate-500">Сигналы побед, таймера и ошибок</div>
              </div>
            </div>
            <button
              onClick={() => {
                soundManager.playKeyTap();
                onUpdateSettings({ soundEnabled: !settings.soundEnabled });
              }}
              className={`w-14 h-8 rounded-full p-1 transition-colors cursor-pointer ${
                settings.soundEnabled ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white transition-transform ${
                  settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Timer Settings (Requested by user: full control over timer on/off and duration) */}
          <div className="p-3.5 rounded-2xl border border-amber-200 bg-amber-50/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center text-lg">
                  ⏱️
                </div>
                <div>
                  <div className="text-sm font-black text-slate-900">Таймер на решение примеров</div>
                  <div className="text-xs text-slate-500">Ограничение времени для тренировки скорости</div>
                </div>
              </div>

              <button
                onClick={() => {
                  soundManager.playKeyTap();
                  onUpdateSettings({ timerEnabled: !settings.timerEnabled });
                }}
                className={`w-14 h-8 rounded-full p-1 transition-colors cursor-pointer ${
                  settings.timerEnabled ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full bg-white transition-transform ${
                    settings.timerEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {settings.timerEnabled && (
              <div className="pt-2 border-t border-amber-200/80 space-y-1.5 animate-pop-in">
                <div className="text-xs font-bold text-slate-700">
                  Время на один пример:
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {([5, 8, 10, 15] as const).map((sec) => (
                    <button
                      key={sec}
                      onClick={() => {
                        soundManager.playKeyTap();
                        onUpdateSettings({ timerSeconds: sec });
                      }}
                      className={`py-1.5 rounded-xl border text-xs font-black transition-all cursor-pointer ${
                        settings.timerSeconds === sec
                          ? 'border-amber-500 bg-amber-400 text-amber-950 shadow-2xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {sec} сек
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Difficulty Level (differential option available for all modes!) */}
          <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-xs font-black text-slate-800 uppercase tracking-wider">
                Уровень сложности
              </div>
              <span className="text-[10px] text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded-full">
                Для всех режимов
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  soundManager.playKeyTap();
                  onUpdateSettings({ difficulty: 'differential' });
                }}
                className={`btn-tactile p-2.5 rounded-xl border-2 text-left transition-all ${
                  settings.difficulty === 'differential'
                    ? 'border-amber-500 bg-amber-50 text-amber-950 font-black ring-2 ring-amber-200 shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-black text-amber-900">
                  <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
                  <span>Авто</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Автоматическая подстройка под ученика (1–5)
                </div>
              </button>

              <button
                onClick={() => {
                  soundManager.playKeyTap();
                  onUpdateSettings({ difficulty: 1 });
                }}
                className={`btn-tactile p-2.5 rounded-xl border-2 text-left transition-all ${
                  settings.difficulty === 1
                    ? 'border-amber-500 bg-amber-50 text-amber-950 font-black ring-2 ring-amber-200 shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="text-xs font-black">1 уровень (до 5)</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Простейшие примеры</div>
              </button>

              <button
                onClick={() => {
                  soundManager.playKeyTap();
                  onUpdateSettings({ difficulty: 2 });
                }}
                className={`btn-tactile p-2.5 rounded-xl border-2 text-left transition-all ${
                  settings.difficulty === 2
                    ? 'border-amber-500 bg-amber-50 text-amber-950 font-black ring-2 ring-amber-200 shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="text-xs font-black">2 уровень (до 10)</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Базовый счёт 2 класса</div>
              </button>

              <button
                onClick={() => {
                  soundManager.playKeyTap();
                  onUpdateSettings({ difficulty: 3 });
                }}
                className={`btn-tactile p-2.5 rounded-xl border-2 text-left transition-all ${
                  settings.difficulty === 3
                    ? 'border-amber-500 bg-amber-50 text-amber-950 font-black ring-2 ring-amber-200 shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="text-xs font-black">3 уровень (до 20)</div>
                <div className="text-[10px] text-slate-500 mt-0.5">С переходом через десяток</div>
              </button>
            </div>
          </div>

          {/* Input Mode Choice */}
          <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="text-xs font-black text-slate-800 uppercase tracking-wider">
              Способ ввода ответа
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  soundManager.playKeyTap();
                  onUpdateSettings({ inputMode: 'keyboard' });
                }}
                className={`btn-tactile p-2.5 rounded-xl border-2 text-left transition-all ${
                  settings.inputMode === 'keyboard'
                    ? 'border-amber-500 bg-amber-50 text-amber-950 font-black ring-2 ring-amber-200'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-black">
                  <Keyboard className="w-4 h-4 text-amber-600" />
                  <span>Клавиатура</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Ввод цифр 0–9</div>
              </button>

              <button
                onClick={() => {
                  soundManager.playKeyTap();
                  onUpdateSettings({ inputMode: 'test' });
                }}
                className={`btn-tactile p-2.5 rounded-xl border-2 text-left transition-all ${
                  settings.inputMode === 'test'
                    ? 'border-amber-500 bg-amber-50 text-amber-950 font-black ring-2 ring-amber-200'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-black">
                  <ListFilter className="w-4 h-4 text-sky-600" />
                  <span>Тест (4 варианта)</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Выбор готового ответа</div>
              </button>
            </div>
          </div>

          {/* Table range for multiplication/division */}
          <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="text-xs font-black text-slate-800 uppercase tracking-wider">
              Таблица умножения и деления
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  soundManager.playKeyTap();
                  onUpdateSettings({ tableRange: 'up_to_5' });
                }}
                className={`btn-tactile py-2 px-3 rounded-xl border-2 text-center text-xs font-black transition-all ${
                  settings.tableRange === 'up_to_5'
                    ? 'border-amber-500 bg-amber-400 text-amber-950 shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                Базовая (до 5 × 5)
              </button>

              <button
                onClick={() => {
                  soundManager.playKeyTap();
                  onUpdateSettings({ tableRange: 'up_to_9' });
                }}
                className={`btn-tactile py-2 px-3 rounded-xl border-2 text-center text-xs font-black transition-all ${
                  settings.tableRange === 'up_to_9'
                    ? 'border-amber-500 bg-amber-400 text-amber-950 shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                Полная (до 9 × 9)
              </button>
            </div>
          </div>

          {/* Reset All Progress */}
          <div className="pt-1">
            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="w-full py-2.5 px-4 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200 flex items-center justify-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Сбросить коллекцию призов и весь прогресс</span>
              </button>
            ) : (
              <div className="p-3 bg-rose-50 rounded-2xl border border-rose-300 space-y-2">
                <div className="flex items-center gap-2 text-rose-800 text-xs font-bold">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Все открытые питомцы, звёзды и статистика будут удалены. Точно сбросить?</span>
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => {
                      onResetAllData();
                      setShowResetConfirm(false);
                      onClose();
                    }}
                    className="flex-1 py-1.5 bg-rose-600 text-white font-bold text-xs rounded-lg hover:bg-rose-700"
                  >
                    Да, сбросить всё
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="flex-1 py-1.5 bg-white text-slate-700 font-bold text-xs rounded-lg border border-slate-200 hover:bg-slate-50"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 px-5 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={() => {
              soundManager.playKeyTap();
              onClose();
            }}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-xl text-xs sm:text-sm transition-colors shadow-2xs"
          >
            Сохранить и закрыть
          </button>
        </div>
      </div>
    </div>
  );
}
