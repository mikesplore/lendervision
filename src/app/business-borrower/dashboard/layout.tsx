import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { BusinessBorrowerSidebar } from "@/components/borrower/BusinessBorrowerSidebar";

export default function BusinessBorrowerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white min-h-screen">
      <SidebarProvider defaultOpen={true}>
        <BusinessBorrowerSidebar />
        <SidebarInset className="bg-white">
          {children}
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
