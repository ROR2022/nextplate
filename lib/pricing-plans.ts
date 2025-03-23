/**
 * Definición de los planes de precios para las suscripciones
 * Este archivo contiene la configuración de los planes disponibles.
 */

export interface PricingFeature {
  id: string;
  included: boolean;
  highlight?: boolean;
}

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    currency: string;
  };
  stripePriceId: {
    monthly: string;
  };
  features: PricingFeature[];
  highlights?: boolean;
  popular?: boolean;
}

// Plan gratuito
const FREE_PLAN_ID = 'free';
// Plan básico
const BASIC_PLAN_ID = 'basic';
// Plan pro
const PRO_PLAN_ID = 'pro';

// IDs de precios de Stripe - obtenidos de variables de entorno
// Para desarrollo local, configura estas variables en .env.local
// Para producción, configúralas en tu plataforma de hosting
const FREE_PRICE_ID = ''; // Dejar vacío ya que es gratis
const BASIC_MONTHLY_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID || '';
const PRO_MONTHLY_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || '';

// Verificar que las variables de entorno estén configuradas en producción
if (process.env.NODE_ENV === 'production') {
  if (!BASIC_MONTHLY_PRICE_ID) {
    console.warn('ADVERTENCIA: NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID no está configurado en variables de entorno');
  }
  if (!PRO_MONTHLY_PRICE_ID) {
    console.warn('ADVERTENCIA: NEXT_PUBLIC_STRIPE_PRO_PRICE_ID no está configurado en variables de entorno');
  }
}

/**
 * Planes de precios disponibles
 * Estos planes se utilizan en la página de precios y en el proceso de suscripción.
 */
export const pricingPlans: PricingPlan[] = [
  {
    id: FREE_PLAN_ID,
    name: 'Free',
    description: 'Basic features for personal projects',
    price: {
      monthly: 0,
      currency: 'USD',
    },
    stripePriceId: {
      monthly: FREE_PRICE_ID,
    },
    features: [
      { id: 'feature-1', included: true },
      { id: 'feature-2', included: true },
      { id: 'feature-3', included: false },
      { id: 'feature-4', included: false },
      { id: 'feature-5', included: false },
      { id: 'feature-6', included: false },
    ],
  },
  {
    id: BASIC_PLAN_ID,
    name: 'Basic',
    description: 'Advanced features for small businesses',
    price: {
      monthly: 5,
      currency: 'USD',
    },
    stripePriceId: {
      monthly: BASIC_MONTHLY_PRICE_ID,
    },
    features: [
      { id: 'feature-1', included: true },
      { id: 'feature-2', included: true },
      { id: 'feature-3', included: true },
      { id: 'feature-4', included: true },
      { id: 'feature-5', included: false },
      { id: 'feature-6', included: false },
    ],
    popular: true,
  },
  {
    id: PRO_PLAN_ID,
    name: 'Pro',
    description: 'All features for professional use',
    price: {
      monthly: 10,
      currency: 'USD',
    },
    stripePriceId: {
      monthly: PRO_MONTHLY_PRICE_ID,
    },
    features: [
      { id: 'feature-1', included: true },
      { id: 'feature-2', included: true },
      { id: 'feature-3', included: true },
      { id: 'feature-4', included: true },
      { id: 'feature-5', included: true, highlight: true },
      { id: 'feature-6', included: true, highlight: true },
    ],
  },
];

/**
 * Obtener un plan por su ID
 * @param planId - ID del plan
 * @returns El plan de precios o undefined si no existe
 */
export function getPlanById(planId: string): PricingPlan | undefined {
  return pricingPlans.find((plan) => plan.id === planId);
}

/**
 * Verifica si un plan es gratuito
 * @param planId - ID del plan
 * @returns true si el plan es gratuito
 */
export function isFreePlan(planId: string): boolean {
  return planId === FREE_PLAN_ID;
}

/**
 * Obtiene el plan gratuito
 * @returns El plan gratuito
 */
export function getFreePlan(): PricingPlan {
  return pricingPlans[0];
} 