"use client"
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Shield, Zap, Globe, ArrowRight } from 'lucide-react';
import { useSovereignVoice } from '../hooks/useSovereignVoice';
import MasterDashboard from '../components/interface/MasterDashboard'; // We will move your old page here

export default function EntryPoint() {
  const supabase = createClientComponentClient();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };
    checkUser();
  }, []);

  if (loading) return <div className="bg-black min-h-screen" />;

  // IF LOGGED IN: Show the Sovereign Terminal
  if (user) return <MasterDashboard />;

  // IF PUBLIC: Show the Luxury Advertisement Page
  return (
    <div className="min-h-screen bg-black text-white font-mono flex flex-col items-center justify-center p-10 overflow-hidden relative">
      {/* Background Grid */}
      <div className="fixed inset-0 opacity-10 bg-[url('/icon-512.png')] bg-no-repeat bg-center bg-contain mix-blend-screen grayscale" />
      
      <motion_div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 text-center space-y-8 max-w-3xl">
        <img src="/logo-full.png" alt="Logo" className="h-16 mx-auto mb-12 drop-shadow-[0_0_30px_rgba(0,210,255,0.3)]" />
        
        <h2 className="text-sm tracking-[0.8em] text-cyan-500 font-black uppercase">The World’s First Sovereign AI OS</h2>
        
        <p className="text-zinc-500 text-lg leading-relaxed font-light italic">
          "You are not using AI—you are entering a sovereign intelligence network designed to amplify human thought."
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 py-20 border-y border-white/5">
          <Feature icon={<Shield className="text-cyan-500" />} title="SOVEREIGNTY" desc="Your data. Your silicon." />
          <Feature icon={<Globe className="text-purple-500" />} title="CONTINUITY" desc="A mind that never forgets." />
          <Feature icon={<Zap className="text-emerald-500" />} title="SCALE" desc="1,000 nodes at your hand." />
        </div>

        <button 
          onClick={() => router.push('/login')}
          className="group px-12 py-5 bg-white text-black font-black rounded-full hover:bg-cyan-500 transition-all flex items-center gap-4 mx-auto"
        >
          ENTER THE NETWORK
          <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
        </button>
      </motion_div>

      <footer className="absolute bottom-10 opacity-20 text-[8px] tracking-[0.5em]">
        GENESIS ERA // SOVEREIGNTY BY DESIGN
      </footer>
    </div>
  );
}

function Feature({ icon, title, desc }: any) {
  return (
    <div className="space-y-4">
      <div className="flex justify-center">{icon}</div>
      <h3 className="text-xs font-black tracking-widest">{title}</h3>
      <p className="text-[10px] text-zinc-600 leading-tight">{desc}</p>
    </div>
  )
}