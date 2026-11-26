import { z } from 'zod';

export function createConversationSchema(currentUserId: string) {
  return z.object({
    recipientId: z
      .string()
      .trim()
      .min(1, 'Recipient User ID is required')
      .uuid('Please enter a valid UUID')
      .refine((val) => val !== currentUserId, {
        message: 'You cannot start a conversation with yourself.',
      }),
  });
}

export type CreateConversationFormData = z.infer<
  ReturnType<typeof createConversationSchema>
>;
