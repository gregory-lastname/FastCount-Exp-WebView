/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Achievement,
  PrizePet,
  SessionResult,
  SessionSettings,
  UserStats,
} from './types/math';
import { soundManager } from './utils/audio';
import {
  DEFAULT_SETTINGS,
  DEFAULT_STATS,
  INITIAL_ACHIEVEMENTS,
  PET_CATALOG,
  loadAchievements,
  loadPrizes,
  loadSettings,
  loadStats,
  resetAllData,
  rollPrize,
  saveAchievements,
  savePrizes,
  saveSessionResult,
  saveSettings,
  saveStats,
} from './utils/storage';
import { Header } from './components/Header';
import { MainMenu } from './components/MainMenu';
import { TrainerScreen } from './components/TrainerScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { AchievementsModal } from './components/AchievementsModal';
import { SettingsModal } from './components/SettingsModal';
import { HelpModal } from './components/HelpModal';
import { PrizeCollectionModal } from './components/PrizeCollectionModal';

export default function App() {
  const [screen, setScreen] = useState<'menu' | 'trainer' | 'results'>('menu');
  const [settings, setSettings] = useState<SessionSettings>(DEFAULT_SETTINGS);
  const [stats, setStats] = useState<UserStats>(DEFAULT_STATS);
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [prizes, setPrizes] = useState<PrizePet[]>([]);

  const [latestResult, setLatestResult] = useState<SessionResult | null>(null);
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement[]>([]);

  // Modals state
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isPrizesOpen, setIsPrizesOpen] = useState(false);

  // Initialize data on load
  useEffect(() => {
    const loadedSettings = loadSettings();
    const loadedStats = loadStats();
    const loadedAchievements = loadAchievements();
    const loadedPrizes = loadPrizes();

    setSettings(loadedSettings);
    setStats(loadedStats);
    setAchievements(loadedAchievements);
    setPrizes(loadedPrizes);

    soundManager.enabled = loadedSettings.soundEnabled;
    soundManager.theme = loadedSettings.soundTheme;
  }, []);

  // Update Settings handler
  const handleUpdateSettings = (newSettingsPartial: Partial<SessionSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettingsPartial };
      saveSettings(updated);
      if (typeof newSettingsPartial.soundEnabled === 'boolean') {
        soundManager.enabled = newSettingsPartial.soundEnabled;
      }
      if (newSettingsPartial.soundTheme) {
        soundManager.theme = newSettingsPartial.soundTheme;
      }
      return updated;
    });
  };

  // Toggle sound
  const handleToggleSound = () => {
    handleUpdateSettings({ soundEnabled: !settings.soundEnabled });
  };

  // Start trainer
  const handleStartGame = () => {
    setNewlyUnlocked([]);
    setScreen('trainer');
  };

  // Finish session handler
  const handleFinishSession = (result: SessionResult) => {
    // 1. Roll a collectible pet prize based on merit & difficulty
    const awardedPrize = rollPrize(result, prizes);
    const updatedPrizes = loadPrizes(); // includes newly rolled prize
    setPrizes(updatedPrizes);

    const fullResult: SessionResult = {
      ...result,
      prizeAwarded: awardedPrize,
    };

    setLatestResult(fullResult);
    saveSessionResult(fullResult);

    // 2. Compute updated user stats
    const updatedStats: UserStats = {
      totalSolved: stats.totalSolved + result.totalProblems,
      totalCorrect: stats.totalCorrect + result.correctCount,
      totalMistakes: stats.totalMistakes + result.mistakesCount,
      totalStars: stats.totalStars + result.stars,
      totalSessions: stats.totalSessions + 1,
      highestStreak: Math.max(stats.highestStreak, result.bestStreak),
      bestTimeSec: stats.bestTimeSec
        ? Math.min(stats.bestTimeSec, result.averageTimeSec)
        : result.averageTimeSec,
    };
    setStats(updatedStats);
    saveStats(updatedStats);

    // 3. Check achievement unlock conditions
    const freshlyUnlocked: Achievement[] = [];
    const updatedAchievements = achievements.map((ach) => {
      if (ach.unlocked) return ach;

      let shouldUnlock = false;
      let currentProgress = ach.progress?.current;

      switch (ach.id) {
        case 'first_step':
          shouldUnlock = true;
          break;
        case 'first_ten_streak':
          shouldUnlock = result.bestStreak >= 10;
          break;
        case 'lightning':
          shouldUnlock = result.averageTimeSec < 3.0 && result.accuracy >= 70;
          break;
        case 'no_mistakes':
          shouldUnlock = result.accuracy === 100 && result.totalProblems >= 10;
          break;
        case 'addition_master':
          shouldUnlock = result.mode === 'addition' && result.stars === 5;
          break;
        case 'subtraction_master':
          shouldUnlock = result.mode === 'subtraction' && result.stars === 5;
          break;
        case 'super_streak':
          shouldUnlock = result.bestStreak >= 20;
          break;
        case 'century':
          currentProgress = updatedStats.totalSolved;
          shouldUnlock = updatedStats.totalSolved >= 100;
          break;
        case 'mult_master':
          shouldUnlock = result.mode === 'multiplication' && result.stars === 5;
          break;
        case 'adaptive_champ':
          shouldUnlock = (result.adaptiveMaxTier ?? 1) >= 4;
          break;
        case 'pet_collector':
          currentProgress = updatedPrizes.length;
          shouldUnlock = updatedPrizes.length >= 8;
          break;
        default:
          break;
      }

      if (shouldUnlock) {
        const unlockedObj: Achievement = {
          ...ach,
          unlocked: true,
          unlockedAt: new Date().toISOString(),
          progress: ach.progress ? { ...ach.progress, current: ach.progress.max } : undefined,
        };
        freshlyUnlocked.push(unlockedObj);
        return unlockedObj;
      }

      if (ach.progress && currentProgress !== undefined) {
        return {
          ...ach,
          progress: { ...ach.progress, current: Math.min(ach.progress.max, currentProgress) },
        };
      }

      return ach;
    });

    setAchievements(updatedAchievements);
    saveAchievements(updatedAchievements);
    setNewlyUnlocked(freshlyUnlocked);
    setScreen('results');
  };

  // Reset all user data
  const handleResetAllData = () => {
    resetAllData();
    setStats(DEFAULT_STATS);
    setAchievements(INITIAL_ACHIEVEMENTS);
    setSettings(DEFAULT_SETTINGS);
    setPrizes([]);
    soundManager.enabled = true;
    soundManager.theme = 'funny';
    setScreen('menu');
  };

  return (
    <div className="h-screen max-h-screen w-screen overflow-hidden bg-linear-to-b from-amber-50/70 via-amber-50/30 to-orange-50/50 text-slate-900 flex flex-col font-sans select-none antialiased">
      {/* Top persistent compact header */}
      <Header
        starsCount={stats.totalStars}
        prizesCount={{
          unlocked: prizes.length,
          total: PET_CATALOG.length,
        }}
        soundEnabled={settings.soundEnabled}
        soundTheme={settings.soundTheme}
        onToggleSound={handleToggleSound}
        onOpenPrizes={() => setIsPrizesOpen(true)}
        onOpenAchievements={() => setIsAchievementsOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      {/* Main Single-Screen Content (guaranteed no scrollbars) */}
      <main className="flex-1 min-h-0 flex flex-col items-center justify-center p-2 sm:p-3 overflow-hidden">
        {screen === 'menu' && (
          <MainMenu
            settings={settings}
            stats={stats}
            achievementsCount={{
              unlocked: achievements.filter((a) => a.unlocked).length,
              total: achievements.length,
            }}
            prizesCount={{
              unlocked: prizes.length,
              total: PET_CATALOG.length,
            }}
            latestPrize={prizes.length > 0 ? prizes[prizes.length - 1] : null}
            onUpdateSettings={handleUpdateSettings}
            onStartGame={handleStartGame}
            onOpenAchievements={() => setIsAchievementsOpen(true)}
            onOpenPrizes={() => setIsPrizesOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenHelp={() => setIsHelpOpen(true)}
          />
        )}

        {screen === 'trainer' && (
          <TrainerScreen
            settings={settings}
            onFinishSession={handleFinishSession}
            onExit={() => setScreen('menu')}
          />
        )}

        {screen === 'results' && latestResult && (
          <ResultsScreen
            result={latestResult}
            newAchievements={newlyUnlocked}
            onPlayAgain={handleStartGame}
            onChangeMode={() => setScreen('menu')}
            onGoHome={() => setScreen('menu')}
            onOpenPrizes={() => setIsPrizesOpen(true)}
          />
        )}
      </main>

      {/* Prize Collection Modal */}
      <PrizeCollectionModal
        isOpen={isPrizesOpen}
        unlockedPrizes={prizes}
        onClose={() => setIsPrizesOpen(false)}
      />

      {/* Achievements Modal */}
      <AchievementsModal
        isOpen={isAchievementsOpen}
        achievements={achievements}
        onClose={() => setIsAchievementsOpen(false)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onResetAllData={handleResetAllData}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Help / Guide Modal */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}
