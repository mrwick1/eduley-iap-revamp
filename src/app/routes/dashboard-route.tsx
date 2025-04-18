import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '..';
import { lazy, Suspense } from 'react';
import { DashboardSkeleton } from '@/components/ui/loaders/dashboard-skeleton';

const Dashboard = lazy(() => import('@/features/dashboard'));

export const dashboardRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/dashboard',
    component: () => (
        <Suspense fallback={<DashboardSkeleton />}>
            <Dashboard />
        </Suspense>
    ),
});
