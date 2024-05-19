import {
  Button,
  Code,
  Input,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { ChildrenModal } from "../modal-base";
import { useEffect, useState } from "react";
import { ProjectResponse } from "@/app/http/base";
import { handle_error, http_clear_logs } from "@/app/http/client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface props {
  notificationContext: typeof toast,
  modal: ChildrenModal;
  refetchLogs: () => void;
}

export default function ClearLogConfirmModal(props: props) {
  const { onClose } = props.modal.disclosure;
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
            http_clear_logs().then(()=>{
              setIsLoading(false)
                onClose()
                props.notificationContext.success("Logs cleared")
                props.refetchLogs()

            }).catch((error)=>{
              setIsLoading(false)
              handle_error(error,props.notificationContext,router)
            })
        }} color="danger">Yes</Button>
      </ModalFooter>
    </>
  );
}
