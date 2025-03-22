"use client";

import { useTranslations } from 'next-intl';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import NextLogo from "./next-logo";
import SupabaseLogo from "./supabase-logo";
import { useLocale } from 'next-intl';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';

/**
 * Componente Hero para la landing page.
 * Muestra el título, subtítulo, descripción y botones de llamada a la acción.
 * Utiliza next-intl para las traducciones.
 */
export default function Hero() {
  // Obtener las traducciones usando next-intl
  const t = useTranslations('landing.hero');
  const commonT = useTranslations('common');
  const locale = useLocale();
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
    <div className="flex flex-col gap-16 items-center">
      {/* Logos */}
      <div className="flex gap-8 justify-center items-center">
        <a
          href="https://nextjs.org"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-all hover:scale-110"
        >
          <div className="h-10 w-auto">
            <NextLogo />
          </div>
        </a>
        <span className="text-2xl font-bold">+</span>
        <a
          href="https://supabase.com"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-all hover:scale-110"
        >
          <div className="h-10 w-auto">
            <SupabaseLogo />
          </div>
        </a>
      </div>

      {/* Texto principal */}
      <div className="flex flex-col gap-4 text-center max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          {t('title')}
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground">
          {t('subtitle')}
        </p>
        <p className="text-muted-foreground">
          {t('description')}
        </p>
      </div>

      {/* Botones de llamada a la acción */}
      <div className="flex flex-wrap gap-4 justify-center">
        {loading ? (
          <Button size="lg" disabled>
            {commonT('loading')}
          </Button>
        ) : user ? (
          <Button asChild size="lg">
            <Link href={`/${locale}/dashboard`}>
              Dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <Button asChild size="lg">
            <Link href={`/${locale}/sign-in`}>
              {t('cta')} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
        
        <Button asChild variant="outline" size="lg">
          <Link href={`/${locale}/docs`}>
            {t('secondaryCta')}
          </Link>
        </Button>
      </div>
    </div>
  );
}
