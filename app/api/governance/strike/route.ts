import { NextResponse } from 'next/server';
import { NodeSSH } from 'node-ssh';

export async function POST(req: Request) {
  const { signature } = await req.json();
  const ssh = new NodeSSH();
  
  try {
    await ssh.connect({
      host: '143.110.195.79',
      username: 'root',
      password: 'rdmmmichael2013'
    });
    
    // Execute the Swarm Strike
    const result = await ssh.execCommand(`python3 /opt/aetherstack/scripts/swarm_sentinel.py "${signature}"`);
    const strikeData = JSON.parse(result.stdout);
    
    // Log the strike to the Forensic Ledger
    await ssh.execCommand(`python3 -c "from audit_engine import AuditEngine; AuditEngine().log_action('SENTINEL', 'SWARM_STRIKE', 'Neutralized ${signature}')"`);

    return NextResponse.json(strikeData);
  } catch (e) {
    return NextResponse.json({ error: 'INTERDICTION_LINK_FAILURE' }, { status: 500 });
  } finally {
    ssh.dispose();
  }
}
