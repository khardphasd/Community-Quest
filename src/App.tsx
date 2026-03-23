/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MousePointer2, 
  Hand, 
  Move, 
  Home, 
  Heart, 
  Volume2, 
  ArrowLeft,
  CheckCircle2,
  Users,
  Mail,
  ShoppingBasket,
  Stethoscope,
  Flame
} from 'lucide-react';

// --- Types ---
type Level = 'menu' | 'click' | 'hover' | 'drag' | 'success';

// --- Utilities ---
const speak = (text: string) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower for K-2
    utterance.pitch = 1.1; // Friendly pitch
    window.speechSynthesis.speak(utterance);
  }
};

// --- Components ---

const TTSButton = ({ text, className = "" }: { text: string, className?: string }) => (
  <button 
    onClick={(e) => {
      e.stopPropagation();
      speak(text);
    }}
    className={`p-2 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-700 transition-colors ${className}`}
    title="Hear this text"
  >
    <Volume2 size={20} />
  </button>
);

const Header = ({ onBack, title, showBack = true }: { onBack: () => void, title: string, showBack?: boolean }) => (
  <header className="flex items-center justify-between p-6 bg-white border-b border-stone-200">
    <div className="flex items-center gap-4">
      {showBack && (
        <button 
          onClick={onBack}
          className="p-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-600 transition-all flex items-center gap-2 font-medium"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
      )}
      <h1 className="text-2xl font-serif font-bold text-stone-800 flex items-center gap-2">
        <Users className="text-amber-600" />
        {title}
      </h1>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-stone-500 font-medium">Community Helpers</span>
    </div>
  </header>
);

// --- Level 1: Clicking ---
const ClickLevel = ({ onComplete }: { onComplete: () => void }) => {
  const [count, setCount] = useState(0);
  const targetCount = 5;
  const helpers = [
    { name: "Firefighter", icon: <Flame className="text-orange-500" />, color: "bg-orange-50" },
    { name: "Doctor", icon: <Stethoscope className="text-blue-500" />, color: "bg-blue-50" },
    { name: "Mail Carrier", icon: <Mail className="text-green-500" />, color: "bg-green-50" },
    { name: "Grocer", icon: <ShoppingBasket className="text-amber-500" />, color: "bg-amber-50" },
    { name: "Teacher", icon: <Users className="text-purple-500" />, color: "bg-purple-50" },
  ];

  const handleClick = (name: string) => {
    speak(`Hello, ${name}!`);
    setCount(prev => {
      const next = prev + 1;
      if (next === targetCount) {
        setTimeout(onComplete, 1500);
      }
      return next;
    });
  };

  useEffect(() => {
    speak("Click on each community helper to say hello!");
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-12">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <h2 className="text-3xl font-serif font-bold text-stone-800">Say Hello!</h2>
          <TTSButton text="Click on each community helper to say hello!" />
        </div>
        <p className="text-stone-600 text-lg">Helpers found: {count} / {targetCount}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {helpers.map((helper, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleClick(helper.name)}
            className={`${helper.color} p-8 rounded-[2rem] border-2 border-stone-200 shadow-sm flex flex-col items-center gap-4 transition-all hover:border-amber-400 hover:shadow-md`}
          >
            <div className="p-4 bg-white rounded-full shadow-inner">
              {React.cloneElement(helper.icon as React.ReactElement, { size: 48 })}
            </div>
            <span className="font-bold text-stone-700">{helper.name}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

// --- Level 2: Hovering ---
const HoverLevel = ({ onComplete }: { onComplete: () => void }) => {
  const [hovered, setHovered] = useState<number[]>([]);
  const houses = [0, 1, 2, 3, 4, 5];
  
  const handleHover = (id: number) => {
    if (!hovered.includes(id)) {
      const newList = [...hovered, id];
      setHovered(newList);
      speak("Knock knock! Who's there?");
      if (newList.length === houses.length) {
        setTimeout(onComplete, 2000);
      }
    }
  };

  useEffect(() => {
    speak("Move your mouse over the houses to see who lives there!");
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-12">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <h2 className="text-3xl font-serif font-bold text-stone-800">Friendly Neighbors</h2>
          <TTSButton text="Move your mouse over the houses to see who lives there!" />
        </div>
        <p className="text-stone-600 text-lg">Houses visited: {hovered.length} / {houses.length}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
        {houses.map((id) => (
          <motion.div
            key={id}
            onMouseEnter={() => handleHover(id)}
            className="relative w-48 h-48 bg-stone-100 rounded-3xl border-2 border-stone-200 flex items-center justify-center overflow-hidden cursor-help group"
          >
            <AnimatePresence mode="wait">
              {hovered.includes(id) ? (
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="flex flex-col items-center gap-2"
                >
                  <Heart className="text-rose-500 fill-rose-500" size={48} />
                  <span className="font-bold text-stone-700">A Friend!</span>
                </motion.div>
              ) : (
                <motion.div 
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex flex-col items-center gap-2"
                >
                  <Home className="text-stone-400" size={64} />
                  <span className="text-stone-400 font-medium italic">Hover me</span>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="absolute inset-0 bg-amber-400 opacity-0 group-hover:opacity-10 transition-opacity" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// --- Level 3: Dragging ---
const DragLevel = ({ onComplete }: { onComplete: () => void }) => {
  const [delivered, setDelivered] = useState<number[]>([]);
  const letters = [
    { id: 1, color: "bg-blue-100", label: "Blue Letter" },
    { id: 2, color: "bg-rose-100", label: "Pink Letter" },
    { id: 3, color: "bg-emerald-100", label: "Green Letter" },
  ];

  const handleDragEnd = (id: number, info: any) => {
    // Simple collision detection with the mailbox area
    // In a real app we'd use refs and getBoundingClientRect, 
    // but for a lightweight demo we'll check if it's dropped in the right half
    if (info.point.x > window.innerWidth * 0.6) {
      if (!delivered.includes(id)) {
        const newList = [...delivered, id];
        setDelivered(newList);
        speak("Great job! You delivered the mail!");
        if (newList.length === letters.length) {
          setTimeout(onComplete, 1500);
        }
      }
    }
  };

  useEffect(() => {
    speak("Drag the letters to the mailbox on the right!");
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-12 h-[60vh]">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <h2 className="text-3xl font-serif font-bold text-stone-800">Mail Delivery</h2>
          <TTSButton text="Drag the letters to the mailbox on the right!" />
        </div>
        <p className="text-stone-600 text-lg">Letters delivered: {delivered.length} / {letters.length}</p>
      </div>

      <div className="flex w-full justify-around items-center flex-1">
        <div className="flex flex-col gap-6">
          {letters.map((letter) => (
            !delivered.includes(letter.id) && (
              <motion.div
                key={letter.id}
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={1}
                onDragEnd={(_, info) => handleDragEnd(letter.id, info)}
                whileDrag={{ scale: 1.1, zIndex: 50 }}
                className={`${letter.color} w-32 h-20 rounded-xl border-2 border-stone-300 shadow-md flex items-center justify-center cursor-grab active:cursor-grabbing`}
              >
                <Mail className="text-stone-600" />
              </motion.div>
            )
          ))}
        </div>

        <div className="w-64 h-80 bg-stone-800 rounded-t-[3rem] border-b-8 border-stone-900 flex flex-col items-center justify-center relative">
          <div className="w-48 h-4 bg-stone-900 rounded-full mb-8" />
          <div className="text-white font-serif text-2xl font-bold tracking-widest opacity-50">MAILBOX</div>
          <div className="absolute -top-4 right-4 w-8 h-12 bg-rose-600 rounded-sm" />
          
          {delivered.length > 0 && (
            <div className="absolute top-1/2 flex flex-wrap gap-1 justify-center px-4">
              {delivered.map(id => (
                <div key={id} className="w-8 h-5 bg-white/20 rounded-sm" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Main App ---
export default function App() {
  const [level, setLevel] = useState<Level>('menu');

  const handleLevelSelect = (newLevel: Level) => {
    setLevel(newLevel);
  };

  const handleBack = () => {
    setLevel('menu');
  };

  const handleComplete = () => {
    setLevel('success');
    speak("You did it! Great job helping our community!");
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] font-sans text-stone-900">
      <AnimatePresence mode="wait">
        {level === 'menu' && (
          <motion.div 
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-4xl mx-auto py-16 px-6"
          >
            <div className="text-center mb-16 space-y-4">
              <h1 className="text-6xl font-serif font-black text-stone-800 tracking-tight">
                Community <span className="text-amber-600 italic">Quest</span>
              </h1>
              <div className="flex items-center justify-center gap-3">
                <p className="text-xl text-stone-600 font-medium">Choose a way to help our town!</p>
                <TTSButton text="Community Quest. Choose a way to help our town!" />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <LevelCard 
                title="Click & Say Hello" 
                desc="Practice clicking on helpers."
                icon={<MousePointer2 size={40} />}
                onClick={() => handleLevelSelect('click')}
                color="bg-amber-50 border-amber-200 text-amber-700"
              />
              <LevelCard 
                title="Hover & Visit" 
                desc="Move your mouse to see neighbors."
                icon={<Hand size={40} />}
                onClick={() => handleLevelSelect('hover')}
                color="bg-blue-50 border-blue-200 text-blue-700"
              />
              <LevelCard 
                title="Drag & Deliver" 
                desc="Move letters to the mailbox."
                icon={<Move size={40} />}
                onClick={() => handleLevelSelect('drag')}
                color="bg-green-50 border-green-200 text-green-700"
              />
            </div>
          </motion.div>
        )}

        {level === 'click' && (
          <motion.div key="click" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }}>
            <Header onBack={handleBack} title="Click Practice" />
            <ClickLevel onComplete={handleComplete} />
          </motion.div>
        )}

        {level === 'hover' && (
          <motion.div key="hover" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }}>
            <Header onBack={handleBack} title="Hover Practice" />
            <HoverLevel onComplete={handleComplete} />
          </motion.div>
        )}

        {level === 'drag' && (
          <motion.div key="drag" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }}>
            <Header onBack={handleBack} title="Drag Practice" />
            <DragLevel onComplete={handleComplete} />
          </motion.div>
        )}

        {level === 'success' && (
          <motion.div 
            key="success"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center min-h-screen p-8 text-center gap-8"
          >
            <div className="bg-white p-12 rounded-[3rem] shadow-xl border-4 border-amber-400 max-w-lg w-full">
              <CheckCircle2 size={120} className="text-amber-500 mx-auto mb-6" />
              <h2 className="text-4xl font-serif font-bold text-stone-800 mb-4">You're a Hero!</h2>
              <p className="text-xl text-stone-600 mb-8">You helped everyone in our community today.</p>
              <button 
                onClick={handleBack}
                className="w-full py-4 bg-stone-800 text-white rounded-2xl font-bold text-xl hover:bg-stone-700 transition-all shadow-lg"
              >
                Play Again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LevelCard({ title, desc, icon, onClick, color }: { title: string, desc: string, icon: React.ReactNode, onClick: () => void, color: string }) {
  return (
    <motion.button
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => {
        speak(`${title}. ${desc}`);
        onClick();
      }}
      className={`${color} p-8 rounded-[2.5rem] border-2 shadow-sm flex flex-col items-center text-center gap-4 transition-all hover:shadow-xl`}
    >
      <div className="p-6 bg-white rounded-full shadow-inner mb-2">
        {icon}
      </div>
      <h3 className="text-2xl font-serif font-bold">{title}</h3>
      <p className="opacity-80 font-medium">{desc}</p>
    </motion.button>
  );
}
