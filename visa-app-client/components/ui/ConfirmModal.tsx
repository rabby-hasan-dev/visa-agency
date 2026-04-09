"use client";

import React from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { AlertTriangle, Info, HelpCircle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: "info" | "warning" | "danger" | "question";
  isLoading?: boolean;
}

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmation",
  message,
  confirmLabel = "Yes",
  cancelLabel = "No",
  type = "question",
  isLoading = false,
}: ConfirmModalProps) => {
  const icons = {
    info: <Info className="text-blue-500" size={24} />,
    warning: <AlertTriangle className="text-yellow-500" size={24} />,
    danger: <AlertTriangle className="text-red-500" size={24} />,
    question: <HelpCircle className="text-[#2150a0]" size={24} />,
  };

  const confirmVariants = {
    info: "primary" as const,
    warning: "primary" as const,
    danger: "danger" as const,
    question: "primary" as const,
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm">
      <div className="flex items-start gap-4">
        <div className="shrink-0 mt-0.5">{icons[type]}</div>
        <div className="flex-1">
          <p className="text-sm text-gray-600 leading-relaxed m-0">{message}</p>
        </div>
      </div>
      <div className="mt-8 flex flex-col sm:flex-row justify-end gap-2.5 pt-4 border-t border-gray-100">
        <Button variant="secondary" onClick={onClose} disabled={isLoading} fullWidth className="sm:w-auto">
          {cancelLabel}
        </Button>
        <Button
          variant={confirmVariants[type]}
          onClick={onConfirm}
          isLoading={isLoading}
          fullWidth
          className="sm:w-auto"
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
};
