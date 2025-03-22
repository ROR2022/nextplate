import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import { GoogleButton } from "@/components/auth/google-button";
import { GithubButton } from "@/components/auth/github-button";
import { Separator } from "@/components/ui/separator";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  const t = await getTranslations('auth.signIn');
  const locale = await getLocale();
  
  return (
    <form className="flex-1 flex flex-col min-w-64">
      <h1 className="text-2xl font-medium">{t('title')}</h1>
      <p className="text-sm text-foreground">
        {t('noAccount')}{" "}
        <Link className="text-foreground font-medium underline" href={`/${locale}/sign-up`}>
          {t('signUp')}
        </Link>
      </p>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <Label htmlFor="email">{t('emailLabel')}</Label>
        <Input name="email" placeholder="you@example.com" required />
        <div className="flex justify-between items-center">
          <Label htmlFor="password">{t('passwordLabel')}</Label>
          <Link
            className="text-xs text-foreground underline"
            href={`/${locale}/forgot-password`}
          >
            {t('forgotPassword')}
          </Link>
        </div>
        <Input
          type="password"
          name="password"
          placeholder="Your password"
          required
        />
        <SubmitButton pendingText={`${t('button')}...`} formAction={signInAction}>
          {t('button')}
        </SubmitButton>
        
        <div className="mt-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {t('orContinueWith')}
              </span>
            </div>
          </div>
          
          <div className="mt-4 flex flex-col space-y-2">
            <GoogleButton mode="signIn" />
            <GithubButton mode="signIn" />
          </div>
        </div>
        
        <FormMessage message={searchParams} />
      </div>
    </form>
  );
}
