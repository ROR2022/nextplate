"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Send, AlertCircle, FileText, ExternalLink } from "lucide-react";
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Link from 'next/link';

// Tipos para los mensajes y sugerencias
interface Message {
  content: string;
  role: 'user' | 'assistant' | 'error';
  suggestions?: DocSuggestion[];
  fromDocs?: boolean;
}

interface DocSuggestion {
  title: string;
  section: string;
  path: string;
  snippet: string;
}

export default function Chatbot() {
  const params = useParams();
  const locale = (params?.locale as string) || 'es';
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

  const handleSubmit = async (e: React.FormEvent, options?: { useOpenAI?: boolean, replyToIndex?: number }) => {
    e.preventDefault();
    
    if ((!input.trim() && options?.replyToIndex === undefined) || isLoading) {
      return;
    }
    
    // Si estamos solicitando respuesta de OpenAI para una sugerencia previa
    let userMessage = input.trim();
    const skipDocs = false;
    let useOpenAI = options?.useOpenAI || false;
    
    // Limpiar el input solo si estamos enviando un mensaje nuevo
    if (options?.replyToIndex === undefined) {
      setInput('');
      
      // Añadir mensaje del usuario
      setMessages(prev => [...prev, { content: userMessage, role: 'user' }]);
    } else {
      // Estamos pidiendo respuesta de IA para una sugerencia previa
      useOpenAI = true;
      
      // Obtener el mensaje original del usuario
      const originalMessage = messages[options.replyToIndex].content;
      userMessage = originalMessage;
      
      // Añadir un mensaje indicando que ahora responderá la IA
      setMessages(prev => [
        ...prev, 
        { 
          content: t('usingAI', { defaultValue: 'Ahora responderé usando IA...' }), 
          role: 'assistant' 
        }
      ]);
    }
    
    // Set loading state
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: userMessage,
          locale,
          useOpenAI,
          skipDocs
        }),
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
      
      // Añadir respuesta al chat
      setMessages(prev => [
        ...prev, 
        { 
          content: data.reply, 
          role: 'assistant',
          suggestions: data.suggestions,
          fromDocs: data.fromDocs
        }
      ]);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      setError(t('connectionError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseAI = (messageIndex: number) => {
    // Comprobar si ya hay una respuesta de IA después de este mensaje
    const nextMessage = messages[messageIndex + 1];
    if (nextMessage && !nextMessage.fromDocs) {
      // Ya hay una respuesta de IA, no hacer nada
      return;
    }

    handleSubmit(
      { preventDefault: () => {} } as React.FormEvent, 
      { useOpenAI: true, replyToIndex: messageIndex }
    );
  };

  /**
   * Renderiza el contenido de un mensaje con formato markdown básico
   */
  const renderMessageContent = (content: string) => {
    // Convertir enlaces markdown [texto](url) a enlaces HTML
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const withLinks = content.replace(linkRegex, (_, text, url) => {
      return `<a href="${url}" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">${text}</a>`;
    });

    // Convertir formato de negrita **texto** a <strong>
    const boldRegex = /\*\*([^*]+)\*\*/g;
    const withBold = withLinks.replace(boldRegex, (_, text) => {
      return `<strong>${text}</strong>`;
    });

    // Convertir saltos de línea a <br>
    const withLineBreaks = withBold.replace(/\n/g, '<br>');

    return <div dangerouslySetInnerHTML={{ __html: withLineBreaks }} />;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 h-[400px] overflow-y-auto p-2 border rounded-md">
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 h-full flex items-center justify-center">
              <p>{t('initialMessage')}</p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className="space-y-2">
                <div 
                  className={`p-3 rounded-lg ${
                    msg.role === 'user' 
                      ? 'bg-primary text-primary-foreground ml-auto max-w-[80%]' 
                      : msg.role === 'error'
                      ? 'bg-destructive text-destructive-foreground max-w-[90%]'
                      : 'bg-muted max-w-[90%]'
                  }`}
                >
                  {renderMessageContent(msg.content)}
                  
                  {/* Mostrar sugerencias de documentación si existen */}
                  {msg.fromDocs && msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-muted-foreground/20">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2"
                        onClick={() => handleUseAI(i - 1)} // i-1 corresponde al mensaje del usuario
                      >
                        {t('useAI', { defaultValue: 'Usar IA para respuesta detallada' })}
                      </Button>
                    </div>
                  )}
                </div>
                
                {/* Enlaces directos a documentación sugerida */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-2 ml-1">
                    {msg.suggestions.map((suggestion, j) => (
                      <Link 
                        key={j} 
                        href={suggestion.path}
                        className="inline-flex items-center gap-1 text-xs bg-secondary/50 hover:bg-secondary px-2 py-1 rounded-full"
                      >
                        <FileText className="h-3 w-3" />
                        <span className="truncate max-w-[150px]">{suggestion.title}</span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    ))}
                  </div>
                )}
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