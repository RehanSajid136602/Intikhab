export default function AdminLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-brand-dark border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-brand-gray">Loading...</p>
      </div>
    </div>
  );
}
