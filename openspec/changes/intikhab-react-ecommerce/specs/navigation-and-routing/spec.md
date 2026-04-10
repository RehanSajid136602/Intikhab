## ADDED Requirements

### Requirement: Sticky navbar with mega dropdowns
The main navigation bar SHALL be sticky (`top-0`), render on a white background with a subtle shadow, and contain the logo (centered on desktop), nav links with mega dropdown menus, search/account/wishlist/cart icons, and a mobile hamburger toggle.

#### Scenario: Navbar sticks to top on scroll
- **WHEN** the user scrolls down the homepage
- **THEN** the navbar remains fixed at the top of the viewport with a shadow effect

#### Scenario: Mega dropdown opens on hover
- **WHEN** the user hovers over a nav item with a dropdown (e.g., WOMEN, MEN, KIDS)
- **THEN** a dropdown menu appears below with subcategory links, with a 0.2s ease transition (opacity 0→1, translateY 10px→0)

#### Scenario: Mobile hamburger opens drawer
- **WHEN** the user clicks the hamburger menu icon on mobile (viewport < 768px)
- **THEN** a full-screen slide-in menu opens from the left with all nav links listed vertically and a close (×) button

### Requirement: Search bar overlay
Clicking the search icon in the navbar SHALL toggle a search input field that slides down below the main nav row. The search input MUST have a search icon button and focus on open.

#### Scenario: Search opens on click
- **WHEN** the user clicks the search icon in the navbar
- **THEN** a search input field appears below the nav links with auto-focus

#### Scenario: Search closes on icon re-click
- **WHEN** the user clicks the search icon again while search is open
- **THEN** the search input field hides

### Requirement: Next.js App Router routing
The application SHALL use Next.js 14 App Router with the following route structure: `/` (homepage), `/admin` (admin dashboard layout), `/admin/products` (products page), `/admin/orders` (orders page), and `not-found.tsx` (404 page). Each route MUST have its own `page.tsx` file.

#### Scenario: Homepage route
- **WHEN** the user navigates to `/`
- **THEN** the homepage layout renders with the full site nav, all 12 sections, and footer

#### Scenario: Admin route
- **WHEN** the user navigates to `/admin`
- **THEN** the admin layout renders with its own sidebar and topbar (not the main site's nav/footer)

#### Scenario: 404 page
- **WHEN** the user navigates to a non-existent route
- **THEN** a custom 404 page renders with a "Back to Home" link

### Requirement: Footer with 5-column layout
The footer SHALL render a 5-column grid on desktop (2-column on mobile) with sections: Get In Touch (contact info + social links), Quick Links (About, Careers, Blog, Press), Help (FAQ, Shipping, Returns, Size Guide), Collections (Men, Women, Kids, Bags), and Legal (Privacy Policy, Terms, Cookie Policy). Below the columns, a payment methods row and copyright line MUST render.

#### Scenario: Footer renders on all pages
- **WHEN** the user views the homepage
- **THEN** the footer renders at the bottom with all 5 columns, social media icons (Facebook, Instagram, X, YouTube), payment method icons, and copyright text

#### Scenario: Footer links are clickable
- **WHEN** the user clicks any footer link
- **THEN** the link navigates to the corresponding route (or displays "Coming Soon" toast for unimplemented routes)
