/**
 * Assessment Result Display Component
 * Shows comprehensive AI assessment with detailed reasoning
 */

'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  Shield,
  DollarSign,
  Calendar,
  Percent,
  Lightbulb,
  AlertTriangle
} from 'lucide-react';

interface CreditAssessmentResult {
  creditScore: number;
  approvalStatus: 'approved' | 'conditionally-approved' | 'rejected' | 'under-review';
  loanRecommendation: {
    minAmount: number;
    maxAmount: number;
    interestRateMin: number;
    interestRateMax: number;
    termMin: number;
    termMax: number;
  } | null;
  riskLevel: 'low' | 'medium' | 'high' | 'very-high';
  scoringFactors: {
    identityVerification: { score: number; weight: number; status: string };
    incomeStability: { score: number; weight: number; status: string };
    debtToIncome: { score: number; weight: number; status: string };
    paymentHistory: { score: number; weight: number; status: string };
    financialBehavior: { score: number; weight: number; status: string };
    employmentHistory: { score: number; weight: number; status: string };
  };
  keyInsights: string[];
  strengths: string[];
  weaknesses: string[];
  improvementSuggestions: string[];
  rejectionReasons: string[];
  conditionalRequirements: string[];
  metrics: {
    averageMonthlyIncome: number;
    averageMonthlyExpenses: number;
    savingsRate: number;
    debtBurden: number;
    transactionConsistency: number;
    incomeVolatility: number;
  };
}

interface AssessmentResultProps {
  result: CreditAssessmentResult;
  onViewLoans?: () => void;
  onReturnToDashboard?: () => void;
}

export function AssessmentResult({
  result,
  onViewLoans,
  onReturnToDashboard
}: AssessmentResultProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500';
      case 'conditionally-approved':
        return 'bg-yellow-500';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="h-8 w-8 text-green-500" />;
      case 'conditionally-approved':
        return <AlertCircle className="h-8 w-8 text-yellow-500" />;
      case 'rejected':
        return <XCircle className="h-8 w-8 text-red-500" />;
      default:
        return <AlertCircle className="h-8 w-8 text-blue-500" />;
    }
  };

  const getRiskBadge = (risk: string) => {
    const colors = {
      low: 'bg-green-500',
      medium: 'bg-yellow-500',
      high: 'bg-orange-500',
      'very-high': 'bg-red-500'
    };
    return (
      <Badge className={colors[risk as keyof typeof colors]}>
        {risk.toUpperCase()} RISK
      </Badge>
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Main Status Card */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {getStatusIcon(result.approvalStatus)}
              <div>
                <CardTitle className="text-2xl">
                  {result.approvalStatus === 'approved' && 'Congratulations! You\'re Approved'}
                  {result.approvalStatus === 'conditionally-approved' && 'Conditionally Approved'}
                  {result.approvalStatus === 'rejected' && 'Application Not Approved'}
                  {result.approvalStatus === 'under-review' && 'Under Review'}
                </CardTitle>
                <CardDescription className="mt-1">
                  {result.approvalStatus === 'approved' && 'Your loan application has been approved'}
                  {result.approvalStatus === 'conditionally-approved' && 'Additional verification required'}
                  {result.approvalStatus === 'rejected' && 'We couldn\'t approve your application at this time'}
                  {result.approvalStatus === 'under-review' && 'Our team is reviewing your application'}
                </CardDescription>
              </div>
            </div>
            {getRiskBadge(result.riskLevel)}
          </div>
        </CardHeader>
        <CardContent>
          {/* Credit Score */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Credit Score</span>
                <span className={`text-3xl font-bold ${getScoreColor(result.creditScore)}`}>
                  {result.creditScore}/100
                </span>
              </div>
              <Progress value={result.creditScore} className="h-3" />
            </div>

            {/* Loan Recommendation */}
            {result.loanRecommendation && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <CardDescription>Loan Amount</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      KES {result.loanRecommendation.minAmount.toLocaleString()} - {result.loanRecommendation.maxAmount.toLocaleString()}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Percent className="h-4 w-4 text-muted-foreground" />
                      <CardDescription>Interest Rate</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {result.loanRecommendation.interestRateMin}% - {result.loanRecommendation.interestRateMax}% p.a.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <CardDescription>Repayment Term</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {result.loanRecommendation.termMin} - {result.loanRecommendation.termMax} months
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Rejection Reasons (if rejected) */}
      {result.rejectionReasons.length > 0 && (
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <CardTitle className="text-lg">Reasons for Rejection</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.rejectionReasons.map((reason, index) => (
                <li key={index} className="flex items-start gap-2 text-red-700 dark:text-red-400">
                  <XCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Conditional Requirements */}
      {result.conditionalRequirements.length > 0 && (
        <Card className="border-yellow-200 dark:border-yellow-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <CardTitle className="text-lg">Additional Requirements</CardTitle>
            </div>
            <CardDescription>
              Please provide the following to complete your application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.conditionalRequirements.map((req, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Minus className="h-5 w-5 mt-0.5 text-yellow-500 flex-shrink-0" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Scoring Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Score Breakdown</CardTitle>
          <CardDescription>How we calculated your credit score</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(result.scoringFactors).map(([key, factor]) => (
              <div key={key}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <Badge variant="outline">{factor.weight}% weight</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${getScoreColor(factor.score)}`}>
                      {factor.score}/100
                    </span>
                    <Badge>{factor.status}</Badge>
                  </div>
                </div>
                <Progress value={factor.score} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        {result.strengths.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <CardTitle className="text-lg">Your Strengths</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {result.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2 text-green-700 dark:text-green-400">
                    <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Weaknesses */}
        {result.weaknesses.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-red-500" />
                <CardTitle className="text-lg">Areas to Improve</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {result.weaknesses.map((weakness, index) => (
                  <li key={index} className="flex items-start gap-2 text-red-700 dark:text-red-400">
                    <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span>{weakness}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      {/* AI Insights */}
      {result.keyInsights.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-lg">AI-Generated Insights</CardTitle>
            </div>
            <CardDescription>
              Personalized recommendations from our AI analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {result.keyInsights.map((insight, index) => (
                <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted">
                  <span className="font-bold text-blue-500 mt-0.5">{index + 1}.</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Improvement Suggestions */}
      {result.improvementSuggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">How to Improve Your Score</CardTitle>
            <CardDescription>
              Follow these recommendations to increase your chances next time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.improvementSuggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Lightbulb className="h-5 w-5 mt-0.5 text-yellow-500 flex-shrink-0" />
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-4 justify-center">
        {result.approvalStatus === 'approved' && onViewLoans && (
          <Button size="lg" onClick={onViewLoans}>
            <DollarSign className="mr-2 h-5 w-5" />
            View Available Loans
          </Button>
        )}
        {onReturnToDashboard && (
          <Button variant="outline" size="lg" onClick={onReturnToDashboard}>
            Return to Dashboard
          </Button>
        )}
      </div>
    </div>
  );
}
