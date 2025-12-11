'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { CheckCircle, TrendingUp, DollarSign, Percent, Clock, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function IndividualAssessmentPage() {
  const router = useRouter();
  
  // Redirect to first step if assessment data is not present
  useEffect(() => {
    const hasCompletedIdentity = sessionStorage.getItem('identityComplete');
    const hasCompletedDetails = sessionStorage.getItem('detailsComplete');
    const hasCompletedFinancials = sessionStorage.getItem('financialsComplete');
    
    // If user hasn't completed the previous steps, redirect to identity
    if (!hasCompletedIdentity || !hasCompletedDetails || !hasCompletedFinancials) {
      router.push('/borrower/onboard/individual/identity');
    }
  }, [router]);
  
  // Mock assessment data
  const assessment = {
    creditScore: 72,
    status: 'APPROVED',
    approvedLoanAmount: { min: 50000, max: 200000 },
    interestRateRange: { min: 12, max: 18 },
    repaymentPeriods: { min: 3, max: 24 },
    keyInsights: [
      'Your consistent income history over the past 6 months shows stability',
      'M-Pesa activity indicates regular cash flow patterns',
      'Recommended loan amount based on your monthly income: 100,000 - 150,000 KES',
      'You qualify for favorable interest rates due to your good financial health',
    ],
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'CONDITIONALLY_APPROVED':
        return 'bg-yellow-100 text-yellow-800';
      case 'UNDER_REVIEW':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return '✓ Approved';
      case 'CONDITIONALLY_APPROVED':
        return '⚠ Conditionally Approved';
      case 'UNDER_REVIEW':
        return '⏳ Under Review';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/borrower/onboard/individual/details')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Details
        </Button>
      </div>

      {/* Success Card */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-8 pb-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center animate-bounce">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-green-900">Assessment Complete!</h2>
              <p className="text-green-700 mt-2">Your credit assessment is ready</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assessment Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Your Assessment Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Credit Score */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Credit Score</h3>
              <p className="text-sm text-muted-foreground">0-100 scale</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-primary">{assessment.creditScore}</p>
              <Progress value={assessment.creditScore} className="w-32 mt-2" />
            </div>
          </div>

          <div className="border-t pt-6" />

          {/* Approval Status */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Assessment Status</h3>
              <p className="text-sm text-muted-foreground">Your application decision</p>
            </div>
            <Badge className={`text-lg px-4 py-2 ${getStatusColor(assessment.status)}`}>
              {getStatusLabel(assessment.status)}
            </Badge>
          </div>

          <div className="border-t pt-6" />

          {/* Loan Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Approved Amount */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-blue-600" />
                <p className="text-sm font-medium text-blue-900">Approved Loan Range</p>
              </div>
              <p className="text-2xl font-bold text-blue-900">
                {assessment.approvedLoanAmount.min.toLocaleString()} - {assessment.approvedLoanAmount.max.toLocaleString()} KES
              </p>
            </div>

            {/* Interest Rate */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Percent className="h-5 w-5 text-purple-600" />
                <p className="text-sm font-medium text-purple-900">Interest Rate</p>
              </div>
              <p className="text-2xl font-bold text-purple-900">
                {assessment.interestRateRange.min}% - {assessment.interestRateRange.max}% p.a.
              </p>
            </div>

            {/* Repayment Period */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-green-600" />
                <p className="text-sm font-medium text-green-900">Repayment Terms</p>
              </div>
              <p className="text-2xl font-bold text-green-900">
                {assessment.repaymentPeriods.min} - {assessment.repaymentPeriods.max} months
              </p>
            </div>
          </div>

          <div className="border-t pt-6" />

          {/* Key Insights */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Key Insights from Your Assessment
            </h3>
            <ul className="space-y-3">
              {assessment.keyInsights.map((insight, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="text-green-600 font-bold flex-shrink-0 mt-0.5">✓</span>
                  <span className="text-muted-foreground">{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Success Message & Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>🎉 Congratulations!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Your onboarding is complete! Now that your assessment is ready, you can explore available loans and apply.
          </p>
          <Button asChild className="w-full" size="lg">
            <Link href="/borrower/dashboard">
              Go to My Dashboard
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Email Confirmation */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <p className="text-sm text-blue-900">
            📧 <strong>A confirmation email has been sent</strong> to your registered email address with your complete assessment details.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
