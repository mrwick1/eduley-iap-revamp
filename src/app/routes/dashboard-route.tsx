import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '..';
import Dashboard from '@/features/dashboard';

export const dashboardRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/dashboard',
    component: () => <Dashboard />,
});
