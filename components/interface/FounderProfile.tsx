"use client"
export default function FounderProfile() {
  return (
    <div className="flex items-center gap-4 p-3 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl">
      <div className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
        <img src="/founder.png" alt="Founder" className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-500" />
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest animate-pulse">Founder Identity Active</span>
        <span className="text-[12px] text-white font-bold font-mono tracking-tighter">SOVEREIGN_ID: 001-ALPHA</span>
      </div>
    </div>
  );
}