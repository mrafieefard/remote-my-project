"use client";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";

import ProjectTable from "./project-table";
import {  useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { handle_error, http_get_projects } from "@/app/http/client";
import TableHeader from "./components/table-header";

export default function ProjectPage() {
  const router = useRouter();

  // const [modalContent, setModalContent] = useState(<></>);

  // const disclosure = useDisclosure();
  const [token, setToken] = useState("");

  useEffect(() => {
    const localStorageToken = localStorage.getItem("token");
    setToken(
      localStorageToken != null ? "Bearer " + localStorageToken : "Bearer "
    );
  }, []);

  const queryClient = new QueryClient();

  const queryData = useQuery(
    "projects",
    async () => {
      try {
        return await http_get_projects();
      } catch (error) {
        handle_error(error, toast, router);
      }
    },
    {
      refetchOnWindowFocus: false,
      enabled: token == "" ? false : true,
    }
  );

  if (queryData.isError) {
    handle_error(queryData.error, toast, router);
  }

  return (
    <QueryClientProvider client={queryClient}>
      <main className="flex flex-col w-full h-full p-2 md:py-1 md:px-8 gap-4">
        <div className="flex flex-col gap-4">
          <TableHeader
            queryData={queryData}
          />
          <ProjectTable
            refetchProjects={queryData.refetch}
            projects={queryData.data ? queryData.data : []}
            isLoading={queryData.isLoading}
          />
        </div>
      </main>
    </QueryClientProvider>
  );
}
