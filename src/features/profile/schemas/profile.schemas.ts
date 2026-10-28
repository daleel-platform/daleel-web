import { z } from 'zod';

export const editProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  bio: z
    .string()
    .trim()
    .max(500, 'Bio cannot exceed 500 characters')
    .optional(),
  headline: z
    .string()
    .trim()
    .max(100, 'Headline cannot exceed 100 characters')
    .optional(),
  yearsOfExperience: z
    .number()
    .min(1, 'Years of experience must be at least 1 year')
    .max(60, 'Years of experience cannot exceed 60 years')
    .optional(),
  about: z
    .string()
    .trim()
    .max(1000, 'About cannot exceed 1000 characters')
    .optional(),
});

export type EditProfileFormData = z.infer<typeof editProfileSchema>;

export const mentorApplicationSchema = z.object({
  headline: z
    .string()
    .trim()
    .min(3, 'Professional headline must be at least 3 characters')
    .max(100, 'Professional headline cannot exceed 100 characters'),
  yearsOfExperience: z
    .number()
    .min(1, 'Years of experience must be at least 1 year')
    .max(60, 'Years of experience cannot exceed 60 years'),
  about: z
    .string()
    .trim()
    .min(10, 'About section must be at least 10 characters')
    .max(1000, 'About section cannot exceed 1000 characters'),
  skills: z
    .array(z.string().trim().min(1))
    .min(1, 'At least one mentoring skill is required'),
});

export type MentorApplicationFormData = z.infer<typeof mentorApplicationSchema>;

export const addTopicSchema = z.object({
  topic: z
    .string()
    .trim()
    .min(1, 'Topic name cannot be empty')
    .max(50, 'Topic name cannot exceed 50 characters'),
});

export type AddTopicFormData = z.infer<typeof addTopicSchema>;

export const addSkillSchema = z.object({
  skill: z
    .string()
    .trim()
    .min(1, 'Skill name cannot be empty')
    .max(50, 'Skill name cannot exceed 50 characters'),
});

export type AddSkillFormData = z.infer<typeof addSkillSchema>;
