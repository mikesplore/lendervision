'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { CheckCircle, Lock, Clock, Users, Zap } from 'lucide-react';

export default function LenderSuccessPage() {
  const institutionData = {
    name: 'FastCredit Finance Ltd',
    adminName: 'John Smith',
    status: 'PENDING_COMPLIANCE_REVIEW',
    productsConfigured: 1,
    registrationDate: new Date().toLocaleDateString(),
  };

  return (
    <div className="space-y-8">
      {/* Success Banner */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-8 pb-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center animate-bounce">
              <CheckCircle className="h-10 w-10 text-blue-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-blue-900">Almost There!</h2>
              <p className="text-blue-700 mt-2">
                Your information has been submitted for review
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Your Institution Setup Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {/* Institution Info */}
            <div className="flex items-start justify-between pb-4 border-b">
              <div>
                <p className="text-sm text-muted-foreground">Institution Name</p>
                <p className="text-lg font-semibold">{institutionData.name}</p>
              </div>
              <Badge className="bg-green-100 text-green-800">Submitted</Badge>
            </div>

            {/* Admin Info */}
            <div className="flex items-start justify-between pb-4 border-b">
              <div>
                <p className="text-sm text-muted-foreground">Super Admin</p>
                <p className="text-lg font-semibold">{institutionData.adminName}</p>
              </div>
              <Badge className="bg-green-100 text-green-800">Verified</Badge>
            </div>

            {/* Products */}
            <div className="flex items-start justify-between pb-4 border-b">
              <div>
                <p className="text-sm text-muted-foreground">Loan Products Configured</p>
                <p className="text-lg font-semibold">{institutionData.productsConfigured}</p>
              </div>
              <Badge className="bg-green-100 text-green-800">Ready</Badge>
            </div>

            {/* Status */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Compliance Review Status</p>
                <p className="text-lg font-semibold">Pending Review</p>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800">
                <Clock className="h-3 w-3 mr-1" />
                2-5 Business Days
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What Happens Next */}
      <Card>
        <CardHeader>
          <CardTitle>What Happens Next?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="font-semibold">Compliance Review (2-5 days)</h4>
                <p className="text-sm text-muted-foreground">
                  Our team reviews your documentation to ensure you meet lending regulations.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-semibold">Email Confirmation</h4>
                <p className="text-sm text-muted-foreground">
                  You'll receive an email once your account is approved.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="font-semibold">Access Lender Dashboard</h4>
                <p className="text-sm text-muted-foreground">
                  Start reviewing loan applications and funding loans on QuickScore.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Features */}
      <Card>
        <CardHeader>
          <CardTitle>What You'll Be Able to Do</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex gap-3">
              <Zap className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Review Applications</p>
                <p className="text-xs text-muted-foreground">Access detailed borrower profiles and assessments</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Lock className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Manage Loan Disbursal</p>
                <p className="text-xs text-muted-foreground">Approve loans and manage fund transfers</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Users className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Team Management</p>
                <p className="text-xs text-muted-foreground">Invite additional admins and loan officers</p>
              </div>
            </div>

            <div className="flex gap-3">
              <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Track Repayments</p>
                <p className="text-xs text-muted-foreground">Monitor loan performance and repayment status</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6 space-y-3">
          <h4 className="font-semibold text-blue-900">Questions?</h4>
          <p className="text-sm text-blue-800">
            Our support team is here to help. Contact us at <strong>support@quickscore.com</strong> or call <strong>+254 XXX XXX XXX</strong>
          </p>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        <Button asChild size="lg" className="w-full">
          <Link href="/">
            Return to Home
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="w-full">
          <Link href="/login">
            Log In to Dashboard
          </Link>
        </Button>
      </div>

      {/* Email Sent */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <p className="text-sm text-green-900">
            📧 <strong>Confirmation email sent</strong> to your registered email address with your setup summary and next steps.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
