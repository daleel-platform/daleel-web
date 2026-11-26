import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const CURRENT_YEAR = new Date().getFullYear();

const optionalImageFileSchema = z
  .instanceof(File)
  .refine(
    (file) => file.size <= MAX_FILE_SIZE,
    'Photo must be smaller than 5MB',
  )
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
    'Only .jpg, .png, and .webp formats are supported',
  )
  .optional();

export const menteeOnboardingSchema = z.object({
  file: optionalImageFileSchema,
  interests: z
    .array(z.string().trim().min(1, 'Topic cannot be empty'))
    .min(1, 'Please select at least one topic you would like guidance on')
    .max(5, 'You can select up to 5 topics'),
  bio: z.string().trim().max(500, 'Bio cannot exceed 500 characters'),
});

export type MenteeOnboardingFormData = z.infer<typeof menteeOnboardingSchema>;

const LINKEDIN_HOSTS = ['linkedin.com', 'www.linkedin.com'];

function isLinkedinUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      ['http:', 'https:'].includes(url.protocol) &&
      LINKEDIN_HOSTS.includes(url.hostname) &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}

export const mentorExperienceItemSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(2, 'Job title must be at least 2 characters')
      .max(100, 'Job title cannot exceed 100 characters'),
    company: z
      .string()
      .trim()
      .min(2, 'Company name must be at least 2 characters')
      .max(100, 'Company name cannot exceed 100 characters'),
    startYear: z
      .number({ error: 'Start year is required' })
      .int('Start year must be a whole number')
      .min(1960, 'Enter a valid year')
      .max(CURRENT_YEAR, `Start year cannot be after ${CURRENT_YEAR}`),
    isCurrent: z.boolean(),
    endYear: z
      .number()
      .int('End year must be a whole number')
      .min(1960, 'Enter a valid year')
      .max(CURRENT_YEAR + 1, 'Enter a valid end year')
      .nullable()
      .optional(),
    summary: z
      .string()
      .trim()
      .min(10, 'Summary must be at least 10 characters')
      .max(500, 'Summary cannot exceed 500 characters'),
  })
  .superRefine((val, ctx) => {
    if (!val.isCurrent) {
      if (
        val.endYear === null ||
        val.endYear === undefined ||
        Number.isNaN(val.endYear)
      ) {
        ctx.addIssue({
          code: 'custom',
          path: ['endYear'],
          message: 'End year is required unless this is your current role',
        });
      } else if (val.endYear < val.startYear) {
        ctx.addIssue({
          code: 'custom',
          path: ['endYear'],
          message: 'End year must be greater than or equal to start year',
        });
      }
    }
  });

export const mentorOnboardingSchema = z.object({
  file: optionalImageFileSchema,
  headline: z
    .string()
    .trim()
    .min(3, 'Professional headline must be at least 3 characters')
    .max(100, 'Professional headline cannot exceed 100 characters'),
  yearsOfExperience: z
    .number({ error: 'Years of experience is required' })
    .int('Years of experience must be a whole number')
    .min(1, 'Years of experience must be at least 1 year')
    .max(60, 'Years of experience cannot exceed 60 years'),
  experiences: z
    .array(mentorExperienceItemSchema)
    .min(1, 'Please add at least one work experience entry')
    .max(5, 'You can add up to 5 work experience entries'),
  skills: z
    .array(z.string().trim().min(1, 'Topic cannot be empty'))
    .min(1, 'Please select at least one topic you can mentor on')
    .max(5, 'You can select up to 5 topics'),
  about: z
    .string()
    .trim()
    .min(10, 'About section must be at least 10 characters')
    .max(1000, 'About section cannot exceed 1000 characters'),
  linkedinUrl: z
    .string()
    .trim()
    .refine(
      (value) => value === '' || isLinkedinUrl(value),
      'Please enter a linkedin.com profile URL starting with https://',
    ),
});

export type MentorOnboardingFormData = z.infer<typeof mentorOnboardingSchema>;
