import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  Gift,
  HelpCircle,
  Medal,
  Shield,
  ShieldAlert,
  Sparkles,
  Star,
  Trophy,
  User,
  Users,
  Zap,
} from 'lucide-react';
import { SafetyUser } from '../types';

interface GamificationViewProps {
  users: SafetyUser[];
  currentUser: SafetyUser;
  onClaimReward?: (rewardName: string, cost: number) => void;
}

export const GamificationView: React.FC<GamificationViewProps> = ({
  users,
  currentUser,
}) => {
  const [claimedReward, setClaimedReward] = useState<string | null>(null);
  const [userPoints, setUserPoints] = useState<number>(currentUser.points);

  const rewards = [
    {
      id: 'RWD-01',
      title: 'درع التميز وشهادة تقدير معتمدة من مدير السلامة',
      points: 750,
      icon: '🏆',
      desc: 'تكريم رسمي في الحفل الختامي للربع السنوي لتعزيز الالتزام.',
    },
    {
      id: 'RWD-02',
      title: 'قسيمة شراء وتجهيزات شخصية بقيمة 1,500 جنيه مصري',
      points: 1000,
      icon: '🎁',
      desc: 'قسيمة شرائية للمتاجر الشريكة المعتمدة لمهمات السلامة والوقاية.',
    },
    {
      id: 'RWD-03',
      title: 'يوم إجازة تشجيعية مدفوعة الأجر (Safety Day Off)',
      points: 1500,
      icon: '🏖️',
      desc: 'مكافأة تشجيعية من الإدارة للموظفين الأكثر التزاماً برصد المخاطر.',
    },
    {
      id: 'RWD-04',
      title: 'أولوية الترشح للبرامج القيادية ودورات OSHA المتقدمة',
      points: 1800,
      icon: '⭐',
      desc: 'تمويل كامل لدورة إشرافية دولية متقدمة في الصحة والسلامة.',
    },
  ];

  const handleClaim = (reward: (typeof rewards)[0]) => {
    if (userPoints < reward.points) {
      alert(`عذراً، تحتاج إلى ${reward.points - userPoints} نقطة إضافية لاستبدال هذه المكافأة.`);
      return;
    }

    setUserPoints((prev) => prev - reward.points);
    setClaimedReward(reward.title);
    setTimeout(() => {
      setClaimedReward(null);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
              <Trophy className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-black text-slate-100">
              نظام التحفيز وأبطال السلامة (Safety Champions & Gamification)
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            ترسيخ ثقافة السلامة الاستباقية ومكافأة الموظفين الميدانيين على رصد المخاطر والتدخل لمنع الحوادث
          </p>
        </div>

        {/* Current User Live Wallet */}
        <div className="bg-gradient-to-r from-amber-500/20 via-slate-950 to-slate-950 p-3.5 rounded-2xl border border-amber-500/40 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-black text-base shadow">
            {currentUser.name[0]}
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">رصيد نقاط السلامة الخاص بك:</span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-amber-400 font-mono">{userPoints}</span>
              <span className="text-xs text-slate-300 font-semibold">نقطة أمان 🛡️</span>
            </div>
          </div>
        </div>
      </div>

      {/* Claimed Toast */}
      {claimedReward && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl text-emerald-200 text-xs flex items-center justify-between animate-fadeIn shadow-lg">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            مبروك! تم إرسال طلب استبدال: <strong>"{claimedReward}"</strong> لإدارة الموارد البشرية والسلامة.
          </span>
          <span className="text-xs font-mono font-bold text-emerald-400">تم الخصم بنجاح ✓</span>
        </div>
      )}

      {/* Rules & Points Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-rose-950/60 flex items-start gap-3">
          <div className="p-2.5 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20 shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-rose-300 text-sm block">رصد خطر حرج محقق</span>
            <span className="text-xl font-black text-rose-400 font-mono mt-0.5 block">+50 نقطة</span>
            <p className="text-slate-400 mt-1 text-[11px]">
              تسجيل تسريب وقود، أو عطل بنظام الإطفاء، أو خطورة صعق كهربائي فوري.
            </p>
          </div>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-2xl border border-amber-950/60 flex items-start gap-3">
          <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20 shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-amber-300 text-sm block">تصحيح تصرف غير آمن</span>
            <span className="text-xl font-black text-amber-400 font-mono mt-0.5 block">+35 نقطة</span>
            <p className="text-slate-400 mt-1 text-[11px]">
              توجيه زميل لارتداء مهمات الوقاية، أو التوقف عن السرعة في الممرات.
            </p>
          </div>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-2xl border border-emerald-950/60 flex items-start gap-3">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-emerald-300 text-sm block">توثيق ممارسة آمنة</span>
            <span className="text-xl font-black text-emerald-400 font-mono mt-0.5 block">+25 نقطة</span>
            <p className="text-slate-400 mt-1 text-[11px]">
              الإشادة بفريق يطبق نظام LOTO أو يلتزم بتصاريح العمل الساخن بالكامل.
            </p>
          </div>
        </div>
      </div>

      {/* Leaderboard and Rewards Store */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Champions Leaderboard (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              لوحة شرف أبطال السلامة بالشركة (Safety Leaderboard)
            </h3>
            <span className="text-xs text-slate-400 font-mono">الترتيب الأسبوعي</span>
          </div>

          <div className="space-y-3">
            {users.map((u, index) => {
              const isTop = index === 0;
              return (
                <div
                  key={u.id}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                    isTop
                      ? 'bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-950 border-amber-500/40 shadow-sm'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    {/* Rank Badge */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs font-mono shadow ${
                        index === 0
                          ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300'
                          : index === 1
                          ? 'bg-slate-300 text-slate-950'
                          : index === 2
                          ? 'bg-amber-700 text-amber-100'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {index + 1}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-100">{u.name}</span>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                          {u.badgeNumber}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {u.role} • {u.department}
                      </p>

                      {/* Badges List */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {u.badges.map((b) => (
                          <span
                            key={b}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-amber-300 border border-amber-500/30 font-medium"
                          >
                            🛡️ {b}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="text-left font-mono">
                    <span className="text-lg font-black text-amber-400 block">
                      {u.points}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {u.totalCards} بطاقة STOP
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Rewards Marketplace (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Gift className="w-4 h-4 text-emerald-400" />
              سوق المكافآت والحوافز (Rewards Store)
            </h3>
            <span className="text-xs text-slate-400 font-mono">معتمدة من الإدارة</span>
          </div>

          <div className="space-y-3">
            {rewards.map((r) => {
              const canAfford = userPoints >= r.points;
              return (
                <div
                  key={r.id}
                  className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{r.icon}</span>
                      <span className="font-bold text-xs text-slate-200">{r.title}</span>
                    </div>
                    <span className="font-mono font-bold text-xs text-amber-400 shrink-0 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                      {r.points} نقطة
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400">{r.desc}</p>

                  <button
                    type="button"
                    onClick={() => handleClaim(r)}
                    disabled={!canAfford}
                    className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                      canAfford
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? 'استبدال الآن بنقاطك' : `تحتاج ${r.points - userPoints} نقطة`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
