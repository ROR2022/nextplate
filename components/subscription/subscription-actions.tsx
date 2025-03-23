'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface Subscription {
  id: string;
  status: string;
  cancel_at_period_end: boolean;
  [key: string]: unknown;
}

interface SubscriptionActionsProps {
  subscription: Subscription | null;
  returnUrl: string;
  translations: {
    manageBilling: string;
    cancelSubscription: string;
    subscribe: string;
    confirmCancel: string;
    cancelQuestion: string;
    cancelConfirm: string;
    cancelCancel: string;
    loading: string;
  };
  locale: string;
}

export default function SubscriptionActions({ 
  subscription, 
  returnUrl,
  translations,
  locale
}: SubscriptionActionsProps) {
  const [loading, setLoading] = useState(false);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para abrir el portal de facturación de Stripe
  const handleOpenBillingPortal = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/subscription/billing-portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ returnUrl }),
      });
      
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else if (data.url) {
        // Redirigir al portal de facturación
        window.location.href = data.url;
      }
    } catch (err) {
      setError('Error al abrir el portal de facturación');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Función para cancelar la suscripción
  const handleCancelSubscription = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/subscription/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        // Recargar la página para mostrar el estado actualizado
        window.location.reload();
      }
    } catch (err) {
      setError('Error al cancelar la suscripción');
      console.error(err);
    } finally {
      setLoading(false);
      setCancelConfirmOpen(false);
    }
  };

  // Si no hay suscripción, mostrar botón para suscribirse
  if (!subscription) {
    return (
      <div className="mt-6">
        <Button 
          onClick={() => window.location.href = `/${locale}/pricing`}
          disabled={loading}
          className="w-full"
        >
          {loading ? translations.loading : translations.subscribe}
        </Button>
        
        {error && (
          <div className="mt-4 p-3 text-sm text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}
      </div>
    );
  }

  // Si la suscripción está cancelada o inactiva, mostrar botón para suscribirse
  if (
    subscription.status === 'canceled' || 
    subscription.status === 'incomplete_expired' ||
    subscription.status === 'unpaid'
  ) {
    return (
      <div className="mt-6">
        <Button 
          onClick={() => window.location.href = `/${locale}/pricing`}
          disabled={loading}
          className="w-full"
        >
          {loading ? translations.loading : translations.subscribe}
        </Button>
        
        {error && (
          <div className="mt-4 p-3 text-sm text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      <Button 
        onClick={handleOpenBillingPortal}
        disabled={loading}
        className="w-full"
      >
        {loading ? translations.loading : translations.manageBilling}
      </Button>
      
      {!cancelConfirmOpen ? (
        <Button 
          variant="outline"
          onClick={() => setCancelConfirmOpen(true)}
          disabled={loading}
          className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
        >
          {translations.cancelSubscription}
        </Button>
      ) : (
        <div className="border rounded-md p-4 space-y-4">
          <p className="text-sm font-medium">{translations.cancelQuestion}</p>
          <div className="flex space-x-3">
            <Button 
              variant="destructive"
              onClick={handleCancelSubscription}
              disabled={loading}
              className="flex-1"
            >
              {loading ? translations.loading : translations.cancelConfirm}
            </Button>
            <Button 
              variant="outline"
              onClick={() => setCancelConfirmOpen(false)}
              disabled={loading}
              className="flex-1"
            >
              {translations.cancelCancel}
            </Button>
          </div>
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-3 text-sm text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
}
