import {
  Button,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAlertContext } from "@/app/contexts/alert-context";
import { useHttpContext } from "@/app/contexts/http-context";
import { useModalContext } from "@/app/contexts/modal-context";
import { UserResponse } from "@/app/http/base";

interface props {
  refetch: () => void;
  user : UserResponse
}

export default function DeleteUserConfirm(props: props) {
  const modalContext = useModalContext()
  const alertContext = useAlertContext()
  const httpContext = useHttpContext()
  const { onClose } = modalContext.modal.disclosure;
  const [isLoading,setIsLoading] = useState(false)

  return (
    <>
      <ModalHeader className="flex flex-col gap-1">Confirm delete</ModalHeader>
      <ModalBody>
        <p>
          Are you sure you want to delete {props.user.username} ?
        </p>
      </ModalBody>
      <ModalFooter>
        <Button onPress={()=>onClose()}>No</Button>
        <Button isLoading={isLoading} onPress={()=>{
          setIsLoading(true)
            httpContext.httpClient.delete_user(props.user.username).then(()=>{
              setIsLoading(false)
                onClose()
                alertContext.toast.success("User deleted")
                props.refetch()

            })
        }} color="danger">Yes</Button>
      </ModalFooter>
    </>
  );
}
