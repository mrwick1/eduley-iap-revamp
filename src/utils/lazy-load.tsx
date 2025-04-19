import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Suspense, lazy } from 'react';

interface LazyLoadProps {
    children: React.ReactNode;
}

export const LazyLoad = ({ children }: LazyLoadProps) => {
    return (
        <Suspense
            fallback={
                <div className="flex h-full w-full items-center justify-center">
                    <LoadingSpinner />
                </div>
            }
        >
            {children}
        </Suspense>
    );
};

export const lazyLoad = <T extends React.ComponentType<any>>(importFn: () => Promise<{ default: T }>) => {
    return lazy(importFn);
};
