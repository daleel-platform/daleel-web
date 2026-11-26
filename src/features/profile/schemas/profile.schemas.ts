import { z } from 'zod';

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

export const editPersonalInfoSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Full name must be between 2 and 100 characters.')
    .max(100, 'Full name must be between 2 and 100 characters.'),
  bio: z.string().trim().max(500, 'Bio must be 500 characters or fewer.'),
});

export type EditPersonalInfoFormData = z.infer<typeof editPersonalInfoSchema>;

export const editMentorDetailsSchema = z.object({
  headline: z
    .string()
    .trim()
    .min(3, 'Headline must be between 3 and 150 characters.')
    .max(150, 'Headline must be between 3 and 150 characters.'),
  yearsOfExperience: z
    .number({ error: 'Years of experience must be between 1 and 60.' })
    .int('Years of experience must be a whole number.')
    .min(1, 'Years of experience must be between 1 and 60.')
    .max(60, 'Years of experience must be between 1 and 60.'),
  about: z
    .string()
    .trim()
    .min(10, 'About mentor description must be between 10 and 1000 characters.')
    .max(
      1000,
      'About mentor description must be between 10 and 1000 characters.',
    ),
  linkedinUrl: z
    .string()
    .trim()
    .refine(
      (value) => value === '' || isLinkedinUrl(value),
      'Please enter a linkedin.com profile URL starting with https://',
    ),
});

export type EditMentorDetailsFormData = z.infer<typeof editMentorDetailsSchema>;

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
