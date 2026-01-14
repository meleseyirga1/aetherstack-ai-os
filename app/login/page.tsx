"use client"
import { createClient } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// HARD-CODED BRIDGE: Bypasses .env corruption
const supabase = createClient('https://kwibyhnaneprfzdqiqzw.supabase.co', 'PASTE_YOUR_ANON_KEY_HERE');

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('SOVEREIGN_AUTH_REQUIRED');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
        setMsg("ERROR: " + error.message);
    } else {
        setMsg("✓ IDENTITY_VERIFIED");
        router.push('/');
    }
    setLoading(false);
  };

  const handleSignUp = async () => {
    setLoading(true);
    // This creates the account AND logs you in if email confirm is off
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setMsg("ERROR: " + error.message);
    else setMsg("FOUNDER_ACCOUNT_CREATED. CLICK SIGN IN.");
    setLoading(false);
  };

  return (
    <div style={{ background: 'black', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace' }}>
      <div style={{ width: '380px', padding: '50px', border: '1px solid #111', background: '#050505', borderRadius: '30px', textAlign: 'center' }}>
        <h1 style={{ color: 'white', fontSize: '20px', fontWeight: '900', marginBottom: '10px' }}>AETHERSTACK<span style={{color: '#00d2ff'}}>AI</span></h1>
        <p style={{ color: '#ff9900', fontSize: '9px', marginBottom: '30px', letterSpacing: '2px' }}>{msg}</p>
        
        <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input type="email" placeholder="FOUNDER_EMAIL" value={email} onChange={e => setEmail(e.target.value)} style={{ background: '#000', border: '1px solid #222', color: 'white', padding: '12px', borderRadius: '8px', fontSize: '12px' }} required />
          <input type="password" placeholder="SECRET_PASSWORD" value={password} onChange={e => setPassword(e.target.value)} style={{ background: '#000', border: '1px solid #222', color: 'white', padding: '12px', borderRadius: '8px', fontSize: '12px' }} required />
          
          <button type="submit" disabled={loading} style={{ background: '#00d2ff', color: 'black', padding: '15px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
            {loading ? 'VERIFYING...' : 'SIGN_IN'}
          </button>
          
          <button type="button" onClick={handleSignUp} style={{ color: '#444', fontSize: '10px', background: 'none', border: 'none', cursor: 'pointer', marginTop: '10px' }}>
            [ REGISTER_FOUNDER_IDENTITY ]
          </button>
        </form>
      </div>
    </div>
  );
}