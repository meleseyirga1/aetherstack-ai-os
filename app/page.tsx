"use client"
import { useEffect, useState, useRef } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useSovereignVoice } from '../hooks/useSovereignVoice';
import { Volume2, Zap } from 'lucide-react';
import FounderProfile from '../components/interface/FounderProfile';

export default function SovereignDashboard() {
  // Initialize the SSR-compatible Browser Client
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [session, setSession] = useState<any>(null);
  const [input, setInput] = useState('');
  const [swarm, setSwarm] = useState([]);
  const [voiceActive, setVoiceActive] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { speak } = useSovereignVoice();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };
    getSession();
    
    // Auto-focus the λ Terminal
    const i = setInterval(() => { if(!isThinking) inputRef.current?.focus() }, 1000);
    return () => clearInterval(i);
  }, [supabase, isThinking]);

  const igniteAudio = () => {
    setVoiceActive(true);
    speak("Sovereign voice engine initialized. Welcome back, Founder.");
  };

  const handleCommand = async (e: any) => {
    if (e.key !== 'Enter' || !input) return;
    const cmd = input; setInput(''); setIsThinking(true);
    
    try {
      const res = await fetch('/api/alpha/command', {
        method: 'POST',
        body: JSON.stringify({ command: cmd })
      });
      const data = await res.json();
      setSwarm((prev: any) => [{ agent: "ALPHA", msg: data.output || "Processed" }, ...prev].slice(0, 5));
      if (voiceActive) speak(data.output || "Operational.");
    } catch (err) { console.error("Link Stalled."); }
    setIsThinking(false);
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono p-10 flex flex-col" onClick={() => inputRef.current?.focus()}>
      <header className="flex justify-between items-start mb-20 relative z-50">
        <div className="flex flex-col gap-4">
           <h1 className="text-4xl font-black tracking-tighter italic uppercase">
             AetherStack<span className="text-cyan-500">AI</span>
           </h1>
           {!voiceActive ? (
             <button 
               onClick={igniteAudio}
               className="flex items-center gap-3 px-6 py-3 bg-white text-black rounded-full font-black text-[10px] animate-bounce shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:bg-cyan-500 transition-all"
             >
               <Zap size={14} fill="black" /> IGNITE NEURAL AUDIO
             </button>
           ) : (
             <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full text-[10px] font-bold uppercase tracking-widest">
               <Volume2 size={14} /> Acoustic_Handshake_Verified
             </div>
           )}
        </div>
        <FounderProfile name="Founder Yirga" />
      </header>

      <main className="max-w-4xl mx-auto w-full relative z-50 flex-grow">
        <div className="flex items-center gap-6 mb-12">
          <span className="text-cyan-500 text-6xl font-black italic">λ</span>
          <input 
            ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleCommand}
            autoFocus placeholder={isThinking ? "REASONING..." : "ISSUE MASTER DIRECTIVE_"}
            className="flex-1 bg-transparent border-none outline-none text-4xl font-black text-white caret-cyan-500"
          />
        </div>

        <div className="space-y-4">
          {swarm.map((s: any, i: number) => (
            <div key={i} className="p-4 border-l-2 border-cyan-500/20 bg-white/5 rounded-r-xl animate-in fade-in">
              <div className="text-[10px] text-cyan-500 font-black mb-1 uppercase tracking-widest">{s.agent}</div>
              <div className="text-lg text-zinc-300 font-bold">{s.msg}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}