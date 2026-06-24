import type { LucideIcon } from 'lucide-react';

interface AdminEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

function AdminEmptyState({ icon: Icon, title, description, action }: AdminEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-brand-light-gray rounded-full flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-brand-gray" />
      </div>
      <h3 className="text-sm font-semibold text-brand-dark">{title}</h3>
      <p className="text-xs text-brand-gray mt-1 max-w-xs">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 px-4 py-2 bg-brand-dark text-white text-xs font-semibold rounded-sm hover:bg-black transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

export { AdminEmptyState };
