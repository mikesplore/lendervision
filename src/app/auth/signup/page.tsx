'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/shared/Logo';
import Link from 'next/link';
import { ArrowRight, Users, Building2, DollarSign } from 'lucide-react';

export default function SignUpPage() {
  const [signupMethod, setSignupMethod] = useState<'phone' | 'email'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userRole, setUserRole] = useState<'individual' | 'business' | 'lender' | null>(null);
  const [step, setStep] = useState<'role' | 'method' | 'otp'>('role');
  const [loading, setLoading] = useState(false);

  const roles = [
    {
      id: 'individual',
      title: 'Personal Borrower',
      icon: Users,
      description: 'Get a personal loan based on your financial activity',
      color: 'text-blue-600',
      onboardingPath: '/borrower/onboard/individual/identity',
    },
    {
      id: 'business',
      title: 'Business Borrower',
      icon: Building2,
      description: 'Grow your business with tailored financing',
      color: 'text-green-600',
      onboardingPath: '/borrower/onboard/business/info',
    },
    {
      id: 'lender',
      title: 'Lender',
      icon: DollarSign,
      description: 'Fund loans and earn competitive returns',
      color: 'text-purple-600',
      onboardingPath: '/lender/onboard/info',
    },
  ];

  const getOnboardingPath = () => {
    const role = roles.find((r) => r.id === userRole);
    return role?.onboardingPath || '/borrower/dashboard';
  };

  const handlePhoneSubmit = async () => {
    setLoading(true);
    // TODO: Implement phone OTP send
    console.log('Sending OTP to:', phoneNumber);
    setStep('otp');
    setLoading(false);
  };

  const handleOtpVerify = async () => {
    setLoading(true);
    // TODO: Implement OTP verification
    console.log('Verifying OTP:', otp);
    // TODO: Save userRole to database with account
    window.location.href = getOnboardingPath();
    setLoading(false);
  };

  const handleEmailSignup = async () => {
    setLoading(true);
    // TODO: Implement email sign-up
    console.log('Creating account with email:', email);
    // TODO: Save userRole to database with account
    window.location.href = getOnboardingPath();
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center w-full max-w-md p-4">
        <div className="mb-8">
          <Logo />
        </div>

        <Card className="w-full">
          {step === 'role' && (
            <>
              <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl">Who are you?</CardTitle>
                <CardDescription>Select your role to get started</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {roles.map((role) => {
                  const IconComponent = role.icon;
                  return (
                    <button
                      key={role.id}
                      onClick={() => {
                        setUserRole(role.id as 'individual' | 'business' | 'lender');
                        setStep('method');
                      }}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        userRole === role.id
                          ? 'border-primary bg-primary/5'
                          : 'border-slate-200 hover:border-primary'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <IconComponent className={`w-6 h-6 mt-1 ${role.color} flex-shrink-0`} />
                        <div>
                          <h3 className="font-semibold text-slate-900">{role.title}</h3>
                          <p className="text-sm text-slate-600 mt-1">{role.description}</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-slate-300 ml-auto mt-1 flex-shrink-0" />
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </>
          )}

          {step === 'method' && (
            <>
              <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl">Create Your Account</CardTitle>
                <CardDescription>Join thousands getting instant loan decisions</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label>Choose your sign-up method</Label>
                    <div className="grid gap-2">
                      <Button
                        variant={signupMethod === 'phone' ? 'default' : 'outline'}
                        onClick={() => setSignupMethod('phone')}
                        className="w-full justify-start"
                      >
                        {signupMethod === 'phone' ? '✓ ' : ''} Phone Number + OTP
                      </Button>
                      <Button
                        variant={signupMethod === 'email' ? 'default' : 'outline'}
                        onClick={() => setSignupMethod('email')}
                        className="w-full justify-start"
                      >
                        {signupMethod === 'email' ? '✓ ' : ''} Email + Password
                      </Button>
                    </div>
                  </div>
                </div>

                {signupMethod === 'phone' ? (
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+254712345678"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Enter your phone number in E.164 format (e.g., +254712345678)
                      </p>
                    </div>
                    <Button
                      onClick={handlePhoneSubmit}
                      disabled={!phoneNumber || loading}
                      className="w-full"
                    >
                      {loading ? 'Sending...' : 'Send OTP'} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="At least 8 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="confirm">Confirm Password</Label>
                      <Input
                        id="confirm"
                        type="password"
                        placeholder="Re-enter your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                    <Button
                      onClick={handleEmailSignup}
                      disabled={!email || !password || password !== confirmPassword || loading}
                      className="w-full"
                    >
                      {loading ? 'Creating...' : 'Create Account'} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setStep('role')}
                >
                  Back
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Link href="/auth/login" className="underline hover:text-primary">
                    Sign In
                  </Link>
                </div>
              </CardContent>
            </>
          )}

          {step === 'otp' && (
            <>
              <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl">Verify Your Number</CardTitle>
                <CardDescription>We've sent a code to your phone</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    We've sent a 6-digit code to <strong>{phoneNumber}</strong>
                  </p>
                  <div className="grid gap-2">
                    <Label htmlFor="otp">Enter OTP</Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="000000"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="text-center text-2xl tracking-widest"
                    />
                  </div>
                  <Button
                    onClick={handleOtpVerify}
                    disabled={otp.length !== 6 || loading}
                    className="w-full"
                  >
                    {loading ? 'Verifying...' : 'Verify OTP'} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setStep('method')}
                  >
                    Change Number
                  </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  Didn't receive the code?{' '}
                  <Button variant="link" className="p-0 h-auto" disabled={loading}>
                    Resend OTP
                  </Button>
                </div>
              </CardContent>
            </>
          )}
        </Card>

        <div className="text-center text-xs text-muted-foreground mt-6">
          By signing up, you agree to our{' '}
          <Link href="#" className="underline hover:text-primary">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="#" className="underline hover:text-primary">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
