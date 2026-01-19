"use client"
export const dynamic = 'force-dynamic';
import { useEffect, useState, useRef } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useSovereignVoice } from '../hooks/useSovereignVoice';
import { Volume2, Zap, Coins, Activity, CreditCard } from 'lucide-react';
import FounderProfile from '../components/interface/FounderProfile';

export default function SovereignDashboard() {
  const [supabase] = useState(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder'
  ));

  const [profile, setProfile] = useState<any>(null);
  const [input, setInput] = useState('');
  const [swarm, setSwarm] = useState<any[]>([]);
  const [voiceActive, setVoiceActive] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { speak } = useSovereignVoice();

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data } = await supabase.from('profiles').select('*').single();
      if (data) setProfile(data);
    };
    load();
    
    // Real-time Economy Sync
    const channel = supabase.channel('economy_pulse')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles' }, (p) => setProfile(p.new))
      .subscribe();

    const i = setInterval(() => { if(!isThinking && inputRef.current) inputRef.current.focus(); }, 2000);
    return () => { clearInterval(i); supabase.removeChannel(channel); };
  }, [supabase, isThinking]);

  const igniteAudio = () => {
    setVoiceActive(true);
    speak("Sovereign voice engine initialized. Economy bridge active.");
  };

  const handleCommand = async (e: any) => {
    if (e.key !== 'Enter' || !input) return;
    const cmd = input; setInput(''); setIsThinking(true);
    try {
      const res = await fetch('/api/alpha/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cmd })
      });
      const data = await res.json();
      setSwarm((prev) => [{ agent: "ALPHA", msg: data.output || "Success" }, ...prev].slice(0, 5));
      if (voiceActive) speak(data.output || "Operational.");
    } catch (err) { console.error("Link Stalled."); }
    setIsThinking(false);
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono p-10 lg:p-20 flex flex-col" onClick={() => inputRef.current?.focus()}>
      <header className="flex justify-between items-start mb-20 relative z-50">
        <div className="flex flex-col gap-6">
           <h1 className="text-4xl font-black italic uppercase text-white tracking-tighter">AetherStack<span className="text-cyan-500">AI</span></h1>
           
           <div className="flex gap-4 items-center">
              {/* IU BALANCE DISPLAY */}
              <div className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl flex items-center gap-3">
                 <Coins size={16} className="text-cyan-500" />
                 <span className="text-xl font-black text-white">{profile?.credits || 0} <span className="text-[10px] text-zinc-500 uppercase">IU</span></span>
              </div>
              
              {/* THE ACTIVE RECHARGE PORTAL */}
              <button 
                onClick={() => window.open('https://buy.stripe.com/00wcMY4Y5g846SDf8O3ks08', '_blank')}
                className="px-4 py-2 bg-emerald-500 text-black rounded-full font-black text-[10px] flex items-center gap-2 hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              >
                <CreditCard size={12} /> RECHARGE IU
              </button>
           </div>

           {!voiceActive ? (
             <button onClick={igniteAudio} className="w-fit px-6 py-2 bg-white text-black rounded-full font-black text-[10px] animate-bounce">
               IGNITE NEURAL AUDIO
             </button>
           ) : (
             <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full text-[10px] font-bold uppercase tracking-widest">
               <Volume2 size={14} /> Economic_Handshake_Verified
             </div>
           )}
        </div>
        <FounderProfile name={profile?.full_name || "Founder Yirga"} />
      </header>

      <main className="max-w-4xl mx-auto w-full relative z-50 flex-grow">
        <div className="flex items-center gap-6 mb-12">
          <span className="text-cyan-500 text-6xl font-black italic">?</span>
          <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleCommand} autoFocus placeholder={isThinking ? "REASONING..." : "ISSUE MASTER DIRECTIVE_"} className="flex-1 bg-transparent border-none outline-none text-4xl font-black text-white caret-cyan-500" />
        </div>
        <div className="space-y-4">
          {swarm.map((s, i) => (
            <div key={i} className="p-6 border-l-2 border-cyan-500/20 bg-white/5 rounded-r-3xl animate-in fade-in">
              <div className="text-[10px] text-cyan-500 font-black mb-1 uppercase tracking-widest">[{s.agent}]</div>
              <div className="text-lg text-zinc-300 font-bold italic leading-relaxed">"{s.msg}"</div>
            </div>
          ))}
        </div>
      </main>
      
      <footer className="mt-12 opacity-20 flex justify-between items-center text-[10px] uppercase tracking-[0.3em]">
        <span>Era-Infinity // Planetary_OS</span>
        <span>Mesh_Stability: 1.000</span>
      </footer>
    </div>
  );
}


