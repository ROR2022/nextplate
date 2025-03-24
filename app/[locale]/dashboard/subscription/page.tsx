import { getTranslations } from "next-intl/server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SubscriptionDetails from "@/components/subscription/subscription-details";
import SubscriptionActions from "@/components/subscription/subscription-actions";
import ManualSync from "@/components/subscription/manual-sync";

type PageProps = {
  params: Promise<{ locale: string }>;
};  

export default async function SubscriptionPage({
  params,
}: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "subscription" });
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return redirect("/");
  }
  
  // Preparar las traducciones para los componentes
  const detailsTranslations = {
    title: t('details.title'),
    description: t('details.description'),
    status: t('details.status'),
    currentPlan: t('details.currentPlan'),
    price: t('details.price'),
    renewalDate: t('details.renewalDate'),
    cancelAt: t('details.cancelAt'),
    noSubscription: t('details.noSubscription'),
    statusLabels: {
      active: t('status.active'),
      trialing: t('status.trialing'),
      canceled: t('status.canceled'),
      past_due: t('status.pastDue'),
      incomplete: t('status.incomplete'),
      incomplete_expired: t('status.incompleteExpired'),
      unpaid: t('status.unpaid'),
    },
  };
  
  const actionsTranslations = {
    manageBilling: t('actions.manageBilling'),
    cancelSubscription: t('actions.cancelSubscription'),
    subscribe: t('actions.subscribe'),
    confirmCancel: t('actions.confirmCancel'),
    cancelQuestion: t('actions.cancelQuestion'),
    cancelConfirm: t('actions.cancelConfirm'),
    cancelCancel: t('actions.cancelCancel'),
    loading: t('actions.loading'),
  };
  
  // Traducciones para la sincronización manual
  const syncTranslations = {
    syncNeeded: t('sync.needed'),
    syncButton: t('sync.button'),
    syncSuccess: t('sync.success'),
    syncError: t('sync.error'),
  };
  
  // URL de retorno para el portal de facturación
  const returnUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/dashboard/subscription`;
  
  // Verificar si hay una suscripción activa
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .single();
  
  const hasSubscription = !!subscription;
  
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <p className="text-gray-500 mt-2">{t('description')}</p>
      </div>
      
      {/* Componente de sincronización manual */}
      <ManualSync 
        hasSubscription={hasSubscription}
        locale={locale}
        translations={syncTranslations}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <SubscriptionDetails 
            locale={locale}
            translations={detailsTranslations} 
          />
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>{t('actions.title')}</CardTitle>
              <CardDescription>{t('actions.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <SubscriptionActions 
                subscription={null} // Se cargará en el cliente
                returnUrl={returnUrl}
                translations={actionsTranslations}
                locale={locale}
              />
            </CardContent>
          </Card>
          
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('help.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  {t('help.description')}
                </p>
                <a 
                  href={`/${locale}/docs/api/payments`}
                  className="text-sm text-blue-600 hover:text-blue-800 mt-2 inline-block"
                >
                  {t('help.learnMore')}
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
