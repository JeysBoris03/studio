
'use server';

import { recommendTipAmount, type RecommendTipAmountInput, type RecommendTipAmountOutput } from '@/ai/flows/recommend-tip-amount';
import { z } from 'zod';

const actionSchema = z.object({
    restaurantName: z.string({
        required_error: "Restaurant name is required.",
    }).min(1, 'Restaurant name cannot be empty.'),
});

export async function getTipRecommendation(input: RecommendTipAmountInput): Promise<RecommendTipAmountOutput> {
    const parsedInput = actionSchema.safeParse(input);

    if (!parsedInput.success) {
        const errorMessage = parsedInput.error.errors.map(e => e.message).join(', ');
        throw new Error(errorMessage);
    }

    try {
        const result = await recommendTipAmount(parsedInput.data);
        if (typeof result.tipPercentage !== 'number' || typeof result.confidence !== 'number' || typeof result.reason !== 'string') {
            throw new Error('AI returned an invalid response format.');
        }
        return result;
    } catch (error) {
        console.error('Error getting tip recommendation:', error);
        throw new Error('An unexpected error occurred while fetching the recommendation.');
    }
}
