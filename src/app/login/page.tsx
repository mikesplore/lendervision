'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/shared/Logo";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center w-full max-w-sm p-4">
        <div className="mb-8">
          <Logo />
        </div>
        <Card className="w-full">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to your QuickScore account</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email or Phone</Label>
              <Input id="email" type="text" placeholder="m@example.com or +254712345678" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full">
                Sign In
            </Button>
            <div className="text-sm text-center text-muted-foreground space-y-2">
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
