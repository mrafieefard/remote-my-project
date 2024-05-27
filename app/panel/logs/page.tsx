"use client";

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
  useDisclosure,
  Selection,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import toast, { Toaster } from "react-hot-toast";
import LogsTable from "./logs-table";
import { FaChevronDown, FaTrash } from "react-icons/fa";
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
  const alertContext = useAlertContext()

  const [page, setPage] = useState(1);
  const context = useLogsContext();
  const router = useRouter();

  const logs_res = useQuery(
    "logs",
    async () => {
      try {
        return await http_get_logs(
          page,
          25,
          context.filters.level.value !== "all"
            ? Array.from(context.filters.level.value).map((value) =>
                value.toString()
              )
            : context.filters.level.value,
          context.filters.project.value !== "all"
            ? Array.from(context.filters.project.value).map((value) =>
                value.toString()
              )
            : context.filters.project.value
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
    logs_res.refetch();
  }, [page, context.filters.level.value, context.filters.project.value]);

  return (
    <>
      <main className="flex flex-col w-full h-full p-2 md:py-1 md:px-8 gap-4">
        <div className="flex flex-col gap-4">
          <TableHeader
            logsData={logs_res}
          />
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
