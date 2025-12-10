import { ai } from '../genkit';
import { z } from 'zod';
import { IdentityVerificationResult } from './identity-verification';
import { FinancialAnalysisResult } from './financial-analysis';

// Credit assessment result schema
const CreditAssessmentSchema = z.object({
  creditScore: z.number().min(0).max(100),
  approvalStatus: z.enum(['APPROVED', 'CONDITIONALLY_APPROVED', 'REJECTED', 'UNDER_REVIEW']),
  
  loanRecommendation: z.object({
    minAmount: z.number(),
    maxAmount: z.number(),
    recommendedAmount: z.number(),
    interestRate: z.object({
      min: z.number(),
      max: z.number(),
      recommended: z.number(),
    }),
    repaymentPeriod: z.object({
      minMonths: z.number(),
      maxMonths: z.number(),
      recommendedMonths: z.number(),
    }),
    monthlyRepayment: z.object({
      min: z.number(),
      max: z.number(),
      recommended: z.number(),
    }),
  }),
  
  assessmentFactors: z.object({
    identityVerification: z.object({
      score: z.number().min(0).max(100),
      weight: z.number(),
      impact: z.enum(['POSITIVE', 'NEUTRAL', 'NEGATIVE']),
      details: z.string(),
    }),
    incomeStability: z.object({
      score: z.number().min(0).max(100),
      weight: z.number(),
      impact: z.enum(['POSITIVE', 'NEUTRAL', 'NEGATIVE']),
      details: z.string(),
    }),
    spendingBehavior: z.object({
      score: z.number().min(0).max(100),
      weight: z.number(),
      impact: z.enum(['POSITIVE', 'NEUTRAL', 'NEGATIVE']),
      details: z.string(),
    }),
    savingsCapacity: z.object({
      score: z.number().min(0).max(100),
      weight: z.number(),
      impact: z.enum(['POSITIVE', 'NEUTRAL', 'NEGATIVE']),
      details: z.string(),
    }),
    debtBurden: z.object({
      score: z.number().min(0).max(100),
      weight: z.number(),
      impact: z.enum(['POSITIVE', 'NEUTRAL', 'NEGATIVE']),
      details: z.string(),
    }),
  }),
  
  keyInsights: z.array(z.object({
    type: z.enum(['STRENGTH', 'WEAKNESS', 'WARNING', 'OPPORTUNITY']),
    title: z.string(),
    description: z.string(),
    impact: z.enum(['HIGH', 'MEDIUM', 'LOW']),
  })),
  
  riskAssessment: z.object({
    overallRisk: z.enum(['LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH']),
    defaultProbability: z.number().min(0).max(100),
    riskFactors: z.array(z.string()),
    mitigationSuggestions: z.array(z.string()),
  }),
  
  conditions: z.array(z.object({
    type: z.enum(['REQUIRED', 'RECOMMENDED', 'OPTIONAL']),
    description: z.string(),
    reason: z.string(),
  })),
  
  detailedExplanation: z.string(),
  nextSteps: z.array(z.string()),
  
  rejectionReasons: z.array(z.string()).optional(),
});

export type CreditAssessmentResult = z.infer<typeof CreditAssessmentSchema>;

/**
 * Comprehensive credit assessment combining identity and financial data
 */
export const assessCreditworthiness = ai.defineFlow(
  {
    name: 'assessCreditworthiness',
    inputSchema: z.object({
      applicantInfo: z.object({
        fullName: z.string(),
        dateOfBirth: z.string(),
        employmentStatus: z.string(),
        monthlyIncome: z.number().optional(),
        employerName: z.string().optional(),
      }),
      identityVerification: z.custom<IdentityVerificationResult>(),
      financialAnalysis: z.custom<FinancialAnalysisResult>(),
      loanRequest: z.object({
        requestedAmount: z.number().optional(),
        purpose: z.string().optional(),
        preferredTerm: z.number().optional(),
      }).optional(),
    }),
    outputSchema: CreditAssessmentSchema,
  },
  async (input) => {
    const { applicantInfo, identityVerification, financialAnalysis, loanRequest } = input;

    // Immediate rejection if identity verification failed
    if (identityVerification.recommendation === 'REJECT') {
      return {
        creditScore: 0,
        approvalStatus: 'REJECTED' as const,
        loanRecommendation: {
          minAmount: 0,
          maxAmount: 0,
          recommendedAmount: 0,
          interestRate: { min: 0, max: 0, recommended: 0 },
          repaymentPeriod: { minMonths: 0, maxMonths: 0, recommendedMonths: 0 },
          monthlyRepayment: { min: 0, max: 0, recommended: 0 },
        },
        assessmentFactors: {
          identityVerification: {
            score: identityVerification.confidence,
            weight: 30,
            impact: 'NEGATIVE' as const,
            details: 'Identity verification failed',
          },
          incomeStability: {
            score: 0,
            weight: 25,
            impact: 'NEUTRAL' as const,
            details: 'Not assessed due to identity verification failure',
          },
          spendingBehavior: {
            score: 0,
            weight: 20,
            impact: 'NEUTRAL' as const,
            details: 'Not assessed due to identity verification failure',
          },
          savingsCapacity: {
            score: 0,
            weight: 15,
            impact: 'NEUTRAL' as const,
            details: 'Not assessed due to identity verification failure',
          },
          debtBurden: {
            score: 0,
            weight: 10,
            impact: 'NEUTRAL' as const,
            details: 'Not assessed due to identity verification failure',
          },
        },
        keyInsights: [{
          type: 'WARNING' as const,
          title: 'Identity Verification Failed',
          description: identityVerification.detailedFeedback,
          impact: 'HIGH' as const,
        }],
        riskAssessment: {
          overallRisk: 'VERY_HIGH' as const,
          defaultProbability: 100,
          riskFactors: ['Identity verification failed'],
          mitigationSuggestions: [],
        },
        conditions: [],
        detailedExplanation: identityVerification.detailedFeedback,
        nextSteps: [
          'Your application has been rejected due to identity verification issues.',
          'Please contact support if you believe this is an error.',
        ],
        rejectionReasons: [
          identityVerification.detailedFeedback,
          ...identityVerification.idVerification.issues,
        ],
      };
    }

    const assessmentPrompt = `
You are a senior credit analyst at a digital lending platform in Kenya. Perform a comprehensive credit assessment.

APPLICANT INFORMATION:
- Name: ${applicantInfo.fullName}
- Date of Birth: ${applicantInfo.dateOfBirth}
- Employment: ${applicantInfo.employmentStatus}
${applicantInfo.employerName ? `- Employer: ${applicantInfo.employerName}` : ''}
${applicantInfo.monthlyIncome ? `- Stated Income: KES ${applicantInfo.monthlyIncome.toLocaleString()}` : ''}

IDENTITY VERIFICATION RESULTS:
- Status: ${identityVerification.recommendation}
- Confidence: ${identityVerification.confidence}%
- Face Match: ${identityVerification.faceMatch.matched ? 'PASSED' : 'FAILED'} (${identityVerification.faceMatch.confidence}%)
- ID Authenticity: ${identityVerification.idVerification.isForged ? 'FORGED' : 'AUTHENTIC'}
- Liveness Check: ${identityVerification.livenessCheck.passed ? 'PASSED' : 'FAILED'}
${identityVerification.idVerification.issues.length > 0 ? `- Issues: ${identityVerification.idVerification.issues.join(', ')}` : ''}

FINANCIAL ANALYSIS:
- Overall Financial Score: ${financialAnalysis.overallScore}/100
- Income Stability: ${financialAnalysis.incomeStability.score}/100 (${financialAnalysis.incomeStability.incomeConsistency})
  * Average Monthly Income: KES ${financialAnalysis.incomeStability.averageMonthlyIncome.toLocaleString()}
  * Analysis: ${financialAnalysis.incomeStability.analysis}
  
- Spending Behavior: ${financialAnalysis.spendingBehavior.score}/100 (${financialAnalysis.spendingBehavior.spendingPattern})
  * Average Monthly Expenses: KES ${financialAnalysis.spendingBehavior.averageMonthlyExpenses.toLocaleString()}
  * Analysis: ${financialAnalysis.spendingBehavior.analysis}
  
- Savings: ${financialAnalysis.savingsBehavior.score}/100 (${financialAnalysis.savingsBehavior.savingsConsistency})
  * Average Monthly Savings: KES ${financialAnalysis.savingsBehavior.averageMonthlySavings.toLocaleString()}
  * Savings Rate: ${financialAnalysis.savingsBehavior.savingsRate}%
  * Analysis: ${financialAnalysis.savingsBehavior.analysis}
  
- Debt Indicators: ${financialAnalysis.debtIndicators.score}/100 (Risk: ${financialAnalysis.debtIndicators.riskLevel})
  * Has Loan Payments: ${financialAnalysis.debtIndicators.hasLoanPayments}
  * Monthly Debt: KES ${financialAnalysis.debtIndicators.estimatedMonthlyDebt.toLocaleString()}
  * Debt-to-Income: ${financialAnalysis.debtIndicators.debtToIncomeRatio}%
  * Analysis: ${financialAnalysis.debtIndicators.analysis}

- Transaction Patterns:
  * Total Transactions: ${financialAnalysis.transactionPatterns.totalTransactions}
  * Regular Payments: ${financialAnalysis.transactionPatterns.regularPayments.join(', ')}
  ${financialAnalysis.transactionPatterns.unusualActivity.length > 0 ? `* Unusual Activity: ${financialAnalysis.transactionPatterns.unusualActivity.join(', ')}` : ''}

FINANCIAL RECOMMENDATION:
- Eligible: ${financialAnalysis.recommendation.eligible}
- Max Loan: KES ${financialAnalysis.recommendation.maxLoanAmount.toLocaleString()}
- Suggested Interest: ${financialAnalysis.recommendation.suggestedInterestRate}% p.a.
- Max Term: ${financialAnalysis.recommendation.maxRepaymentMonths} months
- Reasoning: ${financialAnalysis.recommendation.reasoning}
${financialAnalysis.recommendation.warnings.length > 0 ? `- Warnings: ${financialAnalysis.recommendation.warnings.join('; ')}` : ''}

${loanRequest ? `
LOAN REQUEST:
- Requested Amount: ${loanRequest.requestedAmount ? `KES ${loanRequest.requestedAmount.toLocaleString()}` : 'Not specified'}
- Purpose: ${loanRequest.purpose || 'Not specified'}
- Preferred Term: ${loanRequest.preferredTerm ? `${loanRequest.preferredTerm} months` : 'Not specified'}
` : ''}

ASSESSMENT REQUIREMENTS:

1. Calculate OVERALL CREDIT SCORE (0-100) using weighted factors:
   - Identity Verification: 30% weight
   - Income Stability: 25% weight
   - Spending Behavior: 20% weight
   - Savings Capacity: 15% weight
   - Debt Burden: 10% weight

2. Determine APPROVAL STATUS:
   - APPROVED: Score ≥70, all checks passed, low risk
   - CONDITIONALLY_APPROVED: Score 50-69, minor concerns, requires conditions
   - UNDER_REVIEW: Score 40-49 or identity needs manual review
   - REJECTED: Score <40, failed identity, or high risk

3. Provide LOAN RECOMMENDATION:
   - Calculate safe loan amounts (min, max, recommended) based on income and debt
   - Set interest rates based on risk (lower score = higher rate)
   - Determine repayment periods
   - Calculate monthly repayments
   - Consider the debt-to-income ratio (should not exceed 40% post-loan)

4. Generate KEY INSIGHTS (at least 5):
   - STRENGTH: Positive factors supporting approval
   - WEAKNESS: Areas of concern
   - WARNING: Red flags or high-risk indicators
   - OPPORTUNITY: Suggestions for improving creditworthiness
   - Rate each insight's impact: HIGH, MEDIUM, or LOW

5. Conduct RISK ASSESSMENT:
   - Overall risk level: LOW, MEDIUM, HIGH, or VERY_HIGH
   - Estimate default probability (0-100%)
   - List specific risk factors
   - Suggest risk mitigation measures

6. List CONDITIONS (if any):
   - REQUIRED: Must be met for approval
   - RECOMMENDED: Strongly suggested
   - OPTIONAL: Nice to have

7. Provide detailed explanation of the decision and clear next steps.

8. If REJECTED, provide specific, actionable rejection reasons.

Be thorough, fair, and data-driven. Consider Kenyan lending context and regulations.
Prioritize responsible lending - don't approve loans that could cause financial hardship.
`;

    const assessment = await ai.generate({
      model: 'googleai/gemini-1.5-pro',
      prompt: assessmentPrompt,
      config: {
        temperature: 0.2,
      },
      output: {
        schema: CreditAssessmentSchema,
      },
    });

    return assessment.output;
  }
);
