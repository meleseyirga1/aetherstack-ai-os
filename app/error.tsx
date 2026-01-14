"use client"
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-red-500 font-mono">
      <h2 className="text-xl font-bold">SYSTEM_CRASH_DETECTED</h2>
      <button onClick={() => reset()} className="mt-4 px-4 py-2 border border-red-500 rounded text-xs uppercase">Attempt Reboot</button>
    </div>
  );
}