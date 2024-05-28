"use client";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";

import ProjectTable from "./project-table";
import {  useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { handle_error, http_get_projects } from "@/app/http/client";
import TableHeader from "./components/table-header";
import { useProjectsContext } from "@/app/contexts/project-context";

export default function ProjectPage() {
  const router = useRouter();

  const projectsContext = useProjectsContext()

  const queryClient = new QueryClient();

  const projects_res = useQuery(
    "projects",
    async () => {
      try {
        return await http_get_projects(projectsContext.filters.search.value);
      } catch (error) {
        handle_error(error, toast, router);
      }
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

  if (projects_res.isError) {
    handle_error(projects_res.error, toast, router);
  }

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
