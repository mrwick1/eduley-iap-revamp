import { createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { Layout } from '../layout/layout';
import '@/index.css';
import { loginRoute } from './routes/login-route';
import NotFoundError from '@/components/errors/not-found-error';
import GeneralError from '@/components/errors/general-error';
import { appearanceRoute, profileRoute, settingsRoute } from './routes/settings-route';
import { dashboardRoute } from './routes/dashboard-route';
import { Navigate } from '@tanstack/react-router';
import { studentProfileRoute } from './routes/student-profile-route';
// Root route with layout
export const rootRoute = createRootRoute({
    component: Layout,
    notFoundComponent: NotFoundError,
    errorComponent: GeneralError,
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
]);

// Create the router
export const router = createRouter({ routeTree });

// Register the router type
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}
