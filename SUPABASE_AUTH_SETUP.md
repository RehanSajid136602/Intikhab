# Supabase Auth Setup Guide

Follow these steps to fully enable authentication in the Supabase dashboard.

---

## 1. Environment Variables

Ensure these are set in `.env.local` (or Vercel environment variables in production):

```
NEXT_PUBLIC_SUPABASE_URL=https://czpljoofhuslpewbjoit.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Production:**
```
NEXT_PUBLIC_SITE_URL=https://YOUR_INTIKHAB_DOMAIN_HERE
```

---

## 2. Apply the Profiles Table Migration

Run the SQL in `supabase/migrations/create_profiles.sql` in the Supabase SQL Editor:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/czpljoofhuslpewbjoit)
2. Open **SQL Editor**
3. Paste the contents of `supabase/migrations/create_profiles.sql`
4. Click **Run**

This creates:
- `public.profiles` table linked to `auth.users`
- RLS policies (users see own profile, admins see all)
- Auto-creation trigger when a new user signs up
- Auto-update trigger for `updated_at`

---

## 3. URL Configuration

Supabase Dashboard → **Authentication** → **URL Configuration**

| Setting | Value |
|---------|-------|
| Site URL | `http://localhost:3000` |
| Redirect URLs | `http://localhost:3000/auth/callback` |

**Production:**
| Setting | Value |
|---------|-------|
| Site URL | `https://YOUR_INTIKHAB_DOMAIN_HERE` |
| Redirect URLs | `https://YOUR_INTIKHAB_DOMAIN_HERE/auth/callback` |

---

## 4. Google OAuth Provider

### A. Supabase Configuration

Supabase Dashboard → **Authentication** → **Providers** → **Google**

1. Enable **Google** provider
2. Leave **Client ID** and **Client Secret** empty for now

### B. Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Go to **APIs & Services** → **Credentials**
4. Create **OAuth 2.0 Client ID** (Web application)
5. Add authorized redirect URI:
   ```
   https://czpljoofhuslpewbjoit.supabase.co/auth/v1/callback
   ```
6. Copy the **Client ID** and **Client Secret**
7. Paste them into Supabase Google provider settings

**Note:** The Supabase callback URL is always `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`

---

## 5. Phone OTP Provider

Supabase Dashboard → **Authentication** → **Providers** → **Phone**

1. Enable **Phone** provider
2. Select **SMS** as the channel (WhatsApp requires Twilio Verify)
3. Configure your SMS provider:

### Twilio (Recommended)
1. Sign up at [Twilio](https://www.twilio.com/)
2. Get a phone number with SMS capability
3. In Supabase Phone provider settings:
   - **SMS Provider:** Twilio
   - **Account SID:** From Twilio console
   - **Auth Token:** From Twilio console
   - **From Number:** Your Twilio phone number
   - **Message Template:** `Your Intikhab verification code is: {{ .Code }}`

### Vonage (Nexmo)
1. Sign up at [Vonage](https://www.vonage.com/)
2. In Supabase Phone provider settings:
   - **SMS Provider:** Vonage
   - **API Key:** From Vonage dashboard
   - **API Secret:** From Vonage dashboard
   - **From Number:** Your Vonage phone number

### TextLocal
1. Sign up at [TextLocal](https://www.textlocal.com/)
2. In Supabase Phone provider settings:
   - **SMS Provider:** TextLocal
   - **API Key:** From TextLocal dashboard
   - **Sender Name:** Your approved sender name

---

## 6. Creating an Admin User

After your first login via Google or Phone OTP, you need to manually promote your user to admin:

### Step 1: Log in via the app
Go to `/login` and sign in with your Google account or phone.

### Step 2: Find your user ID
Run this in Supabase SQL Editor:
```sql
select id, email from auth.users;
```

### Step 3: Set admin role
```sql
update public.profiles
set role = 'admin'
where email = 'your.email@example.com';
```

Or by ID:
```sql
update public.profiles
set role = 'admin'
where id = 'your-user-uuid';
```

### Step 4: Verify
```sql
select * from public.profiles where role = 'admin';
```

---

## 7. Auth Settings

Supabase Dashboard → **Authentication** → **Settings**

Recommended settings:

| Setting | Value |
|---------|-------|
| General — Site URL | `http://localhost:3000` |
| General — Redirect URLs | `http://localhost:3000/auth/callback` |
| Sessions — Session duration | `3600` (1 hour, or longer) |
| Security — Allow anyone to sign up | `On` |
| Security — Allow anonymous sign-ins | `Off` |
| SMTP — Custom SMTP (optional) | Configure for password reset emails |

---

## 8. RLS Policies

The profiles migration creates these RLS policies:

| Policy | Table | Effect |
|--------|-------|--------|
| Users can view own profile | `profiles` | `SELECT` where `auth.uid() = id` |
| Users can update own profile | `profiles` | `UPDATE` where `auth.uid() = id` |
| Admins can read all profiles | `profiles` | `SELECT` if user's role is `admin` |

For the `orders` and other business tables, add RLS policies as needed:

```sql
-- Example: users can view their own orders
create policy "Users can view own orders"
  on public.orders for select
  using (customerEmail = auth.email());
```

---

## 9. Testing the Setup

1. Start the dev server: `npm run dev`
2. Visit `/login` — should see Google and Phone options
3. Click **Continue with Google** — should redirect to Google auth
4. After auth, should land on `/account` — profile auto-created
5. Visit `/account/profile` — update your name
6. Visit `/account/orders` — shows "No orders yet" (real data when orders exist)
7. Click **Sign Out** — should redirect to `/login`
8. Test Phone OTP — enter phone, receive code, verify
9. Visit `/admin` — should redirect to `/admin/login` (not admin yet)
10. After promoting yourself to admin via SQL, visit `/admin` — should work

---

## 10. Troubleshooting

| Problem | Solution |
|---------|----------|
| Google login returns error | Check Google Cloud Console OAuth redirect URI matches Supabase callback URL exactly |
| OTP not received | Verify SMS provider is correctly configured in Supabase dashboard |
| Phone number rejected | Use international format starting with `+` (e.g., `+923001234567`) |
| `profiles` table doesn't exist | Run the SQL migration in `supabase/migrations/create_profiles.sql` |
| Profile not created after signup | Check the trigger function `handle_new_user()` exists and works |
| Middleware redirect loop | Clear browser cookies and restart dev server |
| Admin access denied after login | Ensure `profiles.role` is set to `admin` for your user |
