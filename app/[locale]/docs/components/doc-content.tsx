"use client";

import { ReactNode } from "react";

interface DocContentProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export default function DocContent({
  title,
  description,
  children,
}: DocContentProps) {
  return (
    <div className="w-full" style={{maxWidth: '80vw !important'}}>
      <div className="space-y-2 mb-6 md:mb-8">
        <h1 className="scroll-m-20 text-3xl md:text-4xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-lg md:text-xl text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:scroll-m-20 prose-headings:font-bold prose-p:text-base prose-img:rounded-md prose-pre:overflow-x-auto">
        {children}
      </div>
    </div>
  );
}
