import { Button, ModalBody, ModalFooter, ModalHeader } from "@nextui-org/react";
import { ChildrenModal } from "../modal-base";

export default function UseProjectModal(props: ChildrenModal) {
  const { onClose } = props.disclosure;

  return (
    <>
      <ModalHeader className="flex flex-col gap-1">Use it</ModalHeader>
      <ModalBody>

      </ModalBody>
      <ModalFooter>
        <Button color="danger" variant="light" onPress={onClose}>
          Close
        </Button>
        <Button color="primary" onPress={onClose}>
          Action
        </Button>
      </ModalFooter>
    </>
  );
}