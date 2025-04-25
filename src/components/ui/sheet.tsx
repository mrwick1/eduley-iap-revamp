import * as React from 'react';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import { XIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from './button';

function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
    return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger({ ...props }: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
    return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose({ ...props }: React.ComponentProps<typeof SheetPrimitive.Close>) {
    return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetPortal({ ...props }: React.ComponentProps<typeof SheetPrimitive.Portal>) {
    return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

function SheetOverlay({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
    return (
        <SheetPrimitive.Overlay
            data-slot="sheet-overlay"
            className={cn(
                'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50',
                className,
            )}
            {...props}
        />
    );
}

function SheetContent({
    className,
    children,
    side = 'right',
    ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
    side?: 'top' | 'right' | 'bottom' | 'left';
}) {
    return (
        <SheetPortal>
            <SheetOverlay />
            <SheetPrimitive.Content
                data-slot="sheet-content"
                className={cn(
                    'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
                    side === 'right' &&
                        'data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm',
                    side === 'left' &&
                        'data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm',
                    side === 'top' &&
                        'data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b',
                    side === 'bottom' &&
                        'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t',
                    className,
                )}
                {...props}
            >
                {children}
            </SheetPrimitive.Content>
        </SheetPortal>
    );
}

function SheetHeader({ className, ...props }: React.ComponentProps<'div'>) {
    return <div data-slot="sheet-header" className={cn('flex flex-col gap-1.5 p-4', className)} {...props} />;
}

function SheetFooter({ className, ...props }: React.ComponentProps<'div'>) {
    return <div data-slot="sheet-footer" className={cn('mt-auto flex flex-col gap-2 p-4', className)} {...props} />;
}

function SheetTitle({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Title>) {
    return (
        <SheetPrimitive.Title
            data-slot="sheet-title"
            className={cn('text-foreground font-semibold', className)}
            {...props}
        />
    );
}

function SheetDescription({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Description>) {
    return (
        <SheetPrimitive.Description
            data-slot="sheet-description"
            className={cn('text-muted-foreground text-sm', className)}
            {...props}
        />
    );
}

interface DrawerProps extends React.ComponentProps<typeof Sheet> {
    open: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    onSave?: () => void;
    onCancel?: () => void;
    saveLabel?: string;
    cancelLabel?: string;
    side?: 'top' | 'right' | 'bottom' | 'left';
}

function Drawer({
    open,
    onClose,
    title,
    children,
    onSave,
    onCancel,
    saveLabel = 'Save',
    cancelLabel = 'Cancel',
    side = 'right',
    ...props
}: DrawerProps) {
    const handleCancel = onCancel || onClose;

    return (
        <Sheet open={open} onOpenChange={onClose} {...props}>
            <SheetContent side={side} className="sm:max-w-[500px] shadow-2xl shadow-black/20">
                {/* Header */}
                <SheetHeader className="flex-row justify-between items-center border-b pb-4 bg-gradient-to-r from-background to-muted/5 sticky top-0 z-10">
                    <SheetTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <span className="w-1 h-6 bg-primary rounded-full"></span>
                        {title}
                    </SheetTitle>
                    <SheetClose asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-accent rounded-full transition-all duration-200 hover:scale-110"
                        >
                            <XIcon className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </Button>
                    </SheetClose>
                </SheetHeader>

                {/* Content */}
                <div className="flex-1 py-6 px-4">
                    <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent pr-2">
                        <div className="space-y-4">{children}</div>
                    </div>
                </div>

                {/* Footer */}
                <SheetFooter className="border-t pt-4 gap-3 sm:flex-row sm:justify-end bg-gradient-to-r from-muted/5 to-background sticky bottom-0 z-10">
                    {handleCancel && (
                        <Button variant="outline" onClick={handleCancel} className="shadow-md w-32">
                            {cancelLabel}
                        </Button>
                    )}
                    {onSave && (
                        <Button onClick={onSave} className="shadow-md w-32">
                            {saveLabel}
                        </Button>
                    )}
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}

export {
    Sheet,
    SheetTrigger,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetFooter,
    SheetTitle,
    SheetDescription,
    Drawer,
};
