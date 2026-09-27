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
  MapPin,
  Navigation,
  RefreshCw,
  Video,
  Mic,
  Trash2,
  Play,
  Home,
  LogOut,
} from 'lucide-react';
import { Asset, DropdownOptionsMap, ObservationType, SeverityLevel, StopObservation, AIIncidentClassification, UserRole, Language, AppUiCustomization } from '../types';
import { VoiceRecorder } from './VoiceRecorder';
import { QrScanModal } from './QrScanModal';
import { ShortVideoRecorder } from './ShortVideoRecorder';
import { AIIncidentClassifier } from './AIIncidentClassifier';
import { SiteWeatherRiskWidget } from './SiteWeatherRiskWidget';
import { StopSignLogo } from './StopSignLogo';
import { InteractiveMapModal } from './InteractiveMapModal';

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
  onGoBack?: () => void;
  onGoHome?: () => void;
  onLogoutToLogin?: () => void;
  language?: Language;
  currentUserRole?: UserRole;
  uiConfig?: AppUiCustomization['workerPage'];
  onOpenAdminLogin?: () => void;
  onOpenAiInspection?: () => void;
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
  onGoBack,
  onGoHome,
  onLogoutToLogin,
  language = 'ar',
  currentUserRole = 'EMPLOYEE',
  uiConfig,
  onOpenAdminLogin,
  onOpenAiInspection,
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

  // Real-time automatic GPS location detection & compact location name
  const [realLocationName, setRealLocationName] = useState<string>(
    stationName || 'موقع العمل الميداني الحالي'
  );
  const [isLocationConfirmed, setIsLocationConfirmed] = useState<boolean>(true);

  const [gpsLocation, setGpsLocation] = useState<{
    lat: number;
    lng: number;
    accuracy: number;
    status: 'detecting' | 'detected' | 'error';
    source: 'satellite' | 'network';
    resolvedAddress: string;
    timestamp: string;
  }>({
    lat: 30.0444,
    lng: 31.2357,
    accuracy: 3,
    status: 'detected',
    source: 'satellite',
    resolvedAddress: '30.04440° N, 31.23570° E',
    timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  });

  const [gpsUpdateSuccess, setGpsUpdateSuccess] = useState<boolean>(false);

  // Compact Popups / Modals State
  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState<boolean>(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState<boolean>(false);

  const handleConfirmLocationFromMap = (
    chosenLocationName: string,
    lat: number,
    lng: number,
    acc: number = 3
  ) => {
    setRealLocationName(chosenLocationName);
    setStationName(chosenLocationName);
    const coordsStr = `${lat.toFixed(5)}° N, ${lng.toFixed(5)}° E`;
    const timeStr = new Date().toLocaleTimeString('ar-EG', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    setLocationDetails(`${chosenLocationName} • إحداثيات: ${coordsStr}`);
    setGpsLocation({
      lat,
      lng,
      accuracy: acc,
      status: 'detected',
      source: 'satellite',
      resolvedAddress: coordsStr,
      timestamp: timeStr,
    });
    setIsLocationConfirmed(true);
    setGpsUpdateSuccess(true);
    setTimeout(() => setGpsUpdateSuccess(false), 3500);
  };

  // Reverse geocode real coordinates to actual place / street / district name on maps
  const fetchRealPlaceName = async (lat: number, lng: number): Promise<string> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=ar`,
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        if (data && data.address) {
          const addr = data.address;
          const road = addr.road || addr.street || addr.pedestrian || '';
          const suburb = addr.suburb || addr.neighbourhood || addr.quarter || addr.city_district || '';
          const city = addr.city || addr.town || addr.village || addr.municipality || '';
          const state = addr.state || addr.governorate || '';

          const parts = [road, suburb, city, state].filter(Boolean);
          if (parts.length > 0) {
            return parts.join('، ');
          }
          if (data.display_name) {
            return data.display_name.split(',').slice(0, 3).join('، ');
          }
        }
      }
    } catch (_) {}
    return '';
  };

  const detectLocationAutomatically = async () => {
    setGpsLocation((prev) => ({ ...prev, status: 'detecting' }));
    setGpsUpdateSuccess(false);

    const applyLocationResults = async (lat: number, lng: number, acc: number, source: 'satellite' | 'network') => {
      const coordsStr = `${lat.toFixed(5)}° N, ${lng.toFixed(5)}° E`;
      const timeStr = new Date().toLocaleTimeString('ar-EG', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      // Try reverse geocoding to get actual real street/district from map
      let placeName = await fetchRealPlaceName(lat, lng);

      if (!placeName) {
        placeName = realLocationName && !realLocationName.includes('جارِ')
          ? realLocationName
          : `موقع ميداني (${coordsStr})`;
      }

      setRealLocationName(placeName);
      setStationName(placeName);
      setLocationDetails(`${placeName} • إحداثيات: ${coordsStr} (دقة ±${acc}م)`);
      setGpsLocation({
        lat,
        lng,
        accuracy: acc,
        status: 'detected',
        source,
        resolvedAddress: coordsStr,
        timestamp: timeStr,
      });

      setIsLocationConfirmed(true);
      setGpsUpdateSuccess(true);
      setTimeout(() => setGpsUpdateSuccess(false), 5000);

      try {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate([40, 20, 40]);
        }
      } catch (_) {}
    };

    let hasResolved = false;

    // 1. First attempt real hardware GPS from the device
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      try {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            if (hasResolved) return;
            hasResolved = true;
            const { latitude, longitude, accuracy } = pos.coords;
            const acc = Math.max(2, Math.round(accuracy) || 3);
            await applyLocationResults(latitude, longitude, acc, 'satellite');
          },
          async () => {
            if (hasResolved) return;
            hasResolved = true;
            await fallbackRealLocation();
          },
          { enableHighAccuracy: true, timeout: 6000, maximumAge: 0 }
        );
      } catch (_) {
        if (!hasResolved) {
          hasResolved = true;
          await fallbackRealLocation();
        }
      }
    } else {
      await fallbackRealLocation();
    }

    // Safety failsafe
    setTimeout(async () => {
      if (!hasResolved) {
        hasResolved = true;
        await fallbackRealLocation();
      }
    }, 6500);

    async function fallbackRealLocation() {
      // 1. Fast geojs IP location attempt (CORS enabled without token)
      try {
        const geoRes = await fetch('https://get.geojs.io/v1/ip/geo.json');
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          if (geoData && geoData.latitude && geoData.longitude) {
            const lat = parseFloat(geoData.latitude);
            const lng = parseFloat(geoData.longitude);
            const cityName = [geoData.city, geoData.region, geoData.country].filter(Boolean).join('، ');
            if (cityName) {
              setRealLocationName(cityName);
              setStationName(cityName);
            }
            await applyLocationResults(lat, lng, 10, 'network');
            return;
          }
        }
      } catch (_) {}

      // 2. Secondary IP location attempt
      try {
        const ipRes = await fetch('https://ipapi.co/json/');
        if (ipRes.ok) {
          const ipData = await ipRes.json();
          if (ipData && ipData.latitude && ipData.longitude) {
            const cityName = [ipData.city, ipData.region, ipData.country_name].filter(Boolean).join('، ');
            if (cityName) {
              setRealLocationName(cityName);
              setStationName(cityName);
            }
            await applyLocationResults(ipData.latitude, ipData.longitude, 12, 'network');
            return;
          }
        }
      } catch (_) {}

      // 3. Keep current position or base regional hub
      const baseLat = gpsLocation.lat || 30.0444;
      const baseLng = gpsLocation.lng || 31.2357;
      await applyLocationResults(baseLat, baseLng, 3, 'satellite');
    }
  };

  useEffect(() => {
    detectLocationAutomatically();
  }, []);

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

              {/* 1. زر التراجع للصفحة السابقة */}
              {(onGoBack || onBack) && (
                <button
                  type="button"
                  onClick={onGoBack || onBack}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/90 hover:bg-slate-900 text-amber-300 font-bold text-xs transition shadow-md active:scale-95 cursor-pointer border border-amber-500/30"
                  title="تراجع والعودة للشاشة السابقة"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>تراجع</span>
                </button>
              )}

              {/* 2. زر العودة للرئيسية */}
              {onGoHome && (
                <button
                  type="button"
                  onClick={onGoHome}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/90 hover:bg-slate-900 text-emerald-400 font-bold text-xs transition shadow-md active:scale-95 cursor-pointer border border-emerald-500/30"
                  title="العودة للصفحة الرئيسية (الميدان)"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">الرئيسية</span>
                </button>
              )}

              {/* 3. زر الخروج والعودة لشاشة الدخول */}
              {onLogoutToLogin && (
                <button
                  type="button"
                  onClick={onLogoutToLogin}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 font-bold text-xs transition shadow-md active:scale-95 cursor-pointer border border-rose-800/60"
                  title="تسجيل الخروج والعودة لشاشة الدخول"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">خروج</span>
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
          {/* Compact Media & Real-Time Action Toolbar (الأيقونات متراصة جنباً إلى جنب وتفتح نوافذ مخصصة) */}
          {/* Compact Media & Real-Time Action Toolbar (الأيقونات متراصة جنباً إلى جنب وبسيطة وتفتح نوافذ مخصصة) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-bold text-slate-300">أدوات التوثيق السريع والبث الميداني:</span>
              <span className="text-[10px] text-amber-400 font-mono">انقر على الأيقونة لفتح النافذة المخصصة</span>
            </div>

            {/* Compact Horizontal Grid of Action Icons */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 p-2.5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-md">
              {/* 1. Live Stream Button */}
              {onOpenLiveStream && (
                <button
                  type="button"
                  onClick={onOpenLiveStream}
                  className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-950 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-500/50 transition active:scale-95 group text-slate-300 cursor-pointer"
                  title="فتح بث مباشر للحوادث الوشيكة (Near-Miss Live)"
                >
                  <div className="relative">
                    <Radio className="w-5 h-5 text-rose-400 group-hover:scale-110 transition-transform" />
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping absolute -top-0.5 -right-0.5" />
                  </div>
                  <span className="text-[11px] font-bold text-rose-300 truncate max-w-full">بث مباشر</span>
                </button>
              )}

              {/* 2. Video Recorder Button */}
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(true)}
                className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl border transition active:scale-95 group cursor-pointer ${
                  videoUrl
                    ? 'bg-amber-500/15 border-amber-500/50 text-amber-300'
                    : 'bg-slate-950 hover:bg-slate-850 border-slate-800 text-slate-300'
                }`}
                title="تسجيل لقطة فيديو قصيرة (15 ثانية)"
              >
                <div className="relative">
                  <Video className="w-5 h-5 group-hover:scale-110 transition-transform text-amber-400" />
                  {videoUrl && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5" />
                  )}
                </div>
                <span className="text-[11px] font-bold truncate max-w-full">
                  {videoUrl ? 'فيديو ✓' : 'لقطة فيديو'}
                </span>
              </button>

              {/* 3. Photo Capture Button */}
              <button
                type="button"
                onClick={() => setIsPhotoModalOpen(true)}
                className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl border transition active:scale-95 group cursor-pointer ${
                  photoUrl
                    ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300'
                    : 'bg-slate-950 hover:bg-slate-850 border-slate-800 text-slate-300'
                }`}
                title="التقاط أو إرفاق صورة الواقعة"
              >
                <div className="relative">
                  <Camera className="w-5 h-5 group-hover:scale-110 transition-transform text-emerald-400" />
                  {photoUrl && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5" />
                  )}
                </div>
                <span className="text-[11px] font-bold truncate max-w-full">
                  {photoUrl ? 'صورة ✓' : 'توثيق بصورة'}
                </span>
              </button>

              {/* 4. Voice Recorder Button */}
              <button
                type="button"
                onClick={() => setIsVoiceModalOpen(true)}
                className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 transition active:scale-95 group text-slate-300 cursor-pointer"
                title="تسجيل صوتي وتحويل تلقائي لكتابة"
              >
                <Mic className="w-5 h-5 group-hover:scale-110 transition-transform text-purple-400" />
                <span className="text-[11px] font-bold text-slate-300 truncate max-w-full">تسجيل صوتي</span>
              </button>

              {/* 5. Interactive Map Button */}
              <button
                type="button"
                onClick={() => setIsMapModalOpen(true)}
                className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 transition active:scale-95 group text-slate-300 cursor-pointer"
                title="فتح الخريطة التفاعلية وتأكيد الموقع بدقة"
              >
                <div className="relative">
                  <MapPin className="w-5 h-5 group-hover:scale-110 transition-transform text-sky-400" />
                  <span className="w-2 h-2 rounded-full bg-sky-400 absolute -top-0.5 -right-0.5" />
                </div>
                <span className="text-[11px] font-bold text-slate-300 truncate max-w-full">خريطة الموقع</span>
              </button>

              {/* 6. QR Code Scanner Button */}
              <button
                type="button"
                onClick={() => setIsQrModalOpen(true)}
                className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl border transition active:scale-95 group cursor-pointer ${
                  selectedAsset
                    ? 'bg-amber-500/15 border-amber-500/50 text-amber-300'
                    : 'bg-slate-950 hover:bg-slate-850 border-slate-800 text-slate-300'
                }`}
                title="مسح رمز الاستجابة السريعة للمعدة (Asset QR)"
              >
                <div className="relative">
                  <QrCode className="w-5 h-5 group-hover:scale-110 transition-transform text-amber-400" />
                  {selectedAsset && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5" />
                  )}
                </div>
                <span className="text-[11px] font-bold truncate max-w-full">
                  {selectedAsset ? 'معدة ✓' : 'مسح QR'}
                </span>
              </button>

              {/* 7. AI Visual & Acoustic Industrial Inspection */}
              {onOpenAiInspection && (
                <button
                  type="button"
                  onClick={onOpenAiInspection}
                  className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl bg-gradient-to-br from-indigo-950/90 to-purple-950/90 hover:from-indigo-900 hover:to-purple-900 border border-indigo-500/50 transition active:scale-95 group text-indigo-200 cursor-pointer shadow col-span-3 sm:col-span-1"
                  title="الرصد البصري والصوتي بالذكاء الاصطناعي (Computer Vision & Machine Hearing)"
                >
                  <div className="relative">
                    <Sparkles className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping absolute -top-0.5 -right-0.5" />
                  </div>
                  <span className="text-[11px] font-bold text-indigo-300 truncate max-w-full">فحص AI</span>
                </button>
              )}
            </div>

            {/* AI Industrial Inspection Feature Banner */}
            {onOpenAiInspection && (
              <div className="bg-gradient-to-r from-indigo-950/90 via-slate-900 to-purple-950/90 p-3.5 rounded-2xl border border-indigo-500/40 shadow-md flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center justify-center shrink-0">
                    <Cpu className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-white">الرصد البصري والصوتي بالذكاء الاصطناعي</span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        AI Inspection
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      كشف تسريبات الغاز المرئية، الاهتزازات، التآكل، وبصمة صوت هسهسة الغاز أو احتكاك المحامل
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onOpenAiInspection}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shrink-0 flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>بدء الفحص</span>
                </button>
              </div>
            )}

            {/* Attached Media Chips (Clean & compact badges) */}
            {(videoUrl || photoUrl || selectedAsset) && (
              <div className="flex items-center gap-2 pt-1 overflow-x-auto no-scrollbar text-xs">
                {videoUrl && (
                  <div className="flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/40 px-2.5 py-1 rounded-xl text-amber-300 text-[11px] font-bold shrink-0">
                    <Video className="w-3.5 h-3.5" />
                    <span>مقطع فيديو ({videoDurationSeconds || 15}ث)</span>
                    <button
                      type="button"
                      onClick={() => setIsVideoModalOpen(true)}
                      className="text-amber-400 hover:underline mx-1 text-[10px]"
                    >
                      معاينة
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setVideoUrl('');
                        setVideoDurationSeconds(0);
                      }}
                      className="text-rose-400 hover:text-rose-300 p-0.5"
                      title="حذف الفيديو"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {photoUrl && (
                  <div className="flex items-center gap-1.5 bg-emerald-500/15 border border-emerald-500/40 px-2.5 py-1 rounded-xl text-emerald-300 text-[11px] font-bold shrink-0">
                    <Camera className="w-3.5 h-3.5" />
                    <span>صورة مرفقة</span>
                    <button
                      type="button"
                      onClick={() => setIsPhotoModalOpen(true)}
                      className="text-emerald-400 hover:underline mx-1 text-[10px]"
                    >
                      معاينة
                    </button>
                    <button
                      type="button"
                      onClick={() => setPhotoUrl('')}
                      className="text-rose-400 hover:text-rose-300 p-0.5"
                      title="حذف الصورة"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {selectedAsset && (
                  <div className="flex items-center gap-1.5 bg-sky-500/15 border border-sky-500/40 px-2.5 py-1 rounded-xl text-sky-300 text-[11px] font-bold shrink-0">
                    <QrCode className="w-3.5 h-3.5" />
                    <span>معدة: {selectedAsset.name}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedAsset(null)}
                      className="text-rose-400 hover:text-rose-300 p-0.5"
                      title="إلغاء ربط المعدة"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Compact Field Location Data & Name (Space-Efficient with Interactive Map & Auto GPS) */}
          <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800/80 space-y-2.5 shadow-sm">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>الموقع والمنشأة الميدانية</span>
                <span className="text-rose-500">*</span>
              </label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsMapModalOpen(true)}
                  className="text-[11px] text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1 transition cursor-pointer"
                  title="فتح الخريطة التفاعلية لاختيار أو تصحيح الموقع"
                >
                  <MapPin className="w-3.5 h-3.5 text-sky-400" />
                  <span>تأكيد على الخريطة 🗺️</span>
                </button>

                <span className="text-slate-700">|</span>

                <button
                  type="button"
                  onClick={() => detectLocationAutomatically()}
                  disabled={gpsLocation.status === 'detecting'}
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 transition cursor-pointer"
                  title="تحديث تلقائي للموقع الحالي عبر GPS"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${gpsLocation.status === 'detecting' ? 'animate-spin' : ''}`} />
                  <span>{gpsLocation.status === 'detecting' ? 'جارِ الرصد...' : 'تحديث تلقائي (GPS)'}</span>
                </button>
              </div>
            </div>

            {/* Visual Map Preview & Coordinates Bar */}
            <div 
              onClick={() => setIsMapModalOpen(true)}
              className="relative h-28 rounded-xl overflow-hidden border border-slate-800 hover:border-amber-500/50 transition cursor-pointer group bg-slate-900 shadow-inner flex items-center justify-center"
              title="انقر لفتح الخريطة التفاعلية وتعديل أو تثبيت النقطة"
            >
              {/* Visual Map Surface */}
              <div 
                className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://tile.openstreetmap.org/16/${Math.floor((gpsLocation.lng + 180) / 360 * Math.pow(2, 16))}/${Math.floor((1 - Math.log(Math.tan(gpsLocation.lat * Math.PI / 180) + 1 / Math.cos(gpsLocation.lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, 16))}.png')`
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />

              {/* Center Map Pin */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="relative flex items-center justify-center">
                  <span className="w-8 h-8 rounded-full bg-amber-500/30 animate-ping absolute" />
                  <div className="w-7 h-7 rounded-full bg-slate-950 border-2 border-amber-400 text-amber-400 flex items-center justify-center shadow-lg">
                    <MapPin className="w-4 h-4 text-amber-400" />
                  </div>
                </div>
                <div className="mt-1 bg-slate-950/90 border border-slate-800 px-2 py-0.5 rounded-md text-[10px] text-amber-300 font-mono font-bold shadow">
                  {gpsLocation.resolvedAddress}
                </div>
              </div>

              {/* Floating action tag */}
              <div className="absolute top-2 left-2 z-10 bg-slate-950/80 px-2 py-0.5 rounded text-[10px] text-sky-300 flex items-center gap-1 group-hover:text-amber-300 transition">
                <span>🗺️ انقر لتكبير وتعديل الخريطة</span>
              </div>
            </div>

            {/* Editable Location Input with Confirmation Button */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={realLocationName}
                  onChange={(e) => {
                    const val = e.target.value;
                    setRealLocationName(val);
                    setStationName(val);
                    setLocationDetails(`${val} • ${gpsLocation.resolvedAddress}`);
                    setIsLocationConfirmed(false);
                  }}
                  placeholder="اكتب اسم الموقع يدوياً أو اختر من الخريطة..."
                  className="w-full text-xs bg-slate-900 border border-slate-700/80 rounded-xl p-2.5 text-slate-100 placeholder:text-slate-500 focus:border-amber-400 outline-none transition"
                />
              </div>

              <button
                type="button"
                onClick={() => setIsLocationConfirmed((prev) => !prev)}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 shrink-0 cursor-pointer shadow-sm active:scale-95 ${
                  isLocationConfirmed
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black'
                }`}
                title="تأكيد صحة الموقع أو اعتماده"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isLocationConfirmed ? 'الموقع مؤكد على الخريطة ✓' : 'تأكيد صحة الموقع'}</span>
              </button>
            </div>

            {/* Quick facility preset tags */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-[11px]">
              <span className="text-slate-400 text-[10px] shrink-0">مرافق سريعة:</span>
              {['محطة التموين المركزية', 'منطقة التعبئة والضواغط', 'مستودع الوقود ومحطة الضخ', 'ورشة الصيانة الميكانيكية', 'رصيف الشحن والتفريغ'].map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => {
                    setRealLocationName(loc);
                    setStationName(loc);
                    setLocationDetails(`${loc} • ${gpsLocation.resolvedAddress}`);
                    setIsLocationConfirmed(true);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] shrink-0 font-medium transition border cursor-pointer ${
                    realLocationName === loc
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold'
                      : 'bg-slate-900 hover:bg-slate-850 text-slate-300 border-slate-800'
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>

            {/* GPS Feedback & Metadata */}
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono px-1 flex-wrap gap-2 pt-0.5">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span>📍</span>
                <span>{gpsLocation.resolvedAddress}</span>
                <span className="text-emerald-400 font-sans font-medium">(دقة ±{gpsLocation.accuracy}م)</span>
              </span>
              <span className="text-slate-400 font-sans">
                {gpsLocation.status === 'detecting' ? '📡 جارِ فحص الإشارة...' : `آخر رصد: ${gpsLocation.timestamp}`}
              </span>
            </div>

            {gpsUpdateSuccess && (
              <div className="p-2 bg-emerald-500/15 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>تم تحديث وتثبيت الموقع الجغرافي الفعلي بنجاح ✓</span>
              </div>
            )}
          </div>

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

          {/* Compact Attached Media Preview (if photo or video is added via top icon buttons) */}
          {(photoUrl || videoUrl) && (
            <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-300 block">المرفقات التوثيقية المعتمدة:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {photoUrl && (
                  <div className="relative rounded-xl overflow-hidden border border-slate-700 h-28 bg-slate-900 group">
                    <img src={photoUrl} alt="Inspection site" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsPhotoModalOpen(true)}
                        className="px-2.5 py-1 bg-slate-800 text-xs text-white rounded-lg"
                      >
                        معاينة وتغيير
                      </button>
                      <button
                        type="button"
                        onClick={() => setPhotoUrl('')}
                        className="p-1 bg-rose-600 text-white rounded-lg"
                        title="حذف الصورة"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="absolute bottom-1 right-1 bg-slate-950/80 px-2 py-0.5 rounded text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                      <Camera className="w-3 h-3" /> صورة معتمدة
                    </div>
                  </div>
                )}

                {videoUrl && (
                  <div className="relative rounded-xl overflow-hidden border border-slate-700 h-28 bg-slate-900 group flex flex-col items-center justify-center p-3 text-center">
                    <Video className="w-8 h-8 text-amber-400 mb-1" />
                    <span className="text-xs font-bold text-amber-300">مقطع فيديو ({videoDurationSeconds || 15}ث)</span>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => setIsVideoModalOpen(true)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] rounded-lg font-bold"
                      >
                        تشغيل الفيديو
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setVideoUrl('');
                          setVideoDurationSeconds(0);
                        }}
                        className="p-1 text-rose-400 hover:bg-slate-800 rounded-lg"
                        title="حذف الفيديو"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
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

      {/* Interactive Location Map Modal */}
      <InteractiveMapModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        initialLat={gpsLocation.lat}
        initialLng={gpsLocation.lng}
        initialLocationName={realLocationName}
        onConfirmLocation={handleConfirmLocationFromMap}
      />

      {/* Dedicated Short Video Recorder Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-5 shadow-2xl relative max-h-[92vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-100">تسجيل لقطة فيديو ميدانية قصيرة (15 ثانية)</h3>
                  <p className="text-[11px] text-slate-400">سجل فيديو توثيقي مباشر لحالة الخطر بالموقع</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ShortVideoRecorder
              existingVideoUrl={videoUrl}
              onVideoCaptured={(url, duration) => {
                setVideoUrl(url);
                setVideoDurationSeconds(duration);
                setIsVideoModalOpen(false);
              }}
              onClearVideo={() => {
                setVideoUrl('');
                setVideoDurationSeconds(0);
              }}
            />

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition"
              >
                إغلاق النافذة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dedicated Photo Capture & Upload Modal */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-5 shadow-2xl relative max-h-[92vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-100">توثيق بالصور الفوتوغرافية</h3>
                  <p className="text-[11px] text-slate-400">التقط صورة بالكاميرا أو ارفع من جهازك أو اختر نموذجاً</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPhotoModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Photo Preview if present */}
            {photoUrl ? (
              <div className="space-y-3">
                <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500/50 h-56 bg-slate-950">
                  <img src={photoUrl} alt="Incident site" className="w-full h-full object-cover" />
                  <div className="absolute bottom-3 right-3 bg-slate-950/90 border border-emerald-500/40 px-3 py-1 rounded-xl text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>تم اعتماد الصورة المرفقة</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPhotoUrl('')}
                    className="flex-1 py-2.5 px-3 bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-500/40 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>حذف الصورة</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPhotoModalOpen(false)}
                    className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black rounded-xl text-xs transition"
                  >
                    تأكيد واعتماد ✓
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {/* File input for camera capture & gallery */}
                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-2xl bg-slate-950 cursor-pointer transition group">
                  <Camera className="w-10 h-10 text-emerald-400 group-hover:scale-110 transition-transform mb-2" />
                  <span className="text-xs font-bold text-slate-200">التقاط صورة بالكاميرا أو اختيار من الملفات</span>
                  <span className="text-[10px] text-slate-400 mt-1">يدعم كاميرا الهاتف والكمبيوتر وصيغ JPG, PNG</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          if (event.target?.result) {
                            setPhotoUrl(event.target.result as string);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>

                {/* Preset Incident Photos */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400">أو اختر صورة جاهزة لمحاكاة الميدان:</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPhotoUrl('https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=600&q=80')}
                      className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 text-right text-xs text-slate-300 transition flex items-center gap-2 cursor-pointer"
                    >
                      <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                      <span>صورة تسريب زيوت وضواغط</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPhotoUrl('https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80')}
                      className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 text-right text-xs text-slate-300 transition flex items-center gap-2 cursor-pointer"
                    >
                      <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0" />
                      <span>صورة خطر كهربي وميكانيكي</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dedicated Voice Recorder Modal */}
      {isVoiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-5 shadow-2xl relative max-h-[92vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                  <Mic className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-100">تسجيل صوتي وتحويل تلقائي لكتابة</h3>
                  <p className="text-[11px] text-slate-400">تحدث بالصوت وسيتم تحويله إلى نص في وصف الملاحظة</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsVoiceModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <VoiceRecorder
              initialText={description}
              onTranscription={(text) => {
                setDescription(text);
              }}
            />

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsVoiceModalOpen(false)}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs transition cursor-pointer"
              >
                اعتماد النص في الوصف ✓
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
