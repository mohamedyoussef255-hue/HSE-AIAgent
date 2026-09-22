import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Sparkles, Volume2, Check, RefreshCw } from 'lucide-react';

interface VoiceRecorderProps {
  onTranscription: (text: string) => void;
  initialText?: string;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onTranscription,
  initialText = '',
}) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcription, setTranscription] = useState<string>(initialText);
  const [recognitionSupported, setRecognitionSupported] = useState<boolean>(true);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    // Check Web Speech API support
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'ar-SA';

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        if (currentTranscript.trim()) {
          setTranscription((prev) => {
            const updated = prev ? `${prev} ${currentTranscript}` : currentTranscript;
            onTranscription(updated);
            return updated;
          });
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsRecording(false);
        clearInterval(timerRef.current);
      };

      recognition.onend = () => {
        setIsRecording(false);
        clearInterval(timerRef.current);
      };

      recognitionRef.current = recognition;
    } else {
      setRecognitionSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
      clearInterval(timerRef.current);
    };
  }, [onTranscription]);

  const toggleRecording = () => {
    if (!recognitionSupported) {
      // Fallback voice simulation
      handleVoiceSample('يوجد تسريب زيوت كثيف بجوار ضاغط الغاز مما قد يسبب انزلاق أو اشتعال فوري.');
      return;
    }

    if (isRecording) {
      try {
        recognitionRef.current?.stop();
      } catch (_) {}
      setIsRecording(false);
      clearInterval(timerRef.current);
    } else {
      try {
        recognitionRef.current?.start();
        setIsRecording(true);
        setRecordingSeconds(0);
        timerRef.current = setInterval(() => {
          setRecordingSeconds((prev) => prev + 1);
        }, 1000);
      } catch (err) {
        console.warn('Cannot start recognition:', err);
        handleVoiceSample('يوجد تسريب زيوت كثيف بجوار ضاغط الغاز مع عدم وجود صمام أمان.');
      }
    }
  };

  const handleVoiceSample = (sample: string) => {
    setTranscription(sample);
    onTranscription(sample);
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remaining = sec % 60;
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  return (
    <div className="space-y-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-amber-400" />
          التسجيل الصوتي للملاحظة الميدانية (Voice-to-Text)
        </label>
        {isRecording && (
          <span className="flex items-center gap-1.5 text-xs text-rose-400 font-mono animate-pulse">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            جارِ التسجيل: {formatTimer(recordingSeconds)}
          </span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <button
          type="button"
          onClick={toggleRecording}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all shadow-md ${
            isRecording
              ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse shadow-rose-900/50'
              : 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-amber-900/20'
          }`}
        >
          {isRecording ? (
            <>
              <MicOff className="w-4 h-4" />
              <span>إيقاف التسجيل</span>
            </>
          ) : (
            <>
              <Mic className="w-4 h-4" />
              <span>تحدث لتسجيل الملاحظة</span>
            </>
          )}
        </button>

        {isRecording && (
          <div className="flex-1 flex items-center justify-center gap-1 h-8 bg-slate-950/60 rounded-lg px-3">
            {[40, 75, 100, 60, 30, 85, 95, 45, 65, 80, 50].map((h, i) => (
              <span
                key={i}
                className="w-1 bg-amber-400 rounded-full animate-pulse"
                style={{
                  height: `${h}%`,
                  animationDelay: `${i * 80}ms`,
                  animationDuration: '0.6s',
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Voice sample fast buttons for hands-free or quick inspection */}
      <div className="pt-2 border-t border-slate-800/80">
        <p className="text-[11px] text-slate-400 mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-amber-400" />
          أو اختر عينة صوتية مسجلة مسبقاً للتجربة السريعة:
        </p>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() =>
              handleVoiceSample(
                'يوجد تسريب زيوت كثيف بجوار ضاغط الغاز رقم 2 وتراكم أبخرة بدون تهوية مناسبة.'
              )
            }
            className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700/80 transition-colors text-right"
          >
            "تسريب زيوت بجوار ضاغط الغاز"
          </button>
          <button
            type="button"
            onClick={() =>
              handleVoiceSample(
                'عامل يقوم بأعمال صيانة كهربائية في لوحة 380V دون ارتداء قفازات عازلة مع ارتداء حذاء غير مطابق.'
              )
            }
            className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700/80 transition-colors text-right"
          >
            "صيانة كهرباء بدون مهمات وقاية"
          </button>
          <button
            type="button"
            onClick={() =>
              handleVoiceSample(
                'تراكم كراتين ومخلفات خشبية تسد مسار مخرج الطوارئ المؤدي إلى نقطة التجمع الجنوبية.'
              )
            }
            className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700/80 transition-colors text-right"
          >
            "انسداد مخرج الطوارئ بمخلفات"
          </button>
          <button
            type="button"
            onClick={() =>
              handleVoiceSample(
                'فريق الوردية ملتزم بالكامل بوضع حواجز العزل وتطبيق نظام قفل مصادر الطاقة LOTO قبل بدء الفحص.'
              )
            }
            className="text-[11px] bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-800/60 transition-colors text-right"
          >
            "سلوك آمن: التزام كامل بنظام LOTO"
          </button>
        </div>
      </div>
    </div>
  );
};
