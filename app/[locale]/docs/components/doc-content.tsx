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
    <div className="max-w-3xl mx-auto">
      <div className="space-y-2 mb-8">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-xl text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="prose prose-slate dark:prose-invert max-w-none">
        {children}
      </div>
    </div>
  );
}
