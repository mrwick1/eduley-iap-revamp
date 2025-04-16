import { Spinner } from '@/components/ui/spinner';
import { queryConfig } from '@/lib/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense, useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthLoader } from '@/lib/auth';
import { Toaster } from 'sonner';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { CatchBoundary } from '@tanstack/react-router';
import { NavigationProgress } from '@/components/navigation-progress';

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: queryConfig,
            }),
    );

    return (
        <CatchBoundary
            getResetKey={() => window.location.pathname}
            onCatch={(error) => {
                console.error('Error caught by CatchBoundary:', error);
            }}
        >
            <Suspense
                fallback={
                    <div className="flex h-screen w-screen items-center justify-center">
                        <Spinner size="xl" />
                    </div>
                }
            >
                <HelmetProvider>
                    <QueryClientProvider client={queryClient}>
                        {import.meta.env.DEV && (
                            <>
                                <ReactQueryDevtools />
                                <TanStackRouterDevtools />
                            </>
                        )}
                        <AuthLoader
                            renderLoading={() => (
                                <div className="flex h-screen w-screen items-center justify-center">
                                    <Spinner size="xl" />
                                </div>
                            )}
                        >
                            <NavigationProgress />
                            {children}
                        </AuthLoader>
                        <Toaster richColors position="top-right" duration={2000} closeButton />
                    </QueryClientProvider>
                </HelmetProvider>
            </Suspense>
        </CatchBoundary>
    );
};
