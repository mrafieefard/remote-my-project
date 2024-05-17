import {
  Button,
  Input,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@nextui-org/react";
import { ChildrenModal } from "../modal-base";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ProjectResponse } from "@/app/http/base";
import { useEffect, useState } from "react";
import { FaRotate } from "react-icons/fa6";
import { QueryClient } from "react-query";
import {handle_error, http_edit_project} from "@/app/http/client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";


interface props {
  modal: ChildrenModal;
  project: ProjectResponse;
  refetchProjects: () => void;
}

export default function EditProjectModal(props: props) {
  const { onClose } = props.modal.disclosure;
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
          onClick={() => {
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
          onClick={() => {
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
                  props.modal.notificationContext.success("Project edited");
                }).catch((error)=>{
                  handle_error(error,props.modal.notificationContext,router)
                  setIsLoading(false)
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
