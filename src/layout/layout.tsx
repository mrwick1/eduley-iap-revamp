import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { Header } from '@/components/sidebar/Header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { ProtectedRoute } from '@/lib/auth';
import { Outlet } from '@tanstack/react-router';
export function Layout() {
    return (
        <ProtectedRoute>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset id="content">
                    <Header />
                    <div className="flex flex-1 flex-col">
                        <Outlet />
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </ProtectedRoute>
    );
}
