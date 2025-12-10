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
import { LayoutDashboard, FileText, CreditCard, Settings, LogOut, Calculator } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePathname } from 'next/navigation';

export function BorrowerSidebar() {
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
                        <SidebarMenuButton href="/borrower/dashboard" isActive={pathname === '/borrower/dashboard'} tooltip="Dashboard">
                            <LayoutDashboard />
                            <span>Dashboard</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton href="/borrower/onboard/individual/identity" isActive={pathname.startsWith('/borrower/onboard')} tooltip="Apply for Loan">
                            <FileText />
                            <span>Apply for Loan</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton href="#" tooltip="My Loans">
                            <CreditCard />
                            <span>My Loans</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton href="/borrower/onboard/individual/assessment" isActive={pathname.includes('/assessment')} tooltip="Credit Assessment">
                            <Calculator />
                            <span>Assessment</span>
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
                         <SidebarMenuButton href="/auth/login" tooltip="Logout">
                            <LogOut />
                            <span>Logout</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton>
                            <Avatar className="h-8 w-8">
                                <AvatarImage src="https://picsum.photos/seed/borrower/100/100" alt="Borrower" data-ai-hint="person casual" />
                                <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className='font-semibold'>John Doe</span>
                                <span className='text-xs text-sidebar-foreground/70'>john@example.com</span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
