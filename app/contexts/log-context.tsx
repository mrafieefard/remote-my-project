"use client";

import { Selection } from "@nextui-org/react";
import { ReactNode, createContext, useContext, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

interface ProjectFilter {
  value: Selection;
  set: React.Dispatch<React.SetStateAction<Selection>>;
}

interface LevelFilter {
  value: Selection;
  set: React.Dispatch<React.SetStateAction<Selection>>;
}

interface SearchFilter {
  value: string;
  set: React.Dispatch<React.SetStateAction<string>>;
}


interface Filters {
  project: ProjectFilter;
  level: LevelFilter;
  search : SearchFilter
}

interface LogsContext {
  filters: Filters;
  query : QueryClient
}

interface ProviderProps {
  children: ReactNode;
}

export const LogsContext = createContext<LogsContext | undefined>(undefined);

export function useLogsContext() {
  const context = useContext(LogsContext);

  if (context === undefined) {
    throw new Error("Define log provider in parent node");
  }

  return context;
}

export function LogsProvider({ children }: ProviderProps) {
  const [levelFilter, setLevelFilter] = useState<Selection>("all");
  const [projectFilter, setProjectFilter] = useState<Selection>("all");
  const [searchFilter, setSearchFilter] = useState<string>("");

  const queryClient = new QueryClient();
    
  return (
    <LogsContext.Provider
      value={{
        filters: {
          level: {
            value: levelFilter,
            set: setLevelFilter,
          },
          project: {
            value: projectFilter,
            set: setProjectFilter,
          },
          search : {
            value : searchFilter,
            set : setSearchFilter
          }
        },
        query : queryClient
      }}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </LogsContext.Provider>
  );
}
