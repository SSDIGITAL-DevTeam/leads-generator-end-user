"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  action,
  children
}: ModalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = original;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!mounted) return null;

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ease-in-out",
        isOpen ? "opacity-100" : "pointer-events-none opacity-0"
      )}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className={cn(
          "relative w-full max-w-md translate-y-0 rounded-2xl bg-white p-8 shadow-xl transition-all duration-300 ease-in-out",
          isOpen ? "opacity-100" : "translate-y-4 opacity-0"
        )}
      >
        <div className="mb-4">
          <h2
            id="modal-title"
            className="text-2xl font-semibold text-slate-900"
          >
            {title}
          </h2>
          {description && (
            <p className="mt-2 text-base text-slate-600">{description}</p>
          )}
        </div>
        <div className="space-y-4 text-base text-slate-700">{children}</div>
        {action && <div className="mt-6 flex justify-end">{action}</div>}
      </div>
    </div>,
    document.body
  );
};
