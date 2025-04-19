import { Link, useNavigate } from '@tanstack/react-router';
import { BadgeCheck, Bell, ChevronsUpDown, CreditCard, LogOut, Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { useLogout, useUser } from '@/lib/auth';
import { toast } from 'sonner';
import { tokenStorage } from '@/lib/token';
import { useUserStore } from '@/store/userSlice';

export function NavUser() {
    const { isMobile } = useSidebar();
    const logout = useLogout();
    const user = useUser();
    const navigate = useNavigate();
    const { setUser, setAuthenticated } = useUserStore();
    const handleLogout = async () => {
        console.log('Logging out...');

        const promise = logout.mutateAsync({});
        toast.promise(promise, {
            loading: 'Logging out...',
            success: 'Successfully logged out!',
            error: (err) => err.message || 'Failed to logout',
        });
        await promise;
        // Reset the store and clear tokens
        setUser(null);
        setAuthenticated(false);
        tokenStorage.clearTokens();
        // Navigate to login page
        navigate({ to: '/auth/login', search: { redirectTo: undefined } });
    };
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage
                                    src={user.data?.profile_photo}
                                    alt={user?.data?.first_name + ' ' + user?.data?.last_name}
                                />
                                <AvatarFallback className="rounded-lg">SN</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">
                                    {user.data?.first_name + ' ' + user.data?.last_name}
                                </span>
                                <span className="truncate text-xs">{user.data?.email}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        side={isMobile ? 'bottom' : 'right'}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage
                                        src={user.data?.profile_photo}
                                        alt={user.data?.first_name + ' ' + user.data?.last_name}
                                    />
                                    <AvatarFallback className="rounded-lg">SN</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">
                                        {user.data?.first_name + ' ' + user.data?.last_name}
                                    </span>
                                    <span className="truncate text-xs">{user.data?.email}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <Sparkles />
                                Upgrade to Pro
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem asChild>
                                <Link to="/settings/profile">
                                    <BadgeCheck />
                                    Account
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link to="/">
                                    <CreditCard />
                                    Billing
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link to="/">
                                    <Bell />
                                    Notifications
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                            <LogOut />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
