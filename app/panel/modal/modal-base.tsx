import { useDisclosure } from "@nextui-org/react";
import { ReactNode, useState } from "react";
import toast from "react-hot-toast";

function useModal(){
  const [modalContent, setModalContent] = useState(<></>);
  const disclosure = useDisclosure();
  const [modalSize,setModalSize] = useState< "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full">("md")

  const openModal = (content : JSX.Element,size : typeof modalSize = "md")=>{
    setModalSize(size)
    setModalContent(content)
    disclosure.onOpen()
  }

  return {modalContent,setModalContent,openModal,modalSize,setModalSize,disclosure}
}

// interface ChildrenModal {
//   disclosure: ReturnType<typeof useDisclosure>;

// }

interface ContextModal {
  children: ReactNode;
  disclosure: ReturnType<typeof useDisclosure>;
  modalSize:
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "full";
}

interface ModalView {
  modal : ReturnType<typeof useModal>
  notification : typeof toast
}
export default useModal;
export type { ModalView, ContextModal };
