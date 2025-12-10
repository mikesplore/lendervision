import Link from 'next/link';
import Image from 'next/image';

export function Logo({ inHeader = true }: { inHeader?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2 outline-none">
      <Image src="/logo/logo.png" alt="QuickScore" width={32} height={32} className="h-8 w-8" />
      <span className={`text-2xl font-bold ${inHeader ? 'text-foreground' : 'text-sidebar-foreground'}`}>QuickScore</span>
    </Link>
  );
}
