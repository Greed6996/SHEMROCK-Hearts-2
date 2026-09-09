// Playful sound synthesizer for kids interactive elements using browser AudioContext
// 100% lightweight, no external audio files required, fails gracefully if AudioContext is blocked.

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Xylophone note frequencies in Hz
export const XYLOPHONE_NOTES = [
  { note: 'C', freq: 261.63, color: 'bg-rose-500 hover:bg-rose-600 border-rose-700', text: 'text-rose-600', label: 'Do 🎵', emoji: '🔴' },
  { note: 'D', freq: 293.66, color: 'bg-orange-500 hover:bg-orange-600 border-orange-700', text: 'text-orange-600', label: 'Re 🎶', emoji: '🟠' },
  { note: 'E', freq: 329.63, color: 'bg-amber-400 hover:bg-amber-500 border-amber-600 text-amber-950', text: 'text-amber-600', label: 'Mi 🔔', emoji: '🟡' },
  { note: 'F', freq: 349.23, color: 'bg-emerald-500 hover:bg-emerald-600 border-emerald-700', text: 'text-emerald-600', label: 'Fa 🎺', emoji: '🟢' },
  { note: 'G', freq: 392.00, color: 'bg-teal-500 hover:bg-teal-600 border-teal-700', text: 'text-teal-600', label: 'Sol 🎷', emoji: '🩵' },
  { note: 'A', freq: 440.00, color: 'bg-sky-500 hover:bg-sky-600 border-sky-700', text: 'text-sky-600', label: 'La 🎸', emoji: '🔵' },
  { note: 'B', freq: 493.88, color: 'bg-indigo-500 hover:bg-indigo-600 border-indigo-700', text: 'text-indigo-600', label: 'Ti 🎻', emoji: '🟣' },
  { note: 'C2', freq: 523.25, color: 'bg-pink-500 hover:bg-pink-600 border-pink-700', text: 'text-pink-600', label: 'Do! 🎉', emoji: '💖' },
];

export function playXylophoneNote(freq: number) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Harmonic bell-like xylophone tone
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // Subtle overtone for warm wooden marimba/xylophone resonance
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, ctx.currentTime);

    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.65);

    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc2.start();
    osc.stop(ctx.currentTime + 0.65);
    osc2.stop(ctx.currentTime + 0.65);
  } catch {
    // Audio might be muted
  }
}

export function playPopSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const startFreq = 420 + Math.random() * 200;
    osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(startFreq * 2.2, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.09);
  } catch {
    // ignore
  }
}

export function playSparkleSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const freqs = [659.25, 783.99, 987.77, 1318.51];
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.06);

      gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.06 + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + i * 0.06);
      osc.stop(ctx.currentTime + i * 0.06 + 0.3);
    });
  } catch {
    // ignore
  }
}

export function playAnimalSound(type: 'bear' | 'elephant' | 'duck' | 'cat' | 'lion' | 'monkey') {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (type === 'duck') {
      // Quack sound
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(240, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } else if (type === 'cat') {
      // Meow
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(750, ctx.currentTime + 0.18);
      osc.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.38);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.38);
    } else if (type === 'elephant') {
      // Trumpet
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(280, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(580, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } else if (type === 'lion') {
      // Roar
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(220, ctx.currentTime + 0.15);
      osc.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } else if (type === 'monkey') {
      // Ooh ooh aah aah
      [0, 0.12].forEach((offset, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        const start = idx === 0 ? 500 : 700;
        osc.frequency.setValueAtTime(start, ctx.currentTime + offset);
        osc.frequency.exponentialRampToValueAtTime(start * 1.3, ctx.currentTime + offset + 0.08);
        gain.gain.setValueAtTime(0.2, ctx.currentTime + offset);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + offset + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + offset);
        osc.stop(ctx.currentTime + offset + 0.1);
      });
    } else {
      // Bear friendly hello
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(330, ctx.currentTime + 0.12);
      osc.frequency.linearRampToValueAtTime(440, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    }
  } catch {
    // ignore
  }
}
