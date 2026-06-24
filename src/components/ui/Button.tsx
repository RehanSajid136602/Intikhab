import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-brand-cta text-white hover:bg-brand-cta-hover transition-colors duration-200',
  secondary:
    'bg-transparent text-brand-dark border border-brand-dark hover:bg-brand-dark hover:text-white transition-colors duration-200',
  ghost: 'bg-transparent text-brand-dark hover:bg-brand-light-gray transition-colors duration-200',
  danger: 'bg-brand-error text-white hover:bg-brand-cta-hover transition-colors duration-200',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-2.5 text-xs',
  lg: 'px-8 py-3.5 text-sm',
};

/**
 * Reusable button component with variant and size options.
 * @param variant - Visual style: primary, secondary, ghost, danger
 * @param size - Size: sm, md, lg
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      className,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          'font-bold uppercase tracking-widest rounded-sm disabled:opacity-50 disabled:cursor-not-allowed',
          'focus-visible:outline-brand-red',
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';

export { Button };
export type { ButtonVariant, ButtonSize, ButtonProps };
