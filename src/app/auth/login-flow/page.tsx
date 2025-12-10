'use client';

import { Button } from '@/components/ui/button';
import { Logo } from '@/components/shared/Logo';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import Image from 'next/image';

export default function LoginFlowPage() {
  const borrowerTypes = [
    {
      id: 'individual',
      title: 'Individual Borrower',
      subtitle: 'Personal Loans',
      description: 'Apply for a personal loan with your financial information. Get a decision in minutes.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop',
      benefits: ['Fast approval', 'Instant assessment', 'Flexible terms'],
          href: '/auth/login?role=individual',
      color: 'from-blue-500/10 to-blue-600/10',
      accentColor: 'text-blue-600',
      borderColor: 'border-blue-200/50'
    },
    {
      id: 'business',
      title: 'Business Borrower',
      subtitle: 'Business Loans',
      description: 'Apply for a business loan with your company information. Grow your business faster.',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=500&fit=crop',
      benefits: ['Business growth', 'Quick verification', 'Competitive rates'],
          href: '/auth/login?role=business',
      color: 'from-green-500/10 to-emerald-600/10',
      accentColor: 'text-green-600',
      borderColor: 'border-green-200/50'
    },
    {
      id: 'lender',
      title: 'Lender',
      subtitle: 'Investment Opportunity',
      description: 'Join our platform as a lender and generate returns by funding loans.',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=500&fit=crop',
      benefits: ['High returns', 'Verified borrowers', 'Easy management'],
          href: '/auth/login?role=lender',
      color: 'from-purple-500/10 to-indigo-600/10',
      accentColor: 'text-purple-600',
      borderColor: 'border-purple-200/50'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <Logo />
          <Button asChild variant="outline" size="sm">
            <Link href="/">Back Home</Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
              Choose Your Role
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Whether you're looking for a loan or investment opportunities, we have the perfect solution for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {borrowerTypes.map((type) => (
              <Link key={type.id} href={type.href}>
                <div className={`group relative bg-white rounded-2xl overflow-hidden border-2 ${type.borderColor} shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer h-full`}>
                  {/* Image Container */}
                  <div className={`relative h-56 bg-gradient-to-br ${type.color} overflow-hidden`}>
                    <Image
                      src={type.image}
                      alt={type.title}
                      width={500}
                      height={500}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="p-8 space-y-6">
                    <div>
                      <p className={`text-xs font-bold tracking-widest uppercase ${type.accentColor}`}>
                        {type.subtitle}
                      </p>
                      <h3 className="text-2xl font-bold text-slate-900 mt-2">
                        {type.title}
                      </h3>
                    </div>

                    <p className="text-slate-600 text-sm leading-relaxed">
                      {type.description}
                    </p>

                    {/* Benefits */}
                    <div className="space-y-3">
                      {type.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-slate-700">{benefit}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <Button className="w-full mt-6 group/btn rounded-lg" asChild>
                      <span>
                        Get Started
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </span>
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 mt-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 text-center text-sm text-slate-600">
          <p>QuickScore &copy; {new Date().getFullYear()}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
