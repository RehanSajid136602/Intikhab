## ADDED Requirements

### Requirement: Size selection is mandatory before adding to cart
The product detail page SHALL require the customer to select a size before the "Add to Cart" or "Buy Now" buttons are enabled. Sizes with zero stock SHALL be visually disabled and unselectable.

#### Scenario: Customer attempts to add to cart without selecting a size
- **WHEN** the customer clicks "Add to Cart" without selecting a size
- **THEN** a prompt appears asking the customer to select a size and the item is NOT added to cart

#### Scenario: Customer selects a size with available stock
- **WHEN** the customer clicks on size 38 which has stock > 0
- **THEN** the size is visually highlighted and the "Add to Cart" button becomes enabled

#### Scenario: Size with zero stock is displayed as unavailable
- **WHEN** a product has `sizeStock` `[{size:38,stock:5},{size:39,stock:0}]`
- **THEN** size 39 is shown with a strikethrough or grayed-out style and cannot be selected

#### Scenario: Customer selects a size and adds to cart
- **WHEN** the customer selects size 38 and clicks "Add to Cart"
- **THEN** a cart item is created with `size: 38` included in the cart entry

### Requirement: Cart displays the selected size for each item
Each cart item in the cart drawer and checkout page SHALL display the selected size alongside the product name and quantity.

#### Scenario: Cart item shows size
- **WHEN** a product with size 38 is in the cart
- **THEN** the cart displays "Blue Sneaker — Size: 38" with quantity and price

### Requirement: Cart validates size stock before checkout
When the checkout page loads, the system SHALL verify that each cart item's selected size still has available stock in the database. If a size is out of stock, the customer SHALL be notified and prevented from completing checkout until the cart is updated.

#### Scenario: Cart item size is still available
- **WHEN** the checkout page loads and the cart item's size has stock > 0
- **THEN** checkout proceeds normally

#### Scenario: Cart item size is out of stock
- **WHEN** the checkout page loads and the cart item's size has stock = 0
- **THEN** an error message is shown and the "Place Order" button is disabled until the item is removed or quantity adjusted
