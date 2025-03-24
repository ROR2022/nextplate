'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2Icon, MailOpenIcon, MailIcon, RefreshCwIcon } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { redirect } from 'next/navigation';
import AdminNav from '@/components/admin/admin-nav';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

// Tipo para los mensajes de contacto
interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  read: boolean;
}

export default function AdminMessagesPage() {
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('admin.messages');
  const commonT = useTranslations('common');
  
  // Estado para mensajes
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  
  // Verificar si el usuario es administrador
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  
  // Función para obtener locale de date-fns
  const getDateLocale = (locale: string) => {
    return locale === 'es' ? es : enUS;
  };
  
  // Función para cargar mensajes
  const loadMessages = async () => {
    setIsLoading(true);
    
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      setMessages(data || []);
    } catch (error) {
      console.error('Error al cargar mensajes:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Función para marcar un mensaje como leído
  const markAsRead = async (id: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('contact_messages')
        .update({ read: true })
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      // Actualizar lista de mensajes
      setMessages(prev => 
        prev.map(msg => 
          msg.id === id ? { ...msg, read: true } : msg
        )
      );
      
      // Si es el mensaje seleccionado, actualizar
      if (selectedMessage?.id === id) {
        setSelectedMessage(prev => prev ? { ...prev, read: true } : null);
      }
      
    } catch (error) {
      console.error('Error al marcar mensaje como leído:', error);
    }
  };
  
  // Efecto para verificar si el usuario es admin
  useEffect(() => {
    const checkAdmin = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return redirect('/');
      }
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      if (!profile || profile.role !== 'admin') {
        return redirect(`/${locale}/dashboard`);
      }
      
      setIsAdmin(true);
      loadMessages();
    };
    
    checkAdmin();
  }, [locale]);
  
  // Si aún estamos verificando, mostrar un indicador de carga
  if (isAdmin === null) {
    return (
      <div className="container mx-auto py-10 flex justify-center items-center h-[50vh]">
        <Loader2Icon className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">{t('title')}</h1>
      
      <AdminNav locale={locale} />
      
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t('messages.title')}</CardTitle>
            <CardDescription>{t('messages.description')}</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={loadMessages}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2Icon className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCwIcon className="h-4 w-4" />
            )}
            <span className="ml-2">{commonT('refresh')}</span>
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2Icon className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {t('messages.empty')}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('table.status')}</TableHead>
                  <TableHead>{t('table.name')}</TableHead>
                  <TableHead>{t('table.email')}</TableHead>
                  <TableHead>{t('table.date')}</TableHead>
                  <TableHead>{t('table.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell>
                      <Badge variant={message.read ? "outline" : "default"}>
                        {message.read ? (
                          <MailOpenIcon className="h-3 w-3 mr-1" />
                        ) : (
                          <MailIcon className="h-3 w-3 mr-1" />
                        )}
                        {message.read ? t('status.read') : t('status.unread')}
                      </Badge>
                    </TableCell>
                    <TableCell>{message.name}</TableCell>
                    <TableCell>{message.email}</TableCell>
                    <TableCell>
                      {format(
                        new Date(message.created_at),
                        'PPp',
                        { locale: getDateLocale(locale) }
                      )}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSelectedMessage(message)}
                      >
                        {t('actions.view')}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      {/* Modal para ver un mensaje */}
      <Dialog 
        open={!!selectedMessage} 
        onOpenChange={(open) => {
          if (!open) {
            setSelectedMessage(null);
          } else if (selectedMessage && !selectedMessage.read) {
            markAsRead(selectedMessage.id);
          }
        }}
      >
        <DialogContent className="sm:max-w-[550px]">
          {selectedMessage && (
            <>
              <DialogHeader>
                <DialogTitle>{t('message.title')}</DialogTitle>
                <DialogDescription>
                  {format(
                    new Date(selectedMessage.created_at),
                    'PPpp',
                    { locale: getDateLocale(locale) }
                  )}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div>
                  <h4 className="text-sm font-medium">{t('message.from')}</h4>
                  <p>{selectedMessage.name} ({selectedMessage.email})</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium">{t('message.content')}</h4>
                  <div className="mt-2 p-4 bg-muted rounded-md whitespace-pre-wrap">
                    {selectedMessage.message}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 