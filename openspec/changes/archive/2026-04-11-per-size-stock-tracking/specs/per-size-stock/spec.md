## ADDED Requirements

### Requirement: Product stores stock per individual size
The Product model SHALL store stock quantity per size using a `sizeStock` field (JSON array of `{size, stock}` objects). The total `stock` field SHALL equal the sum of all `sizeStock` quantities.

#### Scenario: Product with multiple sizes has per-size stock
- **WHEN** a product has sizes 38, 39, 40 with stock 10, 15, 5 respectively
- **THEN** `sizeStock` is `[{size:38,stock:10},{size:39,stock:15},{size:40,stock:5}]` and `stock` is 30

#### Scenario: Product with zero stock on a specific size
- **WHEN** a product has `sizeStock` `[{size:38,stock:5},{size:39,stock:0}]`
- **THEN** `stock` is 5 and size 39 is considered unavailable

### Requirement: Stock deduction deducts from the specific size
When an order is created, the system SHALL deduct quantity from the specific size's stock within `sizeStock`, not just from the product total. If the size does not exist or has insufficient stock, the order SHALL be rejected.

#### Scenario: Deducting stock from a specific size
- **WHEN** an order is placed for 2 units of size 38 (current sizeStock: `[{size:38,stock:10},{size:39,stock:15}]`)
- **THEN** `sizeStock` becomes `[{size:38,stock:8},{size:39,stock:15}]` and `stock` becomes 23

#### Scenario: Deducting stock when size has insufficient quantity
- **WHEN** an order is placed for 3 units of size 39 (current sizeStock: `[{size:39,stock:1}]`)
- **THEN** the order is rejected with an insufficient stock error for that specific size

#### Scenario: Deducting stock when size does not exist
- **WHEN** an order is placed for size 42 but the product only has sizes 38, 39, 40
- **THEN** the order is rejected with an error stating the size is unavailable

### Requirement: Migration distributes existing stock equally across sizes
When migrating from the old `sizes Int[]` schema to `sizeStock Json`, the system SHALL distribute the existing `stock` value as equally as possible across all sizes, with the remainder added to the first size.

#### Scenario: Migrating a product with stock=50 and 6 sizes
- **WHEN** a product has `stock=50` and `sizes=[35,36,37,38,39,40]`
- **THEN** `sizeStock` becomes `[{size:35,stock:9},{size:36,stock:8},{size:37,stock:8},{size:38,stock:8},{size:39,stock:8},{size:40,stock:8}]` (50/6=8 remainder 2, distributed to first sizes)

### Requirement: Order items capture the selected size
Every `OrderItem` SHALL store the `size` of the product that was ordered. This ensures order history accurately reflects which sizes were sold.

#### Scenario: Order item includes size
- **WHEN** a customer orders 2 units of "Blue Sneaker" in size 38
- **THEN** the order item record contains `productId`, `name`, `image`, `quantity:2`, `price`, and `size:38`
