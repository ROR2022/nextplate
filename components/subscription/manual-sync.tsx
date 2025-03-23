'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ManualSyncProps {
  hasSubscription: boolean;
  locale: string;
  translations: {
    syncNeeded: string;
    syncButton: string;
    syncSuccess: string;
    syncError: string;
  };
}

export default function ManualSync({ 
  hasSubscription, 
  locale,
  translations 
}: ManualSyncProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showSync, setShowSync] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  // Verificar si necesitamos mostrar el botón de sincronización
  useEffect(() => {
    const success = searchParams.get('success');
    const successSessionId = localStorage.getItem('checkout_session_id');
    
    if (success === 'true' && !hasSubscription && successSessionId) {
      setShowSync(true);
      setSessionId(successSessionId);
    } else {
      setShowSync(false);
    }
  }, [searchParams, hasSubscription]);
  
  // Limpiar la sesión de checkout del localStorage al desmontar
  useEffect(() => {
    return () => {
      // Si no se muestra el componente, limpiar localStorage
      if (!showSync) {
        localStorage.removeItem('checkout_session_id');
      }
    };
  }, [showSync]);
  
  // Función para sincronizar manualmente
  const handleManualSync = async () => {
    if (!sessionId) {
      return;
    }
    
    setIsSyncing(true);
    setError(null);
    
    try {
      const response = await fetch('/api/stripe/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          checkoutSessionId: sessionId,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Mostrar mensaje de éxito
        alert(translations.syncSuccess);
        
        // Recarga la página para mostrar la suscripción
        router.refresh();
        window.location.href = `/${locale}/dashboard/subscription`;
      } else {
        setError(data.error || translations.syncError);
      }
    } catch (error) {
      setError(translations.syncError);
      console.error('Error syncing subscription:', error);
    } finally {
      setIsSyncing(false);
      localStorage.removeItem('checkout_session_id');
    }
  };
  
  // No mostrar nada si no es necesario
  if (!showSync) {
    return null;
  }
  
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <p className="text-sm text-yellow-800 mb-3">
        {translations.syncNeeded}
      </p>
      {error && (
        <p className="text-sm text-red-600 mb-3">
          {error}
        </p>
      )}
      <Button
        onClick={handleManualSync}
        disabled={isSyncing}
        variant="outline"
        size="sm"
      >
        {isSyncing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {translations.syncButton}
          </>
        ) : (
          translations.syncButton
        )}
      </Button>
    </div>
  );
} 