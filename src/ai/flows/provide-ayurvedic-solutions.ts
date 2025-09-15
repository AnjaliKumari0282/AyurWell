'use server';

/**
 * @fileOverview This file defines the Genkit flow for providing personalized Ayurvedic solutions to user queries.
 *
 * - provideAyurvedicSolutions - A function that takes a user's medical query and returns personalized Ayurvedic solutions.
 * - ProvideAyurvedicSolutionsInput - The input type for the provideAyurvedicSolutions function.
 * - ProvideAyurvedicSolutionsOutput - The return type for the provideAyurvedicSolutions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvideAyurvedicSolutionsInputSchema = z.object({
  query: z.string().describe('The user medical query related to Ayurveda.'),
  userId: z.string().describe('The ID of the user making the query.'),
  contextMemory: z.string().optional().describe('Contextual memory of unresolved problems per user')
});
export type ProvideAyurvedicSolutionsInput = z.infer<typeof ProvideAyurvedicSolutionsInputSchema>;

const ProvideAyurvedicSolutionsOutputSchema = z.object({
  solution: z.string().describe('The personalized Ayurvedic solution to the query.'),
  updatedContextMemory: z.string().optional().describe('Updated contextual memory of unresolved problems per user')
});
export type ProvideAyurvedicSolutionsOutput = z.infer<typeof ProvideAyurvedicSolutionsOutputSchema>;

export async function provideAyurvedicSolutions(input: ProvideAyurvedicSolutionsInput): Promise<ProvideAyurvedicSolutionsOutput> {
  return provideAyurvedicSolutionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'provideAyurvedicSolutionsPrompt',
  input: {
    schema: ProvideAyurvedicSolutionsInputSchema,
  },
  output: {
    schema: ProvideAyurvedicSolutionsOutputSchema,
  },
  prompt: `You are an AI-powered Ayurvedic expert. A user will provide a medical query related to Ayurveda, and you will respond with personalized Ayurvedic solutions based on the user’s query.  Consider the user's current contextual memory when crafting your response.  Update the contextual memory with new information from the query, including unresolved problems.

User Query: {{{query}}}
User ID: {{{userId}}}
Contextual Memory: {{{contextMemory}}}

Solution:`, 
});

const provideAyurvedicSolutionsFlow = ai.defineFlow(
  {
    name: 'provideAyurvedicSolutionsFlow',
    inputSchema: ProvideAyurvedicSolutionsInputSchema,
    outputSchema: ProvideAyurvedicSolutionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
