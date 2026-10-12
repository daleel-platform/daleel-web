import { cn } from '@/utils/cn';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import {
  useId,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  required?: boolean;
}

export function TextInput({
  label,
  helperText,
  error,
  type = 'text',
  id,
  className,
  disabled,
  leftIcon,
  rightIcon,
  required,
  ...props
}: TextInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  const isPassword = type === 'password';
  const [showPassword, setShowPassword] = useState(false);
  const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-slate-700 select-none flex items-center justify-between"
        >
          <span>
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </span>
        </label>
      )}

      <div className="relative flex items-center">
        {leftIcon && (
          <span className="pointer-events-none absolute left-3.5 flex items-center text-slate-400">
            {leftIcon}
          </span>
        )}

        <input
          id={inputId}
          type={resolvedType}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          className={cn(
            'w-full rounded-xl border bg-white px-3.5 py-2 text-sm text-slate-900 transition-all duration-150',
            'placeholder:text-slate-400 shadow-2xs',
            'border-slate-300/90 hover:border-slate-400',
            'focus:outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10',
            'disabled:opacity-60 disabled:bg-slate-50 disabled:cursor-not-allowed',
            error &&
              'border-red-400 text-slate-900 focus:border-red-500 focus:ring-red-500/10',
            leftIcon ? 'pl-10' : 'pl-3.5',
            isPassword || rightIcon ? 'pr-10' : 'pr-3.5',
            className,
          )}
          {...props}
        />

        {rightIcon && !isPassword && (
          <span className="pointer-events-none absolute right-3.5 flex items-center text-slate-400">
            {rightIcon}
          </span>
        )}

        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-2.5 flex items-center p-1 text-slate-400 hover:text-slate-600 transition-colors rounded-lg cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        )}
      </div>

      {error ? (
        <p
          id={errorId}
          className="flex items-center gap-1.5 text-xs font-medium text-red-600 animate-in fade-in duration-150"
        >
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-xs text-slate-500 leading-normal">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
