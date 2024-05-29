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
import { useAlertContext } from "@/app/contexts/alert-context";
import { useHttpContext } from "@/app/contexts/http-context";

interface props {
  project: ProjectResponse;
  refetchProjects: () => void;
}

export default function DeleteProject(props: props) {
  const alertContext = useAlertContext()
  const { onClose } = alertContext.modal.disclosure;
  const httpContext = useHttpContext()
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
            httpContext.httpClient.http_delete_project(props.project.id).then(() => {
              setIsLoading(false)
              onClose();
              props.refetchProjects();
              alertContext.toast.success("Project delted");
            })
          }}
        >
          Delete
        </Button>
      </ModalFooter>
    </>
  );
}
