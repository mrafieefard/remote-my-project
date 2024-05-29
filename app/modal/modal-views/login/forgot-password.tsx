import {
  Button,
  ModalBody,
  Snippet,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { Tabs, Tab } from "@nextui-org/react";
import { ProjectResponse } from "@/app/http/base";
import { usePathname } from "next/navigation";
import { CopyBlock, dracula } from "react-code-blocks";
import { useAlertContext } from "@/app/contexts/alert-context";
import { FaCircleInfo } from "react-icons/fa6";
import { useModalContext } from "@/app/contexts/modal-context";

export default function ForgotPassword() {
  const modalContext = useModalContext();
  const { onClose } = modalContext.modal.disclosure;

  //   docker exec -it rmp-database psql -U postgres -d rmpdb -c "DELETE FROM clients;"
  return (
    <>
      <ModalHeader className="flex flex-col gap-1">Forgot password</ModalHeader>
      <ModalBody>
        <div className="flex w-full flex-col gap-2">
          <div className="flex flex-row items-center gap-2 bg-warning-200/[.75] border-warning-500 border-1  p-4 rounded-md">
            <FaCircleInfo/>
            <p>execute this function will delete all users in database</p>
          </div>
          <p>
            If you forgot your username or password as admin user, you can
            execute this function in your server
          </p>
          <Snippet symbol="" className="break-words" variant="bordered">
            <span>docker exec -it rmp-database psql -U postgres -d rmpdb -c &apos;DELETE
            FROM clients;&apos;</span>
          </Snippet>
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
