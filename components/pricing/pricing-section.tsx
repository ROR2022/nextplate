'use client';

import { useState, useEffect } from 'react';
import { PricingPlan, pricingPlans } from '@/lib/pricing-plans';
import PricingCard from './pricing-card';

interface PricingSectionProps {
  locale: string;
  translations: {
    title: string;
    description: string;
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
  currentPlanId?: string | null; // Now optional since we'll fetch it ourselves
}

export default function PricingSection({ 
  locale, 
  translations,
  currentPlanId: initialPlanId
}: PricingSectionProps) {
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(initialPlanId || null);
  const [isLoading, setIsLoading] = useState(!initialPlanId);
  
  useEffect(() => {
    // If we already have the plan ID from props, don't fetch it
    if (initialPlanId) {
      return;
    }
    
    async function fetchSubscriptionPlan() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/subscription/user');
        const data = await response.json();
        
        if (data.subscription) {
          // Extract plan ID from subscription data
          let planId = 'free';
          const subscription = data.subscription;
          
          if (subscription.status === 'active' || subscription.status === 'trialing') {
            if (subscription.stripe_price_id.includes('premium')) {
              planId = 'premium';
            } else if (subscription.stripe_price_id.includes('standard')) {
              planId = 'standard';
            }
          }
          
          setCurrentPlanId(planId);
        }
      } catch (error) {
        console.error('Error fetching subscription plan:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchSubscriptionPlan();
  }, [initialPlanId]);

  return (
    <section className="container py-12 md:py-24 mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
          {translations.title}
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {translations.description}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {pricingPlans.map((plan: PricingPlan) => (
          <div key={plan.id} className={`relative ${plan.popular ? 'md:-mt-4 md:mb-4' : ''}`}>
            <PricingCard
              plan={plan}
              locale={locale}
              translations={translations}
              currentPlanId={currentPlanId}
              isLoading={isLoading}
            />
          </div>
        ))}
      </div>
    </section>
  );
} 