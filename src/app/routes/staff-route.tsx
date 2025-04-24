import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '..';
import { lazy, Suspense } from 'react';
import { Spinner } from '@/components/ui/spinner';

const StaffManagement = lazy(() => import('@/features/staff-management'));

export const staffRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/staff-management',
    component: () => (
        <Suspense
            fallback={
                <div className="flex h-screen items-center justify-center">
                    <Spinner size="lg" />
                </div>
            }
        >
            <StaffManagement />
        </Suspense>
    ),
});
