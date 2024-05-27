import {
  Button,
  Input,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@nextui-org/react";
import { ModalView } from "../modal-base";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ProjectResponse } from "@/app/http/base";
import { useEffect, useState } from "react";
import { FaRotate } from "react-icons/fa6";
import { QueryClient } from "react-query";
import {handle_error, http_edit_project} from "@/app/http/client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAlertContext } from "@/app/contexts/alert-context";


interface props {
  project: ProjectResponse;
  refetchProjects: () => void;
  
}

export default function EditProjectModal(props: props) {
  const alertContext = useAlertContext()
  const { onClose } = alertContext.modal.disclosure;
  const router = useRouter()
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
              http_edit_project(
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
                }).catch((error)=>{
                  setIsLoading(false)
                  handle_error(error,alertContext.toast,router)
                });
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