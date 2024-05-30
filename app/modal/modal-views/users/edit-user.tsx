import {
  Button,
  Input,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@nextui-org/react";
import { ProjectResponse, UserResponse } from "@/app/http/base";
import { useEffect, useState } from "react";
import { useAlertContext } from "@/app/contexts/alert-context";
import { useHttpContext } from "@/app/contexts/http-context";
import { useModalContext } from "@/app/contexts/modal-context";

interface props {
  user: UserResponse;
  refetch: () => void;
  
}

export default function EditUser(props: props) {
  const modalContext = useModalContext()
  const alertContext = useAlertContext()
  const { onClose } = modalContext.modal.disclosure;
  const httpContext = useHttpContext()
  const [editedData, setEditData] = useState({
    username: props.user.username,
    password: ""
  });
  const [allowApply, setAllowApply] = useState(false);
  const [isLoading,setIsLoading] = useState(false);
  useEffect(() => {
    if (editedData.username != "") {
      setAllowApply(true);
    } else {
      setAllowApply(false);
    }
    console.log(editedData);
  }, [editedData]);

  return (
    <>
      <ModalHeader className="flex flex-col gap-1">Edit {props.user.username}</ModalHeader>
      <ModalBody>
      <Input
            label="Username"
            value={editedData.username}
            onValueChange={(value) =>
              setEditData({ ...editedData, username: value })
            }
          />
          <Input
            label="Password"
            type="password"
            value={editedData.password}
            onValueChange={(value) =>
              setEditData({ ...editedData, password: value })
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
              setIsLoading(true)
              httpContext.httpClient.edit_user(
                  props.user.id,
                  editedData.username,
                  editedData.password
                )
                .then(() => {
                  
                  props.refetch();
                  onClose();
                  alertContext.toast.success("User edited");
                }).finally(()=>{
                  setIsLoading(false)
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
