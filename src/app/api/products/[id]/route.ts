import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { verifyAdmin } from "@/lib/supabase/auth";
import { PRODUCT_TYPE_CONFIG } from "@/lib/sizeSystems";
import type { ProductType } from "@/types/product";
import { transformProduct } from "@/lib/transformers";

/**
 * GET /api/products/[id]
 * Public: returns a product by ID.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const supabase = createClient();
  const id = params.id;

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(transformProduct(data));
}

/**
 * Validates that subcategory is valid for the given product type.
 */
function validateSubcategory(
  productType: ProductType,
  subcategory?: string,
): boolean {
  if (!subcategory) return true;
  const validSubcategories = PRODUCT_TYPE_CONFIG[
    productType as keyof typeof PRODUCT_TYPE_CONFIG
  ].subcategories as readonly string[];
  return validSubcategories.includes(subcategory);
}

/**
 * PUT /api/products/[id]
 * Admin only: updates a product by ID.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { authenticated } = await verifyAdmin(request);
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient();

  const body = await request.json();
  const id = params.id;

  console.log("PUT product update:", id, JSON.stringify(body));

  // Validate product type if provided
  if (body.productType !== undefined) {
    const validProductTypes: ProductType[] = [
      "shoes",
      "bags",
      "accessories",
      "clothing",
    ];
    if (!validProductTypes.includes(body.productType)) {
      return NextResponse.json(
        {
          error: `Invalid productType: ${body.productType}. Must be one of: ${validProductTypes.join(", ")}`,
        },
        { status: 400 },
      );
    }
  }

  // Validate subcategory if provided
  if (body.subcategory !== undefined && body.productType !== undefined) {
    if (!validateSubcategory(body.productType, body.subcategory)) {
      const validSubcategories =
        PRODUCT_TYPE_CONFIG[
          body.productType as keyof typeof PRODUCT_TYPE_CONFIG
        ].subcategories;
      return NextResponse.json(
        {
          error: `Invalid subcategory "${body.subcategory}" for productType "${body.productType}". Must be one of: ${validSubcategories.join(", ")}`,
        },
        { status: 400 },
      );
    }
  }

  const updateData: Record<string, unknown> = {};
  if (body.name !== undefined) updateData.name = body.name;
  if (body.brand !== undefined) updateData.brand = body.brand;
  if (body.productType !== undefined) updateData.productType = body.productType;
  if (body.category !== undefined) updateData.category = body.category;
  if (body.subcategory !== undefined) updateData.subcategory = body.subcategory;
  if (body.price !== undefined) updateData.price = body.price;
  if (body.originalPrice !== undefined)
    updateData.originalPrice = body.originalPrice;
  if (body.images !== undefined) updateData.images = body.images;
  if (body.badge !== undefined) updateData.badge = body.badge;
  if (body.inStock !== undefined) updateData["inStock"] = body.inStock;
  if (body.stock !== undefined) updateData.stock = body.stock;
  if (body.installment !== undefined) updateData.installment = body.installment;
  if (body.description !== undefined) updateData.description = body.description;
  if (body.sku !== undefined) updateData.sku = body.sku;
  if (body.status !== undefined) updateData.status = body.status;
  if (body.sizeStock !== undefined) updateData["sizeStock"] = body.sizeStock;
  if (body.sizeSystem !== undefined) updateData.sizeSystem = body.sizeSystem;

  const { data, error } = await supabase
    .from("products")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Product update error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  revalidateProductPaths();

  return NextResponse.json(transformProduct(data));
}

/**
 * DELETE /api/products/[id]
 * Admin only: soft-deletes a product by setting status=draft.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { authenticated } = await verifyAdmin(request);
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient();

  const { error } = await supabase
    .from("products")
    .update({ status: "draft" })
    .eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  revalidateProductPaths();

  return NextResponse.json({ success: true });
}

function revalidateProductPaths() {
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
}


