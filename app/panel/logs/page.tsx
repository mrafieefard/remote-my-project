"use client";

import { Pagination } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import toast from "react-hot-toast";
import LogsTable from "./logs-table";
import {
  http_get_logs,
  handle_error,
  http_get_projects,
} from "@/app/http/client";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import TableHeader from "./components/table-header";
import { LogsProvider, useLogsContext } from "../../contexts/log-context";
import { useAlertContext } from "@/app/contexts/alert-context";

export default function LogsPage() {
  const alertContext = useAlertContext();

  const [page, setPage] = useState(1);
  const logsContext = useLogsContext();
  const router = useRouter();

  const logs_res = useQuery(
    "logs",
    async () => {
      try {
        return await http_get_logs(
          page,
          25,
          logsContext.filters.level.value !== "all"
            ? Array.from(logsContext.filters.level.value).map((value) =>
                value.toString()
              )
            : logsContext.filters.level.value,
          logsContext.filters.project.value !== "all"
            ? Array.from(logsContext.filters.project.value).map((value) =>
                value.toString()
              )
            : logsContext.filters.project.value,
          logsContext.filters.search.value
        );
      } catch (error) {
        handle_error(error, toast, router);
      }
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      logs_res.refetch();
    },500)
    return () => clearTimeout(timeoutId);
  }, [
    page,
    logsContext.filters.level.value,
    logsContext.filters.project.value,
    logsContext.filters.search.value,
  ]);

  return (
    <>
      <main className="flex flex-col w-full h-full p-2 md:py-1 md:px-8 gap-4">
        <div className="flex flex-col gap-4">
          <TableHeader logsData={logs_res} />
          <LogsTable
            refetchLogs={logs_res.refetch}
            logs={logs_res.data ? logs_res.data.data : []}
            isLoading={logs_res.isLoading}
            pagination={
              <div className="flex w-full justify-center">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="primary"
                  page={page}
                  total={logs_res.data ? logs_res.data?.total_pages : 1}
                  onChange={(page) => setPage(page)}
                />
              </div>
            }
          />
        </div>
      </main>
    </>
  );
}
