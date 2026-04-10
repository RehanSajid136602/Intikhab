/**
 * This layout disables the admin auth redirect for the login page.
 * The login page should be accessible without authentication.
 */
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
