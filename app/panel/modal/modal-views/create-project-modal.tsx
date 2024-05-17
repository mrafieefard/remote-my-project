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
import { handle_error, http_create_project } from "@/app/http/client";
import { useRouter } from "next/navigation";

interface props {
  modal: ChildrenModal;
  refetchProjects: () => void;
}

export default function CreateProjectModal(props: props) {
  const { onClose } = props.modal.disclosure;
  const router = useRouter()
  const [isLoading,setIsLoading] = useState(false);
  const [createData, setCreateData] = useState({
    title: "",
    description: "",
  });
  const [allowApply, setAllowApply] = useState(false);

  useEffect(() => {
    if (createData.title != "") {
      setAllowApply(true);
    } else {
      setAllowApply(false);
    }
    console.log(createData);
  }, [createData]);

  return (
    <>
      <ModalHeader className="flex flex-col gap-1">Edit</ModalHeader>
      <ModalBody>
        <Input
          label="Project title"
          value={createData.title}
          onValueChange={(value) =>
            setCreateData({ ...createData, title: value })
          }
        />
        <Textarea
          value={createData.description}
          onValueChange={(value) =>
            setCreateData({ ...createData, description: value })
          }
          label="Project description"
        />
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
              http_create_project(
                createData.title,
                createData.description
              ).then(() => {
                setIsLoading(false)
                props.refetchProjects();
                onClose();
                props.modal.notificationContext.success("Project created");
              }).catch((error)=>{
                setIsLoading(false)
                handle_error(error,props.modal.notificationContext,router)
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
