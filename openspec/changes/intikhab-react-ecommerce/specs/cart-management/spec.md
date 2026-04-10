## ADDED Requirements

### Requirement: Cart store manages items with Zustand
The system SHALL maintain a Zustand store (`cartStore`) that tracks cart items, total price, total item count, and drawer open/close state. The store MUST expose: `items`, `isOpen`, `addItem`, `removeItem`, `updateQuantity`, `clearCart`, `toggleCart`, `totalItems`, `totalPrice`.

#### Scenario: Add item to cart
- **WHEN** a user clicks "ADD TO CART" on a product card
- **THEN** the product is added to the cart store with quantity 1, `totalItems` increments by 1, and `totalPrice` increases by the product's price

#### Scenario: Update item quantity
- **WHEN** a user clicks the + or − button on a cart item
- **THEN** the item's quantity updates, `totalItems` and `totalPrice` recalculate accordingly. Quantity MUST NOT go below 1

#### Scenario: Remove item from cart
- **WHEN** a user clicks the remove button on a cart item
- **THEN** the item is removed from the store, `totalItems` and `totalPrice` decrease accordingly

#### Scenario: Clear entire cart
- **WHEN** the clear cart action is triggered
- **THEN** all items are removed, `totalItems` and `totalPrice` reset to 0

### Requirement: Cart drawer slides in from right
The cart drawer SHALL be a fixed-position sidebar that slides in from the right (x: "100%" → "0%") with a dark overlay behind it. It MUST use Framer Motion `AnimatePresence` for mount/unmount transitions.

#### Scenario: Open cart drawer
- **WHEN** the user clicks the cart icon in the navbar
- **THEN** the drawer slides in from the right with a dark semi-transparent overlay covering the rest of the page

#### Scenario: Close cart drawer
- **WHEN** the user clicks the overlay or the close button in the drawer
- **THEN** the drawer slides out to the right and the overlay fades out

### Requirement: Navbar shows live cart badge
The navbar cart icon SHALL display a live badge showing the current `totalItems` count. The badge MUST be a small circle with `bg-brand-red`, white text, positioned at the top-right of the cart icon.

#### Scenario: Badge updates when item added
- **WHEN** a user adds a product to the cart
- **THEN** the navbar cart badge updates to show the new count immediately

#### Scenario: Badge hides when cart is empty
- **WHEN** `totalItems` is 0
- **THEN** the badge is not rendered (hidden)

### Requirement: Cart drawer shows items with controls
The cart drawer SHALL display each cart item with a 40×40px thumbnail image, product name, price, quantity controls (− 1 +), and a remove button. Below all items, it MUST show the subtotal and a "PROCEED TO CHECKOUT" button.

#### Scenario: Cart displays items correctly
- **WHEN** the cart has 2 or more items
- **THEN** each item renders on its own row with image, name, price, quantity controls, and remove button

#### Scenario: Empty cart state
- **WHEN** the cart has 0 items
- **THEN** an empty state illustration renders with "Your cart is empty" text and a "Shop Now" button that closes the drawer

#### Scenario: Checkout button action
- **WHEN** the user clicks "PROCEED TO CHECKOUT"
- **THEN** a Sonner toast notification displays "Checkout coming soon!" (placeholder for future integration)
