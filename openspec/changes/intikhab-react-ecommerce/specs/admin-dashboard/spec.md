## ADDED Requirements

### Requirement: Dashboard displays stats cards
The admin dashboard SHALL render 4 stats cards: Total Revenue (PKR 847,500, +18%), Total Orders (243, +12%), Products Sold (412 pairs, +8%), and Active Customers (189, +5%). Each card MUST display a title, value, change percentage with up/down arrow, and a Lucide icon with colored background.

#### Scenario: Stats cards render with mock data
- **WHEN** the user navigates to `/admin`
- **THEN** 4 stats cards render with the values from `data/admin.ts` mock data

#### Scenario: Change indicator shows direction
- **WHEN** a stat has a positive change
- **THEN** a green upward arrow renders next to the percentage
- **WHEN** a stat has a negative change
- **THEN** a red downward arrow renders

### Requirement: Revenue chart renders with Recharts
The dashboard SHALL render an AreaChart using Recharts showing the last 7 days of revenue. The chart MUST have a date range selector (7D | 30D | 90D) that updates the displayed data.

#### Scenario: Chart renders with 7-day data
- **WHEN** the user views the dashboard
- **THEN** an AreaChart displays 7 data points (Mon–Sun) with revenue in PKR, area fill from #E53935 to transparent

#### Scenario: Date range selector updates data
- **WHEN** the user clicks "30D"
- **THEN** the chart re-renders with 30 days of mock data
- **WHEN** the user clicks "90D"
- **THEN** the chart re-renders with 90 days of mock data

### Requirement: Recent orders table with TanStack Table
The dashboard SHALL render a TanStack Table v8 showing the 15 most recent mock orders. The table MUST support column sorting (click header), global search, and pagination (10 per page).

#### Scenario: Orders table renders with data
- **WHEN** the user views the dashboard
- **THEN** a table displays with columns: Order ID, Customer Name, Products, Total (PKR), Status, Date, Actions

#### Scenario: Column sorting
- **WHEN** the user clicks a column header
- **THEN** the table sorts by that column in ascending order. Clicking again reverses to descending

#### Scenario: Global search filters orders
- **WHEN** the user types in the search input above the table
- **THEN** the table filters rows to show only orders matching the search text across all columns

#### Scenario: Status badge colors
- **WHEN** an order has status "Pending"
- **THEN** the status renders as a yellow badge
- **WHEN** status is "Processing" → blue badge
- **WHEN** status is "Shipped" → purple badge
- **WHEN** status is "Delivered" → green badge

#### Scenario: Pagination
- **WHEN** there are more than 10 orders
- **THEN** the table shows pagination controls. Page 1 shows the first 10 orders, page 2 shows the remaining
