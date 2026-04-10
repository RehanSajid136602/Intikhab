import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyAdmin } from '@/lib/supabase/auth';

/**
 * GET /api/orders/[id]
 * Returns a single order by ID.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const supabase = createClient();
  const orderId = params.id;

  // Fetch order
  const { data: order, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single();

  if (error || !order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  // Fetch order items
  const { data: items } = await supabase
    .from('order_items')
    .select('*')
    .eq('orderId', orderId);

  const formattedOrder = {
    id: order.id,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    shippingAddress: order.shippingAddress,
    city: order.city,
    phone: order.phone,
    items: (items || []).map((item) => ({
      productId: item.productId,
      name: item.name,
      image: item.image,
      quantity: item.quantity,
      price: item.price,
    })),
    total: order.total,
    status: order.status,
    date: new Date(order.createdAt).toISOString().split('T')[0],
  };

  return NextResponse.json(formattedOrder);
}

/**
 * PUT /api/orders/[id]
 * Admin only: updates order status.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { authenticated } = await verifyAdmin(request);
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient();
  const body = await request.json();

  const updateData: Record<string, unknown> = {};
  if (body.status !== undefined) updateData.status = body.status;

  const { data, error } = await supabase
    .from('orders')
    .update(updateData)
    .eq('id', params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({
    id: data.id,
    customerName: data.customerName,
    customerEmail: data.customerEmail,
    shippingAddress: data.shippingAddress,
    total: data.total,
    status: data.status,
    date: new Date(data.createdAt).toISOString().split('T')[0],
  });
}
