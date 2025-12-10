'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/shared/Logo';
import Link from 'next/link';
import { signInWithEmail } from '@/lib/auth';
import { getUserProfile } from '@/lib/firestore';
import { useToast } from '@/hooks/use-toast';

const roleLabels: Record<string, string> = {
  individual: 'Individual Borrower',
  business: 'Business Borrower',
  lender: 'Lender',
};

function LoginCredentialsForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const role = searchParams.get('role') || 'individual';
  const roleLabel = roleLabels[role] || 'Individual Borrower';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmail(email, password);
      const userProfile = await getUserProfile(userCredential.user.uid);

      if (!userProfile) {
        toast({
          title: "Profile Not Found",
          description: "User profile doesn't exist. Please contact support.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Redirect based on user's role
      const userRole = userProfile.role;
      const target = userRole === 'lender' ? '/lender/dashboard' : '/borrower/dashboard';
      router.push(target);
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="flex flex-col items-center w-full max-w-sm p-4">
        <div className="mb-8">
          <Logo />
        </div>
        <Card className="w-full">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl">Sign in as {roleLabel}</CardTitle>
            <CardDescription>Enter your credentials to continue</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email or Phone</Label>
              <Input
                id="email"
                type="text"
                placeholder="m@example.com or +254712345678"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              className="w-full"
              onClick={handleLogin}
              disabled={loading || !email || !password}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
            <div className="text-sm text-center text-muted-foreground space-y-2">
              <p>
                Not you? <Link href="/auth/login" className="underline hover:text-primary font-medium">Choose a different role</Link>
              </p>
              <p>
                Don't have an account? <Link href="/auth/signup" className="underline hover:text-primary font-medium">Create one</Link>
              </p>
              <p>
                <Link href="#" className="underline hover:text-primary">Forgot password?</Link>
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default function LoginCredentialsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    }>
      <LoginCredentialsForm />
    </Suspense>
  );
}
