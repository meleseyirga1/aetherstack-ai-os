import { NextResponse } from 'next/server';
import { NodeSSH } from 'node-ssh';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const { command } = await req.json();
  const ssh = new NodeSSH();
  
  try {
    // 🛡️ SENTINEL HANDSHAKE
    // We prioritize the Private Key. If missing, it falls back to the environment.
    await ssh.connect({
      host: process.env.VPS_IP || '143.110.195.79',
      username: 'root',
      privateKey: process.env.VPS_PRIVATE_KEY, // The Scepter
      readyTimeout: 20000
    });
    
    const result = await ssh.execCommand(`python3 /opt/aetherstack/scripts/alpha_core.py "${command}"`);
    
    // Parse the Brain's response
    const output = JSON.parse(result.stdout);
    return NextResponse.json(output);

  } catch (e: any) {
    console.error("🔒 SECURITY_BLOCK: ", e.message);
    return NextResponse.json({ 
      error: 'LINK_STALLED', 
      msg: 'Sentinel rejected the handshake. Verify Private Key.' 
    }, { status: 500 });
  } finally {
    ssh.dispose();
  }
}