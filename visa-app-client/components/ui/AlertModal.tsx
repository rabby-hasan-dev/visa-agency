"use client";

import React from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { CheckCircle, AlertCircle, Info, XCircle } from "lucide-react";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  buttonLabel?: string;
  type?: "success" | "error" | "info" | "warning";
}

export const AlertModal = ({
  isOpen,
  onClose,
  title,
  message,
  buttonLabel = "Done",
  type = "info",
}: AlertModalProps) => {
  const icons = {
    success: <CheckCircle className="text-green-500" size={32} />,
    error: <XCircle className="text-red-500" size={32} />,
    info: <Info className="text-blue-500" size={32} />,
    warning: <AlertCircle className="text-yellow-500" size={32} />,
  };

  const defaultTitles = {
    success: "Success",
    error: "Error",
    info: "Information",
    warning: "Warning",
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="sm"
      showCloseButton={true}
    >
      <div className="text-center py-4">
        <div className="flex justify-center mb-4">{icons[type]}</div>
        <h3 className="text-xl font-bold text-[#00264d] mb-2 m-0">
          {title || defaultTitles[type]}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed max-w-xs mx-auto m-0">
          {message}
        </p>
        <div className="mt-8">
          <Button variant="primary" onClick={onClose} className="min-w-0 sm:min-w-[120px]" fullWidth>
            {buttonLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
