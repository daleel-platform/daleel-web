import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { useConversations } from '@/features/chat/hooks/use-conversations';
import { useMessages } from '@/features/chat/hooks/use-messages';
import { useChatSocket } from '@/features/chat/hooks/use-chat-socket';
import { ConversationList } from '@/features/chat/components/conversation-list';
import { ChatHeader } from '@/features/chat/components/chat-header';
import { MessageList } from '@/features/chat/components/message-list';
import { MessageInput } from '@/features/chat/components/message-input';
import { EmptyChatState } from '@/features/chat/components/empty-chat-state';
import { NewConversationModal } from '@/features/chat/components/new-conversation-modal';

export function MessagesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryConversationId = searchParams.get('conversationId');

  const { data: currentUser, isLoading: isUserLoading } = useCurrentUser();
  const { data: conversations = [], isLoading: isConversationsLoading } =
    useConversations();

  const [userSelectedId, setUserSelectedId] = useState<string | null>(null);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);

  // Derive active ID: explicitly selected by user > URL query param > default first conversation on desktop
  const selectedConversationId =
    userSelectedId ??
    queryConversationId ??
    (typeof window !== 'undefined' &&
    window.innerWidth >= 768 &&
    conversations[0]?.id
      ? conversations[0].id
      : null);

  const handleSelectConversation = (id: string) => {
    setUserSelectedId(id);
    setSearchParams({ conversationId: id });
  };

  const handleBackToList = () => {
    setUserSelectedId(null);
    setSearchParams({});
  };

  const selectedConversation = conversations.find(
    (c) => c.id === selectedConversationId,
  );

  const otherUser =
    selectedConversation && currentUser
      ? selectedConversation.participant1Id === currentUser.id
        ? selectedConversation.participant2
        : selectedConversation.participant1
      : null;

  const { data: messagesData, isLoading: isMessagesLoading } = useMessages(
    selectedConversationId,
  );

  const { sendMessage, isConnected } = useChatSocket({
    conversationId: selectedConversationId,
  });

  const handleSendMessage = async (content: string) => {
    if (!selectedConversationId) return;
    await sendMessage(content);
  };

  if (isUserLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
      </div>
    );
  }

  const currentUserId = currentUser?.id || '';

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 py-4 md:py-8">
      <div className="overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white shadow-xs grid grid-cols-1 md:grid-cols-12 h-[calc(100vh-140px)] min-h-[550px] max-h-[850px]">
        {/* Left Column: Conversations List */}
        <div
          className={`md:col-span-4 border-r border-slate-200 h-full overflow-hidden ${
            selectedConversationId ? 'hidden md:flex flex-col' : 'flex flex-col'
          }`}
        >
          <ConversationList
            conversations={conversations}
            currentUserId={currentUserId}
            selectedConversationId={selectedConversationId}
            onSelectConversation={handleSelectConversation}
            onNewChatClick={() => setIsNewChatModalOpen(true)}
            isLoading={isConversationsLoading}
          />
        </div>

        {/* Right Column: Chat Conversation */}
        <div
          className={`md:col-span-8 flex flex-col h-full bg-white overflow-hidden ${
            !selectedConversationId ? 'hidden md:flex' : 'flex'
          }`}
        >
          {selectedConversationId ? (
            <>
              <ChatHeader
                otherUser={otherUser}
                onBack={handleBackToList}
                isConnected={isConnected}
              />
              <MessageList
                messages={messagesData?.items ?? []}
                currentUserId={currentUserId}
                isLoading={isMessagesLoading}
              />
              <MessageInput
                onSendMessage={handleSendMessage}
                disabled={!selectedConversationId}
              />
            </>
          ) : (
            <EmptyChatState />
          )}
        </div>
      </div>

      <NewConversationModal
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
        currentUserId={currentUserId}
        onConversationCreated={(newConvId) =>
          handleSelectConversation(newConvId)
        }
      />
    </div>
  );
}
