import React, { useState } from 'react';
import { KeyRound, ShieldCheck, CheckCircle2, AlertCircle, X, Sparkles } from 'lucide-react';
import { Language } from '../types';

interface DirectorPasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPassword: string;
  onSaveNewPassword: (newPass: string) => void;
  language: Language;
}

export const DirectorPasswordChangeModal: React.FC<DirectorPasswordChangeModalProps> = ({
  isOpen,
  onClose,
  currentPassword,
  onSaveNewPassword,
  language,
}) => {
  const [oldPasswordInput, setOldPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (oldPasswordInput.trim() !== currentPassword.trim()) {
      setErrorMsg(
        language === 'ar'
          ? 'كلمة المرور الحالية غير صحيحة! يرجى إدخال كلمة السر الحالية المعتمدة.'
          : 'Current password does not match.'
      );
      return;
    }

    if (newPasswordInput.trim().length < 4) {
      setErrorMsg(
        language === 'ar'
          ? 'يجب أن تتكون كلمة المرور الجديدة من 4 خانات على الأقل.'
          : 'New password must be at least 4 characters.'
      );
      return;
    }

    if (newPasswordInput !== confirmPasswordInput) {
      setErrorMsg(
        language === 'ar'
          ? 'كلمة المرور الجديدة غير متطابقة مع تأكيد كلمة المرور.'
          : 'New passwords do not match.'
      );
      return;
    }

    onSaveNewPassword(newPasswordInput.trim());
    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      onClose();
    }, 1500);
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
            <KeyRound className="w-7 h-7" />
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-lg font-black text-amber-400">
              {language === 'ar'
                ? 'تغيير كلمة سر المدير العام (HSE General Director)'
                : 'Change HSE Director Secret PIN'}
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            {language === 'ar'
              ? 'تعديل وتحديث الرمز السري لبوابة المدير العام لمزيد من الأمان والخصوصية'
              : 'Update your official verification PIN code for enhanced account security'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-700 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>
              {language === 'ar'
                ? 'تم تحديث كلمة المرور الخاصة بكم بنجاح ✓'
                : 'Password updated successfully ✓'}
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              {language === 'ar' ? 'كلمة المرور الحالية:' : 'Current Password:'}
            </label>
            <input
              type="password"
              required
              value={oldPasswordInput}
              onChange={(e) => setOldPasswordInput(e.target.value)}
              placeholder="******"
              className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 outline-none font-mono tracking-wider"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              {language === 'ar' ? 'كلمة المرور الجديدة:' : 'New Password:'}
            </label>
            <input
              type="password"
              required
              value={newPasswordInput}
              onChange={(e) => setNewPasswordInput(e.target.value)}
              placeholder="أدخل كلمة المرور الجديدة"
              className="w-full bg-slate-950 border border-amber-500/40 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 outline-none font-mono tracking-wider"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              {language === 'ar' ? 'تأكيد كلمة المرور الجديدة:' : 'Confirm New Password:'}
            </label>
            <input
              type="password"
              required
              value={confirmPasswordInput}
              onChange={(e) => setConfirmPasswordInput(e.target.value)}
              placeholder="أعد إدخال كلمة المرور الجديدة"
              className="w-full bg-slate-950 border border-amber-500/40 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 outline-none font-mono tracking-wider"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400">
            ℹ️ {language === 'ar'
              ? 'ملاحظة: يحتفظ مدير التطبيق بإمكانية الدخول على لوحة المدير العام من داخل لوحة تحكمه للإسناد الفني في حال نسيان كلمة السر.'
              : 'Note: System Admin can bypass and enter General Director view from System Admin Panel for technical assistance.'}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{language === 'ar' ? 'حفظ وتأكيد كلمة السر الجديدة' : 'Save & Confirm New Password'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
