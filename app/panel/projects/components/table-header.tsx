import { Button, Input } from "@nextui-org/react";
import { FaMagnifyingGlass, FaPlus, FaRotate } from "react-icons/fa6";
import { UseQueryResult } from "react-query";
import { useAlertContext } from "@/app/contexts/alert-context";
import CreateProject from "@/app/modal/modal-views/projects/create-project"
import { useProjectsContext } from "@/app/contexts/project-context";
import { useModalContext } from "@/app/contexts/modal-context";

interface props {
    queryData : UseQueryResult<any, any>
}

export default function TableHeader(props: props) {
    const modalContext = useModalContext()
    const projectContext = useProjectsContext()
    return (
        <div className="flex justify-between">
            <div>
              <Input
                placeholder="Search in projects"
                startContent={<FaMagnifyingGlass />}
                value={projectContext.filters.search.value}
                onValueChange={projectContext.filters.search.set}
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
                  modalContext.modal.openModal(
                    <CreateProject
                     
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
                  modalContext.modal.openModal(
                    <CreateProject
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
