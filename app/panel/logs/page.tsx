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
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import ModalContext from "../modal/modal-context";
import toast, { Toaster } from "react-hot-toast";
import { FaMagnifyingGlass, FaPlus, FaRotate } from "react-icons/fa6";
import CreateProjectModal from "../modal/modal-views/create-project-modal";
import LogsTable from "./logs-table";
import { FaChevronDown, FaTrash } from "react-icons/fa";
import ClearLogConfirmModal from "../modal/modal-views/clear-log-confirm-modal";
import {
  http_get_logs,
  handle_error,
  http_get_projects,
} from "@/app/http/client";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export default function LogsPage() {
  const [modalContent, setModalContent] = useState(<></>);
  const [modalSize, setModalSize] = useState<
    "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full"
  >("md");
  const [page, setPage] = useState(1);
  const disclosure = useDisclosure();

  const LOG_LEVELS = ["Info", "Debug", "Success", "Warning", "Error"];

  const [levelFilter, setLevelFilter] = useState<Selection>("all");
  const [projectFilter, setProjectFilter] = useState<Selection>("all");

  const router = useRouter();
  const queryClient = new QueryClient();

  const openModal = (modal: JSX.Element) => {
    setModalContent(modal);
    disclosure.onOpen();
  };

  const logs_res = useQuery(
    "logs",
    async () => {
      try {
        return await http_get_logs(
          page,
          25,
          levelFilter !== "all"
            ? Array.from(levelFilter).map((value) => value.toString())
            : levelFilter,
          projectFilter !== "all"
            ? Array.from(projectFilter).map((value) => value.toString())
            : projectFilter
        );
      } catch (error) {
        handle_error(error, toast, router);
      }
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  const projects_res = useQuery(
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
    }
  );

  useEffect(() => {
    logs_res.refetch();
  }, [page, levelFilter, projectFilter]);

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
            <div className="flex flex-row gap-2">
              <div className="hidden md:flex gap-2">
                <Input
                  className="hidden md:flex"
                  placeholder="Search in logs"
                  startContent={<FaMagnifyingGlass />}
                />

                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      className="min-w-min"
                      endContent={<FaChevronDown className="text-xs" />}
                    >
                      Level
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    disallowEmptySelection
                    closeOnSelect={false}
                    selectionMode="multiple"
                    selectedKeys={levelFilter}
                    onSelectionChange={setLevelFilter}
                  >
                    {LOG_LEVELS.map((value) => (
                      <DropdownItem key={value}>{value}</DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      isLoading={projects_res.isLoading}
                      className="min-w-min"
                      endContent={<FaChevronDown className="text-xs" />}
                    >
                      Project
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    disallowEmptySelection
                    closeOnSelect={false}
                    selectionMode="multiple"
                    selectedKeys={projectFilter}
                    onSelectionChange={setProjectFilter}
                  >
                    {projects_res.data ? (
                      projects_res.data.map((value) => (
                        <DropdownItem key={value.id}>
                          {value.title}
                        </DropdownItem>
                      ))
                    ) : (
                      <></>
                    )}
                  </DropdownMenu>
                </Dropdown>
              </div>
              <div className="flex md:hidden flex-col gap-2">
                <Input
                  placeholder="Search in logs"
                  startContent={<FaMagnifyingGlass />}
                />
                <div className="flex flex-row gap-2">
                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        className="min-w-min"
                        endContent={<FaChevronDown className="text-xs" />}
                      >
                        Level
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      disallowEmptySelection
                      closeOnSelect={false}
                      selectionMode="multiple"
                      selectedKeys={levelFilter}
                      onSelectionChange={setLevelFilter}
                    >
                      {LOG_LEVELS.map((value) => (
                        <DropdownItem key={value}>{value}</DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        isLoading={projects_res.isLoading}
                        className="min-w-min"
                        endContent={<FaChevronDown className="text-xs" />}
                      >
                        Project
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      disallowEmptySelection
                      closeOnSelect={false}
                      selectionMode="multiple"
                      selectedKeys={projectFilter}
                      onSelectionChange={setProjectFilter}
                    >
                      {projects_res.data ? (
                        projects_res.data.map((value) => (
                          <DropdownItem key={value.id}>
                            {value.title}
                          </DropdownItem>
                        ))
                      ) : (
                        <></>
                      )}
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div>
            </div>
            <div className="flex flex-row gap-2">
              <Button
                isLoading={logs_res.isLoading || logs_res.isFetching}
                isIconOnly
                color="primary"
                onPress={() => {
                  logs_res.refetch();
                }}
              >
                {logs_res.isLoading || logs_res.isFetching ? (
                  <></>
                ) : (
                  <FaRotate />
                )}
              </Button>
              <Button
                className="hidden md:flex"
                color="danger"
                onPress={() => {
                  openModal(
                    <ClearLogConfirmModal
                      modal={{
                        disclosure: disclosure,
                        notificationContext: toast,
                      }}
                      refetchLogs={logs_res.refetch}
                    />
                  );
                }}
              >
                Clear all logs <FaTrash />
              </Button>

              <Button
                className="flex md:hidden"
                isIconOnly
                onPress={() => {
                  openModal(
                    <ClearLogConfirmModal
                      modal={{
                        disclosure: disclosure,
                        notificationContext: toast,
                      }}
                      refetchLogs={logs_res.refetch}
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
            refetchLogs={logs_res.refetch}
            logs={logs_res.data ? logs_res.data.data : []}
            isLoading={logs_res.isLoading}
            toastContext={toast}
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
