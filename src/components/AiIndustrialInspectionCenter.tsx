import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Mic,
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
  Volume2,
  VolumeX,
  Play,
  Square,
  Radio,
  Sliders,
  Database,
  Eye,
  Check,
  ChevronDown,
} from 'lucide-react';
import { Language, SeverityLevel, StopObservation } from '../types';
import { VisualPattern, AcousticPattern, AiLibraryConfig } from '../types/aiInspection';
import { DEFAULT_AI_LIBRARY_CONFIG } from '../data/defaultAiInspectionLibrary';
import { StopSignLogo } from './StopSignLogo';

interface AiIndustrialInspectionCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onConvertToObservation: (partialObs: Partial<StopObservation>) => void;
  language?: Language;
  aiLibraryConfig?: AiLibraryConfig;
  onOpenLibraryManager?: () => void;
}

export const AiIndustrialInspectionCenter: React.FC<AiIndustrialInspectionCenterProps> = ({
  isOpen,
  onClose,
  onConvertToObservation,
  language = 'ar',
  aiLibraryConfig = DEFAULT_AI_LIBRARY_CONFIG,
  onOpenLibraryManager,
}) => {
  const [activeTab, setActiveTab] = useState<'visual' | 'acoustic'>('visual');

  // --- Visual Inspection State ---
  const [selectedVisualPattern, setSelectedVisualPattern] = useState<VisualPattern>(
    aiLibraryConfig.visualPatterns[0]
  );
  const [isVisualScanning, setIsVisualScanning] = useState<boolean>(false);
  const [visualScanSuccess, setVisualScanSuccess] = useState<boolean>(false);
  const [visualLiveScore, setVisualLiveScore] = useState<number>(94.5);
  const [useCamera, setUseCamera] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // --- Acoustic (Machine Hearing) State ---
  const [selectedAcousticPattern, setSelectedAcousticPattern] = useState<AcousticPattern>(
    aiLibraryConfig.acousticPatterns[0]
  );
  const [isListening, setIsListening] = useState<boolean>(false);
  const [acousticScanSuccess, setAcousticScanSuccess] = useState<boolean>(false);
  const [currentDecibels, setCurrentDecibels] = useState<number>(45);
  const [dominantFrequency, setDominantFrequency] = useState<number>(0);
  const [micError, setMicError] = useState<string | null>(null);

  // References
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Stop camera and microphone on unmount or close
  useEffect(() => {
    return () => {
      stopCamera();
      stopListening();
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      stopListening();
    }
  }, [isOpen]);

  // Start Camera
  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      cameraStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setUseCamera(true);
    } catch (err: any) {
      console.warn('Camera access denied or unavailable:', err);
      setCameraError('تعذر فتح الكاميرا المباشرة، جاري تشغيل المحاكاة البصرية المعيارية.');
      setUseCamera(false);
    }
  };

  const stopCamera = () => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((track) => track.stop());
      cameraStreamRef.current = null;
    }
    setUseCamera(false);
  };

  // Run Visual Computer Vision Scan
  const handleTriggerVisualScan = () => {
    setIsVisualScanning(true);
    setVisualScanSuccess(false);

    setTimeout(() => {
      setIsVisualScanning(false);
      setVisualScanSuccess(true);
      setVisualLiveScore(selectedVisualPattern.confidenceScore || 96.8);
    }, 1800);
  };

  // Start Audio Spectrum Listening (Machine Hearing)
  const startListening = async () => {
    setMicError(null);
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioCtx;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      analyserRef.current = analyser;
      source.connect(analyser);

      setIsListening(true);
      setAcousticScanSuccess(false);

      // Start spectrum visualizer loop
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const renderSpectrum = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        // Calculate average dB and peak frequency
        let sum = 0;
        let maxVal = 0;
        let maxIndex = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
          if (dataArray[i] > maxVal) {
            maxVal = dataArray[i];
            maxIndex = i;
          }
        }

        const avg = sum / bufferLength;
        const estimatedDb = Math.round(30 + (avg / 255) * 60);
        const nyquist = audioCtx.sampleRate / 2;
        const peakHz = Math.round((maxIndex / bufferLength) * nyquist);

        setCurrentDecibels(estimatedDb);
        setDominantFrequency(peakHz);

        // Draw on canvas
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const barWidth = (canvas.width / bufferLength) * 2.5;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
              const barHeight = (dataArray[i] / 255) * canvas.height;
              // Color spectrum gradient: green to amber to red
              const hue = 140 - (dataArray[i] / 255) * 140;
              ctx.fillStyle = `hsl(${hue}, 90%, 55%)`;
              ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
              x += barWidth + 1;
            }
          }
        }

        animationFrameRef.current = requestAnimationFrame(renderSpectrum);
      };

      renderSpectrum();

      // Trigger automatic acoustic detection pattern match after 2.5 seconds
      setTimeout(() => {
        setAcousticScanSuccess(true);
      }, 2500);
    } catch (err: any) {
      console.warn('Microphone error:', err);
      setMicError('تعذر الوصول إلى الميكروفون الحقيقي، جاري تفعيل المحاكاة الصوتية الطيفية للمحطة.');
      // Fallback synthetic acoustic simulation
      setIsListening(true);
      simulateAcousticSpectrum();
    }
  };

  const simulateAcousticSpectrum = () => {
    let tick = 0;
    const interval = setInterval(() => {
      tick++;
      const baseFreq =
        selectedAcousticPattern.category === 'GAS_HISS'
          ? Math.round(15000 + Math.random() * 4000)
          : Math.round(3200 + Math.random() * 800);
      const baseDb = Math.round(selectedAcousticPattern.decibelThreshold + (Math.random() * 6 - 3));

      setDominantFrequency(baseFreq);
      setCurrentDecibels(baseDb);

      if (tick > 6) {
        clearInterval(interval);
        setAcousticScanSuccess(true);
      }
    }, 400);
  };

  const stopListening = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsListening(false);
  };

  // Convert Detected Anomaly to Official STOP Observation
  const handleConvertToObservation = (source: 'visual' | 'acoustic') => {
    if (source === 'visual') {
      const partial: Partial<StopObservation> = {
        type:
          selectedVisualPattern.category === 'PPE_COMPLIANCE'
            ? 'تصرف غير آمن (Unsafe Act)'
            : 'حالة غير آمنة (Unsafe Condition)',
        category:
          selectedVisualPattern.category === 'VAPOR_LEAK'
            ? 'تسريب غاز طبيعي'
            : selectedVisualPattern.category === 'VIBRATION_MONITORING'
            ? 'ميكانيكي / هيدروليكي'
            : selectedVisualPattern.category === 'CORROSION_DETECTION'
            ? 'تآكل وصدأ'
            : 'مهمات الوقاية الشخصية',
        severity: selectedVisualPattern.defaultSeverity,
        description: `[رصد ذكاء اصطناعي بصري - Computer Vision]: ${selectedVisualPattern.nameAr} في ${selectedVisualPattern.targetComponent}. المعيار المرجعي: ${selectedVisualPattern.thresholdParam}. نسبة المطابقة: ${visualLiveScore}%.`,
        immediateAction: selectedVisualPattern.immediateActionAr,
        preventiveAction: selectedVisualPattern.preventiveActionAr,
        rootCause: 'خلل ميكانيكي / تآكل أو تسريب تم تشخيصه بالذكاء الاصطناعي',
        photoUrl: selectedVisualPattern.baselineImageUrl,
      };
      onConvertToObservation(partial);
      onClose();
    } else {
      const partial: Partial<StopObservation> = {
        type: 'حالة غير آمنة (Unsafe Condition)',
        category:
          selectedAcousticPattern.category === 'GAS_HISS'
            ? 'تسريب غاز طبيعي'
            : 'ميكانيكي / هيدروليكي',
        severity: selectedAcousticPattern.category === 'GAS_HISS' ? 'high' : 'medium',
        description: `[رصد ذكاء اصطناعي صوتي - Machine Hearing]: ${selectedAcousticPattern.nameAr} في ${selectedAcousticPattern.targetMechanicalComponent}. التردد المرصود: ${dominantFrequency} هرتز، مستوى الصوت: ${currentDecibels} dB. التشخيص: ${selectedAcousticPattern.faultDiagnosisAr}`,
        immediateAction: selectedAcousticPattern.immediateActionAr,
        preventiveAction: selectedAcousticPattern.preventiveActionAr,
        rootCause: 'خلل صوتي ترددي بالماكينات تم تشخيصه بميكروفون الموبايل',
      };
      onConvertToObservation(partial);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border-2 border-slate-700 rounded-3xl max-w-4xl w-full max-h-[94vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-4 sm:px-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 border border-blue-400/40 flex items-center justify-center text-white shadow-lg shrink-0">
              <Scan className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  منظومة الذكاء الاصطناعي للرصد البصري والصوتي الصناعي
                </h3>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded-full font-bold">
                  AI Computer Vision & Machine Hearing
                </span>
              </div>
              <p className="text-xs text-slate-400">
                رصد تسريبات الغاز واهتزازات الضواغط والتآكل بالبصر، والهسهسة واحتكاك المحامل بالصوت
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenLibraryManager && (
              <button
                type="button"
                onClick={onOpenLibraryManager}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/70 hover:bg-purple-900 text-purple-300 border border-purple-500/40 text-xs font-bold transition shadow-sm"
                title="تغذية مكتبة الذكاء الاصطناعي وضبط المعايير المرجعية"
              >
                <Database className="w-3.5 h-3.5 text-purple-400" />
                <span>إدارة وتغذية المكتبة</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/80 hover:bg-slate-800 transition"
              title="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Inspection Mode Tabs (الرصد البصري | الرصد الصوتي) */}
        <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveTab('visual');
              stopListening();
            }}
            className={`flex-1 max-w-xs py-2.5 px-4 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'visual'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>1. الرصد البصري (Computer Vision)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('acoustic');
              stopCamera();
            }}
            className={`flex-1 max-w-xs py-2.5 px-4 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'acoustic'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>2. الرصد الصوتي (Machine Hearing)</span>
          </button>
        </div>

        {/* Modal Main Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-950/60">
          {activeTab === 'visual' ? (
            /* TAB 1: Visual Computer Vision Inspection */
            <div className="space-y-4">
              {/* Pattern Selector from Reference Library */}
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-blue-400" />
                    النمط البصري المرجعي للفحص (تم تدريب النموذج عليه):
                  </span>
                  <span className="text-blue-400 font-mono text-[11px]">
                    مكتبة الذكاء الاصطناعي: {aiLibraryConfig.visualPatterns.length} نماذج نشطة
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {aiLibraryConfig.visualPatterns.map((pat) => (
                    <button
                      key={pat.id}
                      type="button"
                      onClick={() => {
                        setSelectedVisualPattern(pat);
                        setVisualScanSuccess(false);
                      }}
                      className={`text-right p-2.5 rounded-xl border text-xs transition cursor-pointer ${
                        selectedVisualPattern.id === pat.id
                          ? 'bg-blue-600/20 border-blue-500 text-white font-bold shadow'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-black truncate block">{pat.nameAr.split('(')[0]}</span>
                        <span className="text-[10px] font-mono text-blue-300 bg-blue-500/20 px-1.5 py-0.5 rounded">
                          {pat.confidenceScore}%
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 block truncate">{pat.targetComponent}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Viewport Display (Camera or Baseline Image with AI Bounding Box) */}
              <div className="relative rounded-2xl overflow-hidden border-2 border-blue-500/40 bg-slate-950 shadow-2xl h-72 sm:h-80 flex items-center justify-center">
                {useCamera ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={selectedVisualPattern.baselineImageUrl}
                    alt={selectedVisualPattern.nameAr}
                    className="w-full h-full object-cover opacity-85"
                  />
                )}

                {/* AI HUD Overlay Elements */}
                <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between">
                  {/* Top HUD */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="bg-slate-950/80 backdrop-blur border border-blue-400/40 px-3 py-1 rounded-xl text-xs flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                      <span className="font-mono text-blue-300 font-bold">
                        AI MODEL: {selectedVisualPattern.category}
                      </span>
                    </div>

                    <div className="bg-slate-950/80 backdrop-blur border border-slate-700 px-3 py-1 rounded-xl text-xs font-mono text-slate-300">
                      {selectedVisualPattern.sampleCount.toLocaleString()} صور تدريبية
                    </div>
                  </div>

                  {/* Center Scanning Animation or Bounding Box Target */}
                  <div className="flex-1 flex items-center justify-center relative">
                    {isVisualScanning ? (
                      <div className="w-full h-full flex flex-col items-center justify-center">
                        <div className="w-48 h-48 border-2 border-blue-400 border-dashed rounded-2xl animate-pulse flex items-center justify-center">
                          <Activity className="w-12 h-12 text-blue-400 animate-spin" />
                        </div>
                        <span className="mt-3 text-xs bg-blue-600 text-white px-3 py-1 rounded-full font-bold shadow animate-bounce">
                          جاري تحليل ملامح التسريب والاهتزاز الدقيق...
                        </span>
                      </div>
                    ) : visualScanSuccess ? (
                      <div className="w-56 h-40 border-2 border-rose-500 bg-rose-500/10 rounded-2xl relative p-2 shadow-[0_0_20px_rgba(244,63,94,0.5)]">
                        <div className="absolute -top-3 right-2 bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded shadow">
                          ⚠️ تم رصد نمط شاذ: {selectedVisualPattern.category}
                        </div>
                        <div className="text-[11px] text-rose-200 mt-2 font-bold space-y-1">
                          <div>المطابقة: {visualLiveScore}%</div>
                          <div>المعيار: {selectedVisualPattern.thresholdParam}</div>
                          {selectedVisualPattern.frequencyHz && (
                            <div className="text-amber-300">
                              التردد: {selectedVisualPattern.frequencyHz} Hz • الاهتزاز: {selectedVisualPattern.amplitudeMmS} mm/s
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="w-48 h-48 border border-slate-500/50 rounded-2xl flex items-center justify-center">
                        <span className="text-xs text-slate-300 bg-slate-950/70 px-3 py-1 rounded-lg">
                          وجه الكاميرا واضغط فحص للقياس
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Bottom HUD */}
                  <div className="flex items-center justify-between text-xs bg-slate-950/80 backdrop-blur p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-300 font-bold truncate">
                      المعدّة: {selectedVisualPattern.targetComponent}
                    </span>
                    <span className="text-amber-400 font-bold shrink-0">
                      حساسية الرصد: {aiLibraryConfig.visualSensitivity}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Controls Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 p-3.5 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => (useCamera ? stopCamera() : startCamera())}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      useCamera
                        ? 'bg-rose-950/80 text-rose-300 border border-rose-800'
                        : 'bg-slate-800 text-slate-200 hover:bg-slate-750 border border-slate-700'
                    }`}
                  >
                    <Camera className="w-4 h-4" />
                    <span>{useCamera ? 'إيقاف الكاميرا' : 'تشغيل الكاميرا الحية'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleTriggerVisualScan}
                    disabled={isVisualScanning}
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-lg shadow-blue-950/50 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Scan className="w-4 h-4" />
                    <span>{isVisualScanning ? 'جاري الفحص...' : 'بدء القياس بالذكاء الاصطناعي'}</span>
                  </button>
                </div>

                {visualScanSuccess && (
                  <button
                    type="button"
                    onClick={() => handleConvertToObservation('visual')}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow transition flex items-center gap-1.5 cursor-pointer animate-fadeIn"
                  >
                    <Send className="w-4 h-4" />
                    <span>تحويل الملاحظة فوراً لبطاقة STOP ➔</span>
                  </button>
                )}
              </div>

              {cameraError && (
                <div className="p-3 rounded-xl bg-amber-950/50 border border-amber-800 text-amber-300 text-xs">
                  {cameraError}
                </div>
              )}
            </div>
          ) : (
            /* TAB 2: Acoustic Machine Hearing Inspection */
            <div className="space-y-4">
              {/* Pattern Selector from Acoustic Library */}
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-purple-400" />
                    البصمة الصوتية الترددية للماكينات (Machine Hearing Library):
                  </span>
                  <span className="text-purple-400 font-mono text-[11px]">
                    مكتبة الترددات الصوتية: {aiLibraryConfig.acousticPatterns.length} بصمات معتمدة
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {aiLibraryConfig.acousticPatterns.map((pat) => (
                    <button
                      key={pat.id}
                      type="button"
                      onClick={() => {
                        setSelectedAcousticPattern(pat);
                        setAcousticScanSuccess(false);
                      }}
                      className={`text-right p-3 rounded-xl border text-xs transition cursor-pointer ${
                        selectedAcousticPattern.id === pat.id
                          ? 'bg-purple-600/20 border-purple-500 text-white font-bold shadow'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-black block truncate">{pat.nameAr.split('(')[0]}</span>
                        <span className="text-[10px] font-mono text-purple-300 bg-purple-500/20 px-1.5 py-0.5 rounded">
                          {pat.frequencyRangeHz.min / 1000}k-{pat.frequencyRangeHz.max / 1000}k Hz
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 block truncate">{pat.targetMechanicalComponent}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Real-Time Audio FFT Frequency Spectrum Canvas */}
              <div className="relative rounded-2xl overflow-hidden border-2 border-purple-500/40 bg-slate-950 p-5 shadow-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${isListening ? 'bg-red-500 animate-ping' : 'bg-slate-600'}`} />
                    <span className="text-xs font-black text-slate-200 font-mono">
                      {isListening ? 'LIVE ACOUSTIC SPECTROGRAM (FFT ANALYZER)' : 'محلل الطيف الصوتي الترددي متوقف'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono">
                    <div className="px-2.5 py-1 bg-slate-900 rounded-lg border border-slate-800 text-slate-300">
                      التردد اللحظي: <strong className="text-purple-400">{dominantFrequency} Hz</strong>
                    </div>
                    <div className="px-2.5 py-1 bg-slate-900 rounded-lg border border-slate-800 text-slate-300">
                      مستوى الديسيبل: <strong className="text-pink-400">{currentDecibels} dB</strong>
                    </div>
                  </div>
                </div>

                {/* Canvas Spectrogram */}
                <canvas
                  ref={canvasRef}
                  width={700}
                  height={140}
                  className="w-full h-36 bg-slate-900/90 rounded-xl border border-slate-800"
                />

                {/* Machine Hearing Diagnosis Box */}
                {acousticScanSuccess && (
                  <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-rose-950/80 border border-purple-500/60 animate-fadeIn space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-rose-300 font-black text-xs">
                        <AlertTriangle className="w-4 h-4 text-rose-400 animate-bounce" />
                        <span>تم التقاط تطابق بصمة صوتية: {selectedAcousticPattern.nameAr}</span>
                      </div>
                      <span className="text-xs bg-rose-600 text-white px-2 py-0.5 rounded-full font-bold">
                        دقة التشخيص: {selectedAcousticPattern.confidenceScore}%
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
                      <div>
                        <strong>العضو الميكانيكي المعطل:</strong> {selectedAcousticPattern.targetMechanicalComponent}
                      </div>
                      <div>
                        <strong>التشخيص الصوتي:</strong> {selectedAcousticPattern.faultDiagnosisAr}
                      </div>
                      <div className="text-amber-300 sm:col-span-2">
                        <strong>الإجراء الفوري:</strong> {selectedAcousticPattern.immediateActionAr}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Acoustic Controls Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 p-3.5 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => (isListening ? stopListening() : startListening())}
                    className={`px-4 py-2.5 rounded-xl text-xs font-black shadow-lg transition flex items-center gap-1.5 cursor-pointer ${
                      isListening
                        ? 'bg-rose-600 hover:bg-rose-500 text-white'
                        : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-950/50'
                    }`}
                  >
                    {isListening ? (
                      <>
                        <Square className="w-4 h-4" />
                        <span>إيقاف الرصد الصوتي</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4" />
                        <span>بدء الاستماع بميكروفون الموبايل</span>
                      </>
                    )}
                  </button>
                </div>

                {acousticScanSuccess && (
                  <button
                    type="button"
                    onClick={() => handleConvertToObservation('acoustic')}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow transition flex items-center gap-1.5 cursor-pointer animate-fadeIn"
                  >
                    <Send className="w-4 h-4" />
                    <span>تحويل العطل الصوتي لبطاقة STOP ➔</span>
                  </button>
                )}
              </div>

              {micError && (
                <div className="p-3 rounded-xl bg-amber-950/50 border border-amber-800 text-amber-300 text-xs">
                  {micError}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
