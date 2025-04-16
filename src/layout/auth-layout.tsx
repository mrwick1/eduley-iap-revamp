import { Outlet } from '@tanstack/react-router';
import { AppProvider } from '@/app/Provider';
export function AuthLayout() {
    return (
        <>
            <AppProvider>
                <Outlet />
            </AppProvider>
        </>
    );
}
