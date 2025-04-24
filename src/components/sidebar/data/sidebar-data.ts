import {
    IconBrowserCheck,
    IconCreditCard,
    IconHelp,
    IconLayoutDashboard,
    IconNotification,
    IconPalette,
    IconSchool,
    IconSettings,
    IconTool,
    IconUserCog,
    IconUsers,
} from '@tabler/icons-react';
import { type SidebarData } from '../types';

export const sidebarData: SidebarData = {
    navGroups: [
        {
            title: 'Administration',
            items: [
                {
                    title: 'Dashboard',
                    url: '/dashboard',
                    icon: IconLayoutDashboard,
                },

                {
                    title: 'Student Profile',
                    url: '/student-profile',
                    icon: IconSchool,
                },
                {
                    title: 'Payment Plan',
                    url: '/',
                    icon: IconCreditCard,
                },
            ],
        },
        {
            title: 'Management',
            items: [
                {
                    title: 'Staff Management',
                    url: '/staff-management',
                    icon: IconUsers,
                },
            ],
        },

        {
            title: 'Other',
            items: [
                {
                    title: 'Settings',
                    icon: IconSettings,
                    items: [
                        {
                            title: 'Profile',
                            url: '/settings/profile',
                            icon: IconUserCog,
                        },
                        {
                            title: 'Account',
                            url: '/settings',
                            icon: IconTool,
                        },
                        {
                            title: 'Appearance',
                            url: '/settings/appearance',
                            icon: IconPalette,
                        },
                        {
                            title: 'Notifications',
                            url: '/settings',
                            icon: IconNotification,
                        },
                        {
                            title: 'Display',
                            url: '/settings',
                            icon: IconBrowserCheck,
                        },
                    ],
                },
                {
                    title: 'Help Center',
                    url: '/',
                    icon: IconHelp,
                },
            ],
        },
    ],
};
