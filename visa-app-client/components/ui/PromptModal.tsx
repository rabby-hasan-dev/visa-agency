"use client";

import React, { useState } from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { HelpCircle } from "lucide-react";

interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (value: string) => void;
  title?: string;
  message: string;
  placeholder?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  defaultValue?: string;
  isLoading?: boolean;
}

export const PromptModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Input Required",
  message,
  placeholder = "Enter text here...",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  defaultValue = "",
  isLoading = false,
}: PromptModalProps) => {
  const [value, setValue] = useState(defaultValue);

  const handleConfirm = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (value.trim()) {
      onConfirm(value);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm">
      <form onSubmit={handleConfirm} className="flex flex-col gap-4">
        <div className="flex items-start gap-4">
          <div className="shrink-0 mt-0.5">
            <HelpCircle className="text-[#2150a0]" size={24} />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-700 font-medium m-0">{message}</p>
          </div>
        </div>
        <div>
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            disabled={isLoading}
            className="w-full h-32 p-3 text-sm border border-gray-300 rounded focus:border-[#2150a0] focus:ring-1 focus:ring-[#2150a0] outline-none transition-all resize-none block placeholder-gray-500 placeholder:text-gray-500 text-gray-900"
            autoFocus
          />
        </div>
        <div className="mt-4 flex flex-col sm:flex-row justify-end gap-2.5 pt-4 border-t border-gray-100">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading} fullWidth className="sm:w-auto">
            {cancelLabel}
          </Button>
          <Button 
            type="submit"
            variant="primary" 
            disabled={!value.trim() || isLoading}
            isLoading={isLoading}
            fullWidth
            className="sm:w-auto"
          >
            {confirmLabel}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
