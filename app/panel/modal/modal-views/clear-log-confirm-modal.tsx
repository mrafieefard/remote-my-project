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
import PanelHttp from "@/app/http/panel";
import { ProjectResponse } from "@/app/http/base";
import { http_clear_logs } from "@/app/http/client";

interface props {
  modal: ChildrenModal;
  refetchLogs: () => void;
}

export default function ClearLogConfirmModal(props: props) {
  const { onClose } = props.modal.disclosure;

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
        <Button onClick={()=>onClose()}>No</Button>
        <Button onClick={()=>{
            http_clear_logs().then(()=>{
                onClose()
                props.modal.notificationContext.success("Logs cleared")
                props.refetchLogs()

            })
        }} color="danger">Yes</Button>
      </ModalFooter>
    </>
  );
}
