import { getTranslations } from "next-intl/server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";

export default async function DashboardPage() {
  const t = await getTranslations();
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return redirect("/");
  }
  
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">{t('dashboard.title')}</h1>
      <p className="text-xl mb-8">{t('dashboard.welcome')}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.stats.title')}</CardTitle>
            <CardDescription>{t('dashboard.stats.projects')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">5</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.stats.title')}</CardTitle>
            <CardDescription>{t('dashboard.stats.tasks')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">12</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.stats.title')}</CardTitle>
            <CardDescription>{t('dashboard.stats.completed')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">8</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.recentActivity.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">{t('dashboard.recentActivity.empty')}</p>
        </CardContent>
      </Card>
    </div>
  );
}