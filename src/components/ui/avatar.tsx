'use client';

import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';

import { cn } from '@/lib/utils';

function Avatar({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Root>) {
    return (
        <AvatarPrimitive.Root
            data-slot="avatar"
            className={cn('relative flex size-8 shrink-0 overflow-hidden rounded-full', className)}
            {...props}
        />
    );
}

function AvatarImage({
    className,
    src,
    ...props
}: Omit<React.ComponentProps<typeof AvatarPrimitive.Image>, 'src'> & {
    src?: string | File | null;
}) {
    const [imageUrl, setImageUrl] = React.useState<string | undefined>(undefined);

    React.useEffect(() => {
        if (src instanceof File) {
            const url = URL.createObjectURL(src);
            setImageUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setImageUrl(src || undefined);
        }
    }, [src]);

    return (
        <AvatarPrimitive.Image
            data-slot="avatar-image"
            className={cn('aspect-square size-full', className)}
            src={imageUrl}
            {...props}
        />
    );
}

function AvatarFallback({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
    return (
        <AvatarPrimitive.Fallback
            data-slot="avatar-fallback"
            className={cn('bg-muted flex size-full items-center justify-center rounded-full', className)}
            {...props}
        />
    );
}

export { Avatar, AvatarImage, AvatarFallback };
