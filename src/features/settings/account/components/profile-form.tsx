import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useUserStore } from '@/store/userSlice';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ImageCropper } from '@/components/ui/image-cropper';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@/store/userSlice';
import * as React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { ROLES } from '@/const/role';
import { cn } from '@/lib/utils';
import { Tooltip } from '@/components/ui/tooltip';
import { getRoles, getUser, updateUser } from '../api/api';

const MAX_ROLES = 10;

import ProfileLoading from './profile-loading';
const profileFormSchema = z.object({
    first_name: z
        .string()
        .min(2, { message: 'First name must be at least 2 characters.' })
        .max(30, { message: 'First name must not be longer than 30 characters.' }),
    last_name: z
        .string()
        .min(1, { message: 'Last name must be at least 1 characters.' })
        .max(30, { message: 'Last name must not be longer than 30 characters.' }),
    email: z.string({ required_error: 'Please enter your email.' }).email(),
    profile_photo: z.union([z.string(), z.instanceof(File)]).optional(),
    groups: z.array(z.number()).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfileForm() {
    const { user } = useUserStore();
    const [isCropping, setIsCropping] = React.useState(false);
    const [croppedImageUrl, setCroppedImageUrl] = React.useState<string | null>(null);
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        mode: 'onChange',
        defaultValues: {
            first_name: '',
            last_name: '',
            email: '',
            profile_photo: undefined,
            groups: [],
        },
    });

    // check if the user is an admin
    // if the user is admin they should not be able to remove the management role, they should not be able to remove the management role,
    // also for other roles they should not be able to change their roles
    const isManagement = user?.groups.includes(ROLES.MANAGEMENT);
    // get the user data from the api
    const { data: userData, isLoading: isUserLoading } = useQuery({
        queryKey: ['user', user?.id],
        queryFn: () => getUser(user?.id!),
    });

    // get all the roles from the api
    const { data: roles, isLoading: isRolesLoading } = useQuery({
        queryKey: ['roles'],
        queryFn: () => getRoles(),
    });

    // update the user
    const { mutateAsync, isPending: isUpdating } = useMutation({
        mutationFn: (data: ProfileFormValues) => {
            if (!userData) throw new Error('User data is not available');
            return updateUser(user?.id!, { ...userData, ...data } as User);
        },
    });

    React.useEffect(() => {
        if (userData) {
            form.reset({
                first_name: userData.first_name,
                last_name: userData.last_name,
                email: userData.email,
                profile_photo: userData.profile_photo,
                groups: userData.groups,
            });
        }
    }, [userData, form]);

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

    const handleSubmit = async (data: ProfileFormValues) => {
        const newData = { ...userData, ...data };
        if (data?.profile_photo === userData?.profile_photo) {
            delete newData.profile_photo;
        }

        const promise = mutateAsync(newData);
        toast.promise(promise, {
            loading: 'Updating profile...',
            success: 'Profile updated successfully',
            error: 'Failed to update profile',
        });
    };

    if (isUserLoading || isRolesLoading) {
        return <ProfileLoading />;
    }

    // error messages
    const disabledInfoRoles = !isManagement
        ? 'Only users with Management role can modify roles'
        : form.getValues('groups')?.length === MAX_ROLES
          ? `You have selected all the roles available`
          : undefined;
    const disabledInfoEmail = 'For security reasons, the email address cannot be altered';
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8" encType="multipart/form-data">
                <div className="flex items-center gap-8">
                    <div className="relative">
                        <Avatar className="h-28 w-28 border-2 border-border">
                            {isUpdating || isCropping ? (
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
                                <Button variant="outline" type="button" disabled={isUpdating}>
                                    Change Photo
                                </Button>
                            }
                        />
                        <p className="text-sm text-muted-foreground">JPG, PNG or WEBP</p>
                    </div>
                </div>

                <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                                <Input placeholder="John" {...field} disabled={isUpdating} />
                            </FormControl>
                            <FormDescription>
                                This is your first name as it will appear on your profile.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Doe" {...field} disabled={isUpdating} />
                            </FormControl>
                            <FormDescription>This is your last name as it will appear on your profile.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="john@example.com"
                                    {...field}
                                    disabled
                                    disabledInfo={disabledInfoEmail}
                                />
                            </FormControl>
                            <FormDescription>
                                This is the email address associated with your account. It will be used for
                                notifications and account recovery.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="groups"
                    render={() => (
                        <FormItem>
                            <FormLabel>Roles</FormLabel>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {selectedGroups.map((groupId) => {
                                    const role = roles?.find((r) => r.id === groupId);
                                    const isDisabled =
                                        isUpdating || !isManagement || (isManagement && role?.name === 'Management');
                                    const tooltipMessage = !isManagement
                                        ? 'Only users with Management role can modify roles'
                                        : isManagement && role?.name === 'Management'
                                          ? 'Users with Management role cannot remove the Management role'
                                          : null;

                                    return role ? (
                                        tooltipMessage ? (
                                            <Tooltip message={tooltipMessage} key={groupId}>
                                                <div>
                                                    <Badge
                                                        variant="secondary"
                                                        className={cn(
                                                            'flex items-center gap-1',
                                                            isManagement && role.name === 'Management' && 'opacity-50',
                                                        )}
                                                    >
                                                        {role.name}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleGroupSelect(groupId)}
                                                            className={cn(
                                                                'ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                                                            )}
                                                            disabled={isDisabled}
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </Badge>
                                                </div>
                                            </Tooltip>
                                        ) : (
                                            <Badge
                                                key={groupId}
                                                variant="secondary"
                                                className={cn(
                                                    'flex items-center gap-1',
                                                    isManagement && role.name === 'Management' && 'opacity-50',
                                                )}
                                            >
                                                {role.name}
                                                <button
                                                    type="button"
                                                    onClick={() => handleGroupSelect(groupId)}
                                                    className={cn(
                                                        'ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                                                    )}
                                                    disabled={isDisabled}
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </Badge>
                                        )
                                    ) : null;
                                })}
                            </div>
                            {isManagement && (
                                <>
                                    <Select
                                        onValueChange={(value) => handleGroupSelect(Number(value))}
                                        disabled={
                                            isUpdating ||
                                            !isManagement ||
                                            form.getValues('groups')?.length === MAX_ROLES
                                        }
                                    >
                                        <FormControl>
                                            <SelectTrigger disabledInfo={disabledInfoRoles}>
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
                                                            <SelectItem
                                                                value={role.id.toString()}
                                                                disabled={isDisabled}
                                                            >
                                                                {role.name}
                                                            </SelectItem>
                                                        </div>
                                                    </Tooltip>
                                                ) : (
                                                    <SelectItem
                                                        key={role.id}
                                                        value={role.id.toString()}
                                                        disabled={isDisabled}
                                                    >
                                                        {role.name}
                                                    </SelectItem>
                                                );
                                            })}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        Select the roles for this user. You can select multiple roles.
                                    </FormDescription>
                                </>
                            )}
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" loading={isUpdating}>
                    {isUpdating ? 'Updating...' : 'Update profile'}
                </Button>
            </form>
        </Form>
    );
}
