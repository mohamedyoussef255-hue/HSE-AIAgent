import React, { useState } from 'react';
import {
  Smartphone,
  Apple,
  Download,
  Share2,
  CheckCircle2,
  QrCode,
  Sparkles,
  X,
  ExternalLink,
  ShieldCheck,
  Zap,
  Info,
} from 'lucide-react';
import { Language } from '../types';

interface MobileAppDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const MobileAppDownloadModal: React.FC<MobileAppDownloadModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'qr'>('android');
  const [copiedLink, setCopiedLink] = useState(false);
  const [installPromptTriggered, setInstallPromptTriggered] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'https://minhaj-stop.app';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleTriggerPwaInstall = () => {
    setInstallPromptTriggered(true);
    setTimeout(() => setInstallPromptTriggered(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border-2 border-amber-500/60 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 text-slate-100 relative">
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
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/30 border border-amber-500/50 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black uppercase tracking-wider">
                تطبيق الهاتف الميداني • Native PWA
              </span>
              <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> متاح الآن
              </span>
            </div>
            <h3 className="text-lg font-black text-white mt-0.5">
              تحميل وتثبيت تطبيق منهاج STOP للهواتف الذكية
            </h3>
            <p className="text-xs text-slate-400">
              يعمل على نظامي أندرويد (Android) وآبل (iOS) بكامل مميزات الكاميرا، الصوت، والعمل دون إنترنت (Offline).
            </p>
          </div>
        </div>

        {/* Tabs: Android vs iOS vs QR */}
        <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('android')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'android'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>نظام أندرويد (Android)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ios')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'ios'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Apple className="w-4 h-4" />
            <span>آبل آيفون (Apple iOS)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('qr')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'qr'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>مسح QR بالكاميرا</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'android' && (
          <div className="space-y-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-bold text-slate-200">طريقة التثبيت المباشر على هواتف أندرويد:</span>
              <span className="text-[11px] text-emerald-400 font-mono">Google Chrome / Samsung Internet</span>
            </div>

            <ol className="space-y-2 text-slate-300 pr-4 list-decimal">
              <li>
                اضغط على زر <strong>"تثبيت التطبيق الآن على الهاتف"</strong> بالأسفل.
              </li>
              <li>
                أو افتح قائمة الخيارات (الثلاث نقاط ⋮) في أعلى متصفح Chrome، ثم اضغط على <strong>"تثبيت التطبيق" (Install App)</strong> أو <strong>"إضافة إلى الشاشة الرئيسية"</strong>.
              </li>
              <li>
                سيظهر رمز تطبيق <strong>منهاج STOP</strong> على شاشتك الرئيسية ويعمل كبرنامج أصلي بدون شريط المتصفح، مع إمكانية إرسال البلاغات وتسجيل الصوت والفيديو حتى عند انقطاع الإنترنت!
              </li>
            </ol>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                type="button"
                onClick={handleTriggerPwaInstall}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40"
              >
                <Download className="w-4 h-4" />
                <span>تثبيت التطبيق الآن على أندرويد (PWA Install)</span>
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition flex items-center justify-center gap-1.5"
              >
                <Share2 className="w-4 h-4 text-emerald-400" />
                <span>{copiedLink ? '✓ تم نسخ الرابط' : 'نسخ رابط الهاتف'}</span>
              </button>
            </div>

            {installPromptTriggered && (
              <p className="text-[11px] text-emerald-400 font-bold text-center">
                ✓ تم تفعيل طلب التثبيت! يرجى تأكيد "تثبيت" في الرسالة الظاهرة على شاشتك.
              </p>
            )}
          </div>
        )}

        {activeTab === 'ios' && (
          <div className="space-y-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-bold text-slate-200">طريقة التثبيت السريع على أجهزة iPhone و iPad:</span>
              <span className="text-[11px] text-amber-400 font-mono">Apple Safari</span>
            </div>

            <ol className="space-y-2.5 text-slate-300 pr-4 list-decimal">
              <li>
                افتح رابط المنصة داخل متصفح <strong>Safari</strong> على جهاز الآيفون الخاص بك.
              </li>
              <li>
                اضغط على أيقونة <strong>المشاركة (Share ⎋)</strong> الموجودة في الشريط السفلي للمتصفح.
              </li>
              <li>
                مرر للأسفل واضغط على <strong>"إضافة إلى الصفحة الرئيسية" (Add to Home Screen ⊞)</strong>.
              </li>
              <li>
                اضغط على <strong>"إضافة" (Add)</strong> في أعلى الزاوية ليتم تثبيت التطبيق رسمياً بأيقونة STOP.
              </li>
            </ol>

            <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/30 text-[11px] text-amber-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
              <span>
                التطبيق على iOS يعمل بملء الشاشة بنسبة 100% بدون شريط Safari أو مسطرة التصفح، ويدعم تسجيل الصوت وتفعيل الكاميرا!
              </span>
            </div>

            <button
              type="button"
              onClick={handleCopyLink}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-amber-950/40"
            >
              <Share2 className="w-4 h-4" />
              <span>{copiedLink ? '✓ تم نسخ الرابط، افتحه في Safari' : 'نسخ رابط التثبيت لفتحه في Safari'}</span>
            </button>
          </div>
        )}

        {activeTab === 'qr' && (
          <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 text-center space-y-3">
            <p className="text-xs text-slate-300 font-medium">
              امسح رمز الاستجابة السريعة (QR Code) بكاميرا هاتفك المحمول لفتح وتثبيت التطبيق مباشرة:
            </p>

            <div className="inline-block p-4 bg-white rounded-2xl shadow-xl border-4 border-amber-400">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                  currentUrl
                )}`}
                alt="Scan to Install STOP App"
                className="w-44 h-44 mx-auto"
              />
            </div>

            <p className="text-[11px] text-slate-400 font-mono">
              {currentUrl}
            </p>
          </div>
        )}

        {/* Footer Note */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            معتمد للأمن الصناعي ومتوافق مع معايير OSHA & DuPont
          </span>
          <span className="font-bold text-amber-400/90">EZWETY IT Co. - 2026</span>
        </div>
      </div>
    </div>
  );
};
