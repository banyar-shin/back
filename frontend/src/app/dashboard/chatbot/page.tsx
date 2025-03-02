"use client";

import React, { useState, useEffect, useRef } from "react";
import { useUser } from '@clerk/clerk-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, Bot, Trash2 } from "lucide-react";

// Define message interface
interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
}

export default function ChatbotPage() {
  const { user, isLoaded } = useUser();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'bot',
      content: "Hello! I'm your AI assistant. How can I help you today?"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim() || !user?.id) return;

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage(""); // Clear input
    setIsLoading(true);

    try {
      // Create form data for the request
      const formData = new FormData();
      formData.append('user_id', user.id);
      formData.append('user_input', message);

      // Make the request to the backend
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is null');
      }

      // Create a new bot message
      const botMessageId = Date.now().toString();
      setMessages(prev => [...prev, {
        id: botMessageId,
        role: 'bot',
        content: ''
      }]);

      // Read the stream
      let botResponse = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Decode the chunk and append to the bot message
        const chunk = new TextDecoder().decode(value);
        botResponse += chunk;

        // Update the bot message with the accumulated response
        setMessages(prev =>
          prev.map(msg =>
            msg.id === botMessageId
              ? { ...msg, content: botResponse }
              : msg
          )
        );
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'bot',
        content: 'Sorry, there was an error processing your request. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        role: 'bot',
        content: "Hello! I'm your AI assistant. How can I help you today?"
      }
    ]);
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex-col items-center justify-between space-y-2 md:flex md:flex-row mb-6">
        <div className="w-full text-center md:text-left">
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2 justify-center md:justify-start">
            <MessageSquare className="h-7 w-7" />
            Chatbot
          </h2>
        </div>
        <div className="flex items-center gap-2 justify-center md:justify-start">
          <Button variant="outline" size="sm" onClick={clearChat}>
            <Trash2 className="h-4 w-4 mr-2" /> Clear Chat
          </Button>
        </div>
      </div>

      <Card className="flex-1 flex flex-col h-[calc(100vh-12rem)]">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Assistant
          </CardTitle>
          <CardDescription>
            Chat with our AI assistant to help with your tasks
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {messages.length ? (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`inline-block max-w-[85%] px-4 py-2 rounded-lg ${msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                      }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <p>No messages yet. Start a conversation!</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t p-4 mt-auto">
            <div className="flex space-x-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                className="flex-1"
                disabled={isLoading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && message.trim() && !isLoading) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <Button
                disabled={!message.trim() || isLoading}
                onClick={sendMessage}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing
                  </span>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" /> Send
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 