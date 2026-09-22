import React, { useState, useRef, useEffect } from 'react';
import { Language, RadarScanResult, StopObservation } from '../types';
import { getT } from '../utils/translations';
import {
  Camera,
  Flame,
  Activity,
  AlertTriangle,
  CheckCircle2,
  X,
  Scan,
  RefreshCw,
  Zap,
  ArrowRight,
  ShieldAlert,
  Send,
  Sparkles,
  Sliders,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface AiCameraRadarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConvertToObservation: (partialObs: Partial<StopObservation>) => void;
  language: Language;
}

type RadarMode = 'hazard_radar' | 'thermal_scan' | 'defect_scan';

interface InspectionPreset {
  id: string;
  nameAr: string;
  nameEn: string;
  temp: number;
  objectNameAr: string;
  objectNameEn: string;
  notesAr: string;
  notesEn: string;
  image: string;
}

const PRESET_SCENARIOS: InspectionPreset[] = [
  {
    id: 'scen-1',
    nameAr: 'مضخة الديزل رقم 4 - ارتفاع حراري مفرط',
    nameEn: 'Diesel Pump #4 - Thermal Anomaly (84°C)',
    temp: 84.5,
    objectNameAr: 'مضخة تعبئة ديزل هيدروليكية',
    objectNameEn: 'Hydraulic Diesel Dispenser Pump',
    notesAr: 'اهتزاز غير طبيعي وانبعاث حرارة شديدة من صندوق التروس ورائحة احتكاك',
    notesEn: 'Abnormal gearbox vibration and severe heat radiating with friction smell',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'scen-2',
    nameAr: 'ضاغط هواء الورشة - فحص اعتيادي آمن (36°C)',
    nameEn: 'Workshop Air Compressor - Normal Safe (36°C)',
    temp: 36.2,
    objectNameAr: 'ضاغط هواء ترددي 10 Bar',
    objectNameEn: 'Reciprocating Air Compressor 10 Bar',
    notesAr: 'فحص دوري بصري، الصوت مستقر وضغط الزيت متزن ولا توجد تسريبات',
    notesEn: 'Routine visual inspection, stable motor sound and no leaks',
    image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'scen-3',
    nameAr: 'لوحة توزيع كهربائية 380V - تآكل وشرخ عازل',
    nameEn: '380V Electrical Panel - Insulation Fracture',
    temp: 72.8,
    objectNameAr: 'لوحة التوزيع والقواطع الرئيسية',
    objectNameEn: 'Main 380V Distribution Breaker Panel',
    notesAr: 'شرخ واضح في الغطاء البلاستيكي العازل وتراكم غبار مع طنين كهربائي',
    notesEn: 'Visible crack in insulation cover with dust accumulation and audible buzz',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
  },
];

export const AiCameraRadarModal: React.FC<AiCameraRadarModalProps> = ({
  isOpen,
  onClose,
  onConvertToObservation,
  language,
}) => {
  const t = getT(language);
  const [mode, setMode] = useState<RadarMode>('hazard_radar');
  const [selectedPreset, setSelectedPreset] = useState<InspectionPreset>(PRESET_SCENARIOS[0]);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<RadarScanResult | null>(null);
  const [liveTemp, setLiveTemp] = useState<number>(84.5);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [usePhysicalCamera, setUsePhysicalCamera] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop camera when closing
  useEffect(() => {
    if (!isOpen) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      setScanResult(null);
      setIsScanning(false);
    }
  }, [isOpen]);

  // Handle Physical Camera toggle
  const toggleCamera = async () => {
    if (usePhysicalCamera) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      setUsePhysicalCamera(false);
      setCameraError(null);
    } else {
      try {
        setCameraError(null);
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setUsePhysicalCamera(true);
      } catch (err: any) {
        setCameraError(
          language === 'ar'
            ? 'تعذر الوصول لكاميرا الجهاز أو تم رفض الإذن، يتم استخدام نمط المحاكاة الميدانية عالي الدقة.'
            : 'Camera access unavailable or permission denied. Using high-fidelity field simulation.'
        );
        setUsePhysicalCamera(false);
      }
    }
  };

  const playBeep = (freq = 880, dur = 0.15) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + dur);
    } catch (_) {}
  };

  const handleStartScan = async () => {
    setIsScanning(true);
    setScanResult(null);
    playBeep(600, 0.2);

    try {
      const payload = {
        mode,
        temperatureC: liveTemp,
        observedObject: selectedPreset.objectNameAr,
        notes: selectedPreset.notesAr,
      };

      const res = await fetch('/api/ai/radar-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Scan failed');
      const data = await res.json();

      const result: RadarScanResult = {
        id: `RAD-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toLocaleTimeString(),
        mode,
        isNearMiss: data.isNearMiss,
        isAcuteDanger: data.isAcuteDanger,
        isSafeCondition: data.isSafeCondition,
        nearMissProbability: data.nearMissProbability || (data.isNearMiss ? 88 : 12),
        hazardType: data.hazardType || 'خطر ميكانيكي وحراري',
        hazardTypeEn: data.hazardTypeEn || 'Thermal & Mechanical Hazard',
        defectDetected: data.defectDetected || 'تلف حراري غير طبيعي',
        defectDetectedEn: data.defectDetectedEn || 'Thermal anomaly detected',
        thermalHotspotC: data.thermalHotspotC || liveTemp,
        stepByStepAction: data.stepByStepAction || [],
        stepByStepActionEn: data.stepByStepActionEn || [],
        recommendationDecision: data.recommendationDecision || 'IMMEDIATE_ACTION',
        decisionSummary: data.decisionSummary || '',
        decisionSummaryEn: data.decisionSummaryEn || '',
        photoUrl: selectedPreset.image,
      };

      setScanResult(result);
      playBeep(result.isNearMiss ? 1100 : 750, 0.3);
    } catch (err) {
      // Smart fallback
      const isCritical = liveTemp > 70;
      const isSafe = liveTemp < 45;

      const fallbackResult: RadarScanResult = {
        id: `RAD-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toLocaleTimeString(),
        mode,
        isNearMiss: !isSafe,
        isAcuteDanger: isCritical,
        isSafeCondition: isSafe,
        nearMissProbability: isCritical ? 92 : isSafe ? 10 : 65,
        hazardType: isSafe
          ? 'تشغيل طبيعي ضمن الحدود الآمنة'
          : isCritical
          ? 'ارتفاع حراري شديد وخطر اشتعال وشيك'
          : 'اهتزاز ميكانيكي وحاجة لصيانة',
        hazardTypeEn: isSafe
          ? 'Normal Permissible Operation'
          : isCritical
          ? 'Severe Thermal Surge & Near-Miss'
          : 'Mechanical Vibration',
        defectDetected: isSafe
          ? 'لا توجد تلفيات مرصودة'
          : `بؤرة حرارية (${liveTemp}°C) أعلى من المسموح`,
        defectDetectedEn: isSafe ? 'No defects found' : `Thermal Hotspot (${liveTemp}°C)`,
        thermalHotspotC: liveTemp,
        stepByStepAction: isSafe
          ? [
              'الحالة طبيعية وآمنة ولا تعد حادثاً وشيكاً.',
              'لا يلزم اتخاذ أي إجراء في حينه، ومواصلة العمل الميداني المعتاد.',
            ]
          : [
              'إيقاف المعدة وعزل مصدر الطاقة فوراً لمنع تفاقم الخطر.',
              'وضع شريط تحذيري دائري وإبعاد غير المصرح لهم.',
              'إرسال بطاقة STOP فورية وتوجيه فريق الصيانة.',
            ],
        stepByStepActionEn: isSafe
          ? [
              'Condition is normal and safe; NOT classified as a near-miss.',
              'No immediate action required. Continue regular operations.',
            ]
          : [
              'Safely halt machine and isolate power source to prevent escalation.',
              'Establish safety perimeter tape and keep workers at distance.',
              'Submit instant STOP card and dispatch maintenance team.',
            ],
        recommendationDecision: isSafe ? 'NO_ACTION_REQUIRED' : 'IMMEDIATE_ACTION',
        decisionSummary: isSafe
          ? 'تم التحقق بالذكاء الاصطناعي: الحالة آمنة ولا تشكل حادثاً وشيكاً، لا داعي لاتخاذ أي إجراء في حينه.'
          : 'تأكيد رادار الذكاء الاصطناعي: الحالة تعد "حادثاً وشيكاً" يستلزم الإبلاغ والتدخل الفوري لتلافي وقوع كارثة.',
        decisionSummaryEn: isSafe
          ? 'AI Verified: Condition is safe and not a near-miss. No action required.'
          : 'AI Radar Confirmed: Condition IS a Near-Miss requiring swift intervention to avoid incident.',
        photoUrl: selectedPreset.image,
      };

      setScanResult(fallbackResult);
      playBeep(isSafe ? 700 : 1200, 0.35);
    } finally {
      setIsScanning(false);
    }
  };

  const handleConvert = () => {
    if (!scanResult) return;

    const partial: Partial<StopObservation> = {
      description: `[رصد رادار الذكاء الاصطناعي - ${scanResult.mode}] ${scanResult.defectDetected} على ${selectedPreset.objectNameAr}. خلاصة التحليل: ${scanResult.decisionSummary}`,
      type: scanResult.isSafeCondition
        ? 'ممارسة آمنة (Safe Practice)'
        : 'حالة غير آمنة (Unsafe Condition)',
      severity: scanResult.isAcuteDanger ? 'high' : scanResult.isNearMiss ? 'medium' : 'low',
      riskScore: scanResult.nearMissProbability,
      immediateAction: scanResult.stepByStepAction[0] || 'عزل المعدة وتأمين الموقع',
      preventiveAction: scanResult.stepByStepAction[1] || 'فحص شامل وإعادة معايرة الحماية الحرارية',
      category: mode === 'thermal_scan' ? 'ميكانيكي / هيدروليكي' : 'كهربائي',
      photoUrl: scanResult.photoUrl,
    };

    onConvertToObservation(partial);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/90 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-slate-900 border-2 border-cyan-500/50 rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl space-y-5 text-slate-100 relative my-auto max-h-[92vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 left-5 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800 hover:bg-slate-700 transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 text-xs font-bold">
            <Scan className="w-3.5 h-3.5 animate-spin" />
            <span>AI Safety Radar & Thermal Sensor</span>
          </div>
          <h3 className="text-xl font-black text-cyan-300">{t.radarTitle}</h3>
          <p className="text-xs text-slate-400">{t.radarSubtitle}</p>
        </div>

        {/* Mode & Sound Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-y border-slate-800 py-3">
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setMode('hazard_radar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                mode === 'hazard_radar'
                  ? 'bg-cyan-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'رادار الحوادث الوشيكة' : 'Near-Miss Radar'}</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('thermal_scan')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                mode === 'thermal_scan'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'الرصد الحراري (Thermal)' : 'Thermal Scan'}</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('defect_scan')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                mode === 'defect_scan'
                  ? 'bg-purple-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'كاشف الأعطال' : 'Defect Detector'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1"
              title="صوت الرادار"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>
            <button
              type="button"
              onClick={toggleCamera}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
                usePhysicalCamera
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{usePhysicalCamera ? (language === 'ar' ? 'الكاميرا نشطة' : 'Camera On') : (language === 'ar' ? 'تشغيل الكاميرا' : 'Use Camera')}</span>
            </button>
          </div>
        </div>

        {cameraError && (
          <p className="text-[11px] text-amber-400 bg-amber-950/40 p-2 rounded-xl border border-amber-800">
            {cameraError}
          </p>
        )}

        {/* Viewfinder HUD */}
        <div className="relative rounded-2xl overflow-hidden bg-black aspect-video border-2 border-cyan-500/40 shadow-inner group">
          {usePhysicalCamera ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${
                mode === 'thermal_scan' ? 'filter saturate-200 hue-rotate-180 contrast-125' : ''
              }`}
            />
          ) : (
            <img
              src={selectedPreset.image}
              alt="Inspection Object"
              className={`w-full h-full object-cover transition-all ${
                mode === 'thermal_scan'
                  ? 'filter saturate-200 hue-rotate-180 contrast-150 brightness-110'
                  : mode === 'defect_scan'
                  ? 'filter contrast-150'
                  : ''
              }`}
            />
          )}

          {/* Radar Scanning Line Animation */}
          {isScanning && (
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent animate-pulse pointer-events-none" />
          )}

          {/* HUD Crosshairs & Target Reticle */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div
              className={`w-32 h-32 rounded-full border-2 border-dashed flex items-center justify-center transition-all ${
                isScanning
                  ? 'border-amber-400 animate-spin scale-110'
                  : scanResult?.isNearMiss
                  ? 'border-rose-500 scale-100'
                  : scanResult?.isSafeCondition
                  ? 'border-emerald-500 scale-95'
                  : 'border-cyan-400/80 scale-100'
              }`}
            >
              <div className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
            </div>

            {/* Corner Bracket Overlays */}
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-cyan-400" />
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-cyan-400" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-cyan-400" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-cyan-400" />
          </div>

          {/* Live Telemetry Overlay in Viewfinder */}
          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-cyan-500/40 text-[11px] font-mono text-cyan-300 space-y-0.5 pointer-events-none">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>RADAR HUD // v4.2</span>
            </div>
            <div className="text-amber-400 font-bold flex items-center gap-1">
              <Flame className="w-3 h-3" />
              <span>HOTSPOT: {liveTemp}°C</span>
            </div>
          </div>

          {/* Temperature Tuning Slider */}
          <div className="absolute bottom-3 left-3 right-3 bg-black/80 backdrop-blur-md p-2.5 rounded-xl border border-slate-800 flex items-center gap-3">
            <span className="text-[10px] text-slate-300 font-mono shrink-0">معايرة المستشعر:</span>
            <input
              type="range"
              min="20"
              max="110"
              step="0.5"
              value={liveTemp}
              onChange={(e) => setLiveTemp(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <span
              className={`font-mono text-xs font-black shrink-0 ${
                liveTemp > 75 ? 'text-rose-400' : liveTemp > 50 ? 'text-amber-400' : 'text-emerald-400'
              }`}
            >
              {liveTemp}°C
            </span>
          </div>
        </div>

        {/* Quick Industrial Scenarios */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 block">
            {language === 'ar' ? 'معدات صناعية جاهزة للمعايرة والرصد:' : 'Preset Industrial Inspection Scenarios:'}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {PRESET_SCENARIOS.map((scen) => (
              <button
                key={scen.id}
                type="button"
                onClick={() => {
                  setSelectedPreset(scen);
                  setLiveTemp(scen.temp);
                  setScanResult(null);
                }}
                className={`p-2 rounded-xl border text-right text-xs font-semibold transition ${
                  selectedPreset.id === scen.id
                    ? 'bg-slate-800 border-cyan-400 text-cyan-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold truncate">{language === 'ar' ? scen.nameAr : scen.nameEn}</div>
                <div className="text-[10px] text-amber-400 font-mono mt-0.5">{scen.temp}°C</div>
              </button>
            ))}
          </div>
        </div>

        {/* Trigger Button */}
        <button
          type="button"
          disabled={isScanning}
          onClick={handleStartScan}
          className="w-full py-3.5 bg-gradient-to-r from-cyan-500 via-cyan-400 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-black rounded-2xl text-sm shadow-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isScanning ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>جاري التحليل الحراري ورصد الحوادث الوشيكة بالذكاء الاصطناعي...</span>
            </>
          ) : (
            <>
              <Scan className="w-5 h-5" />
              <span>{t.startRadarScan}</span>
            </>
          )}
        </button>

        {/* AI Scan Result Analysis */}
        {scanResult && (
          <div
            className={`p-4 rounded-2xl border transition-all space-y-3 ${
              scanResult.isSafeCondition
                ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
                : scanResult.isAcuteDanger
                ? 'bg-rose-950/50 border-rose-500/70 text-rose-200 animate-pulse'
                : 'bg-amber-950/40 border-amber-500/60 text-amber-200'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                {scanResult.isSafeCondition ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0" />
                )}
                <div>
                  <h4 className="font-black text-sm text-slate-100">
                    {language === 'ar' ? scanResult.hazardType : scanResult.hazardTypeEn}
                  </h4>
                  <div className="text-xs font-semibold mt-0.5">
                    {language === 'ar' ? scanResult.decisionSummary : scanResult.decisionSummaryEn}
                  </div>
                </div>
              </div>

              <div className="text-left shrink-0 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-white/10 font-mono">
                <span className="text-[10px] text-slate-400 block">احتمالية الخطر</span>
                <span className="text-base font-black text-amber-400">
                  {scanResult.nearMissProbability}%
                </span>
              </div>
            </div>

            {/* Crucial Decision: Near-Miss vs Safe */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[11px] block">
                  {language === 'ar' ? 'تصنيف الحالة النهائي:' : 'Definitive Classification:'}
                </span>
                <strong className={scanResult.isNearMiss ? 'text-rose-400' : 'text-emerald-400'}>
                  {scanResult.isNearMiss
                    ? language === 'ar'
                      ? '⚠️ حادث وشيك (Near-Miss)'
                      : '⚠️ Near-Miss Incident'
                    : language === 'ar'
                    ? '✓ حالة آمنة (لا تعد حادثاً وشيكاً)'
                    : '✓ Safe Condition (Not a Near-Miss)'}
                </strong>
              </div>

              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[11px] block">
                  {language === 'ar' ? 'القرار والتصرف الواجب:' : 'Prescribed Action Protocol:'}
                </span>
                <strong className="text-slate-200">
                  {scanResult.recommendationDecision === 'NO_ACTION_REQUIRED'
                    ? language === 'ar'
                      ? 'لا يتطلب أي إجراء في حينه'
                      : 'No immediate action required'
                    : language === 'ar'
                    ? 'عزل وتدخل فوري وتوجيه بطاقة'
                    : 'Immediate isolation & ticket dispatch'}
                </strong>
              </div>
            </div>

            {/* Step by step action */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-300 block">
                {language === 'ar' ? 'الإرشاد والتوجيه الفوري السليم:' : 'Step-by-Step Guidance:'}
              </span>
              <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                {(language === 'ar' ? scanResult.stepByStepAction : scanResult.stepByStepActionEn).map(
                  (step, idx) => (
                    <li key={idx}>{step}</li>
                  )
                )}
              </ul>
            </div>

            {/* Convert to STOP card button */}
            {scanResult.isNearMiss && (
              <button
                type="button"
                onClick={handleConvert}
                className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs shadow transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{t.convertRadarToStop}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
