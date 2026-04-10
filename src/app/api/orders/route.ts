import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyAdmin } from '@/lib/supabase/auth';

/**
 * POST /api/orders
 * Creates a new order (guest checkout — no auth required).
 * Expects: { customerName, customerEmail, phone, shippingAddress, province, city, paymentMethod, orderNotes, items: [{ productId, name, image, quantity, price }], total }
 */
export async function POST(request: NextRequest) {
  const supabase = createClient();
  const body = await request.json();

  const {
    customerName,
    customerEmail,
    phone,
    shippingAddress,
    province,
    city,
    paymentMethod,
    orderNotes,
    items,
    total,
  } = body;

  console.log('Order payload:', JSON.stringify(body, null, 2));

  if (!customerEmail || !items || !total) {
    console.error('Missing required fields:', { customerEmail: !!customerEmail, items: !!items, total });
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Generate order ID: INK-XXXXX format
  const orderId = `INK-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  // Create or update customer
  const { error: customerError } = await supabase
    .from('customers')
    .upsert(
      {
        id: crypto.randomUUID(),
        email: customerEmail,
        phone: phone || '',
        fullName: customerName || '',
        lastOrderAt: new Date().toISOString(),
      },
      { onConflict: 'email' },
    );

  if (customerError) {
    console.error('Customer upsert error:', customerError);
    return NextResponse.json({ error: customerError.message }, { status: 400 });
  }

  // Create order
  const { data: orderData, error: orderError } = await supabase.from('orders').insert({
    id: orderId,
    customerEmail: customerEmail,
    customerName: customerName || '',
    shippingAddress: shippingAddress,
    province: province || '',
    city: city || '',
    phone: phone || '',
    paymentMethod: paymentMethod || 'cod',
    orderNotes: orderNotes || null,
    total,
    status: 'Pending',
  });

  if (orderError) {
    console.error('Order insert error:', orderError);
    return NextResponse.json({ error: orderError.message }, { status: 400 });
  }

  // Create order items
  const orderItems = items.map((item: Record<string, unknown>) => ({
    id: crypto.randomUUID(),
    orderId: orderId,
    productId: item.productId as string,
    name: item.name as string,
    image: item.image as string,
    quantity: item.quantity as number,
    price: item.price as number,
  }));

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

  if (itemsError) {
    console.error('Order items insert error:', itemsError);
    return NextResponse.json({ error: itemsError.message }, { status: 400 });
  }

  return NextResponse.json({
    id: orderId,
    customerName,
    customerEmail,
    shippingAddress,
    province,
    city,
    phone,
    paymentMethod,
    orderNotes,
    items,
    total,
    status: 'Pending',
    date: new Date().toISOString().split('T')[0],
  });
}

/**
 * GET /api/orders
 * Admin only: returns all orders with pagination.
 * Query params: ?limit=N, ?offset=N, ?status=Pending|Processing|Shipped|Delivered
 */
export async function GET(request: NextRequest) {
  const { authenticated } = await verifyAdmin(request);
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient();

  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get('limit') || '50', 10);
  const offset = parseInt(searchParams.get('offset') || '0', 10);
  const status = searchParams.get('status');

  let query = supabase
    .from('orders')
    .select('*')
    .order('createdAt', { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) {
    query = query.eq('status', status);
  }

  const { data: orders, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Fetch order items for each order
  const orderIds = orders.map((o) => o.id);
  const { data: orderItems } = await supabase
    .from('order_items')
    .select('*')
    .in('orderId', orderIds);

  // Group items by order
  const itemsByOrder: Record<string, unknown[]> = {};
  orderItems?.forEach((item) => {
    if (!itemsByOrder[item.orderId]) {
      itemsByOrder[item.orderId] = [];
    }
    itemsByOrder[item.orderId].push({
      productId: item.productId,
      name: item.name,
      image: item.image,
      quantity: item.quantity,
      price: item.price,
    });
  });

  const formattedOrders = orders.map((order) => ({
    id: order.id,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    shippingAddress: order.shippingAddress,
    city: order.city,
    phone: order.phone,
    paymentMethod: order.paymentMethod,
    orderNotes: order.orderNotes,
    items: itemsByOrder[order.orderId] || [],
    total: order.total,
    status: order.status,
    date: new Date(order.createdAt).toISOString().split('T')[0],
  }));

  return NextResponse.json(formattedOrders);
}
