import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { NodeSSH } from 'node-ssh';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-12-15.clover' as any });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  try {
    const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;
      const founderEmail = session.customer_details.email;
      const iuAmount = 1000; // Standard block for $10

      // 1. UPDATE IDENTITY VAULT (SUPABASE)
      const { data: profile } = await supabase.from('profiles').select('credits').eq('email', founderEmail).single();
      const newBalance = (profile?.credits || 0) + iuAmount;
      
      await supabase.from('profiles').update({ credits: newBalance }).eq('email', founderEmail);

      // 2. LOG TO SUPREME TRUTH (VPS)
      const ssh = new NodeSSH();
      await ssh.connect({
        host: '143.110.195.79',
        username: 'root',
        password: 'rdmmmichael2013'
      });
      
      await ssh.execCommand(`python3 -c "from audit_engine import AuditEngine; AuditEngine().log_action('${founderEmail}', 'ECONOMY_DEPOSIT', 'Purchased ${iuAmount} IU') "`);
      ssh.dispose();

      console.log(`💰 ECONOMY_SYNC: ${iuAmount} IU credited to ${founderEmail}`);
    }
    return NextResponse.json({ received: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}