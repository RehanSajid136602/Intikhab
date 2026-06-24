# Auth0 Setup Guide

Follow these steps to complete the Auth0 integration.

---

## 1. Environment Variables

Add these to `.env.local`:

```
APP_BASE_URL=http://localhost:3000
AUTH0_DOMAIN=dev-hxfdn6ezd2i0sit2.us.auth0.com
AUTH0_CLIENT_ID=XctCDbGXrUJVljF6VJPDESieTYj5FHKD
AUTH0_CLIENT_SECRET=<get-from-auth0-dashboard>
AUTH0_SECRET=<generate-see-below>
ADMIN_EMAILS=your@email.com
```

### Generate AUTH0_SECRET

Run this in your terminal:

```bash
openssl rand -hex 32
```

Copy the output and set it as `AUTH0_SECRET` in `.env.local`.

---

## 2. Auth0 Dashboard Configuration

Go to [Auth0 Dashboard](https://manage.auth0.com) → Applications → Applications → your app.

### Application Settings

| Setting | Value |
|---------|-------|
| Application Type | Regular Web Application |
| Token Endpoint Auth Method | client_secret_post |

### Application URIs

**Local development:**

| Setting | Value |
|---------|-------|
| Allowed Callback URLs | `http://localhost:3000/auth/callback` |
| Allowed Logout URLs | `http://localhost:3000` |
| Allowed Web Origins | `http://localhost:3000` |

**Production (Vercel):**

| Setting | Value |
|---------|-------|
| Allowed Callback URLs | `https://YOUR_VERCEL_URL/auth/callback` |
| Allowed Logout URLs | `https://YOUR_VERCEL_URL` |
| Allowed Web Origins | `https://YOUR_VERCEL_URL` |

---

## 3. Admin Access

Set `ADMIN_EMAILS` in `.env.local` to a comma-separated list of admin email addresses:

```
ADMIN_EMAILS=admin@intikhab.pk,moderator@intikhab.pk
```

Only users with these email addresses can access `/admin` routes.

---

## 4. Vercel Production Deployment

Add all environment variables in Vercel Project Settings → Environment Variables:

- `APP_BASE_URL` → `https://YOUR_VERCEL_URL`
- `AUTH0_DOMAIN` → `dev-hxfdn6ezd2i0sit2.us.auth0.com`
- `AUTH0_CLIENT_ID` → from Auth0 dashboard
- `AUTH0_CLIENT_SECRET` → from Auth0 dashboard
- `AUTH0_SECRET` → your generated secret
- `ADMIN_EMAILS` → your admin emails

---

## 5. Testing

1. Start dev server: `npm run dev`
2. Visit homepage → navbar shows **Login** and **Sign Up**
3. Click **Login** → redirects to Auth0 Universal Login
4. Log in with Google, GitHub, or email/password
5. After login → redirected back to `/account`
6. Navbar now shows **Account** dropdown with **Sign Out**
7. Click **Sign Out** → logged out, navbar shows Login/Sign Up again
8. Visit `/admin` → should show 403 or redirect to `/` (unless your email is in `ADMIN_EMAILS`)
9. Add your email to `ADMIN_EMAILS`, restart → `/admin` should work

---

## 6. Troubleshooting

| Problem | Likely Cause | Fix |
|---------|-------------|-----|
| `AUTH0_SECRET` not set | Missing env var | Generate with `openssl rand -hex 32` |
| Callback URL mismatch | Wrong URL in Auth0 dashboard | Check Allowed Callback URLs exactly match |
| Admin access denied | Email not in `ADMIN_EMAILS` | Add email to env var |
| Login doesn't redirect back | Wrong `APP_BASE_URL` | Set to `http://localhost:3000` for local |
| 401 on /auth/callback | Client secret mismatch | Copy from Auth0 Application Settings |
