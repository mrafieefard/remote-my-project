"use client";

import { Button, Input, Pagination, useDisclosure } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import ModalContext from "../modal/modal-context";
import toast, { Toaster } from "react-hot-toast";
import { FaMagnifyingGlass, FaPlus, FaRotate } from "react-icons/fa6";
import CreateProjectModal from "../modal/modal-views/create-project-modal";
import LogsTable from "./logs-table";
import { FaTrash } from "react-icons/fa";
import ClearLogConfirmModal from "../modal/modal-views/clear-log-confirm-modal";
import { http_get_logs, handle_error } from "@/app/http/client";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export default function LogsPage() {
  const [modalContent, setModalContent] = useState(<></>);
  const [modalSize, setModalSize] = useState<
    "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full"
  >("md");
  const [page, setPage] = useState(1);
  const disclosure = useDisclosure();
  const [token, setToken] = useState("");
  useEffect(() => {
    const localStorageToken = localStorage.getItem("token");
    setToken(
      localStorageToken != null ? "Bearer " + localStorageToken : "Bearer "
    );
  }, []);

  const router = useRouter();
  const queryClient = new QueryClient();

  const openModal = (modal: JSX.Element) => {
    setModalContent(modal);
    disclosure.onOpen();
  };

  const { data, isLoading, isFetching, refetch, isError, error } = useQuery(
    "logs",
    async () => {
      try {
        return await http_get_logs(page, 25);
      } catch (error) {
        handle_error(error,toast,router)
      }
    },
    {
      refetchOnWindowFocus: false,
      enabled: token == "" ? false : true,
    }
  );

  useEffect(() => {
    if (token != "") {
      refetch();
    }
  }, [page]);

  return (
    <QueryClientProvider client={queryClient}>
      <ModalContext modalSize={modalSize} disclosure={disclosure}>
        {modalContent}
      </ModalContext>
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            border: "10px",
            background: "#27272A",
            color: "#fff",
          },
        }}
      />
      <main className="flex flex-col w-full h-full p-2 md:py-1 md:px-8 gap-4">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
            <div>
              <Input
                placeholder="Search in logs"
                startContent={<FaMagnifyingGlass />}
              />
            </div>
            <div className="flex flex-row gap-2">
              <Button
                isLoading={isLoading || isFetching}
                isIconOnly
                color="primary"
                onClick={() => {
                  refetch();
                }}
              >
                {isLoading || isFetching ? <></> : <FaRotate />}
              </Button>
              <Button
                className="hidden md:flex"
                color="danger"
                onClick={() => {
                  openModal(
                    <ClearLogConfirmModal
                      modal={{
                        disclosure: disclosure,
                        notificationContext: toast,
                      }}
                      refetchLogs={refetch}
                    />
                  );
                }}
              >
                Clear all logs <FaTrash />
              </Button>

              <Button
                className="flex md:hidden"
                isIconOnly
                onClick={() => {
                  openModal(
                    <ClearLogConfirmModal
                      modal={{
                        disclosure: disclosure,
                        notificationContext: toast,
                      }}
                      refetchLogs={refetch}
                    />
                  );
                }}
                color="danger"
              >
                <FaTrash />
              </Button>
            </div>
          </div>
          <LogsTable
            refetchLogs={refetch}
            logs={data ? data.data : []}
            isLoading={isLoading}
            toastContext={toast}
            pagination={
              <div className="flex w-full justify-center">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="primary"
                  page={page}
                  total={data ? data?.total_pages : 1}
                  onChange={(page) => setPage(page)}
                />
              </div>
            }
            modal={{
              modalSize: modalSize,
              setModalSize: setModalSize,
              setModalContent: setModalContent,
              ModalContent: modalContent,
              disclosure: disclosure,
            }}
          />
        </div>
      </main>
    </QueryClientProvider>
  );
}
