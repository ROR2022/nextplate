import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import { GoogleButton } from "@/components/auth/google-button";
import { GithubButton } from "@/components/auth/github-button";
import { Separator } from "@/components/ui/separator";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  const t = await getTranslations('auth.signUp');
  const locale = await getLocale();
  
  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <>
      <form className="flex flex-col min-w-64 max-w-64 mx-auto">
        <h1 className="text-2xl font-medium">{t('title')}</h1>
        <p className="text-sm text text-foreground">
          {t('alreadyAccount')}{" "}
          <Link className="text-primary font-medium underline" href={`/${locale}/sign-in`}>
            {t('signIn')}
          </Link>
        </p>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="email">{t('emailLabel')}</Label>
          <Input name="email" placeholder="you@example.com" required />
          <Label htmlFor="password">{t('passwordLabel')}</Label>
          <Input
            type="password"
            name="password"
            placeholder="Your password"
            minLength={6}
            required
          />
          <SubmitButton formAction={signUpAction} pendingText={`${t('button')}...`}>
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
              <GoogleButton mode="signUp" />
              <GithubButton mode="signUp" />
            </div>
          </div>
          
          <FormMessage message={searchParams} />
        </div>
      </form>
      
    </>
  );
}
