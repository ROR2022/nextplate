'use client';

import { useState } from 'react';
import { CheckIcon, XIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PricingFeature, PricingPlan, isFreePlan } from '@/lib/pricing-plans';
import { usePathname, useRouter } from 'next/navigation';
import { getStripe } from '@/lib/stripe';

interface PricingCardProps {
  plan: PricingPlan;
  locale: string;
  translations: {
    currency: string;
    perMonth: string;
    currentPlan: string;
    popularPlan: string;
    getStarted: string;
    subscribe: string;
    features: {
      [key: string]: string;
    };
  };
  currentPlanId?: string | null;
  isLoading?: boolean;
}

export default function PricingCard({ 
  plan, 
  locale,
  translations,
  currentPlanId,
  isLoading: isSubscriptionLoading = false
}: PricingCardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  
  // Determinar si este es el plan actual del usuario
  const isCurrentPlan = currentPlanId && currentPlanId === plan.id;
  
  // Obtener el precio mensual
  const price = plan.price.monthly;
  const stripePriceId = plan.stripePriceId.monthly;
  
  // Formatear el precio con Intl.NumberFormat
  const formattedPrice = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: plan.price.currency,
    minimumFractionDigits: price % 1 === 0 ? 0 : 2,
    maximumFractionDigits: price % 1 === 0 ? 0 : 2,
  }).format(price);
  
  // Gestionar la suscripción
  const handleSubscription = async () => {
    // Si es un plan gratuito, redirigir al dashboard
    if (isFreePlan(plan.id)) {
      router.push(`/${locale}/dashboard`);
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Crear sesión de checkout con Stripe
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: stripePriceId,
          successUrl: `${window.location.origin}/${locale}/dashboard/subscription?success=true`,
          cancelUrl: `${window.location.origin}${pathname}?canceled=true`,
        }),
      });
      
      const data = await response.json();
      
      if (data.error) {
        console.error('Error creating checkout session:', data.error);
        setIsLoading(false);
        return;
      }
      
      // Guardar el ID de la sesión en localStorage para la sincronización manual
      localStorage.setItem('checkout_session_id', data.sessionId);
      
      // Redirigir a Stripe Checkout
      const stripeInstance = await getStripe();
      
      if (stripeInstance) {
        await stripeInstance.redirectToCheckout({
          sessionId: data.sessionId,
        });
      }
    } catch (error) {
      console.error('Error subscribing to plan:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className={`flex flex-col ${plan.popular ? 'border-primary shadow-md' : ''}`}>
      {plan.popular && (
        <div className="absolute -top-3 right-4">
          <Badge variant="default" className="px-3 py-1">
            {translations.popularPlan}
          </Badge>
        </div>
      )}
      
      <CardHeader className="pb-8">
        <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
        <CardDescription className="text-muted-foreground mt-2">{plan.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <div className="mb-6">
          <div className="flex items-baseline">
            <span className="text-3xl font-bold">{formattedPrice}</span>
            <span className="ml-1 text-muted-foreground">
              {translations.perMonth}
            </span>
          </div>
        </div>
        
        <ul className="space-y-3">
          {plan.features.map((feature: PricingFeature) => (
            <li key={feature.id} className="flex items-start">
              {feature.included ? (
                <CheckIcon className="h-5 w-5 text-green-500 shrink-0 mr-2" />
              ) : (
                <XIcon className="h-5 w-5 text-gray-400 shrink-0 mr-2" />
              )}
              <span className={`text-sm ${feature.highlight ? 'font-semibold' : ''}`}>
                {translations.features[feature.id] || feature.id}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
      
      <CardFooter className="pt-4">
        {isSubscriptionLoading ? (
          <Button disabled variant="outline" className="w-full">
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading...
            </span>
          </Button>
        ) : isCurrentPlan ? (
          <Button disabled variant="outline" className="w-full">
            {translations.currentPlan}
          </Button>
        ) : (
          <Button
            onClick={handleSubscription}
            disabled={isLoading}
            className="w-full"
            variant={plan.popular ? "default" : "outline"}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {translations.subscribe}
              </span>
            ) : (
              isFreePlan(plan.id) ? translations.getStarted : translations.subscribe
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
} 