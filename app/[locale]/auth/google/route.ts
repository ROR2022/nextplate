import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { getLocale } from "next-intl/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const supabase = await createClient();
  const locale = await getLocale();

  // Configurar la redirección después de la autenticación
  const redirectTo = `${requestUrl.origin}/${locale}/auth/callback`;

  // Iniciar el flujo de autenticación con Google
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    console.error("Error signing in with Google:", error);
    return NextResponse.redirect(
      `${requestUrl.origin}/${locale}/sign-in?error=${encodeURIComponent(
        error.message
      )}`
    );
  }

  // Redirigir al usuario a la URL proporcionada por Supabase
  return NextResponse.redirect(data.url);
}
