import React, { useState } from 'react';
import { Check, Plus, Trash2, User, Users, X, Edit3 } from 'lucide-react';
import { UserProfile } from '../types/math';
import { soundManager } from '../utils/audio';

const AVATAR_OPTIONS = [
  '🦁', '🐱', '🐶', '🦊', '🐼', '🐰', '🐨', '🐻',
  '🦉', '🦄', '🚀', '🤖', '🦖', '⚡', '🌟', '🎯',
  '🐧', '🐬', '👑', '🎈', '🐯', '🐵', '🐿️', '🐙',
];

const GRADE_OPTIONS = ['Дошкольник', '1 класс', '2 класс', '3 класс', '4 класс'];

interface UserProfilesModalProps {
  isOpen: boolean;
  users: UserProfile[];
  currentUserId: string;
  onSelectUser: (id: string) => void;
  onCreateUser: (name: string, avatar: string, grade: string) => void;
  onUpdateUser: (user: UserProfile) => void;
  onDeleteUser: (id: string) => void;
  onClose: () => void;
}

export function UserProfilesModal({
  isOpen,
  users,
  currentUserId,
  onSelectUser,
  onCreateUser,
  onUpdateUser,
  onDeleteUser,
  onClose,
}: UserProfilesModalProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🐱');
  const [selectedGrade, setSelectedGrade] = useState('2 класс');

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStartCreate = () => {
    soundManager.playKeyTap();
    setName('');
    setSelectedAvatar(AVATAR_OPTIONS[Math.floor(Math.random() * AVATAR_OPTIONS.length)]);
    setSelectedGrade('2 класс');
    setEditingUserId(null);
    setIsCreating(true);
  };

  const handleStartEdit = (user: UserProfile) => {
    soundManager.playKeyTap();
    setName(user.name);
    setSelectedAvatar(user.avatar);
    setSelectedGrade(user.grade || '2 класс');
    setIsCreating(false);
    setEditingUserId(user.id);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    soundManager.playKeyTap();
    if (isCreating) {
      onCreateUser(name.trim(), selectedAvatar, selectedGrade);
      setIsCreating(false);
    } else if (editingUserId) {
      const user = users.find((u) => u.id === editingUserId);
      if (user) {
        onUpdateUser({
          ...user,
          name: name.trim(),
          avatar: selectedAvatar,
          grade: selectedGrade,
        });
      }
      setEditingUserId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border-3 border-amber-300 overflow-hidden animate-pop-in">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-amber-200/80 bg-amber-50/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center text-xl shadow-xs">
              <Users className="w-5 h-5 text-amber-950" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 leading-tight">Профили учеников</h3>
              <p className="text-xs text-slate-500 font-semibold">
                Регистрируй детей и переключай прогресс
              </p>
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

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* Create / Edit Form */}
          {(isCreating || editingUserId) ? (
            <form onSubmit={handleSubmitForm} className="bg-amber-50/60 border-2 border-amber-300 rounded-2xl p-4 space-y-3.5 animate-pop-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-4 h-4 text-amber-700" />
                  <span>{isCreating ? 'Регистрация нового ученика' : 'Редактирование профиля'}</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingUserId(null);
                  }}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600"
                >
                  Отмена
                </button>
              </div>

              {/* Name Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Имя ученика / ребёнка:
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Например: Артём или Маша"
                  maxLength={24}
                  autoFocus
                  required
                  className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden font-bold text-slate-900 text-sm bg-white"
                />
              </div>

              {/* Grade Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Класс / Возраст:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {GRADE_OPTIONS.map((grade) => (
                    <button
                      key={grade}
                      type="button"
                      onClick={() => {
                        soundManager.playKeyTap();
                        setSelectedGrade(grade);
                      }}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                        selectedGrade === grade
                          ? 'bg-amber-500 text-white border-amber-600 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {grade}
                    </button>
                  ))}
                </div>
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Выбери весёлый аватар:
                </label>
                <div className="grid grid-cols-8 gap-1.5 bg-white p-2 rounded-xl border border-slate-200">
                  {AVATAR_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => {
                        soundManager.playKeyTap();
                        setSelectedAvatar(emoji);
                      }}
                      className={`h-9 rounded-lg flex items-center justify-center text-xl transition-all cursor-pointer ${
                        selectedAvatar === emoji
                          ? 'bg-amber-100 ring-2 ring-amber-400 scale-110 shadow-xs'
                          : 'hover:bg-slate-100'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-1 flex gap-2">
                <button
                  type="submit"
                  disabled={!name.trim()}
                  className="btn-tactile flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-black text-xs rounded-xl shadow-md border border-emerald-600 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{isCreating ? 'Зарегистрировать' : 'Сохранить изменения'}</span>
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={handleStartCreate}
              className="btn-tactile w-full py-3 px-4 rounded-2xl border-2 border-dashed border-amber-300 hover:border-amber-400 bg-amber-50/50 hover:bg-amber-100/70 text-amber-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
            >
              <Plus className="w-4 h-4 text-amber-700 stroke-[3]" />
              <span>+ Добавить нового ученика</span>
            </button>
          )}

          {/* User List */}
          <div className="space-y-2">
            <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider px-1">
              Все ученики ({users.length})
            </div>

            {users.map((user) => {
              const isActive = user.id === currentUserId;
              const isDeleting = confirmDeleteId === user.id;

              return (
                <div
                  key={user.id}
                  className={`p-3 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 ${
                    isActive
                      ? 'border-amber-500 bg-amber-50/80 ring-2 ring-amber-300 shadow-xs'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  {/* Left: Avatar & info */}
                  <div
                    onClick={() => {
                      if (!isActive) {
                        soundManager.playKeyTap();
                        onSelectUser(user.id);
                      }
                    }}
                    className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-2xl shadow-2xs shrink-0">
                      {user.avatar}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-slate-900 truncate">
                          {user.name}
                        </span>
                        {isActive && (
                          <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.2 rounded-full shadow-2xs">
                            Активен
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-semibold text-slate-500">
                        {user.grade || '2 класс'}
                      </span>
                    </div>
                  </div>

                  {/* Right actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    {!isActive && (
                      <button
                        onClick={() => {
                          soundManager.playKeyTap();
                          onSelectUser(user.id);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs shadow-2xs transition-colors cursor-pointer"
                      >
                        Выбрать
                      </button>
                    )}

                    <button
                      onClick={() => handleStartEdit(user)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="Редактировать имя и аватар"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {users.length > 1 && (
                      !isDeleting ? (
                        <button
                          onClick={() => setConfirmDeleteId(user.id)}
                          className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Удалить профиль"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <div className="flex items-center gap-1 bg-rose-50 p-1 rounded-xl border border-rose-200 animate-pop-in">
                          <button
                            onClick={() => {
                              onDeleteUser(user.id);
                              setConfirmDeleteId(null);
                            }}
                            className="px-2 py-1 bg-rose-600 text-white rounded text-[10px] font-bold"
                          >
                            Удалить?
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="p-1 text-slate-500 text-[10px]"
                          >
                            ✕
                          </button>
                        </div>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 px-5 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={() => {
              soundManager.playKeyTap();
              onClose();
            }}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-xl text-xs sm:text-sm transition-colors shadow-2xs cursor-pointer"
          >
            Готово
          </button>
        </div>
      </div>
    </div>
  );
}
