import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n";

const intlMiddleware = createMiddleware(routing);

/* const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: 'es',
  localeDetection: false
}); */

export async function middleware(request: NextRequest) {
  try {
    //esta seccion es para bloquear rutas sospechosas
    const path = request.nextUrl.pathname;

    const blockedPaths = [
      "/wp-admin",
      "/wordpress",
      "/wp-login.php",
      "/wp-content",
      "/xmlrpc.php",
      "/wp-includes",
    ];

    if (blockedPaths.some(bp => path.startsWith(bp))) {
      return new NextResponse("Not allowed", { status: 403 });
    }

    // Handle root path
    if (request.nextUrl.pathname === "/") {
      return NextResponse.redirect(new URL("/es", request.url));
    }

    // Create a new NextRequest instead of cloning
    const supabaseResponse = await updateSession(request);
    // Create a new request with only valid RequestInit properties
    const newRequest = new NextRequest(request.url, {
      headers: request.headers,
      method: request.method,
      // Remove invalid properties from RequestInit
      body: request.body,
      cache: request.cache,
      credentials: request.credentials,
      integrity: request.integrity,
      keepalive: request.keepalive,
      mode: request.mode,
      redirect: request.redirect,
      referrer: request.referrer,
      referrerPolicy: request.referrerPolicy,
      signal: request.signal,
    });

    // Copy additional properties after creation
    Object.defineProperty(newRequest, "nextUrl", { value: request.nextUrl });
    Object.defineProperty(newRequest, "cookies", { value: request.cookies });
    //Object.defineProperty(newRequest, 'geo', { value: request.geo });

    const intlResponse = await intlMiddleware(newRequest);

    if (!supabaseResponse) {
      return intlResponse;
    }

    // Merge headers
    intlResponse.headers.forEach((value, key) => {
      supabaseResponse.headers.set(key, value);
    });

    return supabaseResponse;
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.error();
  }
}

export const config = {
  matcher: [
    // Match all paths except static files and API routes
    "/((?!_next|api|favicon.ico).*)",
    "/",
    "/(es|en)/:path*",
  ],
};

/* 
import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n';

// Middleware de next-intl para internacionalización
const intlMiddleware = createMiddleware({
  // Los idiomas soportados definidos en i18n.ts
  locales,
  // El idioma predeterminado cuando no se especifica
  defaultLocale: 'es',
  // Usar la preferencia del navegador como respaldo
  localeDetection: true
});

export async function middleware(request: NextRequest) {
  // Primero actualizar la sesión de Supabase
  const supabaseResponse = await updateSession(request);
  
  // Verificar si la ruta es la raíz exacta
  if (request.nextUrl.pathname === '/') {
    // Permitir que la redirección en page.tsx funcione
    return supabaseResponse || NextResponse.next();
  }
  
  // Luego aplicar el middleware de next-intl
  // Necesitamos clonar la solicitud porque ya ha sido consumida por updateSession
  const intlResponse = await intlMiddleware(
    new NextRequest(request.url, {
      headers: request.headers,
      method: request.method,
    })
  );
  
  // Combinar las cabeceras de ambas respuestas
  const response = supabaseResponse || intlResponse;
  
  // Si hay cabeceras de Supabase, mantenerlas
  if (supabaseResponse && intlResponse) {
    intlResponse.headers.forEach((value, key) => {
      response.headers.set(key, value);
    });
  }
  
  return response;
}

export const config = {
  matcher: [
    
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
 */

/*
 * Match all request paths except:
 * - _next/static (static files)
 * - _next/image (image optimization files)
 * - favicon.ico (favicon file)
 * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
 * Feel free to modify this pattern to include more paths.
 */
