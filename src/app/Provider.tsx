import { Spinner } from '@/components/ui/spinner';
import { queryConfig } from '@/lib/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense, useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthLoader } from '@/lib/auth';
import { Toaster } from 'sonner';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { NavigationProgress } from '@/components/navigation-progress';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { FontProvider } from '@/context/font-context';
import { ThemeProvider } from '@/context/theme-context';
import { useIsMobile } from '@/hooks/use-mobile';

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: queryConfig,
            }),
    );
    const isMobile = useIsMobile();

    return (
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
                    <ThemeProvider>
                        <FontProvider>
                            <AuthLoader
                                renderLoading={() => (
                                    <div className="flex h-screen w-screen items-center justify-center">
                                        <Spinner size="xl" />
                                    </div>
                                )}
                            >
                                <TooltipPrimitive.Provider delayDuration={100}>
                                    <NavigationProgress />
                                    {children}
                                </TooltipPrimitive.Provider>
                            </AuthLoader>
                        </FontProvider>
                    </ThemeProvider>
                    <Toaster
                        richColors
                        position={isMobile ? 'bottom-center' : 'top-right'}
                        duration={2000}
                        closeButton
                    />
                </QueryClientProvider>
            </HelmetProvider>
        </Suspense>
    );
};
