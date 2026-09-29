import React, { useState } from 'react';
import { Gift, Lock, Sparkles, X } from 'lucide-react';
import { PrizePet, PrizeRarity } from '../types/math';
import { PET_CATALOG } from '../utils/storage';
import { soundManager } from '../utils/audio';

interface PrizeCollectionModalProps {
  isOpen: boolean;
  unlockedPrizes: PrizePet[];
  onClose: () => void;
}

export function PrizeCollectionModal({
  isOpen,
  unlockedPrizes,
  onClose,
}: PrizeCollectionModalProps) {
  const [filterRarity, setFilterRarity] = useState<PrizeRarity | 'all'>('all');

  if (!isOpen) return null;

  const unlockedMap = new Map<string, PrizePet>();
  unlockedPrizes.forEach((p) => unlockedMap.set(p.id, p));

  const rarityMeta: Record<
    PrizeRarity,
    { label: string; bg: string; border: string; text: string; hint: string }
  > = {
    legendary: {
      label: 'Легендарный',
      bg: 'bg-amber-100',
      border: 'border-amber-400',
      text: 'text-amber-800',
      hint: 'Выдаётся за 5 звёзд в тренировке',
    },
    epic: {
      label: 'Эпический',
      bg: 'bg-purple-100',
      border: 'border-purple-400',
      text: 'text-purple-800',
      hint: 'Выдаётся за 4–5 звёзд',
    },
    rare: {
      label: 'Редкий',
      bg: 'bg-sky-100',
      border: 'border-sky-400',
      text: 'text-sky-800',
      hint: 'Выдаётся за 3–4 звезды',
    },
    common: {
      label: 'Обычный',
      bg: 'bg-emerald-100',
      border: 'border-emerald-400',
      text: 'text-emerald-800',
      hint: 'Выдаётся за любую тренировку',
    },
  };

  const displayedPets =
    filterRarity === 'all'
      ? PET_CATALOG
      : PET_CATALOG.filter((p) => p.rarity === filterRarity);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border-3 border-amber-300 overflow-hidden animate-pop-in">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-amber-200 bg-linear-to-r from-amber-50 via-orange-50 to-amber-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-400 border-2 border-amber-500 flex items-center justify-center text-2xl shadow-xs">
              🎁
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight flex items-center gap-2">
                Альбом призов и питомцев
                <span className="text-xs font-black bg-amber-500 text-white px-2.5 py-0.5 rounded-full shadow-xs">
                  {unlockedPrizes.length} / {PET_CATALOG.length}
                </span>
              </h3>
              <p className="text-xs text-slate-600 font-semibold mt-0.5">
                Завершай тренировки на отлично, открывай сундуки и собирай всю коллекцию!
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playKeyTap();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/80 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="px-5 py-2.5 border-b border-slate-100 bg-slate-50 flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Редкость:</span>
          {(['all', 'legendary', 'epic', 'rare', 'common'] as const).map((r) => {
            const isSelected = filterRarity === r;
            const labels = {
              all: 'Все (16)',
              legendary: '👑 Легендарные (4)',
              epic: '💜 Эпические (4)',
              rare: '💙 Редкие (4)',
              common: '💚 Обычные (4)',
            };
            return (
              <button
                key={r}
                onClick={() => {
                  soundManager.playKeyTap();
                  setFilterRarity(r);
                }}
                className={`px-3 py-1 text-xs font-black rounded-xl border transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-amber-400 border-amber-500 text-amber-950 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {labels[r]}
              </button>
            );
          })}
        </div>

        {/* Grid of Pets */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 bg-amber-50/30">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {displayedPets.map((catalogPet) => {
              const unlocked = unlockedMap.get(catalogPet.id);
              const meta = rarityMeta[catalogPet.rarity];

              if (unlocked) {
                return (
                  <div
                    key={catalogPet.id}
                    className={`bg-white rounded-2xl p-3.5 border-2 ${meta.border} shadow-sm flex flex-col justify-between hover:shadow-md transition-all relative overflow-hidden`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-3xl sm:text-4xl drop-shadow-xs">{catalogPet.emoji}</span>
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${meta.bg} ${meta.text}`}
                      >
                        {meta.label}
                      </span>
                    </div>

                    <div className="mt-2.5">
                      <div className="text-sm font-black text-slate-900 leading-snug">
                        {catalogPet.name}
                      </div>
                      <div className="text-[11px] font-medium text-slate-500 mt-0.5 line-clamp-1">
                        {catalogPet.title}
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-100">
                      <p className="text-[11px] text-amber-900 italic font-medium leading-tight">
                        «{catalogPet.quote}»
                      </p>
                      {unlocked.unlockedAt && (
                        <div className="text-[10px] text-slate-400 font-semibold mt-1">
                          Открыт: {unlocked.unlockedAt}
                        </div>
                      )}
                    </div>
                  </div>
                );
              }

              // Locked pet
              return (
                <div
                  key={catalogPet.id}
                  className="bg-slate-50/80 rounded-2xl p-3.5 border-2 border-dashed border-slate-300 flex flex-col justify-between opacity-80 hover:opacity-100 transition-all text-center relative"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center mx-auto mb-1">
                      <Lock className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-black uppercase text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded-md">
                      {meta.label}
                    </span>
                  </div>

                  <div className="my-2">
                    <div className="text-xs font-bold text-slate-600">Таинственный питомец</div>
                    <div className="text-[10px] text-slate-400 mt-1 leading-snug">
                      {meta.hint}
                    </div>
                  </div>

                  <div className="text-[10px] font-bold text-amber-600 bg-amber-50 rounded-lg py-1 border border-amber-200">
                    Заперто в сундуке 🎁
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 px-5 border-t border-slate-100 bg-white flex items-center justify-between">
          <div className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Каждая победная тренировка приближает открытие нового питомца!</span>
          </div>
          <button
            onClick={() => {
              soundManager.playKeyTap();
              onClose();
            }}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-xl text-xs sm:text-sm transition-colors shadow-xs"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}
