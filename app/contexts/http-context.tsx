"use client";

import { Selection } from "@nextui-org/react";
import axios, { AxiosInstance } from "axios";
import { ReactNode, createContext, useContext, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { useAlertContext } from "./alert-context";
import { useRouter } from "next/navigation";
import { HttpClient, handle_error } from "../http/client";
import { ReactQueryProvider } from "./react-query-provider";

interface HttpContext {
  axiosClient: AxiosInstance;
  httpClient: HttpClient;
}

interface ProviderProps {
  children: ReactNode;
}

export const HttpContext = createContext<HttpContext | undefined>(undefined);

export function useHttpContext() {
  const context = useContext(HttpContext);

  if (context === undefined) {
    throw new Error("Define log provider in parent node");
  }

  return context;
}

export function HttpProvider({ children }: ProviderProps) {
  const alertContext = useAlertContext();

  const router = useRouter();

  const axiosClient = axios.create({
    withCredentials: true,
    baseURL: "/api",
  });

  const httpClient = new HttpClient(axiosClient);

  axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
      handle_error(error, alertContext.toast, router);
      return Promise.reject(error);
    }
  );

  return (
    <ReactQueryProvider>
      <HttpContext.Provider
        value={{
          axiosClient: axiosClient,
          httpClient : httpClient
        }}
      >
        {children}
      </HttpContext.Provider>
    </ReactQueryProvider>
  );
}
