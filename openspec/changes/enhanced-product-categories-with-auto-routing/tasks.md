# Tasks: Enhanced Product Categories with Auto-Routing

## Phase 1: Database & Types (Foundation)

### Task 1.1: Update Prisma Schema
**Priority:** High | **Estimated:** 30 min
- [x] Add `productType` field (String, default: "shoes")
- [x] Add `subcategory` field (String?, optional)
- [x] Update `sizeStock` JSON structure to use string sizes
- [x] Add `sizeSystem` field (String, default: "eu")
- [x] Add database indexes for productType, subcategory, composite index on (productType, category)
- [ ] Generate and apply migration

**Files:**
- `prisma/schema.prisma`

### Task 1.2: Update TypeScript Types
**Priority:** High | **Estimated:** 20 min
- [x] Add `ProductType` type: 'shoes' | 'bags' | 'accessories' | 'clothing'
- [x] Update `Category` type to include 'unisex'
- [x] Add `SizeSystem` type: 'eu' | 'uk' | 'us' | 'bag' | 'general' | 'numeric'
- [x] Update `SizeStock` interface to use string size
- [x] Update `Product` interface with new fields
- [x] Update `CartItem` to include productType and use string size

**Files:**
- `src/types/product.ts`

### Task 1.3: Create Size System Configuration
**Priority:** High | **Estimated:** 30 min
- [x] Create `src/lib/sizeSystems.ts`
- [x] Define `SHOE_SIZES` constant with EU sizes 35-46 (numeric, required for shoes)
- [x] Define `SIZE_SYSTEMS` for other product types (bags: S/M/L, accessories: one-size, etc.)
- [x] Define `PRODUCT_TYPE_CONFIG`:
  - `shoes`: Fixed `sizeSystem: 'eu'`, `sizeType: 'shoe'`, `requiresSizeQuantities: true`
  - Other types: Configurable size systems, no required size grid
- [x] Add helper functions:
  - `getShoeSizes()` — Returns [35, 36, 37, ..., 46]
  - `getProductTypeConfig(type: ProductType)`
  - `getSubcategories(productType: ProductType)`
  - `requiresSizeQuantities(productType: ProductType)` — Returns true for shoes

**Files:**
- `src/lib/sizeSystems.ts` (new)

---

## Phase 2: API Layer (Backend)

### Task 2.1: Update Products API Route
**Priority:** High | **Estimated:** 45 min
- [x] Update GET handler to support productType, subcategory query params
- [x] Update POST handler to accept new fields
- [x] Update product transformation function for new sizeStock format
- [x] Add validation for productType/category/subcategory combinations

**Files:**
- `src/app/api/products/route.ts`

### Task 2.2: Update Individual Product API
**Priority:** Medium | **Estimated:** 30 min
- [x] Update GET by ID to include new fields
- [x] Update PUT handler to accept and validate new fields
- [x] Update DELETE handler (no changes needed, verify still works)

**Files:**
- `src/app/api/products/[id]/route.ts`

### Task 2.3: Update Orders API
**Priority:** Medium | **Estimated:** 20 min
- [x] Verify order creation works with new CartItem size format (string)
- [x] Update OrderItem to store size as string

**Files:**
- `src/app/api/orders/route.ts`
- `prisma/schema.prisma` (OrderItem model)

---

## Phase 3: Admin Panel Updates (Critical)

### Task 3.1: Create CascadingSelect Component
**Priority:** High | **Estimated:** 45 min
- [x] Create `src/components/admin/CascadingSelect.tsx`
- [x] Accepts parent value, options map, onChange
- [x] Updates child options when parent changes
- [x] Shows loading state during transitions

**Files:**
- `src/components/admin/CascadingSelect.tsx` (new)

### Task 3.2: Create ShoeSizeStockInput Component
**Priority:** High | **Estimated:** 60 min
- [x] Create `src/components/admin/ShoeSizeStockInput.tsx` (shoe-specific)
- [x] Shows 12 numeric input fields: Size 35 through Size 46
- [x] Each field accepts quantity (0 or more)
- [x] Validates at least ONE size has quantity > 0
- [x] Shows total stock count
- [x] Create separate `GeneralSizeStockInput.tsx` for bags/accessories (S/M/L dropdown)

**Files:**
- `src/components/admin/ShoeSizeStockInput.tsx` (new)
- `src/components/admin/GeneralSizeStockInput.tsx` (new)

### Task 3.3: Update AddProductModal Form Schema (Shoe-Specific)
**Priority:** High | **Estimated:** 30 min
- [x] Update Zod schema with new fields (productType, subcategory)
- [x] **For Shoes:** Add individual size fields (size35, size36, ..., size46) as numbers
- [x] Add validation: At least one shoe size must have quantity > 0
- [x] Add custom error message: "Please enter stock for at least one shoe size"
- [x] Keep existing validation for Name, SKU, Price as required

**Files:**
- `src/components/admin/AddProductModal.tsx` (schema section)

### Task 3.4: Update AddProductModal UI Flow (Shoe-Specific)
**Priority:** High | **Estimated:** 90 min
- [x] Add "Product Type" dropdown at top (shoes, bags, accessories, clothing)
- [x] **When "Shoes" selected:**
  - Show required fields: Name, SKU, Category, Price
  - Show **ShoeSizeStockInput** component (Size 35-46 quantity grid)
  - Validate at least one size has quantity > 0 before submit
  - Show "Total Stock: X units" calculation
- [x] When other product type selected: Show GeneralSizeStockInput (S/M/L or one-size)
- [x] Add Subcategory dropdown (sneakers/formal/casual/etc. for shoes)
- [x] Add Routing Preview: "This shoe will appear at: /shoes/men/sneakers"
- [x] Disable submit until all required fields filled (including at least one shoe size)

**Files:**
- `src/components/admin/AddProductModal.tsx`

### Task 3.5: Update ProductsTable
**Priority:** Medium | **Estimated:** 30 min
- [x] Add Product Type column
- [x] Add Subcategory column
- [x] Add Size System column
- [x] Update filtering to support new fields

**Files:**
- `src/components/admin/ProductsTable.tsx`

---

## Phase 4: Frontend Category Pages

### Task 4.1: Create New Category Route Structure
**Priority:** High | **Estimated:** 45 min
- [x] Create `src/app/(public)/[productType]/[category]/page.tsx`
- [x] Validate productType and category parameters
- [x] Fetch products with filtering
- [x] Handle subcategory query parameter
- [x] Render CategoryPageLayout with new props

**Files:**
- `src/app/(public)/[productType]/[category]/page.tsx` (new)

### Task 4.2: Create Product Type Landing Page
**Priority:** Medium | **Estimated:** 30 min
- [x] Create `src/app/(public)/[productType]/page.tsx`
- [x] Shows overview of product type
- [x] Links to gender categories
- [x] Shows featured products across all genders

**Files:**
- `src/app/(public)/[productType]/page.tsx` (new)

### Task 4.3: Update CategoryPageLayout
**Priority:** High | **Estimated:** 45 min
- [x] Accept productType, category, subcategory props
- [x] Add subcategory filter pills
- [x] Update metadata generation
- [x] Update hero section with product type + category context

**Files:**
- `src/components/category/CategoryPageLayout.tsx`

### Task 4.4: Add Backward Compatibility Redirects
**Priority:** Medium | **Estimated:** 30 min
- [x] Update existing /men, /women, /kids pages to redirect to /shoes/[category]
- [x] Keep old routes functional during transition

**Files:**
- `src/app/(public)/men/page.tsx`
- `src/app/(public)/women/page.tsx`
- `src/app/(public)/kids/page.tsx`

---

## Phase 5: Cart & Checkout Updates

### Task 5.1: Update Cart Store
**Priority:** High | **Estimated:** 30 min
- [x] Update CartItem to use string size
- [x] Update addItem to accept size as string
- [x] Update cart sync to include productType

**Files:**
- `src/stores/cartStore.ts`

### Task 5.2: Update Product Detail Page Size Selection
**Priority:** High | **Estimated:** 30 min
- [x] Update size selector to handle string sizes
- [x] Show size labels based on product's sizeSystem
- [x] Pass size as string to cart

**Files:**
- `src/components/products/SizeSelector.tsx` or equivalent

### Task 5.3: Update Checkout Flow
**Priority:** Medium | **Estimated:** 20 min
- [x] Verify checkout displays size correctly
- [x] Update order summary to show product type/subcategory

**Files:**
- `src/app/(public)/checkout/page.tsx`
- Related checkout components

---

## Phase 6: Data Migration & Seeding

### Task 6.1: Create Migration Script
**Priority:** High | **Estimated:** 45 min
- [x] Create script to migrate existing products:
  - Set productType = 'shoes' for all existing
  - Keep existing category (men/women/kids)
  - Convert sizeStock numbers to strings
  - Set sizeSystem = 'eu' for all existing
- [ ] Run migration on development database (pending Prisma migration)
- [ ] Verify data integrity

**Files:**
- `prisma/migrate-categories.ts` (new, temporary)

### Task 6.2: Update Seed Data
**Priority:** Low | **Estimated:** 20 min
- [x] Update `prisma/seed.ts` with new fields
- [x] Add sample bags and accessories for testing

**Files:**
- `prisma/seed.ts`
- `src/data/products.ts`

---

## Phase 7: Navigation & Links

### Task 7.1: Update Navigation Data
**Priority:** Medium | **Estimated:** 30 min
- [x] Update `src/data/navigation.ts` mainNavItems
- [x] Add product type dropdown structure
- [x] Update links to use new /[productType]/[category] format

**Files:**
- `src/data/navigation.ts`

### Task 7.2: Update Footer Links
**Priority:** Low | **Estimated:** 15 min
- [x] Update collection links in footer

**Files:**
- `src/data/navigation.ts` (footerLinks)

---

## Phase 8: Testing & QA

### Task 8.1: Test Admin Product Creation
**Priority:** High | **Estimated:** 30 min
- [ ] Test creating shoe product with EU sizes
- [ ] Test creating bag product with size labels
- [ ] Test creating accessory with one-size
- [ ] Verify routing preview shows correct URL
- [ ] Verify product appears on correct category page

### Task 8.2: Test Category Pages
**Priority:** High | **Estimated:** 30 min
- [ ] Test /shoes/men shows only men's shoes
- [ ] Test /bags/women shows only women's bags
- [ ] Test subcategory filtering works
- [ ] Test invalid routes return 404

### Task 8.3: Test Cart & Checkout
**Priority:** High | **Estimated:** 20 min
- [ ] Add different product types to cart
- [ ] Verify sizes display correctly
- [ ] Complete checkout flow
- [ ] Verify order saves correctly

---

## Phase 9: Documentation & Cleanup

### Task 9.1: Update PROJECT_SUMMARY.md
**Priority:** Low | **Estimated:** 15 min
- [x] Document new category hierarchy
- [x] Update key files list
- [x] Update risk areas if needed

**Files:**
- `PROJECT_SUMMARY.md`

### Task 9.2: Clean Up Temporary Files
**Priority:** Low | **Estimated:** 10 min
- [x] Remove migration script
- [x] Verify no console.log statements left

---

## Summary

**Total Estimated Time:** ~14 hours
**Phases:** 9
**Critical Path:** Tasks 1.1 → 1.2 → 1.3 → 2.1 → 3.1 → 3.2 → 3.3 → 3.4 → 4.1 → 5.1 → 5.2 → 6.1

**Key Decisions:**
- String-based sizes (not numbers) for flexibility across product types
- SizeSystem field determines how sizes are displayed and validated
- Subcategories are predefined per product type (not free-form)
- Existing routes redirect to new structure for backward compatibility
