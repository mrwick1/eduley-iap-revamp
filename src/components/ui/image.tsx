import { cn } from '@/lib/utils';
import { useState } from 'react';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    className?: string;
    sizes?: string;
    loading?: 'eager' | 'lazy';
    quality?: number;
    priority?: boolean;
}

export const Image = ({
    src,
    alt,
    className,
    sizes = '100vw',
    loading = 'lazy',
    quality = 75,
    priority = false,
    ...props
}: ImageProps) => {
    const [isLoading, setIsLoading] = useState(true);

    // Convert to WebP if not already
    const webpSrc = src.replace(/\.(jpg|jpeg|png)$/, '.webp');

    return (
        <div className={cn('relative overflow-hidden', className)}>
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
            )}
            <picture>
                <source srcSet={webpSrc} type="image/webp" />
                <img
                    src={src}
                    alt={alt}
                    sizes={sizes}
                    loading={loading}
                    onLoad={() => setIsLoading(false)}
                    className={cn(
                        'h-full w-full object-cover transition-opacity duration-300',
                        isLoading ? 'opacity-0' : 'opacity-100',
                    )}
                    {...props}
                />
            </picture>
        </div>
    );
};
