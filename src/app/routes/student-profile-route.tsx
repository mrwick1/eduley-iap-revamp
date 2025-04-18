import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '..';
import { lazy, Suspense } from 'react';
import { Spinner } from '@/components/ui/spinner';

const StudentProfile = lazy(() => import('@/features/student-profile'));

export const studentProfileRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/student-profile',
    component: () => (
        <Suspense
            fallback={
                <div className="flex h-screen items-center justify-center">
                    <Spinner size="lg" />
                </div>
            }
        >
            <StudentProfile />
        </Suspense>
    ),
});
