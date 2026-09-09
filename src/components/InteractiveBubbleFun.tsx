import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Volume2, VolumeX, Wand2, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playPopSound, playSparkleSound } from '../utils/kidSounds';

interface FloatingItem {
  id: number;
  type: 'bubble' | 'balloon' | 'star';
  x: number; // percentage
  size: number; // px
  speed: number; // seconds
  delay: number;
  emoji: string;
  color: string;
}

const COLOR_PALETTES = [
  { bg: 'bg-pink-400/80 border-pink-500 text-pink-700', shadow: 'shadow-pink-300' },
  { bg: 'bg-sky-400/80 border-sky-500 text-sky-700', shadow: 'shadow-sky-300' },
  { bg: 'bg-amber-400/80 border-amber-500 text-amber-800', shadow: 'shadow-amber-300' },
  { bg: 'bg-emerald-400/80 border-emerald-500 text-emerald-800', shadow: 'shadow-emerald-300' },
  { bg: 'bg-purple-400/80 border-purple-500 text-purple-800', shadow: 'shadow-purple-300' },
  { bg: 'bg-rose-400/80 border-rose-500 text-rose-800', shadow: 'shadow-rose-300' },
];

export const InteractiveBubbleFun: React.FC = () => {
  const [items, setItems] = useState<FloatingItem[]>([]);
  const [poppedCount, setPoppedCount] = useState(0);
  const [burstEffects, setBurstEffects] = useState<{ id: number; x: number; y: number; text: string }[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [magicWandActive, setMagicWandActive] = useState(true);
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number; emoji: string }[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  // Generate floating bubbles, balloons, and stars
  useEffect(() => {
    const initialItems: FloatingItem[] = Array.from({ length: 9 }).map((_, i) => {
      const typeChoice = i % 3 === 0 ? 'balloon' : i % 3 === 1 ? 'bubble' : 'star';
      const palette = COLOR_PALETTES[i % COLOR_PALETTES.length];
      return {
        id: Date.now() + i,
        type: typeChoice,
        x: 4 + i * 11 + Math.random() * 4,
        size: typeChoice === 'balloon' ? 52 : typeChoice === 'star' ? 36 : 46,
        speed: 13 + Math.random() * 8,
        delay: i * 1.2,
        emoji: typeChoice === 'balloon' ? '🎈' : typeChoice === 'star' ? '⭐' : '🫧',
        color: palette.bg,
      };
    });
    setItems(initialItems);
  }, []);

  // Magic Wand Cursor Trail
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!magicWandActive || Math.random() > 0.4) return;
    const icons = ['✨', '⭐', '💖', '🎈', '🌈'];
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];
    const newSparkle = {
      id: Date.now() + Math.random(),
      x: e.clientX,
      y: e.clientY,
      emoji: randomIcon,
    };

    setSparkles((prev) => [...prev.slice(-12), newSparkle]);
    setTimeout(() => {
      setSparkles((prev) => prev.filter((s) => s.id !== newSparkle.id));
    }, 700);
  }, [magicWandActive]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  const handlePop = (id: number, e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    if (soundEnabled) {
      playPopSound();
    }

    const nextCount = poppedCount + 1;
    setPoppedCount(nextCount);

    // Burst sparkle effect
    const burstId = Date.now();
    const burstIcons = ['🎉 POP!', '✨ POP!', '⭐ YAY!', '💖 POP!'];
    const chosen = burstIcons[Math.floor(Math.random() * burstIcons.length)];
    setBurstEffects((prev) => [...prev, { id: burstId, x, y, text: chosen }]);
    setTimeout(() => {
      setBurstEffects((prev) => prev.filter((b) => b.id !== burstId));
    }, 600);

    // Check celebration milestone every 10 pops!
    if (nextCount > 0 && nextCount % 10 === 0) {
      setShowCelebration(true);
      if (soundEnabled) playSparkleSound();
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#fbbf24', '#38bdf8', '#34d399', '#a855f7'],
      });
      setTimeout(() => setShowCelebration(false), 3500);
    }

    // Respawn floating item
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const typeChoice = Math.random() > 0.5 ? 'balloon' : Math.random() > 0.5 ? 'bubble' : 'star';
          return {
            ...item,
            id: Date.now() + Math.random(),
            type: typeChoice,
            emoji: typeChoice === 'balloon' ? '🎈' : typeChoice === 'star' ? '⭐' : '🫧',
            x: 5 + Math.random() * 90,
            delay: 0.2,
          };
        }
        return item;
      })
    );
  };

  return (
    <>
      {/* Magic Wand Sparkles Trail */}
      <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
        {sparkles.map((sp) => (
          <motion.div
            key={sp.id}
            initial={{ opacity: 1, scale: 0.6, y: 0 }}
            animate={{ opacity: 0, scale: 1.5, y: -25 }}
            transition={{ duration: 0.7 }}
            style={{ left: sp.x - 10, top: sp.y - 10 }}
            className="fixed text-base drop-shadow-md select-none"
          >
            {sp.emoji}
          </motion.div>
        ))}
      </div>

      {/* Floating Bubbles & Balloons Layer */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-20">
        {items.map((b) => (
          <motion.div
            key={b.id}
            initial={{ y: '110vh', opacity: 0 }}
            animate={{
              y: '-20vh',
              opacity: [0, 0.95, 0.95, 0],
              x: [0, 18, -18, 0],
            }}
            transition={{
              y: { duration: b.speed, repeat: Infinity, ease: 'linear', delay: b.delay },
              opacity: { duration: b.speed, repeat: Infinity, times: [0, 0.1, 0.9, 1], delay: b.delay },
              x: { duration: b.speed / 2, repeat: Infinity, ease: 'easeInOut' },
            }}
            style={{
              left: `${b.x}%`,
              width: `${b.size}px`,
              height: `${b.type === 'balloon' ? b.size * 1.25 : b.size}px`,
            }}
            className="pointer-events-auto absolute cursor-pointer select-none group"
            onClick={(e) => handlePop(b.id, e)}
            title="Pop me!"
          >
            {b.type === 'balloon' ? (
              <div className="relative w-full h-full flex flex-col items-center group-hover:scale-125 transition-transform">
                <div
                  className={`w-full h-full rounded-[50%_50%_50%_50%_/_40%_40%_60%_60%] border-2 shadow-md flex items-center justify-center text-white ${b.color}`}
                >
                  <span className="text-xl">🎈</span>
                  <div className="absolute top-2 left-2 w-2 h-3.5 bg-white/50 rounded-full rotate-[-30deg]" />
                </div>
                {/* Balloon string */}
                <div className="w-0.5 h-6 bg-slate-400 -mt-1 opacity-70" />
              </div>
            ) : b.type === 'star' ? (
              <div className="w-full h-full rounded-full flex items-center justify-center bg-amber-400/90 border-2 border-amber-500 shadow-md group-hover:scale-130 transition-transform animate-wiggle">
                <span className="text-2xl">⭐</span>
              </div>
            ) : (
              <div
                className={`w-full h-full rounded-full border-2 backdrop-blur-xs shadow-md group-hover:scale-130 transition-transform flex items-center justify-center ${b.color}`}
              >
                <div className="absolute top-1.5 left-2 w-2.5 h-1.5 bg-white/80 rounded-full rotate-[-30deg]" />
                <span className="text-sm">🫧</span>
              </div>
            )}
          </motion.div>
        ))}

        {/* Burst Pop labels */}
        <AnimatePresence>
          {burstEffects.map((effect) => (
            <motion.div
              key={effect.id}
              initial={{ scale: 0.5, opacity: 1, y: 0 }}
              animate={{ scale: 1.8, opacity: 0, y: -30 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{ left: effect.x, top: effect.y }}
              className="fixed -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center z-30 font-black text-rose-600 bg-white/90 px-3 py-1 rounded-full shadow-lg border-2 border-amber-300 text-sm font-heading"
            >
              {effect.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 10-Pop Milestone Celebration Modal Banner */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 p-1 rounded-3xl shadow-2xl"
          >
            <div className="bg-white px-6 py-4 rounded-[22px] flex items-center gap-4">
              <div className="text-4xl animate-bounce">🧸🎉</div>
              <div>
                <span className="text-xs font-black text-rose-600 uppercase tracking-wider block">
                  🌟 BUBBLE CHAMPION!
                </span>
                <h4 className="text-lg font-black text-slate-900 font-heading">
                  You popped {poppedCount} items! High Five!
                </h4>
                <p className="text-xs font-bold text-slate-600">
                  Shemmy Bear is doing a happy dance for you! 💖
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Kids Score Badge (Bottom Left) */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
        id="bubble-score-badge"
        className="fixed bottom-5 left-5 z-40 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-full border-3 border-amber-300 shadow-xl flex items-center gap-3 text-xs font-bold text-slate-800 select-none hover:shadow-2xl transition-all"
      >
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-tr from-rose-400 to-amber-400 text-white text-base shadow-xs animate-wiggle">
          🧸
        </span>
        <span className="font-heading">
          Pop Carnival: <strong className="text-rose-600 font-black text-sm">{poppedCount}</strong> popped!
        </span>

        {/* Sound toggle */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
          title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
          aria-label="Toggle pop sound"
        >
          {soundEnabled ? <Volume2 size={15} className="text-rose-600" /> : <VolumeX size={15} />}
        </button>

        {/* Magic Wand toggle */}
        <button
          onClick={() => setMagicWandActive(!magicWandActive)}
          className={`p-1.5 rounded-full transition-colors flex items-center gap-1 ${
            magicWandActive ? 'bg-amber-100 text-amber-800 font-bold' : 'text-slate-400 hover:bg-slate-100'
          }`}
          title={magicWandActive ? 'Magic wand trail ON' : 'Magic wand trail OFF'}
        >
          <Wand2 size={15} className={magicWandActive ? 'text-amber-600 animate-spin-slow' : ''} />
          <span className="text-[10px] hidden sm:inline">Magic Wand</span>
        </button>
      </motion.div>
    </>
  );
};

