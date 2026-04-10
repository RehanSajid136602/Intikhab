## ADDED Requirements

### Requirement: Homepage sections render pixel-perfect from approved HTML
The system SHALL render all 12 homepage sections in the exact order, layout, colors, spacing, typography, and copy text as defined in `index.html`. Each section MUST match the approved design at 375px, 768px, and 1440px viewport widths.

#### Scenario: All 12 sections render in correct order
- **WHEN** the user navigates to the homepage (`/`)
- **THEN** the page renders in this exact order: (1) AnnouncementBar, (2) UtilityBar, (3) Navbar, (4) HeroSlider, (5) GenderTabs + product carousel, (6) CategoryMosaic, (7) NewCollection + product carousel, (8) CollectionMosaic, (9) InstaFeed, (10) TrustBadges, (11) Newsletter, (12) Footer

#### Scenario: Colors match design tokens
- **WHEN** any section is rendered
- **THEN** all colors use the Tailwind design tokens extracted from `index.html`: `bg-brand-red` (#E53935), `bg-brand-dark` (#1A1A1A), `text-brand-gray` (#6B7280), `border-brand-light` (#E8E8E8), `bg-brand-green` (#2ECC71), `bg-brand-light-gray` (#F7F7F7)

#### Scenario: Typography matches Poppins font family
- **WHEN** any text element is rendered
- **THEN** the font family is Poppins (loaded via `next/font/google`) with the exact font weight used in the HTML (300/light, 400/regular, 500/medium, 600/semibold, 700/bold)

### Requirement: Hero slider auto-advances with controls
The hero slider SHALL display 3 slides with auto-advance every 5 seconds, previous/next arrow buttons, dot indicators, and fade transitions between slides. The first slide's image MUST have `priority={true}` for LCP optimization.

#### Scenario: Auto-advance every 5 seconds
- **WHEN** the user views the hero slider without interaction
- **THEN** slides transition from slide 0 → 1 → 2 → 0 with a 5000ms interval using opacity fade (0.8s ease-in-out)

#### Scenario: Arrow navigation changes slides
- **WHEN** the user clicks the left arrow button
- **THEN** the slider transitions to the previous slide (wrapping from 0 to 2)
- **WHEN** the user clicks the right arrow button
- **THEN** the slider transitions to the next slide (wrapping from 2 to 0)

#### Scenario: Dot navigation changes slides
- **WHEN** the user clicks a dot indicator
- **THEN** the slider transitions to the corresponding slide and the active dot receives full opacity styling

### Requirement: Product tabs switch content
The GenderTabs section and NewCollection section SHALL each have MEN/WOMEN/KIDS tab buttons that switch the displayed product grid. The active tab MUST have a `border-b-2 border-brand-dark` underline and dark text color.

#### Scenario: Default tab shows men's products
- **WHEN** the user views the GenderTabs section
- **THEN** the MEN tab is active by default and displays 4 men's product cards

#### Scenario: Clicking women tab shows women's products
- **WHEN** the user clicks the WOMEN tab button
- **THEN** the MEN tab becomes inactive, WOMEN tab becomes active with underline, and 4 women's product cards are displayed

#### Scenario: Clicking kids tab shows placeholder
- **WHEN** the user clicks the KIDS tab button
- **THEN** 4 "Coming Soon" placeholder cards are displayed with reduced opacity

### Requirement: Category mosaic uses CSS grid layout
The CategoryMosaic and CollectionMosaic sections SHALL render 5-cell CSS grid layouts with hover effects (image scale 1.05, dark overlay fade-in, "SHOP NOW →" text reveal).

#### Scenario: Category cell hover effect
- **WHEN** the user hovers over a category mosaic cell
- **THEN** the image scales to 1.05x, a black/15 opacity overlay fades in, and "SHOP NOW →" text appears at the bottom

### Requirement: Framer Motion entrance animations on every section
Every homepage section SHALL have a Framer Motion entrance animation using `useInView` with `once: true`. Sections MUST fade up (y: 40 → 0, opacity: 0 → 1) when scrolled into view.

#### Scenario: Section reveals on scroll
- **WHEN** the user scrolls down and a section enters the viewport
- **THEN** the section animates from y: 40, opacity: 0 to y: 0, opacity: 1 with a 0.6s duration

#### Scenario: Product cards stagger reveal
- **WHEN** a product grid section becomes visible
- **THEN** each product card animates in with a 0.1s stagger delay (card 1: 0s, card 2: 0.1s, card 3: 0.2s, card 4: 0.3s)

### Requirement: Newsletter form validates email
The Newsletter section SHALL include an email input field with HTML5 validation and a submit button. On successful submission, a success message SHALL be displayed.

#### Scenario: Email validation
- **WHEN** the user submits the newsletter form with an invalid email
- **THEN** the browser shows a validation error and the form does not submit
- **WHEN** the user submits with a valid email
- **THEN** a "Thank you for subscribing!" message is displayed

### Requirement: Announcement bar is dismissible
The announcement bar SHALL have a close (×) button that permanently hides the bar for the current session.

#### Scenario: Dismiss announcement
- **WHEN** the user clicks the × button on the announcement bar
- **THEN** the bar is removed from the DOM and does not reappear during the session
