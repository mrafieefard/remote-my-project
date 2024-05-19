import { Button, Input } from "@nextui-org/react";
import { FaMagnifyingGlass, FaPlus, FaRotate } from "react-icons/fa6";
import CreateProjectModal from "../../modal/modal-views/create-project-modal";
import { UseQueryResult } from "react-query";
import useModal, { ModalView } from "../../modal/modal-base";
import toast from "react-hot-toast";

interface props {
    queryData : UseQueryResult<any, any>
    view : ModalView
}

export default function TableHeader(props: props) {
    
    return (
        <div className="flex justify-between">
            <div>
              <Input
                placeholder="Search in projects"
                startContent={<FaMagnifyingGlass />}
              />
            </div>
            <div className="flex flex-row gap-2">
              <Button
                isLoading={props.queryData.isLoading || props.queryData.isFetching}
                isIconOnly
                color="primary"
                onPress={() => {
                    props.queryData.refetch();
                }}
              >
                {props.queryData.isLoading || props.queryData.isFetching ? <></> : <FaRotate />}
              </Button>
              <Button
                className="hidden md:flex"
                color="primary"
                onPress={() => {
                  props.view.modal.openModal(
                    <CreateProjectModal
                      view={props.view}
                     
                      refetchProjects={props.queryData.refetch}
                    />
                  );
                }}
              >
                Add new <FaPlus />
              </Button>

              <Button
                className="flex md:hidden"
                isIconOnly
                color="primary"
                onPress={() => {
                  props.view.modal.openModal(
                    <CreateProjectModal
                      view={props.view}
                      refetchProjects={props.queryData.refetch}
                    />
                  );
                }}
              >
                <FaPlus />
              </Button>
            </div>
          </div>
    )
}
