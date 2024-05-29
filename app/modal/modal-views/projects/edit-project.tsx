import {
  Button,
  Input,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@nextui-org/react";
import { ProjectResponse } from "@/app/http/base";
import { useEffect, useState } from "react";
import { useAlertContext } from "@/app/contexts/alert-context";
import { useHttpContext } from "@/app/contexts/http-context";
import { useModalContext } from "@/app/contexts/modal-context";

interface props {
  project: ProjectResponse;
  refetchProjects: () => void;
  
}

export default function EditProject(props: props) {
  const modalContext = useModalContext()
  const alertContext = useAlertContext()
  const { onClose } = modalContext.modal.disclosure;
  const httpContext = useHttpContext()
  const [editedData, setEditData] = useState({
    title: props.project.title,
    description: props.project.description,
    change_secret: false,
  });
  const [allowApply, setAllowApply] = useState(false);
  const [isLoading,setIsLoading] = useState(false);
  useEffect(() => {
    if (editedData.title != "") {
      setAllowApply(true);
    } else {
      setAllowApply(false);
    }
    console.log(editedData);
  }, [editedData]);

  return (
    <>
      <ModalHeader className="flex flex-col gap-1">Edit</ModalHeader>
      <ModalBody>
        <Input isDisabled label="Project id" value={props.project.id} />
        <Input
          label="Project title"
          value={editedData.title}
          onValueChange={(value) =>
            setEditData({ ...editedData, title: value })
          }
        />
        <Textarea
          value={editedData.description}
          onValueChange={(value) =>
            setEditData({ ...editedData, description: value })
          }
          label="Project description"
        />
        <Button
          color={editedData.change_secret ? "success" : "danger"}
          onPress={() => {
            setEditData({ ...editedData, change_secret: true });
          }}
        >
          Reset secret key
        </Button>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" variant="light" onPress={onClose}>
          Close
        </Button>
        <Button
          isLoading={isLoading}
          color="primary"
          onPress={() => {
            if (allowApply) {
              setIsLoading(true)
              httpContext.httpClient.http_edit_project(
                  props.project.id,
                  editedData.title,
                  editedData.description,
                  editedData.change_secret
                )
                .then(() => {
                  setIsLoading(false)
                  props.refetchProjects();
                  onClose();
                  alertContext.toast.success("Project edited");
                })
            }
          }}
          isDisabled={!allowApply}
        >
          Apply
        </Button>
      </ModalFooter>
    </>
  );
}
