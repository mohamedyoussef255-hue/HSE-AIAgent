import React, { useState } from 'react';
import {
  ArrowRight,
  Home,
  LogOut,
  Smartphone,
  LayoutDashboard,
  MapPin,
  BarChart3,
  Trophy,
  Cpu,
  ShieldAlert,
  Sparkles,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';
import { AuthUser, Language, AppUiCustomization } from '../types';
import { NavTab } from './Header';
import { StopSignLogo } from './StopSignLogo';

interface UniversalNavigationBarProps {
  currentTab: NavTab;
  tabHistory: NavTab[];
  onGoBack: () => void;
  onGoHome: () => void;
  onLogoutToLogin: () => void;
  onOpenAdminLogin: () => void;
  onSelectTab: (tab: NavTab) => void;
  authUser: AuthUser | null;
  adminPassword?: string;
  language: Language;
  uiConfig?: AppUiCustomization;
}

export const UniversalNavigationBar: React.FC<UniversalNavigationBarProps> = ({
  currentTab,
  tabHistory,
  onGoBack,
  onGoHome,
  onLogoutToLogin,
  onOpenAdminLogin,
  onSelectTab,
  authUser,
  adminPassword = '0000',
  language,
  uiConfig,
}) => {
  const [stopClickCount, setStopClickCount] = useState<number>(0);
  const [clickTimer, setClickTimer] = useState<any>(null);

  const handleStopLogoClick = () => {
    const nextCount = stopClickCount + 1;
    setStopClickCount(nextCount);

    if (clickTimer) clearTimeout(clickTimer);

    if (nextCount >= 5) {
      setStopClickCount(0);
      onOpenAdminLogin();
    } else {
      const timer = setTimeout(() => {
        setStopClickCount(0);
      }, 3000);
      setClickTimer(timer);
    }
  };

  const isRtl = language === 'ar';

  const tabLabels: Record<NavTab, { title: string; subtitle: string; icon: React.ReactNode }> = {
    field: {
      title: 'تطبيق الميدان',
      subtitle: 'Field Observation & Reporting',
      icon: <Smartphone className="w-4 h-4 text-emerald-400" />,
    },
    management: {
      title: 'لوحة الإدارة العليا',
      subtitle: 'HSE Executive Dashboard',
      icon: <LayoutDashboard className="w-4 h-4 text-amber-400" />,
    },
    heatmap: {
      title: 'خرائط النقاط الساخنة',
      subtitle: 'Geographic Risk Heatmaps',
      icon: <MapPin className="w-4 h-4 text-rose-400" />,
    },
    rootcause: {
      title: 'تحليل الأسباب الجذرية',
      subtitle: 'Root Cause Analytics',
      icon: <BarChart3 className="w-4 h-4 text-blue-400" />,
    },
    gamification: {
      title: 'أبطال السلامة والمكافآت',
      subtitle: 'Safety Heroes & Rewards',
      icon: <Trophy className="w-4 h-4 text-amber-400" />,
    },
    system_admin: {
      title: 'لوحة تحكم مدير النظام',
      subtitle: 'System Admin Control Panel',
      icon: <Cpu className="w-4 h-4 text-purple-400" />,
    },
  };

  const currentInfo = tabLabels[currentTab] || tabLabels.field;
  const isSysAdmin = authUser?.role === 'SYSTEM_ADMIN';
  const hasHistory = tabHistory.length > 0;

  return (
    <nav
      data-banner="true"
      aria-label="Universal Navigation Bar"
      className="w-full bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-md sticky top-0 z-30 px-3 sm:px-5 py-2.5 transition-all"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
        {/* Right Section (Logo 5-Clicks + Current Page Title & Status) */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          <div className="flex items-center gap-2.5">
            {/* STOP Logo with 5-click counter */}
            <div className="relative">
              <button
                type="button"
                onClick={handleStopLogoClick}
                className="shrink-0 p-1 rounded-2xl hover:bg-slate-900 transition-all cursor-pointer active:scale-95 focus:outline-none relative group"
                title="اضغط 5 مرات للدخول كمدير نظام (كلمة السر 0000)"
              >
                <StopSignLogo className="w-9 h-9 sm:w-10 sm:h-10" withGlow />
                {stopClickCount > 0 && stopClickCount < 5 && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-rose-600 text-white text-[10px] font-black rounded-full animate-bounce shadow border border-white">
                    {stopClickCount}/5
                  </span>
                )}
              </button>
            </div>

            {/* Current Page Identity */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-white">
                  {currentInfo.icon}
                  {currentInfo.title}
                </span>

                {isSysAdmin ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    مدير النظام (تحكم كامل)
                  </span>
                ) : authUser?.role === 'HSE_GENERAL_DIRECTOR' ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    المدير العام HSE
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    فني ميداني
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-400 font-mono hidden sm:inline-block">
                {currentInfo.subtitle}
              </span>
            </div>
          </div>

          {/* Mobile Quick Action Buttons Trigger (on mobile) */}
          <div className="flex md:hidden items-center gap-1">
            <button
              type="button"
              onClick={onGoBack}
              disabled={!hasHistory && currentTab === 'field'}
              className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                hasHistory || currentTab !== 'field'
                  ? 'bg-slate-800 text-amber-300 hover:bg-slate-700'
                  : 'bg-slate-900/50 text-slate-600 cursor-not-allowed'
              }`}
              title="تراجع للصفحة السابقة"
            >
              <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-0' : 'rotate-180'}`} />
            </button>
            <button
              type="button"
              onClick={onGoHome}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold transition"
              title="العودة للرئيسية"
            >
              <Home className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onLogoutToLogin}
              className="p-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/60 text-xs font-bold transition"
              title="الخروج لشاشة الدخول"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center / Navigation Tabs for Quick Switch (visible to admins or larger screens) */}
        {(isSysAdmin || authUser?.role === 'HSE_GENERAL_DIRECTOR') && (
          <div className="hidden lg:flex items-center gap-1 bg-slate-900/90 p-1 rounded-2xl border border-slate-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => onSelectTab('field')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                currentTab === 'field'
                  ? 'bg-amber-500 text-slate-950 font-black shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>الميدان</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('management')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                currentTab === 'management'
                  ? 'bg-amber-500 text-slate-950 font-black shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>الإدارة</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('heatmap')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                currentTab === 'heatmap'
                  ? 'bg-amber-500 text-slate-950 font-black shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>الخرائط</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('rootcause')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                currentTab === 'rootcause'
                  ? 'bg-amber-500 text-slate-950 font-black shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>الأسباب</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('gamification')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                currentTab === 'gamification'
                  ? 'bg-amber-500 text-slate-950 font-black shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>الأبطال</span>
            </button>

            {isSysAdmin && (
              <button
                type="button"
                onClick={() => onSelectTab('system_admin')}
                className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                  currentTab === 'system_admin'
                    ? 'bg-purple-600 text-white font-black shadow'
                    : 'text-purple-300 hover:text-white hover:bg-purple-950/50'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>لوحة التحكم</span>
              </button>
            )}
          </div>
        )}

        {/* Left Section - The 3 Universal Action Buttons (Always Available on All Pages) */}
        <div className="hidden md:flex items-center gap-2 flex-wrap">
          {/* 1. زر التراجع للصفحة السابقة */}
          <button
            type="button"
            onClick={onGoBack}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm border ${
              hasHistory || currentTab !== 'field'
                ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-amber-500/30 cursor-pointer active:scale-95'
                : 'bg-slate-900/60 text-slate-500 border-slate-800 cursor-not-allowed opacity-70'
            }`}
            title="تراجع للصفحة السابقة في سجل التنقل"
          >
            <ArrowRight className={`w-4 h-4 text-amber-400 ${isRtl ? 'rotate-0' : 'rotate-180'}`} />
            <span>تراجع للصفحة السابقة</span>
          </button>

          {/* 2. زر الخروج والعودة للرئيسية */}
          <button
            type="button"
            onClick={onGoHome}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm border ${
              currentTab === 'field'
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 hover:border-emerald-500/40 cursor-pointer active:scale-95'
            }`}
            title="الخروج والعودة للصفحة الرئيسية (تطبيق الميدان)"
          >
            <Home className="w-4 h-4 text-emerald-400" />
            <span>العودة للرئيسية</span>
          </button>

          {/* 3. زر الخروج والعودة إلى شاشة الدخول */}
          <button
            type="button"
            onClick={onLogoutToLogin}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/70 hover:bg-rose-900/90 text-rose-200 border border-rose-800/80 text-xs font-bold transition shadow-sm cursor-pointer active:scale-95"
            title="تسجيل الخروج والعودة لشاشة تسجيل الدخول"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>الخروج لشاشة الدخول</span>
          </button>

          {/* مدير النظام يظهر حصرياً فقط وفقط لمدير النظام المسجل دخوله بالفعل */}
          {isSysAdmin && (
            <button
              type="button"
              onClick={() => onSelectTab('system_admin')}
              className="px-2.5 py-1.5 rounded-xl bg-purple-950/70 hover:bg-purple-900/90 border border-purple-500/50 text-purple-300 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              title="لوحة تحكم مدير النظام"
            >
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
              <span>لوحة التحكم</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
