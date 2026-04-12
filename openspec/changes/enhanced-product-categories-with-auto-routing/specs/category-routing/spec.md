## ADDED Requirements

### Requirement: Dynamic routing supports product type and category URL structure
The system SHALL support dynamic URLs in the format `/[productType]/[category]` (e.g., `/shoes/men`, `/bags/women`) and optional subcategory filtering via query parameter `?subcategory=sneakers`. Product detail pages SHALL remain at `/product/[slug]`.

#### Scenario: Category page loads for valid product type and category
- **WHEN** a user navigates to `/shoes/men`
- **THEN** the page displays all active men's shoes filtered from the database

#### Scenario: Subcategory filtering works via query parameter
- **WHEN** a user navigates to `/shoes/men?subcategory=sneakers`
- **THEN** the page displays only men's sneakers

#### Scenario: Product type landing page shows all genders
- **WHEN** a user navigates to `/shoes`
- **THEN** the page shows an overview with links to `/shoes/men`, `/shoes/women`, `/shoes/kids`

### Requirement: Invalid product type or category returns 404
The system SHALL validate that `productType` and `category` in the URL are valid values using `isValidProductType()` and `isValidCategory()` functions. Invalid combinations (e.g., `/fragrances/men`, `/shoes/aliens`) SHALL return a 404 response.

#### Scenario: Invalid product type returns 404
- **WHEN** a user navigates to `/fragrances/men` (not a valid product type)
- **THEN** the system returns a 404 page

#### Scenario: Invalid category returns 404
- **WHEN** a user navigates to `/shoes/aliens` (not a valid category)
- **THEN** the system returns a 404 page

### Requirement: Old category routes redirect to new structure
The existing routes `/men`, `/women`, and `/kids` SHALL return 301 redirects to `/shoes/men`, `/shoes/women`, and `/shoes/kids` respectively. This preserves SEO rankings and existing bookmarks.

#### Scenario: Old men's route redirects
- **WHEN** a user navigates to `/men`
- **THEN** the system returns a 301 redirect to `/shoes/men`

#### Scenario: Old women's route redirects
- **WHEN** a user navigates to `/women`
- **THEN** the system returns a 301 redirect to `/shoes/women`

### Requirement: Category pages have unique SEO metadata
Each category page SHALL have dynamically generated metadata including a unique title, description, and Open Graph tags. The title SHALL follow the pattern `"{Category} {Product Type} | Intikhab"` (e.g., "Men's Sneakers | Intikhab") and the description SHALL summarize the product category.

#### Scenario: Category page has unique title
- **WHEN** the `/shoes/men/sneakers` page is loaded
- **THEN** the page title is "Men's Sneakers | Intikhab"

#### Scenario: Category page has Open Graph tags
- **WHEN** the `/bags/women` page is loaded
- **THEN** the page includes Open Graph meta tags with the category name and site branding

### Requirement: Slug generation includes product type for uniqueness
Product slugs SHALL be generated in the format `{productType}-{name-slug}` (e.g., `shoes-black-sneaker`, `bags-classic-tote`). When a slug collision is detected, a numeric suffix SHALL be appended (e.g., `shoes-black-sneaker-2`).

#### Scenario: Slug is unique across product types
- **WHEN** two products have the same name "Classic" but different types (shoe vs bag)
- **THEN** their slugs are `shoes-classic` and `bags-classic` — no collision

#### Scenario: Duplicate slug gets numeric suffix
- **WHEN** an admin creates a second shoe named "Black Sneaker"
- **THEN** its slug becomes `shoes-black-sneaker-2`
