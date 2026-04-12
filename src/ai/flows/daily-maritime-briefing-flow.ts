'use server';
/**
 * @fileOverview This flow generates a daily AI-powered summary of critical maritime risks and recommendations.
 *
 * - dailyMaritimeBriefing - A function to generate the daily maritime briefing.
 * - DailyMaritimeBriefingInput - The input type for the dailyMaritimeBriefing function.
 * - DailyMaritimeBriefingOutput - The return type for the dailyMaritimeBriefing function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DailyMaritimeBriefingInputSchema = z.object({});
export type DailyMaritimeBriefingInput = z.infer<typeof DailyMaritimeBriefingInputSchema>;

const DailyMaritimeBriefingOutputSchema = z.object({
  summaryTitle: z
    .string()
    .describe('The title of the daily maritime risk summary, including the current date.'),
  criticalSection: z
    .string()
    .describe('A summary of critical maritime risks and alerts, potentially including vessel names or regions.'),
  portWatchSection: z
    .string()
    .describe('A summary of port status and congestion, focusing on high-risk or major global ports.'),
  recommendedSection: z
    .string()
    .describe('Recommendations, positive developments, or strategic advice for maritime logistics.'),
});
export type DailyMaritimeBriefingOutput = z.infer<typeof DailyMaritimeBriefingOutputSchema>;

export async function dailyMaritimeBriefing(
  input: DailyMaritimeBriefingInput
): Promise<DailyMaritimeBriefingOutput> {
  return dailyMaritimeBriefingFlow(input);
}

const dailyMaritimeBriefingPrompt = ai.definePrompt({
  name: 'dailyMaritimeBriefingPrompt',
  input: {schema: DailyMaritimeBriefingInputSchema},
  output: {schema: DailyMaritimeBriefingOutputSchema},
  prompt: `You are MarineGuide, an expert maritime intelligence analyst. Your task is to generate a concise daily maritime risk summary for today.

The summary should cover critical risks, port watch updates, and actionable recommendations.

Your output must be a JSON object conforming to the following structure:
{{jsonSchema DailyMaritimeBriefingOutputSchema}}

Generate a "summaryTitle" that includes the current date, for example: "Daily Maritime Risk Summary — April 3, 2026".
For the "criticalSection", focus on severe, immediate threats to vessels or routes, including specific vessel names or regions if applicable. Example: "🔴 Critical section: MSC Elena & Alta Maya: Houthi threat — Red Sea alert; Cyclone forming — Arabian Sea corridors severely affected."
For the "portWatchSection", provide updates on port statuses, congestion levels, and significant delays, especially in high-risk or major global ports. Example: "🟡 Port watch section: Shanghai port Severe — 18h+ berth delay expected; Rotterdam berths 7-9 closed for maintenance."
For the "recommendedSection", highlight positive developments, strategic advice, or recommendations for optimizing logistics. Example: "🟢 Recommended section: Singapore additional berths opened — easing congestion; Suez Canal fee increase — re-evaluate route cost models."

Ensure the content is professional, actionable, and reflects current maritime intelligence.`,
});

const dailyMaritimeBriefingFlow = ai.defineFlow(
  {
    name: 'dailyMaritimeBriefingFlow',
    inputSchema: DailyMaritimeBriefingInputSchema,
    outputSchema: DailyMaritimeBriefingOutputSchema,
  },
  async input => {
    const {output} = await dailyMaritimeBriefingPrompt(input);
    return output!;
  }
);
