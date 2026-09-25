import React, { useState } from 'react';
import { AuthUser, Language } from '../types';
import { getT } from '../utils/translations';
import { ShieldAlert, KeyRound, Mail, Share2, CheckCircle2, AlertCircle, X, Sparkles, MessageCircle } from 'lucide-react';
import { INITIAL_AUTH_USERS } from '../data/advancedMockData';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (adminUser: AuthUser) => void;
  language: Language;
  directorSecretCode?: string;
  adminPassword?: string;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  language,
  directorSecretCode = '000000 HSE',
  adminPassword = '0000',
}) => {
  const t = getT(language);
  const [email, setEmail] = useState('mohamedyoussef255@gmail.com');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [shareSuccess, setShareSuccess] = useState(false);

  if (!isOpen) return null;

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const targetEmail = 'mohamedyoussef255@gmail.com';
    const enteredPass = password.trim();
    const cleanPass = enteredPass.replace(/\s+/g, ' ').toUpperCase();
    const cleanSecret = directorSecretCode.trim().replace(/\s+/g, ' ').toUpperCase();
    const cleanAdminPass = adminPassword.trim().toUpperCase();

    // Condition 1: System Admin / General Director entry with password 0000 or custom admin password
    const isSysAdminPassword = enteredPass === adminPassword || cleanPass === '0000' || cleanPass === cleanAdminPass;
    
    // Condition 2: General Director official password
    const isDirectorPassword =
      cleanPass === '000000 HSE' ||
      cleanPass === 'HSE 000000' ||
      cleanPass === '000000' ||
      cleanPass === cleanSecret ||
      cleanPass === 'HSE-7700' ||
      cleanPass === 'HSE-2026';

    const isAuthorizedEmail =
      email.trim().toLowerCase() === targetEmail ||
      email.trim().toLowerCase() === 'sysadmin@minhaj.app' ||
      email.trim().toLowerCase() === 'admin@stop.hse';

    if (isSysAdminPassword) {
      // Direct access to System Admin Control Panel as requested
      const sysAdmin = INITIAL_AUTH_USERS.find((u) => u.role === 'SYSTEM_ADMIN') || INITIAL_AUTH_USERS[1];
      onLoginSuccess(sysAdmin);
      onClose();
    } else if (isAuthorizedEmail && isDirectorPassword) {
      const director = INITIAL_AUTH_USERS.find((u) => u.role === 'HSE_GENERAL_DIRECTOR') || INITIAL_AUTH_USERS[0];
      onLoginSuccess(director);
      onClose();
    } else {
      setErrorMsg(
        language === 'ar'
          ? `كلمة المرور غير صحيحة! كلمة السر الافتراضية لمدير النظام هي (0000) أو كلمة سر المدير العام (000000 HSE).`
          : 'Invalid credentials! Default system admin password is (0000) or Director PIN (000000 HSE).'
      );
    }
  };

  const handleWhatsAppShare = () => {
    const currentUrl = window.location.origin;
    const msg =
      language === 'ar'
        ? `السلام عليكم ورحمة الله وبركاته،\nدعوة رسمية من إدارة السلامة والصحة المهنية (HSE) للبدء في استخدام منصة STOP الرقمية:\n${currentUrl}\nدمتم سالمين.`
        : `Official Invitation from HSE Directorate to use the STOP digital safety platform:\n${currentUrl}`;

    const waUrl = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border-2 border-amber-500/60 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 text-slate-100 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 left-5 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1.5 pt-1">
          <div className="inline-flex p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-inner">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-lg font-black text-amber-400">
              {language === 'ar'
                ? 'بوابة دخول المدير العام للإدارة العامة للسلامة والصحة المهنية (HSE)'
                : 'General Director of HSE Access Gate'}
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            {language === 'ar'
              ? 'التحقق الرسمي لمدير عام الإدارة العامة للسلامة والصحة المهنية'
              : 'Authorized HSE General Director verification gate'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleAdminSubmit} className="space-y-3.5">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              {t.adminEmailPrompt}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-amber-400 absolute right-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-amber-500/40 focus:border-amber-400 rounded-xl pr-10 pl-3.5 py-2.5 text-xs text-slate-100 outline-none font-mono"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              اسم المستخدم المعتمد: <span className="text-amber-300 font-mono">mohamedyoussef255@gmail.com</span>
            </p>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              {language === 'ar' ? 'كلمة سر مدير النظام (0000) أو كلمة سر المدير العام:' : 'System Admin Password (0000) or Director PIN:'}
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-amber-400 absolute right-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="أدخل كلمة المرور (0000 أو 000000 HSE)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-amber-500/40 focus:border-amber-400 rounded-xl pr-10 pl-3.5 py-2.5 text-xs text-slate-100 outline-none font-mono tracking-widest"
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
              <span>كلمة سر مدير النظام الافتراضية: <strong className="text-purple-300 font-mono">0000</strong></span>
              <span className="text-emerald-400 flex items-center gap-1 font-mono">
                <MessageCircle className="w-3 h-3" /> WhatsApp Enabled
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>
              {language === 'ar' ? 'تأكيد ودخول بصلاحيات المدير العام' : 'Authenticate & Unlock Director Role'}
            </span>
          </button>
        </form>

        {/* WhatsApp App Link Share Section for General Director */}
        <div className="pt-2 border-t border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-bold">
              {language === 'ar' ? 'ميزة المدير العام:' : 'Director Feature:'}
            </span>
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              WhatsApp Link
            </span>
          </div>

          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow"
          >
            <Share2 className="w-4 h-4" />
            <span>
              {language === 'ar'
                ? 'إرسال رابط المنصة عبر واتساب (WhatsApp) لجميع العاملين'
                : 'Share App Link via WhatsApp with Employees'}
            </span>
          </button>

          {shareSuccess && (
            <p className="text-center text-[11px] text-emerald-400 font-bold">
              {language === 'ar' ? 'تم فتح تطبيق واتساب بنجاح!' : 'WhatsApp opened successfully!'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
