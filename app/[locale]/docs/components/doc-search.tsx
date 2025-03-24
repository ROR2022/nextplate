"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

// Estructura para los documentos que se utilizarán en la búsqueda
interface DocItem {
  title: string;
  path: string;
  section: string;
}

// Datos de ejemplo para la documentación - en producción se cargarían desde un JSON o API
const docItems: DocItem[] = [
  { title: "Introducción", path: "", section: "getting-started" },
  { title: "Instalación", path: "/installation", section: "getting-started" },
  { title: "Inicio Rápido", path: "/quick-start", section: "getting-started" },
  { title: "Resumen", path: "", section: "architecture" },
  { title: "Frontend", path: "/frontend", section: "architecture" },
  { title: "Backend", path: "/backend", section: "architecture" },
  { title: "SOLID", path: "", section: "best-practices" },
  { title: "Código Limpio", path: "/clean-code", section: "best-practices" },
  { title: "Patrones", path: "/patterns", section: "best-practices" },
  { title: "Supabase", path: "", section: "configuration" },
  { title: "Mailgun", path: "/mailgun", section: "configuration" },
  { title: "Stripe", path: "/stripe", section: "configuration" },
  { title: "OpenAI", path: "/openai", section: "configuration" },
  { title: "Flujo de Trabajo", path: "", section: "development" },
  { title: "Fases", path: "/phases", section: "development" },
];

interface DocSearchProps {
  locale: string;
}

export default function DocSearch({ locale }: DocSearchProps) {
  const t = useTranslations("docs.search");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const initialQuery = searchParams.get("query") || "";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<DocItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Sincronizar el query con el searchParam cuando cambia la URL
  useEffect(() => {
    setQuery(searchParams.get("query") || "");
  }, [searchParams]);

  // Cerrar la lista de resultados cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current && 
        !resultsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Buscar en los documentos cuando cambia el query con debounce
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
    
    // Buscar coincidencias en los documentos
    if (term.trim() === "") {
      setResults([]);
      setHasSearched(false);
      setIsOpen(false);
      return;
    }

    setHasSearched(true);

    const filtered = docItems.filter((item) => {
      const lowerTerm = term.toLowerCase();
      return (
        item.title.toLowerCase().includes(lowerTerm) ||
        item.section.toLowerCase().includes(lowerTerm)
      );
    });

    setResults(filtered);
    setIsOpen(true);
  }, 300);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    handleSearch(newQuery);
  };

  const handleClear = () => {
    setQuery("");
    handleSearch("");
    setIsOpen(false);
    setHasSearched(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={t("placeholder")}
          className="pl-10 pr-10"
          value={query}
          onChange={handleChange}
          onFocus={() => query.trim() !== "" && setIsOpen(true)}
          onKeyDown={handleKeyDown}
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label={t("clear")}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && (hasSearched || results.length > 0) && (
        <div
          ref={resultsRef}
          className="absolute top-full z-50 mt-1 w-full rounded-md border bg-background shadow-lg"
        >
          <div className="p-2">
            {results.length > 0 ? (
              <>
                <p className="text-xs text-muted-foreground px-2 py-1.5">
                  {results.length} {results.length === 1 ? t("result") : t("results")}
                </p>
                <div className="max-h-[300px] overflow-y-auto">
                  {results.map((item, index) => (
                    <Link
                      key={index}
                      href={`/${locale}/docs/${item.section}${item.path}`}
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2 text-sm hover:bg-muted rounded-md"
                    >
                      <span className="font-medium">{item.title}</span>
                      <span className="text-xs text-muted-foreground ml-2">{t(`sections.${item.section}`)}</span>
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground py-3 px-3 text-center">
                {t("noResults")}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 