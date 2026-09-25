import React, { useState } from 'react';
import {
  Trophy,
  Gift,
  Award,
  Star,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  X,
  Sparkles,
  Users,
  ShieldCheck,
  Save,
} from 'lucide-react';
import { Language, RewardItem, SafetyUser } from '../types';

interface PointsRewardsControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  rewards: RewardItem[];
  onSaveRewards: (rewards: RewardItem[]) => void;
  users: SafetyUser[];
  onUpdateUserPoints: (userId: string, newPoints: number) => void;
  language: Language;
}

export const PointsRewardsControlModal: React.FC<PointsRewardsControlModalProps> = ({
  isOpen,
  onClose,
  rewards,
  onSaveRewards,
  users,
  onUpdateUserPoints,
  language,
}) => {
  const [currentRewards, setCurrentRewards] = useState<RewardItem[]>(rewards);
  const [activeTab, setActiveTab] = useState<'rewards' | 'users'>('rewards');

  // New reward form states
  const [newTitle, setNewTitle] = useState('');
  const [newPoints, setNewPoints] = useState(500);
  const [newIcon, setNewIcon] = useState('🏆');
  const [newDesc, setNewDesc] = useState('');

  // Editing existing reward
  const [editingRewardId, setEditingRewardId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPoints, setEditPoints] = useState(500);
  const [editDesc, setEditDesc] = useState('');

  // User point adjustments
  const [selectedUserId, setSelectedUserId] = useState<string>(users[0]?.id || '');
  const [pointsAdjustment, setPointsAdjustment] = useState<number>(100);
  const [savedNotice, setSavedNotice] = useState(false);

  if (!isOpen) return null;

  const handleAddReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newReward: RewardItem = {
      id: `RWD-${Date.now()}`,
      title: newTitle.trim(),
      points: Number(newPoints),
      icon: newIcon || '🎁',
      desc: newDesc.trim() || 'مكافأة معتمدة من إدارة السلامة والصحة المهنية',
      active: true,
    };

    const updated = [...currentRewards, newReward];
    setCurrentRewards(updated);
    onSaveRewards(updated);

    setNewTitle('');
    setNewPoints(500);
    setNewDesc('');
    showSuccess();
  };

  const handleDeleteReward = (id: string) => {
    const updated = currentRewards.filter((r) => r.id !== id);
    setCurrentRewards(updated);
    onSaveRewards(updated);
    showSuccess();
  };

  const handleStartEdit = (reward: RewardItem) => {
    setEditingRewardId(reward.id);
    setEditTitle(reward.title);
    setEditPoints(reward.points ?? reward.pointsRequired ?? 50);
    setEditDesc(reward.desc ?? reward.description ?? '');
  };

  const handleSaveEdit = (id: string) => {
    const updated = currentRewards.map((r) =>
      r.id === id ? { ...r, title: editTitle, points: Number(editPoints), desc: editDesc } : r
    );
    setCurrentRewards(updated);
    onSaveRewards(updated);
    setEditingRewardId(null);
    showSuccess();
  };

  const handleAdjustPoints = (isAddition: boolean) => {
    const targetUser = users.find((u) => u.id === selectedUserId);
    if (!targetUser) return;

    const delta = isAddition ? pointsAdjustment : -pointsAdjustment;
    const nextPoints = Math.max(0, targetUser.points + delta);
    onUpdateUserPoints(targetUser.id, nextPoints);
    showSuccess();
  };

  const showSuccess = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border-2 border-amber-500/60 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 text-slate-100 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 left-5 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black uppercase">
              لوحة التحكم الإدارية • Control Panel
            </span>
            <h3 className="text-lg font-black text-white mt-0.5">
              إدارة وتعديل نظام النقاط والمكافآت (Points & Rewards Manager)
            </h3>
            <p className="text-xs text-slate-400">
              تخصيص تكلفة المكافآت بالنقاط، إضافة حوافز جديدة، وتعديل أرصدة نقاط العاملين والمشرفين
            </p>
          </div>
        </div>

        {/* Top Tabs */}
        <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('rewards')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === 'rewards'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>قائمة المكافآت والحوافز المعتمدة ({currentRewards.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === 'users'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>أرصدة نقاط العاملين والموظفين</span>
          </button>
        </div>

        {/* Tab 1: Manage Rewards */}
        {activeTab === 'rewards' && (
          <div className="space-y-4">
            {/* Add New Reward Form */}
            <form onSubmit={handleAddReward} className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Plus className="w-4 h-4" /> إضافة مكافأة تحفيزية جديدة للنظام:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="عنوان المكافأة (مثال: قسيمة شراء 2,000 ج.م)"
                  className="sm:col-span-2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 outline-none focus:border-amber-400"
                />
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 shrink-0">النقاط:</span>
                  <input
                    type="number"
                    value={newPoints}
                    onChange={(e) => setNewPoints(Number(e.target.value))}
                    min={50}
                    step={50}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 shrink-0">الأيقونة:</span>
                  <select
                    value={newIcon}
                    onChange={(e) => setNewIcon(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-2 text-slate-100 outline-none focus:border-amber-400 text-base"
                  >
                    <option value="🏆">🏆 كأس التميز</option>
                    <option value="🎁">🎁 هدية وقسيمة</option>
                    <option value="🏖️">🏖️ إجازة مدفوعة</option>
                    <option value="⭐">⭐ دورة تدريبية</option>
                    <option value="🥇">🥇 وسام الشرف</option>
                    <option value="📱">📱 جهاز لوحي</option>
                  </select>
                </div>

                <input
                  type="text"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="وصف المكافأة والشروط..."
                  className="sm:col-span-3 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition flex items-center justify-center gap-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>حفظ وإدراج المكافأة في صفحة أبطال السلامة</span>
              </button>
            </form>

            {/* List of Rewards */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300">المكافآت الحالية المسجلة بالنظام:</span>
              <div className="space-y-2">
                {currentRewards.map((reward) => {
                  const isEditing = editingRewardId === reward.id;

                  return (
                    <div
                      key={reward.id}
                      className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      {isEditing ? (
                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-100"
                          />
                          <div className="flex gap-2">
                            <input
                              type="number"
                              value={editPoints}
                              onChange={(e) => setEditPoints(Number(e.target.value))}
                              className="w-32 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-100 font-mono"
                            />
                            <input
                              type="text"
                              value={editDesc}
                              onChange={(e) => setEditDesc(e.target.value)}
                              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-100"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{reward.icon}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="font-bold text-white text-xs">{reward.title}</h5>
                              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold text-[11px]">
                                {reward.points} نقطة
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5">{reward.desc}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                        {isEditing ? (
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(reward.id)}
                            className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition"
                            title="حفظ التعديل"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleStartEdit(reward)}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                            title="تعديل المكافأة"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDeleteReward(reward.id)}
                          className="p-2 rounded-lg bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 transition"
                          title="حذف المكافأة"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Manage User Points */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                <Users className="w-4 h-4" /> تعديل أو منح نقاط تشجيعية للموظفين:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">اختر الموظف:</label>
                  <select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 outline-none focus:border-purple-400"
                  >
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} - ({u.points} نقطة) - {u.role}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">قيمة النقاط للتعديل:</label>
                  <input
                    type="number"
                    value={pointsAdjustment}
                    onChange={(e) => setPointsAdjustment(Number(e.target.value))}
                    min={10}
                    step={50}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 outline-none focus:border-purple-400 font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleAdjustPoints(true)}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>منح +{pointsAdjustment} نقطة مكافأة للموظف</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleAdjustPoints(false)}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white font-bold text-xs transition flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>خصم -{pointsAdjustment} نقطة</span>
                </button>
              </div>
            </div>

            {/* Current Workers Points Table */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300">جدول نقاط الموظفين الحالي:</span>
              <div className="space-y-1.5 max-h-60 overflow-y-auto">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-white">{user.name}</span>
                      <span className="text-[10px] text-slate-400 block">{user.department}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono font-bold">
                        {user.points} نقطة
                      </span>
                      <span className="text-[10px] text-slate-400">{user.totalCards} بطاقة STOP</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {savedNotice && (
          <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs font-bold text-center animate-fadeIn flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>تم حفظ التعديلات بنجاح وربطها بنظام أبطال السلامة!</span>
          </div>
        )}
      </div>
    </div>
  );
};
