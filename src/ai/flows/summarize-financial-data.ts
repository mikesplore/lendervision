'use server';

/**
 * @fileOverview Summarizes key insights from a borrower's financial data.
 *
 * - summarizeFinancialData - A function that summarizes financial data.
 * - SummarizeFinancialDataInput - The input type for the summarizeFinancialData function.
 * - SummarizeFinancialDataOutput - The return type for the summarizeFinancialData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeFinancialDataInputSchema = z.object({
  financialData: z
    .string()
    .describe(
      'The borrower financial data such as M-Pesa and bank statements.'
    ),
});
export type SummarizeFinancialDataInput = z.infer<
  typeof SummarizeFinancialDataInputSchema
>;

const SummarizeFinancialDataOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A summary of the key insights from the borrower financial data, including income, expenses, and overall financial health.'
    ),
});
export type SummarizeFinancialDataOutput = z.infer<
  typeof SummarizeFinancialDataOutputSchema
>;

export async function summarizeFinancialData(
  input: SummarizeFinancialDataInput
): Promise<SummarizeFinancialDataOutput> {
  return summarizeFinancialDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeFinancialDataPrompt',
  input: {schema: SummarizeFinancialDataInputSchema},
  output: {schema: SummarizeFinancialDataOutputSchema},
  prompt: `You are an AI assistant helping lenders understand a borrower's financial health.

  Summarize the key insights from the following financial data, including income, expenses, and overall financial health:

  Financial Data: {{{financialData}}} `,
});

const summarizeFinancialDataFlow = ai.defineFlow(
  {
    name: 'summarizeFinancialDataFlow',
    inputSchema: SummarizeFinancialDataInputSchema,
    outputSchema: SummarizeFinancialDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
