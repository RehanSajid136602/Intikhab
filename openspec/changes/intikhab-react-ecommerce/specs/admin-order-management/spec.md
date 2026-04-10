## ADDED Requirements

### Requirement: Orders table with status filters
The admin orders page SHALL render a full TanStack Table v8 displaying all 15 mock orders with columns: Order ID, Customer Name, Products, Total (PKR), Status, Date, Actions. The table MUST have status filter tabs (All | Pending | Processing | Shipped | Delivered) and a date range filter (two date inputs).

#### Scenario: Orders table renders all orders
- **WHEN** the user navigates to `/admin/orders`
- **THEN** a table displays all 15 mock orders with full details

#### Scenario: Status filter tabs
- **WHEN** the user clicks the "Pending" tab
- **THEN** the table filters to show only orders with "Pending" status
- **WHEN** the user clicks "All"
- **THEN** all orders are displayed

#### Scenario: Date range filter
- **WHEN** the user sets a start and end date in the date range inputs
- **THEN** the table filters to show only orders within that date range

### Requirement: Order detail modal
Clicking an order row SHALL open a modal displaying the customer's information, ordered items with product images, total breakdown, a status update dropdown, and a save button.

#### Scenario: View order details
- **WHEN** the user clicks the View button on an order row
- **THEN** a modal opens showing: customer name, email, shipping address, list of ordered items with images and prices, order total, current status, and date

#### Scenario: Update order status
- **WHEN** the user selects a new status from the dropdown and clicks Save
- **THEN** the order's status updates in the Zustand store, the modal closes, and a Sonner success toast displays "Order status updated"

### Requirement: Export button placeholder
The orders page SHALL have an "EXPORT" button that displays a "Coming Soon" Sonner toast when clicked.

#### Scenario: Export click
- **WHEN** the user clicks the EXPORT button
- **THEN** a Sonner toast displays "Export feature coming soon!"
