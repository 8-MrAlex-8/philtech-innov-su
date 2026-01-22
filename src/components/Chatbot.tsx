"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { X, Send, Trash2, Loader2 } from "lucide-react";
import {
  ChatMessage,
  saveChatMessage,
  getChatHistory,
  clearChatHistory,
} from "../lib/supabase";

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  petId: number;
  petName: string;
  petType?: string;
}

// Generate a simple user ID (in production, use proper auth)
function getUserId(): string {
  if (typeof window === "undefined") return "anonymous";

  // Prefer the game's playerId if present (keeps chat history tied to player)
  const storedPlayerId =
    localStorage.getItem("playerId") || localStorage.getItem("player_id");
  if (storedPlayerId) return storedPlayerId;

  let userId = localStorage.getItem("chat_user_id");
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("chat_user_id", userId);
  }
  return userId;
}

// Fetch response from OpenAI via our API route
async function getAIResponse(
  messages: { role: string; content: string }[],
  petName: string,
  petType: string,
): Promise<string> {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, petName, petType }),
    });

    if (!response.ok) {
      throw new Error("Failed to get AI response");
    }

    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error("AI response error:", error);
    // Fallback response
    return `*looks apologetic* ${petName} is having trouble thinking right now. Can we try again? 🙏`;
  }
}

export default function Chatbot({
  isOpen,
  onClose,
  petId,
  petName,
  petType = "pet",
}: ChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const userId = getUserId();

  const loadChatHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      const history = await getChatHistory(userId, petId);
      setMessages(history);
    } catch (error) {
      console.error("Failed to load chat history:", error);
      // Show welcome message if no history
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  }, [userId, petId]);

  // Load chat history when opened
  useEffect(() => {
    if (isOpen && petId) {
      loadChatHistory();
    }
  }, [isOpen, petId, loadChatHistory]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      user_id: userId,
      pet_id: petId,
      role: "user",
      content: inputValue.trim(),
    };

    // Add user message to UI immediately
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      // Save user message to Supabase (don't wait/fail if it doesn't work)
      saveChatMessage(userMessage).catch((err) =>
        console.error("Failed to save user message:", err),
      );

      // Prepare messages for OpenAI (include conversation history)
      const conversationHistory = [...messages, userMessage].map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      // Get AI response from OpenAI
      const responseContent = await getAIResponse(
        conversationHistory,
        petName || "Your pet",
        petType,
      );

      const assistantMessage: ChatMessage = {
        user_id: userId,
        pet_id: petId,
        role: "assistant",
        content: responseContent,
      };

      // Save assistant message to Supabase (don't wait/fail if it doesn't work)
      saveChatMessage(assistantMessage).catch((err) =>
        console.error("Failed to save assistant message:", err),
      );

      // Add to UI
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);
      // Fallback response if API fails
      const fallbackResponse = `*looks apologetic* ${petName} is having trouble right now. Can we try again? 🙏`;
      setMessages((prev) => [
        ...prev,
        {
          user_id: userId,
          pet_id: petId,
          role: "assistant",
          content: fallbackResponse,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearHistory = async () => {
    if (!confirm("Are you sure you want to clear chat history?")) return;

    try {
      const success = await clearChatHistory(userId, petId);
      if (success) {
        setMessages([]);
      }
    } catch (error) {
      console.error("Error clearing history:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
      <div className="bg-white border-2 border-black rounded-lg w-full max-w-md h-125 flex flex-col shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b-2 border-black">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <span className="text-white text-sm">💬</span>
            </div>
            <div>
              <h3 className="font-bold text-lg">
                Chat with {petName || "Pet"}
              </h3>
              <p className="text-xs text-gray-500">
                Your companion is listening...
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleClearHistory}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              title="Clear chat history"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <span className="text-4xl mb-2">👋</span>
              <p className="text-center">
                Say hello to {petName || "your pet"}!
              </p>
              <p className="text-xs text-center mt-1">
                Your messages are saved automatically.
              </p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={message.id || index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-lg border-2 border-black ${
                    message.role === "user"
                      ? "bg-black text-white"
                      : "bg-white text-black"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
              </div>
            ))
          )}
          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[80%] px-4 py-2 rounded-lg border-2 border-black bg-white">
                <div className="flex gap-1">
                  <div
                    className="w-2 h-2 bg-black rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <div
                    className="w-2 h-2 bg-black rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="w-2 h-2 bg-black rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t-2 border-black">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              disabled={isTyping}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="px-4 py-2 bg-black text-white rounded-md border-2 border-black hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
