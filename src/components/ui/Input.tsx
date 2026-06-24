import {
  type InputHTMLAttributes,
  forwardRef,
  useId,
} from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

/**
 * Styled input component with optional label and error state.
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium text-brand-dark mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'form-field',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-brand-red focus:border-brand-red',
            className,
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-brand-red">{error}</p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export { Input };
export type { InputProps };
