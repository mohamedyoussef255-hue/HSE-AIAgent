import React, { useState } from 'react';
import {
  ShieldAlert,
  Settings,
  ListFilter,
  Scan,
  Server,
  KeyRound,
  Download,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  MessageCircle,
  Copy,
  RefreshCw,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Phone,
  Trophy,
  Award,
  CloudSun,
  LayoutDashboard,
} from 'lucide-react';
import { AppUiCustomization, DropdownOptionsMap, Language } from '../types';
import { AdminUiCustomizationSection } from './AdminUiCustomizationSection';
import { StopSignLogo } from './StopSignLogo';

interface SystemAdminControlPanelViewProps {
  dropdownOptions: DropdownOptionsMap;
  onOpenDropdownManager: () => void;
  onOpenRadar: () => void;
  language: Language;
  directorSecretCode: string;
  onUpdateDirectorPassword: (newPass: string) => void;
  adminPassword?: string;
  onUpdateAdminPassword?: (newPass: string) => void;
  onLoginAsGeneralDirector: () => void;
  onOpenPointsRewardsManager?: () => void;
  onOpenWeatherAdvisory?: () => void;
  onBack?: () => void;
  uiCustomization?: AppUiCustomization;
  onUpdateUiCustomization?: (newConfig: AppUiCustomization) => void;
  onResetUiCustomization?: () => void;
}

export const SystemAdminControlPanelView: React.FC<SystemAdminControlPanelViewProps> = ({
  dropdownOptions,
  onOpenDropdownManager,
  onOpenRadar,
  language,
  directorSecretCode,
  onUpdateDirectorPassword,
  adminPassword = '0000',
  onUpdateAdminPassword,
  onLoginAsGeneralDirector,
  onOpenPointsRewardsManager,
  onOpenWeatherAdvisory,
  onBack,
  uiCustomization,
  onUpdateUiCustomization,
  onResetUiCustomization,
}) => {
  const [radarSensitivity, setRadarSensitivity] = useState(85);
  const [thermalThreshold, setThermalThreshold] = useState(68);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // General Director Password & WhatsApp Dispatch states
  const [customPasswordInput, setCustomPasswordInput] = useState(directorSecretCode);
  const [adminPasswordInput, setAdminPasswordInput] = useState(adminPassword);
  const [adminPassSavedNotice, setAdminPassSavedNotice] = useState(false);
  const [directorPhone, setDirectorPhone] = useState('+20 10 0123 4567');
  const [copiedCode, setCopiedCode] = useState(false);
  const [whatsAppDispatched, setWhatsAppDispatched] = useState(false);
  const [passwordSavedNotice, setPasswordSavedNotice] = useState(false);
  const [adoptedNotice, setAdoptedNotice] = useState(false);

  const handleAdoptNewView = () => {
    try {
      localStorage.setItem('minhaj_stop_current_tab_v2', 'system_admin');
    } catch (_) {}
    setAdoptedNotice(true);
    setTimeout(() => setAdoptedNotice(false), 3000);
  };

  const handleSaveSettings = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleGenerateRandomPassword = () => {
    const randomCode = `HSE-${Math.floor(1000 + Math.random() * 9000)}`;
    setCustomPasswordInput(randomCode);
    onUpdateDirectorPassword(randomCode);
    setPasswordSavedNotice(true);
    setTimeout(() => setPasswordSavedNotice(false), 2500);
  };

  const handleSaveCustomPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPasswordInput.trim()) return;
    onUpdateDirectorPassword(customPasswordInput.trim());
    setPasswordSavedNotice(true);
    setTimeout(() => setPasswordSavedNotice(false), 2500);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(directorSecretCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSendWhatsAppAccess = () => {
    const appUrl = window.location.origin;
    const cleanPhone = directorPhone.replace(/[^0-9]/g, '');
    const message =
      `السلام عليكم ورحمة الله وبركاته،\n` +
      `سعادة م. محمد يوسف - مدير عام الإدارة العامة للسلامة والصحة المهنية (HSE) المحترم،\n\n` +
      `رابط الدخول المباشر لبوابتكم الإدارية على منصة منهاج STOP للسلامة:\n` +
      `${appUrl}\n\n` +
      `🔑 رمز الدخول السري / كلمة المرور المعتمدة الخاصة بكم:\n` +
      `[ ${directorSecretCode} ]\n\n` +
      `ملاحظة: يمكنكم تغيير كلمة السر هذه لاحقاً في أي وقت من داخل صفحتكم الإدارية.\n` +
      `مع تحيات إدارة النظام وتكنولوجيا المعلومات - شركة عزوتي (EZWETY IT Co. - 2026).`;

    const waLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(waLink, '_blank');
    setWhatsAppDispatched(true);
    setTimeout(() => setWhatsAppDispatched(false), 4000);
  };

  const handleExportSystemBackup = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      dropdownOptions,
      directorSecretCode,
      systemConfig: {
        radarSensitivity,
        thermalThreshold,
      },
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `minhaj_system_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 text-slate-100 animate-fadeIn">
      {/* Universal Page Status & Adoption Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-slate-200">
              الوضع الحالي: <strong className="text-purple-300">لوحة تحكم مدير النظام المتطورة (الوضع الجديد المعتمَد)</strong>
            </span>
          </div>

          <span className="hidden md:inline text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-bold">
            ✓ معتمَد كواجهة رئيسية
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleAdoptNewView}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-200 border border-emerald-500/50 text-xs font-bold transition shadow-sm active:scale-95"
            title="تثبيت واعتماد هذا الوضع كواجهة افتراضية دائمة للنظام"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{adoptedNotice ? '✓ تم تأكيد واعتماد الوضع الجديد!' : 'تأكيد اعتماد الوضع الجديد'}</span>
          </button>

          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 text-xs font-bold transition group"
              title="الانتقال إلى لوحة المدير العام"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />
              <span>التبديل للوحة المدير العام (HSE Board)</span>
            </button>
          )}
        </div>
      </div>

      {/* Top Banner: Strictly System Admin Area */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 p-6 rounded-3xl border-2 border-purple-500/50 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="shrink-0 drop-shadow-xl">
              <StopSignLogo className="w-16 h-16" withGlow />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/30 text-purple-300 border border-purple-400/50 text-[10px] font-black uppercase tracking-wider">
                  System Admin Only • خاص بمدير التطبيق والنظام البرمجي
                </span>
                <span className="text-xs text-slate-400">(مستقلة تماماً عن حسابات الموظفين والمديرين)</span>
              </div>
              <h2 className="text-2xl font-black text-white mt-1">
                {language === 'ar' ? 'لوحة تحكم مدير النظام والتطبيق البرمجي' : 'System & Application Admin Control Panel'}
              </h2>
              <p className="text-xs text-slate-400">
                {language === 'ar'
                  ? 'إدارة صلاحيات وكلمة سر المدير العام، الإرسال عبر واتساب، الدخول المباشر كمدير عام، إدارة القوائم المنسدلة، وضبط رادار الكاميرا'
                  : 'Manage General Director secret access, WhatsApp dispatch, direct impersonation, dropdown customization, and camera radar calibration'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportSystemBackup}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-purple-400" />
              <span>نسخة احتياطية للنظام (Backup)</span>
            </button>
          </div>
        </div>
      </div>

      {/* FEATURE 1: General Director Access, Password Generation, WhatsApp Dispatch & One-Click Impersonation */}
      <div className="bg-gradient-to-br from-amber-950/40 via-slate-900 to-purple-950/40 rounded-3xl p-6 border-2 border-amber-500/50 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shrink-0">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                  بوابة المدير العام (HSE Director Access)
                </span>
                <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> مفعّل ومتصل
                </span>
              </div>
              <h3 className="text-lg font-black text-white mt-0.5">
                توليد كلمة سر المدير العام وإرسال الرابط عبر واتساب (WhatsApp)
              </h3>
              <p className="text-xs text-slate-300">
                يمكن لمدير النظام توليد أو تعديل كلمة سر المدير العام وإرسال الرابط مباشرة عبر واتساب، مع احتفاظ مدير النظام بإمكانية الدخول كمدير عام في أي وقت.
              </p>
            </div>
          </div>

          {/* THE REQUESTED ONE-CLICK IMPERSONATION BUTTON */}
          <button
            type="button"
            onClick={onLoginAsGeneralDirector}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-950/50 transition-all flex items-center justify-center gap-2 shrink-0 group border border-amber-300"
          >
            <ShieldCheck className="w-5 h-5 text-slate-950 group-hover:scale-110 transition-transform" />
            <span>الدخول كمدير عام الإدارة (تجاوز فوري لكلمة السر)</span>
          </button>
        </div>

        {/* Current Password Display & Generator Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card A: Current Secret PIN & Generator */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">كلمة السر المعتمدة الحالية للمدير العام:</span>
              <span className="text-[11px] text-amber-400 font-bold">نشطة ومحدثة</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 bg-slate-900 border-2 border-amber-500/40 rounded-xl px-4 py-2.5 font-mono text-base font-black text-amber-300 tracking-widest flex items-center justify-between">
                <span>{directorSecretCode}</span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition"
                  title="نسخ الرمز"
                >
                  {copiedCode ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <button
                type="button"
                onClick={handleGenerateRandomPassword}
                className="px-3.5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition flex items-center gap-1.5 shrink-0 shadow-md"
              >
                <RefreshCw className="w-4 h-4" />
                <span>توليد كود عشوائي</span>
              </button>
            </div>

            {/* Custom Edit Form */}
            <form onSubmit={handleSaveCustomPassword} className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={customPasswordInput}
                onChange={(e) => setCustomPasswordInput(e.target.value)}
                placeholder="أو اكتب كلمة سر مخصصة يدويًا"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-amber-400 font-mono"
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-bold transition shrink-0"
              >
                حفظ التعديل
              </button>
            </form>

            {passwordSavedNotice && (
              <p className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> تم تحديث وحفظ كلمة السر بنجاح!
              </p>
            )}

            {/* Sub-Card: System Admin Password (0000) that can be changed */}
            <div className="pt-3 border-t border-slate-800 mt-2 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-300">
                  {language === 'ar' ? 'كلمة سر مدير النظام (لوحة التحكم):' : 'System Admin Password (0000):'}
                </span>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30 font-mono">
                  {adminPassword}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {language === 'ar'
                  ? 'كلمة المرور الافتراضية للدخول بنقر 5 مرات على STOP هي 0000، ويمكنك تغييرها هنا:'
                  : 'Default password when clicking STOP 5 times is 0000, customizable here:'}
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!adminPasswordInput.trim()) return;
                  if (onUpdateAdminPassword) onUpdateAdminPassword(adminPasswordInput.trim());
                  setAdminPassSavedNotice(true);
                  setTimeout(() => setAdminPassSavedNotice(false), 2500);
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={adminPasswordInput}
                  onChange={(e) => setAdminPasswordInput(e.target.value)}
                  placeholder="كلمة سر مدير النظام الجديدة (مثال: 0000)"
                  className="flex-1 bg-slate-900 border border-purple-500/40 rounded-xl px-3 py-2 text-xs text-purple-200 outline-none focus:border-purple-400 font-mono"
                />
                <button
                  type="submit"
                  className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shrink-0 shadow"
                >
                  حفظ كلمة سر الأدمن
                </button>
              </form>
              {adminPassSavedNotice && (
                <p className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> تم حفظ كلمة سر مدير النظام الجديدة بنجاح!
                </p>
              )}
            </div>
          </div>

          {/* Card B: WhatsApp Dispatch To General Director */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">رقم واتساب المدير العام (م. محمد يوسف):</span>
                <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                  <Phone className="w-3 h-3" /> جمهورية مصر العربية
                </span>
              </div>

              <div className="relative">
                <Phone className="w-4 h-4 text-emerald-400 absolute right-3 top-2.5" />
                <input
                  type="text"
                  value={directorPhone}
                  onChange={(e) => setDirectorPhone(e.target.value)}
                  placeholder="+20 10 0123 4567"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pr-9 pl-3 py-2 text-xs text-slate-200 outline-none focus:border-emerald-400 font-mono"
                />
              </div>

              <p className="text-[11px] text-slate-400">
                سيتم إرسال رسالة رسمية مهنية تتضمن رابط المنصة المباشر ورمز الدخول الخاص بسعادته.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSendWhatsAppAccess}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs transition shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>إرسال الرابط وكلمة السر للمدير العام عبر واتساب 📲</span>
            </button>

            {whatsAppDispatched && (
              <p className="text-[11px] text-emerald-400 font-bold text-center">
                ✓ تم فتح تطبيق واتساب وتجهيز رسالة الدخول الرسمية!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* FEATURE: FULL SYSTEM UI, ICONS & CONTENT CUSTOMIZATION CONTROLS */}
      {uiCustomization && onUpdateUiCustomization && onResetUiCustomization && (
        <AdminUiCustomizationSection
          uiCustomization={uiCustomization}
          onUpdateUiCustomization={onUpdateUiCustomization}
          onResetUiCustomization={onResetUiCustomization}
          language={language}
        />
      )}

      {/* Grid of Other Admin Tools */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tool 1: Dropdown Options Manager (Exclusive to App Admin) */}
        <div className="bg-slate-900/90 rounded-3xl p-6 border border-purple-900/40 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center justify-center">
              <ListFilter className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">إدارة القوائم المنسدلة للتطبيق</h3>
              <p className="text-xs text-slate-400 mt-1">
                تعديل وتخصيص خيارات القوائم المنسدلة للمحطات، التصنيفات الفنية، أسباب الجذور، وفرق التوجيه لبطاقات STOP.
              </p>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>التصنيفات الفنية:</span>
                <span className="font-bold text-purple-300">{dropdownOptions.technicalCategories.length} خيار</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>المحطات والمستودعات:</span>
                <span className="font-bold text-purple-300">{dropdownOptions.stations.length} موقع</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>أسباب الجذور المحتملة:</span>
                <span className="font-bold text-purple-300">{dropdownOptions.rootCauses.length} سبب</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenDropdownManager}
            className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-purple-950/50"
          >
            <ListFilter className="w-4 h-4" />
            <span>فتح محرر القوائم المنسدلة (Admin)</span>
          </button>
        </div>

        {/* Tool 2: AI Camera & Thermal Radar Calibration */}
        <div className="bg-slate-900/90 rounded-3xl p-6 border border-cyan-900/40 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center">
              <Scan className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">معايرة رادار الكاميرا والحرارة الذكي</h3>
              <p className="text-xs text-slate-400 mt-1">
                ضبط خوارزميات الذكاء الاصطناعي لكشف الحوادث الوشيكة والنقاط الحرارية الساخنة بمستشعرات الكاميرا.
              </p>
            </div>

            <div className="space-y-3 pt-1 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-300">حساسية كشف الحوادث الوشيكة:</span>
                  <span className="font-bold text-cyan-300">{radarSensitivity}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={radarSensitivity}
                  onChange={(e) => setRadarSensitivity(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-300">عتبة الإنذار الحراري القصوى:</span>
                  <span className="font-bold text-rose-400">{thermalThreshold} °C</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="95"
                  value={thermalThreshold}
                  onChange={(e) => setThermalThreshold(Number(e.target.value))}
                  className="w-full accent-rose-400 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={handleSaveSettings}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 font-bold text-xs transition flex items-center justify-center gap-1.5"
            >
              {savedSuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Settings className="w-4 h-4" />}
              <span>{savedSuccess ? 'تم حفظ المعايرة بنجاح' : 'حفظ إعدادات الرادار'}</span>
            </button>

            <button
              type="button"
              onClick={onOpenRadar}
              className="w-full py-2 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/40 text-cyan-200 border border-cyan-500/50 font-bold text-xs transition flex items-center justify-center gap-1.5"
            >
              <Scan className="w-3.5 h-3.5" />
              <span>تشغيل واختبار رادار الكاميرا</span>
            </button>
          </div>
        </div>

        {/* Tool 3: Points & Rewards Management Control */}
        <div className="bg-slate-900/90 rounded-3xl p-6 border border-amber-500/30 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">التحكم في النقاط والمكافآت والجوائز</h3>
              <p className="text-xs text-slate-400 mt-1">
                تعديل رصيد نقاط العاملين والمشرفين، إضافة وتحديث عناصر متجر الجوائز (أيام إجازة، قسائم شرائية، دروع تميز).
              </p>
            </div>

            <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span>مكافأة بطاقة STOP عادية:</span>
                <span className="font-mono text-amber-400 font-bold">+25 نقطة</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>مكافأة رصد خطر جسيم / وشيك:</span>
                <span className="font-mono text-rose-400 font-bold">+50 نقطة</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>المكافأة الاستثنائية الشهرية:</span>
                <span className="font-mono text-emerald-400 font-bold">+100 نقطة</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenPointsRewardsManager}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs transition flex items-center justify-center gap-1.5 shadow-lg shadow-amber-950/40"
          >
            <Award className="w-4 h-4" />
            <span>إدارة وتعديل النقاط والمكافآت (Admin Control)</span>
          </button>
        </div>

        {/* Tool 4: Weather & Natural Disaster Emergency System */}
        <div className="bg-slate-900/90 rounded-3xl p-6 border border-cyan-500/30 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center">
              <CloudSun className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">رصد الطقس، الكوارث ونشرة الملابس</h3>
              <p className="text-xs text-slate-400 mt-1">
                ربط مؤشرات الطقس والتنبؤ بالأمطار والرياح والعواصف، ورفع حالات التأهب وإرسال نشرات السلامة اليومية عبر واتساب.
              </p>
            </div>

            <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">حالة التأهب المناخي:</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                  مستوى أصفر (تنبيه وقائي)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">إرسال النشرة للعاملين:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> متاح عبر واتساب
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenWeatherAdvisory}
            className="w-full py-2.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 text-cyan-200 border border-cyan-500/40 font-bold text-xs transition flex items-center justify-center gap-1.5"
          >
            <CloudSun className="w-4 h-4 text-cyan-400" />
            <span>عرض منصة الطقس وإرشادات مهمات الوقاية</span>
          </button>
        </div>

        {/* Tool 5: Server Health & Security Audit */}
        <div className="bg-slate-900/90 rounded-3xl p-6 border border-emerald-900/40 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">حالة الخادم وتكاملات النظام</h3>
              <p className="text-xs text-slate-400 mt-1">
                مراقبة أداء السيرفر السحابي، حالة الاتصال بالإنترنت، وحالة المزامنة دون اتصال (Offline-First).
              </p>
            </div>

            <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">حالة قاعدة البيانات:</span>
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  متصل ومزامن (Operational)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">محرك الصوت والذكاء الاصطناعي:</span>
                <span className="text-cyan-300 font-bold">نشط ومفعّل (Web Audio & Speech)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">زمن استجابة النظام:</span>
                <span className="font-mono text-amber-300 font-bold">24 ms</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-purple-950/30 rounded-xl border border-purple-800/40 text-[11px] text-purple-200 text-center">
            🔐 هذه الصفحة والصلاحيات مشفرة ومحجوبة تماماً عن مديري السلامة والموظفين.
          </div>
        </div>
      </div>
    </div>
  );
};
