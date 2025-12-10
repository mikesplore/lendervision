'use server';
/**
 * @fileOverview This flow flags potentially fraudulent activity based on borrower data.
 *
 * - flagFraudulentActivity -  Flags potential fraudulent activity.
 * - FlagFraudulentActivityInput - The input type for the flagFraudulentActivity function.
 * - FlagFraudulentActivityOutput - The return type for the flagFraudulentActivity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FlagFraudulentActivityInputSchema = z.object({
  livenessDetectionPassed: z.boolean().describe('Whether the liveness detection passed.'),
  idDocumentAuthentic: z.boolean().describe('Whether the ID document is authentic.'),
  deviceIntelligenceFlags: z.array(z.string()).describe('Flags from device intelligence, such as the device being associated with fraudulent accounts.'),
  mPesaTransactionHistoryConsistent: z.boolean().describe('Whether the M-Pesa transaction history is consistent.'),
  seasonalIncomePatternPositive: z.boolean().describe('Whether a positive seasonal income pattern was detected.'),
  name: z.string().describe('Applicant Name'),
  email: z.string().describe('Applicant Email'),
  phone: z.string().describe('Applicant Phone'),
});
export type FlagFraudulentActivityInput = z.infer<typeof FlagFraudulentActivityInputSchema>;

const FlagFraudulentActivityOutputSchema = z.object({
  fraudFlags: z.array(z.string()).describe('A list of fraud flags raised by the AI.'),
  summary: z.string().describe('A summary of the potential fraudulent activity.'),
});
export type FlagFraudulentActivityOutput = z.infer<typeof FlagFraudulentActivityOutputSchema>;

export async function flagFraudulentActivity(input: FlagFraudulentActivityInput): Promise<FlagFraudulentActivityOutput> {
  return flagFraudulentActivityFlow(input);
}

const flagFraudulentActivityPrompt = ai.definePrompt({
  name: 'flagFraudulentActivityPrompt',
  input: {schema: FlagFraudulentActivityInputSchema},
  output: {schema: FlagFraudulentActivityOutputSchema},
  prompt: `You are an AI assistant that analyzes borrower data to detect potentially fraudulent activity.  You will receive data points about a loan applicant and determine if there are any red flags, and summarize your findings.

Liveness Detection Passed: {{livenessDetectionPassed}}
ID Document Authentic: {{idDocumentAuthentic}}
Device Intelligence Flags: {{#each deviceIntelligenceFlags}}- {{this}}\n{{/each}}
M-Pesa Transaction History Consistent: {{mPesaTransactionHistoryConsistent}}
Seasonal Income Pattern Positive: {{seasonalIncomePatternPositive}}
Applicant Name: {{name}}
Applicant Email: {{email}}
Applicant Phone: {{phone}}

Based on this information, identify any fraud flags and provide a summary. Return the fraudFlags in an array of strings and the summary as a single string.`,
});

const flagFraudulentActivityFlow = ai.defineFlow(
  {
    name: 'flagFraudulentActivityFlow',
    inputSchema: FlagFraudulentActivityInputSchema,
    outputSchema: FlagFraudulentActivityOutputSchema,
  },
  async input => {
    const {output} = await flagFraudulentActivityPrompt(input);
    return output!;
  }
);
