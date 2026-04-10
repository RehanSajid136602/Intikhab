/**
 * Global loading state for the app router.
 * Displays a spinner while pages are loading.
 */
export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-brand-gray border-t-brand-dark rounded-full animate-spin" />
    </div>
  );
}
