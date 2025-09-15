'use server';

import { provideAyurvedicSolutions } from '@/ai/flows/provide-ayurvedic-solutions';
import { summarizeForTitle } from '@/ai/flows/summarize-for-title';

const USER_ID = 'user-session-123'; // Dummy user ID for now

export async function getAiResponse(
  query: string,
  contextMemory: string
): Promise<{ solution: string; updatedContextMemory: string }> {
  try {
    const response = await provideAyurvedicSolutions({
      query,
      userId: USER_ID,
      contextMemory,
    });
    return {
      solution: response.solution,
      updatedContextMemory: response.updatedContextMemory || '',
    };
  } catch (error) {
    console.error('Error getting AI response:', error);
    return {
      solution: 'Sorry, I encountered an error. Please try again later.',
      updatedContextMemory: contextMemory,
    };
  }
}

export async function getChatTitle(query: string): Promise<string> {
  try {
    const response = await summarizeForTitle({ query });
    return response.title;
  } catch (error) {
    console.error('Error generating title:', error);
    // Fallback to simpler title generation
    return query.split(' ').slice(0, 5).join(' ');
  }
}
