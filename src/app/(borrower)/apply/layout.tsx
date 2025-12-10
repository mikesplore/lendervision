import { ApplicationProgress } from "@/components/borrower/ApplicationProgress";
import { Logo } from "@/components/shared/Logo";

export default function ApplyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="p-4 md:p-6 border-b">
        <Logo />
      </header>
      <main className="container mx-auto max-w-4xl py-8 md:py-12 px-4">
        <div className="mb-8 md:mb-12">
            <ApplicationProgress />
        </div>
        {children}
      </main>
    </div>
  );
}
