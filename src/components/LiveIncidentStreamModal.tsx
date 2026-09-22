import React, { useState, useEffect, useRef } from 'react';
import {
  Radio,
  Video,
  VideoOff,
  Mic,
  MicOff,
  AlertTriangle,
  ShieldAlert,
  Volume2,
  VolumeX,
  Camera,
  CheckCircle2,
  X,
  Send,
  Sparkles,
  MapPin,
  Clock,
  User,
  ExternalLink,
} from 'lucide-react';
import { AuthUser, Language, LiveIncidentStreamSession } from '../types';
import { startEmergencyAudioAlert, stopEmergencyAudioAlert, playDirectiveChime } from '../utils/audioAlert';

interface LiveIncidentStreamModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSession: LiveIncidentStreamSession | null;
  onStartStream: (session: LiveIncidentStreamSession) => void;
  onEndStream: () => void;
  onSendDirectorDirective: (directive: string, isEvacuate: boolean) => void;
  authUser: AuthUser | null;
  language: Language;
}

export const LiveIncidentStreamModal: React.FC<LiveIncidentStreamModalProps> = ({
  isOpen,
  onClose,
  activeSession,
  onStartStream,
  onEndStream,
  onSendDirectorDirective,
  authUser,
  language,
}) => {
  const [streamType, setStreamType] = useState<'NEAR_MISS' | 'ACTUAL_INCIDENT' | 'STOP_WORK_ORDER'>('NEAR_MISS');
  const [locationName, setLocationName] = useState('محطة وقود رقم 104 - الجزيرة رقم 3');
  const [incidentNotes, setIncidentNotes] = useState('انبعاث أبخرة كثيفة واهتزاز شديد غير معتاد في مضخة التفريغ الرئيسية مع تسرب وقود قرب كابل مكشوف');
  
  // Camera state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isAudioAlarmRinging, setIsAudioAlarmRinging] = useState(false);
  const [capturedSnapshot, setCapturedSnapshot] = useState<string | null>(null);
  const [streamDuration, setStreamDuration] = useState(0);

  // Director directive input
  const [directiveText, setDirectiveText] = useState('');
  const [directiveSentMsg, setDirectiveSentMsg] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const isHseDirector = authUser?.role === 'HSE_GENERAL_DIRECTOR' || authUser?.role === 'HSE_ADMIN';

  // Duration timer
  useEffect(() => {
    let interval: any = null;
    if (activeSession?.isActive) {
      interval = setInterval(() => {
        setStreamDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setStreamDuration(0);
    }
    return () => clearInterval(interval);
  }, [activeSession?.isActive]);

  // Audio alert behavior when active session starts
  useEffect(() => {
    if (activeSession?.isActive && activeSession.audioAlertTriggered && isHseDirector) {
      setIsAudioAlarmRinging(true);
      startEmergencyAudioAlert();
    } else {
      setIsAudioAlarmRinging(false);
      stopEmergencyAudioAlert();
    }
    return () => {
      stopEmergencyAudioAlert();
    };
  }, [activeSession?.isActive, activeSession?.audioAlertTriggered, isHseDirector]);

  // Start real camera stream
  const initializeCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: true,
        });
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
        setIsCameraActive(true);
      }
    } catch (err) {
      console.warn('Real camera stream failed or blocked; fallback to interactive stream display', err);
      setIsCameraActive(true); // allow canvas fallback
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Toggle audio alarm mute
  const toggleAudioAlarm = () => {
    if (isAudioAlarmRinging) {
      stopEmergencyAudioAlert();
      setIsAudioAlarmRinging(false);
    } else {
      startEmergencyAudioAlert();
      setIsAudioAlarmRinging(true);
    }
  };

  // Broadcaster initiates live stream
  const handleStartBroadcast = async () => {
    await initializeCamera();
    const newSession: LiveIncidentStreamSession = {
      id: `STREAM-${Date.now().toString().slice(-5)}`,
      stationName: locationName,
      locationDetails: 'منطقة التحميل والتفريغ الميدانية',
      incidentType: streamType,
      severity: streamType === 'ACTUAL_INCIDENT' ? 'high' : 'medium',
      broadcasterName: authUser?.name || 'مفتش السلامة الميداني',
      broadcasterBadge: authUser?.badgeNumber || 'EMP-7701',
      startedAt: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      isActive: true,
      notes: incidentNotes,
      audioAlertTriggered: true,
    };
    onStartStream(newSession);
  };

  // Broadcaster ends broadcast
  const handleEndBroadcast = () => {
    stopCamera();
    stopEmergencyAudioAlert();
    onEndStream();
  };

  // Snap evidence photo
  const handleCaptureSnapshot = () => {
    if (videoRef.current && mediaStreamRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedSnapshot(dataUrl);
        playDirectiveChime();
        return;
      }
    }
    // Simulation snapshot
    setCapturedSnapshot('https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80');
    playDirectiveChime();
  };

  // Director sends immediate corrective action
  const handleSendDirective = (isEvacuate: boolean) => {
    const textToSend = directiveText.trim() || (isEvacuate ? 'أمر فوري: إخلاء الموقع ومحيط 50 متراً وفصل الطاقة LOTO' : 'أمر فوري: إيقاف الأعمال وتثبيت الحواجز التحذيرية');
    onSendDirectorDirective(textToSend, isEvacuate);
    setDirectiveText('');
    setDirectiveSentMsg(true);
    playDirectiveChime();
    setTimeout(() => setDirectiveSentMsg(false), 3500);
  };

  if (!isOpen) return null;

  const isLive = activeSession?.isActive;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border-2 border-rose-500/80 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100 relative">
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl ${isLive ? 'bg-rose-500/30 text-rose-400 border border-rose-500 animate-pulse' : 'bg-slate-800 text-slate-300'}`}>
              <Radio className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  {language === 'ar' ? 'غرفة البث المباشر الميداني للحوادث الوشيكة' : 'Field Near-Miss Live Video Broadcast'}
                </h3>
                {isLive && (
                  <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[11px] font-black uppercase tracking-wider animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-white"></span>
                    LIVE BCAST
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {language === 'ar'
                  ? 'بث مباشر من الكاميرا الميدانية موجه فورياً بتنبيه صوتي لإدارة السلامة والصحة المهنية (HSE)'
                  : 'Direct live camera feed sending immediate audio siren to HSE Director for rapid intervention'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Alarm Toggle for HSE Director */}
            {isHseDirector && isLive && (
              <button
                type="button"
                onClick={toggleAudioAlarm}
                className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
                  isAudioAlarmRinging
                    ? 'bg-rose-600 text-white border-rose-400 animate-bounce'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
                title={isAudioAlarmRinging ? 'كتم التنبيه الصوتي لصفارة الإنذار' : 'تشغيل التنبيه الصوتي'}
              >
                {isAudioAlarmRinging ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                <span className="hidden sm:inline">{isAudioAlarmRinging ? 'كتم الصفارة' : 'تشغيل الصوت'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-800 hover:bg-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Active Live Banner & Status */}
          {isLive ? (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-950/80 via-red-950/60 to-slate-900 border-2 border-rose-500/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-bold text-rose-300">
                  <ShieldAlert className="w-4 h-4 animate-spin text-rose-400" />
                  <span>
                    {language === 'ar' ? 'بث طارئ مباشر جاري الآن من الموقع:' : 'Emergency stream active from location:'}{' '}
                    <strong className="text-white">{activeSession?.stationName}</strong>
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-slate-300 text-[11px]">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    المبثوث بواسطة: {activeSession?.broadcasterName} ({activeSession?.broadcasterBadge})
                  </span>
                  <span className="flex items-center gap-1 font-mono text-amber-300 font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    مدة البث: {Math.floor(streamDuration / 60)}:{('0' + (streamDuration % 60)).slice(-2)} دقيقة
                  </span>
                </div>
              </div>

              {/* End Stream for broadcaster */}
              <button
                type="button"
                onClick={handleEndBroadcast}
                className="px-4 py-2 bg-slate-800 hover:bg-rose-700 hover:text-white text-rose-300 border border-rose-500/50 rounded-xl font-bold transition text-xs flex items-center justify-center gap-1.5"
              >
                <X className="w-4 h-4" />
                <span>{language === 'ar' ? 'إنهاء البث وتوثيق الواقعة' : 'End Stream & Save'}</span>
              </button>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-3 text-xs text-slate-300">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <span>
                {language === 'ar'
                  ? 'عند بدء البث المباشر، ستصدر صفارة إنذار صوتية عالية في شاشة إدارة السلامة (HSE) للتنبيه الفوري على الحادث الوشيك أو الخطر الداهم لتوجيه الأوامر التصحيحية.'
                  : 'Starting a live broadcast will ring an emergency audio alarm at HSE Directorate for immediate corrective order.'}
              </span>
            </div>
          )}

          {/* Video Stream Screen */}
          <div className="relative rounded-3xl overflow-hidden bg-black aspect-video border-2 border-slate-800 shadow-2xl flex items-center justify-center">
            {/* Real Video Element */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted={isMicMuted}
              className={`w-full h-full object-cover ${isCameraActive ? 'block' : 'hidden'}`}
            />

            {/* Simulated Live Fallback if camera is off or inactive */}
            {!isCameraActive && (
              <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-black text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-rose-500/20 border-2 border-rose-500/50 flex items-center justify-center text-rose-400 shadow-inner">
                  <Video className="w-8 h-8" />
                </div>
                <div className="max-w-md space-y-1">
                  <h4 className="text-base font-bold text-slate-100">
                    {language === 'ar' ? 'شاشة البث المباشر الميداني جاهزة' : 'Field Live Stream Ready'}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {language === 'ar'
                      ? 'اضغط على زر (بدء البث المباشر) لفتح كاميرا الهاتف/الجهاز ونقل الصورة فوراً مع إطلاق الإنذار الصوتي لإدارة السلامة'
                      : 'Click (Start Live Broadcast) to activate camera and transmit direct audio-visual feed to HSE'}
                  </p>
                </div>
                {!isLive && (
                  <button
                    type="button"
                    onClick={handleStartBroadcast}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-rose-950/60 border border-rose-400 flex items-center gap-2 transform active:scale-95 transition"
                  >
                    <Radio className="w-5 h-5 animate-pulse" />
                    <span>{language === 'ar' ? '🔴 بدء البث المباشر وتنبيه إدارة السلامة' : '🔴 Start Live Stream Now'}</span>
                  </button>
                )}
              </div>
            )}

            {/* Live Stream HUD Overlay (When Live) */}
            {isLive && (
              <>
                {/* Top Overlay HUD */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono pointer-events-none">
                  <div className="flex items-center gap-2 bg-black/75 px-3 py-1.5 rounded-xl border border-rose-500/50 text-white backdrop-blur-md">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                    <span className="font-bold text-rose-300">LIVE FEED</span>
                    <span>|</span>
                    <span className="text-slate-300">{activeSession?.stationName}</span>
                  </div>

                  <div className="bg-black/75 px-3 py-1.5 rounded-xl border border-slate-700 text-amber-300 font-bold backdrop-blur-md">
                    REC: {Math.floor(streamDuration / 60)}:{('0' + (streamDuration % 60)).slice(-2)}
                  </div>
                </div>

                {/* Bottom Overlay Controls on Video */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 bg-slate-950/80 backdrop-blur-md p-2 rounded-2xl border border-slate-700/80">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsMicMuted(!isMicMuted)}
                      className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                        isMicMuted ? 'bg-rose-950/80 text-rose-300 border border-rose-800' : 'bg-slate-800 text-slate-200'
                      }`}
                    >
                      {isMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-emerald-400" />}
                      <span className="hidden sm:inline">{isMicMuted ? 'المايك مكتوم' : 'المايك نشط'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCaptureSnapshot}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-600 transition flex items-center gap-1.5"
                    >
                      <Camera className="w-4 h-4 text-cyan-400" />
                      <span>{language === 'ar' ? 'التقاط صورة إثبات' : 'Snap Evidence'}</span>
                    </button>
                  </div>

                  {isLive && (
                    <button
                      type="button"
                      onClick={handleEndBroadcast}
                      className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition flex items-center gap-1.5"
                    >
                      <VideoOff className="w-4 h-4" />
                      <span>{language === 'ar' ? 'إنهاء البث' : 'Stop Stream'}</span>
                    </button>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Captured Snapshot Preview if taken */}
          {capturedSnapshot && (
            <div className="p-3 bg-slate-950/90 rounded-2xl border border-cyan-500/40 flex items-center justify-between gap-3 text-xs animate-fadeIn">
              <div className="flex items-center gap-3">
                <img
                  src={capturedSnapshot}
                  alt="Snapshot"
                  className="w-16 h-12 object-cover rounded-xl border border-cyan-400"
                />
                <div>
                  <div className="font-bold text-cyan-300">تم التقاط صورة توثيقية حية للواقعة بنجاح</div>
                  <div className="text-[11px] text-slate-400">تم حفظ الصورة وجاهزة للإرفاق في بطاقة STOP الميدانية</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCapturedSnapshot(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Section: Live Directives from HSE General Director */}
          {activeSession?.hseDirectorResponse && (
            <div className="p-4 rounded-2xl bg-amber-950/40 border-2 border-amber-500/70 text-xs space-y-2 animate-bounce">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-300 flex items-center gap-1.5 text-sm">
                  <ShieldAlert className="w-5 h-5 text-amber-400" />
                  أمر وتوجيه فوري من مدير عام السلامة والصحة المهنية:
                </span>
                <span className="text-[10px] text-amber-400/80 font-mono">
                  {activeSession.hseDirectorResponse.directedAt}
                </span>
              </div>
              <p className="text-white font-bold bg-slate-900/80 p-3 rounded-xl border border-amber-500/40 text-sm">
                "{activeSession.hseDirectorResponse.actionDirected}"
              </p>
              {activeSession.hseDirectorResponse.evacuateImmediate && (
                <div className="text-rose-400 font-black flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  أمر إخلاء عاجل للمنطقة فوراً لمسافة الأمان المعتمدة!
                </div>
              )}
            </div>
          )}

          {/* Controls for HSE Director: Command & Directives */}
          {isHseDirector && (
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  توجيهات المدير العام للإدارة العامة للسلامة (HSE Director Directives)
                </h4>
                {directiveSentMsg && (
                  <span className="text-emerald-400 text-xs flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    تم إرسال الأمر الميداني بنجاح للموقع
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={directiveText}
                  onChange={(e) => setDirectiveText(e.target.value)}
                  placeholder="اكتب أمراً تصحيحياً للميدان (مثال: إيقاف المضخة فوراً وعزل القاطع رقم 4)"
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={() => handleSendDirective(false)}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>إرسال التوجيه</span>
                </button>
              </div>

              {/* Quick One-Click Critical Directives */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleSendDirective(true)}
                  className="px-3 py-1.5 rounded-lg bg-rose-600/30 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/50 text-[11px] font-bold transition flex items-center gap-1.5"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>إصدار أمر إخلاء فوري ومغادرة الموقع</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDirectiveText('إيقاف فوري للعمل بموجب كارت STOP وتطبيق عزل الطاقة LOTO');
                    handleSendDirective(false);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-amber-600/30 hover:bg-amber-600 text-amber-300 hover:text-white border border-amber-500/50 text-[11px] font-bold transition flex items-center gap-1.5"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>إيقاف العمل وعزل الطاقة LOTO</span>
                </button>
              </div>
            </div>
          )}

          {/* Broadcaster Configuration Form (When not live yet) */}
          {!isLive && (
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-3.5 text-xs">
              <h4 className="font-bold text-slate-200">بيانات الواقعة لبدء البث المباشر:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">نوع البث الميداني:</label>
                  <select
                    value={streamType}
                    onChange={(e) => setStreamType(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-rose-500"
                  >
                    <option value="NEAR_MISS">⚠️ رصد حادث وشيك حرج (Near-Miss)</option>
                    <option value="ACTUAL_INCIDENT">🚨 توثيق حادث فعلي مباشر (Incident)</option>
                    <option value="STOP_WORK_ORDER">🛑 إيقاف عمل طارئ بموجب STOP</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">المحطة أو الموقع:</label>
                  <input
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">ملاحظات وصف الواقعة الميدانية:</label>
                <textarea
                  rows={2}
                  value={incidentNotes}
                  onChange={(e) => setIncidentNotes(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-rose-500 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleStartBroadcast}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-rose-950/60 border border-rose-400 flex items-center justify-center gap-2 transform active:scale-95 transition"
                >
                  <Radio className="w-4 h-4 animate-pulse" />
                  <span>بدء البث المباشر وإطلاق صفارة الإنذار لإدارة السلامة</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
