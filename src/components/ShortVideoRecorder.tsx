import React, { useState, useRef, useEffect } from 'react';
import { Video, Play, Square, RefreshCw, CheckCircle2, AlertCircle, X, Sparkles } from 'lucide-react';

interface ShortVideoRecorderProps {
  onVideoCaptured: (videoUrl: string, durationSeconds: number) => void;
  onClearVideo?: () => void;
  existingVideoUrl?: string;
}

export const ShortVideoRecorder: React.FC<ShortVideoRecorderProps> = ({
  onVideoCaptured,
  onClearVideo,
  existingVideoUrl,
}) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(existingVideoUrl || null);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  const MAX_DURATION_SECONDS = 15; // Short safety clips max 15 seconds

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      stopCameraStream();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: true,
      });
      streamRef.current = stream;
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
        videoPreviewRef.current.play();
      }
      setCameraActive(true);
    } catch (err: any) {
      console.warn('Real camera not accessible, falling back to simulated high-res clip recorder', err);
      // If browser permission denied or in iframe sandbox without camera hardware
      setCameraError('لم تتوفر الكاميرا المباشرة، يمكنك تسجيل لقطة توضيحية محاكاة للمخاطر.');
      setCameraActive(false);
    }
  };

  const startRecording = () => {
    if (!streamRef.current) {
      // Simulate recording if hardware stream unavailable
      setIsRecording(true);
      setRecordingSeconds(0);
      chunksRef.current = [];

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= MAX_DURATION_SECONDS - 1) {
            stopSimulatedRecording();
            return MAX_DURATION_SECONDS;
          }
          return prev + 1;
        });
      }, 1000);
      return;
    }

    try {
      chunksRef.current = [];
      const options = { mimeType: 'video/webm;codecs=vp8,opus' };
      const recorder = new MediaRecorder(
        streamRef.current,
        MediaRecorder.isTypeSupported(options.mimeType) ? options : undefined
      );

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedVideoUrl(url);
        onVideoCaptured(url, recordingSeconds || 5);
        stopCameraStream();
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= MAX_DURATION_SECONDS - 1) {
            stopRecording();
            return MAX_DURATION_SECONDS;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.error('Error starting media recorder:', err);
    }
  };

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const stopSimulatedRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
    // Provide realistic sample equipment inspection video URL
    const demoVideoUrl = 'https://assets.mixkit.co/videos/preview/mixkit-firefighter-putting-out-a-fire-with-water-43305-large.mp4';
    setRecordedVideoUrl(demoVideoUrl);
    onVideoCaptured(demoVideoUrl, 8);
  };

  const handleSimulateClip = () => {
    const sampleClips = [
      'https://assets.mixkit.co/videos/preview/mixkit-firefighter-putting-out-a-fire-with-water-43305-large.mp4',
      'https://assets.mixkit.co/videos/preview/mixkit-welder-working-in-a-metal-factory-43187-large.mp4',
    ];
    const picked = sampleClips[Math.floor(Math.random() * sampleClips.length)];
    setRecordedVideoUrl(picked);
    onVideoCaptured(picked, 6);
  };

  const handleRemove = () => {
    setRecordedVideoUrl(null);
    stopCameraStream();
    if (onClearVideo) onClearVideo();
  };

  return (
    <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
          <Video className="w-4 h-4 text-rose-400" />
          <span>تسجيل لقطة فيديو قصيرة للحالة (Short Video Clip)</span>
        </span>
        <span className="text-[10px] text-slate-400 font-mono">الحد الأقصى: 15 ثانية</span>
      </div>

      {/* Recorded Video Playback */}
      {recordedVideoUrl ? (
        <div className="space-y-2">
          <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-black aspect-video max-h-48 flex items-center justify-center">
            <video
              src={recordedVideoUrl}
              controls
              className="w-full h-full object-contain"
            />
            <div className="absolute top-2 right-2 bg-slate-950/80 px-2 py-0.5 rounded text-[10px] text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> تم توثيق الفيديو
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 left-2 bg-slate-950/80 text-rose-400 px-2 py-0.5 rounded text-[10px] hover:underline flex items-center gap-1"
            >
              <X className="w-3 h-3" /> حذف
            </button>
          </div>
        </div>
      ) : cameraActive ? (
        /* Active Live Camera Stream */
        <div className="space-y-2">
          <div className="relative rounded-xl overflow-hidden border-2 border-rose-500/80 bg-black aspect-video max-h-48 flex items-center justify-center">
            <video
              ref={videoPreviewRef}
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            {/* Live Recording Indicator */}
            {isRecording && (
              <div className="absolute top-2 right-2 bg-rose-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-white" />
                <span>REC 00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}</span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {!isRecording ? (
              <button
                type="button"
                onClick={startRecording}
                className="flex-1 py-2 px-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow"
              >
                <div className="w-3 h-3 rounded-full bg-white" />
                <span>بدء التسجيل المباشر</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={stopRecording}
                className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-rose-400 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition border border-rose-500/40"
              >
                <Square className="w-3 h-3 fill-current" />
                <span>إيقاف وحفظ اللقطة</span>
              </button>
            )}

            <button
              type="button"
              onClick={stopCameraStream}
              className="py-2 px-3 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold"
            >
              إلغاء
            </button>
          </div>
        </div>
      ) : (
        /* Idle Options */
        <div className="space-y-2">
          {isRecording ? (
            /* Simulated Recording State */
            <div className="p-3 bg-rose-950/40 border border-rose-500/50 rounded-xl flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-rose-300 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                جارِ تسجيل اللقطة الميدانية... (00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds})
              </span>
              <button
                type="button"
                onClick={stopSimulatedRecording}
                className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold"
              >
                إيقاف وحفظ
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={startCamera}
                className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
              >
                <Video className="w-3.5 h-3.5 text-rose-400" />
                <span>فتح كاميرا الفيديو</span>
              </button>

              <button
                type="button"
                onClick={handleSimulateClip}
                className="py-2.5 px-3 bg-gradient-to-r from-rose-950/60 to-slate-900 hover:from-rose-900/60 hover:to-slate-850 text-rose-200 border border-rose-800/60 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>لقطة توثيق نموذجية</span>
              </button>
            </div>
          )}

          {cameraError && (
            <p className="text-[10px] text-amber-400/90 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
              {cameraError}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
