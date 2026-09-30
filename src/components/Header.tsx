import React from 'react';
import { Award, BarChart3, ChevronDown, Gift, HelpCircle, Settings as SettingsIcon, Users, Volume2, VolumeX } from 'lucide-react';
import { SoundTheme, UserProfile } from '../types/math';
import { soundManager } from '../utils/audio';

interface HeaderProps {
  currentUser?: UserProfile;
  starsCount: number;
  prizesCount: { unlocked: number; total: number };
  soundEnabled: boolean;
  soundTheme: SoundTheme;
  onToggleSound: () => void;
  onOpenPrizes: () => void;
  onOpenAchievements: () => void;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
  onOpenUsers: () => void;
  onOpenDashboard: () => void;
}

export function Header({
  currentUser,
  starsCount,
  prizesCount,
  soundEnabled,
  soundTheme,
  onToggleSound,
  onOpenPrizes,
  onOpenAchievements,
  onOpenSettings,
  onOpenHelp,
  onOpenUsers,
  onOpenDashboard,
}: HeaderProps) {
  const handleToggleSound = () => {
    soundManager.playKeyTap();
    onToggleSound();
  };

  return (
    <header className="w-full bg-white/95 backdrop-blur-xs border-b border-amber-200/80 px-3 sm:px-4 py-2 shrink-0 z-30 shadow-2xs">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        {/* Brand Zone & User Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-400 border border-amber-500 shadow-xs flex items-center justify-center text-lg sm:text-xl font-black text-amber-950 select-none">
            ⚡
          </div>
          <div className="hidden sm:flex items-baseline gap-2">
            <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-none">
              Считаю быстро
            </h1>
            <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-200 leading-none">
              2 класс
            </span>
          </div>

          {/* User Profile Selector Pill */}
          {currentUser && (
            <button
              onClick={() => {
                soundManager.playKeyTap();
                onOpenUsers();
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl text-amber-950 font-black text-xs shadow-2xs transition-colors cursor-pointer"
              title="Сменить или настроить ученика"
            >
              <span className="text-base leading-none">{currentUser.avatar}</span>
              <span className="truncate max-w-[80px] sm:max-w-[120px]">{currentUser.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-amber-700" />
            </button>
          )}
        </div>

        {/* Right Tools & Stats Zone */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Personal Dashboard Button */}
          <button
            onClick={() => {
              soundManager.playKeyTap();
              onOpenDashboard();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-sky-100 hover:bg-sky-200 border border-sky-300 rounded-xl text-sky-950 font-black text-xs shadow-2xs transition-colors cursor-pointer"
            title="Открыть дашборд успехов и распечатать похвальную грамоту"
          >
            <BarChart3 className="w-4 h-4 text-sky-700" />
            <span className="hidden md:inline">Отчёт</span>
          </button>

          {/* Prize Collection Button */}
          <button
            onClick={() => {
              soundManager.playKeyTap();
              onOpenPrizes();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-linear-to-r from-amber-100/90 to-orange-100/90 hover:from-amber-200 hover:to-orange-200 border border-amber-300 rounded-xl text-amber-950 font-black text-xs shadow-2xs transition-all cursor-pointer"
            title="Открыть альбом призовых питомцев"
          >
            <Gift className="w-4 h-4 text-amber-700" />
            <span className="hidden sm:inline">Призы:</span>
            <span className="bg-amber-400/80 px-1.5 py-0.2 rounded-md text-[11px]">
              {prizesCount.unlocked}/{prizesCount.total}
            </span>
          </button>

          {/* Stars Counter */}
          <div
            className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 font-black text-xs shadow-2xs"
            title="Всего заработано звёзд"
          >
            <span className="text-amber-500 text-sm">⭐</span>
            <span>{starsCount}</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            className={`p-1.5 sm:p-2 rounded-xl border transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-amber-100/70 border-amber-300 text-amber-900 hover:bg-amber-200/70'
                : 'bg-slate-100 border-slate-200 text-slate-400 hover:bg-slate-200'
            }`}
            title={
              soundEnabled
                ? `Звук включён (${soundTheme === 'funny' ? 'Шутливая тема 🎪' : 'Классическая тема 🔔'})`
                : 'Звук выключен'
            }
            aria-label="Переключить звук"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Achievements Button */}
          <button
            onClick={() => {
              soundManager.playKeyTap();
              onOpenAchievements();
            }}
            className="p-1.5 sm:p-2 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 transition-all cursor-pointer"
            title="Награды и достижения"
            aria-label="Достижения"
          >
            <Award className="w-4 h-4" />
          </button>

          {/* Settings Button */}
          <button
            onClick={() => {
              soundManager.playKeyTap();
              onOpenSettings();
            }}
            className="p-1.5 sm:p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
            title="Настройки тренировки"
            aria-label="Настройки"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>

          {/* Help Button */}
          <button
            onClick={() => {
              soundManager.playKeyTap();
              onOpenHelp();
            }}
            className="p-1.5 sm:p-2 rounded-xl border border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 transition-all cursor-pointer"
            title="Справка и горячие клавиши"
            aria-label="Справка"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
