'use server';

/**
 * @fileOverview A tip amount recommendation AI agent.
 *
 * - recommendTipAmount - A function that handles the tip recommendation process.
 * - RecommendTipAmountInput - The input type for the recommendTipAmount function.
 * - RecommendTipAmountOutput - The return type for the recommendTipAmount function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendTipAmountInputSchema = z.object({
  restaurantName: z.string().describe('The name of the restaurant.'),
});
export type RecommendTipAmountInput = z.infer<typeof RecommendTipAmountInputSchema>;

const RecommendTipAmountOutputSchema = z.object({
  tipPercentage: z
    .number()
    .describe(
      'The recommended tip percentage based on customer reviews. This should be a number between 0 and 1, representing the tip percentage.'
    ),
  confidence: z
    .number()
    .describe(
      'The confidence level in the tip percentage recommendation, ranging from 0 to 1. Higher values indicate greater confidence.'
    ),
  reason: z
    .string()
    .describe(
      'A brief explanation of why this tip percentage is recommended, based on customer reviews of the restaurant.'
    ),
});
export type RecommendTipAmountOutput = z.infer<typeof RecommendTipAmountOutputSchema>;

export async function recommendTipAmount(input: RecommendTipAmountInput): Promise<RecommendTipAmountOutput> {
  return recommendTipAmountFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendTipAmountPrompt',
  input: {schema: RecommendTipAmountInputSchema},
  output: {schema: RecommendTipAmountOutputSchema},
  prompt: `You are a tip recommendation expert. Your role is to suggest an appropriate tip percentage for a given restaurant based on customer reviews.

You will be provided with the name of the restaurant. You should use your knowledge and any available information to determine a reasonable tip percentage, a confidence level in your recommendation, and a brief explanation.

Consider factors such as service quality, food quality, and overall customer satisfaction when determining the tip percentage. Provide a confidence score (0 to 1) indicating how sure you are about your recommendation, and explain your reasoning based on customer reviews.

Restaurant Name: {{{restaurantName}}}`,
});

const recommendTipAmountFlow = ai.defineFlow(
  {
    name: 'recommendTipAmountFlow',
    inputSchema: RecommendTipAmountInputSchema,
    outputSchema: RecommendTipAmountOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
