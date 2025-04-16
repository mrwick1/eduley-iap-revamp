import LoginPage from '@/features/user/login-page';
import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '..';
export const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: 'auth/login',
    component: () => <LoginPage />,
});
