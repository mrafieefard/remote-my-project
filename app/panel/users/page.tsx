"use client";
import { useQuery } from "react-query";

import ProjectTable from "./users-table";
import { useEffect } from "react";
import TableHeader from "./components/table-header";
import { useUsersContext } from "@/app/contexts/users-context";
import { useHttpContext } from "@/app/contexts/http-context";
import UsersTable from "./users-table";

export default function ProjectPage() {
  const usersContext = useUsersContext();
  const httpContext = useHttpContext();

  const users = useQuery(
    "users",
    async () => {
      return await httpContext.httpClient.get_users(
        usersContext.filters.search.value
      );
    },
    {
      refetchOnWindowFocus: false,
      initialData: [],
    }
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      users.refetch();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [usersContext.filters.search]);

  return (
    <main className="flex flex-col w-full h-full p-2 md:py-1 md:px-8 gap-4">
      <div className="flex flex-col gap-4">
        <TableHeader queryData={users} />
        <UsersTable users={users} />
      </div>
    </main>
  );
}
