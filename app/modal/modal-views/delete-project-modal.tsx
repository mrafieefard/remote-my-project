import {
  Button,
  Code,
  Input,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { ProjectResponse } from "@/app/http/base";
import {handle_error, http_delete_project} from "@/app/http/client";
import { useRouter } from "next/navigation";
import { useAlertContext } from "@/app/contexts/alert-context";

interface props {
  project: ProjectResponse;
  refetchProjects: () => void;
}

export default function DeleteProjectModal(props: props) {
  const alertContext = useAlertContext()
  const { onClose } = alertContext.modal.disclosure;
  const router = useRouter()
  const [confirmValue, setConfirmValue] = useState("");
  const [allowDelete, setAllowDelete] = useState(false);
  const [isLoading,setIsLoading] = useState(false);
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
          isLoading={isLoading}
          color="danger"
          onPress={() => {
            setIsLoading(true)
            http_delete_project(props.project.id).then(() => {
              setIsLoading(false)
              onClose();
              props.refetchProjects();
              alertContext.toast.success("Project delted");
            }).catch((error)=>{
              setIsLoading(false)
              handle_error(error,alertContext.toast,router)
            })
          }}
        >
          Delete
        </Button>
      </ModalFooter>
    </>
  );
}
