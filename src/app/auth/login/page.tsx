'use client';

import { useState, Suspense } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/shared/Logo";
import Link from "next/link";
import { useRouter, useSearchParams } from 'next/navigation';
import { Badge } from "@/components/ui/badge";
import { signInWithEmail } from "@/lib/auth";
import { getUserProfile } from "@/lib/firestore";
import { useToast } from "@/hooks/use-toast";

const roleLabels: Record<string, string> = {
  individual: 'Individual Borrower',
  business: 'Business Borrower',
  lender: 'Lender',
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const roleParam = searchParams.get('role') || 'individual';
  const selectedRole = ['individual', 'business', 'lender'].includes(roleParam) ? roleParam : 'individual';

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
      const role = userProfile.role;
      switch (role) {
        case 'individual':
        case 'business':
          router.push('/borrower/dashboard');
          break;
        case 'lender':
          router.push('/lender/dashboard');
          break;
        default:
          router.push('/');
      }
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
            <Badge variant="outline" className="mx-auto w-fit">{roleLabels[selectedRole]}</Badge>
            <CardTitle className="text-2xl">Sign In</CardTitle>
            <CardDescription>Enter your credentials to continue</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
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
                    Want to choose a different role? <Link href="/auth/login-flow" className="underline hover:text-primary font-medium">Back to role selection</Link>
                </p>
                <p>
                    Don't have an account? <Link href="/auth/signup" className="underline hover:text-primary font-medium">Create one</Link>
                </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default function AuthLoginPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
