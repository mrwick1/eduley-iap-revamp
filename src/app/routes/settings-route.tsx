import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '..';
import { lazy, Suspense } from 'react';
import { Spinner } from '@/components/ui/spinner';
import Profile from '@/features/settings/account/profile-page';

const Settings = lazy(() => import('@/features/settings'));

export const settingsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/settings',
    component: () => (
        <Suspense
            fallback={
                <div className="flex h-screen items-center justify-center">
                    <Spinner size="lg" />
                </div>
            }
        >
            <Settings />
        </Suspense>
    ),
});

export const profileRoute = createRoute({
    path: 'profile/',
    component: Profile,
    getParentRoute: () => settingsRoute,
});
