## ADDED Requirements

### Requirement: Admin form supports cascading product type selection
The admin product form SHALL display a "Product Type" dropdown as the first field (shoes, bags, accessories, clothing, fragrances). Selecting a product type SHALL dynamically update the available subcategories and the size input component shown below.

#### Scenario: Admin selects shoes as product type
- **WHEN** the admin selects "Shoes" in the Product Type dropdown
- **THEN** the subcategory dropdown shows shoe-specific options (sneakers, formal, casual, sandals, sports, boots) and the ShoeSizeStockInput component appears

#### Scenario: Admin selects bags as product type
- **WHEN** the admin selects "Bags" in the Product Type dropdown
- **THEN** the subcategory dropdown shows bag-specific options (handbags, backpacks, clutches, tote-bags, crossbody) and the GeneralSizeStockInput component appears

### Requirement: Shoe products require per-size quantity input
When the product type is "shoes", the form SHALL display a grid of 12 numeric input fields for EU sizes 35 through 46, each accepting a quantity (0 or more). At least ONE size MUST have a quantity greater than 0 for the form to be submittable. The total stock SHALL be automatically calculated and displayed.

#### Scenario: Admin enters quantities for shoe sizes
- **WHEN** the admin fills in Size 38: 10, Size 39: 8, Size 40: 5, and leaves all others at 0
- **THEN** the total stock displays "Total Stock: 23 units" and the form is submittable

#### Scenario: Admin attempts to submit shoe with all sizes at zero
- **WHEN** all 12 shoe size fields are 0 and the admin clicks Save
- **THEN** the form shows the error "Please enter stock for at least one shoe size" and submission is blocked

### Requirement: Non-shoe products use simplified size input
When the product type is NOT shoes, the form SHALL display a GeneralSizeStockInput component that offers a dropdown of size labels (Small/Medium/Large for bags, One Size/S/M/L for accessories) with a single quantity field for the selected size. Per-size quantity grids are NOT shown for non-shoe products.

#### Scenario: Admin adds a bag with S/M/L sizing
- **WHEN** the admin selects "Bags" and chooses the bag size system
- **THEN** a dropdown shows Small, Medium, Large, XL options and the admin selects one size with a quantity

#### Scenario: Admin adds an accessory with one size
- **WHEN** the admin selects "Accessories"
- **THEN** the form shows a "One Size" option with a single quantity field

### Requirement: Admin form shows routing preview
The form SHALL display a live routing preview that updates as the admin changes Product Type, Category, and Subcategory selections. The preview SHALL show the full URL path where the product will appear (e.g., "This product will appear at: /shoes/men/sneakers").

#### Scenario: Routing preview updates on category change
- **WHEN** the admin has selected shoes → men → sneakers
- **THEN** the preview shows "This product will appear at: /shoes/men/sneakers"

#### Scenario: Routing preview handles missing subcategory
- **WHEN** the admin selects shoes → women but leaves subcategory blank
- **THEN** the preview shows "This product will appear at: /shoes/women"

### Requirement: Admin modal accommodates expanded form layout
The AddProductModal SHALL have a maximum width of `max-w-4xl` (or be converted to a multi-step form) to accommodate the cascading selects, 12-field shoe size grid, routing preview, and image upload area without visual cramping or overflow.

#### Scenario: Modal displays full shoe form without overflow
- **WHEN** the admin opens the modal and selects "Shoes"
- **THEN** all form fields are visible within the modal without horizontal scrolling or content clipping

### Requirement: Edit flow pre-populates cascading selects and converts sizes
When editing an existing product, the form SHALL pre-populate the Product Type, Category, and Subcategory dropdowns based on the product's stored values. Existing numeric sizes SHALL be converted to strings and mapped to the new 35-46 grid, with any sizes outside this range (e.g., 35-40 legacy data) shown with their existing stock and sizes 41-46 defaulting to 0.

#### Scenario: Admin edits existing shoe product
- **WHEN** the admin opens the edit modal for a shoe with sizes 35-40 (legacy data)
- **THEN** Product Type pre-selects "Shoes", Category pre-selects the stored value, the size grid shows stock for sizes 35-40, and sizes 41-46 show 0

#### Scenario: Admin edits existing bag product
- **WHEN** the admin opens the edit modal for a bag with `sizeSystem: 'bag'`
- **THEN** Product Type pre-selects "Bags" and the GeneralSizeStockInput shows the stored size selection
