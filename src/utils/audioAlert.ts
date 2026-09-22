// Web Audio API Synthesizer for Emergency & Near-Miss Live Stream Siren
let audioCtx: AudioContext | null = null;
let sirenOscillator: OscillatorNode | null = null;
let sirenGain: GainNode | null = null;
let sirenInterval: any = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Starts an audible emergency pulsing siren alerting HSE Management
 * that a live Near-Miss camera broadcast is active.
 */
export function startEmergencyAudioAlert() {
  try {
    const ctx = getAudioContext();
    if (sirenOscillator) {
      stopEmergencyAudioAlert();
    }

    sirenOscillator = ctx.createOscillator();
    sirenGain = ctx.createGain();

    sirenOscillator.type = 'sawtooth';
    sirenGain.gain.setValueAtTime(0.15, ctx.currentTime);

    sirenOscillator.connect(sirenGain);
    sirenGain.connect(ctx.destination);

    let high = true;
    sirenOscillator.frequency.setValueAtTime(880, ctx.currentTime); // A5
    sirenOscillator.start();

    sirenInterval = setInterval(() => {
      if (!audioCtx || !sirenOscillator) return;
      const now = audioCtx.currentTime;
      if (high) {
        sirenOscillator.frequency.setTargetAtTime(520, now, 0.08);
      } else {
        sirenOscillator.frequency.setTargetAtTime(960, now, 0.08);
      }
      high = !high;
    }, 450);
  } catch (err) {
    console.warn('Audio alert could not start automatically due to browser policy:', err);
  }
}

/**
 * Stops the active emergency siren.
 */
export function stopEmergencyAudioAlert() {
  if (sirenInterval) {
    clearInterval(sirenInterval);
    sirenInterval = null;
  }
  if (sirenOscillator) {
    try {
      sirenOscillator.stop();
      sirenOscillator.disconnect();
    } catch (e) {
      // ignore
    }
    sirenOscillator = null;
  }
  if (sirenGain) {
    try {
      sirenGain.disconnect();
    } catch (e) {
      // ignore
    }
    sirenGain = null;
  }
}

/**
 * Plays a single priority chime or directive sound
 */
export function playDirectiveChime() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.65);
  } catch (e) {
    // ignore
  }
}
