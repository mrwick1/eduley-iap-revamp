import * as React from 'react';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';
import { FieldError } from 'react-hook-form';

interface InputProps extends React.ComponentProps<'input'> {
    error?: FieldError | string;
    helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, error, helperText, ...props }, ref) => {
        const [showPassword, setShowPassword] = React.useState(false);
        const isPassword = type === 'password';
        const errorMessage = typeof error === 'string' ? error : error?.message;

        return (
            <div className="flex flex-col gap-1">
                <div className="relative">
                    <input
                        type={isPassword ? (showPassword ? 'text' : 'password') : type}
                        data-slot="input"
                        className={cn(
                            'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                            'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                            'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
                            error &&
                                'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/50',
                            isPassword && 'pr-10',
                            className,
                        )}
                        ref={ref}
                        {...props}
                    />
                    {isPassword && (
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    )}
                </div>
                {(errorMessage || helperText) && (
                    <p className={cn('text-sm', errorMessage ? 'text-destructive' : 'text-muted-foreground')}>
                        {errorMessage || helperText}
                    </p>
                )}
            </div>
        );
    },
);

Input.displayName = 'Input';

export { Input };
