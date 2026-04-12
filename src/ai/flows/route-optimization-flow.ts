'use server';
/**
 * @fileOverview An AI agent for recommending optimal shipping routes.
 *
 * - aiRouteOptimization - A function that handles the route optimization process.
 * - AiRouteOptimizationInput - The input type for the aiRouteOptimization function.
 * - AiRouteOptimizationOutput - The return type for the aiRouteOptimization function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema
const AiRouteOptimizationInputSchema = z.object({
  originPort: z.string().describe('The origin port for the shipping route.'),
  destinationPort: z.string().describe('The destination port for the shipping route.'),
  vesselType: z.string().describe('The type of vessel being used for the shipment (e.g., "Container", "Tanker", "Bulk Carrier").'),
});
export type AiRouteOptimizationInput = z.infer<typeof AiRouteOptimizationInputSchema>;

// Output Schema
const RouteOptionSchema = z.object({
  routeName: z.string().describe('A descriptive name for the route option (e.g., "Via Suez Canal", "Via Cape of Good Hope").'),
  distanceNm: z.number().describe('The estimated distance of the route in nautical miles.'),
  etaDeltaDays: z.number().describe('The estimated difference in Estimated Time of Arrival (ETA) in days, compared to a direct path. Use 0 for the most direct or fastest option.'),
  costDeltaUsd: z.number().describe('The estimated difference in cost in US dollars, compared to a baseline route. Use 0 for the most cost-effective option.'),
  riskScore: z.number().min(0).max(100).describe('A risk score for the route, ranging from 0 (very low risk) to 100 (critical risk).'),
  riskCategory: z.enum(['Critical', 'High', 'Medium', 'Low']).describe('The category of risk based on the risk score.'),
});

const AiRouteOptimizationOutputSchema = z.object({
  recommendations: z.array(RouteOptionSchema).describe('A list of recommended shipping route options.'),
  aiRecommendation: z.string().describe('A brief explanation from the AI about which route option is recommended and why.'),
});
export type AiRouteOptimizationOutput = z.infer<typeof AiRouteOptimizationOutputSchema>;

export async function aiRouteOptimization(input: AiRouteOptimizationInput): Promise<AiRouteOptimizationOutput> {
  return aiRouteOptimizationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiRouteOptimizationPrompt',
  input: {schema: AiRouteOptimizationInputSchema},
  output: {schema: AiRouteOptimizationOutputSchema},
  prompt: `You are an expert maritime logistics manager. Your task is to recommend optimal shipping routes based on the provided origin, destination, and vessel type.
Consider various factors such as geopolitical risks, weather patterns, historical congestion, and fuel efficiency when generating routes.
Provide at least 3 distinct route options, including a primary recommendation. Each route option should include its estimated distance, ETA delta (compared to a baseline), cost delta (compared to a baseline), and a risk score (0-100) with a corresponding risk category.

Input:
Origin Port: {{{originPort}}}
Destination Port: {{{destinationPort}}}
Vessel Type: {{{vesselType}}}

Provide the output in JSON format, strictly adhering to the specified schema:
`,
});

const aiRouteOptimizationFlow = ai.defineFlow(
  {
    name: 'aiRouteOptimizationFlow',
    inputSchema: AiRouteOptimizationInputSchema,
    outputSchema: AiRouteOptimizationOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
