"use client"
import { useEffect, useState, useRef, useMemo } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import FounderProfile from '../components/interface/FounderProfile';
import { useSovereignVoice } from '../hooks/useSovereignVoice';

export default function InfinityOS() {
  const supabase = useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ), []);

  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [input, setInput] = useState('');
  const [swarm, setSwarm] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { speak } = useSovereignVoice();

  useEffect(() => {
    setMounted(true);
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) { 
        setUser(session.user); 
      } else {
        router.push('/login');
      }
    };
    init();
    const i = setInterval(() => { if(!isThinking) inputRef.current?.focus() }, 1000);
    return () => clearInterval(i);
  }, [supabase, router, isThinking]);

  const handleCommand = async (e: any) => {
    if (e.key !== 'Enter' || !input) return;
    const cmd = input; setInput(''); setIsThinking(true);
    speak("AetherStack Mind acknowledging directive.");
    
    try {
      const res = await fetch('/api/alpha/command', {
        method: 'POST',
        body: JSON.stringify({ command: cmd })
      });
      const data = await res.json();
      setSwarm((prev: any) => [{ agent: "INFINITY", msg: data.output || "Processed" }, ...prev].slice(0, 5));
    } catch (err) { console.error("Link Stalled."); }
    setIsThinking(false);
  };

  if (!mounted || !user) return <div className="bg-black min-h-screen" />;

  return (
    <div className="min-h-screen bg-black text-white font-mono p-10 flex flex-col" onClick={() => inputRef.current?.focus()}>
      <header className="flex justify-between items-start mb-20 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tighter italic text-white uppercase">
            AETHERSTACK<span className="text-cyan-500">AI</span>
          </h1>
          <p className="text-zinc-600 text-[10px] mt-2 tracking-[0.4em] uppercase">
            Sovereign OS v∞ // Project: aetherstack-os-infinity
          </p>
        </div>
        <FounderProfile name="Founder Yirga" />
      </header>

      <main className="max-w-4xl mx-auto w-full">
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
            <div key={i} className="p-4 border-l-2 border-cyan-500/20 bg-white/5 rounded-r-xl animate-in fade-in slide-in-from-left-2">
              <div className="text-[10px] text-cyan-500 font-black mb-1 uppercase">AGENT_{s.agent}</div>
              <div className="text-lg text-zinc-300 font-bold">"{s.msg}"</div>
            </div>
          ))}
          {swarm.length === 0 && <div className="text-zinc-800 text-xs tracking-widest">AWAITING_NEURAL_INPUT...</div>}
        </div>
      </main>
    </div>
  );
}