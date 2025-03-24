'use client';

import { useTranslations } from 'next-intl';
import { ContactForm } from '@/components/contact-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Mail, MapPin, Phone } from 'lucide-react';
//import { useParams } from 'next/navigation';

export default function ContactPage() {
  //const params = useParams();
  //const locale = params.locale as string;
  const t = useTranslations('contact.page');
  
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">{t('title')}</h1>
      <p className="text-lg text-muted-foreground mb-10">{t('description')}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Formulario de contacto */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('form.title')}</CardTitle>
              <CardDescription>{t('form.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ContactForm mode="inline" />
            </CardContent>
          </Card>
        </div>
        
        {/* Información adicional */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('info.title')}</CardTitle>
              <CardDescription>{t('info.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="font-medium">{t('info.company.label')}</h3>
                  <p className="text-sm text-muted-foreground">{t('info.company.value')}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="font-medium">{t('info.email.label')}</h3>
                  <p className="text-sm text-muted-foreground">{t('info.email.value')}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="font-medium">{t('info.phone.label')}</h3>
                  <p className="text-sm text-muted-foreground">{t('info.phone.value')}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="font-medium">{t('info.address.label')}</h3>
                  <p className="text-sm text-muted-foreground">{t('info.address.value')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>{t('hours.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">{t('hours.weekdays.label')}</span>
                <span className="text-sm font-medium">{t('hours.weekdays.value')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">{t('hours.weekends.label')}</span>
                <span className="text-sm font-medium">{t('hours.weekends.value')}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 