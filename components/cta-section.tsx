"use client";

import { useTranslations } from 'next-intl';
import { Button } from "@/components/ui/button";
import { ArrowRight, Github } from "lucide-react";
import Link from "next/link";

//necesitamos importar los datos de la session de supabase
import { createClient } from '@/utils/supabase/client';
import { useEffect } from 'react';
import { useState } from 'react';
import { User } from '@supabase/supabase-js';

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
  //usando createClient para obtener los datos de la session de supabase
  const commonT = useTranslations('common');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);
  
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
            disabled={loading}
          >
            {/** Aqui necesitamos un check para ver si el usuario esta logueado, y asignarle el href al boton de dashboard o el de signup */}
            <Link href={user ? t('buttonLoggedInUrl') : t('buttonUrl')}>
              {loading ? commonT('loading') : (
                <>{t('buttonText')} <ArrowRight className="ml-2 h-4 w-4" /></>
              )}
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
