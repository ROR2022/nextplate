import { NextRequest, NextResponse } from 'next/server';
import { getServerStripe } from '@/lib/stripe';
import Stripe from 'stripe';
import { createClient } from '@/utils/supabase/server';
import { syncSubscription } from '@/utils/stripe-sync';
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Ruta API para manejar webhooks de Stripe
 * POST /api/stripe/webhook
 */
export async function POST(request: NextRequest) {
  // console.log('[WEBHOOK] Received Stripe webhook request');
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    // console.error('[WEBHOOK] Missing Stripe signature');
    return NextResponse.json(
      { error: 'Falta la firma de Stripe' },
      { status: 400 }
    );
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    // console.error('[WEBHOOK] Missing Stripe webhook secret environment variable');
    return NextResponse.json(
      { error: 'Falta la configuración del webhook de Stripe' },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    // Obtener cliente Stripe
    // console.log('[WEBHOOK] Getting Stripe client');
    const stripe = await getServerStripe();
    
    // Verificar la firma del webhook
    // console.log('[WEBHOOK] Verifying webhook signature');
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    // console.log(`[WEBHOOK] Event verified: ${event.id}, type: ${event.type}`);
  } catch {
    // console.error('[WEBHOOK] Error verifying webhook signature');
    return NextResponse.json(
      { error: 'Error al verificar la firma del webhook' },
      { status: 400 }
    );
  }

  // Crear cliente de Supabase para los manejadores
  // console.log('[WEBHOOK] Creating Supabase client');
  const supabase = await createClient();
  
  // Manejar diferentes tipos de eventos
  try {
    // console.log(`[WEBHOOK] Processing event type: ${event.type}`);
    switch (event.type) {
      case 'checkout.session.completed':
        // console.log('[WEBHOOK] Handling checkout.session.completed');
        await handleCheckoutSessionCompleted(event, supabase);
        break;
      case 'customer.subscription.created':
        // console.log('[WEBHOOK] Handling customer.subscription.created');
        await handleSubscriptionEvent(event, supabase);
        break;
      case 'customer.subscription.updated':
        // console.log('[WEBHOOK] Handling customer.subscription.updated');
        await handleSubscriptionEvent(event, supabase);
        break;
      case 'customer.subscription.deleted':
        // console.log('[WEBHOOK] Handling customer.subscription.deleted');
        await handleSubscriptionEvent(event, supabase);
        break;
      case 'invoice.payment_succeeded':
        // console.log('[WEBHOOK] Handling invoice.payment_succeeded');
        await handleInvoicePaymentSucceeded(event, supabase);
        break;
      case 'invoice.payment_failed':
        // console.log('[WEBHOOK] Handling invoice.payment_failed');
        await handleInvoicePaymentFailed(event, supabase);
        break;
      default:
        // console.log(`[WEBHOOK] Unhandled event type: ${event.type}`);
    }
    
    // console.log('[WEBHOOK] Event processed successfully');
    return NextResponse.json({ received: true });
  } catch (error) {
    // Convertir el error a string si es posible
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    // console.error('[WEBHOOK] Error processing event:', errorMessage);
    return NextResponse.json(
      { error: 'Error al procesar el evento del webhook', details: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * Manejar el evento de sesión de checkout completada
 * Este evento se dispara cuando un cliente completa el proceso de checkout
 */
async function handleCheckoutSessionCompleted(event: Stripe.Event, supabase: SupabaseClient) {
  // console.log('[WEBHOOK:CHECKOUT] Starting checkout.session.completed handler');
  const session = event.data.object as Stripe.Checkout.Session;
  // console.log('[WEBHOOK:CHECKOUT] Session data:', JSON.stringify({
  //   id: session.id,
  //   customer: session.customer,
  //   client_reference_id: session.client_reference_id,
  //   subscription: session.subscription,
  //   metadata: session.metadata,
  //   mode: session.mode
  // }));
  
  // Verificar que sea una suscripción
  if (session.mode !== 'subscription') {
    // console.log('[WEBHOOK:CHECKOUT] Not a subscription mode, skipping');
    return;
  }

  // Obtener el ID de la suscripción
  if (!session.subscription) {
    // console.error('[WEBHOOK:CHECKOUT] No subscription ID found in session');
    throw new Error('No se encontró el ID de suscripción en la sesión');
  }

  const subscriptionId = typeof session.subscription === 'string' 
    ? session.subscription 
    : session.subscription.id;
  
  // console.log(`[WEBHOOK:CHECKOUT] Syncing subscription: ${subscriptionId}`);
  
  // Usar la nueva función de sincronización
  const result = await syncSubscription(supabase, subscriptionId);
  
  if (!result.success) {
    // console.error('[WEBHOOK:CHECKOUT] Sync failed:', result.error);
    throw new Error(result.error);
  }
  
  // console.log('[WEBHOOK:CHECKOUT] Subscription synced successfully:', result.subscription);
  return result.subscription;
}

/**
 * Manejar eventos de suscripción (creada, actualizada, eliminada)
 */
async function handleSubscriptionEvent(event: Stripe.Event, supabase: SupabaseClient) {
  // console.log('[WEBHOOK:SUBSCRIPTION] Starting subscription event handler');
  const subscription = event.data.object as Stripe.Subscription;
  // console.log('[WEBHOOK:SUBSCRIPTION] Subscription data:', JSON.stringify({
  //   id: subscription.id,
  //   customer: subscription.customer,
  //   status: subscription.status,
  //   metadata: subscription.metadata,
  //   items: subscription.items.data.map(item => ({
  //     id: item.id,
  //     price: item.price.id
  //   }))
  // }));
  
  // console.log(`[WEBHOOK:SUBSCRIPTION] Syncing subscription: ${subscription.id}`);
  // Usar la nueva función de sincronización
  const result = await syncSubscription(supabase, subscription.id);
  
  if (!result.success) {
    // console.error('[WEBHOOK:SUBSCRIPTION] Sync failed:', result.error);
    throw new Error(result.error);
  }
  
  // Si es un evento de cancelación, podemos hacer procesamiento adicional
  if (event.type === 'customer.subscription.deleted') {
    // console.log(`[WEBHOOK:SUBSCRIPTION] Subscription ${subscription.id} canceled`);
  }
  
  // console.log('[WEBHOOK:SUBSCRIPTION] Subscription synced successfully:', result.subscription);
  return result.subscription;
}

/**
 * Manejar el evento de pago de factura exitoso
 */
async function handleInvoicePaymentSucceeded(event: Stripe.Event, supabase: SupabaseClient) {
  // console.log('[WEBHOOK:INVOICE] Starting invoice.payment_succeeded handler');
  const invoice = event.data.object as Stripe.Invoice;
  // console.log('[WEBHOOK:INVOICE] Invoice data:', JSON.stringify({
  //   id: invoice.id,
  //   customer: invoice.customer,
  //   subscription: invoice.subscription,
  //   status: invoice.status,
  //   total: invoice.total
  // }));
  
  // Verificar que tenga una suscripción asociada
  if (!invoice.subscription) {
    // console.log('[WEBHOOK:INVOICE] No subscription associated with invoice, skipping');
    return;
  }
  
  // Obtener el ID de la suscripción
  const subscriptionId = typeof invoice.subscription === 'string'
    ? invoice.subscription
    : invoice.subscription.id;
  
  // console.log(`[WEBHOOK:INVOICE] Syncing subscription: ${subscriptionId}`);
  // Sincronizar la suscripción para actualizar fechas, estado, etc.
  const result = await syncSubscription(supabase, subscriptionId);
  
  if (!result.success) {
    // console.error('[WEBHOOK:INVOICE] Sync failed:', result.error);
    throw new Error(result.error);
  }
  
  // console.log('[WEBHOOK:INVOICE] Subscription synced successfully:', result.subscription);
  return result.subscription;
}

/**
 * Manejar el evento de pago de factura fallido
 */
async function handleInvoicePaymentFailed(event: Stripe.Event, supabase: SupabaseClient) {
  // console.log('[WEBHOOK:INVOICE_FAILED] Starting invoice.payment_failed handler');
  const invoice = event.data.object as Stripe.Invoice;
  // console.log('[WEBHOOK:INVOICE_FAILED] Invoice data:', JSON.stringify({
  //   id: invoice.id,
  //   customer: invoice.customer,
  //   subscription: invoice.subscription,
  //   status: invoice.status,
  //   attempt_count: invoice.attempt_count
  // }));
  
  // Verificar que tenga una suscripción asociada
  if (!invoice.subscription) {
    // console.log('[WEBHOOK:INVOICE_FAILED] No subscription associated with invoice, skipping');
    return;
  }
  
  // Obtener el ID de la suscripción
  const subscriptionId = typeof invoice.subscription === 'string'
    ? invoice.subscription
    : invoice.subscription.id;
  
  // console.log(`[WEBHOOK:INVOICE_FAILED] Syncing subscription: ${subscriptionId}`);
  // Sincronizar la suscripción para actualizar su estado
  const result = await syncSubscription(supabase, subscriptionId);
  
  if (!result.success) {
    // console.error('[WEBHOOK:INVOICE_FAILED] Sync failed:', result.error);
    throw new Error(result.error);
  }
  
  // console.log('[WEBHOOK:INVOICE_FAILED] Subscription synced successfully:', result.subscription);
  return result.subscription;
}
