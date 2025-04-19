import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '..';
import { lazy, Suspense } from 'react';
import { Spinner } from '@/components/ui/spinner';

const Settings = lazy(() => import('@/features/settings'));
const Profile = lazy(() => import('@/features/settings/account/profile-page'));
const AppearancePage = lazy(() => import('@/features/settings/appearance/appearance-page'));

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

export const appearanceRoute = createRoute({
    path: 'appearance/',
    component: AppearancePage,
    getParentRoute: () => settingsRoute,
});
