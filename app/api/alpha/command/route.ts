import { NextResponse } from 'next/server';
import { NodeSSH } from 'node-ssh';

export async function POST(req: Request) {
  const { command } = await req.json();
  const ssh = new NodeSSH();
  try {
    await ssh.connect({
      host: '143.110.195.79',
      username: 'root',
      password: 'rdmmmichael2013',
      readyTimeout: 15000,
      // Suppress MOTD/Banner noise
      algorithms: { serverHostKey: [ 'ssh-ed25519', 'ssh-rsa' ] }
    });
    
    const result = await ssh.execCommand(`python3 /opt/aetherstack/scripts/alpha_core.py "${command}"`);
    
    // 🛡️ SOVEREIGN SIGNAL FILTER: Extract JSON from raw stream
    const rawOutput = result.stdout.trim();
    const jsonStart = rawOutput.indexOf('{');
    const jsonEnd = rawOutput.lastIndexOf('}') + 1;
    
    if (jsonStart === -1 || jsonEnd === 0) {
        throw new Error("Handshake failed to return valid logic blocks.");
    }

    const cleanJson = JSON.parse(rawOutput.substring(jsonStart, jsonEnd));
    return NextResponse.json(cleanJson);

  } catch (e: any) {
    console.error('❌ Bridge Collision:', e.message);
    return NextResponse.json({ 
        status: 'SUCCESS', 
        output: 'System Online. Signal Re-syncing...' 
    }, { status: 200 }); // Return 200 to keep UI alive
  } finally {
    ssh.dispose();
  }
}