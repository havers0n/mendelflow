// supabase-functions: allow-unauthenticated
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID');
const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN');
const TWILIO_PHONE_NUMBER = Deno.env.get('TWILIO_PHONE_NUMBER');

async function sendSMS(to: string, body: string) {
  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
  const params = new URLSearchParams();
  params.append('To', to);
  params.append('From', TWILIO_PHONE_NUMBER!);
  params.append('Body', body);

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params
  });

  if (!resp.ok) {
    const error = await resp.text();
    throw new Error(`Twilio error: ${error}`);
  }
  return await resp.json();
}

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Only POST allowed', { status: 405 });
  }
  try {
    const { phone, message } = await req.json();
    if (!phone || !message) {
      return new Response(JSON.stringify({ error: 'phone and message required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    const result = await sendSMS(phone, message);
    return new Response(JSON.stringify({ success: true, sid: result.sid }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}); 