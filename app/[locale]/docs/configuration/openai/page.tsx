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
    title: `${t("sidebar.openai")} - ${t("meta.title")}`,
    description: t("configuration.openai.description"),
  };
}

export default async function OpenAIConfigPage({
  params,
}: PageProps) {
  // Extraer el locale de params después de que Next.js lo haya resuelto completamente
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "docs" });

  return (
    <>
      <DocContent
        title={t("configuration.openai.title")}
        description={t("configuration.openai.description")}
      >
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("configuration.openai.intro.title")}</h2>
          <p className="mb-4">
            OpenAI proporciona APIs de inteligencia artificial que permiten integrar capacidades avanzadas 
            de procesamiento de lenguaje natural en aplicaciones. NextPlate incluye ejemplos prácticos 
            de integración con OpenAI para añadir funcionalidades como generación de contenido, 
            chatbots interactivos y análisis de texto.
          </p>
          <p className="mb-4">
            Con la integración de OpenAI en NextPlate, puedes:
          </p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>Implementar chatbots inteligentes para atención al cliente</li>
            <li>Generar contenido automáticamente (artículos, descripciones, etc.)</li>
            <li>Analizar y resumir textos largos</li>
            <li>Traducir contenido entre idiomas</li>
            <li>Crear asistentes virtuales personalizados</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("configuration.openai.setup.title")}</h2>
          <h3 className="text-xl font-semibold mt-6 mb-3">Creación de una cuenta en OpenAI</h3>
          <ol className="list-decimal pl-5 space-y-2 mb-4">
            <li>Ve a <a href="https://platform.openai.com/signup" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">platform.openai.com/signup</a> y crea una cuenta.</li>
            <li>Completa la información requerida y verifica tu cuenta.</li>
            <li>OpenAI ofrece créditos gratuitos para nuevos usuarios que puedes usar durante el desarrollo.</li>
          </ol>

          <h3 className="text-xl font-semibold mt-6 mb-3">Obtención de la API Key</h3>
          <ol className="list-decimal pl-5 space-y-2 mb-4">
            <li>En el dashboard de OpenAI, ve a <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">API Keys</a>.</li>
            <li>Haz clic en &quot;Create new secret key&quot; y asigna un nombre descriptivo.</li>
            <li><strong>Importante:</strong> Guarda la clave en un lugar seguro, ya que no podrás verla nuevamente después de cerrar la ventana.</li>
            <li>Configura límites de uso si es necesario para controlar los costos.</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("configuration.openai.integration.title")}</h2>
          <p className="mb-4">
            Para integrar OpenAI en tu aplicación NextPlate:
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">1. Configuración de variables de entorno</h3>
          <p className="mb-4">
            Añade la siguiente variable a tu archivo <code>.env.local</code>:
          </p>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`# OpenAI
OPENAI_API_KEY=sk-your_api_key_here`}
              </code>
            </pre>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">2. Instalación de la biblioteca de OpenAI</h3>
          <p className="mb-4">
            NextPlate ya incluye la biblioteca oficial de OpenAI, pero si necesitas instalarla manualmente:
          </p>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`npm install openai
# o
yarn add openai`}
              </code>
            </pre>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">{t("configuration.openai.usage.title")}</h2>
          <p className="mb-4">
            NextPlate incluye ejemplos prácticos para trabajar con la API de OpenAI:
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Generación de texto con GPT</h3>
          <p className="mb-4">
            Este ejemplo muestra cómo generar texto utilizando el modelo GPT:
          </p>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`import OpenAI from 'openai';

// Inicializar el cliente de OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateText(prompt: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "Eres un asistente útil y profesional." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error al generar texto con OpenAI:', error);
    throw error;
  }
}`}
              </code>
            </pre>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">Implementación de un chatbot</h3>
          <p className="mb-4">
            Este ejemplo muestra cómo implementar un chatbot simple:
          </p>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`// API route para el chatbot
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    
    // Añadir mensaje del sistema para definir el comportamiento del chatbot
    const fullMessages = [
      { role: "system", content: "Eres un asistente de soporte al cliente amigable para NextPlate." },
      ...messages
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: fullMessages,
      temperature: 0.7,
      max_tokens: 500,
    });

    return NextResponse.json({ 
      message: response.choices[0].message.content,
      usage: response.usage
    });
  } catch (error) {
    console.error('Error en el chatbot:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}`}
              </code>
            </pre>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">Consideraciones de costos</h3>
          <p className="mb-4">
            Al utilizar la API de OpenAI, ten en cuenta lo siguiente:
          </p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>Los costos se basan en el número de tokens procesados (tanto en la entrada como en la salida).</li>
            <li>Diferentes modelos tienen diferentes precios por token.</li>
            <li>Configura límites de uso en el dashboard de OpenAI para evitar costos inesperados.</li>
            <li>Implementa mecanismos de caché para evitar llamadas repetidas a la API.</li>
            <li>Considera usar modelos más pequeños para tareas simples para reducir costos.</li>
          </ul>
        </section>
      </DocContent>

      <DocNavigation
        locale={locale}
        prevPath="/configuration/stripe"
        prevLabel={t("sidebar.stripe")}
        nextPath="/development"
        nextLabel={t("sidebar.workflow")}
      />
    </>
  );
}
