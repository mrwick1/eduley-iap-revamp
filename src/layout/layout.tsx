import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { SearchProvider } from '@/context/search-context';
import { ProtectedRoute } from '@/lib/auth';
import { Outlet } from '@tanstack/react-router';
export function Layout() {
    return (
        <ProtectedRoute>
            <SearchProvider>
                <SidebarProvider>
                    <AppSidebar />
                    <SidebarInset id="content">
                        <div className="flex flex-1 flex-col">
                            <Outlet />
                        </div>
                    </SidebarInset>
                </SidebarProvider>
            </SearchProvider>
        </ProtectedRoute>
    );
}
