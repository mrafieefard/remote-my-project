"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useModal, ModalBase } from "../modal/modal-base";
import toast, { Toaster } from "react-hot-toast";

interface ModalContext {
  modal: ReturnType<typeof useModal>;
}

interface ProviderProps {
  children: ReactNode;
}

export const ModalContext = createContext<ModalContext | undefined>(undefined);

export function useModalContext() {
  const context = useContext(ModalContext);

  if (context === undefined) {
    throw new Error("Define modal provider in parent node");
  }

  return context;
}

export function ModalProvider({ children }: ProviderProps) {
  const modal = useModal();
  
  return (
    <ModalContext.Provider
      value={{
        modal: modal,
      }}
    >
      <ModalBase modal={modal} />

      {children}
    </ModalContext.Provider>
  );
}
