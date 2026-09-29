import React from 'react';
import { Award, Check, Lock, X } from 'lucide-react';
import { Achievement } from '../types/math';
import { soundManager } from '../utils/audio';

interface AchievementsModalProps {
  isOpen: boolean;
  achievements: Achievement[];
  onClose: () => void;
}

export function AchievementsModal({ isOpen, achievements, onClose }: AchievementsModalProps) {
  if (!isOpen) return null;

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border-3 border-amber-300 overflow-hidden animate-pop-in">
        {/* Header */}
        <div className="p-5 border-b border-amber-200 bg-amber-50/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 border border-amber-500 flex items-center justify-center text-2xl shadow-xs">
              🏆
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 leading-tight">Мои награды</h3>
              <p className="text-xs text-slate-500 font-semibold">
                Открыто {unlockedCount} из {achievements.length} бейджей
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

        {/* Badges Grid */}
        <div className="p-5 overflow-y-auto space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {achievements.map((ach) => {
              return (
                <div
                  key={ach.id}
                  className={`p-3.5 rounded-2xl border-2 flex items-start gap-3 transition-all ${
                    ach.unlocked
                      ? 'bg-amber-50/60 border-amber-300 shadow-xs'
                      : 'bg-slate-50/80 border-slate-200 opacity-60'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                      ach.unlocked
                        ? 'bg-amber-100 border border-amber-300 shadow-xs'
                        : 'bg-slate-200 border border-slate-300 grayscale'
                    }`}
                  >
                    {ach.unlocked ? ach.icon : <Lock className="w-5 h-5 text-slate-400" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4
                        className={`text-sm font-black truncate ${
                          ach.unlocked ? 'text-slate-900' : 'text-slate-600'
                        }`}
                      >
                        {ach.title}
                      </h4>
                      {ach.unlocked && (
                        <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-snug">{ach.description}</p>
                    {ach.progress && !ach.unlocked && (
                      <div className="mt-2">
                        <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-0.5">
                          <span>Прогресс:</span>
                          <span>
                            {ach.progress.current} / {ach.progress.max}
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-amber-400 h-full rounded-full"
                            style={{
                              width: `${Math.min(
                                100,
                                Math.round((ach.progress.current / ach.progress.max) * 100)
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={() => {
              soundManager.playKeyTap();
              onClose();
            }}
            className="px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black rounded-xl text-sm transition-colors shadow-xs"
          >
            Отлично!
          </button>
        </div>
      </div>
    </div>
  );
}
