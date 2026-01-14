import { NextResponse } from 'next/server';
import { NodeSSH } from 'node-ssh';

export async function GET() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect({
      host: '143.110.195.79',
      username: 'root',
      password: 'rdmmmichael2013'
    });
    
    const result = await ssh.execCommand('tail -n 15 /opt/aetherstack/state/audit_ledger.log');
    const logs = result.stdout.split('\n').filter(l => l.trim().startsWith('{')).map(l => {
        const data = JSON.parse(l);
        return {
            ...data,
            isStrike: data.a === 'INTERDICTION_STRIKE',
            shortHash: data.h.substring(0, 16) + "..."
        };
    }).reverse();
    
    return NextResponse.json(logs);
  } catch (e) {
    return NextResponse.json([]); 
  } finally {
    ssh.dispose();
  }
}
