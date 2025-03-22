import { getTranslations } from "next-intl/server";
import DocContent from "../components/doc-content";
import DocNavigation from "../components/doc-navigation";
import { Metadata } from "next";
import { type PageProps } from "../api/auth/page";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "docs" });
  
  return {
    title: `${t("sidebar.solid")} - ${t("meta.title")}`,
    description: t("bestPractices.solid.description"),
  };
}

export default async function BestPracticesPage({
  params,
}: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "docs" });

  return (
    <>
      <DocContent
        title={t("bestPractices.solid.title")}
        description={t("bestPractices.solid.description")}
      >
        <section className="mb-8">
          <p className="mb-4">
            Los principios SOLID son fundamentales para escribir código robusto y fácil de mantener. 
            A continuación, se explican los cinco principios con ejemplos aplicados al stack de NextPlate.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Single Responsibility Principle</h2>
          <p className="mb-2"><strong>Definición:</strong> Cada clase, función o módulo debe tener una sola razón para cambiar.</p>
          <p className="mb-4"><strong>Ejemplo:</strong> Un componente de Next.js que muestra datos de usuario no debería también manejar la lógica de autenticación.</p>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`// Mal: Un solo componente hace todo
function UserProfile({ userId }) {
  const user = await fetchUserFromSupabase(userId); // Lógica de acceso a datos
  return <div>{user.name}</div>;
}

// Bien: Separar responsabilidades
function UserProfile({ user }) {
  return <div>{user.name}</div>;
}

async function fetchUserFromSupabase(userId) {
  const { data } = await supabase.from("users").select("*").eq("id", userId);
  return data[0];
}`}
              </code>
            </pre>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Open/Closed Principle</h2>
          <p className="mb-2"><strong>Definición:</strong> Las entidades deben estar abiertas a extensión pero cerradas a modificación.</p>
          <p className="mb-4"><strong>Ejemplo:</strong> Extender la lógica de pagos con Stripe sin modificar el código original.</p>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`// Clase base
class PaymentProcessor {
  process(amount) {
    throw new Error("Método no implementado");
  }
}

// Extensión para Stripe
class StripePaymentProcessor extends PaymentProcessor {
  process(amount) {
    return stripe.charges.create({ amount, currency: "usd" });
  }
}`}
              </code>
            </pre>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Liskov Substitution Principle</h2>
          <p className="mb-2"><strong>Definición:</strong> Las clases derivadas deben ser sustituibles por sus clases base sin alterar el comportamiento.</p>
          <p className="mb-4"><strong>Ejemplo:</strong> Un cliente de correo (Mailgun) debe ser intercambiable con otro sin romper la aplicación.</p>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`interface EmailClient {
  sendEmail(to: string, subject: string, body: string): Promise<void>;
}

class MailgunClient implements EmailClient {
  async sendEmail(to, subject, body) {
    await mailgun.messages().send({ to, subject, text: body });
  }
}`}
              </code>
            </pre>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Interface Segregation Principle</h2>
          <p className="mb-2"><strong>Definición:</strong> No obligar a los módulos a depender de interfaces que no usan.</p>
          <p className="mb-4"><strong>Ejemplo:</strong> Separar interfaces para Supabase según las necesidades.</p>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`interface AuthClient {
  signIn(email: string, password: string): Promise<void>;
}

interface DataClient {
  fetchData(table: string): Promise<any>;
}

class SupabaseAuth implements AuthClient {
  async signIn(email, password) {
    await supabase.auth.signInWithPassword({ email, password });
  }
}`}
              </code>
            </pre>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Dependency Inversion Principle</h2>
          <p className="mb-2"><strong>Definición:</strong> Depender de abstracciones, no de implementaciones concretas.</p>
          <p className="mb-4"><strong>Ejemplo:</strong> Inyectar un servicio de correo en lugar de codificar Mailgun directamente.</p>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`interface EmailService {
  send(to: string, message: string): Promise<void>;
}

class NotificationService {
  constructor(private emailService: EmailService) {}

  async notifyUser(to: string, message: string) {
    await this.emailService.send(to, message);
  }
}`}
              </code>
            </pre>
          </div>
        </section>
      </DocContent>

      <DocNavigation
        locale={locale}
        prevPath="/architecture/backend"
        prevLabel={t("sidebar.backend")}
        nextPath="/best-practices/clean-code"
        nextLabel={t("sidebar.cleanCode")}
      />
    </>
  );
}
