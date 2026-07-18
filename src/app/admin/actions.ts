'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { redirect } from 'next/navigation';
import { checkAdminAccess } from '@/lib/supabase/auth';

import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

async function requireAdmin() {
  const session = await auth.api.getSession({
    headers: headers(),
  }).catch(() => null);

  if (!session || !(await checkAdminAccess(session.user.email))) {
    redirect('/admin/login');
  }
  return session.user;
}

export async function verifyAdminAccessAction(email: string): Promise<boolean> {
  return checkAdminAccess(email);
}

// ─── Customers ───────────────────────────────────────────────

export async function getCustomers() {
  await requireAdmin();
  const supabase = createClient();

  const { data: customers } = await supabase
    .from('customers')
    .select('id, email, phone, fullName, city, status, newsletter, notes, createdAt')
    .order('createdAt', { ascending: false });

  const { data: orders } = await supabase
    .from('orders')
    .select('customerEmail, total');

  const orderMap = new Map<string, { count: number; total: number }>();
  for (const o of orders || []) {
    const entry = orderMap.get(o.customerEmail) || { count: 0, total: 0 };
    entry.count += 1;
    entry.total += o.total || 0;
    orderMap.set(o.customerEmail, entry);
  }

  return (customers || []).map((c) => {
    const orderData = orderMap.get(c.email) || { count: 0, total: 0 };
    return {
      id: c.id,
      name: c.fullName || c.email.split('@')[0],
      email: c.email,
      phone: c.phone || '',
      city: c.city || '',
      orders: orderData.count,
      totalSpent: orderData.total,
      status: c.status || 'active',
      joined: c.createdAt ? new Date(c.createdAt).toISOString().split('T')[0] : '',
      newsletter: c.newsletter || false,
      notes: c.notes || null,
    } as import('@/types/admin').AdminCustomer;
  });
}

export async function getCustomerStats() {
  await requireAdmin();
  const supabase = createClient();

  const { data: customers } = await supabase.from('customers').select('status, newsletter, createdAt');
  const { data: orders } = await supabase.from('orders').select('customerEmail');

  const orderCustomers = new Set((orders || []).map((o) => o.customerEmail));

  return {
    total: customers?.length || 0,
    active: customers?.filter((c) => c.status === 'active').length || 0,
    vip: customers?.filter((c) => c.status === 'vip').length || 0,
    blocked: customers?.filter((c) => c.status === 'blocked').length || 0,
    newsletter: customers?.filter((c) => c.newsletter).length || 0,
    withOrders: orderCustomers.size,
  };
}

export async function updateCustomerStatus(customerId: string, status: string) {
  await requireAdmin();
  if (!['active', 'vip', 'blocked'].includes(status)) {
    return { error: 'Invalid status' };
  }
  const supabase = createClient();
  const { error } = await supabase
    .from('customers')
    .update({ status })
    .eq('id', customerId);
  if (error) return { error: error.message };
  revalidatePath('/admin/customers');
  return { success: true };
}

export async function deleteCustomer(customerId: string) {
  await requireAdmin();
  const supabase = createClient();
  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', customerId);
  if (error) return { error: error.message };
  revalidatePath('/admin/customers');
  return { success: true };
}

// ─── Messages ────────────────────────────────────────────────

export async function getMessages() {
  await requireAdmin();
  const supabase = createClient();
  const { data } = await supabase
    .from('messages')
    .select('id, name, email, phone, subject, body, type, status, createdAt')
    .order('createdAt', { ascending: false });
  return (data || []).map((m) => ({
    id: m.id,
    name: m.name,
    email: m.email,
    phone: m.phone || null,
    subject: m.subject,
    body: m.body,
    type: m.type,
    status: m.status,
    date: m.createdAt,
  })) as import('@/types/admin').AdminMessage[];
}

export async function getMessageStats() {
  await requireAdmin();
  const supabase = createClient();
  const { data } = await supabase.from('messages').select('status');
  const counts = { unread: 0, open: 0, resolved: 0, archived: 0 };
  for (const m of data || []) {
    if (m.status in counts) counts[m.status as keyof typeof counts]++;
  }
  return counts;
}

export async function updateMessageStatus(messageId: string, status: string) {
  await requireAdmin();
  if (!['unread', 'open', 'resolved', 'archived'].includes(status)) {
    return { error: 'Invalid status' };
  }
  const supabase = createClient();
  const { error } = await supabase
    .from('messages')
    .update({ status, updatedAt: new Date().toISOString() })
    .eq('id', messageId);
  if (error) return { error: error.message };
  revalidatePath('/admin/messages');
  return { success: true };
}

// ─── Settings ────────────────────────────────────────────────

export async function getOrCreateSettings() {
  await requireAdmin();
  const supabase = createClient();

  const { data: existing } = await supabase
    .from('store_settings')
    .select('*')
    .limit(1);

  if (existing && existing.length > 0) {
    return existing[0] as import('@/types/admin').StoreSettings;
  }

  const { data: created, error } = await supabase
    .from('store_settings')
    .insert({
      storeName: 'Intikhab',
      publicEmail: 'intikhab.pakistan@gmail.com',
      supportPhone: '+92 332 3130689',
      whatsappNumber: '+92 332 3130689',
      storeLocation: 'Lahore, Pakistan',
      businessHours: 'Monday - Saturday: 10:00 AM - 8:00 PM',
      codEnabled: true,
      jazzcashEnabled: true,
      easypaisaEnabled: true,
      cardEnabled: false,
      freeDeliveryEnabled: true,
      freeDeliveryMinimum: 3000,
      standardDeliveryFee: 150,
      estimatedDeliveryDays: 3,
      newOrderEmailNotifications: true,
      lowStockAlerts: true,
      customerMessageAlerts: true,
      newsletterSignupAlerts: false,
    })
    .select()
    .single();

  if (error) throw new Error('Failed to create settings: ' + error.message);
  return created as import('@/types/admin').StoreSettings;
}

export async function updateStoreSettings(formData: FormData) {
  await requireAdmin();
  const supabase = createClient();

  const data: Record<string, string | boolean | number> = {};
  for (const [key, value] of Array.from(formData.entries())) {
    if (value === 'true') data[key] = true;
    else if (value === 'false') data[key] = false;
    else if (!isNaN(Number(value)) && value !== '') data[key] = Number(value);
    else data[key] = value as string;
  }
  data.updatedAt = new Date().toISOString();

  const { error } = await supabase
    .from('store_settings')
    .update(data)
    .eq('id', data.id as string);

  if (error) return { error: error.message };
  revalidatePath('/admin/settings');
  return { success: true };
}

// ─── Appearance ──────────────────────────────────────────────

export async function getOrCreateAppearance() {
  await requireAdmin();
  const supabase = createClient();

  const { data: existing } = await supabase
    .from('appearance_settings')
    .select('*')
    .limit(1);

  if (existing && existing.length > 0) {
    return existing[0] as import('@/types/admin').AppearanceSettings;
  }

  const { data: created, error } = await supabase
    .from('appearance_settings')
    .insert({
      storeName: 'Intikhab',
      tagline: 'Selection That Matters',
      primaryColor: '#1A1A1A',
      accentColor: '#E53935',
      backgroundColor: '#F7F7F7',
      textColor: '#1A1A1A',
      heroTitle: 'Step Into Style',
      heroSubtitle: 'Discover premium footwear that elevates your every step.',
      heroCtaLabel: 'Shop Now',
      heroCtaLink: '/products',
      heroImage: null,
      showHero: true,
      showCategoryCards: true,
      showInstagramFeed: true,
      showTestimonials: true,
      showNewsletter: true,
      showTrustBadges: true,
    })
    .select()
    .single();

  if (error) throw new Error('Failed to create appearance settings: ' + error.message);
  return created as import('@/types/admin').AppearanceSettings;
}

export async function updateAppearanceSettings(formData: FormData) {
  await requireAdmin();
  const supabase = createClient();

  const data: Record<string, string | boolean | number | null> = {};
  for (const [key, value] of Array.from(formData.entries())) {
    if (value === 'true') data[key] = true;
    else if (value === 'false') data[key] = false;
    else if (value === '') data[key] = null;
    else data[key] = value as string;
  }
  data.updatedAt = new Date().toISOString();

  const { error } = await supabase
    .from('appearance_settings')
    .update(data)
    .eq('id', data.id as string);

  if (error) return { error: error.message };
  revalidatePath('/admin/appearance');
  return { success: true };
}

// ─── Feedback ────────────────────────────────────────────────

export async function getFeedbackList() {
  await requireAdmin();
  const supabase = createClient();
  const { data } = await supabase
    .from('feedback')
    .select('id, type, subject, experience_category, rating, name, email, phone, message, customer_email, order_id, would_recommend, heard_from, contact_permission, page_url, status, notified_at, created_at')
    .order('created_at', { ascending: false });
  return (data || []).map(mapFeedbackRow);
}

export async function getLatestFeedback(limit = 5) {
  await requireAdmin();
  const supabase = createClient();
  const { data } = await supabase
    .from('feedback')
    .select('id, type, subject, experience_category, rating, name, email, phone, message, customer_email, order_id, would_recommend, heard_from, contact_permission, page_url, status, notified_at, created_at')
    .order('created_at', { ascending: false })
    .limit(limit);
  return (data || []).map(mapFeedbackRow);
}

export async function getFeedbackStats() {
  await requireAdmin();
  const supabase = createClient();
  const { data } = await supabase.from('feedback').select('status, rating');
  const counts = { new: 0, read: 0, resolved: 0, total: 0 };
  let totalRating = 0;
  let ratingCount = 0;
  for (const f of data || []) {
    counts.total++;
    if (f.status in counts) counts[f.status as keyof typeof counts]++;
    if (f.rating) {
      totalRating += f.rating;
      ratingCount++;
    }
  }
  return {
    ...counts,
    avgRating: ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : null,
  };
}

export async function updateFeedbackStatus(feedbackId: string, status: string) {
  await requireAdmin();
  if (!['new', 'read', 'resolved'].includes(status)) {
    return { error: 'Invalid status' };
  }
  const supabase = createClient();
  const { error } = await supabase
    .from('feedback')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', feedbackId);
  if (error) return { error: error.message };
  revalidatePath('/admin/feedback');
  revalidatePath('/admin');
  return { success: true };
}

function mapFeedbackRow(row: Record<string, unknown>) {
  return {
    id: row.id as string,
    type: row.type as import('@/types/feedback').FeedbackType,
    subject: row.subject as string | null,
    experienceCategory: row.experience_category as string | null,
    rating: row.rating as number | null,
    name: row.name as string | null,
    email: row.email as string | null,
    phone: row.phone as string | null,
    message: row.message as string,
    customerEmail: row.customer_email as string | null,
    orderId: row.order_id as string | null,
    wouldRecommend: row.would_recommend as string | null,
    heardFrom: row.heard_from as string | null,
    contactPermission: row.contact_permission as boolean,
    pageUrl: row.page_url as string,
    status: row.status as import('@/types/feedback').FeedbackStatus,
    notifiedAt: row.notified_at as string | null,
    createdAt: row.created_at as string,
  } as import('@/types/feedback').AdminFeedback;
}

// ─── Dashboard ───────────────────────────────────────────────

export async function getDashboardCounts() {
  await requireAdmin();
  const supabase = createClient();

  const { count: products } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active');

  const { count: totalOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true });

  const { count: customers } = await supabase
    .from('customers')
    .select('*', { count: 'exact', head: true });

  const { count: unreadMessages } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'unread');

  return {
    products: products || 0,
    orders: totalOrders || 0,
    customers: customers || 0,
    unreadMessages: unreadMessages || 0,
  };
}
