'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SubscriptionDetailsProps {
  locale: string;
  translations: {
    title: string;
    description: string;
    status: string;
    currentPlan: string;
    price: string;
    renewalDate: string;
    cancelAt: string;
    noSubscription: string;
    statusLabels: {
      active: string;
      trialing: string;
      canceled: string;
      past_due: string;
      incomplete: string;
      incomplete_expired: string;
      unpaid: string;
    };
  };
}

interface Subscription {
  id: string;
  status: string;
  stripe_price_id: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  stripe_details?: {
    status: string;
    current_period_end: string;
    cancel_at_period_end: boolean;
    product: {
      id: string;
      name: string;
      description: string;
    };
    price: {
      id: string;
      unit_amount: number;
      currency: string;
      interval: string;
      interval_count: number;
    };
  };
}

export default function SubscriptionDetails({ locale, translations }: SubscriptionDetailsProps) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await fetch('/api/subscription/user');
        
        // Si la respuesta no es exitosa, manejar el error
        if (!response.ok) {
          setError('Error al cargar la información de suscripción. Servicio temporalmente no disponible.');
          setLoading(false);
          return;
        }
        
        const data = await response.json();
        
        if (data.error) {
          setError(data.error);
        } else {
          setSubscription(data.subscription);
        }
      } catch (err) {
        console.error('Error fetching subscription:', err);
        setError('Error al cargar la información de suscripción. Servicio temporalmente no disponible.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  // Función para formatear el precio
  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  // Función para formatear la fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  // Función para obtener el color del badge según el estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'trialing':
        return 'bg-green-100 text-green-800';
      case 'canceled':
        return 'bg-gray-100 text-gray-800';
      case 'past_due':
      case 'incomplete':
      case 'unpaid':
        return 'bg-yellow-100 text-yellow-800';
      case 'incomplete_expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Función para obtener la etiqueta del estado
  const getStatusLabel = (status: string) => {
    return translations.statusLabels[status as keyof typeof translations.statusLabels] || status;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{translations.title}</CardTitle>
          <CardDescription>{translations.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{translations.title}</CardTitle>
          <CardDescription>{translations.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{translations.title}</CardTitle>
          <CardDescription>{translations.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-gray-700 bg-gray-100 rounded-md">
            {translations.noSubscription}
          </div>
        </CardContent>
      </Card>
    );
  }

  const details = subscription.stripe_details;
  const status = details?.status || subscription.status;
  const productName = details?.product?.name || subscription.stripe_price_id;
  const renewalDate = details?.current_period_end 
    ? formatDate(details.current_period_end) 
    : formatDate(subscription.current_period_end);
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{translations.title}</CardTitle>
            <CardDescription>{translations.description}</CardDescription>
          </div>
          <Badge className={getStatusColor(status)}>
            {getStatusLabel(status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">{translations.currentPlan}</h3>
            <p className="mt-1 text-lg font-semibold">{productName}</p>
          </div>
          
          {details?.price && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">{translations.price}</h3>
              <p className="mt-1 text-lg font-semibold">
                {formatPrice(details.price.unit_amount, details.price.currency)}
                {details.price.interval && (
                  <span className="text-sm text-gray-500 ml-1">
                    /{details.price.interval}
                    {details.price.interval_count > 1 ? ` (${details.price.interval_count} ${details.price.interval}s)` : ''}
                  </span>
                )}
              </p>
            </div>
          )}
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">
              {(details?.cancel_at_period_end || subscription.cancel_at_period_end) 
                ? translations.cancelAt 
                : translations.renewalDate}
            </h3>
            <p className="mt-1 text-lg font-semibold">{renewalDate}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
