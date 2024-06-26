import { Button, ModalBody, ModalFooter, ModalHeader } from "@nextui-org/react";
import { Tabs, Tab } from "@nextui-org/react";
import { ProjectResponse } from "@/app/http/base";
import { CopyBlock, dracula } from 'react-code-blocks';
import { useModalContext } from "@/app/contexts/modal-context";

interface props {
  project: ProjectResponse;
}

export default function UseProject(props: props) {
  const modalContext = useModalContext()
  const { onClose } = modalContext.modal.disclosure;;
  const codes = {
    python : `from rmp_py import Client,Context,Function,Argument
from rmp_py.types import String,Log
    
def print_function(ctx : Context,text):
  print(text)
  ctx.send_group_message(text)
  ctx.close_group("Finish")
    
def run(client : Client):
  client.send_log(Log.INFO,"Project run")
        
client = Client("${window.location.host}","${props.project.id}","${props.project.secret}",[
    Function("print",print_function,(
        Argument("text",String),
    ))
],run,reconnect=True,reconnect_delay=5)
    
client.run()`
  }
  

  return (
    <>
      <ModalHeader className="flex flex-col gap-1">Use it</ModalHeader>
      <ModalBody>
        <div className="flex w-full flex-col">
          <Tabs aria-label="Options">
            <Tab key="python" title="Python">
            <CopyBlock text={codes.python} language="python" theme={dracula}/>
            </Tab>
            
          </Tabs>
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
