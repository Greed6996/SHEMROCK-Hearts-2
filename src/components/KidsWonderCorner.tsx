import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Music, Volume2, Smile, Star, Heart, Award, RefreshCw, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  XYLOPHONE_NOTES,
  playXylophoneNote,
  playAnimalSound,
  playPopSound,
  playSparkleSound,
} from '../utils/kidSounds';

interface AnimalFriend {
  id: string;
  name: string;
  species: 'bear' | 'elephant' | 'duck' | 'cat' | 'lion' | 'monkey';
  emoji: string;
  tagline: string;
  color: string;
  borderColor: string;
  badgeBg: string;
}

const ANIMAL_FRIENDS: AnimalFriend[] = [
  {
    id: 'shemmy',
    name: 'Shemmy Bear',
    species: 'bear',
    emoji: '🧸',
    tagline: '“Welcome to SHEMROCK! Dive into our giant ball pool!”',
    color: 'from-amber-100 to-rose-100 text-amber-900',
    borderColor: 'border-amber-300',
    badgeBg: 'bg-amber-400 text-amber-950',
  },
  {
    id: 'ellie',
    name: 'Ellie Elephant',
    species: 'elephant',
    emoji: '🐘',
    tagline: '“Pawoooo! I love painting giant rainbows in Creative Corner!”',
    color: 'from-sky-100 to-indigo-100 text-sky-900',
    borderColor: 'border-sky-300',
    badgeBg: 'bg-sky-400 text-white',
  },
  {
    id: 'leo',
    name: 'Leo the Lion',
    species: 'lion',
    emoji: '🦁',
    tagline: '“Roaaar! I am super brave on the outdoor garden slide!”',
    color: 'from-amber-100 to-orange-100 text-amber-900',
    borderColor: 'border-orange-300',
    badgeBg: 'bg-orange-500 text-white',
  },
  {
    id: 'coco',
    name: 'Coco Monkey',
    species: 'monkey',
    emoji: '🐵',
    tagline: '“Ooh-ooh aah-aah! Let’s build giant wooden towers together!”',
    color: 'from-emerald-100 to-teal-100 text-emerald-900',
    borderColor: 'border-emerald-300',
    badgeBg: 'bg-emerald-500 text-white',
  },
  {
    id: 'ducky',
    name: 'Ducky Daisy',
    species: 'duck',
    emoji: '🦆',
    tagline: '“Quack-quack! Splashing and playing with blocks is so much fun!”',
    color: 'from-yellow-100 to-amber-100 text-yellow-950',
    borderColor: 'border-yellow-300',
    badgeBg: 'bg-yellow-400 text-yellow-950',
  },
  {
    id: 'kitty',
    name: 'Kitty Cleo',
    species: 'cat',
    emoji: '🐱',
    tagline: '“Meow-meow! Snuggle up in the Storytelling Corner with me!”',
    color: 'from-pink-100 to-purple-100 text-pink-900',
    borderColor: 'border-pink-300',
    badgeBg: 'bg-pink-400 text-white',
  },
];

// Simple Twinkle Twinkle tune indexes (0-based into XYLOPHONE_NOTES)
// C C G G A A G | F F E E D D C
const TWINKLE_TUNE = [0, 0, 4, 4, 5, 5, 4, 3, 3, 2, 2, 1, 1, 0];

interface KidsWonderCornerProps {
  onBookClick: () => void;
}

export const KidsWonderCorner: React.FC<KidsWonderCornerProps> = ({ onBookClick }) => {
  const [activeTab, setActiveTab] = useState<'xylophone' | 'animals' | 'balloons'>('xylophone');
  const [lastNotePlayed, setLastNotePlayed] = useState<string | null>(null);
  const [activeAnimal, setActiveAnimal] = useState<AnimalFriend>(ANIMAL_FRIENDS[0]);
  const [isPlayingTune, setIsPlayingTune] = useState(false);
  const [starPoints, setStarPoints] = useState(12);
  const [flyingNotes, setFlyingNotes] = useState<{ id: number; note: string; x: number; y: number }[]>([]);
  
  // Balloon pop game state
  const [balloons, setBalloons] = useState([
    { id: 1, color: 'from-rose-400 to-pink-500', name: 'Ruby', popped: false, icon: '🎈' },
    { id: 2, color: 'from-amber-400 to-orange-400', name: 'Sunny', popped: false, icon: '🎈' },
    { id: 3, color: 'from-emerald-400 to-teal-500', name: 'Minty', popped: false, icon: '🎈' },
    { id: 4, color: 'from-sky-400 to-blue-500', name: 'Sky', popped: false, icon: '🎈' },
    { id: 5, color: 'from-purple-400 to-pink-500', name: 'Berry', popped: false, icon: '🎈' },
  ]);

  const handlePlayKey = (index: number, e?: React.MouseEvent) => {
    const item = XYLOPHONE_NOTES[index];
    playXylophoneNote(item.freq);
    setLastNotePlayed(item.label);
    setStarPoints((prev) => prev + 1);

    // Spawn floating note animation
    const id = Date.now() + Math.random();
    const x = e ? e.clientX : window.innerWidth / 2;
    const y = e ? e.clientY : window.innerHeight / 2;
    setFlyingNotes((prev) => [...prev.slice(-8), { id, note: item.label, x, y }]);

    setTimeout(() => {
      setFlyingNotes((prev) => prev.filter((n) => n.id !== id));
    }, 900);
  };

  const playNurseryTune = async () => {
    if (isPlayingTune) return;
    setIsPlayingTune(true);

    for (let i = 0; i < TWINKLE_TUNE.length; i++) {
      const noteIdx = TWINKLE_TUNE[i];
      handlePlayKey(noteIdx);
      await new Promise((resolve) => setTimeout(resolve, 450));
    }

    // Celebration burst after tune
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#fbbf24', '#38bdf8', '#34d399', '#a855f7'],
    });

    setIsPlayingTune(false);
  };

  const handleAnimalClick = (animal: AnimalFriend) => {
    setActiveAnimal(animal);
    playAnimalSound(animal.species);
    setStarPoints((prev) => prev + 2);
  };

  const handlePopBalloon = (id: number) => {
    playPopSound();
    setBalloons((prev) =>
      prev.map((b) => (b.id === id ? { ...b, popped: true } : b))
    );
    setStarPoints((prev) => prev + 5);

    confetti({
      particleCount: 30,
      spread: 45,
      origin: { y: 0.7 },
      colors: ['#f43f5e', '#fbbf24', '#34d399', '#38bdf8'],
    });
  };

  const resetBalloons = () => {
    playSparkleSound();
    setBalloons((prev) => prev.map((b) => ({ ...b, popped: false })));
  };

  return (
    <section
      id="kids-play-corner"
      className="py-16 relative overflow-hidden bg-gradient-to-b from-amber-50/60 via-pink-50/40 to-white"
    >
      {/* Playful Floating Cloud Cutouts Background */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-60">
        <div className="absolute top-4 left-6 text-3xl animate-bounce-ball">🎈</div>
        <div className="absolute top-12 right-12 text-3xl animate-wiggle">⭐</div>
        <div className="absolute bottom-10 left-16 text-3xl animate-float">🍭</div>
        <div className="absolute bottom-6 right-20 text-3xl animate-bounce-ball">🚀</div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Playful Section Title Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 via-rose-400 to-purple-400 p-0.5 rounded-full shadow-md">
            <span className="bg-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-black text-rose-700 flex items-center gap-1.5">
              <Sparkles size={16} className="text-amber-500 animate-spin-slow" />
              <span>KIDS INTERACTIVE WONDER CORNER</span>
              <span className="text-base">🎈</span>
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 font-heading">
            Tap, Play & Make Music with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-pink-500 to-amber-500 underline decoration-wavy decoration-amber-300">
              Shemmy & Friends!
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-bold max-w-xl mx-auto">
            Children learn best through joy and music. Try our interactive rainbow xylophone and meet our friendly campus animal buddies!
          </p>

          {/* Star Counter Pill */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <div className="inline-flex items-center gap-2 bg-amber-100 border-2 border-amber-300 px-4 py-1.5 rounded-full shadow-xs text-xs font-black text-amber-900 animate-wiggle">
              <span className="text-base">⭐</span>
              <span>
                Little Superstar Stars Collected:{' '}
                <strong className="text-rose-600 text-sm">{starPoints}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Toy Tabs (Xylophone, Animal Pals, Balloon Pop) */}
        <div className="flex items-center justify-center gap-2.5 sm:gap-4 mb-8 flex-wrap">
          <button
            onClick={() => setActiveTab('xylophone')}
            className={`btn-toy px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 border-2 transition-all shadow-md ${
              activeTab === 'xylophone'
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white border-rose-600 border-b-4'
                : 'bg-white text-slate-700 border-slate-200 hover:border-rose-300'
            }`}
          >
            <Music size={16} />
            <span>🎵 Rainbow Xylophone</span>
          </button>

          <button
            onClick={() => setActiveTab('animals')}
            className={`btn-toy px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 border-2 transition-all shadow-md ${
              activeTab === 'animals'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-orange-600 border-b-4'
                : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300'
            }`}
          >
            <Smile size={16} />
            <span>🦁 Animal Friends Calling</span>
          </button>

          <button
            onClick={() => setActiveTab('balloons')}
            className={`btn-toy px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 border-2 transition-all shadow-md ${
              activeTab === 'balloons'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-emerald-600 border-b-4'
                : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'
            }`}
          >
            <span>🎈 Pop The Balloons</span>
          </button>
        </div>

        {/* Tab 1: Rainbow Musical Xylophone */}
        {activeTab === 'xylophone' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-amber-300 shadow-xl relative overflow-hidden">
            {/* Cute wooden bar frame top */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-100 flex-wrap gap-4">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-rose-600 block">
                  Tap Any Key to Play Real Notes
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
                  SHEMROCK Music & Rhythm Station
                </h3>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={playNurseryTune}
                  disabled={isPlayingTune}
                  className="btn-toy px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-amber-950 font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md border-b-4 border-amber-600 disabled:opacity-50"
                >
                  <Zap size={14} />
                  <span>{isPlayingTune ? 'Playing Twinkle Star... 🎶' : 'Auto-Play "Twinkle Star"'}</span>
                </button>
              </div>
            </div>

            {/* Xylophone Keys */}
            <div className="py-8">
              <div className="flex items-end justify-center gap-2 sm:gap-3 max-w-4xl mx-auto h-64 sm:h-72 p-4 bg-amber-50/70 rounded-3xl border-4 border-amber-200 shadow-inner">
                {XYLOPHONE_NOTES.map((k, idx) => {
                  // Key heights decrease from C to C2 like a real xylophone
                  const heightPercent = 98 - idx * 6;
                  const isRecent = lastNotePlayed === k.label;

                  return (
                    <motion.button
                      key={k.note}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.94 }}
                      onClick={(e) => handlePlayKey(idx, e)}
                      style={{ height: `${heightPercent}%` }}
                      className={`flex-1 rounded-2xl shadow-md border-b-6 flex flex-col justify-between items-center py-4 text-white font-black text-xs sm:text-sm transition-all relative overflow-hidden select-none cursor-pointer ${k.color} ${
                        isRecent ? 'ring-4 ring-white animate-wiggle' : ''
                      }`}
                    >
                      {/* Screw rivets on top and bottom like a real wooden xylophone */}
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-900/30 shadow-inner" />

                      <div className="text-center">
                        <span className="text-xs sm:text-base block mb-0.5">{k.emoji}</span>
                        <span className="font-heading text-xs sm:text-sm tracking-tight">{k.note}</span>
                        <span className="text-[10px] font-bold block opacity-90 hidden sm:block">
                          {k.label}
                        </span>
                      </div>

                      <div className="w-2.5 h-2.5 rounded-full bg-slate-900/30 shadow-inner" />
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Info note */}
            <div className="text-center pt-2 text-xs font-bold text-slate-500">
              💡 Early exposure to pitch and rhythm fosters language acquisition, phonetics, and math readiness!
            </div>
          </div>
        )}

        {/* Tab 2: Animal Friends Calling */}
        {activeTab === 'animals' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-orange-300 shadow-xl space-y-6">
            <div className="text-center max-w-md mx-auto">
              <span className="text-xs font-black uppercase tracking-wider text-orange-600 block">
                Tap on Any Animal Buddy!
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
                Meet the SHEMROCK Mascot Friends
              </h3>
            </div>

            {/* Animal Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {ANIMAL_FRIENDS.map((af) => {
                const isSelected = activeAnimal.id === af.id;
                return (
                  <motion.button
                    key={af.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAnimalClick(af)}
                    className={`p-4 rounded-2xl border-3 flex flex-col items-center justify-center text-center transition-all bg-gradient-to-b shadow-md ${
                      af.color
                    } ${af.borderColor} ${
                      isSelected
                        ? 'ring-4 ring-orange-400 shadow-xl scale-105 animate-wiggle'
                        : 'hover:border-slate-300'
                    }`}
                  >
                    <div className="text-4xl sm:text-5xl mb-2 filter drop-shadow-xs">
                      {af.emoji}
                    </div>
                    <strong className="text-xs sm:text-sm font-black font-heading block">
                      {af.name}
                    </strong>
                    <span
                      className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full mt-1 ${af.badgeBg}`}
                    >
                      Tap Me!
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* Active Animal Speech Bubble */}
            <motion.div
              key={activeAnimal.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-5 rounded-3xl bg-amber-50 border-3 border-amber-300 max-w-2xl mx-auto flex items-center gap-4 shadow-sm"
            >
              <div className="w-16 h-16 rounded-2xl bg-white border-2 border-amber-300 flex items-center justify-center text-4xl shrink-0 shadow-xs animate-bounce-ball">
                {activeAnimal.emoji}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-base text-slate-900 font-heading">
                    {activeAnimal.name} says:
                  </h4>
                  <span className="text-[10px] font-extrabold bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full">
                    Voice Played! 🔊
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-700 mt-1 italic">
                  {activeAnimal.tagline}
                </p>
              </div>
            </motion.div>
          </div>
        )}

        {/* Tab 3: Pop the Balloons Carnival */}
        {activeTab === 'balloons' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-emerald-300 shadow-xl space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-emerald-600 block">
                  Tap Balloons to Pop Them!
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
                  SHEMROCK Balloon Carnival
                </h3>
              </div>

              <button
                onClick={resetBalloons}
                className="btn-toy px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-1.5 shadow-sm border-b-4 border-emerald-800"
              >
                <RefreshCw size={14} />
                <span>Inflate New Balloons</span>
              </button>
            </div>

            {/* Balloons Row */}
            <div className="py-6 flex items-center justify-center gap-4 sm:gap-8 flex-wrap">
              {balloons.map((b) => (
                <div key={b.id} className="text-center">
                  <AnimatePresence>
                    {!b.popped ? (
                      <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 1.5, opacity: 0 }}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.8 }}
                        onClick={() => handlePopBalloon(b.id)}
                        className={`w-20 h-28 sm:w-24 sm:h-34 rounded-[50%_50%_50%_50%_/_40%_40%_60%_60%] bg-gradient-to-tr shadow-lg border-2 border-white/50 flex flex-col items-center justify-center text-white font-black cursor-pointer animate-float-balloon relative ${b.color}`}
                        title="Click to pop!"
                      >
                        {/* Balloon Highlight */}
                        <div className="absolute top-3 left-4 w-3 h-5 rounded-full bg-white/40 rotate-[-30deg]" />
                        <span className="text-2xl">🎈</span>
                        <span className="text-[10px] font-extrabold uppercase mt-1">Pop!</span>
                        {/* String knot at bottom */}
                        <div className="absolute -bottom-1.5 w-3 h-2 bg-slate-800/30 rounded-full" />
                        <div className="absolute -bottom-6 w-0.5 h-5 bg-slate-300" />
                      </motion.button>
                    ) : (
                      <div className="w-20 h-28 sm:w-24 sm:h-34 flex items-center justify-center">
                        <span className="text-3xl animate-bounce">✨ Pop!</span>
                      </div>
                    )}
                  </AnimatePresence>
                  <span className="text-xs font-bold text-slate-600 block mt-2">{b.name}</span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center text-xs font-bold text-emerald-800">
              🎈 Every child visiting SHEMROCK Hearts in Beltola receives a complimentary colourful balloon and welcome gift pack!
            </div>
          </div>
        )}

        {/* Floating notes generated on key clicks */}
        {flyingNotes.map((fn) => (
          <motion.div
            key={fn.id}
            initial={{ opacity: 1, y: 0, scale: 1 }}
            animate={{ opacity: 0, y: -60, scale: 1.8 }}
            transition={{ duration: 0.8 }}
            style={{ left: fn.x - 20, top: fn.y - 40 }}
            className="fixed pointer-events-none z-50 text-xl font-black text-pink-600 drop-shadow-md"
          >
            {fn.note}
          </motion.div>
        ))}

        {/* Bottom CTA to Book Campus Visit */}
        <div className="mt-10 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 bg-white p-3 rounded-2xl border-2 border-amber-200 shadow-md">
            <span className="text-xs sm:text-sm font-black text-slate-800 px-2">
              Want your little one to explore our physical Ball Pool, Swings & Music Corner in person?
            </span>
            <button
              onClick={onBookClick}
              className="btn-toy px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-700 hover:to-amber-600 text-white font-black text-xs sm:text-sm shadow-md border-b-4 border-rose-800"
            >
              Book A Free Campus Playdate 🧸
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
