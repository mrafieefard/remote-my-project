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

interface props {
  refetchLogs: () => void;
}

export default function ClearLogConfirmModal(props: props) {
  const modalContext = useModalContext()
  const alertContext = useAlertContext()
  const httpContext = useHttpContext()
  const { onClose } = modalContext.modal.disclosure;
  const [isLoading,setIsLoading] = useState(false)
  const router = useRouter()
  return (
    <>
      <ModalHeader className="flex flex-col gap-1">Confirm delete</ModalHeader>
      <ModalBody>
        <p>
          Clearing the log is an irreversible operation. Are you sure you want
          to delete the logs?
        </p>
      </ModalBody>
      <ModalFooter>
        <Button onPress={()=>onClose()}>No</Button>
        <Button isLoading={isLoading} onPress={()=>{
          setIsLoading(true)
            httpContext.httpClient.http_clear_logs().then(()=>{
              setIsLoading(false)
                onClose()
                alertContext.toast.success("Logs cleared")
                props.refetchLogs()

            })
        }} color="danger">Yes</Button>
      </ModalFooter>
    </>
  );
}
