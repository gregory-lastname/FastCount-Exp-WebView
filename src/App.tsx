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
  UserProfile,
  UserStats,
} from './types/math';
import { soundManager } from './utils/audio';
import {
  DEFAULT_SETTINGS,
  DEFAULT_STATS,
  INITIAL_ACHIEVEMENTS,
  PET_CATALOG,
  createUser,
  deleteUser,
  getCurrentUser,
  getCurrentUserId,
  loadAchievements,
  loadHistory,
  loadPrizes,
  loadSettings,
  loadStats,
  loadUsers,
  resetAllData,
  rollPrize,
  saveAchievements,
  savePrizes,
  saveSessionResult,
  saveSettings,
  saveStats,
  setCurrentUserId,
  updateUser,
} from './utils/storage';
import { Header } from './components/Header';
import { MainMenu } from './components/MainMenu';
import { TrainerScreen } from './components/TrainerScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { AchievementsModal } from './components/AchievementsModal';
import { SettingsModal } from './components/SettingsModal';
import { HelpModal } from './components/HelpModal';
import { PrizeCollectionModal } from './components/PrizeCollectionModal';
import { UserProfilesModal } from './components/UserProfilesModal';
import { UserDashboardModal } from './components/UserDashboardModal';

export default function App() {
  const [screen, setScreen] = useState<'menu' | 'trainer' | 'results'>('menu');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  const [settings, setSettings] = useState<SessionSettings>(DEFAULT_SETTINGS);
  const [stats, setStats] = useState<UserStats>(DEFAULT_STATS);
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [prizes, setPrizes] = useState<PrizePet[]>([]);
  const [history, setHistory] = useState<SessionResult[]>([]);

  const [latestResult, setLatestResult] = useState<SessionResult | null>(null);
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement[]>([]);

  // Modals state
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isPrizesOpen, setIsPrizesOpen] = useState(false);
  const [isUsersModalOpen, setIsUsersModalOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  // Initialize data on load
  useEffect(() => {
    const loadedUsers = loadUsers();
    setUsers(loadedUsers);

    const activeUser = getCurrentUser();
    setCurrentUser(activeUser);

    loadUserData(activeUser.id);
  }, []);

  const loadUserData = (userId: string) => {
    const loadedSettings = loadSettings(userId);
    const loadedStats = loadStats(userId);
    const loadedAchievements = loadAchievements(userId);
    const loadedPrizes = loadPrizes(userId);
    const loadedHistory = loadHistory(userId);

    setSettings(loadedSettings);
    setStats(loadedStats);
    setAchievements(loadedAchievements);
    setPrizes(loadedPrizes);
    setHistory(loadedHistory);

    soundManager.enabled = loadedSettings.soundEnabled;
    soundManager.theme = loadedSettings.soundTheme;
  };

  // Switch active user
  const handleSelectUser = (userId: string) => {
    setCurrentUserId(userId);
    const user = users.find((u) => u.id === userId) || getCurrentUser();
    setCurrentUser(user);
    loadUserData(userId);
  };

  // Create new user
  const handleCreateUser = (name: string, avatar: string, grade: string) => {
    const newUser = createUser(name, avatar, grade);
    const allUsers = loadUsers();
    setUsers(allUsers);
    setCurrentUser(newUser);
    loadUserData(newUser.id);
  };

  // Update existing user
  const handleUpdateUser = (updatedUser: UserProfile) => {
    updateUser(updatedUser);
    const allUsers = loadUsers();
    setUsers(allUsers);
    if (currentUser?.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
  };

  // Delete user
  const handleDeleteUser = (userId: string) => {
    deleteUser(userId);
    const allUsers = loadUsers();
    setUsers(allUsers);
    const active = getCurrentUser();
    setCurrentUser(active);
    loadUserData(active.id);
  };

  // Update Settings handler
  const handleUpdateSettings = (newSettingsPartial: Partial<SessionSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettingsPartial };
      saveSettings(updated, currentUser?.id);
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
    const uid = currentUser?.id;

    // 1. Roll a collectible pet prize based on merit & difficulty
    const awardedPrize = rollPrize(result, prizes);
    const updatedPrizes = loadPrizes(uid);
    setPrizes(updatedPrizes);

    const fullResult: SessionResult = {
      ...result,
      prizeAwarded: awardedPrize,
    };

    setLatestResult(fullResult);
    saveSessionResult(fullResult, uid);
    setHistory((prev) => [fullResult, ...prev]);

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
    saveStats(updatedStats, uid);

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
        case 'bond_master':
          shouldUnlock = result.mode === 'number_bonds' && result.stars === 5;
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
    saveAchievements(updatedAchievements, uid);
    setNewlyUnlocked(freshlyUnlocked);
    setScreen('results');
  };

  // Reset current user data
  const handleResetAllData = () => {
    resetAllData();
    const active = getCurrentUser();
    setStats(DEFAULT_STATS);
    setAchievements(INITIAL_ACHIEVEMENTS);
    setSettings(DEFAULT_SETTINGS);
    setPrizes([]);
    setHistory([]);
    soundManager.enabled = true;
    soundManager.theme = 'funny';
    setScreen('menu');
  };

  return (
    <div className="h-screen max-h-screen w-screen overflow-hidden bg-linear-to-b from-amber-50/70 via-amber-50/30 to-orange-50/50 text-slate-900 flex flex-col font-sans select-none antialiased">
      {/* Top persistent compact header */}
      <Header
        currentUser={currentUser || undefined}
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
        onOpenUsers={() => setIsUsersModalOpen(true)}
        onOpenDashboard={() => setIsDashboardOpen(true)}
      />

      {/* Main Single-Screen Content (guaranteed no scrollbars) */}
      <main className="flex-1 min-h-0 flex flex-col items-center justify-center p-2 sm:p-3 overflow-hidden">
        {screen === 'menu' && (
          <MainMenu
            settings={settings}
            stats={stats}
            currentUser={currentUser || undefined}
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
            onOpenUsers={() => setIsUsersModalOpen(true)}
            onOpenDashboard={() => setIsDashboardOpen(true)}
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

      {/* User Profiles Modal */}
      <UserProfilesModal
        isOpen={isUsersModalOpen}
        users={users}
        currentUserId={currentUser?.id || ''}
        onSelectUser={handleSelectUser}
        onCreateUser={handleCreateUser}
        onUpdateUser={handleUpdateUser}
        onDeleteUser={handleDeleteUser}
        onClose={() => setIsUsersModalOpen(false)}
      />

      {/* User Personal Dashboard & Printable Report / Diploma Modal */}
      {currentUser && (
        <UserDashboardModal
          isOpen={isDashboardOpen}
          user={currentUser}
          stats={stats}
          history={history}
          prizes={prizes}
          onClose={() => setIsDashboardOpen(false)}
        />
      )}

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
