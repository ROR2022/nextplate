"use client";

import { useTranslations } from 'next-intl';
import { 
  Lock, 
  Palette, 
  CreditCard, 
  Brain, 
  Globe, 
  Shield,
  Loader2
} from "lucide-react";

// Tipo para los elementos de características
type FeatureItem = {
  title: string;
  description: string;
  icon: string;
};

/**
 * Componente para mostrar las características principales de NextPlate.
 * Utiliza next-intl para las traducciones.
 * Implementa el principio de Responsabilidad Única al encargarse únicamente de mostrar las características.
 */
export default function Features() {
  // Obtener las traducciones usando next-intl
  const t = useTranslations('landing.features');

  // Mapeo de nombres de iconos a componentes de Lucide
  const iconMap = {
    lock: Lock,
    palette: Palette,
    creditCard: CreditCard,
    brain: Brain,
    globe: Globe,
    shield: Shield
  };

  // Obtener los items de características desde las traducciones
  const featureItems: FeatureItem[] = [
    {
      title: t('items.0.title'),
      description: t('items.0.description'),
      icon: t('items.0.icon')
    },
    {
      title: t('items.1.title'),
      description: t('items.1.description'),
      icon: t('items.1.icon')
    },
    {
      title: t('items.2.title'),
      description: t('items.2.description'),
      icon: t('items.2.icon')
    },
    {
      title: t('items.3.title'),
      description: t('items.3.description'),
      icon: t('items.3.icon')
    },
    {
      title: t('items.4.title'),
      description: t('items.4.description'),
      icon: t('items.4.icon')
    },
    {
      title: t('items.5.title'),
      description: t('items.5.description'),
      icon: t('items.5.icon')
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featureItems.map((feature, index) => {
          // Obtener el componente de icono correspondiente o usar un loader por defecto
          const IconComponent = feature.icon && iconMap[feature.icon as keyof typeof iconMap] || Loader2;
          
          return (
            <div 
              key={index} 
              className="flex flex-col p-6 bg-card hover:bg-accent hover:text-accent-foreground transition-colors rounded-lg border shadow-sm"
            >
              <div className="mb-4">
                <div className="p-2 w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <IconComponent className="h-5 w-5" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
