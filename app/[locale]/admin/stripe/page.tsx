'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2Icon, CheckCircleIcon, XCircleIcon, RefreshCwIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { createClient } from '@/utils/supabase/client';
import { redirect } from 'next/navigation';
import AdminNav from '@/components/admin/admin-nav';


export default  function AdminStripePage() {
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('admin.stripe');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    message?: string;
    error?: string;
    timestamp?: string;
  } | null>(null);
  
  // Verificar si el usuario es administrador
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  
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

  const handleSync = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/admin/stripe/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setResult({
          success: true,
          message: data.message,
          timestamp: data.timestamp,
        });
      } else {
        setResult({
          success: false,
          error: data.error || t('sync.error'),
          message: data.details || 'No se pudo completar la sincronización',
        });
      }
    } catch (error: unknown) {
      setResult({
        success: false,
        error: 'Error de conexión',
        message: error instanceof Error ? error.message : 'No se pudo conectar con el servidor',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">{t('title')}</h1>
      
      <AdminNav locale={locale} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('sync.title')}</CardTitle>
            <CardDescription>{t('sync.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">{t('sync.info')}</p>
            
            <Button
              onClick={handleSync}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  {t('sync.loading')}
                </>
              ) : (
                <>
                  <RefreshCwIcon className="mr-2 h-4 w-4" />
                  {t('sync.button')}
                </>
              )}
            </Button>
            
            {result && (
              <div className="mt-4">
                <Alert variant={result.success ? "default" : "destructive"}>
                  {result.success ? (
                    <CheckCircleIcon className="h-4 w-4" />
                  ) : (
                    <XCircleIcon className="h-4 w-4" />
                  )}
                  <AlertTitle>
                    {result.success ? t('sync.success') : t('sync.error')}
                  </AlertTitle>
                  <AlertDescription>
                    {result.message}
                    {result.timestamp && (
                      <div className="text-xs mt-2">
                        Fecha: {new Date(result.timestamp).toLocaleString()}
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('status.title')}</CardTitle>
            <CardDescription>{t('status.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">{t('status.info')}</p>
            
            <div className="p-4 border rounded-md bg-gray-50">
              <p className="text-center text-gray-400 italic">
                {t('sync.comingSoon')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 