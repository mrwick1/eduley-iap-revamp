import Settings from '@/features/user/settings-page';
import { createRoute } from '@tanstack/react-router';
import { indexRoute } from '..';
import Profile from '@/features/settings/account/profile-page';

export const settingsRoute = createRoute({
    path: '/settings',
    component: Settings,
    getParentRoute: () => indexRoute,
});

export const profileRoute = createRoute({
    path: 'profile/',
    component: Profile,
    getParentRoute: () => settingsRoute,
});
