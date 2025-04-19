import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '..';
import { lazy, Suspense } from 'react';
import { Spinner } from '@/components/ui/spinner';

const Login = lazy(() => import('@/features/auth/login-page'));

export const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: 'auth/login',
    validateSearch: (search: Record<string, unknown>) => ({
        redirectTo: search.redirectTo as string | undefined,
    }),
    component: () => (
        <Suspense
            fallback={
                <div className="flex h-screen items-center justify-center">
                    <Spinner size="lg" />
                </div>
            }
        >
            <Login />
        </Suspense>
    ),
});
