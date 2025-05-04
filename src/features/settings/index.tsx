import { Outlet } from '@tanstack/react-router';
import { IconPalette, IconUser } from '@tabler/icons-react';
import { Separator } from '@/components/ui/separator';
import { Search } from '@/components/search';
import { Header } from '@/components/sidebar/Header';
import { Main } from '@/layout/main';
// import { ThemeSwitch } from '@/components/theme-switch';
import SidebarNav from '@/components/sidebar-nav';

export default function Settings() {
    return (
        <div className="flex h-screen flex-col">
            <Header>
                <Search />
            </Header>

            <Main>
                <div className="space-y-0.5">
                    <h1 className="text-xl font-bold tracking-tight md:text-2xl">Settings</h1>
                    <p className="text-muted-foreground text-sm md:text-base">
                        Manage your account settings and preferences.
                    </p>
                </div>
                <Separator className="my-4 lg:my-6" />
                <div className="flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-y-0 lg:space-x-12">
                    <aside className="top-0 lg:sticky lg:w-1/5">
                        <SidebarNav items={sidebarNavItems} />
                    </aside>
                    <div className="flex-1 overflow-y-auto p-1">
                        <Outlet />
                    </div>
                </div>
            </Main>
        </div>
    );
}

const sidebarNavItems = [
    {
        title: 'Profile',
        icon: <IconUser size={18} />,
        href: '/settings/profile',
    },

    {
        title: 'Appearance',
        icon: <IconPalette size={18} />,
        href: '/settings/appearance',
    },
];
