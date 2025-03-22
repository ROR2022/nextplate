"use client";

import { useTranslations } from 'next-intl';
import { Button } from "@/components/ui/button";
import { ArrowRight, Github } from "lucide-react";
import Link from "next/link";

// Tipo para el contenido de CTA
/* type CTAContent = {
  title: string;
  description: string;
  buttonText: string;
  secondaryButtonText: string;
};
 */
/**
 * Componente para mostrar la sección de llamada a la acción (CTA) al final de la landing page.
 * Invita a los usuarios a comenzar a usar NextPlate.
 * Utiliza next-intl para las traducciones.
 * Implementa el principio de Responsabilidad Única al encargarse únicamente de mostrar la llamada a la acción.
 */
export default function CTASection() {
  // Obtener las traducciones usando next-intl
  const t = useTranslations('landing.cta');

  return (
    <section className="w-full py-16 bg-primary text-primary-foreground">
      <div className="max-w-4xl mx-auto text-center px-4">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          {t('title')}
        </h2>
        <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-2xl mx-auto">
          {t('description')}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button 
            size="lg" 
            variant="secondary" 
            asChild
            className="font-semibold"
          >
            <Link href={t('buttonUrl')}>
              {t('buttonText')} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            asChild
            className="bg-primary-foreground/10 hover:bg-primary-foreground/20 border-primary-foreground/20"
          >
            <Link href={t('secondaryButtonUrl')} target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" /> {t('secondaryButtonText')}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
