import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { BorrowerSidebar } from "@/components/borrower/BorrowerSidebar";

export default function BorrowerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white min-h-screen">
      <SidebarProvider defaultOpen={true}>
        <BorrowerSidebar />
        <SidebarInset className="bg-white">
          {children}
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
