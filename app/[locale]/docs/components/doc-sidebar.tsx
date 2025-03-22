"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface DocSidebarProps {
  locale: string;
}

export default function DocSidebar({ locale }: DocSidebarProps) {
  const t = useTranslations("docs");
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === `/${locale}/docs${path}`;
  };

  const categories = [
    {
      title: t("sidebar.gettingStarted"),
      links: [
        { href: "/getting-started", label: t("sidebar.introduction") },
        { href: "/getting-started/installation", label: t("sidebar.installation") },
        { href: "/getting-started/quick-start", label: t("sidebar.quickStart") },
      ],
    },
    {
      title: t("sidebar.architecture"),
      links: [
        { href: "/architecture", label: t("sidebar.overview") },
        { href: "/architecture/frontend", label: t("sidebar.frontend") },
        { href: "/architecture/backend", label: t("sidebar.backend") },
      ],
    },
    {
      title: t("sidebar.bestPractices"),
      links: [
        { href: "/best-practices", label: t("sidebar.solid") },
        { href: "/best-practices/clean-code", label: t("sidebar.cleanCode") },
        { href: "/best-practices/patterns", label: t("sidebar.patterns") },
      ],
    },
    {
      title: t("sidebar.configuration"),
      links: [
        { href: "/configuration", label: t("sidebar.supabase") },
        { href: "/configuration/mailgun", label: t("sidebar.mailgun") },
        { href: "/configuration/stripe", label: t("sidebar.stripe") },
        { href: "/configuration/openai", label: t("sidebar.openai") },
      ],
    },
    {
      title: t("sidebar.development"),
      links: [
        { href: "/development", label: t("sidebar.workflow") },
        { href: "/development/phases", label: t("sidebar.phases") },
      ],
    },
  ];

  return (
    <div className="w-64 pr-8 flex-shrink-0 hidden md:block">
      <div className="sticky top-20">
        <div className="space-y-6">
          {categories.map((category, i) => (
            <div key={i} className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">
                {category.title}
              </h4>
              <ul className="space-y-1">
                {category.links.map((link, j) => (
                  <li key={j}>
                    <Link
                      href={`/${locale}/docs${link.href}`}
                      className={cn(
                        "block text-sm py-1 text-muted-foreground hover:text-foreground transition-colors",
                        isActive(link.href) && "text-foreground font-medium"
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
