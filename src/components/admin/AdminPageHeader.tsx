interface AdminPageHeaderProps {
  title: string;
  subtitle: string;
}

function AdminPageHeader({ title, subtitle }: AdminPageHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-xl font-bold text-brand-dark uppercase tracking-wider">{title}</h1>
      <p className="text-sm text-brand-gray mt-1">{subtitle}</p>
    </div>
  );
}

export { AdminPageHeader };
