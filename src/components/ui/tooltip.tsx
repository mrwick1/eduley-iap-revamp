import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import { cn } from '@/lib/utils';

interface TooltipProps {
    children: React.ReactNode;
    message: string | undefined;
    isVisible?: boolean;
    side?: 'top' | 'right' | 'bottom' | 'left';
    className?: string;
}

function Tooltip({ children, message, isVisible = true, side = 'top', className }: TooltipProps) {
    if (!isVisible || !message) {
        return <>{children}</>;
    }

    return (
        <TooltipPrimitive.Root>
            <TooltipPrimitive.Trigger asChild>
                <div className="touch-action-none">{children}</div>
            </TooltipPrimitive.Trigger>
            <TooltipPrimitive.Portal>
                <TooltipPrimitive.Content
                    data-slot="tooltip-content"
                    side={side}
                    sideOffset={0}
                    className={cn(
                        'bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance',
                        className,
                    )}
                >
                    {message}
                    <TooltipPrimitive.Arrow className="bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
                </TooltipPrimitive.Content>
            </TooltipPrimitive.Portal>
        </TooltipPrimitive.Root>
    );
}

export { Tooltip };
