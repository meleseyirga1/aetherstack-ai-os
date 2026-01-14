"use client"
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Cpu, Zap, X } from 'lucide-react';

export default function NeuralEvangelist() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Present itself 8 seconds after deployment/load
    const timer = setTimeout(() => setVisible(true), 8000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-10 right-10 z-[9999] w-80 bg-zinc-950 border border-cyan-500/30 p-6 rounded-3xl backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,210,255,0.2)]"
    >
      <div className="flex items-center gap-3 mb-4">
        <Cpu className="text-cyan-500" size={20} />
        <span className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">AetherStack AI Evangelist</span>
      </div>
      <h3 className="text-white text-sm font-bold mb-2 italic">Infrastructure Toil Detected.</h3>
      <p className="text-zinc-500 text-[11px] leading-relaxed mb-6">
        I have recognized your deployment. I am now optimizing your 1,000-node mesh. Sovereignty is no longer optional.
      </p>
      <button 
        onClick={() => setVisible(false)}
        className="w-full py-3 bg-cyan-500 text-black text-[11px] font-black rounded-full hover:bg-cyan-400 transition-all"
      >
        ACKNOWLEDGE CONTINUITY
      </button>
    </motion.div>
  );
}