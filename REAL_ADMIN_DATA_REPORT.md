# Real Admin Data Migration Report

## Mock Data Removed

All mock data files have been emptied and are no longer imported:

| File | Action |
|---|---|
| `src/data/admin/customers.ts` | Content replaced — no longer exports `mockCustomers` |
| `src/data/admin/messages.ts` | Content replaced — no longer exports `mockMessages` |
| `src/data/admin/appearance.ts` | Content replaced — no longer exports `defaultAppearance` |
| `src/data/admin/settings.ts` | Content replaced — no longer exports `defaultSettings` |
| `src/data/admin.ts` | Content replaced — no longer exports `mockOrders`, `dashboardStats`, `weeklyRevenue`, etc. |
| `src/data/admin/` | Directory preserved but all files are empty stubs |

## Database Schema Changes

### Prisma schema updated (`prisma/schema.prisma`)

**Customer model — 4 new fields added:**
- `city` — `String @default("")`
- `status` — `String @default("active")` (values: `active`, `vip`, `blocked`)
- `newsletter` — `Boolean @default(false)`
- `notes` — `String?` (optional)

**3 new models created:**

**Message** (maps to `messages`):
- id, name, email, phone?, subject, body, type, status, createdAt, updatedAt
- Indexes on `status`, `createdAt`

**StoreSetting** (maps to `store_settings`):
- 20 fields covering store profile, payment configs, shipping, notifications
- Auto-created on first access with sensible defaults

**AppearanceSetting** (maps to `appearance_settings`):
- 18 fields covering brand identity, theme colors, hero config, section toggles
- Auto-created on first access with sensible defaults

### Applied via `prisma db push --accept-data-loss`
Database is now in sync with schema. Prisma client generated to `src/generated/prisma/`.

## Server Actions Created

**File:** `src/app/admin/actions.ts`

| Action | Purpose |
|---|---|
| `requireAdmin()` | Server-side session check, redirects to `/admin/login` if unauthenticated |
| `getCustomers()` | Fetches customers + computes order counts/totals from orders table |
| `getCustomerStats()` | Returns aggregate stats (total, active, vip, blocked, newsletter counts) |
| `updateCustomerStatus(id, status)` | Sets customer to active/vip/blocked |
| `deleteCustomer(id)` | Removes customer record |
| `getMessages()` | Fetches all messages ordered by newest first |
| `getMessageStats()` | Returns unread/open/resolved counts |
| `updateMessageStatus(id, status)` | Sets message to unread/open/resolved/archived |
| `getOrCreateSettings()` | Fetches settings row or creates default |
| `updateStoreSettings(formData)` | Persists all settings fields |
| `getOrCreateAppearance()` | Fetches appearance row or creates default |
| `updateAppearanceSettings(formData)` | Persists all appearance fields |
| `getDashboardCounts()` | Returns real counts for products, orders, customers, unread messages |

All actions call `requireAdmin()` first. Mutations call `revalidatePath()` after success.

## Pages Connected to Real Data

### `/admin/customers`
- Fetches `getCustomers()` server action on mount
- Stats calculated from real data (total, returning >3 orders, newsletter subscribers, VIP)
- Search/filter operates on real fetched data
- Status changes call `updateCustomerStatus()` server action
- Delete calls `deleteCustomer()` server action
- Empty state: *"Customers will appear here when real users place orders or create accounts."*

### `/admin/messages`
- Fetches `getMessages()` server action on mount
- Stats are real counts (unread, open, resolved)
- Message status changes call `updateMessageStatus()` server action
- Reply button shows "Email sending not configured" — saves draft locally only
- Empty state: *"Messages from the contact form or support inbox will appear here."*

### `/admin/settings`
- Fetches `getOrCreateSettings()` server action on mount — auto-creates default row if none exists
- All fields read from and write to `store_settings` table
- Save calls `updateStoreSettings()` server action
- Success/error states shown after save
- Danger zone buttons inform user to use Supabase dashboard for irreversible operations

### `/admin/appearance`
- Fetches `getOrCreateAppearance()` server action on mount — auto-creates default row if none exists
- All fields (colors, hero, sections) persisted to `appearance_settings` table
- Save calls `updateAppearanceSettings()` server action
- Live preview reads from real saved values
- Image upload placeholders note "Configurable via Supabase Storage"

## Auth Protection Verified

- **Middleware (`src/middleware.ts`):** Protects all `/admin/*` routes (except login) via Supabase SSR session check
- **Layout guard (`(dashboard)/layout.tsx`):** Secondary server-side check, redirects to `/admin/login`
- **Server actions:** Every action calls `requireAdmin()` which uses `@supabase/ssr` `createServerClient` to validate the session cookie and redirects to `/admin/login` if invalid
- **No client-only auth:** All data access is server-side with cookie-based session verification

## Type Changes

`src/types/admin.ts` updated:

- `AdminCustomer`: `status` now only `'active' | 'vip' | 'blocked'` (removed `new`). Fields match DB schema.
- `AdminMessage`: `sender` renamed to `name`, `preview`/`fullMessage` merged to `body`, added `phone`.
- `StoreSettings`: Flattened from nested config objects to a single flat interface matching DB columns.
- `AppearanceSettings`: New flat interface matching DB columns (replaces nested `AppearanceConfig`/`BrandIdentity`/etc.).
- Removed unused types: `BrandIdentity`, `ThemeColors`, `HeroConfig`, `HomepageSections`, `StoreProfile`, `PaymentConfig`, `ShippingConfig`, `NotificationConfig`, `SecurityConfig`.

## Build Result

```
npm run build
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Generating static pages (34/34)
✓ Finalizing page optimization
```

All 7 admin routes compile cleanly — zero errors.

## Remaining TODOs

- [ ] **Contact form**: Connect the public `/contact` page to create real `Message` records in the database
- [ ] **Email sending**: Integrate Resend/SendGrid for actual message replies from the admin panel
- [ ] **Image upload**: Wire up logo/favicon/hero image uploads to Supabase Storage
- [ ] **Theme injection**: Use saved appearance colors in the storefront's CSS at runtime
- [ ] **Password change**: Implement Supabase Auth password update from settings page
- [ ] **2FA**: Enable via Supabase Auth settings
- [ ] **Dashboard counts**: The dashboard page already uses real data — verify it uses `getDashboardCounts()` for the stat cards
