"use client";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";

import ProjectTable from "./project-table";
import {  useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import TableHeader from "./components/table-header";
import { useProjectsContext } from "@/app/contexts/project-context";
import { useHttpContext } from "@/app/contexts/http-context";

export default function ProjectPage() {
  const projectsContext = useProjectsContext()
  const httpContext = useHttpContext()
  const queryClient = new QueryClient();

  const projects_res = useQuery(
    "projects",
    async () => {
        return await httpContext.httpClient.http_get_projects(projectsContext.filters.search.value);
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  useEffect(()=>{
    const timeoutId = setTimeout(() => {
      projects_res.refetch()
    },500)
    return () => clearTimeout(timeoutId);
  },[projectsContext.filters.search])


  return (
    <QueryClientProvider client={queryClient}>
      <main className="flex flex-col w-full h-full p-2 md:py-1 md:px-8 gap-4">
        <div className="flex flex-col gap-4">
          <TableHeader
            queryData={projects_res}
          />
          <ProjectTable
            refetchProjects={projects_res.refetch}
            projects={projects_res.data ? projects_res.data : []}
            isLoading={projects_res.isLoading || projects_res.isFetching}
          />
        </div>
      </main>
    </QueryClientProvider>
  );
}
