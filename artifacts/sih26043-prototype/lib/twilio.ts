import twilio from 'twilio';
import { NextRequest } from 'next/server';

const authToken = process.env.TWILIO_AUTH_TOKEN || '';

/**
 * Validate that the incoming request really came from Twilio.
 * Critical security control that was missing in Loop 0.
 */
export function validateTwilioRequest(req: NextRequest, body: string): boolean {
  if (process.env.NODE_ENV === 'development' && !authToken) {
    console.warn('[DEV] Skipping Twilio signature check');
    return true;
  }

  const signature = req.headers.get('x-twilio-signature') || '';
  const url = process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook/whatsapp`
    : req.url;

  return twilio.validateRequest(authToken, signature, url, Object.fromEntries(new URLSearchParams(body)));
}
