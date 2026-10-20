import { z } from 'zod';

export const menteeOnboardingSchema = z.object({
  interests: z
    .array(z.string().trim())
    .min(1, 'Please select at least one topic you would like guidance on'),
  bio: z.string().trim().max(500, 'Bio cannot exceed 500 characters'),
});

export type MenteeOnboardingFormData = z.infer<typeof menteeOnboardingSchema>;
