import type { Conversation, UserSummary } from '../types/chat.types';

export function getOtherParticipant(
  conversation: Conversation,
  currentUserId: string,
): UserSummary {
  return conversation.participant1Id === currentUserId
    ? conversation.participant2
    : conversation.participant1;
}
