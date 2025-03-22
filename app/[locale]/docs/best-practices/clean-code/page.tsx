import { getTranslations } from "next-intl/server";
import DocContent from "../../components/doc-content";
import DocNavigation from "../../components/doc-navigation";
import { Metadata } from "next";
import { CodeBlock } from "@/components/tutorial/code-block";
import { type PageProps } from "../../api/auth/page";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  // Extraer el locale de params después de que Next.js lo haya resuelto completamente
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "docs" });
  
  return {
    title: `${t("cleanCode.title")} - ${t("meta.title")}`,
    description: t("cleanCode.description"),
  };
}

export default async function CleanCodePage({
  params,
}: PageProps) {
  // Extraer el locale de params después de que Next.js lo haya resuelto completamente
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "docs" });

  return (
    <>
      <DocContent
        title={t("cleanCode.title")}
        description={t("cleanCode.description")}
      >
        <section className="mb-8">
          <p className="mb-4">
            El código limpio es aquel que es fácil de leer, entender y mantener. Escribir código limpio es una habilidad 
            esencial para cualquier desarrollador, especialmente en proyectos colaborativos y de larga duración como los 
            que se pueden construir con NextPlate.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Principios de Código Limpio</h2>
          <p className="mb-4">
            Estos son algunos de los principios fundamentales que guían la escritura de código limpio:
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">1. Nombres Significativos</h3>
          <p className="mb-4">
            Los nombres de variables, funciones, clases y otros identificadores deben ser claros y revelar la intención.
          </p>
          <div className="bg-muted p-4 rounded-md mb-4">
            <p className="text-sm mb-2">
              <strong>Ejemplo:</strong>
            </p>
            <CodeBlock code={`// Mal: Nombres poco descriptivos
const d = new Date();
const u = await getUser(id);
const s = calculateTotal(items);

// Bien: Nombres claros y descriptivos
const currentDate = new Date();
const user = await getUserById(userId);
const totalAmount = calculateOrderTotal(orderItems);`} />
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">2. Funciones Pequeñas y Enfocadas</h3>
          <p className="mb-4">
            Las funciones deben hacer una sola cosa, hacerla bien y hacerla únicamente. Deben ser pequeñas y tener un nivel 
            de abstracción consistente.
          </p>
          <div className="bg-muted p-4 rounded-md mb-4">
            <p className="text-sm mb-2">
              <strong>Ejemplo:</strong>
            </p>
            <CodeBlock code={`// Mal: Función que hace demasiadas cosas
function processUserData(userData) {
  // Validar datos
  if (!userData.email || !userData.name) {
    throw new Error('Datos de usuario incompletos');
  }
  
  // Formatear datos
  const formattedData = {
    email: userData.email.toLowerCase(),
    name: userData.name.trim(),
    createdAt: new Date()
  };
  
  // Guardar en la base de datos
  const { data, error } = await supabase
    .from('users')
    .insert(formattedData);
    
  if (error) throw error;
  
  // Enviar email de bienvenida
  await sendWelcomeEmail(formattedData.email);
  
  return data;
}

// Bien: Funciones pequeñas y enfocadas
function validateUserData(userData) {
  if (!userData.email || !userData.name) {
    throw new Error('Datos de usuario incompletos');
  }
}

function formatUserData(userData) {
  return {
    email: userData.email.toLowerCase(),
    name: userData.name.trim(),
    createdAt: new Date()
  };
}

async function saveUserToDatabase(formattedData) {
  const { data, error } = await supabase
    .from('users')
    .insert(formattedData);
    
  if (error) throw error;
  return data;
}

async function processUserData(userData) {
  validateUserData(userData);
  const formattedData = formatUserData(userData);
  const savedUser = await saveUserToDatabase(formattedData);
  await sendWelcomeEmail(formattedData.email);
  return savedUser;
}`} />
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">3. Comentarios Apropiados</h3>
          <p className="mb-4">
            El buen código se documenta a sí mismo. Los comentarios deben explicar el &quot;por qué&quot;, no el &quot;qué&quot; o el &quot;cómo&quot;, 
            que debería ser evidente en el código.
          </p>
          <div className="bg-muted p-4 rounded-md mb-4">
            <p className="text-sm mb-2">
              <strong>Ejemplo:</strong>
            </p>
            <CodeBlock code={`// Mal: Comentario que explica lo obvio
// Incrementa el contador en 1
counter++;

// Bien: Comentario que explica la razón
// Incrementamos el contador para mantener la compatibilidad con la API externa
// que espera un valor secuencial para cada solicitud
counter++;`} />
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">4. Formato Consistente</h3>
          <p className="mb-4">
            Un formato de código consistente mejora la legibilidad y reduce la fricción al leer el código.
          </p>
          <div className="bg-muted p-4 rounded-md mb-4">
            <p className="text-sm mb-2">
              <strong>Ejemplo en NextPlate:</strong>
            </p>
            <p className="text-sm mb-2">
              NextPlate utiliza ESLint y Prettier para mantener un formato de código consistente en todo el proyecto.
              Esto incluye reglas para indentación, espaciado, longitud de línea, y más.
            </p>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">5. Manejo de Errores</h3>
          <p className="mb-4">
            El manejo de errores debe ser claro y no oscurecer la lógica del código.
          </p>
          <div className="bg-muted p-4 rounded-md mb-4">
            <p className="text-sm mb-2">
              <strong>Ejemplo:</strong>
            </p>
            <CodeBlock code={`// Mal: Manejo de errores mezclado con lógica de negocio
function processPayment(paymentData) {
  try {
    const paymentMethod = getPaymentMethod(paymentData);
    let result;
    
    if (paymentMethod === 'credit_card') {
      try {
        result = processCreditCardPayment(paymentData);
      } catch (e) {
        console.error('Error al procesar pago con tarjeta:', e);
        return { success: false, error: e.message };
      }
    } else if (paymentMethod === 'paypal') {
      try {
        result = processPayPalPayment(paymentData);
      } catch (e) {
        console.error('Error al procesar pago con PayPal:', e);
        return { success: false, error: e.message };
      }
    } else {
      return { success: false, error: 'Método de pago no soportado' };
    }
    
    return { success: true, data: result };
  } catch (e) {
    console.error('Error general al procesar pago:', e);
    return { success: false, error: e.message };
  }
}

// Bien: Separación clara de la lógica de negocio y el manejo de errores
function processCreditCardPayment(paymentData) {
  // Lógica específica para tarjetas de crédito
}

function processPayPalPayment(paymentData) {
  // Lógica específica para PayPal
}

function processPayment(paymentData) {
  try {
    const paymentMethod = getPaymentMethod(paymentData);
    
    if (paymentMethod === 'credit_card') {
      return processCreditCardPayment(paymentData);
    }
    
    if (paymentMethod === 'paypal') {
      return processPayPalPayment(paymentData);
    }
    
    throw new Error('Método de pago no soportado');
  } catch (error) {
    // Centralizar el manejo de errores
    logPaymentError(error, paymentData);
    throw error; // O manejar de otra forma según la arquitectura
  }
}`} />
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Prácticas de Código Limpio en NextPlate</h2>
          <p className="mb-4">
            NextPlate implementa varias prácticas para fomentar el código limpio:
          </p>
          
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>
              <strong>Estructura de Carpetas Clara:</strong> Organización lógica que separa componentes, páginas, 
              utilidades y configuraciones.
            </li>
            <li>
              <strong>Componentes Reutilizables:</strong> Componentes pequeños y enfocados que se pueden combinar 
              para crear interfaces más complejas.
            </li>
            <li>
              <strong>Hooks Personalizados:</strong> Encapsulan lógica compleja en funciones reutilizables con 
              nombres descriptivos.
            </li>
            <li>
              <strong>Tipado con TypeScript:</strong> Proporciona documentación integrada y detección temprana de errores.
            </li>
            <li>
              <strong>Convenciones de Nomenclatura:</strong> Nombres consistentes para archivos, componentes, 
              funciones y variables.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Herramientas para Mantener Código Limpio</h2>
          <p className="mb-4">
            NextPlate incluye varias herramientas para ayudar a mantener un código limpio:
          </p>
          
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>
              <strong>ESLint:</strong> Para análisis estático de código y detección de problemas potenciales.
            </li>
            <li>
              <strong>Prettier:</strong> Para formatear automáticamente el código según reglas predefinidas.
            </li>
            <li>
              <strong>TypeScript:</strong> Para añadir tipado estático y mejorar la robustez del código.
            </li>
            <li>
              <strong>Husky y lint-staged:</strong> Para ejecutar linters y formatters automáticamente antes de los commits.
            </li>
          </ul>
          
          <p className="mb-4">
            Estas herramientas trabajan juntas para garantizar que el código sea consistente, 
            bien formateado y libre de errores comunes.
          </p>
        </section>

        <DocNavigation 
          locale={locale}
          prevPath="/best-practices/solid"
          prevLabel={t("solid.title")}
          nextPath="/best-practices/patterns"
          nextLabel={t("patterns.title")}
        />
      </DocContent>
    </>
  );
}
