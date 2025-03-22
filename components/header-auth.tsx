import { signOutAction } from "@/app/actions";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";
import { getTranslations } from 'next-intl/server';
import { getLocale } from 'next-intl/server';

export default async function AuthButton() {
  const supabase = await createClient();
  const t = await getTranslations('auth');
  const locale = await getLocale();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!hasEnvVars) {
    return (
      <>
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
              <Link href={`/${locale}/sign-in`}>{t('signIn')}</Link>
            </Button>
            <Button
              asChild
              size="sm"
              variant={"default"}
              disabled
              className="opacity-75 cursor-none pointer-events-none"
            >
              <Link href={`/${locale}/sign-up`}>{t('signUp')}</Link>
            </Button>
          </div>
        </div>
      </>
    );
  }
  return user ? (
    <div className="flex items-center gap-4">
      <span className="hidden md:flex">{t('greeting', { email: user.email || '' })}</span>
      <span className="md:hidden">{t('shortGreeting')}</span>
      <form action={signOutAction}>
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
