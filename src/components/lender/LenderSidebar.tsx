'use client';
import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarFooter,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/shared/Logo';
import { LayoutDashboard, Users, Settings, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePathname } from 'next/navigation';

export function LenderSidebar() {
    const pathname = usePathname();

    return (
        <Sidebar className="bg-white border-r">
            <SidebarHeader>
                <div className="flex items-center justify-between">
                    <Logo inHeader={false} />
                    <SidebarTrigger />
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton href="/lender/dashboard" isActive={pathname === '/lender/dashboard'} tooltip="Dashboard">
                            <LayoutDashboard />
                            <span>Dashboard</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton href="/lender/applicants" isActive={pathname.startsWith('/lender/applicants')} tooltip="Applicants">
                            <Users />
                            <span>Applicants</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton href="#" tooltip="Settings">
                            <Settings />
                            <span>Settings</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                         <SidebarMenuButton href="/login" tooltip="Logout">
                            <LogOut />
                            <span>Logout</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton>
                            <Avatar className="h-8 w-8">
                                <AvatarImage src="https://picsum.photos/seed/lender/100/100" alt="Lender" data-ai-hint="person professional" />
                                <AvatarFallback>LO</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className='font-semibold'>Loan Officer</span>
                                <span className='text-xs text-sidebar-foreground/70'>officer@quickscore.com</span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
