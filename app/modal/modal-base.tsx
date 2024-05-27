import { useDisclosure } from "@nextui-org/react";
import { ReactNode, useState } from "react";
import { Modal, ModalContent } from "@nextui-org/react";


interface ContextModal {
  modal: ReturnType<typeof useModal>;
}


export function ModalBase(props: ContextModal) {
  const modal = props.modal
  const { isOpen, onOpenChange } = modal.disclosure;

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size={modal.modalSize}>
      <ModalContent>{modal.modalContent}</ModalContent>
    </Modal>
  );
}

export function useModal() {
  const [modalContent, setModalContent] = useState(<></>);
  const disclosure = useDisclosure();
  const [modalSize, setModalSize] = useState<
    "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full"
  >("md");

  const openModal = (content: JSX.Element, size: typeof modalSize = "md") => {
    setModalSize(size);
    setModalContent(content);
    disclosure.onOpen();
  };

  return {
    modalContent,
    setModalContent,
    openModal,
    modalSize,
    setModalSize,
    disclosure,
  };
}

export type { ContextModal };