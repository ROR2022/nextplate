import { getTranslations } from "next-intl/server";
import DocContent from "../../components/doc-content";
import DocNavigation from "../../components/doc-navigation";
import { Metadata } from "next";
import { CodeBlock } from "@/components/tutorial/code-block";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  // Extraer el locale de params después de que Next.js lo haya resuelto completamente
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "docs" });
  
  return {
    title: `${t("sidebar.backend")} - ${t("meta.title")}`,
    description: t("architecture.backend.description"),
  };
}

export default async function BackendPage({
  params,
}: {
  params: { locale: string };
}) {
  // Extraer el locale de params después de que Next.js lo haya resuelto completamente
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "docs" });

  return (
    <>
      <DocContent
        title={t("architecture.backend.title")}
        description={t("architecture.backend.description")}
      >
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("architecture.backend.overview.title")}</h2>
          <p className="mb-4">{t("architecture.backend.overview.description")}</p>
          <p className="mb-4">
            El backend de NextPlate está diseñado para proporcionar una base sólida y escalable para tu aplicación,
            aprovechando las capacidades de Next.js API Routes, Supabase y otros servicios externos. Esta arquitectura
            permite un desarrollo rápido sin sacrificar rendimiento, seguridad o escalabilidad.
          </p>
          <div className="bg-muted p-6 rounded-lg my-6 overflow-x-auto">
            <pre className="text-sm">
              <code>
{`[Cliente] <--> [Next.js API Routes] <--> [Servicios Externos]
                      |
                      v
                 [Supabase]
                /    |    \\
               /     |     \\
    [Auth]  [Database]  [Storage]
      |         |          |
      v         v          v
[Usuarios] [Datos] [Archivos/Media]`}
              </code>
            </pre>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("architecture.backend.apiRoutes.title")}</h2>
          <p className="mb-4">{t("architecture.backend.apiRoutes.description")}</p>
          <p className="mb-4">
            Las rutas API de Next.js actúan como el punto de entrada principal para las solicitudes del cliente al backend.
            Estas rutas están organizadas por funcionalidad y proporcionan una capa de abstracción sobre los servicios subyacentes.
          </p>
          <div className="bg-muted p-4 rounded-md mb-4">
            <p className="text-sm mb-2">
              <strong>Estructura de las rutas API:</strong>
            </p>
            <CodeBlock code={`app/api/
├── auth/
│   ├── [...supabase]/route.ts  # Manejo de autenticación
│   ├── register/route.ts       # Registro personalizado
│   └── login/route.ts          # Inicio de sesión personalizado
├── users/
│   ├── [id]/route.ts           # Operaciones específicas de usuario
│   └── route.ts                # Operaciones generales de usuarios
├── payments/
│   ├── webhook/route.ts        # Webhook de Stripe
│   ├── checkout/route.ts       # Creación de sesiones de pago
│   └── subscriptions/route.ts  # Gestión de suscripciones
└── ai/
    └── route.ts                # Integración con OpenAI`} />
          </div>
          <p className="mb-4">
            Cada ruta API implementa su propia lógica de negocio, validación de entrada, manejo de errores y respuestas.
            Esto permite una separación clara de responsabilidades y facilita el mantenimiento y la escalabilidad.
          </p>
          <div className="bg-muted p-4 rounded-md mb-4">
            <p className="text-sm mb-2">
              <strong>Ejemplo de una ruta API:</strong>
            </p>
            <CodeBlock code={`// app/api/users/route.ts
import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*');
      
    if (error) throw error;
    
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching users' },
      { status: 500 }
    );
  }
}`} />
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("architecture.backend.database.title")}</h2>
          <p className="mb-4">{t("architecture.backend.database.description")}</p>
          <p className="mb-4">
            NextPlate utiliza Supabase como su capa de base de datos principal, aprovechando PostgreSQL para
            almacenamiento de datos estructurados. La estructura de la base de datos está diseñada para ser
            flexible y escalable, con un enfoque en la normalización y las relaciones adecuadas entre tablas.
          </p>
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Principales tablas y relaciones:</h3>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>
                <strong>auth.users:</strong> Tabla gestionada por Supabase Auth que almacena información básica de usuarios.
              </li>
              <li>
                <strong>profiles:</strong> Extiende la información de usuarios con datos adicionales como nombre completo, avatar, etc.
              </li>
              <li>
                <strong>subscriptions:</strong> Almacena información sobre suscripciones de usuarios, vinculada a Stripe.
              </li>
              <li>
                <strong>products:</strong> Catálogo de productos o servicios ofrecidos.
              </li>
              <li>
                <strong>orders:</strong> Registro de pedidos realizados por los usuarios.
              </li>
            </ul>
          </div>
          <div className="bg-muted p-4 rounded-md mb-4">
            <p className="text-sm mb-2">
              <strong>Ejemplo de esquema de base de datos:</strong>
            </p>
            <CodeBlock code={`-- Tabla de perfiles (extensión de auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  website TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de suscripciones
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  status TEXT NOT NULL,
  price_id TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  cancel_at_period_end BOOLEAN NOT NULL,
  currency TEXT NOT NULL,
  interval TEXT NOT NULL,
  interval_count INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  ended_at TIMESTAMP WITH TIME ZONE,
  cancel_at TIMESTAMP WITH TIME ZONE,
  canceled_at TIMESTAMP WITH TIME ZONE,
  trial_start TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE
);`} />
          </div>
          <p className="mb-4">
            Supabase proporciona características avanzadas como Row Level Security (RLS) para control de acceso
            granular, funciones y triggers para lógica de negocio en la base de datos, y capacidades en tiempo real
            para actualizaciones instantáneas en el cliente.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("architecture.backend.authentication.title")}</h2>
          <p className="mb-4">{t("architecture.backend.authentication.description")}</p>
          <p className="mb-4">
            El sistema de autenticación de NextPlate está construido sobre Supabase Auth, que proporciona una
            solución completa y segura para la gestión de usuarios y sesiones. Esto incluye:
          </p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>
              <strong>Métodos de autenticación múltiples:</strong> Email/contraseña, OAuth (Google, GitHub, etc.), Magic Links.
            </li>
            <li>
              <strong>Gestión de sesiones:</strong> Manejo seguro de tokens JWT con renovación automática.
            </li>
            <li>
              <strong>Middleware de autenticación:</strong> Para proteger rutas y API endpoints.
            </li>
            <li>
              <strong>Hooks de autenticación:</strong> Para personalizar el flujo de autenticación.
            </li>
          </ul>
          <div className="bg-muted p-4 rounded-md mb-4">
            <p className="text-sm mb-2">
              <strong>Ejemplo de implementación de autenticación en el cliente:</strong>
            </p>
            <CodeBlock code={`'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSignIn = async (e) => {
    e.preventDefault();
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Error signing in:', error.message);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };

  // Resto del componente...
}`} />
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("architecture.backend.externalServices.title")}</h2>
          <p className="mb-4">{t("architecture.backend.externalServices.description")}</p>
          <p className="mb-4">
            NextPlate se integra con varios servicios externos para proporcionar funcionalidades adicionales:
          </p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>
              <strong>Stripe:</strong> Para procesamiento de pagos y gestión de suscripciones.
            </li>
            <li>
              <strong>Mailgun/SendGrid:</strong> Para envío de correos electrónicos transaccionales y de marketing.
            </li>
            <li>
              <strong>OpenAI:</strong> Para funcionalidades de inteligencia artificial y procesamiento de lenguaje natural.
            </li>
            <li>
              <strong>Cloudinary/Uploadcare:</strong> Para gestión y optimización de imágenes y archivos multimedia.
            </li>
            <li>
              <strong>Algolia:</strong> Para búsqueda avanzada y relevante.
            </li>
          </ul>
          <p className="mb-4">
            Estas integraciones se realizan a través de las rutas API de Next.js, que actúan como una capa de abstracción
            entre el cliente y los servicios externos. Esto permite cambiar o actualizar servicios con un impacto mínimo
            en el resto de la aplicación.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("architecture.backend.security.title")}</h2>
          <p className="mb-4">{t("architecture.backend.security.description")}</p>
          <p className="mb-4">
            La seguridad es una prioridad en la arquitectura del backend de NextPlate. Se implementan varias medidas
            para proteger los datos y los usuarios:
          </p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>
              <strong>Autenticación segura:</strong> Tokens JWT con rotación, protección contra ataques de fuerza bruta.
            </li>
            <li>
              <strong>Row Level Security (RLS):</strong> Control de acceso granular a nivel de fila en la base de datos.
            </li>
            <li>
              <strong>Validación de entrada:</strong> Validación estricta de todas las entradas de usuario para prevenir inyecciones.
            </li>
            <li>
              <strong>CORS:</strong> Configuración adecuada de Cross-Origin Resource Sharing.
            </li>
            <li>
              <strong>Encriptación:</strong> Datos sensibles encriptados en reposo y en tránsito.
            </li>
            <li>
              <strong>Rate Limiting:</strong> Protección contra ataques de denegación de servicio.
            </li>
            <li>
              <strong>Auditoría:</strong> Registro de actividades críticas para detección de comportamientos sospechosos.
            </li>
          </ul>
          <div className="bg-muted p-4 rounded-md mb-4">
            <p className="text-sm mb-2">
              <strong>Ejemplo de política RLS en Supabase:</strong>
            </p>
            <CodeBlock code={`-- Política RLS para la tabla profiles
-- Solo permite a los usuarios ver y editar su propio perfil
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Política para administradores
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );`} />
          </div>
        </section>

        <DocNavigation 
          locale={locale}
          prevPath="/architecture/frontend"
          prevLabel={t("sidebar.frontend")}
          nextPath="/best-practices/solid"
          nextLabel={t("sidebar.solid")}
        />
      </DocContent>
    </>
  );
}
