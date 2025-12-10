import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { LenderSidebar } from "@/components/lender/LenderSidebar";

export default function LenderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dark bg-background text-foreground min-h-screen">
      <SidebarProvider>
        <LenderSidebar />
        <SidebarInset>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
