import { getTranslations } from "next-intl/server";
import DocContent from "../../components/doc-content";
import DocNavigation from "../../components/doc-navigation";
import { Metadata } from "next";
import { type PageProps } from "../auth/page";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  // Extraer el locale de params
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "docs" });
  
  return {
    title: `${t("sidebar.payments")} - ${t("meta.title")}`,
    description: t("api.payments.description"),
  };
}

export default async function ApiPaymentsPage({
  params,
}: PageProps) {
  // Extraer el locale de params 
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "docs" });

  return (
    <>
      <DocContent
        title={t("api.payments.title")}
        description={t("api.payments.description")}
      >
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("api.payments.intro.title")}</h2>
          <p className="mb-4">
            La API de pagos de NextPlate proporciona endpoints para procesar pagos, gestionar suscripciones 
            y acceder al historial de transacciones. Estos endpoints están construidos sobre Stripe, 
            proporcionando una capa de abstracción que facilita la integración de funcionalidades de pago 
            en tu aplicación.
          </p>
          <p className="mb-4">
            Todos los endpoints de pagos están disponibles en la ruta base <code>/api/payments</code> y 
            la mayoría requieren autenticación mediante un token JWT válido.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("api.payments.endpoints.title")}</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">Crear sesión de pago</h3>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`POST /api/payments/create-checkout-session

// Headers
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// Request body
{
  "price_id": "price_1234567890",
  "success_url": "https://tu-dominio.com/payment/success",
  "cancel_url": "https://tu-dominio.com/payment/canceled"
}

// Response (200 OK)
{
  "data": {
    "session_id": "cs_test_1234567890",
    "url": "https://checkout.stripe.com/pay/cs_test_1234567890"
  }
}`}
              </code>
            </pre>
          </div>
          <p className="mb-4">
            Este endpoint crea una sesión de pago en Stripe y devuelve una URL a la que el usuario 
            debe ser redirigido para completar el pago.
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-2 text-left">Parámetro</th>
                  <th className="border p-2 text-left">Tipo</th>
                  <th className="border p-2 text-left">Requerido</th>
                  <th className="border p-2 text-left">Descripción</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2"><code>price_id</code></td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">Sí</td>
                  <td className="border p-2">ID del precio en Stripe</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>success_url</code></td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">Sí</td>
                  <td className="border p-2">URL a la que se redirigirá al usuario después de un pago exitoso</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>cancel_url</code></td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">Sí</td>
                  <td className="border p-2">URL a la que se redirigirá al usuario si cancela el pago</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>quantity</code></td>
                  <td className="border p-2">number</td>
                  <td className="border p-2">No</td>
                  <td className="border p-2">Cantidad de unidades (por defecto: 1)</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>metadata</code></td>
                  <td className="border p-2">object</td>
                  <td className="border p-2">No</td>
                  <td className="border p-2">Metadatos adicionales para la sesión de pago</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">Crear sesión de suscripción</h3>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`POST /api/payments/create-subscription

// Headers
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// Request body
{
  "price_id": "price_1234567890",
  "success_url": "https://tu-dominio.com/subscription/success",
  "cancel_url": "https://tu-dominio.com/subscription/canceled"
}

// Response (200 OK)
{
  "data": {
    "subscription_id": "sub_1234567890",
    "client_secret": "seti_1234567890_secret_1234567890",
    "url": "https://checkout.stripe.com/pay/cs_test_1234567890"
  }
}`}
              </code>
            </pre>
          </div>
          <p className="mb-4">
            Este endpoint crea una suscripción en Stripe y devuelve una URL a la que el usuario 
            debe ser redirigido para completar el proceso de suscripción.
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-2 text-left">Parámetro</th>
                  <th className="border p-2 text-left">Tipo</th>
                  <th className="border p-2 text-left">Requerido</th>
                  <th className="border p-2 text-left">Descripción</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2"><code>price_id</code></td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">Sí</td>
                  <td className="border p-2">ID del precio de suscripción en Stripe</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>success_url</code></td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">Sí</td>
                  <td className="border p-2">URL a la que se redirigirá al usuario después de una suscripción exitosa</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>cancel_url</code></td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">Sí</td>
                  <td className="border p-2">URL a la que se redirigirá al usuario si cancela la suscripción</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>trial_days</code></td>
                  <td className="border p-2">number</td>
                  <td className="border p-2">No</td>
                  <td className="border p-2">Número de días de prueba (por defecto: 0)</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>metadata</code></td>
                  <td className="border p-2">object</td>
                  <td className="border p-2">No</td>
                  <td className="border p-2">Metadatos adicionales para la suscripción</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("api.payments.subscriptions.title")}</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">Obtener suscripciones del usuario</h3>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`GET /api/payments/subscriptions

// Headers
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// Response (200 OK)
{
  "data": [
    {
      "id": "sub_1234567890",
      "status": "active",
      "current_period_start": 1641024000,
      "current_period_end": 1643702400,
      "plan": {
        "id": "price_1234567890",
        "name": "Plan Premium",
        "amount": 1999,
        "currency": "usd",
        "interval": "month"
      },
      "cancel_at_period_end": false,
      "created": 1641024000
    }
  ]
}`}
              </code>
            </pre>
          </div>
          <p className="mb-4">
            Este endpoint devuelve una lista de todas las suscripciones activas del usuario autenticado.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Obtener detalles de una suscripción</h3>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`GET /api/payments/subscriptions/{subscription_id}

// Headers
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// Response (200 OK)
{
  "data": {
    "id": "sub_1234567890",
    "status": "active",
    "current_period_start": 1641024000,
    "current_period_end": 1643702400,
    "plan": {
      "id": "price_1234567890",
      "name": "Plan Premium",
      "amount": 1999,
      "currency": "usd",
      "interval": "month"
    },
    "cancel_at_period_end": false,
    "created": 1641024000,
    "payment_method": {
      "id": "pm_1234567890",
      "type": "card",
      "card": {
        "brand": "visa",
        "last4": "4242",
        "exp_month": 12,
        "exp_year": 2023
      }
    }
  }
}`}
              </code>
            </pre>
          </div>
          <p className="mb-4">
            Este endpoint devuelve los detalles completos de una suscripción específica del usuario autenticado.
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-2 text-left">Parámetro</th>
                  <th className="border p-2 text-left">Tipo</th>
                  <th className="border p-2 text-left">Requerido</th>
                  <th className="border p-2 text-left">Descripción</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2"><code>subscription_id</code></td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">Sí</td>
                  <td className="border p-2">ID de la suscripción en Stripe</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">Cancelar suscripción</h3>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`DELETE /api/payments/subscriptions/{subscription_id}

// Headers
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// Request body
{
  "cancel_immediately": false
}

// Response (200 OK)
{
  "data": {
    "id": "sub_1234567890",
    "status": "active",
    "cancel_at_period_end": true,
    "current_period_end": 1643702400
  },
  "message": "La suscripción se cancelará al final del período actual"
}`}
              </code>
            </pre>
          </div>
          <p className="mb-4">
            Este endpoint cancela una suscripción específica del usuario autenticado. Por defecto, 
            la suscripción se cancelará al final del período actual, pero puede ser cancelada inmediatamente 
            si se especifica <code>cancel_immediately: true</code>.
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-2 text-left">Parámetro</th>
                  <th className="border p-2 text-left">Tipo</th>
                  <th className="border p-2 text-left">Requerido</th>
                  <th className="border p-2 text-left">Descripción</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2"><code>subscription_id</code></td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">Sí</td>
                  <td className="border p-2">ID de la suscripción en Stripe</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>cancel_immediately</code></td>
                  <td className="border p-2">boolean</td>
                  <td className="border p-2">No</td>
                  <td className="border p-2">Si es true, la suscripción se cancelará inmediatamente (por defecto: false)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("api.payments.transactions.title")}</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">Obtener historial de transacciones</h3>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`GET /api/payments/transactions

// Headers
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// Query parameters
?limit=10&offset=0

// Response (200 OK)
{
  "data": [
    {
      "id": "ch_1234567890",
      "amount": 1999,
      "currency": "usd",
      "status": "succeeded",
      "description": "Plan Premium - Enero 2023",
      "created": 1641024000,
      "payment_method": {
        "type": "card",
        "card": {
          "brand": "visa",
          "last4": "4242"
        }
      }
    },
    {
      "id": "ch_0987654321",
      "amount": 1999,
      "currency": "usd",
      "status": "succeeded",
      "description": "Plan Premium - Diciembre 2022",
      "created": 1638432000,
      "payment_method": {
        "type": "card",
        "card": {
          "brand": "visa",
          "last4": "4242"
        }
      }
    }
  ],
  "meta": {
    "total": 2,
    "limit": 10,
    "offset": 0
  }
}`}
              </code>
            </pre>
          </div>
          <p className="mb-4">
            Este endpoint devuelve el historial de transacciones del usuario autenticado, incluyendo 
            pagos únicos y cargos de suscripción.
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-2 text-left">Parámetro</th>
                  <th className="border p-2 text-left">Tipo</th>
                  <th className="border p-2 text-left">Requerido</th>
                  <th className="border p-2 text-left">Descripción</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2"><code>limit</code></td>
                  <td className="border p-2">number</td>
                  <td className="border p-2">No</td>
                  <td className="border p-2">Número máximo de transacciones a devolver (por defecto: 10, máximo: 100)</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>offset</code></td>
                  <td className="border p-2">number</td>
                  <td className="border p-2">No</td>
                  <td className="border p-2">Número de transacciones a omitir (por defecto: 0)</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>start_date</code></td>
                  <td className="border p-2">number</td>
                  <td className="border p-2">No</td>
                  <td className="border p-2">Timestamp Unix para filtrar transacciones a partir de esta fecha</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>end_date</code></td>
                  <td className="border p-2">number</td>
                  <td className="border p-2">No</td>
                  <td className="border p-2">Timestamp Unix para filtrar transacciones hasta esta fecha</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">Obtener detalles de una transacción</h3>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`GET /api/payments/transactions/{transaction_id}

// Headers
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// Response (200 OK)
{
  "data": {
    "id": "ch_1234567890",
    "amount": 1999,
    "currency": "usd",
    "status": "succeeded",
    "description": "Plan Premium - Enero 2023",
    "created": 1641024000,
    "payment_method": {
      "id": "pm_1234567890",
      "type": "card",
      "card": {
        "brand": "visa",
        "last4": "4242",
        "exp_month": 12,
        "exp_year": 2023
      }
    },
    "receipt_url": "https://pay.stripe.com/receipts/...",
    "invoice_pdf": "https://pay.stripe.com/invoice/..."
  }
}`}
              </code>
            </pre>
          </div>
          <p className="mb-4">
            Este endpoint devuelve los detalles completos de una transacción específica del usuario autenticado.
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-2 text-left">Parámetro</th>
                  <th className="border p-2 text-left">Tipo</th>
                  <th className="border p-2 text-left">Requerido</th>
                  <th className="border p-2 text-left">Descripción</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2"><code>transaction_id</code></td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">Sí</td>
                  <td className="border p-2">ID de la transacción en Stripe</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">{t("api.payments.webhooks.title")}</h2>
          <p className="mb-4">
            NextPlate proporciona un endpoint de webhook para recibir eventos de Stripe, como pagos exitosos, 
            suscripciones canceladas, etc. Este endpoint no requiere autenticación, pero verifica la firma 
            del evento utilizando el secreto de webhook de Stripe.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Webhook de Stripe</h3>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`POST /api/webhooks/stripe

// Headers
Stripe-Signature: t=1641024000,v1=1234567890...

// Request body (raw)
{
  "id": "evt_1234567890",
  "object": "event",
  "type": "invoice.payment_succeeded",
  "data": {
    "object": {
      "id": "in_1234567890",
      "customer": "cus_1234567890",
      "subscription": "sub_1234567890",
      "total": 1999,
      "currency": "usd",
      "status": "paid"
    }
  }
}

// Response (200 OK)
{
  "received": true
}`}
              </code>
            </pre>
          </div>
          <p className="mb-4">
            Este endpoint recibe eventos de Stripe y los procesa según su tipo. Por ejemplo, cuando se recibe 
            un evento <code>invoice.payment_succeeded</code>, NextPlate actualiza el estado de la suscripción 
            del usuario correspondiente.
          </p>
          <p className="mb-4">
            Para configurar el webhook en Stripe:
          </p>
          <ol className="list-decimal pl-5 space-y-2 mb-4">
            <li>Ve al <a href="https://dashboard.stripe.com/webhooks" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Dashboard de Stripe</a>.</li>
            <li>Haz clic en &quot;Añadir endpoint&quot;.</li>
            <li>Introduce la URL de tu webhook: <code>https://tu-dominio.com/api/webhooks/stripe</code>.</li>
            <li>Selecciona los eventos que deseas recibir, como:
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><code>invoice.payment_succeeded</code></li>
                <li><code>invoice.payment_failed</code></li>
                <li><code>customer.subscription.created</code></li>
                <li><code>customer.subscription.updated</code></li>
                <li><code>customer.subscription.deleted</code></li>
                <li><code>checkout.session.completed</code></li>
              </ul>
            </li>
            <li>Haz clic en &quot;Añadir endpoint&quot;.</li>
            <li>Copia el secreto de webhook y añádelo a tus variables de entorno como <code>STRIPE_WEBHOOK_SECRET</code>.</li>
          </ol>
        </section>
      </DocContent>

      <DocNavigation
        locale={locale}
        prevPath="/api/users"
        prevLabel={t("sidebar.users")}
        nextPath="/api/webhooks"
        nextLabel={t("sidebar.webhooks")}
      />
    </>
  );
}
