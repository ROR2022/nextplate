import { getTranslations } from "next-intl/server";
import DocContent from "../../components/doc-content";
import DocNavigation from "../../components/doc-navigation";
import { Metadata } from "next";
import { type PageProps } from "../../api/auth/page";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  // Extraer el locale de params después de que Next.js lo haya resuelto completamente
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "docs" });
  
  return {
    title: `${t("sidebar.stripe")} - ${t("meta.title")}`,
    description: t("configuration.stripe.description"),
  };
}

export default async function StripeConfigPage({
  params,
}: PageProps) {
  // Extraer el locale de params después de que Next.js lo haya resuelto completamente
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "docs" });

  return (
    <>
      <DocContent
        title={t("configuration.stripe.title")}
        description={t("configuration.stripe.description")}
      >
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("configuration.stripe.intro.title")}</h2>
          <p className="mb-4">
            Stripe es una plataforma de procesamiento de pagos que permite a las empresas recibir pagos 
            en línea. NextPlate incluye una integración completa con Stripe para procesar pagos únicos 
            y suscripciones, con soporte para webhooks que actualizan el estado de los pagos en tiempo real.
          </p>
          <p className="mb-4">
            Con la integración de Stripe en NextPlate, puedes:
          </p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>Procesar pagos únicos para productos o servicios</li>
            <li>Configurar planes de suscripción con diferentes niveles y precios</li>
            <li>Gestionar renovaciones automáticas y cancelaciones</li>
            <li>Recibir notificaciones en tiempo real sobre eventos de pago mediante webhooks</li>
            <li>Ofrecer múltiples métodos de pago (tarjetas, PayPal, etc.)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("configuration.stripe.setup.title")}</h2>
          <h3 className="text-xl font-semibold mt-6 mb-3">Creación de una cuenta en Stripe</h3>
          <ol className="list-decimal pl-5 space-y-2 mb-4">
            <li>Ve a <a href="https://stripe.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">stripe.com</a> y crea una cuenta.</li>
            <li>Completa la información de tu negocio y verifica tu cuenta.</li>
            <li>Stripe proporciona un entorno de prueba (test mode) que puedes usar durante el desarrollo.</li>
          </ol>

          <h3 className="text-xl font-semibold mt-6 mb-3">Obtención de claves API</h3>
          <ol className="list-decimal pl-5 space-y-2 mb-4">
            <li>En el dashboard de Stripe, ve a Developers {'>'}  API keys.</li>
            <li>Verás dos conjuntos de claves: publicables y secretas, tanto para el modo de prueba como para producción.</li>
            <li>Durante el desarrollo, usa las claves de prueba (que comienzan con &quot;pk_test_&quot; y &quot;sk_test_&quot;).</li>
            <li>Para producción, usa las claves reales (que comienzan con &quot;pk_live_&quot; y &quot;sk_live_&quot;).</li>
            <li><strong>Importante:</strong> Nunca compartas tus claves secretas ni las incluyas en código del lado del cliente.</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("configuration.stripe.integration.title")}</h2>
          <p className="mb-4">
            Para integrar Stripe en tu aplicación NextPlate:
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">1. Configuración de variables de entorno</h3>
          <p className="mb-4">
            Añade las siguientes variables a tu archivo <code>.env.local</code>:
          </p>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret`}
              </code>
            </pre>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">2. Configuración de productos y precios</h3>
          <p className="mb-4">
            Para configurar productos y planes de suscripción:
          </p>
          <ol className="list-decimal pl-5 space-y-2 mb-4">
            <li>En el dashboard de Stripe, ve a Products.</li>
            <li>Haz clic en {'"'}Add product{'"'} y completa la información del producto.</li>
            <li>Configura los precios para el producto (único o recurrente).</li>
            <li>Para suscripciones, especifica la frecuencia de facturación (mensual, anual, etc.).</li>
            <li>Guarda los IDs de los productos y precios para usarlos en tu aplicación.</li>
          </ol>

          <h3 className="text-xl font-semibold mt-6 mb-3">3. Configuración de webhooks</h3>
          <p className="mb-4">
            Los webhooks permiten que Stripe notifique a tu aplicación sobre eventos como pagos exitosos, 
            suscripciones canceladas, etc.
          </p>
          <ol className="list-decimal pl-5 space-y-2 mb-4">
            <li>En el dashboard de Stripe, ve a Developers {'>'}  Webhooks.</li>
            <li>Haz clic en {'"'}Add endpoint{'"'} y configura la URL de tu webhook (por ejemplo, <code>https://tu-dominio.com/api/webhooks/stripe</code>).</li>
            <li>Selecciona los eventos que deseas recibir (por ejemplo, <code>checkout.session.completed</code>, <code>customer.subscription.updated</code>).</li>
            <li>Stripe generará un {'"'}signing secret{'"'} que debes añadir a tus variables de entorno como <code>STRIPE_WEBHOOK_SECRET</code>.</li>
            <li>Durante el desarrollo, puedes usar Stripe CLI para probar webhooks localmente.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">{t("configuration.stripe.usage.title")}</h2>
          <p className="mb-4">
            NextPlate incluye componentes y funciones para trabajar con Stripe:
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Procesamiento de pagos únicos</h3>
          <p className="mb-4">
            Para procesar un pago único:
          </p>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`// Crear una sesión de checkout
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function createCheckoutSession(priceId: string, customerId?: string) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: \`\${process.env.NEXT_PUBLIC_APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}\`,
    cancel_url: \`\${process.env.NEXT_PUBLIC_APP_URL}/payment/canceled\`,
    customer: customerId,
  });

  return session;
}`}
              </code>
            </pre>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">Gestión de suscripciones</h3>
          <p className="mb-4">
            Para crear una suscripción:
          </p>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`// Crear una sesión de suscripción
export async function createSubscriptionSession(priceId: string, customerId?: string) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: \`\${process.env.NEXT_PUBLIC_APP_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}\`,
    cancel_url: \`\${process.env.NEXT_PUBLIC_APP_URL}/subscription/canceled\`,
    customer: customerId,
  });

  return session;
}`}
              </code>
            </pre>
          </div>
        </section>
      </DocContent>

      <DocNavigation
        locale={locale}
        prevPath="/configuration/mailgun"
        prevLabel={t("sidebar.mailgun")}
        nextPath="/configuration/openai"
        nextLabel={t("sidebar.openai")}
      />
    </>
  );
}
