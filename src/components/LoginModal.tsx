import React, { useState } from 'react';
import { AuthUser, Language } from '../types';
import { getT } from '../utils/translations';
import {
  LogIn,
  User,
  ShieldCheck,
  X,
  CheckCircle2,
  Share2,
  Lock,
  HardHat,
  Building2,
} from 'lucide-react';
import { INITIAL_AUTH_USERS } from '../data/advancedMockData';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: AuthUser) => void;
  language: Language;
  initialTab?: 'EMPLOYEES' | 'MANAGEMENT';
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  language,
  initialTab = 'EMPLOYEES',
}) => {
  const t = getT(language);
  const [activeSection, setActiveSection] = useState<'EMPLOYEES' | 'MANAGEMENT'>(initialTab);

  // Field Workers Form State
  const [employeeName, setEmployeeName] = useState('');
  const [employeeBadge, setEmployeeBadge] = useState('');
  const [employeeEmail, setEmployeeEmail] = useState('');

  const [shareSuccess, setShareSuccess] = useState(false);

  if (!isOpen) return null;

  // Submit for Field Workers
  const handleEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeName.trim()) return;

    const loggedUser: AuthUser = {
      id: `USR-${Date.now().toString().slice(-4)}`,
      name: employeeName.trim(),
      badgeNumber: employeeBadge.trim() || `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      email: employeeEmail.trim() || 'worker@company.com',
      role: 'EMPLOYEE',
      department: 'عمليات المحطات والمستودعات الميدانية',
    };

    onLogin(loggedUser);
    onClose();
  };

  // Submit for HSE Management (Exclusively HSE General Director)
  const handleManagementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const directorUser = INITIAL_AUTH_USERS.find((u) => u.role === 'HSE_GENERAL_DIRECTOR') || INITIAL_AUTH_USERS[0];
    onLogin(directorUser);
    onClose();
  };

  const handleQuickLogin = (userPreset: AuthUser) => {
    onLogin(userPreset);
    onClose();
  };

  const handleWhatsAppShare = () => {
    const currentUrl = window.location.href;
    const msg =
      language === 'ar'
        ? `السلام عليكم ورحمة الله وبركاته،\nدعوة رسمية من الإدارة العامة للسلامة والصحة المهنية (HSE) للبدء في استخدام منصة STOP الرقمية لملاحظة المخاطر ورصد الحالات والتحليل بالذكاء الاصطناعي:\n${currentUrl}\nدمتم سالمين.`
        : `Official Invitation from HSE Directorate to start using STOP digital safety platform:\n${currentUrl}`;

    const waUrl = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border-2 border-slate-700 rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 left-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-800 transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="p-6 bg-slate-950/80 border-b border-slate-800 text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <LogIn className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-black text-slate-100">
              {language === 'ar' ? 'تسجيل الدخول لمنظومة STOP للسلامة' : 'STOP Safety System Sign-in'}
            </h3>
          </div>

          {/* TWO MAIN SECTIONS (قسم العاملين | قسم الإدارة HSE) */}
          <div className="grid grid-cols-2 p-1.5 bg-slate-900 rounded-2xl border border-slate-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveSection('EMPLOYEES')}
              className={`py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 ${
                activeSection === 'EMPLOYEES'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <HardHat className="w-4 h-4" />
              <span>{language === 'ar' ? '👷‍♂️ قسم العاملين' : 'Field Workers'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection('MANAGEMENT')}
              className={`py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 ${
                activeSection === 'MANAGEMENT'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>{language === 'ar' ? '🛡️ قسم الإدارة (HSE)' : 'HSE Management'}</span>
            </button>
          </div>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* SECTION 1: FIELD WORKERS */}
          {activeSection === 'EMPLOYEES' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-300">
                مخصص للمشرفين والمراقبين والفنيين الميدانيين لتسجيل ملاحظات وبطاقات STOP، ورصد الحوادث الوشيكة، واستعراض لوحة شرف أبطال السلامة.
              </div>

              {/* Quick Select Employee */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  دخول سريع بنقرة واحدة للعاملين:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleQuickLogin(
                        INITIAL_AUTH_USERS.find((u) => u.role === 'EMPLOYEE') || {
                          id: 'USR-01',
                          name: 'أحمد علي مصطفى',
                          badgeNumber: 'HSE-4091',
                          email: 'ahmed.aly@company.eg',
                          role: 'EMPLOYEE',
                          department: 'الإدارة العامة للسلامة والصحة المهنية',
                        }
                      )
                    }
                    className="p-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-right text-xs font-semibold hover:border-amber-500/50 transition flex items-center gap-2.5"
                  >
                    <User className="w-4 h-4 text-amber-400 shrink-0" />
                    <div className="truncate">
                      <div className="text-slate-200 font-bold truncate">أحمد علي مصطفى</div>
                      <div className="text-[10px] text-slate-400 truncate">مفتش ومراقب سلامة وصحة مهنية</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleQuickLogin({
                        id: 'USR-OPS-02',
                        name: 'محمود السيد الشناوي',
                        badgeNumber: 'OPS-2184',
                        email: 'mahmoud.shinawi@company.eg',
                        role: 'EMPLOYEE',
                        department: 'إدارة العمليات والتشغيل الميداني',
                      })
                    }
                    className="p-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-right text-xs font-semibold hover:border-amber-500/50 transition flex items-center gap-2.5"
                  >
                    <User className="w-4 h-4 text-cyan-400 shrink-0" />
                    <div className="truncate">
                      <div className="text-slate-200 font-bold truncate">محمود السيد الشناوي</div>
                      <div className="text-[10px] text-slate-400 truncate">مشرف وردية تشغيل وموقع</div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-800"></div>
                <span className="flex-shrink mx-3 text-slate-500 text-[10px] uppercase font-bold">أو إدخال بيانات الموظف</span>
                <div className="flex-grow border-t border-slate-800"></div>
              </div>

              <form onSubmit={handleEmployeeSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-300 block mb-1 font-bold">اسم الموظف / المفتش:</label>
                  <input
                    type="text"
                    required
                    value={employeeName}
                    onChange={(e) => setEmployeeName(e.target.value)}
                    placeholder="مثال: أحمد علي مصطفى"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-300 block mb-1 font-bold">الرقم الوظيفي:</label>
                    <input
                      type="text"
                      value={employeeBadge}
                      onChange={(e) => setEmployeeBadge(e.target.value)}
                      placeholder="EMP-5520"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1 font-bold">البريد الإلكتروني:</label>
                    <input
                      type="email"
                      value={employeeEmail}
                      onChange={(e) => setEmployeeEmail(e.target.value)}
                      placeholder="employee@company.eg"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition shadow-lg shadow-amber-950/40 mt-2"
                >
                  دخول استمارة الرصد الميداني كعامل
                </button>
              </form>
            </div>
          )}

          {/* SECTION 2: HSE MANAGEMENT */}
          {activeSection === 'MANAGEMENT' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-300">
                مخصص لقيادة الإدارة العامة للسلامة والصحة المهنية (HSE) لمتابعة مؤشرات الأداء، البلاغات الحرجة، خرائط النقاط الساخنة، والتوجيه الفوري.
              </div>

              {/* HSE General Director Profile Card */}
              <div className="p-4 rounded-2xl border bg-amber-500/15 border-amber-500/50 text-right space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
                      <ShieldCheck className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="text-sm font-black text-amber-300 flex items-center gap-1.5">
                        <span>المدير العام للإدارة العامة للسلامة والصحة المهنية</span>
                      </div>
                      <div className="text-xs font-bold text-slate-100 mt-0.5">
                        م. محمد يوسف (HSE General Director)
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        mohamedyoussef255@gmail.com
                      </div>
                    </div>
                  </div>
                  <CheckCircle2 className="w-6 h-6 text-amber-400" />
                </div>

                <div className="pt-2 border-t border-amber-500/20 text-[11px] text-slate-300 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>صلاحيات القيادة والمراقبة الشاملة لمواقع العمليات والمحطات</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>توجيه التعليمات الفورية عبر البث المباشر وبوت الطوارئ ومؤشرات الإغلاق</span>
                  </div>
                </div>
              </div>

              {/* Login Action Button */}
              <form onSubmit={handleManagementSubmit} className="pt-1">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl font-black text-xs transition shadow-xl flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-950/40"
                >
                  <Lock className="w-4 h-4" />
                  <span>دخول رسمي كمدير عام الإدارة العامة للسلامة والصحة المهنية (HSE)</span>
                </button>
              </form>

              {/* Share Platform via WhatsApp */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleWhatsAppShare}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4 text-emerald-400" />
                  <span>
                    {shareSuccess
                      ? 'تم تجهيز رابط الدعوة للمنصة عبر واتساب'
                      : 'مشاركة رابط المنصة مع المفتشين والإدارة عبر واتساب'}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
