'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCardIcon, UsersIcon, SettingsIcon, RefreshCwIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface AdminNavProps {
  locale: string;
}

export default function AdminNav({ locale }: AdminNavProps) {
  const pathname = usePathname();
  const t = useTranslations('admin');
  
  const navItems = [
    {
      title: t('navigation.stripe'),
      href: `/${locale}/admin/stripe`,
      icon: <CreditCardIcon className="h-4 w-4 mr-2" />
    },
    {
      title: t('navigation.users'),
      href: `/${locale}/admin/users`,
      icon: <UsersIcon className="h-4 w-4 mr-2" />
    },
    {
      title: t('navigation.settings'),
      href: `/${locale}/admin/settings`,
      icon: <SettingsIcon className="h-4 w-4 mr-2" />
    }
  ];
  
  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-1">
          <h3 className="text-sm font-medium mb-2">{t('title')}</h3>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center text-sm px-3 py-2 rounded-md hover:bg-gray-100 transition-colors",
                pathname === item.href ? "bg-gray-100 font-medium" : "text-gray-700"
              )}
            >
              {item.icon}
              {item.title}
              {item.title === t('navigation.stripe') && (
                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs text-blue-600">
                  <RefreshCwIcon className="h-3 w-3" />
                </span>
              )}
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 