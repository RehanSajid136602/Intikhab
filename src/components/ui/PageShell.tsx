import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageShellProps {
  children: ReactNode;
  className?: string;
}

export function PageShell({ children, className }: PageShellProps) {
  return (
    <main className={cn("min-h-screen bg-brand-background", className)}>
      {children}
    </main>
  );
}

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "store-container py-10 md:py-14",
        align === "center" && "text-center",
        className,
      )}
    >
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h1 className="page-title">{title}</h1>
      {description && (
        <p
          className={cn(
            "body-muted mt-4 max-w-2xl",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      )}
    </header>
  );
}

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "surface-card flex min-h-[260px] flex-col items-center justify-center px-6 py-12 text-center",
        className,
      )}
    >
      <h2 className="section-title text-2xl">{title}</h2>
      <p className="body-muted mt-3 max-w-md">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
