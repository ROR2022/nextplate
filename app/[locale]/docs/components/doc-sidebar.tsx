"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

interface DocSidebarProps {
  locale: string;
}

export default function DocSidebar({ locale }: DocSidebarProps) {
  const t = useTranslations("docs");
  const pathname = usePathname();
  
  // Estado para controlar qué categorías están expandidas
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    "gettingStarted": true,
    "architecture": true,
    "bestPractices": true,
    "configuration": true,
    "development": true,
    "api": true,
    "components": true,
  });

  const isActive = (path: string) => {
    return pathname === `/${locale}/docs${path}`;
  };

  const isInSection = (sectionPath: string) => {
    return pathname.startsWith(`/${locale}/docs${sectionPath}`);
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const categories = [
    {
      id: "gettingStarted",
      title: t("sidebar.gettingStarted"),
      links: [
        { href: "/getting-started", label: t("sidebar.introduction") },
        { href: "/getting-started/installation", label: t("sidebar.installation") },
        { href: "/getting-started/quick-start", label: t("sidebar.quickStart") },
      ],
    },
    {
      id: "architecture",
      title: t("sidebar.architecture"),
      links: [
        { href: "/architecture", label: t("sidebar.overview") },
        { href: "/architecture/frontend", label: t("sidebar.frontend") },
        { href: "/architecture/backend", label: t("sidebar.backend") },
        { href: "/architecture/database", label: t("sidebar.database") },
      ],
    },
    {
      id: "bestPractices",
      title: t("sidebar.bestPractices"),
      links: [
        { href: "/best-practices", label: t("sidebar.solid") },
        { href: "/best-practices/clean-code", label: t("sidebar.cleanCode") },
        { href: "/best-practices/patterns", label: t("sidebar.patterns") },
      ],
    },
    {
      id: "configuration",
      title: t("sidebar.configuration"),
      links: [
        { href: "/configuration", label: t("sidebar.supabase") },
        { href: "/configuration/mailgun", label: t("sidebar.mailgun") },
        { href: "/configuration/stripe", label: t("sidebar.stripe") },
        { href: "/configuration/openai", label: t("sidebar.openai") },
      ],
    },
    {
      id: "development",
      title: t("sidebar.development"),
      links: [
        { href: "/development", label: t("sidebar.workflow") },
        { href: "/development/phases", label: t("sidebar.phases") },
        { href: "/development/testing", label: t("sidebar.testing") },
        { href: "/development/deployment", label: t("sidebar.deployment") },
        { href: "/development/i18n", label: t("sidebar.i18n") },
      ],
    },
    {
      id: "api",
      title: t("sidebar.api"),
      links: [
        { href: "/api", label: t("sidebar.overview") },
        { href: "/api/auth", label: t("sidebar.auth") },
        { href: "/api/users", label: t("sidebar.users") },
        { href: "/api/payments", label: t("sidebar.payments") },
        { href: "/api/webhooks", label: t("sidebar.webhooks") },
      ],
    },
    {
      id: "components",
      title: t("sidebar.components"),
      links: [
        { href: "/components", label: t("sidebar.ui") },
        { href: "/components/layout", label: t("sidebar.layout") },
        { href: "/components/forms", label: t("sidebar.forms") },
        { href: "/components/data", label: t("sidebar.data") },
      ],
    },
  ];

  return (
    <div className="w-64 pr-8 flex-shrink-0 hidden md:block">
      <div className="sticky top-20">
        <div className="space-y-6">
          {categories.map((category) => {
            const isExpanded = expandedCategories[category.id];
            const isCategoryActive = category.links.some(link => isActive(link.href));
            const isCategoryInPath = category.links.some(link => isInSection(link.href));
            
            return (
              <div key={category.id} className="space-y-2">
                <button 
                  className={cn(
                    "flex items-center w-full justify-between text-sm font-medium",
                    (isCategoryActive || isCategoryInPath) ? "text-foreground" : "text-muted-foreground hover:text-foreground transition-colors"
                  )}
                  onClick={() => toggleCategory(category.id)}
                >
                  <span>{category.title}</span>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
                
                {isExpanded && (
                  <ul className="space-y-1 ml-2 border-l pl-4 border-border">
                    {category.links.map((link, j) => (
                      <li key={j}>
                        <Link
                          href={`/${locale}/docs${link.href}`}
                          className={cn(
                            "block text-sm py-1 text-muted-foreground hover:text-foreground transition-colors",
                            isActive(link.href) ? "text-foreground font-medium" : "",
                            isInSection(link.href) && !isActive(link.href) ? "text-foreground" : ""
                          )}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
