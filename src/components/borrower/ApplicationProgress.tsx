'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { UserCheck, Wallet, FileText, Check } from 'lucide-react';
import Link from 'next/link';

const steps = [
  { name: 'Identity', href: '/apply/identity', icon: UserCheck },
  { name: 'Financials', href: '/apply/financials', icon: Wallet },
  { name: 'Details', href: '/apply/details', icon: FileText },
];

export function ApplicationProgress() {
  const pathname = usePathname();
  const currentStepIndex = steps.findIndex(step => pathname === step.href);

  return (
    <nav aria-label="Progress">
      <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className="md:flex-1">
            {stepIdx <= currentStepIndex ? (
              <Link
                href={step.href}
                className="group flex flex-col border-l-4 border-primary py-2 pl-4 hover:border-primary-dark md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                aria-current={stepIdx === currentStepIndex ? 'step' : undefined}
              >
                <span className="text-sm font-medium text-primary">{step.name}</span>
                <span className="text-sm font-medium text-muted-foreground">Step {stepIdx + 1}</span>
              </Link>
            ) : (
              <div className="group flex flex-col border-l-4 border-border py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                <span className="text-sm font-medium text-muted-foreground">{step.name}</span>
                <span className="text-sm font-medium text-muted-foreground">Step {stepIdx + 1}</span>
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
