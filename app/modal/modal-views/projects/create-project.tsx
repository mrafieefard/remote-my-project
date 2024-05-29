import {
  Button,
  Input,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useAlertContext } from "@/app/contexts/alert-context";
import { useHttpContext } from "@/app/contexts/http-context";
import { useModalContext } from "@/app/contexts/modal-context";

interface props {
  refetchProjects: () => void;
}

export default function CreateProject(props: props) {
  const modalContext = useModalContext()
  const alertContext = useAlertContext()
  const { onClose } = modalContext.modal.disclosure;
  const httpContext = useHttpContext()
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
          onPress={() => {
            if (allowApply) {
              setIsLoading(true)
              httpContext.httpClient.http_create_project(
                createData.title,
                createData.description
              ).then(() => {
                setIsLoading(false)
                props.refetchProjects();
                onClose();
                alertContext.toast.success("Project created");
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
