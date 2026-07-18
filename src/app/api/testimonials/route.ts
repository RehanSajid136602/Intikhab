import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('reviews')
    .select('id, rating, title, body, guest_name, customer_email, created_at, products(name)')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(4);

  if (error) {
    return NextResponse.json({ testimonials: [] });
  }

  const testimonials = (data || []).map((review) => ({
    id: review.id,
    name: review.guest_name || 'Verified Customer',
    rating: review.rating,
    review: review.body,
    product: ((review.products as { name: string }[] | null)?.[0]?.name) || '',
    date: review.created_at,
  }));

  return NextResponse.json({ testimonials });
}
