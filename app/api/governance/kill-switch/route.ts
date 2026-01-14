import { NextResponse } from 'next/server';
import { NodeSSH } from 'node-ssh';

export async function POST(req: Request) {
  const { action } = await req.json();
  const ssh = new NodeSSH();
  try {
    await ssh.connect({
      host: '143.110.195.79',
      username: 'root',
      password: 'rdmmmichael2013',
      readyTimeout: 10000
    });
    
    // 🛡️ FIXED SYNTAX: Command wrapped in template literal
    const result = await ssh.execCommand(`python3 /opt/aetherstack/scripts/toggle_governance.py ${action}`);
    
    return NextResponse.json({ 
      success: true, 
      isFrozen: result.stdout.trim() === 'True' 
    });
  } catch (e) {
    console.error('Kill-Switch Handshake Failure:', e);
    return NextResponse.json({ success: false }, { status: 500 });
  } finally {
    ssh.dispose();
  }
}