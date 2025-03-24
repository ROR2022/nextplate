"use client";

import { useState } from "react";
import { useTranslations } from 'next-intl';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlertCircle, Loader2, Send, Check } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type ContactFormProps = {
  /**
   * Modo de visualización del formulario
   * - "inline": Mostrar el formulario directamente (página de contacto)
   * - "dialog": Mostrar el formulario en un diálogo (desde el footer)
   */
  mode?: "inline" | "dialog";
  /**
   * Etiqueta del botón para abrir el diálogo
   * Solo se usa en modo "dialog"
   */
  buttonLabel?: string;
}

/**
 * Componente para mostrar un formulario de contacto.
 * Puede mostrarse directamente en una página o en un diálogo modal.
 * Utiliza next-intl para las traducciones.
 * Implementa el principio de Responsabilidad Única al encargarse únicamente de la funcionalidad de contacto.
 */
export function ContactForm({ mode = "dialog", buttonLabel }: ContactFormProps) {
  // Obtener las traducciones usando next-intl
  const t = useTranslations('contact');
  
  // Estados para controlar el formulario
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState<{
    status: "idle" | "success" | "error";
    message: string;
  }>({
    status: "idle",
    message: ""
  });

  // Manejar cambios en los campos del formulario
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormState({ status: "idle", message: "" });

    try {
      // Aquí realizarías la llamada a tu API para enviar el formulario
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t('error.default'));
      }

      // Éxito
      setFormState({
        status: "success",
        message: t('success')
      });
      
      // Resetear el formulario después de un envío exitoso
      setTimeout(() => {
        if (formState.status === "success") {
          setFormData({ name: "", email: "", message: "" });
          if (mode === "dialog") {
            setIsOpen(false);
          }
          setFormState({ status: "idle", message: "" });
        }
      }, 3000);
      
    } catch (error) {
      // Error
      setFormState({
        status: "error",
        message: error instanceof Error 
          ? error.message 
          : t('error.default')
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Contenido del formulario
  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">{t('form.name.label')}</Label>
        <Input
          id="name"
          name="name"
          placeholder={t('form.name.placeholder')}
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">{t('form.email.label')}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder={t('form.email.placeholder')}
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">{t('form.message.label')}</Label>
        <Textarea
          id="message"
          name="message"
          placeholder={t('form.message.placeholder')}
          rows={4}
          value={formData.message}
          onChange={handleChange}
          required
        />
      </div>
      
      {formState.status === "error" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {formState.message}
          </AlertDescription>
        </Alert>
      )}
      
      {formState.status === "success" && (
        <Alert className="bg-green-50 text-green-800 border-green-200">
          <Check className="h-4 w-4" />
          <AlertDescription>
            {formState.message}
          </AlertDescription>
        </Alert>
      )}
      
      <div className={mode === "dialog" ? "" : "flex justify-end"}>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('form.submitting')}
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              {t('form.submit')}
            </>
          )}
        </Button>
      </div>
    </form>
  );

  // Decidir qué renderizar según el modo
  if (mode === "inline") {
    return formContent;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {buttonLabel || t('button')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>
            {t('description')}
          </DialogDescription>
        </DialogHeader>
        <div className="pt-4">
          {formContent}
        </div>
      </DialogContent>
    </Dialog>
  );
} 