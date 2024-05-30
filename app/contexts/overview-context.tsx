"use client";

import { ReactNode, createContext, useContext, useState } from "react";

interface SearchFilter {
  value: string;
  set: React.Dispatch<React.SetStateAction<string>>;
}

interface Filters {
  search : SearchFilter
}

interface OverviewContext {
  filters: Filters;
}

interface ProviderProps {
  children: ReactNode;
}

export const OverviewContext = createContext<OverviewContext | undefined>(undefined);

export function useOverviewContext() {
  const context = useContext(OverviewContext);

  if (context === undefined) {
    throw new Error("Define project provider in parent node");
  }

  return context;
}

export function OverviewProvider({ children }: ProviderProps) {
  const [searchFilter, setSearchFilter] = useState<string>("");
    
  return (
    <OverviewContext.Provider
      value={{
        filters: {
          search : {
            value : searchFilter,
            set : setSearchFilter
          }
        },
      }}
    >
      {children}
    </OverviewContext.Provider>
  );
}
