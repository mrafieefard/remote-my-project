"use client";

import { ReactNode, createContext, useContext, useState } from "react";

interface SearchFilter {
  value: string;
  set: React.Dispatch<React.SetStateAction<string>>;
}

interface Filters {
  search : SearchFilter
}

interface UsersContext {
  filters: Filters;
}

interface ProviderProps {
  children: ReactNode;
}

export const UsersContext = createContext<UsersContext | undefined>(undefined);

export function useUsersContext() {
  const context = useContext(UsersContext);

  if (context === undefined) {
    throw new Error("Define users provider in parent node");
  }

  return context;
}

export function UsersProvider({ children }: ProviderProps) {
  const [searchFilter, setSearchFilter] = useState<string>("");
    
  return (
    <UsersContext.Provider
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
    </UsersContext.Provider>
  );
}
