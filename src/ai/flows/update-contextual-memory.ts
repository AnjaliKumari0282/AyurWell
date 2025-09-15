// src/ai/flows/update-contextual-memory.ts
'use server';

/**
 * @fileOverview Updates the contextual memory of a user based on new queries and feedback on previous solutions.
 *
 * - updateContextualMemory - A function that updates the contextual memory for a user.
 * - UpdateContextualMemoryInput - The input type for the updateContextualMemory function.
 * - UpdateContextualMemoryOutput - The return type for the updateContextualMemory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const UpdateContextualMemoryInputSchema = z.object({
  userId: z.string().describe('The ID of the user.'),
  query: z.string().describe('The latest medical query from the user.'),
  resolvedProblems: z
    .array(z.string())
    .describe('An array of problem descriptions that the user has marked as resolved.'),
  unresolvedProblems: z
    .array(z.string())
    .describe('An array of problem descriptions that the user has marked as unresolved.'),
  currentContextualMemory: z
    .string()
    .describe('The current contextual memory of the user, represented as a string.'),
});
export type UpdateContextualMemoryInput = z.infer<typeof UpdateContextualMemoryInputSchema>;

const UpdateContextualMemoryOutputSchema = z.object({
  updatedContextualMemory: z
    .string()
    .describe('The updated contextual memory of the user, represented as a string.'),
});
export type UpdateContextualMemoryOutput = z.infer<typeof UpdateContextualMemoryOutputSchema>;

export async function updateContextualMemory(
  input: UpdateContextualMemoryInput
): Promise<UpdateContextualMemoryOutput> {
  return updateContextualMemoryFlow(input);
}

const updateContextualMemoryPrompt = ai.definePrompt({
  name: 'updateContextualMemoryPrompt',
  input: {schema: UpdateContextualMemoryInputSchema},
  output: {schema: UpdateContextualMemoryOutputSchema},
  prompt: `You are an AI assistant specialized in maintaining and updating user contextual memory for an Ayurvedic medical support chatbot.

  Instructions:
  1.  Incorporate the new user query into the contextual memory.
  2.  Remove any problems from the contextual memory that the user has marked as resolved.
  3.  Consider the user's new query, resolved problems, and unresolved problems to create an updated contextual memory.
  4.  Ensure the updated contextual memory is concise and relevant to Ayurvedic medical support.
  5. Return the entire updated memory as a single string.

  Current Contextual Memory: {{{currentContextualMemory}}}
  New User Query: {{{query}}}
  Resolved Problems: {{#if resolvedProblems.length}}{{#each resolvedProblems}}- {{{this}}}{{/each}}{{else}}None{{/if}}
  Unresolved Problems: {{#if unresolvedProblems.length}}{{#each unresolvedProblems}}- {{{this}}}{{/each}}{{else}}None{{/if}}

  Updated Contextual Memory:`,
});

const updateContextualMemoryFlow = ai.defineFlow(
  {
    name: 'updateContextualMemoryFlow',
    inputSchema: UpdateContextualMemoryInputSchema,
    outputSchema: UpdateContextualMemoryOutputSchema,
  },
  async input => {
    const {output} = await updateContextualMemoryPrompt(input);
    return {
      updatedContextualMemory: output!.updatedContextualMemory,
    };
  }
);
