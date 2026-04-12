## ADDED Requirements

### Requirement: Product model supports hierarchical categorization
The Product model SHALL store a three-level category hierarchy: `productType` (e.g., shoes, bags, accessories), `category` (men, women, kids, unisex), and optional `subcategory` (sneakers, formal, handbags, etc.). The `productType` SHALL default to `'shoes'` for backward compatibility with existing products.

#### Scenario: New shoe product is created with full hierarchy
- **WHEN** an admin creates a new product with `productType: 'shoes'`, `category: 'men'`, `subcategory: 'sneakers'`
- **THEN** the product is stored with all three levels and appears on the `/shoes/men` category page

#### Scenario: Existing product is migrated to new schema
- **WHEN** the migration runs on existing products that only have `category`
- **THEN** all products get `productType = 'shoes'`, `category` is preserved, `subcategory` is null, and `sizeSystem = 'eu'`

### Requirement: Product model supports flexible size systems
The Product model SHALL store `sizeStock` as a JSON array of `{size: string, stock: number}` entries (string sizes, not integers) to support non-numeric sizes like "S", "M", "L", "One Size". The `sizeSystem` field SHALL indicate which size system is used (eu, uk, us, bag, general, numeric).

#### Scenario: Shoe product stores EU numeric sizes as strings
- **WHEN** a shoe product has sizes 35-46
- **THEN** `sizeStock` contains entries like `{size: "35", stock: 10}, {size: "36", stock: 8}, ...` and `sizeSystem` is `'eu'`

#### Scenario: Bag product stores labeled sizes
- **WHEN** a bag product uses the bag size system
- **THEN** `sizeStock` contains entries like `{size: "small", stock: 5}, {size: "medium", stock: 3}` and `sizeSystem` is `'bag'`

#### Scenario: Accessory product uses one-size
- **WHEN** an accessory product has no meaningful size variation
- **THEN** `sizeStock` contains a single entry `{size: "one-size", stock: 20}` and `sizeSystem` is `'general'`

### Requirement: Cart model supports string sizes and multiple sizes per product
The Cart model SHALL store `size` as `String?` (not `Int?`) and the unique constraint SHALL be on `(customerEmail, productId, size)` instead of `(customerEmail, productId)`. This allows a user to add the same product in different sizes to their cart simultaneously.

#### Scenario: User adds same product in two different sizes
- **WHEN** a user adds "Black Sneaker" size 36 and then adds "Black Sneaker" size 38
- **THEN** both items exist as separate cart entries with quantities tracked independently

#### Scenario: Existing cart data is migrated from integer to string sizes
- **WHEN** the migration runs on existing cart records
- **THEN** all `size` values are converted from integers to strings (e.g., `37` → `"37"`)

### Requirement: OrderItem model stores size as string
The OrderItem model SHALL store `size` as `String` (not `Int`) to preserve the ordered size as a string value. This ensures order history accurately reflects sizes like "S", "M", "One Size" alongside numeric sizes.

#### Scenario: Order item records the ordered size
- **WHEN** a customer orders "Black Sneaker" in size 38
- **THEN** the order item record contains `size: "38"` (string, not integer)

#### Scenario: Existing order data is migrated from integer to string sizes
- **WHEN** the migration runs on existing order item records
- **THEN** all `size` values are converted from integers to strings (e.g., `37` → `"37"`)

### Requirement: Product type and size system are validated
The system SHALL validate that `productType` is one of the predefined values (`'shoes' | 'bags' | 'accessories' | 'clothing' | 'fragrances'`). The `sizeSystem` SHALL be set automatically based on `productType` and SHALL NOT be manually editable by the admin. Shoes SHALL always use `sizeSystem = 'eu'`.

#### Scenario: Invalid product type is rejected
- **WHEN** an API request attempts to create a product with `productType: 'electronics'`
- **THEN** the request is rejected with a 400 error stating the product type is invalid

#### Scenario: Shoe product always uses EU size system
- **WHEN** an admin creates a shoe product
- **THEN** `sizeSystem` is automatically set to `'eu'` and cannot be changed
