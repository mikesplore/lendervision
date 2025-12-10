import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { LenderSidebar } from "@/components/lender/LenderSidebar";

export default function LenderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white min-h-screen">
      <SidebarProvider defaultOpen={true}>
        <LenderSidebar />
        <SidebarInset className="bg-white">
          {children}
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
