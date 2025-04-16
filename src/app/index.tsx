import { createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { Layout } from '../layout/layout';
import { AuthLayout } from '../layout/auth-layout';
import '@/index.css';
import { loginRoute } from './routes/login-page';

// Root route with layout
export const rootRoute = createRootRoute({
    component: AuthLayout,
});

// Index route
const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => <Layout />,
});

// Create the route tree
const routeTree = rootRoute.addChildren([indexRoute, loginRoute]);

// Create the router
export const router = createRouter({ routeTree });

// Register the router type
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}
