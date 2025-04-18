import { Skeleton } from '../skeleton';

export function DashboardSkeleton() {
    return (
        <div className="space-y-4 p-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-48" />
                <div className="flex items-center space-x-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-10 w-32" />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="rounded-lg border p-4">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="mt-2 h-8 w-16" />
                        <Skeleton className="mt-2 h-4 w-32" />
                    </div>
                ))}
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {/* Chart Section */}
                <div className="col-span-2 rounded-lg border p-4">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="mt-4 h-64 w-full" />
                </div>

                {/* Recent Activity */}
                <div className="rounded-lg border p-4">
                    <Skeleton className="h-6 w-32" />
                    <div className="mt-4 space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center space-x-3">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-3 w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
