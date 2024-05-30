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
    const modalContext = useModalContext();
    const alertContext = useAlertContext();
    const { onClose } = modalContext.modal.disclosure;
    const httpContext = useHttpContext();
    const [isLoading, setIsLoading] = useState(false);
    const [createData, setCreateData] = useState({
      username: "",
      password: "",
    });
    const [allowApply, setAllowApply] = useState(false);
  
    useEffect(() => {
      if (createData.username != "" && createData.password != "") {
        setAllowApply(true);
      } else {
        setAllowApply(false);
      }
      console.log(createData);
    }, [createData]);
  
    return (
      <>
        <ModalHeader className="flex flex-col gap-1">Create user</ModalHeader>
        <ModalBody>
          <Input
            label="Username"
            value={createData.username}
            onValueChange={(value) =>
              setCreateData({ ...createData, username: value })
            }
          />
          <Input
            label="Password"
            type="password"
            value={createData.password}
            onValueChange={(value) =>
              setCreateData({ ...createData, password: value })
            }
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
                setIsLoading(true);
                httpContext.httpClient
                  .create_user(createData.username, createData.password)
                  .then(() => {
                    props.refetchProjects();
                    onClose();
                    alertContext.toast.success("User created");
                  })
                  .finally(() => setIsLoading(false));
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
  