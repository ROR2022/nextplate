"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Send, AlertCircle } from "lucide-react";
import { useTranslations } from 'next-intl';

interface Message {
  content: string;
  role: 'user' | 'assistant' | 'error';
}

export default function Chatbot() {
  const t = useTranslations('dashboard.chatbot');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) {
      return;
    }
    
    const userMessage = input.trim();
    setInput('');
    
    // Add user message to chat
    setMessages(prev => [...prev, { content: userMessage, role: 'user' }]);
    
    // Set loading state
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (data.isMissingApiKey) {
          setError(t('apiKeyMissing'));
        } else {
          setError(data.error || t('error'));
        }
        return;
      }
      
      // Add bot response to chat
      setMessages(prev => [...prev, { content: data.reply, role: 'assistant' }]);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      setError(t('connectionError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 h-[300px] overflow-y-auto p-2 border rounded-md">
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 h-full flex items-center justify-center">
              <p>{t('initialMessage')}</p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div 
                key={i} 
                className={`p-3 rounded-lg max-w-[80%] ${
                  msg.role === 'user' 
                    ? 'bg-primary text-primary-foreground ml-auto' 
                    : msg.role === 'error'
                    ? 'bg-destructive text-destructive-foreground'
                    : 'bg-muted'
                }`}
              >
                {msg.content}
              </div>
            ))
          )}
          
          {error && (
            <div className="p-3 rounded-lg bg-destructive text-destructive-foreground flex gap-2 items-center">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}
          
          {isLoading && (
            <div className="flex items-center justify-center p-2">
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="w-full flex gap-2">
          <Input
            placeholder={t('inputPlaceholder')}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-grow"
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
} 