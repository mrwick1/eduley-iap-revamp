import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { ImageCropper } from '@/components/ui/image-cropper';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import * as React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { Tooltip } from '@/components/ui/tooltip';
import { getRoles } from '@/features/settings/account/api/api';
import { useStaff } from '../context/staff-context';

export const StaffForm = () => {
    const { form, isSubmitting } = useStaff();
    const [isCropping, setIsCropping] = React.useState(false);
    const [croppedImageUrl, setCroppedImageUrl] = React.useState<string | null>(null);

    // get all the roles from the api
    const { data: roles, isLoading: isRolesLoading } = useQuery({
        queryKey: ['roles'],
        queryFn: () => getRoles(),
    });

    React.useEffect(() => {
        return () => {
            if (croppedImageUrl) {
                URL.revokeObjectURL(croppedImageUrl);
            }
        };
    }, [croppedImageUrl]);

    const handleImageCrop = async (blob: Blob, file: File) => {
        setIsCropping(true);
        try {
            const imageUrl = URL.createObjectURL(blob);
            setCroppedImageUrl(imageUrl);

            form.setValue(
                'profile_photo',
                Object.assign(file, {
                    preview: imageUrl,
                }),
            );
        } catch (error) {
            console.error('Error handling cropped image:', error);
        } finally {
            setIsCropping(false);
        }
    };

    const selectedGroups = form.watch('groups') || [];

    const handleGroupSelect = (groupId: number) => {
        const currentGroups = form.getValues('groups') || [];
        if (currentGroups.includes(groupId)) {
            form.setValue(
                'groups',
                currentGroups.filter((id) => id !== groupId),
            );
        } else {
            form.setValue('groups', [...currentGroups, groupId]);
        }
    };

    if (isRolesLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Spinner />
            </div>
        );
    }

    return (
        <Form {...form}>
            <form className="space-y-8" encType="multipart/form-data">
                <div className="flex items-center gap-8">
                    <div className="relative">
                        <Avatar className="h-28 w-28 border-2 border-border">
                            {isCropping ? (
                                <div className="flex h-full w-full items-center justify-center bg-muted">
                                    <Spinner size="sm" />
                                </div>
                            ) : (
                                <>
                                    <AvatarImage src={croppedImageUrl || form.watch('profile_photo')} />
                                    <AvatarFallback className="text-xl">
                                        {form.watch('first_name')?.[0]}
                                        {form.watch('last_name')?.[0]}
                                    </AvatarFallback>
                                </>
                            )}
                        </Avatar>
                    </div>
                    <div className="space-y-2">
                        <ImageCropper
                            aspectRatio={1}
                            width={200}
                            height={200}
                            onCrop={handleImageCrop}
                            trigger={
                                <Button variant="outline" type="button" disabled={isSubmitting}>
                                    Change Photo
                                </Button>
                            }
                        />
                        <p className="text-sm text-muted-foreground">JPG, PNG or WEBP</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="first_name"
                        render={({ field }) => (
                            <FormItem className="relative">
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="John" {...field} disabled={isSubmitting} />
                                </FormControl>
                                <FormMessage className="absolute -bottom-5 left-0" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="last_name"
                        render={({ field }) => (
                            <FormItem className="relative">
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Doe" {...field} disabled={isSubmitting} />
                                </FormControl>
                                <FormMessage className="absolute -bottom-5 left-0" />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem className="relative">
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="john@example.com" {...field} disabled={isSubmitting} />
                            </FormControl>
                            <FormDescription>This will be used for login and notifications.</FormDescription>
                            <FormMessage className="absolute -bottom-5 left-0" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem className="relative">
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="••••••••" {...field} disabled={isSubmitting} />
                            </FormControl>
                            <FormDescription>
                                Password must be at least 8 characters long and contain at least one uppercase letter,
                                one lowercase letter, and one number.
                            </FormDescription>
                            {/* <FormMessage className="absolute -bottom-5 left-0" /> */}
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="groups"
                    render={() => (
                        <FormItem>
                            <FormLabel>Roles</FormLabel>
                            {selectedGroups.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {selectedGroups.map((groupId) => {
                                        const role = roles?.find((r) => r.id === groupId);
                                        return role ? (
                                            <Badge
                                                key={groupId}
                                                variant="secondary"
                                                className="flex items-center gap-1"
                                            >
                                                {role.name}
                                                <button
                                                    type="button"
                                                    onClick={() => handleGroupSelect(groupId)}
                                                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                                    disabled={isSubmitting}
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </Badge>
                                        ) : null;
                                    })}
                                </div>
                            )}
                            <Select onValueChange={(value) => handleGroupSelect(Number(value))} disabled={isSubmitting}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select roles" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {roles?.map((role) => {
                                        const isDisabled = selectedGroups.includes(role.id);
                                        const tooltipMessage = isDisabled ? 'Role already assigned' : undefined;
                                        return isDisabled ? (
                                            <Tooltip message={tooltipMessage} key={role.id}>
                                                <div>
                                                    <SelectItem value={role.id.toString()} disabled={isDisabled}>
                                                        {role.name}
                                                    </SelectItem>
                                                </div>
                                            </Tooltip>
                                        ) : (
                                            <SelectItem key={role.id} value={role.id.toString()} disabled={isDisabled}>
                                                {role.name}
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                Select the roles for this staff member. You can select multiple roles.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
};
