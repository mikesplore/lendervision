import { Button } from '@/components/ui/button';
import { Logo } from '@/components/shared/Logo';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 md:p-6">
        <Logo />
      </header>
      <main className="flex-1 flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4">
          Instant Loan Assessment powered by AI.
        </h1>
        <p className="text-lg text-muted-foreground mb-2 max-w-2xl">
          Securely connect your financial data and let our intelligent platform build your profile.
        </p>
        <p className="mb-8 text-muted-foreground">
          Get a decision in minutes, not days.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/apply/identity">Start New Application</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/login">Log In (Existing Users)</Link>
          </Button>
        </div>
      </main>
      <footer className="p-4 text-center text-sm text-muted-foreground">
        <p>LenderVision &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
