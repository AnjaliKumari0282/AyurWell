'use server';

/**
 * @fileOverview Summarizes the user's query into a 3-4 word title.
 *
 * - summarizeForTitle - A function that summarizes the query for a title.
 * - SummarizeForTitleInput - The input type for the summarizeForTitle function.
 * - SummarizeForTitleOutput - The return type for the summarizeForTitle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeForTitleInputSchema = z.object({
  query: z.string().describe("The user's first message in a chat."),
});
export type SummarizeForTitleInput = z.infer<typeof SummarizeForTitleInputSchema>;

const SummarizeForTitleOutputSchema = z.object({
  title: z
    .string()
    .describe('A 3-4 word summary of the user query to be used as a chat title.'),
});
export type SummarizeForTitleOutput = z.infer<typeof SummarizeForTitleOutputSchema>;

export async function summarizeForTitle(
  input: SummarizeForTitleInput
): Promise<SummarizeForTitleOutput> {
  return summarizeForTitleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeForTitlePrompt',
  input: {schema: SummarizeForTitleInputSchema},
  output: {schema: SummarizeForTitleOutputSchema},
  prompt: `Summarize the following user query into a concise 3-4 word title for a chat history entry:\n\n{{{query}}}`,
});

const summarizeForTitleFlow = ai.defineFlow(
  {
    name: 'summarizeForTitleFlow',
    inputSchema: SummarizeForTitleInputSchema,
    outputSchema: SummarizeForTitleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
