import { ai } from '../genkit';
import { z } from 'zod';

// Mock M-Pesa transaction schema
const MpesaTransactionSchema = z.object({
  transactionId: z.string(),
  date: z.string(),
  type: z.enum(['SEND', 'RECEIVE', 'PAYBILL', 'BUY_GOODS', 'WITHDRAW', 'DEPOSIT']),
  amount: z.number(),
  balance: z.number(),
  recipient: z.string().optional(),
  sender: z.string().optional(),
  description: z.string(),
});

// Financial analysis result schema
const FinancialAnalysisSchema = z.object({
  overallScore: z.number().min(0).max(100),
  incomeStability: z.object({
    score: z.number().min(0).max(100),
    averageMonthlyIncome: z.number(),
    incomeConsistency: z.enum(['VERY_STABLE', 'STABLE', 'MODERATE', 'VOLATILE', 'VERY_VOLATILE']),
    incomeSources: z.array(z.string()),
    analysis: z.string(),
  }),
  spendingBehavior: z.object({
    score: z.number().min(0).max(100),
    averageMonthlyExpenses: z.number(),
    spendingPattern: z.enum(['RESPONSIBLE', 'MODERATE', 'CONCERNING', 'RISKY']),
    majorCategories: z.array(z.object({
      category: z.string(),
      amount: z.number(),
      percentage: z.number(),
    })),
    analysis: z.string(),
  }),
  savingsBehavior: z.object({
    score: z.number().min(0).max(100),
    averageMonthlySavings: z.number(),
    savingsRate: z.number(),
    savingsConsistency: z.enum(['EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'NONE']),
    analysis: z.string(),
  }),
  debtIndicators: z.object({
    score: z.number().min(0).max(100),
    hasLoanPayments: z.boolean(),
    estimatedMonthlyDebt: z.number(),
    debtToIncomeRatio: z.number(),
    riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
    analysis: z.string(),
  }),
  transactionPatterns: z.object({
    totalTransactions: z.number(),
    averageTransactionValue: z.number(),
    mostActiveDay: z.string(),
    mostActiveHour: z.number(),
    regularPayments: z.array(z.string()),
    unusualActivity: z.array(z.string()),
  }),
  recommendation: z.object({
    eligible: z.boolean(),
    maxLoanAmount: z.number(),
    suggestedInterestRate: z.number(),
    maxRepaymentMonths: z.number(),
    reasoning: z.string(),
    warnings: z.array(z.string()),
  }),
});

export type FinancialAnalysisResult = z.infer<typeof FinancialAnalysisSchema>;
export type MpesaTransaction = z.infer<typeof MpesaTransactionSchema>;

/**
 * Generate realistic mock M-Pesa transaction data for testing
 */
export function generateMockMpesaData(phoneNumber: string, months: number = 3): MpesaTransaction[] {
  const transactions: MpesaTransaction[] = [];
  const today = new Date();
  const transactionTypes = ['SEND', 'RECEIVE', 'PAYBILL', 'BUY_GOODS', 'WITHDRAW', 'DEPOSIT'] as const;
  
  let balance = 50000 + Math.random() * 50000; // Starting balance between 50k-100k
  
  // Generate transactions for the specified period
  for (let day = months * 30; day >= 0; day--) {
    const date = new Date(today);
    date.setDate(date.getDate() - day);
    
    // 2-8 transactions per day
    const dailyTransactions = Math.floor(Math.random() * 7) + 2;
    
    for (let i = 0; i < dailyTransactions; i++) {
      const type = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
      let amount = 0;
      let description = '';
      
      switch (type) {
        case 'RECEIVE':
          amount = Math.floor(Math.random() * 20000) + 1000; // 1k-20k
          balance += amount;
          description = Math.random() > 0.5 ? 'Salary Payment' : 'Payment Received';
          break;
        case 'SEND':
          amount = Math.floor(Math.random() * 5000) + 500; // 500-5k
          balance -= amount;
          description = 'Money Transfer';
          break;
        case 'PAYBILL':
          amount = Math.floor(Math.random() * 3000) + 200; // 200-3k
          balance -= amount;
          description = ['KPLC', 'Nairobi Water', 'Internet Bill', 'School Fees'][Math.floor(Math.random() * 4)];
          break;
        case 'BUY_GOODS':
          amount = Math.floor(Math.random() * 2000) + 100; // 100-2k
          balance -= amount;
          description = ['Supermarket', 'Restaurant', 'Pharmacy', 'Fuel'][Math.floor(Math.random() * 4)];
          break;
        case 'WITHDRAW':
          amount = Math.floor(Math.random() * 10000) + 500; // 500-10k
          balance -= amount;
          description = 'ATM Withdrawal';
          break;
        case 'DEPOSIT':
          amount = Math.floor(Math.random() * 15000) + 1000; // 1k-15k
          balance += amount;
          description = 'Cash Deposit';
          break;
      }
      
      transactions.push({
        transactionId: `MP${Date.now()}${i}${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        date: date.toISOString(),
        type,
        amount,
        balance: Math.max(0, balance),
        description,
      });
    }
  }
  
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * AI-powered financial data analysis service
 * Analyzes M-Pesa transactions to assess creditworthiness
 */
export const analyzeFinancialData = ai.defineFlow(
  {
    name: 'analyzeFinancialData',
    inputSchema: z.object({
      phoneNumber: z.string(),
      transactions: z.array(MpesaTransactionSchema),
      employmentStatus: z.string(),
      monthlyIncome: z.number().optional(),
    }),
    outputSchema: FinancialAnalysisSchema,
  },
  async (input) => {
    const { transactions, employmentStatus, monthlyIncome } = input;

    // Prepare transaction summary for AI
    const transactionSummary = {
      totalTransactions: transactions.length,
      dateRange: {
        from: transactions[transactions.length - 1]?.date,
        to: transactions[0]?.date,
      },
      transactionsByType: transactions.reduce((acc, t) => {
        acc[t.type] = (acc[t.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      totalReceived: transactions
        .filter(t => ['RECEIVE', 'DEPOSIT'].includes(t.type))
        .reduce((sum, t) => sum + t.amount, 0),
      totalSpent: transactions
        .filter(t => ['SEND', 'PAYBILL', 'BUY_GOODS', 'WITHDRAW'].includes(t.type))
        .reduce((sum, t) => sum + t.amount, 0),
      averageBalance: transactions.reduce((sum, t) => sum + t.balance, 0) / transactions.length,
      minBalance: Math.min(...transactions.map(t => t.balance)),
      maxBalance: Math.max(...transactions.map(t => t.balance)),
    };

    const analysisPrompt = `
You are a financial analyst specializing in credit risk assessment for lending institutions in Kenya.

APPLICANT PROFILE:
- Employment Status: ${employmentStatus}
- Stated Monthly Income: ${monthlyIncome ? `KES ${monthlyIncome.toLocaleString()}` : 'Not provided'}

M-PESA TRANSACTION DATA:
- Total Transactions: ${transactionSummary.totalTransactions}
- Period: ${transactionSummary.dateRange.from} to ${transactionSummary.dateRange.to}
- Total Money Received: KES ${transactionSummary.totalReceived.toLocaleString()}
- Total Money Spent: KES ${transactionSummary.totalSpent.toLocaleString()}
- Average Balance: KES ${transactionSummary.averageBalance.toLocaleString()}
- Min Balance: KES ${transactionSummary.minBalance.toLocaleString()}
- Max Balance: KES ${transactionSummary.maxBalance.toLocaleString()}

Transaction breakdown by type:
${Object.entries(transactionSummary.transactionsByType).map(([type, count]) => `- ${type}: ${count}`).join('\n')}

Recent transactions (sample):
${transactions.slice(0, 50).map(t => 
  `${t.date.split('T')[0]} | ${t.type} | KES ${t.amount.toLocaleString()} | Balance: KES ${t.balance.toLocaleString()} | ${t.description}`
).join('\n')}

ANALYSIS REQUIRED:

1. INCOME STABILITY (0-100 score):
   - Analyze regularity and consistency of incoming payments
   - Identify primary income sources
   - Calculate average monthly income from transactions
   - Classify: VERY_STABLE, STABLE, MODERATE, VOLATILE, or VERY_VOLATILE

2. SPENDING BEHAVIOR (0-100 score):
   - Analyze spending patterns and categories
   - Calculate average monthly expenses
   - Identify spending on essentials vs non-essentials
   - Classify: RESPONSIBLE, MODERATE, CONCERNING, or RISKY
   - Break down major spending categories with amounts and percentages

3. SAVINGS BEHAVIOR (0-100 score):
   - Calculate net savings (income - expenses) per month
   - Analyze savings rate and consistency
   - Classify: EXCELLENT, GOOD, FAIR, POOR, or NONE

4. DEBT INDICATORS (0-100 score):
   - Identify loan repayments in transaction history
   - Estimate monthly debt obligations
   - Calculate debt-to-income ratio
   - Assess risk level: LOW, MEDIUM, HIGH, or CRITICAL

5. TRANSACTION PATTERNS:
   - Identify regular payments (rent, utilities, loan repayments)
   - Find most active day and hour for transactions
   - Flag any unusual or suspicious activity

6. LOAN RECOMMENDATION:
   - Determine eligibility (true/false)
   - Suggest maximum safe loan amount (in KES)
   - Recommend interest rate (% per annum)
   - Suggest maximum repayment period (months)
   - Provide detailed reasoning
   - List any warnings or concerns

Be thorough, data-driven, and realistic. Consider Kenyan economic context and M-Pesa usage patterns.
Provide an overall financial health score (0-100) based on all factors.
`;

    const analysis = await ai.generate({
      model: 'googleai/gemini-1.5-pro',
      prompt: analysisPrompt,
      config: {
        temperature: 0.3,
      },
      output: {
        schema: FinancialAnalysisSchema,
      },
    });

    return analysis.output;
  }
);
