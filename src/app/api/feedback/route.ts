import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { notifyFeedback } from '@/lib/feedback-notify';
import { feedbackSchema } from '@/lib/validation';
import { getClientIp, checkRateLimit } from '@/lib/rateLimit';

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rateLimitResult = await checkRateLimit(`feedback:${ip}`, 5, 5 * 60 * 1000);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: "Too many feedback submissions. Please try again in a few minutes." },
      { status: 429 },
    );
  }

  try {
    const session = await auth.api.getSession({
      headers: headers(),
    }).catch(() => null);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'You must be logged in to submit feedback.' },
        { status: 401 },
      );
    }

    const body = await request.json();

    const result = feedbackSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.format() },
        { status: 400 },
      );
    }

    const {
      type,
      rating,
      message,
      name,
      phone,
      contactPermission,
      pageUrl,
      subject,
      experienceCategory,
      orderId,
      wouldRecommend,
      heardFrom,
    } = result.data;

    const supabase = createClient();

    // Fetch profile data from customers table
    const { data: profile } = await supabase
      .from('customers')
      .select('fullName, phone')
      .eq('email', session.user.email)
      .maybeSingle();

    const insertData: Record<string, unknown> = {
      type,
      rating,
      message,
      customer_email: session.user.email,
      name: profile?.fullName || name || session.user.name || null,
      email: session.user.email,
      phone: phone || profile?.phone || null,
      contact_permission: contactPermission,
      page_url: pageUrl,
      subject,
      experience_category: experienceCategory,
      order_id: orderId,
      would_recommend: wouldRecommend,
      heard_from: heardFrom,
    };

    const { data, error } = await supabase
      .from('feedback')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Database insert error:', error);
      return NextResponse.json(
        { error: 'Failed to save feedback.' },
        { status: 500 },
      );
    }

    // Fire-and-forget notification
    notifyFeedback({
      id: data.id,
      type: data.type,
      subject: data.subject,
      name: data.name,
      rating: data.rating,
      message: data.message,
      email: data.email,
      pageUrl: data.page_url,
    }).catch((err) => console.error('Notification error:', err));

    return NextResponse.json(
      { success: true, message: 'Feedback submitted successfully.' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Feedback submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 },
    );
  }
}
