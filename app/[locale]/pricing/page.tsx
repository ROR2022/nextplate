import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import PricingSection from '@/components/pricing/pricing-section';

// We're using dynamic rendering to handle cookies properly
export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ locale: string }>
};

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pricing' });
  
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

export default async function PricingPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pricing' });
  
  return (
    <main className="min-h-screen">
      <Suspense fallback={<div className="py-24 text-center">Loading...</div>}>
        <PricingSection
          locale={locale}
          translations={{
            title: t('title'),
            description: t('description'),
            currency: t('currency'),
            perMonth: t('perMonth'),
            currentPlan: t('currentPlan'),
            popularPlan: t('popularPlan'),
            getStarted: t('getStarted'),
            subscribe: t('subscribe'),
            features: {
              'feature-1': t('features.feature1'),
              'feature-2': t('features.feature2'),
              'feature-3': t('features.feature3'),
              'feature-4': t('features.feature4'),
              'feature-5': t('features.feature5'),
              'feature-6': t('features.feature6'),
            },
          }}
          // We'll fetch the current plan on the client side
          // currentPlanId={currentPlanId}
        />
      </Suspense>
    </main>
  );
} 