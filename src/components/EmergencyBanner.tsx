import React, { useState, useEffect } from 'react';
import { EmergencyBroadcast, Language } from '../types';
import { getT } from '../utils/translations';
import {
  AlertTriangle,
  Flame,
  Volume2,
  VolumeX,
  X,
  Award,
  CheckCircle2,
  MapPin,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface EmergencyBannerProps {
  broadcast: EmergencyBroadcast | null;
  onDismiss: () => void;
  onClaimHeroBonus: (broadcastTitle: string) => void;
  language: Language;
}

export const EmergencyBanner: React.FC<EmergencyBannerProps> = ({
  broadcast,
  onDismiss,
  onClaimHeroBonus,
  language,
}) => {
  const t = getT(language);
  const [soundActive, setSoundActive] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [claimed, setClaimed] = useState<boolean>(false);

  useEffect(() => {
    if (broadcast?.type === 'EVACUATION') {
      setSoundActive(true);
    }
  }, [broadcast]);

  // Audio Siren generator
  useEffect(() => {
    if (!soundActive || !broadcast) return;

    let intervalId: any;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();

      intervalId = setInterval(() => {
        try {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(800, audioCtx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.3);
          gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.35);
        } catch (_) {}
      }, 700);
    } catch (_) {}

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [soundActive, broadcast]);

  if (!broadcast || !broadcast.active) return null;

  const isEvacuation = broadcast.type === 'EVACUATION';
  const isDrill = broadcast.isFieldDrill || broadcast.type === 'DRILL';

  return (
    <div
      className={`border-b z-40 transition-all ${
        isEvacuation
          ? 'bg-rose-950/95 border-rose-500 text-rose-100 shadow-xl'
          : isDrill
          ? 'bg-purple-950/95 border-purple-500 text-purple-100 shadow-lg'
          : 'bg-amber-950/95 border-amber-500 text-amber-100 shadow-lg'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Alert Title & Icon */}
          <div className="flex items-center gap-3">
            <span
              className={`p-2 rounded-xl shrink-0 ${
                isEvacuation
                  ? 'bg-rose-600 text-white animate-bounce'
                  : isDrill
                  ? 'bg-purple-600 text-white animate-pulse'
                  : 'bg-amber-500 text-slate-950'
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
            </span>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded bg-black/40 border border-white/10">
                  {isEvacuation
                    ? t.evacuationAlert
                    : isDrill
                    ? t.drillBanner
                    : 'تنبيه وتوجيه سلامة عاجل'}
                </span>
                <span className="text-[11px] opacity-75 font-mono">{broadcast.issuedAt}</span>
              </div>
              <h4 className="text-sm font-black mt-0.5 text-white">
                {language === 'ar' ? broadcast.title : broadcast.titleEn}
              </h4>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
            {/* Siren Toggle */}
            {isEvacuation && (
              <button
                type="button"
                onClick={() => setSoundActive(!soundActive)}
                className="px-2.5 py-1.5 rounded-lg bg-black/40 hover:bg-black/60 border border-white/20 text-xs font-bold flex items-center gap-1.5"
                title="كتم / تشغيل صفارة الإنذار"
              >
                {soundActive ? (
                  <>
                    <Volume2 className="w-4 h-4 text-rose-400" />
                    <span className="hidden sm:inline">إنذار صوتي</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-4 h-4 text-slate-400" />
                    <span className="hidden sm:inline">كتم الصوت</span>
                  </>
                )}
              </button>
            )}

            {/* Claim Hero Reward Button */}
            {!claimed ? (
              <button
                type="button"
                onClick={() => {
                  onClaimHeroBonus(broadcast.title);
                  setClaimed(true);
                }}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow"
              >
                <Award className="w-4 h-4" />
                <span>{t.confirmEmergencyAction}</span>
              </button>
            ) : (
              <span className="px-3 py-1.5 rounded-lg bg-emerald-600/90 text-white text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>تم تسجيل استجابتك الفورية للمكافأة! (+500)</span>
              </span>
            )}

            {/* Expand Protocol */}
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-white"
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {/* Dismiss */}
            <button
              type="button"
              onClick={onDismiss}
              className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-white"
              title="إغلاق التنبيه"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Expanded Protocol Details */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-white/10 text-xs space-y-2 animate-fadeIn">
            <p className="leading-relaxed opacity-90">
              {language === 'ar' ? broadcast.message : broadcast.messageEn}
            </p>

            {broadcast.evacuationMusterPoint && (
              <div className="flex items-center gap-2 font-bold text-amber-300 bg-black/30 p-2 rounded-lg">
                <MapPin className="w-4 h-4 shrink-0 text-amber-400" />
                <span>{t.musterPoint}</span>
                <span className="text-white">
                  {language === 'ar'
                    ? broadcast.evacuationMusterPoint
                    : broadcast.evacuationMusterPointEn || broadcast.evacuationMusterPoint}
                </span>
              </div>
            )}

            {broadcast.safeProtocolSteps && broadcast.safeProtocolSteps.length > 0 && (
              <div className="space-y-1">
                <span className="font-bold block opacity-90">خطوات التنفيذ الإلزامية:</span>
                <ul className="list-disc list-inside space-y-0.5 opacity-85">
                  {(language === 'ar' ? broadcast.safeProtocolSteps : broadcast.safeProtocolStepsEn).map(
                    (step, idx) => (
                      <li key={idx}>{step}</li>
                    )
                  )}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
