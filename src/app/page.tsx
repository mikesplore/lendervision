'use client';

import { Button } from '@/components/ui/button';
import { Logo } from '@/components/shared/Logo';
import Link from 'next/link';
import { ArrowRight, TrendingUp, Shield, Zap as Lightning, Users, CheckCircle2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <Logo />
          <Button asChild variant="outline" size="sm">
            <Link href="/auth/login-flow">Sign In</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 md:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 w-fit">
                  <Lightning className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-semibold text-blue-300">AI-Powered Financial Solutions</span>
                </div>
                
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                  Instant Loan Assessment
                </h1>
                
                <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-lg">
                  Get instant loan decisions powered by AI. Connect your financial data securely and receive a decision <span className="font-semibold text-white">in minutes, not days</span>.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/auth/signup">
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-slate-600 text-white hover:bg-slate-800">
                  <Link href="/auth/login-flow">Sign In</Link>
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-6 pt-8 border-t border-slate-700">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-400" />
                  <span className="text-sm text-slate-300">Bank-level Security</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span className="text-sm text-slate-300">Instant Verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <span className="text-sm text-slate-300">Real-time Analytics</span>
                </div>
              </div>
            </div>

            {/* Right - Features Cards */}
            <div className="relative h-96 hidden md:flex items-center justify-center">
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 space-y-3 hover:bg-white/20 transition">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Lightning className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-white text-sm">Lightning Fast</h3>
                  <p className="text-xs text-slate-300">2-minute decision time</p>
                </div>

                <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 space-y-3 hover:bg-white/20 transition">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="font-semibold text-white text-sm">Secure</h3>
                  <p className="text-xs text-slate-300">Military-grade encryption</p>
                </div>

                <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 space-y-3 hover:bg-white/20 transition">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-white text-sm">Smart</h3>
                  <p className="text-xs text-slate-300">AI-powered assessment</p>
                </div>

                <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 space-y-3 hover:bg-white/20 transition">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-orange-400" />
                  </div>
                  <h3 className="font-semibold text-white text-sm">For Everyone</h3>
                  <p className="text-xs text-slate-300">Multiple user types</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <Logo />
              <p className="text-slate-600 text-sm mt-4">Instant loan assessment powered by AI.</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><Link href="#" className="hover:text-slate-900">Features</Link></li>
                <li><Link href="#" className="hover:text-slate-900">Pricing</Link></li>
                <li><Link href="#" className="hover:text-slate-900">Security</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><Link href="#" className="hover:text-slate-900">About</Link></li>
                <li><Link href="#" className="hover:text-slate-900">Blog</Link></li>
                <li><Link href="#" className="hover:text-slate-900">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><Link href="#" className="hover:text-slate-900">Privacy</Link></li>
                <li><Link href="#" className="hover:text-slate-900">Terms</Link></li>
                <li><Link href="#" className="hover:text-slate-900">Compliance</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-8 text-center text-sm text-slate-600">
            <p>QuickScore &copy; {new Date().getFullYear()}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
