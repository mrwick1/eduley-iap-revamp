import { CatchBoundary, Outlet } from '@tanstack/react-router';
import { AppProvider } from '@/app/Provider';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { SearchProvider } from '@/context/search-context';
import { ProtectedRoute } from '@/lib/auth';
import { useUserStore } from '@/store/userSlice';
import { ThemeProvider } from '@/context/theme-context';

export function Layout() {
    const { isAuthenticated } = useUserStore();

    return (
        <CatchBoundary
            getResetKey={() => window.location.pathname}
            onCatch={(error) => {
                console.error('Error caught by CatchBoundary:', error);
            }}
        >
            <ThemeProvider>
                <SearchProvider>
                    <AppProvider>
                        <ProtectedRoute>
                            <SidebarProvider>
                                {isAuthenticated && <AppSidebar />}
                                <SidebarInset id="content">
                                    <div className="flex flex-1 flex-col">
                                        <Outlet />
                                    </div>
                                </SidebarInset>
                            </SidebarProvider>
                        </ProtectedRoute>
                    </AppProvider>
                </SearchProvider>
            </ThemeProvider>
        </CatchBoundary>
    );
}
