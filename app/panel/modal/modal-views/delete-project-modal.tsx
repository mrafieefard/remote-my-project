import {
  Button,
  Code,
  Input,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { ChildrenModal } from "../modal-base";
import { useEffect, useState } from "react";
import PanelHttp from "@/app/http/panel";
import { ProjectResponse } from "@/app/http/base";

interface props {
  modal: ChildrenModal;
  project: ProjectResponse;
  http: PanelHttp;
  refetchProjects: () => void;
}

export default function DeleteProjectModal(props: props) {
  const { onClose } = props.modal.disclosure;
  const [confirmValue, setConfirmValue] = useState("");
  const [allowDelete, setAllowDelete] = useState(false);
  useEffect(() => {
    if (confirmValue == props.project.title) {
      setAllowDelete(true);
    } else {
      setAllowDelete(false);
    }
  }, [confirmValue]);

  return (
    <>
      <ModalHeader className="flex flex-col gap-1">Confirm delete</ModalHeader>
      <ModalBody>
        <p>
          Type <Code color="warning">{props.project.title}</Code> to delete
          project
        </p>
        <Input
          value={confirmValue}
          onValueChange={(value) => setConfirmValue(value)}
          placeholder={`Type ${props.project.title}`}
        />
      </ModalBody>
      <ModalFooter>
        <Button
          isDisabled={!allowDelete}
          color="danger"
          onClick={() => [
            props.http.delete_project(props.project.id).then((value) => {
              if (value.success) {
                onClose();
                props.refetchProjects();
                props.modal.notificationContext.success(value.data!);
              } else {
                onClose();
                props.modal.notificationContext.error(value.data!);
              }
            }),
          ]}
        >
          Delete
        </Button>
      </ModalFooter>
    </>
  );
}
