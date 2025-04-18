import {
    IconBrowserCheck,
    IconCreditCard,
    IconHelp,
    IconLayoutDashboard,
    IconNotification,
    IconPalette,
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
                // {
                //     title: 'Tasks',
                //     url: '/',
                //     icon: IconChecklist,
                // },
                // {
                //     title: 'Apps',
                //     url: '/',
                //     icon: IconPackages,
                // },
                // {
                //     title: 'Chats',
                //     url: '/',
                //     badge: '3',
                //     icon: IconMessages,
                // },
                {
                    title: 'Student Profile',
                    url: '/student-profile',
                    icon: IconUsers,
                },
                {
                    title: 'Payment Plan',
                    url: '/',
                    icon: IconCreditCard,
                },
            ],
        },
        // {
        //     title: 'Pages',
        //     items: [
        //         {
        //             title: 'Auth',
        //             icon: IconLockAccess,
        //             items: [
        //                 {
        //                     title: 'Sign In',
        //                     url: '/',
        //                 },
        //             ],
        //         },
        //         {
        //             title: 'Errors',
        //             icon: IconBug,
        //             items: [
        //                 {
        //                     title: 'Unauthorized',
        //                     url: '/',
        //                     icon: IconLock,
        //                 },
        //                 {
        //                     title: 'Forbidden',
        //                     url: '/',
        //                     icon: IconUserOff,
        //                 },
        //                 {
        //                     title: 'Not Found',
        //                     url: '/',
        //                     icon: IconError404,
        //                 },
        //                 {
        //                     title: 'Internal Server Error',
        //                     url: '/',
        //                     icon: IconServerOff,
        //                 },
        //                 {
        //                     title: 'Maintenance Error',
        //                     url: '/',
        //                     icon: IconBarrierBlock,
        //                 },
        //             ],
        //         },
        //     ],
        // },
        {
            title: 'Other',
            items: [
                {
                    title: 'Settings',
                    icon: IconSettings,
                    items: [
                        {
                            title: 'Profile',
                            url: '/',
                            icon: IconUserCog,
                        },
                        {
                            title: 'Account',
                            url: '/',
                            icon: IconTool,
                        },
                        {
                            title: 'Appearance',
                            url: '/',
                            icon: IconPalette,
                        },
                        {
                            title: 'Notifications',
                            url: '/',
                            icon: IconNotification,
                        },
                        {
                            title: 'Display',
                            url: '/',
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
