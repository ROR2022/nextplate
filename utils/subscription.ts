/**
 * Utilidades para manejar suscripciones en Supabase
 * Proporciona funciones para crear, actualizar y eliminar suscripciones
 */

import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Interfaz para los datos de suscripción
 */
export interface SubscriptionData {
  user_id: string;
  stripe_customer_id?: string;
  stripe_subscription_id: string;
  stripe_price_id: string;
  status: string;
  current_period_start: Date;
  current_period_end: Date;
  cancel_at_period_end: boolean;
  canceled_at?: Date | null;
}

/**
 * Crear o actualizar una suscripción en Supabase
 * @param supabase - Cliente de Supabase
 * @param subscriptionData - Datos de la suscripción
 */
export async function upsertSubscription(
  supabase: SupabaseClient,
  subscriptionData: SubscriptionData
) {
  try {
    // Buscar si ya existe una suscripción con el mismo ID
    const { data: existingSubscription } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('stripe_subscription_id', subscriptionData.stripe_subscription_id)
      .single();

    if (existingSubscription) {
      // Actualizar la suscripción existente
      const { error } = await supabase
        .from('subscriptions')
        .update({
          stripe_price_id: subscriptionData.stripe_price_id,
          status: subscriptionData.status,
          current_period_start: subscriptionData.current_period_start,
          current_period_end: subscriptionData.current_period_end,
          cancel_at_period_end: subscriptionData.cancel_at_period_end,
          canceled_at: subscriptionData.canceled_at,
          updated_at: new Date(),
        })
        .eq('stripe_subscription_id', subscriptionData.stripe_subscription_id);

      if (error) {
        throw error;
      }
      return { id: existingSubscription.id, isNew: false };
    } else {
      // Crear una nueva suscripción
      const { data, error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: subscriptionData.user_id,
          stripe_customer_id: subscriptionData.stripe_customer_id,
          stripe_subscription_id: subscriptionData.stripe_subscription_id,
          stripe_price_id: subscriptionData.stripe_price_id,
          status: subscriptionData.status,
          current_period_start: subscriptionData.current_period_start,
          current_period_end: subscriptionData.current_period_end,
          cancel_at_period_end: subscriptionData.cancel_at_period_end,
          canceled_at: subscriptionData.canceled_at,
        })
        .select('id')
        .single();

      if (error) {
        throw error;
      }
      return { id: data?.id, isNew: true };
    }
  } catch (error) {
    console.error('Error al guardar la suscripción en Supabase:', error);
    throw new Error('No se pudo guardar la suscripción en la base de datos');
  }
}

/**
 * Actualizar el estado de una suscripción en Supabase
 * @param supabase - Cliente de Supabase
 * @param subscriptionId - ID de la suscripción en Stripe
 * @param status - Nuevo estado de la suscripción
 */
export async function updateSubscriptionStatus(
  supabase: SupabaseClient,
  subscriptionId: string,
  status: string
) {
  try {
    const { error } = await supabase
      .from('subscriptions')
      .update({
        status,
        updated_at: new Date(),
      })
      .eq('stripe_subscription_id', subscriptionId);

    if (error) {
      throw error;
    }
    return true;
  } catch (error) {
    console.error('Error al actualizar el estado de la suscripción:', error);
    throw new Error('No se pudo actualizar el estado de la suscripción');
  }
}

/**
 * Obtener el ID de usuario asociado a una suscripción
 * @param supabase - Cliente de Supabase
 * @param subscriptionId - ID de la suscripción en Stripe
 */
export async function getUserIdFromSubscription(
  supabase: SupabaseClient,
  subscriptionId: string
) {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('user_id')
      .eq('stripe_subscription_id', subscriptionId)
      .single();

    if (error) {
      throw error;
    }
    return data?.user_id;
  } catch (error) {
    console.error('Error al obtener el usuario de la suscripción:', error);
    throw new Error('No se pudo obtener el usuario asociado a la suscripción');
  }
}

/**
 * Obtener el ID de usuario asociado a un cliente de Stripe
 * @param supabase - Cliente de Supabase
 * @param customerId - ID del cliente en Stripe
 */
export async function getUserIdFromCustomer(
  supabase: SupabaseClient,
  customerId: string
) {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('user_id')
      .eq('stripe_customer_id', customerId)
      .single();

    if (error) {
      throw error;
    }
    return data?.user_id;
  } catch (error) {
    console.error('Error al obtener el usuario del cliente:', error);
    throw new Error('No se pudo obtener el usuario asociado al cliente');
  }
}

/**
 * Actualizar o crear un registro de cliente de Stripe para un usuario
 * @param supabase - Cliente de Supabase
 * @param userId - ID del usuario en Supabase
 * @param customerId - ID del cliente en Stripe
 */
export async function updateUserStripeCustomer(
  supabase: SupabaseClient,
  userId: string,
  customerId: string
) {
  try {
    // Buscar si ya existe una suscripción para este usuario
    const { data: existingSubscriptions } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('user_id', userId);

    if (existingSubscriptions && existingSubscriptions.length > 0) {
      // Actualizar todas las suscripciones del usuario con el nuevo customerId
      const { error } = await supabase
        .from('subscriptions')
        .update({
          stripe_customer_id: customerId,
          updated_at: new Date(),
        })
        .eq('user_id', userId);

      if (error) {
        throw error;
      }
    }

    return true;
  } catch (error) {
    console.error('Error al actualizar el cliente de Stripe del usuario:', error);
    throw new Error('No se pudo actualizar el cliente de Stripe del usuario');
  }
}
