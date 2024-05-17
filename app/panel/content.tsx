"use client";

import { Button, Card, Input, useDisclosure } from "@nextui-org/react";
import TotalCard from "./overview/total-card";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";

import PanelHttp from "../http/panel";
import ProjectTable from "./projects/project-table";
import { ReactNode, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { FaMagnifyingGlass, FaRotate } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { ModalViewProps } from "./modal/modal-base";

interface props {
  ModalProps: ModalViewProps;
  http: PanelHttp;
}

export default function Content(props: props) {
  
}
