/**
 * Check if the email exists in the ADMIN_EMAILS environment variable allowlist.
 * Does not import any database or Better Auth client to remain Edge-safe.
 */
export function isAllowedAdminEmail(email?: string | null) {
  const adminEmails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  if (!email || adminEmails.length === 0) {
    return false;
  }

  return adminEmails.includes(email.toLowerCase());
}
