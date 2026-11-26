import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { cn } from '@/utils/cn';
import { useDebounce } from '@/hooks/use-debounce';
import { usePageTitle } from '@/hooks/use-page-title';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { useMentors } from '@/features/mentors/hooks/use-mentors';
import { useConversations } from '@/features/chat/hooks/use-conversations';
import { useMessages } from '@/features/chat/hooks/use-messages';
import { useChatSocket } from '@/features/chat/hooks/use-chat-socket';
import { getOtherParticipant } from '@/features/chat/utils/get-other-participant';
import { ConversationList } from '@/features/chat/components/conversation-list';
import { ChatHeader } from '@/features/chat/components/chat-header';
import { MessageList } from '@/features/chat/components/message-list';
import { MessageInput } from '@/features/chat/components/message-input';
import { EmptyChatState } from '@/features/chat/components/empty-chat-state';
import { NewConversationModal } from '@/features/chat/components/new-conversation-modal';

export function MessagesPage() {
  usePageTitle('Messages');
  const [searchParams, setSearchParams] = useSearchParams();
  const queryConversationId = searchParams.get('conversationId');

  const { data: currentUser, isLoading: isUserLoading } = useCurrentUser();
  const {
    data: conversations = [],
    isLoading: isConversationsLoading,
    isError: isConversationsError,
    error: conversationsError,
    refetch: refetchConversations,
  } = useConversations();

  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [newChatSearch, setNewChatSearch] = useState('');
  const debouncedNewChatSearch = useDebounce(newChatSearch, 500);
  const trimmedDebouncedSearch = debouncedNewChatSearch.trim();

  const { data: mentorsData, isFetching: isFetchingMentors } = useMentors(
    {
      search: trimmedDebouncedSearch || undefined,
      limit: 10,
    },
    {
      enabled: isNewChatModalOpen && Boolean(trimmedDebouncedSearch),
    },
  );

  // Derive active ID: URL query param > default first conversation on desktop
  const selectedConversationId =
    queryConversationId ??
    (typeof window !== 'undefined' &&
    window.innerWidth >= 768 &&
    conversations[0]?.id
      ? conversations[0].id
      : null);

  const handleSelectConversation = (id: string) => {
    setSearchParams({ conversationId: id });
  };

  const handleBackToList = () => {
    setSearchParams({});
  };

  const selectedConversation = conversations.find(
    (c) => c.id === selectedConversationId,
  );

  const otherUser =
    selectedConversation && currentUser
      ? getOtherParticipant(selectedConversation, currentUser.id)
      : null;

  const {
    data: messagesData,
    isLoading: isMessagesLoading,
    isError: isMessagesError,
    error: messagesError,
    refetch: refetchMessages,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useMessages(selectedConversationId);

  const messages = useMemo(() => {
    if (!messagesData) return [];
    return [...messagesData.pages].reverse().flatMap((page) => page.items);
  }, [messagesData]);

  const { sendMessage, isConnected } = useChatSocket({
    conversationId: selectedConversationId,
  });

  const handleSendMessage = async (content: string) => {
    if (!selectedConversationId) return;
    await sendMessage(content);
  };

  const currentUserId = currentUser?.id || '';

  const recipientOptions = useMemo(
    () =>
      (mentorsData?.items ?? [])
        .filter((mentor) => mentor.user.id && mentor.user.id !== currentUserId)
        .map((mentor) => ({
          userId: mentor.user.id,
          name: mentor.user.name,
          headline: mentor.headline,
          avatarUrl: mentor.user.avatarUrl,
        })),
    [mentorsData, currentUserId],
  );

  if (isUserLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 py-4 md:py-8">
      <div className="overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white shadow-xs grid grid-cols-1 md:grid-cols-12 h-[calc(100vh-140px)] min-h-[550px] max-h-[850px]">
        {/* Left Column: Conversations List */}
        <div
          className={cn(
            'md:col-span-4 border-r border-slate-200 h-full overflow-hidden',
            selectedConversationId
              ? 'hidden md:flex flex-col'
              : 'flex flex-col',
          )}
        >
          <ConversationList
            conversations={conversations}
            currentUserId={currentUserId}
            selectedConversationId={selectedConversationId}
            onSelectConversation={handleSelectConversation}
            onNewChatClick={() => setIsNewChatModalOpen(true)}
            isLoading={isConversationsLoading}
            isError={isConversationsError}
            errorMessage={conversationsError?.message}
            onRetry={() => void refetchConversations()}
          />
        </div>

        {/* Right Column: Chat Conversation */}
        <div
          className={cn(
            'md:col-span-8 flex flex-col h-full bg-white overflow-hidden',
            !selectedConversationId ? 'hidden md:flex' : 'flex',
          )}
        >
          {selectedConversationId ? (
            <>
              <ChatHeader
                otherUser={otherUser}
                onBack={handleBackToList}
                isConnected={isConnected}
              />
              <MessageList
                key={selectedConversationId}
                messages={messages}
                currentUserId={currentUserId}
                isLoading={isMessagesLoading}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                onLoadMore={() => void fetchNextPage()}
                isError={isMessagesError}
                errorMessage={messagesError?.message}
                onRetry={() => void refetchMessages()}
              />
              <MessageInput
                onSendMessage={handleSendMessage}
                disabled={!selectedConversationId || !isConnected}
              />
            </>
          ) : (
            <EmptyChatState />
          )}
        </div>
      </div>

      <NewConversationModal
        isOpen={isNewChatModalOpen}
        onClose={() => {
          setIsNewChatModalOpen(false);
          setNewChatSearch('');
        }}
        recipients={recipientOptions}
        searchQuery={newChatSearch}
        onSearchChange={setNewChatSearch}
        isSearching={isFetchingMentors}
        hasSearched={Boolean(trimmedDebouncedSearch)}
        totalMatches={mentorsData?.meta?.totalItems}
        onConversationCreated={(newConvId) =>
          handleSelectConversation(newConvId)
        }
      />
    </div>
  );
}
