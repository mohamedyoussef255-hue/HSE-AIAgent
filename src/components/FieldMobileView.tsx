import React, { useState, useEffect } from 'react';
import {
  Camera,
  QrCode,
  Sparkles,
  Send,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Flame,
  Award,
  WifiOff,
  Clock,
  ArrowRight,
  Info,
  Maximize2,
  Smartphone,
  Check,
  Copy,
  CheckCheck,
  X,
  Shield,
  BellRing,
  FileCheck,
  Share2,
  Scan,
  Radio,
  RotateCcw,
  CloudSun,
  HardHat,
  UserCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Asset, DropdownOptionsMap, ObservationType, SeverityLevel, StopObservation, AIIncidentClassification, UserRole, Language, AppUiCustomization } from '../types';
import { VoiceRecorder } from './VoiceRecorder';
import { QrScanModal } from './QrScanModal';
import { ShortVideoRecorder } from './ShortVideoRecorder';
import { AIIncidentClassifier } from './AIIncidentClassifier';
import { SiteWeatherRiskWidget } from './SiteWeatherRiskWidget';
import { StopSignLogo } from './StopSignLogo';

interface FieldMobileViewProps {
  onSaveObservation: (observation: StopObservation) => void;
  isOffline: boolean;
  offlineQueueCount: number;
  initialData?: Partial<StopObservation> | null;
  onClearInitialData?: () => void;
  onOpenRadar?: () => void;
  onOpenLiveStream?: () => void;
  dropdownOptions?: DropdownOptionsMap;
  onOpenDropdownManager?: () => void;
  onBack?: () => void;
  language?: Language;
  currentUserRole?: UserRole;
  uiConfig?: AppUiCustomization['workerPage'];
  onOpenAdminLogin?: () => void;
}

export const FieldMobileView: React.FC<FieldMobileViewProps> = ({
  onSaveObservation,
  isOffline,
  offlineQueueCount,
  initialData,
  onClearInitialData,
  onOpenRadar,
  onOpenLiveStream,
  dropdownOptions,
  onOpenDropdownManager,
  onBack,
  language = 'ar',
  currentUserRole = 'EMPLOYEE',
  uiConfig,
  onOpenAdminLogin,
}) => {
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState<boolean>(false);
  const [stopClickCount, setStopClickCount] = useState<number>(0);
  const [clickTimer, setClickTimer] = useState<any>(null);

  const handleStopBrandClick = () => {
    if (!onOpenAdminLogin) return;
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

  const [observerRole, setObserverRole] = useState<'EMPLOYEE' | 'HSE_OFFICER'>(
    currentUserRole === 'HSE_ADMIN' || currentUserRole === 'HSE_GENERAL_DIRECTOR' || currentUserRole === 'HSE_OFFICER'
      ? 'HSE_OFFICER'
      : 'EMPLOYEE'
  );
  // Ultra-simplified view for workers vs advanced technical view for HSE officers
  const [isSimplifiedWorkerMode, setIsSimplifiedWorkerMode] = useState<boolean>(
    currentUserRole === 'EMPLOYEE' || observerRole === 'EMPLOYEE'
  );
  const [aiClassification, setAiClassification] = useState<AIIncidentClassification | null>(null);
  const [showWeatherWidget, setShowWeatherWidget] = useState<boolean>(false);

  // Form states
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [stationName, setStationName] = useState<string>('محطة التموين المركزية - القاهرة');
  const [locationDetails, setLocationDetails] = useState<string>('منطقة التعبئة والضواغط الرئيسية');
  const [description, setDescription] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [videoDurationSeconds, setVideoDurationSeconds] = useState<number>(0);
  const [type, setType] = useState<ObservationType>('حالة غير آمنة (Unsafe Condition)');
  const [category, setCategory] = useState<string>('ميكانيكي / هيدروليكي');
  const [severity, setSeverity] = useState<SeverityLevel>('medium');
  const [riskScore, setRiskScore] = useState<number>(65);
  const [immediateAction, setImmediateAction] = useState<string>('');
  const [preventiveAction, setPreventiveAction] = useState<string>('');
  const [rootCause, setRootCause] = useState<string>('');
  const [assignedTo, setAssignedTo] = useState<string>('مشرف الوردية الميداني');
  const [routingRule, setRoutingRule] = useState<'SUPERVISOR_ROUTING' | 'CRITICAL_ESCALATION'>('SUPERVISOR_ROUTING');

  // Pre-fill from AI Radar if provided
  useEffect(() => {
    if (initialData) {
      if (initialData.description) setDescription(initialData.description);
      if (initialData.type) setType(initialData.type);
      if (initialData.severity) setSeverity(initialData.severity);
      if (initialData.riskScore) setRiskScore(initialData.riskScore);
      if (initialData.immediateAction) setImmediateAction(initialData.immediateAction);
      if (initialData.preventiveAction) setPreventiveAction(initialData.preventiveAction);
      if (initialData.photoUrl) setPhotoUrl(initialData.photoUrl);
      if (initialData.category) setCategory(initialData.category);
      if (initialData.severity === 'high') {
        setRoutingRule('CRITICAL_ESCALATION');
        setAssignedTo('مدير السلامة وإدارة الصيانة المركزية (تصعيد فوري)');
      }
    }
  }, [initialData]);

  // AI loading state
  const [isAiClassifying, setIsAiClassifying] = useState<boolean>(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any | null>(null);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [pointsGained, setPointsGained] = useState<number>(35);

  // Confirmation & Dispatch states
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [pendingObservation, setPendingObservation] = useState<StopObservation | null>(null);
  const [confirmedTicket, setConfirmedTicket] = useState<StopObservation | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const triggerFeedback = () => {
    try {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([80, 40, 80]);
      }
    } catch (_) {}

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        const ctx = new AudioContextClass();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16); // G5
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      }
    } catch (_) {}
  };

  const handleAssetScanned = (asset: Asset) => {
    setSelectedAsset(asset);
    setStationName(asset.station);
    setLocationDetails(asset.location);
  };

  const handleAiAutoClassify = async () => {
    if (!description.trim()) {
      alert('يرجى كتابة وصف الملاحظة أو استخدام التسجيل الصوتي أولاً ليقوم الذكاء الاصطناعي بتحليلها.');
      return;
    }

    setIsAiClassifying(true);
    try {
      const response = await fetch('/api/ai/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: description,
          assetName: selectedAsset?.name,
          assetLocation: locationDetails,
          observerNotes: immediateAction,
        }),
      });

      if (!response.ok) {
        throw new Error('فشل استجابة التحليل');
      }

      const data = await response.json();
      setAiAnalysisResult(data);

      if (data.type) setType(data.type);
      if (data.category) setCategory(data.category);
      if (data.severityLevel) setSeverity(data.severityLevel);
      if (data.riskScore) setRiskScore(data.riskScore);
      if (data.immediateAction) setImmediateAction(data.immediateAction);
      if (data.preventiveAction) setPreventiveAction(data.preventiveAction);
      if (data.rootCause) setRootCause(data.rootCause);
      if (data.targetRole) setAssignedTo(data.targetRole);
      if (data.automatedRoutingRule) setRoutingRule(data.automatedRoutingRule);
    } catch (err) {
      console.warn('AI fallback triggered:', err);
      // Smart local fallback
      const isCritical = description.includes('تسريب') || description.includes('حريق') || description.includes('كهرباء');
      setSeverity(isCritical ? 'high' : 'medium');
      setRiskScore(isCritical ? 85 : 50);
      setImmediateAction(
        isCritical
          ? 'إيقاف تشغيل المعدة فوراً، ووضع شريط تحذيري واستدعاء فرق الصيانة.'
          : 'توجيه العامل لتصحيح وضعية العمل وتأمين المحيط المباشر.'
      );
      setPreventiveAction('مراجعة إجراءات التشغيل القياسية وتكثيف الفحص الوقائي الأسبوعي.');
      setRootCause(isCritical ? 'تهالك أجزاء ميكانيكية وتأخر الصيانة' : 'نقص تدريب وسلوك غير آمن');
      setAssignedTo(isCritical ? 'مدير السلامة وإدارة الصيانة (إشعار فوري)' : 'مشرف الوردية');
      setRoutingRule(isCritical ? 'CRITICAL_ESCALATION' : 'SUPERVISOR_ROUTING');
    } finally {
      setIsAiClassifying(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim()) {
      alert('يرجى إدخال تفاصيل الملاحظة أو تسجيلها بالصوت.');
      return;
    }

    const points = severity === 'high' ? 50 : type.includes('تصرف') ? 35 : 25;
    setPointsGained(points);

    const now = new Date();
    const timeStr = now.toTimeString().slice(0, 5);
    const dateStr = now.toISOString().slice(0, 10);
    const randomTicket = `STOP-${Math.floor(100 + Math.random() * 900)}`;

    const newObservation: StopObservation = {
      id: `STOP-${Date.now()}`,
      ticketNumber: randomTicket,
      date: dateStr,
      time: timeStr,
      observerName: 'أحمد علي مصطفى (أنت)',
      observerId: 'USR-01',
      observerRole: 'مفتش سلامة وصحة مهنية ميداني',
      stationName,
      locationDetails,
      assetId: selectedAsset?.id,
      assetName: selectedAsset?.name,
      description,
      voiceTranscript: description,
      audioRecorded: true,
      photoUrl:
        photoUrl ||
        (severity === 'high'
          ? 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'
          : 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80'),
      videoUrl: videoUrl || undefined,
      videoDurationSeconds: videoDurationSeconds || undefined,
      type,
      category,
      severity,
      riskScore,
      rootCause: rootCause || 'قيد التحليل والمراجعة الميدانية',
      immediateAction: immediateAction || 'تم تأمين الموقع والتنبيه المباشر',
      preventiveAction: preventiveAction || 'جدولة فحص وقائي دوري',
      status: 'جديد (New)',
      assignedTo,
      routingRule,
      escalatedNotificationSent: severity === 'high',
      isSynced: !isOffline,
      pointsAwarded: points,
    };

    // Open Confirmation Dialog before final dispatch
    setPendingObservation(newObservation);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmAndDispatch = () => {
    if (!pendingObservation) return;

    triggerFeedback();
    onSaveObservation(pendingObservation);
    setConfirmedTicket(pendingObservation);
    setIsConfirmModalOpen(false);

    // Reset Form fields
    setDescription('');
    setPhotoUrl('');
    setVideoUrl('');
    setVideoDurationSeconds(0);
    setSelectedAsset(null);
    setImmediateAction('');
    setPreventiveAction('');
    setRootCause('');
    setAiAnalysisResult(null);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 transition-all">
      {/* Main Container - Full Native Mobile & Responsive without artificial desktop phone chrome */}
      <div className="w-full max-w-4xl bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* App Topbar - Vertical Layout with Logo on the Right (بالطول على اليمين) */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 px-4 sm:px-6 py-3.5 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Right side in RTL (The STOP logo and vertical badge block) */}
            <div className="flex items-center gap-3">
              {/* Red Circular STOP Sign Logo Badge - 5 clicks open secret Admin Login Gate */}
              <button
                type="button"
                onClick={handleStopBrandClick}
                className="shrink-0 drop-shadow-lg relative focus:outline-none cursor-pointer active:scale-95 transition-transform"
                title="STOP - نقر 5 مرات يفتح نافذة الدخول للإدارة"
              >
                <StopSignLogo className="w-12 h-12" withGlow />
                {stopClickCount > 0 && stopClickCount < 5 && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-slate-950 text-amber-400 text-[10px] font-black rounded-full animate-bounce shadow border border-amber-400">
                    {stopClickCount}/5
                  </span>
                )}
              </button>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-black tracking-wider text-xl uppercase font-mono text-slate-950">
                    {uiConfig?.pageTitle || 'STOP'}
                  </h2>
                  <span className="text-[10px] bg-slate-950 text-amber-400 px-2 py-0.5 rounded-full font-bold">
                    FIELD APP • تطبيق الميدان
                  </span>
                  {isOffline && (
                    <span className="text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded-full font-bold flex items-center gap-1 animate-pulse">
                      <WifiOff className="w-3 h-3" /> أوفلاين
                    </span>
                  )}
                </div>
                <div className="flex flex-col text-[11px] text-slate-950 font-bold leading-tight mt-0.5">
                  <span className="font-extrabold tracking-wide">
                    {uiConfig?.pageSubtitle || 'Safety Tracking & Observation Platform • منصة تتبع وملاحظة السلامة الميدانية'}
                  </span>
                </div>
              </div>
            </div>

            {/* Left Actions (Prominent Back, Weather, Simplified Mode Toggle, QR) */}
            <div className="flex items-center gap-2 flex-wrap self-end sm:self-auto">
              {/* Quick UI Simplification Toggle */}
              {(uiConfig ? uiConfig.showSimplifiedModeToggle : true) && (
                <button
                  type="button"
                  onClick={() => setIsSimplifiedWorkerMode((prev) => !prev)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition shadow-md ${
                    isSimplifiedWorkerMode
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-400'
                      : 'bg-slate-950 text-amber-400 hover:bg-slate-900'
                  }`}
                  title="التبديل بين الواجهة المبسطة للعاملين والواجهة الفنية المتقدمة"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isSimplifiedWorkerMode ? '✓ وضع العاملين المبسط (نشط)' : 'تفعيل الواجهة المبسطة'}</span>
                </button>
              )}

              {(uiConfig ? uiConfig.showWeatherWidget : true) && (
                <button
                  type="button"
                  onClick={() => setShowWeatherWidget((prev) => !prev)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950/90 hover:bg-slate-950 text-amber-300 rounded-xl text-xs font-bold shadow-md transition"
                  title="عرض حالة الطقس وإرشادات الملابس ومهمات الوقاية"
                >
                  <CloudSun className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">نشرة الطقس</span>
                </button>
              )}

              {(uiConfig ? uiConfig.showQrScanBtn : true) && (
                <button
                  type="button"
                  onClick={() => setIsQrModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 hover:bg-slate-900 text-amber-400 rounded-xl text-xs font-bold shadow-lg transition-transform active:scale-95"
                >
                  <QrCode className="w-4 h-4" />
                  <span className="hidden sm:inline">مسح QR</span>
                </button>
              )}

              {onBack && currentUserRole === 'SYSTEM_ADMIN' && (
                <button
                  type="button"
                  onClick={onBack}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-amber-400 font-black text-xs transition shadow-md active:scale-95"
                  title="تراجع والعودة للشاشة السابقة"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>تراجع</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Collapsible Weather & Natural Disaster Advisory Widget */}
        {(uiConfig ? uiConfig.showWeatherWidget : true) && showWeatherWidget && (
          <div className="p-4 bg-slate-950/90 border-b border-slate-800 animate-fadeIn">
            <SiteWeatherRiskWidget language={language} selectedStation={stationName} onStationChange={setStationName} />
          </div>
        )}

        {/* Observer Identity Differentiation: General Worker vs HSE Safety Officer */}
        {(uiConfig ? uiConfig.showObserverRoleToggle : true) && (
        <div className="bg-slate-950/90 border-b border-slate-800 px-4 sm:px-6 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-bold">هوية الراصد ومقدم البلاغ:</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border flex items-center gap-1.5 ${
                observerRole === 'HSE_OFFICER'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
              }`}>
                {observerRole === 'HSE_OFFICER' ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>ضابط ومفتش إدارة السلامة والصحة المهنية (Certified HSE Officer)</span>
                  </>
                ) : (
                  <>
                    <HardHat className="w-3.5 h-3.5 text-blue-400" />
                    <span>عامل / موظف تشغيل وإنتاج ميداني (Field Worker / Operator)</span>
                  </>
                )}
              </span>
            </div>

            {/* Quick Toggle for Observer Role */}
            <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setObserverRole('EMPLOYEE')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-bold transition ${
                  observerRole === 'EMPLOYEE'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <HardHat className="w-3.5 h-3.5" />
                <span>عامل تشغيل عادي</span>
              </button>

              <button
                type="button"
                onClick={() => setObserverRole('HSE_OFFICER')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-bold transition ${
                  observerRole === 'HSE_OFFICER'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>ضابط إدارة السلامة (HSE)</span>
              </button>
            </div>
          </div>
        </div>
        )}

        {/* Offline Banner if Active */}
        {isOffline && (
          <div className="bg-amber-950/70 border-b border-amber-800/60 px-4 py-2 flex items-center justify-between text-xs text-amber-200">
            <span className="flex items-center gap-2">
              <WifiOff className="w-3.5 h-3.5 text-amber-400" />
              أنت الآن في وضع عدم الاتصال (Offline)
            </span>
            <span className="bg-amber-500/20 px-2 py-0.5 rounded text-[11px] font-mono text-amber-300">
              قائمة الانتظار: {offlineQueueCount}
            </span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5">
          {/* Emergency Near-Miss Live Stream Launcher */}
          {onOpenLiveStream && (uiConfig ? uiConfig.showLiveStreamNearMissBanner : true) && (
            <div className="bg-gradient-to-r from-rose-950/80 via-red-950/60 to-slate-950 p-3.5 rounded-2xl border-2 border-rose-500/50 shadow-lg flex items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-black text-rose-300 text-xs">
                  <Radio className="w-4 h-4 animate-pulse text-rose-400" />
                  <span>بث مباشر للحوادث الوشيكة (Near-Miss Live)</span>
                </div>
                <p className="text-[10px] text-slate-300">
                  فتح بث مباشر فوري يوجه بصفارة إنذار صوتية لإدارة السلامة لاتخاذ أمر تصحيحي فوري
                </p>
              </div>

              <button
                type="button"
                onClick={onOpenLiveStream}
                className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-md shadow-rose-950/60 transition flex items-center gap-1.5 shrink-0 active:scale-95"
              >
                <Radio className="w-3.5 h-3.5" />
                <span>بدء البث 🔴</span>
              </button>
            </div>
          )}

          {/* Asset & Location Info Card */}
          {(uiConfig ? uiConfig.showAssetLocationSelector : true) && (
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-amber-400" />
                المعدة والموقع المرصود:
              </span>
              <button
                type="button"
                onClick={() => setIsQrModalOpen(true)}
                className="text-[11px] text-amber-400 hover:underline flex items-center gap-1"
              >
                تغيير الأصل / مسح QR
              </button>
            </div>

            {selectedAsset ? (
              <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-amber-300">{selectedAsset.name}</span>
                  <span className="font-mono text-[10px] bg-slate-900 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/40">
                    {selectedAsset.code}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  📍 {selectedAsset.station} • {selectedAsset.location}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] text-slate-400">المحطة / المنشأة</label>
                    {onOpenDropdownManager && (
                      <button
                        type="button"
                        onClick={onOpenDropdownManager}
                        className="text-[10px] text-amber-400 hover:underline"
                      >
                        تعديل القائمة
                      </button>
                    )}
                  </div>
                  {dropdownOptions?.stations && dropdownOptions.stations.length > 0 ? (
                    <select
                      value={stationName}
                      onChange={(e) => setStationName(e.target.value)}
                      className="w-full text-xs bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:border-amber-500 outline-none"
                    >
                      {dropdownOptions.stations.map((stn) => (
                        <option key={stn} value={stn}>
                          {stn}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={stationName}
                      onChange={(e) => setStationName(e.target.value)}
                      className="w-full text-xs bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:border-amber-500 outline-none"
                    />
                  )}
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">الموقع الدقيق</label>
                  <input
                    type="text"
                    value={locationDetails}
                    onChange={(e) => setLocationDetails(e.target.value)}
                    className="w-full text-xs bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:border-amber-500 outline-none"
                  />
                </div>
              </div>
            )}
          </div>
          )}

          {/* Voice-to-Text Component */}
          {(uiConfig ? uiConfig.showVoiceRecorder : true) && (
            <VoiceRecorder
              onTranscription={(text) => {
                setDescription((prev) => (prev ? `${prev}\n${text}` : text));
              }}
            />
          )}

          {/* Observation Text Description */}
          {(uiConfig ? uiConfig.showDescriptionField : true) && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <span>وصف الملاحظة الميدانية</span>
                <span className="text-rose-500">*</span>
              </label>
              {(uiConfig ? uiConfig.showAiGeminiClassifyBtn : true) && (
                <button
                  type="button"
                  onClick={handleAiAutoClassify}
                  disabled={isAiClassifying || !description.trim()}
                  className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold transition-all shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isAiClassifying ? 'جارِ التحليل الذكي...' : 'تصنيف تلقائي بـ Gemini'}</span>
                </button>
              )}
            </div>

            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اكتب هنا أو استخدم الميكروفون بالأعلى لوصف الحالة أو التصرف بدقة (مثال: يوجد تسريب زيوت بجوار ضاغط الغاز)..."
              className="w-full text-sm bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 placeholder:text-slate-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all"
            />
          </div>
          )}

          {/* AI Insights Card if Classified */}
          {aiAnalysisResult && (
            <div className="p-3.5 bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/40 rounded-xl space-y-2.5 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  نتيجة التحليل الذكي المعتمدة (Gemini STOP AI)
                </span>
                <span className="text-[11px] font-mono bg-amber-400/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/20">
                  درجة الخطر: {riskScore}/100
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">التوجيه الآلي للبلاغ</span>
                  <span className="font-semibold text-amber-200">{assignedTo}</span>
                </div>
                <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">السبب الجذري المرجح</span>
                  <span className="font-semibold text-slate-200">{rootCause}</span>
                </div>
              </div>

              {routingRule === 'CRITICAL_ESCALATION' && (
                <div className="p-2 bg-rose-950/60 border border-rose-800/80 rounded-lg text-rose-200 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>
                    <strong>تنبيه فوري:</strong> سيتم إرسال إشعار فوري (Push & SMS) لمدير السلامة وإدارة الصيانة لخطورة الحالة!
                  </span>
                </div>
              )}
            </div>
          )}

          {/* AI Incident Classification: Distinguish Near-Miss vs Potential vs Emergency */}
          <AIIncidentClassifier
            description={description}
            language={language}
            onApplyClassification={(classifiedType, suggestedSeverity, rationale) => {
              setAiClassification(classifiedType);
              if (classifiedType === 'EMERGENCY_INCIDENT') {
                setType('حالة غير آمنة (Unsafe Condition)');
                setSeverity('high');
                setRoutingRule('CRITICAL_ESCALATION');
                setAssignedTo('مدير عام السلامة وفريق الطوارئ الفوري');
                if (!immediateAction) {
                  setImmediateAction('إيقاف العمل الشامل فوراً، إطلاق صفارات الإنذار وعزل مصدر الخطر');
                }
              } else if (classifiedType === 'NEAR_MISS') {
                setType('تصرف غير آمن (Unsafe Act)');
                setSeverity('high');
                setRoutingRule('SUPERVISOR_ROUTING');
                if (!immediateAction) {
                  setImmediateAction('تأمين الموقع والتحقيق الفوري لمنع تكرار الحادثة الوشيكة');
                }
              } else {
                setType('حالة غير آمنة (Unsafe Condition)');
                setSeverity('medium');
                setRoutingRule('SUPERVISOR_ROUTING');
                if (!immediateAction) {
                  setImmediateAction('وضع شريط تحذيري وجدولة الإصلاح الوقائي');
                }
              }
            }}
          />

          {/* STOP Methodology Classification Selectors - In Simplified Mode, minimal intuitive cards are shown */}
          <div className="space-y-3">
            {(uiConfig ? uiConfig.showStopClassificationCards : true) && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    {isSimplifiedWorkerMode ? 'ماذا رأيت في الموقع؟ (اختر بسهولة):' : 'تصنيف منهجية STOP:'}
                  </label>
                  {isSimplifiedWorkerMode && (
                    <span className="text-[10px] text-emerald-400 font-bold">نمط الاختيار السريع للعمال</span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      'تصرف غير آمن (Unsafe Act)',
                      'حالة غير آمنة (Unsafe Condition)',
                      'ممارسة آمنة (Safe Practice)',
                    ] as ObservationType[]
                  ).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={`py-2 px-2 text-xs rounded-xl border text-center transition-all ${
                        type === t
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow-md'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {isSimplifiedWorkerMode ? (
                        t.includes('تصرف') ? '⚠️ تصرف عامل خطر' : t.includes('حالة') ? '🛠️ عطل / حالة بالمعدة' : '✅ عمل وسلوك آمن'
                      ) : (
                        t.split('(')[0]
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* In Simplified Mode, severity is simplified into 3 large clear buttons */}
            {(uiConfig ? uiConfig.showSeverityLevelSelector : true) && (
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  {isSimplifiedWorkerMode ? 'درجة الخطورة المتوقعة:' : 'مستوى الخطورة:'}
                </label>
                <div className="flex gap-2">
                  {(['low', 'medium', 'high'] as SeverityLevel[]).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSeverity(s)}
                      className={`flex-1 py-2.5 text-xs rounded-xl border font-bold capitalize transition-all ${
                        severity === s
                          ? s === 'high'
                            ? 'bg-rose-950 border-rose-600 text-rose-300 shadow-md'
                            : s === 'medium'
                            ? 'bg-amber-950 border-amber-600 text-amber-300 shadow-md'
                            : 'bg-emerald-950 border-emerald-600 text-emerald-300 shadow-md'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {s === 'high' ? '🚨 خطير جداً (حرج)' : s === 'medium' ? '⚠️ متوسط' : '🟢 بسيط / عادي'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Advanced technical fields: shown collapsed in Simplified Worker Mode, expanded for HSE Officer or by toggle */}
            {!isSimplifiedWorkerMode ? (
              <div className="space-y-3 pt-1 border-t border-slate-800">
                <div className="grid grid-cols-2 gap-3">
                  {(uiConfig ? uiConfig.showTechnicalCategorySelector : true) && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-slate-300">
                          المجال الفني:
                        </label>
                        {onOpenDropdownManager && (
                          <button
                            type="button"
                            onClick={onOpenDropdownManager}
                            className="text-[10px] text-amber-400 hover:underline"
                          >
                            تعديل
                          </button>
                        )}
                      </div>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:border-amber-500 outline-none"
                      >
                        {(dropdownOptions?.technicalCategories || [
                          'ميكانيكي / هيدروليكي',
                          'كهربائي',
                          'كيميائي / بيئي',
                          'مهمات الوقاية (PPE)',
                          'سلامة ومكافحة حريق',
                          'نظافة وترتيب الموقع',
                          'سلوك ومناولة مواد',
                        ]).map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      المسار التوجيهي المعتمد:
                    </label>
                    <div className="p-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-300">
                      {routingRule === 'CRITICAL_ESCALATION' ? '🚨 تصعيد فوري للإدارة' : '📋 توجيه للمشرف'}
                    </div>
                  </div>
                </div>

                {/* Root Cause & Assigned Team Dropdowns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {(uiConfig ? uiConfig.showRootCauseSelector : true) && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-slate-300">
                          السبب الجذري المرجح (Root Cause):
                        </label>
                        {onOpenDropdownManager && (
                          <button
                            type="button"
                            onClick={onOpenDropdownManager}
                            className="text-[10px] text-amber-400 hover:underline"
                          >
                            تعديل
                          </button>
                        )}
                      </div>
                      <select
                        value={rootCause}
                        onChange={(e) => setRootCause(e.target.value)}
                        className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:border-amber-500 outline-none"
                      >
                        <option value="">-- اختر السبب الجذري أو اتركه لتحليل الذكاء الاصطناعي --</option>
                        {(dropdownOptions?.rootCauses || [
                          'نقص التدريب أو قلة الخبرة الميدانية',
                          'تجاوز إجراءات وقواعد السلامة المعتمدة',
                          'تقادم المعدة أو عيب في الصيانة الدورية',
                          'عدم توفر أو عدم ملاءمة مهمات الوقاية (PPE)',
                          'ضغط العمل والاستعجال في التنفيذ',
                        ]).map((rc) => (
                          <option key={rc} value={rc}>
                            {rc}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {(uiConfig ? uiConfig.showAssignedTeamSelector : true) && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-slate-300">
                          توجيه البلاغ ومتابعته (Assigned Team):
                        </label>
                        {onOpenDropdownManager && (
                          <button
                            type="button"
                            onClick={onOpenDropdownManager}
                            className="text-[10px] text-amber-400 hover:underline"
                          >
                            تعديل
                          </button>
                        )}
                      </div>
                      <select
                        value={assignedTo}
                        onChange={(e) => setAssignedTo(e.target.value)}
                        className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:border-amber-500 outline-none"
                      >
                        {(dropdownOptions?.assignedTeams || [
                          'مشرف الوردية الميداني',
                          'مدير السلامة وإدارة الصيانة المركزية (تصعيد فوري)',
                          'فريق الصيانة الكهربائية الميدانية',
                          'فريق الصيانة الميكانيكية والضواغط',
                          'قسم تدريب وتأهيل السلامة (HSE)',
                        ]).map((team) => (
                          <option key={team} value={team}>
                            {team}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setIsSimplifiedWorkerMode(false)}
                  className="text-[11px] text-slate-400 hover:text-amber-400 underline flex items-center gap-1"
                >
                  <span>خيارات فنية إضافية (أسباب جذرية، فرق صيانة متخصصة) ▾</span>
                </button>
              </div>
            )}
          </div>

          {/* Immediate Action Field */}
          {(uiConfig ? uiConfig.showImmediateActionField : true) && (
          <div>
            <label className="text-xs font-bold text-slate-200 block mb-1">
              الإجراء التصحيحي الفوري المتخذ (Immediate Action):
            </label>
            <input
              type="text"
              value={immediateAction}
              onChange={(e) => setImmediateAction(e.target.value)}
              placeholder="مثال: تم إيقاف المضخة فوراً ووضع شريط تحذيري واستدعاء مسؤول الصيانة..."
              className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:border-amber-500 outline-none"
            />
          </div>
          )}

          {/* Photo Attachment & AI Radar Scanner */}
          {(uiConfig ? uiConfig.showPhotoUpload : true) && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-amber-400" />
                <span>إرفاق صورة / فحص بالرادار الذكي</span>
              </label>
              {onOpenRadar && (
                <button
                  type="button"
                  onClick={onOpenRadar}
                  className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold transition shadow"
                >
                  <Scan className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
                  <span>فتح رادار الكاميرا والحرارة</span>
                </button>
              )}
            </div>

            {photoUrl ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-700 h-32">
                <img
                  src={photoUrl}
                  alt="Inspection site"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-slate-950/80 px-2 py-0.5 rounded text-[10px] text-emerald-400 flex items-center gap-1">
                  <Check className="w-3 h-3" /> تم التقاط الصورة
                </div>
                <button
                  type="button"
                  onClick={() => setPhotoUrl('')}
                  className="absolute top-2 left-2 bg-slate-950/80 text-rose-400 px-2 py-0.5 rounded text-[10px] hover:underline"
                >
                  إزالة الصورة
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setPhotoUrl(
                      'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=600&q=80'
                    )
                  }
                  className="flex-1 py-3 px-3 rounded-xl border border-dashed border-slate-700 bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-slate-200 text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Camera className="w-4 h-4 text-amber-400" />
                  <span>التقاط صورة بالمحطة</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setPhotoUrl(
                      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'
                    )
                  }
                  className="px-3 py-3 rounded-xl border border-slate-800 bg-slate-950 text-slate-400 text-xs hover:bg-slate-900"
                >
                  صورة خطر عالي
                </button>
              </div>
            )}
          </div>
          )}

          {/* Short Video Clip Recording for Observed Hazard */}
          {(uiConfig ? uiConfig.showVideoRecorder : true) && (
            <ShortVideoRecorder
              existingVideoUrl={videoUrl}
              onVideoCaptured={(url, duration) => {
                setVideoUrl(url);
                setVideoDurationSeconds(duration);
              }}
              onClearVideo={() => {
                setVideoUrl('');
                setVideoDurationSeconds(0);
              }}
            />
          )}

          {/* Gamification Points Indicator */}
          {(uiConfig ? uiConfig.showPointsRewardCard : true) && (
          <div className="flex items-center justify-between p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs">
            <div className="flex items-center gap-2 text-amber-300">
              <Award className="w-4 h-4 text-amber-400" />
              <span>مكافأة رصد هذا البلاغ:</span>
            </div>
            <span className="font-bold text-amber-400">
              +{severity === 'high' ? 50 : type.includes('تصرف') ? 35 : 25} نقطة سلامة 🛡️
            </span>
          </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-900/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <Send className="w-4 h-4" />
            <span>
              {isOffline ? 'حفظ الملاحظة محلياً (Offline Sync)' : 'إرسال وتوجيه بطاقة STOP فوراً'}
            </span>
          </button>
        </form>
      </div>

      {/* Confirmation Modal Before Dispatch */}
      {isConfirmModalOpen && pendingObservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border-2 border-amber-500/50 rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl relative overflow-hidden text-right">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100">تأكيد إرسال وتوجيه بطاقة STOP</h3>
                  <p className="text-[11px] text-slate-400">يرجى مراجعة تفاصيل البلاغ ومسار التوجيه المعتمد</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Summary Details */}
            <div className="space-y-3 mb-5 text-xs">
              {/* Ticket No & Observation Type */}
              <div className="flex items-center justify-between p-2.5 bg-slate-950/70 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-400 text-[10px] block">رقم التذكرة:</span>
                  <span className="font-mono font-bold text-amber-400 text-sm">{pendingObservation.ticketNumber}</span>
                </div>
                <div className="text-left">
                  <span className="text-slate-400 text-[10px] block">نوع الملاحظة:</span>
                  <span className="font-bold text-slate-200">{pendingObservation.type.split('(')[0]}</span>
                </div>
              </div>

              {/* Severity & Risk Score */}
              <div className="flex items-center justify-between p-2.5 bg-slate-950/70 rounded-xl border border-slate-800">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 text-[10px]">مستوى الخطورة:</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded-md text-[10px] ${
                      pendingObservation.severity === 'high'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                        : pendingObservation.severity === 'medium'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    }`}
                  >
                    {pendingObservation.severity === 'high'
                      ? 'حرج (High Risk)'
                      : pendingObservation.severity === 'medium'
                      ? 'متوسط (Medium)'
                      : 'منخفض (Low)'}
                  </span>
                </div>
                <div className="text-slate-300 font-mono text-[11px]">
                  درجة الخطر: <span className="font-bold text-amber-400">{pendingObservation.riskScore}/100</span>
                </div>
              </div>

              {/* Location & Asset */}
              <div className="p-2.5 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[10px]">الموقع:</span>
                  <span className="text-slate-200 font-medium truncate max-w-[200px]">{pendingObservation.stationName}</span>
                </div>
                {pendingObservation.assetName && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[10px]">المعدة / الأصل:</span>
                    <span className="text-amber-300 font-medium">{pendingObservation.assetName}</span>
                  </div>
                )}
              </div>

              {/* Automated Routing Protocol Box */}
              <div
                className={`p-3 rounded-xl border ${
                  pendingObservation.severity === 'high'
                    ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                    : 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <BellRing className="w-3.5 h-3.5 text-amber-400" />
                  <span>مسار التوجيه والإشعار الآلي المعتمد:</span>
                </div>
                <div className="text-[11px] leading-relaxed">
                  {pendingObservation.severity === 'high' ? (
                    <span className="text-rose-300">
                      🚨 <strong className="text-rose-200">تصعيد طارئ فوري:</strong> سيتم توجيه البلاغ مباشرة إلى{' '}
                      <strong>{pendingObservation.assignedTo}</strong> مع إرسال تنبيه SMS وإنذار فوري على لوحة الإدارة.
                    </span>
                  ) : pendingObservation.type.includes('تصرف') ? (
                    <span className="text-amber-300">
                      🟡 <strong className="text-amber-200">توجيه ميداني:</strong> سيتم توجيه البلاغ إلى{' '}
                      <strong>{pendingObservation.assignedTo}</strong> لعقد جلسة توعية وتصحيح سلوكي مباشر.
                    </span>
                  ) : (
                    <span className="text-cyan-300">
                      🔵 <strong className="text-cyan-200">توجيه فني:</strong> سيتم توجيه البلاغ إلى{' '}
                      <strong>{pendingObservation.assignedTo}</strong> لجدولة الفحص والصيانة الوقائية.
                    </span>
                  )}
                </div>
              </div>

              {/* Immediate Action Preview */}
              {pendingObservation.immediateAction && (
                <div className="p-2.5 bg-slate-950/70 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px] block mb-0.5">الإجراء الفوري المنفذ بالموقع:</span>
                  <p className="text-slate-300 text-[11px] line-clamp-2">{pendingObservation.immediateAction}</p>
                </div>
              )}

              {/* Reward & Sync Indicator */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                <span>النقاط المكتسبة: <strong className="text-amber-400 font-mono">+{pendingObservation.pointsAwarded} نقطة</strong></span>
                <span>{isOffline ? '⚡ حفظ محلي (Offline)' : '🌐 إرسال فوري متصل'}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(false)}
                className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors"
              >
                مراجعة وتعديل
              </button>
              <button
                type="button"
                onClick={handleConfirmAndDispatch}
                className="py-2.5 px-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-xl text-xs font-black shadow-lg shadow-amber-950/40 flex items-center justify-center gap-1.5 transition-all active:scale-95"
              >
                <CheckCheck className="w-4 h-4" />
                <span>تأكيد الإرسال والتوجيه</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post-Dispatch Confirmation Receipt Modal */}
      {confirmedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border-2 border-emerald-500/60 rounded-3xl p-6 text-center max-w-md w-full shadow-2xl relative overflow-hidden">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-emerald-500/40 animate-bounce">
              <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/30 mb-2">
              <FileCheck className="w-3.5 h-3.5" />
              <span>تأكيد الاعتماد والتوجيه الرسمي</span>
            </div>

            <h3 className="text-xl font-black text-slate-100 mb-1">تم إرسال وتوجيه بطاقة STOP بنجاح!</h3>
            <p className="text-xs text-slate-300 mb-4">
              تم توثيق البلاغ وتوجيهه إلى الجهة المسؤولة بالكامل وإدراجه في سجل الأمان
            </p>

            {/* Ticket Card Details */}
            <div className="bg-slate-950/90 rounded-2xl border border-slate-800 p-4 mb-5 text-right space-y-2.5 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                <span className="text-slate-400">رقم البلاغ المعتمد:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-amber-400 text-sm tracking-wider">
                    {confirmedTicket.ticketNumber}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(confirmedTicket.ticketNumber);
                      setIsCopied(true);
                      setTimeout(() => setIsCopied(false), 2000);
                    }}
                    className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:text-amber-400 text-[10px] flex items-center gap-1"
                    title="نسخ رقم التذكرة"
                  >
                    {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{isCopied ? 'تم النسخ' : 'نسخ'}</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">تاريخ وتوقيت الرصد:</span>
                <span className="text-slate-200 font-mono">{confirmedTicket.date} • {confirmedTicket.time}</span>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">الجهة الموجه إليها:</span>
                <span className="text-amber-300 font-bold">{confirmedTicket.assignedTo}</span>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">حالة الإشعار:</span>
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCheck className="w-3.5 h-3.5" />
                  تم إرسال إشعار فوري وتنبيه SMS
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/80">
                <span className="text-slate-400">مكافأة المشاركة:</span>
                <span className="text-amber-400 font-bold font-mono">+{confirmedTicket.pointsAwarded} نقطة أمان 🛡️</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setConfirmedTicket(null)}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-950/40 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>تسجيل بطاقة STOP جديدة</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Scanner Modal */}
      <QrScanModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        onSelectAsset={handleAssetScanned}
      />
    </div>
  );
};
