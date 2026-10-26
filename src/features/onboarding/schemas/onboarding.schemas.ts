import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const menteeOnboardingSchema = z.object({
  file: z
    .instanceof(File)
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      'Photo must be smaller than 5MB',
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      'Only .jpg, .png, and .webp formats are supported',
    )
    .optional(),
  interests: z
    .array(z.string().trim().min(1, 'Topic cannot be empty'))
    .min(1, 'Please select at least one topic you would like guidance on')
    .max(5, 'You can select up to 5 topics'),
  bio: z.string().trim().max(500, 'Bio cannot exceed 500 characters'),
});

export type MenteeOnboardingFormData = z.infer<typeof menteeOnboardingSchema>;
