import {
  Modal,
  ModalContent,
} from "@nextui-org/react";
import { ReactNode } from "react";
import { ContextModal } from "./modal-base";

export default function ModalContext(props: ContextModal) {
  const { isOpen, onOpenChange } = props.disclosure;

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>{props.children}</ModalContent>
    </Modal>
  );
}
