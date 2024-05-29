"use client";

import { Pagination } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import LogsTable from "./logs-table";
import TableHeader from "./components/table-header";
import { useLogsContext } from "../../contexts/log-context";;
import { useHttpContext } from "@/app/contexts/http-context";

export default function LogsPage() {
  const httpContext = useHttpContext();

  const [page, setPage] = useState(1);
  const logsContext = useLogsContext();

  const logs_res = useQuery(
    "logs",
    async () => {
      return await httpContext.httpClient.http_get_logs(
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
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      logs_res.refetch();
    }, 500);
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
