export interface UserSummary {
  id: string;
  name: string;
  avatarUrl: string | null;
}

export type MessageType =
  'TEXT' | 'IMAGE' | 'PDF' | 'AUDIO' | 'VIDEO' | 'VOICE_NOTE';

export interface QuotedMessage {
  id: string;
  senderId: string;
  type: MessageType;
  content: string;
  fileName: string | null;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  type: MessageType;
  content: string;
  mediaUrl: string | null;
  fileName: string | null;
  fileSize: number | null;
  mimeType: string | null;
  replyToId: string | null;
  replyTo?: QuotedMessage | null;
  isEdited: boolean;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  id: string;
  participant1Id: string;
  participant2Id: string;
  participant1: UserSummary;
  participant2: UserSummary;
  lastMessage: Message | null;
  lastMessageAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedMessages {
  items: Message[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface SendMessagePayload {
  conversationId: string;
  content: string;
  replyToId?: string;
}
