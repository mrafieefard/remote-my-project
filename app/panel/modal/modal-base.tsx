import { useDisclosure } from "@nextui-org/react";
import { ReactNode } from "react";
import toast from "react-hot-toast";

interface ChildrenModal {
  disclosure: ReturnType<typeof useDisclosure>;
  notificationContext: typeof toast;
}

interface ContextModal {
  children: ReactNode;
  disclosure: ReturnType<typeof useDisclosure>;
  modalSize:
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "full";
}

interface ModalViewProps {
  setModalContent: (content: JSX.Element) => void;
  ModalContent: JSX.Element;
  disclosure: ReturnType<typeof useDisclosure>;
  modalSize:
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "full";
  setModalSize: (
    size:
      | "xs"
      | "sm"
      | "md"
      | "lg"
      | "xl"
      | "2xl"
      | "3xl"
      | "4xl"
      | "5xl"
      | "full"
  ) => void;
}

export type { ChildrenModal, ContextModal, ModalViewProps };
