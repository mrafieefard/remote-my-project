"use client";

import { ReactNode, createContext, useContext, useState } from "react";

interface SearchFilter {
  value: string;
  set: React.Dispatch<React.SetStateAction<string>>;
}

interface Filters {
  search : SearchFilter
}

interface ProjectsContext {
  filters: Filters;
}

interface ProviderProps {
  children: ReactNode;
}

export const ProjectsContext = createContext<ProjectsContext | undefined>(undefined);

export function useProjectsContext() {
  const context = useContext(ProjectsContext);

  if (context === undefined) {
    throw new Error("Define project provider in parent node");
  }

  return context;
}

export function ProjectsProvider({ children }: ProviderProps) {
  const [searchFilter, setSearchFilter] = useState<string>("");
    
  return (
    <ProjectsContext.Provider
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
    </ProjectsContext.Provider>
  );
}
