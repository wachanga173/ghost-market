'use client';

import { useEffect, useRef, useState } from 'react';
import {
  createConversation,
  sendEncryptedMessage,
  subscribeToConversation,
  markMessageAsRead,
  EncryptedMessage,
  Conversation,
} from '@/lib/p2p-chat';
import { getCurrentAddress } from '@/lib/auth';

interface ChatProps {
  otherParticipant: string;
  jobId?: string;
}

export default function P2PChat({ otherParticipant, jobId }: ChatProps) {
  const [messages, setMessages] = useState<EncryptedMessage[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [currentAddress, setCurrentAddress] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isEncrypting, setIsEncrypting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat
  useEffect(() => {
    const initChat = async () => {
      const address = await getCurrentAddress();
      setCurrentAddress(address);

      if (address) {
        // Create or retrieve conversation
        const conv = await createConversation(address, otherParticipant, jobId);
        if (conv) {
          setConversation(conv);
          setIsEncrypting(true);
        }
      }
    };

    initChat();
  }, [otherParticipant, jobId]);

  // Subscribe to messages
  useEffect(() => {
    if (!conversation) return;

    const unsubscribe = subscribeToConversation(conversation.id, (msgs) => {
      setMessages(msgs);
      setIsEncrypting(false);
      scrollToBottom();
    });

    return unsubscribe;
  }, [conversation]);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Send message
  const handleSendMessage = async () => {
    if (!inputValue.trim() || !currentAddress || !conversation) return;

    setIsSending(true);
    setIsEncrypting(true);

    const sent = await sendEncryptedMessage(
      conversation.id,
      currentAddress,
      otherParticipant,
      inputValue
    );

    if (sent) {
      setInputValue('');
    }

    setIsSending(false);
    setIsEncrypting(false);
  };

  // Mark message as read
  const handleMessageClick = async (message: EncryptedMessage) => {
    if (!message.read && message.to === currentAddress && conversation) {
      await markMessageAsRead(conversation.id, message.id);
    }
  };

  if (!currentAddress) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-950 rounded-lg">
        <p className="text-gray-400">Please connect your wallet to chat</p>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-950 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-cyan-500 mx-auto mb-2" />
          <p className="text-gray-400">Initializing encrypted chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-900 to-gray-950 rounded-lg border border-white/10">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">
              {otherParticipant.slice(0, 6)}...{otherParticipant.slice(-4)}
            </h3>
            <p className="text-xs text-gray-400">
              {conversation.encryptionVerified ? '🔒 E2E Encrypted' : '🔓 Enabling encryption...'}
            </p>
          </div>
          <div className="text-xs text-gray-500">
            {messages.filter((m) => m.to === currentAddress && !m.read).length > 0 && (
              <span className="bg-red-500 text-white px-2 py-1 rounded-full">
                {messages.filter((m) => m.to === currentAddress && !m.read).length}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>No messages yet. Start a conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.from === currentAddress ? 'justify-end' : 'justify-start'}`}
              onClick={() => handleMessageClick(message)}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  message.from === currentAddress
                    ? 'bg-cyan-600 text-white rounded-br-none'
                    : 'bg-white/10 text-gray-100 rounded-bl-none border border-white/20'
                } transition-all`}
              >
                <p className="text-sm">{message.content}</p>
                <div className="flex items-center justify-between mt-1 gap-2">
                  <span className="text-xs opacity-70">
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  {message.from === currentAddress && (
                    <span className="text-xs">
                      {message.read ? '✓✓' : '✓'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Status indicator */}
      {isEncrypting && (
        <div className="px-4 py-2 bg-yellow-950/30 border-t border-yellow-500/20 text-xs text-yellow-400">
          🔐 Encrypting with Gun.js SEA...
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-white/10 bg-gradient-to-t from-black to-transparent">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message... (E2E encrypted)"
            className="flex-1 px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-500 border border-white/20 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all"
            disabled={isSending}
          />
          <button
            onClick={handleSendMessage}
            disabled={isSending || !inputValue.trim()}
            className="px-6 py-3 rounded-lg font-semibold bg-gradient-to-r from-cyan-500 to-cyan-600 text-black hover:from-cyan-400 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isSending ? '...' : 'Send'}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Messages are encrypted with Gun.js SEA. Never stored on centralized servers.
        </p>
      </div>
    </div>
  );
}
