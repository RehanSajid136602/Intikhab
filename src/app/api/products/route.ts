import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { verifyAdmin } from "@/lib/supabase/auth";
import { PRODUCT_TYPE_CONFIG } from "@/lib/sizeSystems";
import type { ProductType } from "@/types/product";

/**
 * GET /api/products
 * Public: returns all active products.
 * Query params: ?productType=shoes|bags|accessories, ?category=men|women|kids|unisex,
 *                ?subcategory=sneakers|formal, ?slug=xxx, ?limit=N, ?offset=N
 */
export async function GET(request: NextRequest) {
  const supabase = createClient();

  const searchParams = request.nextUrl.searchParams;
  const productType = searchParams.get("productType");
  const category = searchParams.get("category");
  const subcategory = searchParams.get("subcategory");
  const slug = searchParams.get("slug");
  const limit = searchParams.get("limit");
  const offset = searchParams.get("offset");

  let query = supabase
    .from("products")
    .select("*")
    .eq("status", "active")
    .order("createdAt", { ascending: false });

  if (productType) {
    query = query.eq("productType", productType);
  }

  if (category) {
    query = query.eq("category", category);
  }

  if (subcategory) {
    query = query.eq("subcategory", subcategory);
  }

  if (slug) {
    const { data, error } = await query.eq("slug", slug).single();
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
 * Validates that subcategory is valid for the given product type.
 */
function validateSubcategory(
  productType: ProductType,
  subcategory?: string,
): boolean {
  if (!subcategory) return true; // Subcategory is optional
  const validSubcategories = PRODUCT_TYPE_CONFIG[
    productType as keyof typeof PRODUCT_TYPE_CONFIG
  ].subcategories as readonly string[];
  return validSubcategories.includes(subcategory);
}

/**
 * POST /api/products
 * Admin only: creates a new product.
 */
export async function POST(request: NextRequest) {
  const { authenticated } = await verifyAdmin(request);
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient();

  const body = await request.json();

  // Validate product type
  const productType = body.productType || "shoes";
  const validProductTypes: ProductType[] = [
    "shoes",
    "bags",
    "accessories",
    "clothing",
  ];
  if (!validProductTypes.includes(productType)) {
    return NextResponse.json(
      {
        error: `Invalid productType: ${productType}. Must be one of: ${validProductTypes.join(", ")}`,
      },
      { status: 400 },
    );
  }

  // Validate subcategory if provided
  if (body.subcategory && !validateSubcategory(productType, body.subcategory)) {
    const validSubcategories =
      PRODUCT_TYPE_CONFIG[productType as keyof typeof PRODUCT_TYPE_CONFIG]
        .subcategories;
    return NextResponse.json(
      {
        error: `Invalid subcategory "${body.subcategory}" for productType "${productType}". Must be one of: ${validSubcategories.join(", ")}`,
      },
      { status: 400 },
    );
  }

  const productData = {
    slug: body.slug || body.name?.toLowerCase().replace(/\s+/g, "-"),
    name: body.name,
    brand: body.brand || "Intikhab",
    productType,
    category: body.category || "men",
    subcategory: body.subcategory ?? null,
    price: body.price,
    originalPrice: body.originalPrice ?? null,
    images: body.images ?? [],
    badge: body.badge ?? null,
    inStock: body.inStock ?? true,
    stock: body.stock ?? 0,
    sizeStock: body.sizeStock ?? [],
    sizeSystem:
      body.sizeSystem ||
      PRODUCT_TYPE_CONFIG[productType as keyof typeof PRODUCT_TYPE_CONFIG]
        .sizeSystem,
    installment: body.installment ?? Math.ceil(body.price / 2),
    description: body.description ?? "",
    sku: body.sku,
    status: body.status ?? "active",
  };

  const { data, error } = await supabase
    .from("products")
    .insert(productData)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Revalidate homepage and all category pages so new products appear immediately
  revalidatePath("/");
  revalidatePath("/men");
  revalidatePath("/women");
  revalidatePath("/kids");
  revalidatePath("/shoes");
  revalidatePath("/bags");
  revalidatePath("/accessories");
  revalidatePath("/clothing");
  revalidatePath("/shoes/men");
  revalidatePath("/shoes/women");
  revalidatePath("/shoes/kids");
  revalidatePath("/bags/men");
  revalidatePath("/bags/women");
  revalidatePath("/bags/kids");
  revalidatePath("/accessories/men");
  revalidatePath("/accessories/women");
  revalidatePath("/accessories/kids");
  revalidatePath("/clothing/men");
  revalidatePath("/clothing/women");
  revalidatePath("/clothing/kids");

  return NextResponse.json(transformProduct(data), { status: 201 });
}

function transformProduct(row: Record<string, unknown>) {
  return {
    id: row.id as string,
    slug: row.slug as string,
    name: row.name as string,
    brand: row.brand as string,
    productType: row.productType as
      | "shoes"
      | "bags"
      | "accessories"
      | "clothing",
    category: row.category as "men" | "women" | "kids" | "unisex",
    subcategory: row.subcategory as string | undefined,
    price: row.price as number,
    originalPrice: row.originalPrice as number | undefined,
    images: row.images as string[],
    badge: row.badge as "SALE" | "NEW" | null,
    inStock: row["inStock"] as boolean,
    stock: row.stock as number,
    installment: row.installment as number,
    description: row.description as string,
    sku: row.sku as string,
    status: row.status as "active" | "draft",
    sizeStock:
      (row["sizeStock"] as { size: string; stock: number; label?: string }[]) ||
      [],
    sizeSystem: row.sizeSystem as
      | "eu"
      | "uk"
      | "us"
      | "bag"
      | "general"
      | "numeric",
    createdAt: row["createdAt"] as string,
  };
}
