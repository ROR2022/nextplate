"use client";

import { useTranslations } from 'next-intl';
import { QuoteIcon } from "lucide-react";

// Tipo para los testimonios
type Testimonial = {
  quote: string;
  author: string;
  role: string;
};

/**
 * Componente para mostrar testimonios de usuarios de NextPlate.
 * Utiliza next-intl para las traducciones.
 * Implementa el principio de Responsabilidad Única al encargarse únicamente de mostrar testimonios.
 */
export default function Testimonials() {
  // Obtener las traducciones usando next-intl
  const t = useTranslations('landing.testimonials');

  // Obtener los testimonios desde las traducciones
  const testimonials: Testimonial[] = [
    {
      quote: t('items.0.quote'),
      author: t('items.0.author'),
      role: t('items.0.role')
    },
    {
      quote: t('items.1.quote'),
      author: t('items.1.author'),
      role: t('items.1.role')
    },
    {
      quote: t('items.2.quote'),
      author: t('items.2.author'),
      role: t('items.2.role')
    }
  ];

  return (
    <section className="w-full py-12 bg-muted/10">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold tracking-tight mb-4">{t('title')}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
        {testimonials.map((testimonial, index) => (
          <div 
            key={index} 
            className="bg-card p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow"
          >
            <QuoteIcon className="h-6 w-6 text-primary/60 mb-4" />
            <blockquote className="text-lg mb-4">
              &quot;{testimonial.quote}&quot;
            </blockquote>
            <footer>
              <div className="font-semibold">{testimonial.author}</div>
              <div className="text-sm text-muted-foreground">{testimonial.role}</div>
            </footer>
          </div>
        ))}
      </div>
    </section>
  );
}
