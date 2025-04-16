import * as React from 'react';
import { useRef, useState } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import { Button } from './button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './dialog';
import { Spinner } from './spinner';
import 'react-image-crop/dist/ReactCrop.css';
import { X } from 'lucide-react';

interface ImageCropperProps {
    aspectRatio?: number;
    width?: number;
    height?: number;
    onCrop: (croppedImage: Blob, originalFile: File) => void;
    trigger?: React.ReactNode;
    className?: string;
}

export function ImageCropper({ aspectRatio = 1, onCrop, trigger, className }: ImageCropperProps) {
    const [imgSrc, setImgSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const [isLoading, setIsLoading] = useState(false);
    const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null);
    const [open, setOpen] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);
    const previewCanvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setCrop(undefined);
            setCroppedImageUrl(null);
            const reader = new FileReader();
            reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || null));
            reader.readAsDataURL(file);
        }
    }

    function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
        if (aspectRatio) {
            const { width, height } = e.currentTarget;
            const crop = centerCrop(
                makeAspectCrop(
                    {
                        unit: '%',
                        width: 90,
                    },
                    aspectRatio,
                    width,
                    height,
                ),
                width,
                height,
            );
            setCrop(crop);
        }
    }

    function onCropChange(crop: Crop) {
        setCrop(crop);
    }

    function onCropComplete(crop: PixelCrop) {
        setCompletedCrop(crop);
    }

    async function handleCropComplete() {
        if (!completedCrop || !imgRef.current || !previewCanvasRef.current) {
            return;
        }

        setIsLoading(true);
        try {
            const image = imgRef.current;
            const canvas = previewCanvasRef.current;
            const scaleX = image.naturalWidth / image.width;
            const scaleY = image.naturalHeight / image.height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                return;
            }

            canvas.width = completedCrop.width * scaleX;
            canvas.height = completedCrop.height * scaleY;

            ctx.drawImage(
                image,
                completedCrop.x * scaleX,
                completedCrop.y * scaleY,
                completedCrop.width * scaleX,
                completedCrop.height * scaleY,
                0,
                0,
                completedCrop.width * scaleX,
                completedCrop.height * scaleY,
            );

            const blob = await new Promise<Blob>((resolve) => {
                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            resolve(blob);
                        }
                    },
                    'image/jpeg',
                    1.0,
                );
            });

            const imageUrl = URL.createObjectURL(blob);
            setCroppedImageUrl(imageUrl);
            setCroppedBlob(blob);
            setImgSrc(null);
        } catch (error) {
            console.error('Error cropping image:', error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleSelect = () => {
        if (croppedBlob && selectedFile) {
            onCrop(croppedBlob, selectedFile);
            handleClear();
            setOpen(false);
        }
    };

    const handleClear = () => {
        setSelectedFile(null);
        setImgSrc(null);
        setCroppedImageUrl(null);
        setCroppedBlob(null);
        setCrop(undefined);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" className={className}>
                        Upload Image
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Crop Image</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="flex items-center justify-center">
                        <div className="relative w-full">
                            {selectedFile ? (
                                <div className="flex items-center justify-between w-full p-2 border rounded-md bg-muted/50">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-md bg-muted flex items-center justify-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="text-muted-foreground"
                                            >
                                                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                            </svg>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium truncate max-w-[200px]">
                                                {selectedFile.name}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                            </span>
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 hover:bg-muted"
                                        onClick={handleClear}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={onSelectFile}
                                    className="block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-violet-50 file:text-violet-700
                                    hover:file:bg-violet-100"
                                />
                            )}
                        </div>
                    </div>
                    <div className="relative min-h-[300px]">
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                                <Spinner size="md" variant="light" />
                            </div>
                        )}
                        {croppedImageUrl ? (
                            <div className="flex items-center justify-center w-full h-[300px]">
                                <img
                                    src={croppedImageUrl}
                                    alt="Cropped preview"
                                    className="h-full w-full object-contain"
                                />
                            </div>
                        ) : imgSrc ? (
                            <ReactCrop
                                crop={crop}
                                onChange={onCropChange}
                                onComplete={onCropComplete}
                                aspect={aspectRatio}
                            >
                                <img
                                    ref={imgRef}
                                    alt="Crop me"
                                    src={imgSrc}
                                    onLoad={onImageLoad}
                                    className="max-h-[300px] w-auto"
                                />
                            </ReactCrop>
                        ) : null}
                        <canvas
                            ref={previewCanvasRef}
                            style={{
                                display: 'none',
                            }}
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={handleClear}>
                            Cancel
                        </Button>
                        <Button
                            onClick={croppedImageUrl ? handleSelect : handleCropComplete}
                            disabled={isLoading || (!imgSrc && !croppedImageUrl)}
                        >
                            {isLoading ? <Spinner size="sm" /> : croppedImageUrl ? 'Select' : 'Crop'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
