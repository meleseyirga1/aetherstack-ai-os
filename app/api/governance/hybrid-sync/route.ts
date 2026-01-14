import { NextResponse } from 'next/server';
import { NodeSSH } from 'node-ssh';

export async function GET() {
  const ssh = new NodeSSH();
  try {
    // Attempt link with aggressive 3-second timeout to prevent Dashboard hangs
    await ssh.connect({
      host: '143.110.195.79',
      username: 'root',
      password: 'rdmmmichael2013',
      readyTimeout: 3000 
    });
    
    return NextResponse.json({ 
      vps_status: "CONNECTED", 
      supabase_status: "ACTIVE",
      timestamp: new Date().toISOString()
    });
  } catch (e) {
    // Fail gracefully so the UI doesn't 500
    return NextResponse.json({ 
      vps_status: "OFFLINE", 
      supabase_status: "ACTIVE" 
    });
  } finally {
    ssh.dispose();
  }
}