import { useState } from 'react';
import { Search, Send, Video } from 'lucide-react';

import { Avatar } from '@/components/avatar';
import { Button } from '@/components/button';

const initialConversations = [
  {
    id: 'c1',
    mentorName: 'Ahmed Nasser',
    mentorRole: 'Senior Staff PM at Careem',
    lastMessage:
      'Looking forward to our call tomorrow! Have your 3 questions ready.',
    time: '10:45 AM',
    unread: 1,
    status: 'online' as const,
  },
  {
    id: 'c2',
    mentorName: 'Sarah Mansour',
    mentorRole: 'Staff Software Engineer at Stripe',
    lastMessage:
      'Here are the design doc templates we talked about in the session.',
    time: 'Yesterday',
    unread: 0,
    status: 'offline' as const,
  },
  {
    id: 'c3',
    mentorName: 'Lina Haddad',
    mentorRole: 'Design Director at Instabug',
    lastMessage:
      'Your portfolio case study structure is looking much stronger now!',
    time: 'Oct 8',
    unread: 0,
    status: 'online' as const,
  },
];

export function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState(initialConversations[0]);
  const [messageText, setMessageText] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'm1',
      sender: 'mentor',
      text: 'Hi there! Excited for our session tomorrow. How can I best help you prepare?',
      time: '10:30 AM',
    },
    {
      id: 'm2',
      sender: 'user',
      text: "Hi Ahmed! I've been struggling to balance technical execution with product roadmap prioritization when talking to stakeholders. Really eager to get your framework on this.",
      time: '10:38 AM',
    },
    {
      id: 'm3',
      sender: 'mentor',
      text: 'Looking forward to our call tomorrow! Have your 3 questions ready.',
      time: '10:45 AM',
    },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    setChatMessages((prev) => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        sender: 'user',
        text: messageText.trim(),
        time: 'Just now',
      },
    ]);
    setMessageText('');
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-6 md:py-8">
      <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xs grid grid-cols-1 md:grid-cols-12 min-h-[680px]">
        {/* Left Column: Threads List (4 cols) */}
        <div className="md:col-span-4 border-r border-slate-200 flex flex-col bg-slate-50/50">
          <div className="p-4 border-b border-slate-200 bg-white">
            <h2 className="text-base font-bold text-slate-900">
              Direct Messages
            </h2>
            <div className="relative mt-3">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-teal-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-600/10"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {initialConversations.map((conv) => {
              const isSelected = conv.id === selectedChat.id;
              return (
                <button
                  key={conv.id}
                  type="button"
                  onClick={() => setSelectedChat(conv)}
                  className={`w-full text-left p-4 transition-colors flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-teal-50/70 border-l-4 border-teal-700'
                      : 'hover:bg-white'
                  }`}
                >
                  <Avatar
                    name={conv.mentorName}
                    size="md"
                    status={conv.status}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {conv.mentorName}
                      </span>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {conv.time}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {conv.mentorRole}
                    </p>
                    <p className="text-xs text-slate-600 truncate mt-1">
                      {conv.lastMessage}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Chat Conversation (8 cols) */}
        <div className="md:col-span-8 flex flex-col bg-white">
          {/* Conversation Header */}
          <div className="flex items-center justify-between border-b border-slate-100 p-4">
            <div className="flex items-center gap-3">
              <Avatar
                name={selectedChat.mentorName}
                size="md"
                status={selectedChat.status}
              />
              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-none">
                  {selectedChat.mentorName}
                </h3>
                <p className="text-xs text-teal-700 font-medium mt-1 leading-none">
                  {selectedChat.mentorRole}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Video className="h-3.5 w-3.5" />}
              >
                Join Room
              </Button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
            {chatMessages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-md rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                      isUser
                        ? 'bg-teal-700 text-white rounded-br-xs shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-2xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1">
                    {msg.time}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Message Input Box */}
          <form
            onSubmit={handleSendMessage}
            className="border-t border-slate-200 p-4 bg-white flex items-center gap-2"
          >
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type your message to mentor..."
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-600/10"
            />
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={!messageText.trim()}
              rightIcon={<Send className="h-3.5 w-3.5" />}
            >
              Send
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
