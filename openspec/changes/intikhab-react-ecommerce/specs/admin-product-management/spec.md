## ADDED Requirements

### Requirement: Products table with TanStack Table
The admin products page SHALL render a TanStack Table v8 displaying all products with columns: Image (40×40px thumbnail), Product Name, SKU, Category, Price (PKR), Stock, Status (Active/Draft toggle), and Actions (Edit, Delete). The table MUST support column sorting, category filter dropdown, name search, and row selection for bulk delete.

#### Scenario: Products table renders with all products
- **WHEN** the user navigates to `/admin/products`
- **THEN** a table displays all products from the admin store with image thumbnails, names, SKUs, categories, prices, stock counts, and status toggles

#### Scenario: Category filter dropdown
- **WHEN** the user selects "Men" from the category filter dropdown
- **THEN** the table shows only products in the "men" category

#### Scenario: Status toggle updates product
- **WHEN** the user clicks the Active/Draft toggle switch on a product row
- **THEN** the product's status updates in the Zustand store and a Sonner success toast displays

#### Scenario: Delete product with confirmation
- **WHEN** the user clicks the delete icon on a product row
- **THEN** a confirmation dialog appears. If confirmed, the product is removed from the store and a Sonner toast displays "Product deleted"

### Requirement: Add/Edit product modal with Zod validation
The admin SHALL provide a modal form for adding and editing products using React Hook Form with Zod validation. The form MUST include fields: Product Name (required, min 3 chars), SKU (required, min 2 chars), Category (select: men/women/kids), Price PKR (number, min 100), Original Price PKR (optional), Stock Quantity (number, min 0), Description (textarea), Images (file upload UI with preview, max 4), Status (radio: Active/Draft).

#### Scenario: Add new product
- **WHEN** the user clicks "ADD PRODUCT" button
- **THEN** the modal opens with an empty form. On valid submission, the product is added to the store, a Sonner success toast displays, and the modal closes with AnimatePresence exit animation

#### Scenario: Edit pre-fills form
- **WHEN** the user clicks the edit icon on an existing product
- **THEN** the modal opens with all fields pre-filled with the product's current data

#### Scenario: Validation errors display
- **WHEN** the user submits the form with a product name shorter than 3 characters
- **THEN** the error "Name must be at least 3 characters" displays below the field
- **WHEN** the user submits with a price below PKR 100
- **THEN** the error "Price must be at least PKR 100" displays

#### Scenario: Image upload preview
- **WHEN** the user selects images in the file upload field
- **THEN** up to 4 image previews display in a grid within the modal
