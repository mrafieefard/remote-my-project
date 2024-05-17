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
import PanelHttp from "@/app/http/panel";
import { QueryClient } from "react-query";
import { http_create_project } from "@/app/http/client";

interface props {
  modal: ChildrenModal;
  refetchProjects: () => void;
}

export default function CreateProjectModal(props: props) {
  const { onClose } = props.modal.disclosure;
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
          color="primary"
          onClick={() => {
            if (allowApply) {
              http_create_project(
                createData.title,
                createData.description
              ).then((value) => {
                if (value.success) {
                  props.refetchProjects();
                  onClose();
                  props.modal.notificationContext.success(value.data!);
                } else {
                  onClose();
                  props.modal.notificationContext.error(value.data!);
                }
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
