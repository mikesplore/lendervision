'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Download, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/contexts/AuthContext';
import { getBorrowerData, BorrowerData } from '@/lib/firestore';
import { useRouter } from 'next/navigation';

export default function BorrowerDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [borrowerData, setBorrowerData] = useState<BorrowerData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBorrowerData = async () => {
      if (!authLoading && !user) {
        router.push('/auth/login-flow');
        return;
      }

      if (user) {
        try {
          const data = await getBorrowerData(user.uid);
          setBorrowerData(data);
        } catch (error) {
          console.error("Error fetching borrower data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBorrowerData();
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-slate-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Empty state for new users
  if (!borrowerData || !borrowerData.personalInfo) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Welcome to QuickScore</h1>
              <p className="text-slate-600 mt-1">Complete your profile to get started</p>
            </div>
          </div>

          <Card className="border-2 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <AlertCircle className="w-16 h-16 text-slate-400 mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No Profile Data</h3>
              <p className="text-slate-600 mb-6 max-w-md">
                You haven't completed your profile yet. Complete your profile to receive personalized loan recommendations and eligibility assessment.
              </p>
              <Link href="/borrower/apply/identity">
                <Button size="lg">
                  Complete Your Profile
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const { 
    personalInfo, 
    eligibilityScore = 0, 
    riskRating, 
    verification, 
    assessment,
    loanDetails,
    financialSummary,
    incomeData = []
  } = borrowerData;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Individual Borrower Dashboard</h1>
              <p className="text-sm text-muted-foreground">Your loan assessment profile</p>
            </div>
          </div>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-semibold">{personalInfo?.fullName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-semibold">{personalInfo?.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-semibold">{personalInfo?.phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ID Number</p>
                <p className="font-semibold">{personalInfo?.idNumber || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assessment and Risk Rating */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Loan Eligibility Assessment */}
          <Card>
            <CardHeader>
              <CardTitle>Loan Eligibility Assessment</CardTitle>
              <CardDescription>AI-generated comprehensive scoring</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Eligibility Score</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-primary">{eligibilityScore}</span>
                    <span className="text-muted-foreground">out of 100</span>
                  </div>
                </div>
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="10"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="10"
                      strokeDasharray={`${eligibilityScore * 2.83} 283`}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                    <text x="50" y="55" textAnchor="middle" className="text-xl font-bold fill-primary">
                      {eligibilityScore}%
                    </text>
                  </svg>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Credit Score</span>
                  <div className="flex items-center gap-2">
                    <Progress value={assessment?.creditScore || 0} className="w-32 h-2" />
                    {(assessment?.creditScore || 0) >= 80 && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Income Stability</span>
                  <div className="flex items-center gap-2">
                    <Progress value={assessment?.incomeStability || 0} className="w-32 h-2" />
                    {(assessment?.incomeStability || 0) >= 80 && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Debt-to-Income</span>
                  <div className="flex items-center gap-2">
                    <Progress value={assessment?.debtToIncome || 0} className="w-32 h-2" />
                    {(assessment?.debtToIncome || 0) >= 80 && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Employment History</span>
                  <div className="flex items-center gap-2">
                    <Progress value={assessment?.employmentHistory || 0} className="w-32 h-2" />
                    {(assessment?.employmentHistory || 0) >= 80 && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Savings Ratio</span>
                  <div className="flex items-center gap-2">
                    <Progress value={assessment?.savingsRatio || 0} className="w-32 h-2" />
                    {(assessment?.savingsRatio || 0) >= 80 && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Rating */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Rating</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-center">
                <Badge variant="outline" className="text-green-600 border-green-600 px-6 py-2 text-lg">
                  {riskRating?.level || 'N/A'}
                </Badge>
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Default Probability</p>
                <p className="text-4xl font-bold text-red-600">{riskRating?.defaultProbability || 0}%</p>
              </div>

              <div>
                <p className="text-sm font-semibold mb-3">Verification Status</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm">Identity Verified</span>
                    {verification?.identityVerified ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <span className="text-xs text-muted-foreground">Pending</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm">Income Verified</span>
                    {verification?.incomeVerified ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <span className="text-xs text-muted-foreground">Pending</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm">Credit Score Verified</span>
                    {verification?.creditScoreVerified ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <span className="text-xs text-muted-foreground">Pending</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm">Employment Verified</span>
                    {verification?.employmentVerified ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <span className="text-xs text-muted-foreground">Pending</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Loan Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recommended Loan Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{loanDetails?.recommendedAmount ? `${loanDetails.recommendedAmount.toLocaleString()} KES` : 'N/A'}</p>
              <p className="text-sm text-muted-foreground mt-1">Based on income and affordability</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Interest Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">{loanDetails?.interestRate ? `${loanDetails.interestRate}%` : 'N/A'}</p>
              <p className="text-sm text-muted-foreground mt-1">Per annum (p.a.)</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Debt-to-Income Ratio</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">{loanDetails?.debtToIncomeRatio ? `${loanDetails.debtToIncomeRatio}%` : 'N/A'}</p>
              <p className="text-sm text-muted-foreground mt-1">Below 40% threshold</p>
            </CardContent>
          </Card>
        </div>

        {/* Financial Summary and Income Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Financial Summary</CardTitle>
              <CardDescription>Monthly financial metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Monthly Income</span>
                  <span className="font-semibold">{financialSummary?.monthlyIncome ? `${financialSummary.monthlyIncome.toLocaleString()} KES` : 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Monthly Expenses</span>
                  <span className="font-semibold">{financialSummary?.monthlyExpenses ? `${financialSummary.monthlyExpenses.toLocaleString()} KES` : 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center border-t pt-4">
                  <span className="text-sm text-muted-foreground">Net Savings</span>
                  <span className="font-semibold text-green-600">{financialSummary?.monthlySavings ? `${financialSummary.monthlySavings.toLocaleString()} KES` : 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Savings Rate</span>
                  <span className="font-semibold">{financialSummary?.savingsRate ? `${financialSummary.savingsRate}%` : 'N/A'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Income Trend (6 Months)</CardTitle>
              <CardDescription>Historical income stability</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={incomeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="income" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
