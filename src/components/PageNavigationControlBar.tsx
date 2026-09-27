import React from 'react';
import { ArrowRight, Home, LogOut, RotateCcw, Shield, Smartphone } from 'lucide-react';

interface PageNavigationControlBarProps {
  currentPageTitle: string;
  currentPageBadge?: string;
  badgeColor?: 'emerald' | 'amber' | 'purple' | 'rose' | 'sky' | 'blue';
  onGoBack?: () => void;
  onGoHome?: () => void;
  onLogout?: () => void;
  isHome?: boolean;
}

export const PageNavigationControlBar: React.FC<PageNavigationControlBarProps> = ({
  currentPageTitle,
  currentPageBadge,
  badgeColor = 'amber',
  onGoBack,
  onGoHome,
  onLogout,
  isHome = false,
}) => {
  const badgeClasses = {
    emerald: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    amber: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    purple: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    rose: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    sky: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    blue: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  }[badgeColor];

  return (
    <div className="bg-slate-900/90 border border-slate-800 p-2.5 sm:p-3 rounded-2xl shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 animate-fadeIn">
      {/* Navigation & Return Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
        {/* 1. Back to Previous Page */}
        {onGoBack && !isHome && (
          <button
            type="button"
            onClick={onGoBack}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 hover:border-amber-500/40 text-xs font-bold transition shadow-sm active:scale-95 group cursor-pointer"
            title="التراجع والعودة للصفحة السابقة التي كنت فيها"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400 group-hover:-rotate-45 transition-transform" />
            <span>تراجع للصفحة السابقة</span>
          </button>
        )}

        {/* 2. Exit / Return to Main (Home / Field) */}
        {onGoHome && !isHome && (
          <button
            type="button"
            onClick={onGoHome}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl bg-emerald-600/25 hover:bg-emerald-600/35 text-emerald-200 border border-emerald-500/40 text-xs font-bold transition shadow-sm active:scale-95 group cursor-pointer"
            title="الخروج والعودة للشاشة الرئيسية (تطبيق الميدان وتسجيل الملاحظات)"
          >
            <Home className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span>العودة للرئيسية (الميدان)</span>
          </button>
        )}

        {/* 3. Exit to Login Screen */}
        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-500/40 text-xs font-bold transition shadow-sm active:scale-95 group cursor-pointer"
            title="تسجيل الخروج والعودة إلى شاشة الدخول الرئيسية"
          >
            <LogOut className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-400 transition-colors" />
            <span>تسجيل الخروج (شاشة الدخول)</span>
          </button>
        )}
      </div>

      {/* Current Page Identifier & Badge */}
      <div className="flex items-center gap-2 justify-end self-end sm:self-auto text-xs text-slate-400">
        <span className="hidden md:inline">أنت الآن في:</span>
        <span className={`px-2.5 py-1 rounded-xl text-xs font-black border flex items-center gap-1.5 ${badgeClasses}`}>
          <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
          <span>{currentPageTitle}</span>
          {currentPageBadge && <span className="opacity-80">({currentPageBadge})</span>}
        </span>
      </div>
    </div>
  );
};
