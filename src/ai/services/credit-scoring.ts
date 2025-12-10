/**
 * AI-Powered Credit Scoring and Assessment Service
 * Comprehensive credit analysis using Gemini AI
 */

import { ai } from '../genkit';
import type { MpesaTransaction, BankStatement, UserFinancialProfile } from './mock-data-generator';

export interface CreditAssessmentResult {
  creditScore: number; // 0-100
  approvalStatus: 'approved' | 'conditionally-approved' | 'rejected' | 'under-review';
  loanRecommendation: {
    minAmount: number;
    maxAmount: number;
    interestRateMin: number;
    interestRateMax: number;
    termMin: number; // months
    termMax: number; // months
  } | null;
  riskLevel: 'low' | 'medium' | 'high' | 'very-high';
  
  // Detailed scoring breakdown
  scoringFactors: {
    identityVerification: { score: number; weight: number; status: string };
    incomeStability: { score: number; weight: number; status: string };
    debtToIncome: { score: number; weight: number; status: string };
    paymentHistory: { score: number; weight: number; status: string };
    financialBehavior: { score: number; weight: number; status: string };
    employmentHistory: { score: number; weight: number; status: string };
  };
  
  // AI-generated insights
  keyInsights: string[];
  strengths: string[];
  weaknesses: string[];
  improvementSuggestions: string[];
  
  // Rejection/conditional approval reasons
  rejectionReasons: string[];
  conditionalRequirements: string[];
  
  // Financial health metrics
  metrics: {
    averageMonthlyIncome: number;
    averageMonthlyExpenses: number;
    savingsRate: number;
    debtBurden: number;
    transactionConsistency: number;
    incomeVolatility: number;
  };
}

export class CreditScoringService {
  /**
   * Comprehensive credit assessment for individuals
   */
  static async assessIndividualCredit(
    profile: UserFinancialProfile,
    mpesaTransactions: MpesaTransaction[],
    bankStatements: BankStatement[],
    identityVerified: boolean,
    faceMatchConfidence: number,
    idAuthenticityConfidence: number
  ): Promise<CreditAssessmentResult> {
    const prompt = `You are an expert credit risk analyst for a Kenyan lending platform. Analyze this applicant's financial data and provide a comprehensive credit assessment.

APPLICANT PROFILE:
- Monthly Income: KES ${profile.monthlyIncome.toLocaleString()}
- Employment Type: ${profile.employmentType}
- Employment Duration: ${profile.employmentDuration} months
- Outstanding Debts: KES ${profile.outstandingDebts.toLocaleString()}
- Previous Defaults: ${profile.hasDefaultedLoans ? 'YES - HIGH RISK' : 'No'}
- Savings Pattern: ${profile.savingsPattern}

IDENTITY VERIFICATION:
- Identity Verified: ${identityVerified ? 'YES' : 'NO - CRITICAL ISSUE'}
- Face Match Confidence: ${faceMatchConfidence}%
- ID Authenticity: ${idAuthenticityConfidence}%

M-PESA TRANSACTION HISTORY (${mpesaTransactions.length} transactions):
${JSON.stringify(mpesaTransactions.slice(0, 50), null, 2)}

BANK STATEMENTS (${bankStatements.length} entries):
${JSON.stringify(bankStatements.slice(0, 50), null, 2)}

ASSESSMENT CRITERIA:
1. Identity Verification (20% weight):
   - Must be verified to proceed
   - Face match confidence > 85% required
   - ID authenticity > 80% required

2. Income Stability (25% weight):
   - Consistent income patterns
   - Regular salary deposits
   - Income source verification

3. Debt-to-Income Ratio (20% weight):
   - Total debts / Monthly income
   - Should be < 40% for approval
   - Consider existing loan defaults

4. Payment History (15% weight):
   - On-time bill payments
   - No bounced transactions
   - Regular savings deposits

5. Financial Behavior (15% weight):
   - Spending patterns
   - Emergency fund presence
   - Gambling or risky transactions

6. Employment History (5% weight):
   - Job stability
   - Income growth

SCORING RULES:
- Identity issues: Immediate rejection or score penalty
- Previous defaults: Maximum score of 60/100
- High debt ratio (>50%): Conditional approval only
- Irregular income: Medium risk classification
- Forged ID (confidence < 70%): Automatic rejection

APPROVAL THRESHOLDS:
- Score 75-100: Approved (Low risk)
- Score 60-74: Conditionally Approved (Medium risk)
- Score 40-59: Under Review (High risk)
- Score 0-39: Rejected (Very high risk)

LOAN AMOUNT CALCULATION:
- Approved: 2-3x monthly income
- Conditionally Approved: 1-2x monthly income
- Interest rates: 8-15% p.a. based on risk
- Terms: 3-24 months based on amount

Provide comprehensive assessment in JSON format with detailed reasoning for every decision.`;

    try {
      const response = await ai.generate({
        model: 'googleai/gemini-2.0-flash-exp',
        prompt,
        config: {
          temperature: 0.3,
        },
        output: {
          format: 'json',
          schema: {
            type: 'object',
            properties: {
              creditScore: { type: 'number' },
              approvalStatus: { 
                type: 'string',
                enum: ['approved', 'conditionally-approved', 'rejected', 'under-review']
              },
              loanRecommendation: {
                type: ['object', 'null'],
                properties: {
                  minAmount: { type: 'number' },
                  maxAmount: { type: 'number' },
                  interestRateMin: { type: 'number' },
                  interestRateMax: { type: 'number' },
                  termMin: { type: 'number' },
                  termMax: { type: 'number' }
                }
              },
              riskLevel: { 
                type: 'string',
                enum: ['low', 'medium', 'high', 'very-high']
              },
              scoringFactors: { type: 'object' },
              keyInsights: { type: 'array', items: { type: 'string' } },
              strengths: { type: 'array', items: { type: 'string' } },
              weaknesses: { type: 'array', items: { type: 'string' } },
              improvementSuggestions: { type: 'array', items: { type: 'string' } },
              rejectionReasons: { type: 'array', items: { type: 'string' } },
              conditionalRequirements: { type: 'array', items: { type: 'string' } },
              metrics: { type: 'object' }
            }
          }
        }
      });

      return response.output as CreditAssessmentResult;
    } catch (error) {
      console.error('Credit assessment error:', error);
      return this.getDefaultRejectionResult('Technical error during assessment');
    }
  }

  /**
   * Business credit assessment
   */
  static async assessBusinessCredit(
    businessInfo: {
      name: string;
      registrationNumber: string;
      yearsInOperation: number;
      industry: string;
      employeeCount: string;
      monthlyRevenue: number;
    },
    financialData: {
      transactions: MpesaTransaction[];
      statements: BankStatement[];
    },
    documentsVerified: boolean,
    documentConfidence: number
  ): Promise<CreditAssessmentResult> {
    const prompt = `You are a business credit analyst. Assess this Kenyan business for loan eligibility.

BUSINESS INFORMATION:
- Name: ${businessInfo.name}
- Registration: ${businessInfo.registrationNumber}
- Years in Operation: ${businessInfo.yearsInOperation}
- Industry: ${businessInfo.industry}
- Employees: ${businessInfo.employeeCount}
- Monthly Revenue: KES ${businessInfo.monthlyRevenue.toLocaleString()}

DOCUMENT VERIFICATION:
- Documents Verified: ${documentsVerified ? 'YES' : 'NO - CRITICAL'}
- Verification Confidence: ${documentConfidence}%

FINANCIAL DATA:
Transactions: ${financialData.transactions.length}
${JSON.stringify(financialData.transactions.slice(0, 30), null, 2)}

Bank Statements: ${financialData.statements.length}
${JSON.stringify(financialData.statements.slice(0, 30), null, 2)}

BUSINESS ASSESSMENT CRITERIA:
1. Business Legitimacy (25%):
   - Registration verified
   - Documents authentic
   - Operating history

2. Revenue Stability (30%):
   - Consistent revenue
   - Growth patterns
   - Seasonal variations

3. Cash Flow Health (25%):
   - Positive cash flow
   - Working capital adequacy
   - Payment cycles

4. Industry Risk (10%):
   - Sector stability
   - Market conditions

5. Business Age & Size (10%):
   - Years in operation
   - Employee count
   - Growth trajectory

BUSINESS LOAN TERMS:
- Approved: 3-6 months revenue
- Interest: 10-18% based on risk
- Terms: 6-36 months

Provide detailed business credit assessment with specific recommendations.`;

    try {
      const response = await ai.generate({
        model: 'googleai/gemini-2.0-flash-exp',
        prompt,
        config: {
          temperature: 0.3,
        },
        output: {
          format: 'json',
          schema: {
            type: 'object',
            properties: {
              creditScore: { type: 'number' },
              approvalStatus: { type: 'string' },
              loanRecommendation: { type: ['object', 'null'] },
              riskLevel: { type: 'string' },
              scoringFactors: { type: 'object' },
              keyInsights: { type: 'array', items: { type: 'string' } },
              strengths: { type: 'array', items: { type: 'string' } },
              weaknesses: { type: 'array', items: { type: 'string' } },
              improvementSuggestions: { type: 'array', items: { type: 'string' } },
              rejectionReasons: { type: 'array', items: { type: 'string' } },
              conditionalRequirements: { type: 'array', items: { type: 'string' } },
              metrics: { type: 'object' }
            }
          }
        }
      });

      return response.output as CreditAssessmentResult;
    } catch (error) {
      console.error('Business credit assessment error:', error);
      return this.getDefaultRejectionResult('Technical error during business assessment');
    }
  }

  /**
   * Default rejection result for errors
   */
  private static getDefaultRejectionResult(reason: string): CreditAssessmentResult {
    return {
      creditScore: 0,
      approvalStatus: 'rejected',
      loanRecommendation: null,
      riskLevel: 'very-high',
      scoringFactors: {
        identityVerification: { score: 0, weight: 20, status: 'Failed' },
        incomeStability: { score: 0, weight: 25, status: 'Unknown' },
        debtToIncome: { score: 0, weight: 20, status: 'Unknown' },
        paymentHistory: { score: 0, weight: 15, status: 'Unknown' },
        financialBehavior: { score: 0, weight: 15, status: 'Unknown' },
        employmentHistory: { score: 0, weight: 5, status: 'Unknown' }
      },
      keyInsights: [],
      strengths: [],
      weaknesses: ['Assessment could not be completed'],
      improvementSuggestions: ['Please retry the application process'],
      rejectionReasons: [reason],
      conditionalRequirements: [],
      metrics: {
        averageMonthlyIncome: 0,
        averageMonthlyExpenses: 0,
        savingsRate: 0,
        debtBurden: 0,
        transactionConsistency: 0,
        incomeVolatility: 0
      }
    };
  }
}
