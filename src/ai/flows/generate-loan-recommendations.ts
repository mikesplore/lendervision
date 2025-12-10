'use server';
/**
 * @fileOverview AI agent that generates loan recommendations based on borrower data.
 *
 * - generateLoanRecommendations - A function that generates loan recommendations.
 * - GenerateLoanRecommendationsInput - The input type for the generateLoanRecommendations function.
 * - GenerateLoanRecommendationsOutput - The return type for the generateLoanRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLoanRecommendationsInputSchema = z.object({
  riskProfile: z
    .string()
    .describe('The risk profile of the borrower (Low, Medium, High).'),
  averageMonthlyIncome: z
    .number()
    .describe('The average monthly income of the borrower.'),
  estimatedExistingDebtPayments: z
    .number()
    .describe('The estimated existing debt payments of the borrower.'),
  loanPurpose: z.string().describe('The purpose of the loan.'),
  loanHistory: z
    .string()
    .describe(
      'The loan history of the borrower including previous loans, payment behavior, etc.'
    ),
  creditScore: z.number().describe('The credit score of the borrower.'),
});
export type GenerateLoanRecommendationsInput = z.infer<
  typeof GenerateLoanRecommendationsInputSchema
>;

const GenerateLoanRecommendationsOutputSchema = z.object({
  recommendedLoanLimit: z
    .number()
    .describe('The recommended loan limit for the borrower in KES.'),
  recommendedInterestRate: z
    .number()
    .describe('The recommended interest rate for the loan (percentage).'),
  reasoning:
    z
      .string()
      .describe(
        'Explanation of why this limit and interest rate was chosen including potential risks.'
      ),
});
export type GenerateLoanRecommendationsOutput = z.infer<
  typeof GenerateLoanRecommendationsOutputSchema
>;

export async function generateLoanRecommendations(
  input: GenerateLoanRecommendationsInput
): Promise<GenerateLoanRecommendationsOutput> {
  return generateLoanRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLoanRecommendationsPrompt',
  input: {
    schema: GenerateLoanRecommendationsInputSchema,
  },
  output: {schema: GenerateLoanRecommendationsOutputSchema},
  prompt: `You are an expert loan officer, and you are to recommend an appropriate loan amount, interest rate, and a brief explanation of that recommendation given the following information about the loan applicant. Your output must be valid JSON.\n
Borrower Risk Profile: {{{riskProfile}}}\nAverage Monthly Income: {{{averageMonthlyIncome}}}\nEstimated Existing Debt Payments: {{{estimatedExistingDebtPayments}}}\nLoan Purpose: {{{loanPurpose}}}\nLoan History: {{{loanHistory}}}\nCredit Score: {{{creditScore}}}\n
Please provide a recommended loan limit, interest rate, and the reasoning behind this recommendation. The loan limit is in Kenyan Shillings (KES).\n`,
});

const generateLoanRecommendationsFlow = ai.defineFlow(
  {
    name: 'generateLoanRecommendationsFlow',
    inputSchema: GenerateLoanRecommendationsInputSchema,
    outputSchema: GenerateLoanRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
