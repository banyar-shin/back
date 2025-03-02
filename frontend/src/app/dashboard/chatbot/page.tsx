"use client";

import React, { useState } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, Bot } from "lucide-react";

export default function ChatbotPage() {
  const [message, setMessage] = useState("");

  // Example messages - in a real app, this would be managed with state
  const messages = [
    {
      id: 1,
      role: 'bot',
      content: "Hello! I'm your AI assistant. How can I help you today?"
    },
    {
      id: 2,
      role: 'user',
      content: "What are my upcoming tasks?"
    },
    {
      id: 3,
      role: 'bot',
      content: "You have 4 upcoming tasks. The most urgent one is \"CS-122 Homework 5\" due tomorrow at 2:35 PM."
    }
  ];

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
          <Button variant="outline" size="sm">Clear Chat</Button>
        </div>
      </div>

      <Card className="flex-1 flex flex-col h-[calc(100vh-12rem)]">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
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
                      ? 'bg-primary/10 text-primary-foreground'
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
          </div>

          <div className="border-t p-4 mt-auto">
            <div className="flex space-x-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && message.trim()) {
                    // Handle send message
                    console.log("Message sent:", message);
                    setMessage("");
                  }
                }}
              />
              <Button
                disabled={!message.trim()}
                onClick={() => {
                  if (message.trim()) {
                    // Handle send message
                    console.log("Message sent:", message);
                    setMessage("");
                  }
                }}
              >
                <Send className="h-4 w-4 mr-2" /> Send
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 