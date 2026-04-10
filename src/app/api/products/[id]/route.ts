import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyAdmin } from '@/lib/supabase/auth';

/**
 * PUT /api/products/[id]
 * Admin only: updates a product by ID.
 */
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { authenticated } = await verifyAdmin(request);
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient();

  const body = await request.json();
  const id = params.id;

  console.log('PUT product update:', id, JSON.stringify(body));

  const updateData: Record<string, unknown> = {};
  if (body.name !== undefined) updateData.name = body.name;
  // Skip slug updates to avoid unique constraint violations
  // if (body.slug !== undefined) updateData.slug = body.slug;
  if (body.brand !== undefined) updateData.brand = body.brand;
  if (body.category !== undefined) updateData.category = body.category;
  if (body.price !== undefined) updateData.price = body.price;
  if (body.originalPrice !== undefined) updateData.originalPrice = body.originalPrice;
  if (body.images !== undefined) updateData.images = body.images;
  if (body.badge !== undefined) updateData.badge = body.badge;
  if (body.inStock !== undefined) updateData["inStock"] = body.inStock;
  if (body.stock !== undefined) updateData.stock = body.stock;
  if (body.installment !== undefined) updateData.installment = body.installment;
  if (body.description !== undefined) updateData.description = body.description;
  if (body.sku !== undefined) updateData.sku = body.sku;
  if (body.status !== undefined) updateData.status = body.status;
  if (body.sizes !== undefined) updateData.sizes = body.sizes;

  const { data, error } = await supabase
    .from('products')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Product update error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(transformProduct(data));
}

/**
 * DELETE /api/products/[id]
 * Admin only: soft-deletes a product by setting status=draft.
 */
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const { authenticated } = await verifyAdmin(request);
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient();

  const { error } = await supabase
    .from('products')
    .update({ status: 'draft' })
    .eq('id', params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
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
