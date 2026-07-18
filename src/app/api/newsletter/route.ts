import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { getClientIp, checkRateLimit } from '@/lib/rateLimit';

const subscribeSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  source: z.string().optional().default('homepage'),
});

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rateLimitResult = await checkRateLimit(`newsletter:${ip}`, 3, 60 * 1000);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many attempts. Please try again later.' },
      { status: 429 },
    );
  }

  try {
    const body = await request.json();
    const result = subscribeSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 },
      );
    }

    const { email, source } = result.data;
    const supabase = createClient();

    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email, source });

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { success: true, message: 'You are already subscribed!' },
          { status: 200 },
        );
      }
      console.error('Newsletter insert error:', error);
      return NextResponse.json(
        { error: 'Failed to subscribe. Please try again later.' },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { success: true, message: 'Thank you for subscribing!' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Newsletter error:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 },
    );
  }
}
