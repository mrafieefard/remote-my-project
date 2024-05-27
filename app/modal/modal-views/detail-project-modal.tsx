import { Button, Chip, Input, ModalBody, ModalFooter, ModalHeader, Textarea } from "@nextui-org/react";
import { ProjectResponse } from "@/app/http/base";
import { useState } from "react";
import { FaEye, FaEyeSlash, FaUnsplash } from "react-icons/fa";
import { useAlertContext } from "@/app/contexts/alert-context";

interface props {
  project : ProjectResponse
}

export default function DetailProjectModal(props: props) {
  const alertContext = useAlertContext()
  const { onClose } = alertContext.modal.disclosure;
  const [showSecret,setShowSecret] = useState(false)
  return (
    <>
      <ModalHeader className="flex flex-col gap-1">Detail</ModalHeader>
      <ModalBody>
        <Input isDisabled label="Project id" value={props.project.id}/>
        <Input isDisabled label="Project title" value={props.project.title}/>
        <Textarea isDisabled label="Project description" value={props.project.description}/>
        <Input disabled label="Project secret" value={props.project.secret} type={showSecret ? "" : "password"} endContent={
          <div onClick={()=>{setShowSecret(!showSecret)}}>
            {showSecret ? <FaEyeSlash className="text-2xl text-default-400 cursor-pointer"/> : <FaEye className="text-2xl text-default-400 cursor-pointer"/>}
          </div>
        }/>
        <div className="flex flex-row items-center gap-2">
          <p>Project status : </p>
          <Chip
            className="capitalize"
            color={props.project.is_ready ? "success" : "danger"}
            size="sm"
            variant="flat"
          >
            {props.project.is_ready ? "Online" : "Offline"}
          </Chip>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" variant="light" onPress={onClose}>
          Close
        </Button>
      </ModalFooter>
    </>
  );
}
