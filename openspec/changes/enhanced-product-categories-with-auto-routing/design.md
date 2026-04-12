# Design: Enhanced Product Categories with Auto-Routing

## Database Schema Changes

### Updated Product Model

```prisma
model Product {
  id            String   @id @default(uuid()) @db.Uuid
  slug          String   @unique
  name          String
  brand         String   @default("Intikhab")
  
  // Hierarchical categorization
  productType   String   @default("shoes") // shoes, bags, accessories, clothing
  category      String   @default("men")   // men, women, kids, unisex
  subcategory   String?  // sneakers, formal, casual, sandals, handbags, etc.
  
  price         Int
  originalPrice Int?
  images        String[]
  badge         String?  // SALE, NEW
  inStock       Boolean  @default(true)
  
  // Flexible size stock (JSON format)
  sizeStock     Json     @default("[]") // [{size: string, stock: number, label?: string}]
  sizeSystem    String   @default("eu") // eu, uk, us, inches, cm, general
  
  installment   Int      @default(0)
  description   String   @default("")
  sku           String   @unique
  status        String   @default("active") // active, draft
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([slug])
  @@index([productType])
  @@index([category])
  @@index([subcategory])
  @@index([status])
  @@index([productType, category]) // For category page queries
  @@map("products")
}
```

### Size System Definitions

```typescript
// src/lib/sizeSystems.ts

/**
 * SHOES: Numeric EU sizes only (35-46)
 * Each size has individual quantity input
 */
export const SHOE_SIZES = {
  name: 'EU (European)',
  sizes: ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'],
  type: 'shoe',
} as const;

/**
 * OTHER PRODUCT TYPES: Various size systems
 */
export const SIZE_SYSTEMS = {
  bag: {
    name: 'Bag Size',
    sizes: ['small', 'medium', 'large', 'xl'],
    type: 'labeled',
    labels: { small: 'Small', medium: 'Medium', large: 'Large', xl: 'Extra Large' },
  },
  general: {
    name: 'General',
    sizes: ['one-size', 's', 'm', 'l', 'xl'],
    type: 'labeled',
    labels: { 'one-size': 'One Size', s: 'Small', m: 'Medium', l: 'Large', xl: 'Extra Large' },
  },
  numeric: {
    name: 'Numeric',
    sizes: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    type: 'numeric',
  },
} as const;

/**
 * Product Type Configuration
 * SHOES: Fixed EU numeric sizes (35-46) with per-size quantity
 * OTHERS: Configurable size systems
 */
export const PRODUCT_TYPE_CONFIG = {
  shoes: {
    sizeSystem: 'eu', // Fixed, cannot change
    sizeType: 'shoe', // Shows numeric inputs 35-46
    subcategories: ['sneakers', 'formal', 'casual', 'sandals', 'sports', 'boots'],
    requiresSizeQuantities: true, // Each size MUST have quantity
  },
  bags: {
    sizeSystem: 'bag',
    sizeType: 'labeled', // Shows S/M/L dropdown
    subcategories: ['handbags', 'backpacks', 'clutches', 'tote-bags', 'crossbody'],
    requiresSizeQuantities: false,
  },
  accessories: {
    sizeSystem: 'general',
    sizeType: 'labeled', // Shows one-size or S/M/L
    subcategories: ['belts', 'wallets', 'socks', 'laces', 'insoles'],
    requiresSizeQuantities: false,
  },
  clothing: {
    sizeSystem: 'general',
    sizeType: 'labeled', // Shows S/M/L/XL
    subcategories: ['t-shirts', 'shirts', 'pants', 'jackets'],
    requiresSizeQuantities: false,
  },
} as const;
```

## TypeScript Types Update

```typescript
// src/types/product.ts
export type ProductType = 'shoes' | 'bags' | 'accessories' | 'clothing';

export type Category = 'men' | 'women' | 'kids' | 'unisex';

export type SizeSystem = 'eu' | 'uk' | 'us' | 'bag' | 'general' | 'numeric';

export interface SizeStock {
  size: string;
  stock: number;
  label?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  productType: ProductType;
  category: Category;
  subcategory?: string;
  price: number;
  originalPrice?: number;
  images: string[];
  badge: ProductBadge;
  inStock: boolean;
  stock: number;
  sizeStock: SizeStock[];
  sizeSystem: SizeSystem;
  installment: number;
  description: string;
  sku: string;
  status: ProductStatus;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size: string;
  productType: ProductType;
}
```

## API Route Updates

### Products API (GET with filtering)

```typescript
// src/app/api/products/route.ts
// Query params: ?productType=shoes&category=men&subcategory=sneakers
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const productType = searchParams.get('productType');
  const category = searchParams.get('category');
  const subcategory = searchParams.get('subcategory');
  
  let query = supabase
    .from('products')
    .select('*')
    .eq('status', 'active');
    
  if (productType) query = query.eq('productType', productType);
  if (category) query = query.eq('category', category);
  if (subcategory) query = query.eq('subcategory', subcategory);
  
  // ... rest of the query
}
```

## Admin Form Design

### Shoe-Specific Required Fields

When admin selects **"shoes"** as product type:

```typescript
// Shoe-specific form schema
const shoeSchema = z.object({
  name: z.string().min(3, "Name is required"),
  sku: z.string().min(2, "SKU is required"),
  productType: z.literal('shoes'),
  category: z.enum(['men', 'women', 'kids', 'unisex']),
  subcategory: z.string().optional(),
  
  // SHOE SIZES: Required numeric fields 35-46
  size35: z.number().min(0).default(0),
  size36: z.number().min(0).default(0),
  size37: z.number().min(0).default(0),
  size38: z.number().min(0).default(0),
  size39: z.number().min(0).default(0),
  size40: z.number().min(0).default(0),
  size41: z.number().min(0).default(0),
  size42: z.number().min(0).default(0),
  size43: z.number().min(0).default(0),
  size44: z.number().min(0).default(0),
  size45: z.number().min(0).default(0),
  size46: z.number().min(0).default(0),
  
  price: z.number().min(100, "Price must be at least PKR 100"),
  originalPrice: z.number().optional(),
  description: z.string().optional(),
  status: z.enum(['active', 'draft']),
  images: z.array(z.string()).min(1, "At least 1 image required"),
});

// Validation: At least one size must have stock > 0
const validateShoeSizes = (data: ShoeFormData) => {
  const totalStock = [35,36,37,38,39,40,41,42,43,44,45,46]
    .reduce((sum, size) => sum + (data[`size${size}` as keyof ShoeFormData] as number || 0), 0);
  return totalStock > 0;
};
```

### Form Flow for Shoes

1. **Click "Add Product"** → Select **"Shoes"** as product type
2. **Required Fields Appear:**
   - Name *
   - SKU *
   - Category (men/women/kids/unisex) *
   - Subcategory (sneakers/formal/casual/sandals/sports/boots)
   - Price PKR *
   - **Shoe Sizes with Quantities** *
   - Images *
   - Description (optional)
   - Status (active/draft)

3. **Shoe Size Quantity Grid** (REQUIRED):
   ```
   Size 35: [___]  Size 36: [___]  Size 37: [___]  Size 38: [___]
   Size 39: [___]  Size 40: [___]  Size 41: [___]  Size 42: [___]
   Size 43: [___]  Size 44: [___]  Size 45: [___]  Size 46: [___]
   ```
   - Each input is a number field (0 or more)
   - At least ONE size must have quantity > 0
   - Total stock automatically calculated

4. **Routing Preview**:
   - Shows: "This shoe will appear at: /shoes/men/sneakers"
   - Updates as category/subcategory changes

### Other Product Types (Bags, Accessories)

For non-shoe products, size input is simpler:
- Bags: Select size (Small/Medium/Large/XL) with single quantity
- Accessories: "One Size" with quantity, or S/M/L options
- No required size grid — just basic stock quantity

## Routing Structure

### New Directory Structure

```
src/app/(public)/
  [productType]/
    [category]/
      page.tsx          # Category page with filtering
    page.tsx            # Product type landing page
  product/
    [slug]/
      page.tsx          # Product detail (unchanged)
```

### Dynamic Route Handler

```typescript
// src/app/(public)/[productType]/[category]/page.tsx
interface CategoryPageProps {
  params: {
    productType: string; // shoes, bags, accessories
    category: string;    // men, women, kids
  };
  searchParams: {
    subcategory?: string;
  };
}

export default async function ProductCategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { productType, category } = params;
  
  // Validate productType and category
  if (!isValidProductType(productType) || !isValidCategory(category)) {
    notFound();
  }
  
  const products = await fetchProducts({
    productType,
    category,
    subcategory: searchParams.subcategory,
  });
  
  return (
    <CategoryPageLayout
      productType={productType}
      category={category}
      subcategory={searchParams.subcategory}
      products={products}
    />
  );
}
```

## Auto-Routing Logic

### After Product Creation

```typescript
// In AddProductModal after successful creation
const getProductUrl = (product: Product): string => {
  const basePath = `/${product.productType}/${product.category}`;
  if (product.subcategory) {
    return `${basePath}?subcategory=${product.subcategory}`;
  }
  return basePath;
};

// Show success message with link
// "Product added successfully! View on /shoes/men"
```

### Redirect Options

1. **Modal Stay (default)**: Show success with "View Product" link
2. **Redirect to Category Page**: Navigate to the category page showing the new product
3. **Redirect to Product Detail**: Go directly to the new product page

## Migration Strategy

### Database Migration

```sql
-- Migration steps:
1. Add new columns to products table
2. Migrate existing data: category → productType (all 'shoes') + category (keep men/women/kids)
3. Update sizeStock format from [{size: number, stock: number}] to [{size: string, stock: number}]
4. Set default sizeSystem to 'eu' for existing products
```

### Backward Compatibility

- Existing category pages (/men, /women, /kids) redirect to /shoes/men, /shoes/women, /shoes/kids
- API routes support both old and new query parameters during transition
- Old product data continues to work with defaults

## UI Components

### New Components

1. **CascadingSelect** - Dropdown that updates options based on parent selection
2. **SizeStockInput** - Dynamic size/stock input based on size system
3. **RoutingPreview** - Shows where product will appear
4. **SubcategoryFilter** - Filter pills for subcategories on category pages

### Updated Components

1. **AddProductModal** - New cascading category flow
2. **CategoryPageLayout** - Support for product type and subcategory filtering
3. **ProductsTable** - Show product type and subcategory columns
4. **ProductCard** - Display subcategory badge
