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
import { LayoutDashboard, FileText, Building2, Settings, LogOut, TrendingUp, Calculator } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePathname } from 'next/navigation';

export function BusinessBorrowerSidebar() {
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
                        <SidebarMenuButton href="/business-borrower/dashboard" isActive={pathname === '/business-borrower/dashboard'} tooltip="Dashboard">
                            <LayoutDashboard />
                            <span>Dashboard</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton href="/borrower/onboard/business/identity" isActive={pathname.startsWith('/borrower/onboard/business')} tooltip="Apply for Business Loan">
                            <FileText />
                            <span>Apply for Loan</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton href="#" tooltip="Business Loans">
                            <Building2 />
                            <span>Business Loans</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton href="#" tooltip="Analytics">
                            <TrendingUp />
                            <span>Analytics</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton href="/borrower/onboard/business/assessment" isActive={pathname.includes('/assessment')} tooltip="Credit Assessment">
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
                                <AvatarImage src="https://picsum.photos/seed/business/100/100" alt="Business" data-ai-hint="office professional" />
                                <AvatarFallback>TS</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className='font-semibold'>Tech Solutions Ltd</span>
                                <span className='text-xs text-sidebar-foreground/70'>admin@techsolutions.com</span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
