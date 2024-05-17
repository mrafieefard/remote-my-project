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

interface props {
  modal: ChildrenModal;
  project: ProjectResponse;
  http: PanelHttp;
  refetchProjects: () => void;
}

export default function EditProjectModal(props: props) {
  const { onClose } = props.modal.disclosure;
  const [editedData, setEditData] = useState({
    title: props.project.title,
    description: props.project.description,
    change_secret: false,
  });
  const [allowApply, setAllowApply] = useState(false);

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
          color="primary"
          onClick={() => {
            if (allowApply) {
              props.http
                .edit_project(
                  props.project.id,
                  editedData.title,
                  editedData.description,
                  editedData.change_secret
                )
                .then((value) => {
                  if (value.success) {
                    props.refetchProjects();
                    onClose();
                    props.modal.notificationContext.success(value.data!);
                  } else {
                    props.modal.notificationContext.error(value.error!);
                    onClose()
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
