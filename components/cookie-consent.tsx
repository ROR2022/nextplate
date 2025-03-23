"use client"

import { useState, useEffect } from "react"
import CookieConsent from "react-cookie-consent"
import { useLocale, useTranslations } from "next-intl"
import Link from "next/link"
import { Cookie } from "lucide-react"

/**
 * Componente para mostrar el banner de consentimiento de cookies
 * Implementa el principio de Responsabilidad Única al encargarse únicamente de gestionar el consentimiento de cookies
 * El banner permanece visible en todo momento hasta que el usuario acepte o rechace las cookies
 */
export default function CookieConsentBanner() {
  const [mounted, setMounted] = useState(false)
  const [showBanner, setShowBanner] = useState(true)
  const locale = useLocale()
  const t = useTranslations("common")

  // Asegurar que el componente solo se renderice en el cliente
  useEffect(() => {
    setMounted(true)
    
    // Verificar si el usuario ya ha interactuado con el banner
    const cookieConsent = document.cookie
      .split("; ")
      .find(row => row.startsWith("nextplate-cookie-consent="))
    
    // Si ya existe la cookie, no mostrar el banner
    if (cookieConsent) {
      setShowBanner(false)
    }
  }, [])

  // Función para manejar la aceptación de cookies
  const handleAccept = () => {
    setShowBanner(false)
    // Aquí se implementaría la lógica real de gestión de cookies en el futuro
  }

  // Función para manejar el rechazo de cookies
  const handleDecline = () => {
    setShowBanner(false)
    // Aquí se implementaría la lógica real de gestión de cookies en el futuro
  }

  if (!mounted || !showBanner) {
    return null
  }

  return (
    <CookieConsent
      location="bottom"
      buttonText={t("cookies.accept")}
      declineButtonText={t("cookies.decline")}
      cookieName="nextplate-cookie-consent"
      // Clases de Tailwind para el contenedor principal - Fijado en la parte inferior
      containerClasses="fixed bottom-0 left-0 right-0 w-full z-[9999] bg-background/80 backdrop-blur-sm border-t border-primary/20 shadow-lg"
      // Estilos mínimos necesarios que no se pueden reemplazar con Tailwind
      style={{
        position: "fixed", // Asegura que esté fijado
        bottom: 0,         // Fijado en la parte inferior
        left: 0,           // Extendido por toda la anchura
        right: 0,
        width: "100%",
        margin: 0,
        padding: 0,
        zIndex: 9999,      // Valor alto para estar por encima de todo
      }}
      // Clases de Tailwind para el contenido
      contentClasses="max-w-5xl mx-auto p-4 flex flex-col md:flex-row items-center justify-between"
      // Clases de Tailwind para el wrapper de botones
      buttonWrapperClasses="flex gap-3 mt-4 md:mt-0"
      // Personalizar estilos de botones
      buttonClasses="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 min-w-[120px]"
      declineButtonClasses="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 min-w-[120px]"
      enableDeclineButton
      flipButtons
      expires={365}
      // Configuraciones para asegurar que el banner siempre esté visible
      disableStyles={false}
      // Sin overlay para mantener el fondo visible
      overlay={false}
      // Asegurar que el banner esté siempre visible (como string en lugar de boolean)
      visible="true"
      // Callbacks para manejar las acciones del usuario
      onAccept={handleAccept}
      onDecline={handleDecline}
    >
      <div className="flex items-center gap-2">
        <Cookie className="h-5 w-5 text-primary flex-shrink-0" />
        <div className="flex flex-col">
          <h3 className="font-semibold text-base">{t("cookies.title")}</h3>
          <p className="text-sm text-muted-foreground">
            {t("cookies.message")}{" "}
            <Link
              href={`/${locale}/cookies`}
              className="text-primary font-medium underline underline-offset-4 hover:text-primary/80"
            >
              {t("cookies.learnMore")}
            </Link>
          </p>
        </div>
      </div>
    </CookieConsent>
  )
}
