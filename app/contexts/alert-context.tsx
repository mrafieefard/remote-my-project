"use client";

import { Selection } from "@nextui-org/react";
import { ReactNode, createContext, useContext, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { useModal, ModalBase } from "../modal/modal-base";
import toast, { Toaster } from "react-hot-toast";

interface AlertContext {
  modal: ReturnType<typeof useModal>;
  toast: typeof toast;
}

interface ProviderProps {
  children: ReactNode;
}

export const AlertContext = createContext<AlertContext | undefined>(undefined);

export function useAlertContext() {
  const context = useContext(AlertContext);

  if (context === undefined) {
    throw new Error("Define log provider in parent node");
  }

  return context;
}

export function AlertProvider({ children }: ProviderProps) {
  const modal = useModal();

  return (
    <AlertContext.Provider
      value={{
        modal: modal,
        toast: toast,
      }}
    >
      <ModalBase modal={modal} />
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            border: "10px",
            background: "#27272A",
            color: "#fff",
          },
        }}
      />
      {children}
    </AlertContext.Provider>
  );
}
