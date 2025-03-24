import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n";
import { createClient } from "@supabase/supabase-js";

const intlMiddleware = createMiddleware(routing);

// Supabase backend client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // 🔒 solo usar en backend/server
);

export async function middleware(request: NextRequest) {
  try {
    //esta seccion es para bloquear rutas sospechosas
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const path = request.nextUrl.pathname;

    // 🔍 Verifica si esta IP ya está en la lista
    const { data: blocked } = await supabase
      .from("blocked_ips")
      .select("ip")
      .eq("ip", ip)
      .maybeSingle();

    if (blocked) {
      console.warn(`⛔ Blocked IP ${ip} tried to access ${path}`);
      return new NextResponse("Access denied", { status: 403 });
    }

    
    const userAgent = request.headers.get("user-agent") || "unknown";
    const suspiciousKeywords = [
      "wp-",
      "wpadmin",
      "xmlrpc",
      "php",
      ".ini",
      ".bak",
      ".env",
      "setup",
    ];

    //detectar si el path es sospechoso
    const isSuspicious = suspiciousKeywords.some(keyword => path.toLowerCase().includes(keyword));

    // Cargar paths bloqueados desde Supabase
    const { data: blockedPathsData, error: blockedPathsError } = await supabase
      .from("blocked_paths")
      .select("path");
    if (blockedPathsError) {
      console.error("Error fetching blocked paths:", blockedPathsError);
      return NextResponse.error();
    }

    const blockedPaths = blockedPathsData?.map(row => row.path) ?? [];

    // Si no está en la tabla y parece sospechosa, la registramos
    if (!blockedPaths.some(p => path.startsWith(p)) && isSuspicious) {
      // Insertamos la ruta en la tabla blocked_paths
      await supabase
        .from("blocked_paths")
        .upsert({
          path,
          description: "Auto-detected suspicious path",
        })
        .eq("path", path);

      // También bloqueamos la IP como de costumbre
      await supabase.from("blocked_ips").upsert({ ip, user_agent: userAgent }).eq("ip", ip);

      console.warn(`🚨 AUTO-BLOCKED unknown path: ${path} from IP: ${ip}`);
      return new NextResponse("Forbidden", { status: 403 });
    }

    // 🧱 Si accede a una ruta sospechosa, registramos y bloqueamos
    if (blockedPaths.some(blockedPath => path.startsWith(blockedPath))) {
      await supabase.from("blocked_ips").upsert({ ip, user_agent: userAgent }).eq("ip", ip);

      console.warn(`🚨 Path blocked → ${path} from IP: ${ip}`);
      return new NextResponse("Forbidden", { status: 403 });
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