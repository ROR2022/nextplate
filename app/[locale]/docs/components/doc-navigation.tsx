"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DocNavigationProps {
  locale: string;
  prevPath?: string;
  prevLabel?: string;
  nextPath?: string;
  nextLabel?: string;
}

export default function DocNavigation({
  locale,
  prevPath,
  prevLabel,
  nextPath,
  nextLabel,
}: DocNavigationProps) {
  const t = useTranslations("docs");

  return (
    <div className="flex justify-between items-center mt-12 pt-6 border-t overflow-x-auto">
      <div>
        {prevPath && (
          <Button variant="ghost" asChild>
            <Link href={`/${locale}/docs${prevPath}`} className="flex items-center">
              <ChevronLeft className="mr-2 h-4 w-4" />
              <span className="flex flex-col items-start">
                <span className="text-xs text-muted-foreground">{t("navigation.previous")}</span>
                <span>{prevLabel}</span>
              </span>
            </Link>
          </Button>
        )}
      </div>
      <div>
        {nextPath && (
          <Button variant="ghost" asChild>
            <Link href={`/${locale}/docs${nextPath}`} className="flex items-center">
              <span className="flex flex-col items-end">
                <span className="text-xs text-muted-foreground">{t("navigation.next")}</span>
                <span>{nextLabel}</span>
              </span>
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
