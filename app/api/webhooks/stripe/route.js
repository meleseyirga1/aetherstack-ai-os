import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { NodeSSH } from 'node-ssh';

// 🛡️ SOVEREIGN DYNAMIC SHIELD: Prevents build-time crashes
export const dynamic = 'force-dynamic';

export async function POST(req) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeKey || !webhookSecret) {
    console.error('❌ CRITICAL: Stripe credentials missing from environment.');
    return NextResponse.json({ error: 'System Configuration Error' }, { status: 500 });
  }

  const stripe = new Stripe(stripeKey);
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const amount = session.amount_total / 100;
    const credits = amount * 100;

    const ssh = new NodeSSH();
    try {
      await ssh.connect({
        host: process.env.VPS_IP,
        username: 'root',
        password: process.env.VPS_PASSWORD,
        readyTimeout: 15000
      });
      await ssh.execCommand(`python3 /opt/aetherstack/scripts/economy_sync.py ${credits}`);
      ssh.dispose();
    } catch (sshErr) {
      console.error('❌ VPS Sync Failed:', sshErr.message);
    }
  }

  return NextResponse.json({ received: true });
}