'use client';

import Link from "next/link";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useTranslations } from "next-intl";

type UserStatus = {
  isLoggedIn: boolean;
  email?: string;
  hasEnvVars: boolean;
};

export default function ClientAuthButtons({ 
  userStatus, 
  locale,
  onSignOut 
}: { 
  userStatus: UserStatus; 
  locale: string;
  onSignOut?: () => void;
}) {
  const t = useTranslations('auth');

  if (!userStatus.hasEnvVars) {
    return (
      <div className="flex gap-4 items-center">
        <div>
          <Badge
            variant={"default"}
            className="font-normal pointer-events-none"
          >
            {t('envVarWarning')}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button
            asChild
            size="sm"
            variant={"outline"}
            disabled
            className="opacity-75 cursor-none pointer-events-none"
          >
            <Link href={`/${locale}/sign-in`}>{t('signIn.title')}</Link>
          </Button>
          <Button
            asChild
            size="sm"
            variant={"default"}
            disabled
            className="opacity-75 cursor-none pointer-events-none"
          >
            <Link href={`/${locale}/sign-up`}>{t('signUp.title')}</Link>
          </Button>
        </div>
      </div>
    );
  }

  return userStatus.isLoggedIn ? (
    <div className="flex items-center gap-4">
      <span className="hidden md:flex">{t('greeting', { email: userStatus.email || '' })}</span>
      <span className="md:hidden">{t('shortGreeting')}</span>
      <form action={onSignOut}>
        <Button type="submit" variant={"outline"}>
          {t('signOut')}
        </Button>
      </form>
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href={`/${locale}/sign-in`}>{t('signIn.title')}</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href={`/${locale}/sign-up`}>{t('signUp.title')}</Link>
      </Button>
    </div>
  );
} 