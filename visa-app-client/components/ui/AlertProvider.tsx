"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { AlertModal } from "./AlertModal";
import { ConfirmModal } from "./ConfirmModal";
import { PromptModal } from "./PromptModal";

interface AlertOptions {
  title?: string;
  message: string;
  buttonLabel?: string;
  type?: "success" | "error" | "info" | "warning";
}

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: "info" | "warning" | "danger" | "question";
}

interface PromptOptions {
  title?: string;
  message: string;
  placeholder?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  defaultValue?: string;
}

interface AlertContextType {
  showAlert: (options: AlertOptions) => void;
  showConfirm: (options: ConfirmOptions) => Promise<boolean>;
  showPrompt: (options: PromptOptions) => Promise<string | null>;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alertState, setAlertState] = useState<{
    isOpen: boolean;
    options: AlertOptions;
  }>({
    isOpen: false,
    options: { message: "" },
  });

  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    options: ConfirmOptions;
    resolve: (value: boolean) => void;
  } | null>(null);

  const [promptState, setPromptState] = useState<{
    isOpen: boolean;
    options: PromptOptions;
    resolve: (value: string | null) => void;
  } | null>(null);

  const showAlert = useCallback((options: AlertOptions) => {
    setAlertState({
      isOpen: true,
      options,
    });
  }, []);

  const closeAlert = useCallback(() => {
    setAlertState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const showConfirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setConfirmState({
        isOpen: true,
        options,
        resolve,
      });
    });
  }, []);

  const handleConfirm = useCallback(
    (value: boolean) => {
      if (confirmState) {
        confirmState.resolve(value);
        setConfirmState(null);
      }
    },
    [confirmState],
  );

  const showPrompt = useCallback((options: PromptOptions) => {
    return new Promise<string | null>((resolve) => {
      setPromptState({
        isOpen: true,
        options,
        resolve,
      });
    });
  }, []);

  const handlePrompt = useCallback(
    (value: string | null) => {
      if (promptState) {
        promptState.resolve(value);
        setPromptState(null);
      }
    },
    [promptState],
  );

  return (
    <AlertContext.Provider value={{ showAlert, showConfirm, showPrompt }}>
      {children}

      {/* Alert Modal Instance */}
      <AlertModal
        isOpen={alertState.isOpen}
        onClose={closeAlert}
        title={alertState.options.title}
        message={alertState.options.message}
        buttonLabel={alertState.options.buttonLabel}
        type={alertState.options.type}
      />

      {/* Confirm Modal Instance */}
      {confirmState && (
        <ConfirmModal
          isOpen={confirmState.isOpen}
          onClose={() => handleConfirm(false)}
          onConfirm={() => handleConfirm(true)}
          title={confirmState.options.title}
          message={confirmState.options.message}
          confirmLabel={confirmState.options.confirmLabel}
          cancelLabel={confirmState.options.cancelLabel}
          type={confirmState.options.type}
        />
      )}

      {/* Prompt Modal Instance */}
      {promptState && (
        <PromptModal
          key={promptState.isOpen ? "open" : "closed"}
          isOpen={promptState.isOpen}
          onClose={() => handlePrompt(null)}
          onConfirm={(val) => handlePrompt(val)}
          title={promptState.options.title}
          message={promptState.options.message}
          placeholder={promptState.options.placeholder}
          confirmLabel={promptState.options.confirmLabel}
          cancelLabel={promptState.options.cancelLabel}
          defaultValue={promptState.options.defaultValue}
        />
      )}
    </AlertContext.Provider>
  );
};
