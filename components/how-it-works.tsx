"use client";

import { useTranslations } from 'next-intl';

// Tipo para los pasos
type Step = {
  title: string;
  description: string;
};

/**
 * Componente para mostrar cómo funciona NextPlate.
 * Muestra los pasos para comenzar a usar el boilerplate.
 * Utiliza next-intl para las traducciones.
 * Implementa el principio de Responsabilidad Única al encargarse únicamente de mostrar los pasos.
 */
export default function HowItWorks() {
  // Obtener las traducciones usando next-intl
  const t = useTranslations('landing.howItWorks');

  // Obtener los pasos desde las traducciones
  const steps: Step[] = [
    {
      title: t('steps.0.title'),
      description: t('steps.0.description')
    },
    {
      title: t('steps.1.title'),
      description: t('steps.1.description')
    },
    {
      title: t('steps.2.title'),
      description: t('steps.2.description')
    },
    {
      title: t('steps.3.title'),
      description: t('steps.3.description')
    }
  ];

  return (
    <section className="w-full py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold tracking-tight mb-4">{t('title')}</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('description')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {steps.map((step, index) => (
          <div key={index} className="flex gap-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
              <span className="font-bold">{index + 1}</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
