import { ColumnDef } from '@tanstack/react-table';
import { StudentProfile } from '../types/types';
import { CheckCircle2, Clock, Eye, Info } from 'lucide-react';
import { Tooltip } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const columns: ColumnDef<StudentProfile>[] = [
    {
        header: 'ID',
        accessorKey: 'id',
        cell: ({ row }) => {
            const { id } = row.original;
            return <p className="text-sm font-medium">{id}</p>;
        },
    },
    {
        header: () => (
            <div className="flex items-center gap-2">
                <span>Name & Email</span>
                <Tooltip message="Student's name and email address. Name might be null for some students.">
                    <Info className="h-4 w-4 text-muted-foreground" />
                </Tooltip>
            </div>
        ),
        accessorKey: 'name',
        cell: ({ row }) => {
            const { full_name, email, profile_photo, first_name, last_name } = row.original;
            return (
                <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={profile_photo || undefined} alt={full_name || email} />
                        <AvatarFallback>
                            {first_name?.[0]?.toUpperCase()}
                            {last_name?.[0]?.toUpperCase() || email?.[0].toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1">
                        {full_name ? (
                            <>
                                <p className="text-sm font-medium">{full_name}</p>
                                <p className="text-xs text-muted-foreground">{email}</p>
                            </>
                        ) : (
                            <p className="text-sm font-medium">{email}</p>
                        )}
                    </div>
                </div>
            );
        },
    },
    {
        header: 'Enrolled Courses',
        accessorKey: 'enrolledCourses',
        cell: ({ row }) => {
            const { number_of_subscribed_course } = row.original;
            return <p className="text-sm font-medium">{number_of_subscribed_course}</p>;
        },
    },
    {
        header: 'Reward Points',
        accessorKey: 'rewardPoints',
        cell: ({ row }) => {
            const { gamification_details } = row.original;
            return <p className="text-sm font-medium">{gamification_details.points || 0}</p>;
        },
    },
    {
        header: () => (
            <div className="flex items-center gap-2">
                <span>Profile Status</span>
                <Tooltip message="If the profile verification is pending, Admin/Student action may be required. Else no action is required.">
                    <Info className="h-4 w-4 text-muted-foreground" />
                </Tooltip>
            </div>
        ),
        accessorKey: 'profileStatus',
        cell: ({ row }) => {
            const { profile_verified } = row.original;
            const profileStatus = profile_verified === 'verified' ? 'Verified' : 'Pending';

            return (
                <div className="flex w-[100px] items-center">
                    {profileStatus === 'Pending' ? (
                        <Clock className="text-yellow-500 mr-2 h-4 w-4" />
                    ) : (
                        <CheckCircle2 className="text-green-500 mr-2 h-4 w-4" />
                    )}
                    <span>{profileStatus}</span>
                </div>
            );
        },
    },
    {
        header: () => (
            <div className="flex items-center gap-2">
                <span>Actions</span>
                <Tooltip message="View detailed student profile, including academic progress and program enrollment.">
                    <Info className="h-4 w-4 text-muted-foreground" />
                </Tooltip>
            </div>
        ),
        accessorKey: 'actions',
        cell: ({ row }) => {
            const { id } = row.original;
            return (
                <Button variant="outline" size="sm" key={id}>
                    <Eye className="h-4 w-4" />
                    <span>View</span>
                </Button>
            );
        },
    },
];
