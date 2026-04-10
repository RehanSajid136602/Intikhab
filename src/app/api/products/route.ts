import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyAdmin } from '@/lib/supabase/auth';

/**
 * GET /api/products
 * Public: returns all active products.
 * Query params: ?category=men|women|kids, ?slug=xxx, ?limit=N, ?offset=N
 */
export async function GET(request: NextRequest) {
  const supabase = createClient();

  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category');
  const slug = searchParams.get('slug');
  const limit = searchParams.get('limit');
  const offset = searchParams.get('offset');

  let query = supabase
    .from('products')
    .select('*')
    .eq('status', 'active')
    .order('createdAt', { ascending: false });

  if (category) {
    query = query.eq('category', category);
  }

  if (slug) {
    const { data, error } = await query.eq('slug', slug).single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data ? transformProduct(data) : null);
  }

  if (limit) {
    const limitNum = parseInt(limit, 10);
    query = query.limit(limitNum);
    if (offset) {
      const offsetNum = parseInt(offset, 10);
      query = query.range(offsetNum, offsetNum + limitNum - 1);
    }
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const products = (data || []).map(transformProduct);

  return NextResponse.json(products);
}

/**
 * POST /api/products
 * Admin only: creates a new product.
 */
export async function POST(request: NextRequest) {
  const { authenticated } = await verifyAdmin(request);
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient();

  const body = await request.json();

  const productData = {
    slug: body.slug || body.name?.toLowerCase().replace(/\s+/g, '-'),
    name: body.name,
    brand: body.brand || 'Intikhab',
    category: body.category,
    price: body.price,
    originalPrice: body.originalPrice ?? null,
    images: body.images ?? [],
    badge: body.badge ?? null,
    inStock: body.inStock ?? true,
    stock: body.stock ?? 0,
    installment: body.installment ?? Math.ceil(body.price / 2),
    description: body.description ?? '',
    sku: body.sku,
    status: body.status ?? 'active',
    sizes: body.sizes ?? [],
  };

  const { data, error } = await supabase
    .from('products')
    .insert(productData)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(transformProduct(data), { status: 201 });
}

function transformProduct(row: Record<string, unknown>) {
  return {
    id: row.id as string,
    slug: row.slug as string,
    name: row.name as string,
    brand: row.brand as string,
    category: row.category as string,
    price: row.price as number,
    originalPrice: row.originalPrice as number | undefined,
    images: row.images as string[],
    badge: row.badge as 'SALE' | 'NEW' | null,
    inStock: row["inStock"] as boolean,
    stock: row.stock as number,
    installment: row.installment as number,
    description: row.description as string,
    sku: row.sku as string,
    status: row.status as 'active' | 'draft',
    sizes: row.sizes as number[],
  };
}
