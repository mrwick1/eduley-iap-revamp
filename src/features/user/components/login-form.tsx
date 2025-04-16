import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { LoginInput, useLogin } from '@/lib/auth';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { z } from 'zod';
import { useNavigate } from '@tanstack/react-router';

const loginInputSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
    password: z.string().min(1, 'Please enter your password'),
});

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'form'>) {
    const { isPending, mutateAsync: login } = useLogin();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginInputSchema),
    });

    const onSubmit: SubmitHandler<LoginInput> = (data) => {
        const promise = login(data);
        toast.promise(promise, {
            loading: 'Logging in...',
            success: 'Successfully logged in!',
            error: (err) => err?.response?.data?.non_field_errors?.[0] || 'Failed to login',
        });
        promise
            .then(() => {
                navigate({ to: '/' });
            })
            .catch(() => {
                // Handle the error silently as it's already shown in the toast
            });
    };

    return (
        <form className={cn('flex flex-col gap-6', className)} {...props} onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Login to your account</h1>
                <p className="text-balance text-sm text-muted-foreground">
                    Enter your email below to login to your account
                </p>
            </div>
            <div className="grid gap-6">
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        placeholder="m@example.com"
                        {...register('email')}
                        error={errors.email}
                        disabled={isPending}
                    />
                </div>
                <div className="grid gap-2">
                    <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                        <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
                            Forgot your password?
                        </a>
                    </div>
                    <Input
                        id="password"
                        type="password"
                        {...register('password')}
                        error={errors.password}
                        disabled={isPending}
                    />
                </div>
                <Button type="submit" className="w-full" loading={isPending}>
                    Login
                </Button>
            </div>
        </form>
    );
}
