'use server';

/**
 * @fileOverview Summarizes the user's query history and corresponding solutions.
 *
 * - summarizeQueryHistory - A function that summarizes the query history.
 * - SummarizeQueryHistoryInput - The input type for the summarizeQueryHistory function.
 * - SummarizeQueryHistoryOutput - The return type for the summarizeQueryHistory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeQueryHistoryInputSchema = z.object({
  queryHistory: z
    .string()
    .describe("The user's query history and corresponding AI solutions."),
});
export type SummarizeQueryHistoryInput = z.infer<typeof SummarizeQueryHistoryInputSchema>;

const SummarizeQueryHistoryOutputSchema = z.object({
  summary: z
    .string()
    .describe('A concise summary of the user query history and solutions.'),
});
export type SummarizeQueryHistoryOutput = z.infer<typeof SummarizeQueryHistoryOutputSchema>;

export async function summarizeQueryHistory(
  input: SummarizeQueryHistoryInput
): Promise<SummarizeQueryHistoryOutput> {
  return summarizeQueryHistoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeQueryHistoryPrompt',
  input: {schema: SummarizeQueryHistoryInputSchema},
  output: {schema: SummarizeQueryHistoryOutputSchema},
  prompt: `You are an AI assistant that summarizes a user's query history and the corresponding AI solutions.  Create a concise summary of the following query history for the user:\n\n{{{queryHistory}}}`,
});

const summarizeQueryHistoryFlow = ai.defineFlow(
  {
    name: 'summarizeQueryHistoryFlow',
    inputSchema: SummarizeQueryHistoryInputSchema,
    outputSchema: SummarizeQueryHistoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
