## ADDED Requirements

### Requirement: Order creation endpoint validates stock
The `POST /api/orders` endpoint SHALL validate stock availability for all items before creating an order. If validation fails, it SHALL return a 400 status with a JSON body containing an `error` field and a `insufficientStockItems` array listing each problematic item with its `productId`, `name`, `requestedQuantity`, and `availableStock`.

#### Scenario: Order creation succeeds with valid stock
- **WHEN** a POST request to `/api/orders` contains items all with sufficient stock
- **THEN** the order is created, stock is deducted, and a 201 response with order details is returned

#### Scenario: Order creation fails with insufficient stock
- **WHEN** a POST request to `/api/orders` contains an item with quantity exceeding available stock
- **THEN** the endpoint returns 400 with `{ "error": "Insufficient stock", "insufficientStockItems": [...] }` and no order is created
