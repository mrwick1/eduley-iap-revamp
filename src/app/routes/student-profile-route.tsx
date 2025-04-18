import StudentProfile from '@/features/student-profile';
import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../index';

export const studentProfileRoute = createRoute({
    path: '/student-profile',
    component: StudentProfile,
    getParentRoute: () => rootRoute,
});
