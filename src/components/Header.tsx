import React, { useState } from 'react';
import {
  AlertTriangle,
  Award,
  BarChart3,
  CheckCircle2,
  Flame,
  LayoutDashboard,
  MapPin,
  RefreshCw,
  Shield,
  Smartphone,
  Trophy,
  Wifi,
  WifiOff,
  Scan,
  MessageSquare,
  Radio,
  Palette,
  User,
  KeyRound,
  ShieldAlert,
  Bot,
  ListFilter,
  FileText,
  Video,
  Cpu,
  Layers,
} from 'lucide-react';
import { AuthUser, ColorPalette, Language, LiveIncidentStreamSession, SafetyUser, ThemeMode } from '../types';
import { getT } from '../utils/translations';

export type NavTab = 'field' | 'management' | 'heatmap' | 'rootcause' | 'gamification' | 'system_admin';

interface HeaderProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isOffline: boolean;
  onToggleOffline: () => void;
  offlineQueueCount: number;
  onSyncOfflineQueue: () => void;
  criticalCount: number;
  currentUser: SafetyUser;
  authUser: AuthUser | null;
  onOpenAdminLogin: () => void;
  onOpenUserLogin: () => void;
  onOpenRadar?: () => void;
  onOpenHistoryLog?: () => void;
  onOpenChat: () => void;
  onOpenHseCommand: () => void;
  onOpenThemePalette: () => void;
  onOpenBotConfig?: () => void;
  onOpenDropdownManager?: () => void;
  onOpenLiveStream?: () => void;
  isLiveStreamActive?: boolean;
  activeLiveSession?: LiveIncidentStreamSession | null;
  isOffHoursSimulated?: boolean;
  language: Language;
  themeMode: ThemeMode;
  colorPalette: ColorPalette;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  isOffline,
  onToggleOffline,
  offlineQueueCount,
  onSyncOfflineQueue,
  criticalCount,
  currentUser,
  authUser,
  onOpenAdminLogin,
  onOpenUserLogin,
  onOpenRadar,
  onOpenHistoryLog,
  onOpenChat,
  onOpenHseCommand,
  onOpenThemePalette,
  onOpenBotConfig,
  onOpenDropdownManager,
  onOpenLiveStream,
  isLiveStreamActive,
  activeLiveSession,
  isOffHoursSimulated,
  language,
}) => {
  const t = getT(language);
  const [stopClickCount, setStopClickCount] = useState<number>(0);
  const [clickTimer, setClickTimer] = useState<any>(null);

  const handleStopBrandClick = () => {
    const nextCount = stopClickCount + 1;
    setStopClickCount(nextCount);

    if (clickTimer) clearTimeout(clickTimer);

    if (nextCount >= 5) {
      setStopClickCount(0);
      onOpenUserLogin(); // Opens the two-section login modal
    } else {
      const timer = setTimeout(() => {
        setStopClickCount(0);
      }, 3000);
      setClickTimer(timer);
    }
  };

  const isSysAdmin = authUser?.role === 'SYSTEM_ADMIN';
  const isHseDirector = authUser?.role === 'HSE_GENERAL_DIRECTOR';
  const isHseAdmin = authUser?.role === 'HSE_ADMIN';

  // System Admin Navigation Tabs
  const sysAdminTabs: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'field', label: t.fieldApp, icon: <Smartphone className="w-4 h-4" /> },
    { id: 'management', label: t.managementDashboard, icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'heatmap', label: t.heatmaps, icon: <MapPin className="w-4 h-4" /> },
    { id: 'rootcause', label: t.rootCause, icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'gamification', label: t.safetyHeroes, icon: <Trophy className="w-4 h-4" /> },
    { id: 'system_admin', label: 'لوحة تحكم مدير النظام', icon: <Cpu className="w-4 h-4 text-purple-400" /> },
  ];

  // Standard Field Worker Tabs
  const employeeTabs: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'field', label: t.fieldApp, icon: <Smartphone className="w-4 h-4" /> },
    { id: 'gamification', label: t.safetyHeroes, icon: <Trophy className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800">
      {/* Top Banner if Live Stream is Active */}
      {isLiveStreamActive && (
        <div className="bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 text-white px-4 py-2 flex items-center justify-between text-xs font-bold shadow-lg animate-pulse">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 animate-ping text-white" />
            <span>
              🚨 بث مباشر ميداني جارٍ لحادث وشيك في {activeLiveSession?.stationName || 'الموقع'}!
            </span>
          </div>
          {onOpenLiveStream && (
            <button
              type="button"
              onClick={onOpenLiveStream}
              className="px-3 py-1 bg-white text-rose-700 rounded-lg font-black hover:bg-slate-100 transition shadow"
            >
              مشاهدة البث المباشر الآن
            </button>
          )}
        </div>
      )}

      {/* Main Top Header Line */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand & Secret Quick Access */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center text-slate-950 shadow-md shadow-amber-950/40">
              <Shield className="w-6 h-6 stroke-[2.5]" />
            </div>

            <div className="select-none">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleStopBrandClick}
                  className="group relative text-left focus:outline-none transition-transform active:scale-95 cursor-pointer"
                  title="نقر 5 مرات يفتح بوابة التحقق السريع"
                >
                  <h1 className="text-xl sm:text-2xl font-black tracking-wider uppercase text-slate-100 font-mono group-hover:text-amber-400 transition-colors">
                    STOP
                  </h1>
                  {stopClickCount > 0 && stopClickCount < 5 && (
                    <span className="absolute -top-1 -right-6 px-1.5 py-0.2 bg-amber-500 text-slate-950 text-[9px] font-black rounded-full animate-bounce">
                      {stopClickCount}/5
                    </span>
                  )}
                </button>

                <span className="text-[10px] font-mono uppercase bg-amber-500/15 text-amber-400 px-2 py-0.5 rounded-md border border-amber-500/30 font-bold">
                  HSE
                </span>

                {isHseDirector && (
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/50 px-2 py-0.5 rounded-md font-black flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3 text-amber-400" />
                    <span>المدير العام (HSE)</span>
                  </span>
                )}

                {isSysAdmin && (
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/50 px-2 py-0.5 rounded-md font-bold flex items-center gap-1 animate-pulse">
                    <Cpu className="w-3 h-3 text-purple-400" />
                    <span>مدير التطبيق والنظام</span>
                  </span>
                )}
              </div>

              <div className="flex flex-col text-[11px] leading-snug">
                <span className="font-semibold text-slate-200 tracking-wide">
                  {isHseDirector ? 'الإدارة العامة للسلامة والصحة المهنية' : t.appSubtitle}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {t.appSubtitleAr}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Mobile Action for Live Stream */}
          <div className="flex items-center gap-1.5 md:hidden">
            {onOpenLiveStream && (
              <button
                type="button"
                onClick={onOpenLiveStream}
                className="p-2 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40"
                title="بث مباشر ميداني للحوادث الوشيكة"
              >
                <Radio className="w-4 h-4 text-rose-400" />
              </button>
            )}
            <button
              type="button"
              onClick={onOpenThemePalette}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 border border-slate-700"
            >
              <Palette className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Global Action Header Items (Context Aware) */}
        <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto justify-end">
          {/* Emergency Near-Miss Live Stream Button (Accessible across system) */}
          {onOpenLiveStream && (
            <button
              type="button"
              onClick={onOpenLiveStream}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-rose-600/30 to-red-600/30 hover:from-rose-600/40 hover:to-red-600/40 text-rose-300 border border-rose-500/50 rounded-xl text-xs font-bold transition shadow-sm"
              title="فتح بث مباشر من الكاميرا للحوادث الوشيكة مع إطلاق إنذار صوتي"
            >
              <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span>{isLiveStreamActive ? '🚨 بث مباشر نشط' : 'بث مباشر للحوادث'}</span>
            </button>
          )}

          {/* Dropdown Options Manager Button - STRICTLY SYSTEM ADMIN ONLY */}
          {isSysAdmin && onOpenDropdownManager && (
            <button
              type="button"
              onClick={onOpenDropdownManager}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-purple-950/70 hover:bg-purple-900/70 text-purple-200 border border-purple-800 rounded-xl text-xs font-bold transition shadow-sm"
              title="تعديل وتخصيص القوائم المنسدلة للتطبيق (خاص بمدير النظام فقط)"
            >
              <ListFilter className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">القوائم المنسدلة (Admin)</span>
            </button>
          )}

          {/* AI Camera Radar Button - STRICTLY SYSTEM ADMIN ONLY */}
          {isSysAdmin && onOpenRadar && (
            <button
              type="button"
              onClick={onOpenRadar}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-950/60 hover:bg-cyan-900/70 text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-bold transition shadow-sm"
              title="رادار الكاميرا والحرارة الذكي (خاص بمدير النظام)"
            >
              <Scan className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
              <span>رادار الكاميرا والحرارة</span>
            </button>
          )}

          {/* Palette & Theme Customizer Button */}
          <button
            type="button"
            onClick={onOpenThemePalette}
            className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl transition"
            title="بنتونة ألوان التطبيق والوضع النهاري/الليلي واللغة"
          >
            <Palette className="w-4 h-4 text-amber-400" />
          </button>

          {/* User Account / Login Pill */}
          <button
            type="button"
            onClick={onOpenUserLogin}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 px-3 py-1.5 rounded-xl transition text-right"
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
              isHseDirector ? 'bg-amber-400 text-slate-950 font-black' : isSysAdmin ? 'bg-purple-600 text-white font-black' : 'bg-slate-700 text-amber-300'
            }`}>
              {authUser ? authUser.name[0] : currentUser.name[0]}
            </div>
            <div className="truncate max-w-[120px] hidden sm:block">
              <span className="text-xs font-bold text-slate-200 block truncate">
                {authUser ? authUser.name.split(' ')[0] : currentUser.name.split(' ')[0]}
              </span>
              <span className="text-[10px] text-amber-400 font-mono block">
                {isHseDirector ? 'المدير العام (HSE)' : isSysAdmin ? 'مدير النظام' : `${currentUser.points} نقطة`}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CASE A: HSE GENERAL DIRECTOR SPECIAL BAR (مسطرة مدير عام الإدارة العامة للسلامة) */}
      {/* Strictly contains: بوت الطوارئ - مكتبة سجل رصد الكاميرا - شات السلامة الداخلى - مركز تحكم hse - خرائط النقاط الساخنة - تحليل الاسباب الجذرية - ابطال السلامة */}
      {/* ========================================================================= */}
      {isHseDirector ? (
        <div className="bg-slate-900/90 border-t border-amber-500/30 py-2 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              {/* 1. بوت الطوارئ */}
              {onOpenBotConfig && (
                <button
                  type="button"
                  onClick={onOpenBotConfig}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30"
                  title="بوت إدارة الطوارئ خارج أوقات العمل"
                >
                  <Bot className="w-3.5 h-3.5 text-emerald-400" />
                  <span>بوت الطوارئ</span>
                </button>
              )}

              {/* 2. مكتبة سجل رصد الكاميرا */}
              {onOpenHistoryLog && (
                <button
                  type="button"
                  onClick={onOpenHistoryLog}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold transition"
                  title="مكتبة سجل رصد الكاميرا والوسائط والوقائع الميدانية"
                >
                  <Video className="w-3.5 h-3.5 text-amber-400" />
                  <span>مكتبة سجل رصد الكاميرا</span>
                </button>
              )}

              {/* 3. شات السلامة الداخلي */}
              <button
                type="button"
                onClick={onOpenChat}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition"
                title="قنوات الاتصال الميداني المباشر"
              >
                <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                <span>شات السلامة الداخلي</span>
              </button>

              <span className="h-5 w-px bg-slate-800 mx-1"></span>

              {/* 4. مركز تحكم HSE */}
              <button
                type="button"
                onClick={() => onSelectTab('management')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  currentTab === 'management'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>مركز تحكم HSE</span>
              </button>

              {/* 5. خرائط النقاط الساخنة */}
              <button
                type="button"
                onClick={() => onSelectTab('heatmap')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  currentTab === 'heatmap'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>خرائط النقاط الساخنة</span>
              </button>

              {/* 6. تحليل الأسباب الجذرية */}
              <button
                type="button"
                onClick={() => onSelectTab('rootcause')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  currentTab === 'rootcause'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>تحليل الأسباب الجذرية</span>
              </button>

              {/* 7. أبطال السلامة */}
              <button
                type="button"
                onClick={() => onSelectTab('gamification')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  currentTab === 'gamification'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Trophy className="w-4 h-4" />
                <span>أبطال السلامة</span>
              </button>
            </div>

            {/* Quick Field App preview for General Director if desired */}
            <button
              type="button"
              onClick={() => onSelectTab('field')}
              className={`text-[11px] px-2.5 py-1 rounded-lg border font-semibold transition ${
                currentTab === 'field'
                  ? 'bg-slate-800 text-amber-300 border-amber-500/40'
                  : 'text-slate-400 border-transparent hover:text-slate-200'
              }`}
            >
              استمارة الرصد الميداني
            </button>
          </div>
        </div>
      ) : isSysAdmin ? (
        /* ========================================================================= */
        /* CASE B: SYSTEM ADMIN MAIN NAVIGATION BAR (المسطرة الرئيسية لمدير التطبيق) */
        /* ========================================================================= */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-1.5 overflow-x-auto no-scrollbar py-1.5 border-t border-slate-900">
          <div className="flex items-center gap-1.5">
            {sysAdminTabs.map((tab) => {
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onSelectTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? tab.id === 'system_admin'
                        ? 'bg-purple-600 text-white shadow-md font-black'
                        : 'bg-amber-500 text-slate-950 shadow-md font-black'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            {onOpenHistoryLog && (
              <button
                type="button"
                onClick={onOpenHistoryLog}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold transition whitespace-nowrap"
              >
                <Video className="w-3.5 h-3.5 text-amber-400" />
                <span>مكتبة سجل رصد الكاميرا</span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenChat}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition whitespace-nowrap"
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
              <span>الشات</span>
            </button>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* CASE C: EMPLOYEE & FIELD WORKERS NAVIGATION BAR (شريط العاملين) */
        /* ========================================================================= */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-1.5 overflow-x-auto no-scrollbar py-1.5 border-t border-slate-900">
          <div className="flex items-center gap-1.5">
            {employeeTabs.map((tab) => {
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onSelectTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            {onOpenHistoryLog && (
              <button
                type="button"
                onClick={onOpenHistoryLog}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold transition"
              >
                <Video className="w-3.5 h-3.5 text-amber-400" />
                <span>مكتبة سجل رصد الكاميرا</span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenChat}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition"
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
              <span>شات السلامة</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
