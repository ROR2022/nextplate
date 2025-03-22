"use client";

import Hero from "@/components/hero";
import Features from "@/components/features";
import HowItWorks from "@/components/how-it-works";
import Testimonials from "@/components/testimonials";
import CTASection from "@/components/cta-section";
//import { useLocale } from 'next-intl';

/**
 * Página principal de NextPlate.
 * Muestra la landing page completa con todos sus componentes.
 * Implementa el principio de Responsabilidad Única al delegar la presentación a componentes especializados.
 * Sigue el principio de Composición sobre Herencia al combinar componentes independientes.
 */
export default function Home() {
  // Asegurarse de que el locale esté disponible en el cliente
  //const locale = useLocale();

  return (
    <>
      <div className="flex-1 flex flex-col">
        {/* Hero Section */}
        <Hero />
        
        {/* Features Section */}
        <Features />
        
        {/* How It Works Section */}
        <HowItWorks />
        
        {/* Testimonials Section */}
        <Testimonials />
        
        {/* CTA Section */}
        <CTASection />
        
        {/* Footer se muestra en el layout principal */}
      </div>
    </>
  );
}
