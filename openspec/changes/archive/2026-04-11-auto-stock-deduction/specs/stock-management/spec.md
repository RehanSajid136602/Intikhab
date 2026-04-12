## ADDED Requirements

### Requirement: Stock validation before order creation
The system SHALL validate that sufficient stock exists for every item in an order before the order is created. If any item has insufficient stock, the order creation SHALL be rejected with a 400 status code and a detailed error response listing each item that failed validation, including the requested quantity and available stock.

#### Scenario: All items have sufficient stock
- **WHEN** a checkout request contains items whose quantities are all less than or equal to their available stock
- **THEN** stock validation passes and order creation proceeds

#### Scenario: One item has insufficient stock
- **WHEN** a checkout request includes an item with quantity greater than its available stock
- **THEN** the system returns a 400 error with the item name, requested quantity, and available stock

#### Scenario: Multiple items have insufficient stock
- **WHEN** a checkout request includes multiple items where two or more have insufficient stock
- **THEN** the system returns a 400 error listing ALL items that failed validation with their respective quantities and available stock

#### Scenario: Item is completely out of stock (stock = 0)
- **WHEN** a checkout request includes an item with stock of 0
- **THEN** the system returns a 400 error stating the item is out of stock

### Requirement: Automatic stock deduction on successful order
The system SHALL deduct the ordered quantity from each product's `stock` field immediately after an order is successfully created. The deduction SHALL occur within the same database transaction as the order creation to ensure atomicity.

#### Scenario: Single item order deducts correct quantity
- **WHEN** an order is created for 2 units of product A (stock was 10)
- **THEN** product A's stock becomes 8

#### Scenario: Multi-item order deducts all quantities
- **WHEN** an order is created with 1 unit of product A (stock 10) and 3 units of product B (stock 5)
- **THEN** product A's stock becomes 9 and product B's stock becomes 2

#### Scenario: Stock deduction is atomic with order creation
- **WHEN** stock deduction fails after order insertion (e.g., database error)
- **THEN** the entire transaction is rolled back and no order is created

### Requirement: Auto-update inStock flag when stock reaches zero
The system SHALL automatically set the `inStock` field to `false` on any product whose `stock` reaches 0 after a stock deduction. Products with `inStock = false` SHALL NOT appear as available for purchase on the storefront.

#### Scenario: Stock reaches zero
- **WHEN** a product's stock is 1 and an order deducts 1 unit
- **THEN** the product's stock becomes 0 AND `inStock` is set to `false`

#### Scenario: Stock remains above zero
- **WHEN** a product's stock is 10 and an order deducts 3 units
- **THEN** the product's stock becomes 7 AND `inStock` remains `true`

### Requirement: Concurrent order handling with row-level locking
The system SHALL use PostgreSQL row-level locking (`SELECT ... FOR UPDATE`) on product rows during the stock validation and deduction phase to prevent race conditions when multiple orders for the same product are placed simultaneously.

#### Scenario: Two simultaneous orders for the last item
- **WHEN** two checkout requests simultaneously attempt to order the last unit of a product (stock = 1)
- **THEN** one order succeeds (stock becomes 0) and the other fails with an insufficient stock error

#### Scenario: Orders for different products proceed independently
- **WHEN** two checkout requests simultaneously order different products
- **THEN** both orders succeed without blocking each other
