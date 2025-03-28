import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { getLocale } from "next-intl/server";

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  console.warn('iniciando el login callback...');
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;
  console.warn('origin...', origin);
  const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString();
  const locale = await getLocale();

  if (code) {
    const supabase = await createClient();
    console.warn('Exchanging code for session...');
    await supabase.auth.exchangeCodeForSession(code);
  }

  if (redirectTo) {
    console.warn('Redirecting to:', redirectTo);
    return NextResponse.redirect(`${origin}/${locale}${redirectTo}`);
  }

  // URL to redirect to after sign up process completes
  return NextResponse.redirect(`${origin}/${locale}/dashboard`);
}
