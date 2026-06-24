interface AdminSectionCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  danger?: boolean;
}

function AdminSectionCard({ title, description, children, className = '', danger }: AdminSectionCardProps) {
  return (
    <div className={`bg-white rounded-sm border ${danger ? 'border-brand-red/30' : 'border-brand-border'} ${className}`}>
      <div className={`px-6 py-4 border-b ${danger ? 'border-brand-red/10' : 'border-brand-border'}`}>
        <h3 className="text-sm font-semibold text-brand-dark uppercase tracking-wider">{title}</h3>
        {description && <p className="text-xs text-brand-gray mt-0.5">{description}</p>}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

export { AdminSectionCard };
