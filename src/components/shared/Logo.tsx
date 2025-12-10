import { HandCoins } from 'lucide-react';
import Link from 'next/link';

export function Logo({ inHeader = true }: { inHeader?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2 outline-none">
      <HandCoins className={`h-8 w-8 text-primary`} />
      <span className={`text-2xl font-bold ${inHeader ? 'text-foreground' : 'text-sidebar-foreground'}`}>LenderVision</span>
    </Link>
  );
}
