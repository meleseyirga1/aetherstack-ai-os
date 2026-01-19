import { NextResponse } from 'next/server';
import { NodeSSH } from 'node-ssh';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const { command } = await req.json();
  const ssh = new NodeSSH();
  
  try {
    // 🛡️ BASE64 DECODING LOGIC
    const encodedKey = process.env.VPS_PRIVATE_KEY || '';
    const decodedKey = Buffer.from(encodedKey, 'base64').toString('utf-8');

    await ssh.connect({
      host: process.env.VPS_IP || '143.110.195.79',
      username: 'root',
      privateKey: decodedKey,
      readyTimeout: 20000
    });
    
    const result = await ssh.execCommand(`python3 /opt/aetherstack/scripts/alpha_core.py "${command}"`);
    return NextResponse.json(JSON.parse(result.stdout));

  } catch (e: any) {
    console.error("🔒 SECURITY_BLOCK: ", e.message);
    return NextResponse.json({ error: 'LINK_STALLED', msg: e.message }, { status: 500 });
  } finally {
    ssh.dispose();
  }
}