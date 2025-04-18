import Settings from '@/features/settings';
import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '..';
import Profile from '@/features/settings/account/profile-page';

export const settingsRoute = createRoute({
    path: '/settings',
    component: Settings,
    getParentRoute: () => rootRoute,
});

export const profileRoute = createRoute({
    path: 'profile/',
    component: Profile,
    getParentRoute: () => settingsRoute,
});
