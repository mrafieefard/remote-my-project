import { useDisclosure } from "@nextui-org/react";
import { ReactNode } from "react";
import toast from "react-hot-toast";

interface ChildrenModal {
  disclosure: ReturnType<typeof useDisclosure>;
  notificationContext : typeof toast
}

interface ContextModal {
  children: ReactNode;
  disclosure: ReturnType<typeof useDisclosure>;
}

interface ModalViewProps{
    setModalContent : (content : JSX.Element) => void
    ModalContent : JSX.Element
    disclosure: ReturnType<typeof useDisclosure>;
}

export type { ChildrenModal, ContextModal,ModalViewProps };
