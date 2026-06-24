import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { createClient } from '@/lib/supabase/server';
import { notifyFeedback } from '@/lib/feedback-notify';

export async function POST(request: Request) {
  try {
    const session = await auth0.getSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'You must be logged in to submit feedback.' },
        { status: 401 },
      );
    }

    const body = await request.json();

    const { type, rating, message, email, contactPermission, pageUrl } = body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        { error: 'Message is required.' },
        { status: 400 },
      );
    }

    const validTypes = ['bug', 'suggestion', 'content_issue', 'general'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Invalid feedback type.' },
        { status: 400 },
      );
    }

    const supabase = createClient();

    // Fetch profile data from customers table
    const { data: profile } = await supabase
      .from('customers')
      .select('fullName, phone')
      .eq('email', session.user.email)
      .maybeSingle();

    const insertData: Record<string, unknown> = {
      type,
      rating: typeof rating === 'number' ? rating : null,
      message: message.trim(),
      customer_email: session.user.email,
      name: profile?.fullName || body.name || session.user.name || null,
      email: session.user.email,
      phone: body.phone || profile?.phone || null,
      contact_permission: Boolean(contactPermission),
      page_url: typeof pageUrl === 'string' ? pageUrl : '',
    };

    // Detailed form fields (optional)
    if (body.subject !== undefined) insertData.subject = body.subject || null;
    if (body.experienceCategory !== undefined) insertData.experience_category = body.experienceCategory || null;
    if (body.orderId !== undefined) insertData.order_id = body.orderId || null;
    if (body.wouldRecommend !== undefined) insertData.would_recommend = body.wouldRecommend || null;
    if (body.heardFrom !== undefined) insertData.heard_from = body.heardFrom || null;

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
