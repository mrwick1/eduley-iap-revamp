import { createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { LazyLoad } from '@/utils/lazy-load';
import { lazy } from 'react';
import '@/index.css';
import { Navigate } from '@tanstack/react-router';
import { settingsRoute, profileRoute, appearanceRoute } from './routes/settings-route';
import { loginRoute } from './routes/login-route';
import { dashboardRoute } from './routes/dashboard-route';
import { studentProfileRoute, studentDetailsRoute } from './routes/student-profile-route';
import { staffRoute } from './routes/staff-route';

// Root route with layout
const Layout = lazy(() => import('@/layout/layout').then((m) => ({ default: m.Layout })));
const NotFoundError = lazy(() => import('@/components/errors/not-found-error'));
const GeneralError = lazy(() => import('@/components/errors/general-error'));

export const rootRoute = createRootRoute({
    component: () => (
        <LazyLoad>
            <Layout />
        </LazyLoad>
    ),
    notFoundComponent: () => (
        <LazyLoad>
            <NotFoundError />
        </LazyLoad>
    ),
    errorComponent: () => (
        <LazyLoad>
            <GeneralError />
        </LazyLoad>
    ),
});

// Index route that redirects to dashboard
export const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => <Navigate to="/dashboard" />,
});

// Create the route tree
const routeTree = rootRoute.addChildren([
    indexRoute,
    loginRoute,
    dashboardRoute,
    settingsRoute.addChildren([profileRoute, appearanceRoute]),
    studentProfileRoute,
    staffRoute,
    studentDetailsRoute,
]);

// Create the router
export const router = createRouter({ routeTree });

// Register the router type
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}
