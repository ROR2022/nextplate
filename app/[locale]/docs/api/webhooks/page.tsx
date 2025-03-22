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
    title: t("sidebar.webhooks") + " - " + t("meta.title"),
    description: t("api.webhooks.description"),
  };
}

export default async function ApiWebhooksPage({
  params,
}: PageProps) {
  // Extraer el locale de params
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "docs" });

  return (
    <>
      <DocContent
        title={t("api.webhooks.title")}
        description={t("api.webhooks.description")}
      >
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("api.webhooks.intro.title")}</h2>
          <p className="mb-4">
            Los webhooks en NextPlate permiten a servicios externos enviar notificaciones a tu aplicación 
            cuando ocurren eventos específicos. Estos endpoints están diseñados para recibir y procesar 
            datos de servicios como Stripe, Mailgun y otros, permitiendo que tu aplicación reaccione 
            automáticamente a eventos externos.
          </p>
          <p className="mb-4">
            Todos los endpoints de webhooks están disponibles en la ruta base <code>/api/webhooks</code> y 
            generalmente no requieren autenticación mediante token JWT, pero utilizan otros métodos de 
            autenticación específicos de cada servicio para garantizar la seguridad.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("api.webhooks.stripe.title")}</h2>
          <p className="mb-4">
            El webhook de Stripe permite a tu aplicación recibir notificaciones sobre eventos relacionados 
            con pagos, suscripciones, facturas y otros eventos de Stripe.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Endpoint del webhook de Stripe</h3>
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

          <h3 className="text-xl font-semibold mt-6 mb-3">Autenticación</h3>
          <p className="mb-4">
            Stripe autentica las solicitudes de webhook utilizando una firma en el encabezado <code>Stripe-Signature</code>. 
            Esta firma se verifica utilizando el secreto de webhook que proporciona Stripe. Es importante mantener 
            este secreto seguro y configurarlo correctamente en tus variables de entorno.
          </p>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`// Ejemplo de verificación de firma en el código del servidor
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  const payload = await req.text();
  const signature = req.headers.get("stripe-signature") as string;

  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      endpointSecret
    );
    
    // Procesar el evento según su tipo
    switch (event.type) {
      case "invoice.payment_succeeded":
        // Lógica para manejar pagos exitosos
        break;
      case "customer.subscription.updated":
        // Lógica para manejar actualizaciones de suscripción
        break;
      // Otros casos...
    }
    
    return Response.json({ received: true });
  } catch (err) {
    return new Response("Webhook Error: " + err.message, { status: 400 });
  }
}`}
              </code>
            </pre>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">Eventos comunes</h3>
          <p className="mb-4">
            Algunos de los eventos más comunes que puedes recibir de Stripe incluyen:
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-2 text-left">Evento</th>
                  <th className="border p-2 text-left">Descripción</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2"><code>checkout.session.completed</code></td>
                  <td className="border p-2">Se completa una sesión de pago</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>invoice.payment_succeeded</code></td>
                  <td className="border p-2">Se realiza un pago de factura exitosamente</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>invoice.payment_failed</code></td>
                  <td className="border p-2">Falla un pago de factura</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>customer.subscription.created</code></td>
                  <td className="border p-2">Se crea una nueva suscripción</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>customer.subscription.updated</code></td>
                  <td className="border p-2">Se actualiza una suscripción existente</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>customer.subscription.deleted</code></td>
                  <td className="border p-2">Se elimina una suscripción</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("api.webhooks.mailgun.title")}</h2>
          <p className="mb-4">
            El webhook de Mailgun permite a tu aplicación recibir notificaciones sobre eventos relacionados 
            con el envío de correos electrónicos, como entregas, rebotes, quejas y más.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Endpoint del webhook de Mailgun</h3>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`POST /api/webhooks/mailgun

// Request body (form data)
{
  "signature": {
    "timestamp": "1641024000",
    "token": "1234567890abcdef",
    "signature": "1234567890abcdef"
  },
  "event-data": {
    "event": "delivered",
    "id": "1234567890",
    "timestamp": 1641024000,
    "recipient": "usuario@ejemplo.com",
    "message": {
      "headers": {
        "subject": "Asunto del correo"
      }
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

          <h3 className="text-xl font-semibold mt-6 mb-3">Autenticación</h3>
          <p className="mb-4">
            Mailgun autentica las solicitudes de webhook utilizando una firma que se verifica con tu clave API 
            de Mailgun. Es importante verificar esta firma para asegurarte de que las solicitudes provienen 
            realmente de Mailgun.
          </p>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`// Ejemplo de verificación de firma en el código del servidor
import crypto from 'crypto';

export async function POST(req: Request) {
  const formData = await req.formData();
  const timestamp = formData.get('signature[timestamp]');
  const token = formData.get('signature[token]');
  const signature = formData.get('signature[signature]');
  
  // Verificar la firma
  const encodedToken = crypto
    .createHmac('sha256', process.env.MAILGUN_API_KEY)
    .update(timestamp + token)
    .digest('hex');
  
  if (encodedToken !== signature) {
    return new Response('Invalid signature', { status: 401 });
  }
  
  // Procesar el evento
  const event = formData.get('event-data[event]');
  
  switch (event) {
    case 'delivered':
      // Lógica para manejar correos entregados
      break;
    case 'bounced':
      // Lógica para manejar rebotes
      break;
    // Otros casos...
  }
  
  return Response.json({ received: true });
}`}
              </code>
            </pre>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">Eventos comunes</h3>
          <p className="mb-4">
            Algunos de los eventos más comunes que puedes recibir de Mailgun incluyen:
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-2 text-left">Evento</th>
                  <th className="border p-2 text-left">Descripción</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2"><code>delivered</code></td>
                  <td className="border p-2">El correo electrónico se entregó correctamente</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>opened</code></td>
                  <td className="border p-2">El destinatario abrió el correo electrónico</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>clicked</code></td>
                  <td className="border p-2">El destinatario hizo clic en un enlace del correo electrónico</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>bounced</code></td>
                  <td className="border p-2">El correo electrónico rebotó (no se pudo entregar)</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>complained</code></td>
                  <td className="border p-2">El destinatario marcó el correo como spam</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>unsubscribed</code></td>
                  <td className="border p-2">El destinatario se dio de baja</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">{t("api.webhooks.custom.title")}</h2>
          <p className="mb-4">
            NextPlate también te permite crear webhooks personalizados para integrarte con otros servicios 
            o para permitir que aplicaciones externas se comuniquen con tu aplicación.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Creación de webhooks personalizados</h3>
          <p className="mb-4">
            Para crear un webhook personalizado, debes seguir estos pasos:
          </p>
          <ol className="list-decimal pl-5 space-y-2 mb-4">
            <li>Crea un nuevo archivo en <code>app/api/webhooks/[nombre-del-webhook]/route.ts</code>.</li>
            <li>Implementa los métodos HTTP necesarios (generalmente POST).</li>
            <li>Añade lógica de autenticación para verificar que las solicitudes son legítimas.</li>
            <li>Procesa los datos recibidos y realiza las acciones correspondientes.</li>
          </ol>

          <h3 className="text-xl font-semibold mt-6 mb-3">Ejemplo de webhook personalizado</h3>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`// app/api/webhooks/custom/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // Verificar la autenticación
  const authHeader = req.headers.get('authorization');
  if (!authHeader || authHeader !== "Bearer " + process.env.CUSTOM_WEBHOOK_SECRET) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  try {
    const data = await req.json();
    
    // Procesar según el tipo de evento
    switch (data.event) {
      case "order.completed":
        // Lógica para manejar órdenes completadas
        break;
      default:
        return new Response("Evento no soportado: " + data.event, { status: 400 });
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    return new Response("Error: " + error.message, { status: 500 });
  }
}`}
              </code>
            </pre>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">Mejores prácticas para webhooks</h3>
          <p className="mb-4">
            Al implementar webhooks en tu aplicación, considera las siguientes mejores prácticas:
          </p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li><strong>Autenticación:</strong> Siempre verifica la autenticidad de las solicitudes de webhook.</li>
            <li><strong>Idempotencia:</strong> Asegúrate de que tu webhook pueda manejar múltiples entregas del mismo evento sin efectos secundarios.</li>
            <li><strong>Respuesta rápida:</strong> Responde rápidamente a las solicitudes de webhook para evitar tiempos de espera.</li>
            <li><strong>Procesamiento asíncrono:</strong> Para tareas largas, responde inmediatamente y procesa los datos en segundo plano.</li>
            <li><strong>Registro:</strong> Registra todas las solicitudes de webhook para depuración y auditoría.</li>
            <li><strong>Manejo de errores:</strong> Implementa un manejo de errores robusto para evitar que tu aplicación se bloquee.</li>
            <li><strong>Reintentos:</strong> Considera implementar una lógica de reintento para eventos que no se pudieron procesar.</li>
          </ul>
        </section>
      </DocContent>

      <DocNavigation
        locale={locale}
        prevPath="/api/payments"
        prevLabel={t("sidebar.payments")}
        nextPath="/components"
        nextLabel={t("sidebar.components")}
      />
    </>
  );
}
