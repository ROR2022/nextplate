'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import SettingsMenu from "@/components/settings-menu";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Menu, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { useTranslations } from 'next-intl';
import ClientAuthButtons from "@/components/client-auth-buttons";
import { createClient } from "@/utils/supabase/client";
import { signOutAction } from "@/app/actions";

interface MainNavbarProps {
  locale: string;
}

export default function MainNavbar({ locale }: MainNavbarProps) {
  const t = useTranslations('common');
  const [userStatus, setUserStatus] = useState({
    isLoggedIn: false,
    email: '',
    hasEnvVars: !!hasEnvVars
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserStatus = async () => {
      try {
        setIsLoading(true);
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        setUserStatus({
          isLoggedIn: !!user,
          email: user?.email || '',
          hasEnvVars: !!hasEnvVars
        });
      } catch (error) {
        console.error("Error fetching user status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserStatus();
  }, []);

  return (
    <nav id="mainNavbar" className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
        {/* Logo - visible en todas las pantallas */}
        <div className="flex gap-5 items-center font-semibold">
          <Link href={`/${locale}`}>NextPlate</Link>
        </div>

        {/* Menú para desktop - oculto en móvil */}
        <div className="hidden md:flex items-center gap-4">
          {/* Menú de navegación de tres puntos verticales */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
                <span className="sr-only">{t('navigation')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t('navigation')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/${locale}`}>{t('home')}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/${locale}/docs`}>{t('documentation')}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/${locale}/pricing`}>{t('pricing')}</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <SettingsMenu />
          {isLoading ? (
            <div className="flex items-center">
              <span className="text-muted-foreground">{t('loading')}</span>
            </div>
          ) : (
            <ClientAuthButtons 
              userStatus={userStatus} 
              locale={locale} 
              onSignOut={signOutAction}
            />
          )}
        </div>

        {/* Menú hamburguesa para móviles */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">{t('openMenu')}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80vw] sm:w-[350px]">
              <SheetHeader>
                <SheetTitle>{t('menu')}</SheetTitle>
                <SheetDescription>
                  {t('navigation')}
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-6 py-4">
                <div className="flex flex-col gap-2">
                  <SheetClose asChild>
                    <Link 
                      href={`/${locale}`} 
                      className="flex py-2 text-sm hover:underline"
                    >
                      {t('home')}
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link 
                      href={`/${locale}/docs`} 
                      className="flex py-2 text-sm hover:underline"
                    >
                      {t('documentation')}
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link 
                      href={`/${locale}/pricing`}
                      className="flex py-2 text-sm hover:underline"
                    >
                      {t('pricing')}
                    </Link>
                  </SheetClose>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium">{t('settings')}</h3>
                    </div>
                    <div className="ml-1">
                      <SettingsMenu />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium">{t('account')}</h3>
                    </div>
                    <div className="ml-1">
                      {isLoading ? (
                        <div className="flex items-center">
                          <span className="text-muted-foreground">{t('loading')}</span>
                        </div>
                      ) : (
                        <ClientAuthButtons 
                          userStatus={userStatus} 
                          locale={locale} 
                          onSignOut={signOutAction}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
} 