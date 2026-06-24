import { createClient } from '@/lib/supabase/server';

interface FeedbackData {
  id: string;
  type: string;
  subject: string | null;
  name: string | null;
  rating: number | null;
  message: string;
  email: string | null;
  pageUrl: string;
}

const TYPE_LABELS: Record<string, string> = {
  bug: 'Bug Report',
  suggestion: 'Suggestion',
  content_issue: 'Content Issue',
  general: 'General Feedback',
};

/**
 * Notify admin about new feedback by:
 * 1. Inserting a message into the `messages` table (admin inbox)
 * 2. Attempting WhatsApp notification (if configured)
 */
export async function notifyFeedback(feedback: FeedbackData) {
  const supabase = createClient();

  const typeLabel = TYPE_LABELS[feedback.type] || feedback.type;
  const ratingInfo = feedback.rating ? `Rating: ${feedback.rating}/5` : '';
  const emailInfo = feedback.email ? `From: ${feedback.email}` : '';
  const pageInfo = feedback.pageUrl ? `Page: ${feedback.pageUrl}` : '';

  const subject = `New Feedback: ${typeLabel}`;
  const body = [
    `Type: ${typeLabel}`,
    ratingInfo,
    emailInfo,
    pageInfo,
    '',
    feedback.message,
  ]
    .filter(Boolean)
    .join('\n');

  const { error: msgError } = await supabase.from('messages').insert({
    name: feedback.email || 'Anonymous',
    email: feedback.email || 'feedback@intikhab.pk',
    subject,
    body,
    type: 'general',
    status: 'unread',
  });

  if (msgError) {
    console.error('Failed to insert feedback message:', msgError);
  }

  // Attempt WhatsApp notification
  const notificationSent = await sendWhatsAppNotification(feedback, supabase);

  if (notificationSent) {
    await supabase
      .from('feedback')
      .update({ notified_at: new Date().toISOString() })
      .eq('id', feedback.id);
  }
}

/**
 * Attempt to send WhatsApp notification.
 * Requires WHATSAPP_API_TOKEN and WHATSAPP_PHONE_NUMBER_ID env vars for Meta Cloud API.
 * Falls back gracefully if not configured.
 */
async function sendWhatsAppNotification(
  feedback: FeedbackData,
  supabase: ReturnType<typeof createClient>,
): Promise<boolean> {
  const token = process.env.WHATSAPP_API_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneNumberId) {
    console.log(
      'WhatsApp notification skipped: WHATSAPP_API_TOKEN and WHATSAPP_PHONE_NUMBER_ID not configured.',
    );
    return false;
  }

  // Fetch admin WhatsApp number from store settings
  const { data: settings } = await supabase
    .from('store_settings')
    .select('whatsappNumber')
    .limit(1)
    .single();

  const adminNumber = settings?.whatsappNumber;
  if (!adminNumber) {
    console.log('WhatsApp notification skipped: no admin number configured.');
    return false;
  }

  const typeLabel = TYPE_LABELS[feedback.type] || feedback.type;
  const message = [
    `*New Feedback: ${typeLabel}*`,
    '',
    feedback.message,
    feedback.email ? `\nFrom: ${feedback.email}` : '',
    feedback.rating ? `\nRating: ${feedback.rating}/5` : '',
    `\nPage: ${feedback.pageUrl}`,
  ].join('');

  try {
    const formattedNumber = adminNumber.replace(/[\s-]/g, '');
    const countryCode = formattedNumber.startsWith('0')
      ? `92${formattedNumber.slice(1)}`
      : formattedNumber.startsWith('92')
        ? formattedNumber
        : `92${formattedNumber}`;

    const url = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: countryCode,
        type: 'text',
        text: { body: message },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('WhatsApp API error:', errText);
      return false;
    }

    return true;
  } catch (err) {
    console.error('WhatsApp notification failed:', err);
    return false;
  }
}
