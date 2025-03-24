"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

interface DocMobileNavProps {
  locale: string;
}

const MoreIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
      />
    </svg>
  );
};

export default function DocMobileNav({ locale }: DocMobileNavProps) {
  const t = useTranslations("docs");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Determinar la sección actual basada en la URL
  const currentSection = pathname.split(`/${locale}/docs/`)[1]?.split("/")[0] || "";
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

  // Inicializar las categorías expandidas incluyendo la sección actual
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(() => {
    const expanded: Record<string, boolean> = {
      gettingStarted: true,
    };

    if (currentSection) {
      // Expandir la categoría actual
      for (const category of categories) {
        const categoryPath = category.links[0].href.split("/")[1];
        if (currentSection.startsWith(categoryPath)) {
          expanded[category.id] = true;
          break;
        }
      }
    }

    return expanded;
  });

  // Actualizar categorías expandidas cuando cambia la ruta
  useEffect(() => {
    if (pathname && currentSection) {
      setExpandedCategories(prev => {
        const newExpanded = { ...prev };
        
        for (const category of categories) {
          const categoryPath = category.links[0].href.split("/")[1];
          if (currentSection.startsWith(categoryPath) && !prev[category.id]) {
            newExpanded[category.id] = true;
          }
        }

        return newExpanded;
      });
    }
  }, [pathname, currentSection, categories]);

  const isActive = (path: string) => {
    return pathname === `/${locale}/docs${path}`;
  };

  const isInSection = (sectionPath: string) => {
    return pathname.startsWith(`/${locale}/docs${sectionPath}`);
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // Encontrar la categoría y enlace activo para mostrar en el botón
  const getCurrentPageInfo = () => {
    for (const category of categories) {
      for (const link of category.links) {
        if (isActive(link.href)) {
          return {
            category: t(`sidebar.${category.id}`),
            page: link.label,
          };
        }
      }
    }
    return null;
  };

  const currentPageInfo = getCurrentPageInfo();

  return (
    <div className="md:hidden">
      <div className="flex items-center gap-2">
        {/* Botón de inicio para volver a la página principal de docs */}
        <Link href={`/${locale}/docs`} className="hidden items-center">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-9 w-9 rounded-full",
              pathname === `/${locale}/docs` ? "bg-primary/10" : ""
            )}
          >
            <Home className="h-5 w-5" />
            <span className="sr-only">{t("home.title")}</span>
          </Button>
        </Link>

        {/* Menú principal */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className=""
            >
              <div className="hidden truncate max-w-[120px]">
                {currentPageInfo ? (
                  <span className="text-sm truncate">{currentPageInfo.page}</span>
                ) : (
                  <span className="text-sm">{t("sidebar.menu")}</span>
                )}
              </div>
              <span className="h-4 w-4 shrink-0 mr-2 mb-1">
                <MoreIcon />
              </span>
              
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[85%] max-w-[320px] sm:max-w-sm p-0 overflow-auto">
            <SheetHeader className="px-4 py-4 border-b sticky top-0 bg-background z-10">
              <SheetTitle className="text-left">{t("home.title")}</SheetTitle>
              <SheetDescription className="text-left">
                {t("sidebar.navigationDescription", {
                  defaultValue: "Navega por la documentación",
                })}
              </SheetDescription>
            </SheetHeader>

            <div className="overflow-y-auto p-4">
              {/* Enlace a la página principal de documentación */}
              <div className="mb-4">
                <SheetClose asChild>
                  <Link
                    href={`/${locale}/docs`}
                    className={cn(
                      "flex items-center py-2 px-3 rounded-md",
                      pathname === `/${locale}/docs`
                        ? "bg-primary/10 font-medium"
                        : "hover:bg-muted"
                    )}
                  >
                    <Home className="h-4 w-4 mr-2" />
                    <span>{t("home.title")}</span>
                  </Link>
                </SheetClose>
              </div>

              <div className="space-y-3">
                {categories.map(category => {
                  const isExpanded = expandedCategories[category.id];
                  const isCategoryActive = category.links.some(link => isActive(link.href));
                  const isCategoryInPath = category.links.some(link => isInSection(link.href));
                  const categoryPath = category.links[0].href.split("/")[1];
                  const isCurrentCategory = currentSection.startsWith(categoryPath);

                  return (
                    <div key={category.id} className="space-y-2">
                      <button
                        className={cn(
                          "flex items-center w-full justify-between px-3 py-2 text-sm font-medium rounded-md",
                          isCategoryActive || isCategoryInPath
                            ? "bg-primary/10 text-foreground"
                            : "text-foreground hover:bg-muted transition-colors"
                        )}
                        onClick={() => toggleCategory(category.id)}
                      >
                        <span>{category.title}</span>
                        {isCurrentCategory && (
                          <Badge variant="secondary" className="mr-2 px-1.5 text-xs">
                            {t("sidebar.current")}
                          </Badge>
                        )}
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 shrink-0" />
                        ) : (
                          <ChevronRight className="h-4 w-4 shrink-0" />
                        )}
                      </button>

                      {isExpanded && (
                        <ul className="space-y-1 ml-4 pl-2 border-l">
                          {category.links.map((link, j) => {
                            const isLinkActive = isActive(link.href);

                            return (
                              <li key={j}>
                                <SheetClose asChild>
                                  <Link
                                    href={`/${locale}/docs${link.href}`}
                                    className={cn(
                                      "block text-sm py-1.5 px-3 rounded-md",
                                      isLinkActive
                                        ? "bg-primary/10 font-medium"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                                    )}
                                  >
                                    {link.label}
                                  </Link>
                                </SheetClose>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
