import { NextResponse } from 'next/server';
import { NodeSSH } from 'node-ssh';

export async function POST(req: Request) {
  const { command } = await req.json();
  const ssh = new NodeSSH();
  
  try {
    // ALWAYS HANDSHAKE WITH THE ROOT (NYC-01)
    await ssh.connect({
      host: '143.110.195.79',
      username: 'root',
      password: 'rdmmmichael2013',
      readyTimeout: 15000
    });
    
    // Relay the intent to the Master Brain
    const result = await ssh.execCommand("python3 /opt/aetherstack/scripts/alpha_core.py '" + command + "'");
    return NextResponse.json(JSON.parse(result.stdout));

  } catch (e: any) {
    console.error('? MASTER LINK FAILURE:', e.message);
    return NextResponse.json({ error: 'ROOT_HUB_OFFLINE' }, { status: 500 });
  } finally {
    ssh.dispose();
  }
}
