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

function useMedia(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(()=>{
    setMatches(window.matchMedia(query).matches)
  },[])

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addListener(listener);
    return () => media.removeListener(listener);
  }, [query, matches]);

  return matches;
}

export function AlertProvider({ children }: ProviderProps) {
  const modal = useModal();
  const small = useMedia("(max-width: 640px)");
  
  return (
    <AlertContext.Provider
      value={{
        modal: modal,
        toast: toast,
      }}
    >
      <ModalBase modal={modal} />
      <Toaster
        position={small ? "top-center" : "bottom-right"}
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
