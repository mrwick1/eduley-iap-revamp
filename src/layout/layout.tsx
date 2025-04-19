import { Outlet } from '@tanstack/react-router';
import { AppProvider } from '@/app/Provider';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { SearchProvider } from '@/context/search-context';
import { ProtectedRoute } from '@/lib/auth';
import { useUserStore } from '@/store/userSlice';

export function Layout() {
    const { isAuthenticated } = useUserStore();

    return (
        <AppProvider>
            <SearchProvider>
                {isAuthenticated ? (
                    <ProtectedRoute>
                        <SidebarProvider>
                            <AppSidebar />
                            <SidebarInset id="content">
                                <div className="flex flex-1 flex-col">
                                    <Outlet />
                                </div>
                            </SidebarInset>
                        </SidebarProvider>
                    </ProtectedRoute>
                ) : (
                    <Outlet />
                )}
            </SearchProvider>
        </AppProvider>
    );
}
