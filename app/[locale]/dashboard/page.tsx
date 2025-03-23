import { getTranslations } from "next-intl/server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import Link from "next/link";
import AdminNav from "@/components/admin/admin-nav";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function DashboardPage({
  params,
}: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "dashboard" });
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return redirect("/");
  }
  
  // Obtener el perfil del usuario para verificar si es administrador
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  
  const isAdmin = profile?.role === 'admin';
  
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">{t('title')}</h1>
      <p className="text-xl mb-8">{t('welcome')}</p>
      
      {isAdmin && <AdminNav locale={locale} />}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card>
          <CardHeader>
            <CardTitle>{t('stats.title')}</CardTitle>
            <CardDescription>{t('stats.projects')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">5</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('stats.title')}</CardTitle>
            <CardDescription>{t('stats.tasks')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">12</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('stats.title')}</CardTitle>
            <CardDescription>{t('stats.completed')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">8</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <Card>
          <CardHeader>
            <CardTitle>{t('recentActivity.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">{t('recentActivity.empty')}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('subscription.title')}</CardTitle>
            <CardDescription>{t('subscription.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 mb-4">{t('subscription.message')}</p>
            <Link 
              href={`/${locale}/dashboard/subscription`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {t('subscription.manage')}
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}