"use client";

import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangleIcon } from "lucide-react";
import { useTranslations } from "next-intl";

interface EnvVarWarningProps {
  envVars?: string[];
  showTitle?: boolean;
}

export default function EnvVarWarning({ 
  envVars = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'STRIPE_SECRET_KEY', 'OPENAI_API_KEY'], 
  showTitle = true 
}: EnvVarWarningProps) {
  const [missingVars, setMissingVars] = useState<string[]>([]);
  const t = useTranslations('common');

  useEffect(() => {
    // Verificar si las variables de entorno están configuradas
    const missing = envVars.filter(
      (envVar) => 
        envVar.startsWith('NEXT_PUBLIC_') && 
        !process.env[envVar]
    );
    
    setMissingVars(missing);
  }, [envVars]);

  if (missingVars.length === 0) {
    return null;
  }

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangleIcon className="h-4 w-4" />
      {showTitle && <AlertTitle>{t('error.envVarTitle')}</AlertTitle>}
      <AlertDescription>
        {t('error.envVarDescription')}
        <ul className="list-disc pl-5 mt-2">
          {missingVars.map((envVar) => (
            <li key={envVar}>{envVar}</li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}
