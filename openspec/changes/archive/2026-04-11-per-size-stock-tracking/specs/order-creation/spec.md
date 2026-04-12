## ADDED Requirements

### Requirement: Order creation validates per-size stock and captures size in order items
The `POST /api/orders` endpoint SHALL pass the selected size for each item to the `create_order_with_stock_deduction` database function. The function SHALL validate that the size exists and has sufficient stock, deduct from that specific size's stock, and store the size in the `order_items` record. The response for insufficient stock SHALL include the `size` that failed validation.

#### Scenario: Order creation succeeds with per-size stock
- **WHEN** a POST request to `/api/orders` contains items with `productId`, `name`, `image`, `quantity`, `price`, and `size` fields, and each size has sufficient stock
- **THEN** the order is created, stock is deducted from the specific sizes, and a 201 response with order details is returned

#### Scenario: Order creation fails when size is unavailable
- **WHEN** a POST request includes an item with a size that has zero stock or does not exist in the product's `sizeStock`
- **THEN** the endpoint returns 400 with `{ "error": "Insufficient stock", "insufficientStockItems": [{ "productId", "name", "size", "requestedQuantity", "availableStock" }] }` and no order is created
