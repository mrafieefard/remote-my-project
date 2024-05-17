"use client";

import { Button, Card, Input, useDisclosure } from "@nextui-org/react";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";

import PanelHttp from "../../http/panel";
import ProjectTable from "./project-table";
import { ReactNode, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { FaMagnifyingGlass, FaRotate } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { ContextModal, ModalViewProps } from "../modal/modal-base";
import ModalContext from "../modal/modal-context";
import CreateProjectModal from "../modal/modal-views/create-project-modal";
import { http_get_projects } from "@/app/http/client";


export default function ProjectPage() {
  const [modalContent, setModalContent] = useState(<></>);
  const [modalSize,setModalSize] = useState< "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full">("md")
  const disclosure = useDisclosure();
  const [token, setToken] = useState("");
  
  useEffect(() => {
    const localStorageToken = localStorage.getItem("token");
    setToken(
      localStorageToken != null ? "Bearer " + localStorageToken : "Bearer "
    );
  }, []);

  const openModal = (modal: JSX.Element) => {
    setModalContent(modal);
    disclosure.onOpen();
  };

  const queryClient = new QueryClient();

  const { data, isLoading, isFetching, refetch } = useQuery(
    "projects",
    async () => {
      return await http_get_projects();
    },
    {
      refetchOnWindowFocus: false,
      enabled : token == "" ? false : true
    }
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ModalContext modalSize={modalSize} disclosure={disclosure}>{modalContent}</ModalContext>
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
                placeholder="Search in projects"
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
                color="primary"
                onClick={() => {
                  openModal(
                    <CreateProjectModal
                      modal={{
                        disclosure: disclosure,
                        notificationContext: toast,
                      }}
                      refetchProjects={refetch}
                    />
                  );
                }}
              >
                Add new <FaPlus />
              </Button>

              <Button
                className="flex md:hidden"
                isIconOnly
                color="primary"
                onClick={() => {
                  openModal(
                    <CreateProjectModal
                      modal={{
                        disclosure: disclosure,
                        notificationContext: toast,
                      }}
                      refetchProjects={refetch}
                    />
                  );
                }}
              >
                <FaPlus />
              </Button>
            </div>
          </div>
          <ProjectTable
            refetchProjects={refetch}
            projects={data ? data : []}
            isLoading={isLoading}
            modal={{
              modalSize:modalSize,
              setModalSize : setModalSize,
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
