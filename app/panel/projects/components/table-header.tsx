import { Button, Input } from "@nextui-org/react";
import { FaMagnifyingGlass, FaPlus, FaRotate } from "react-icons/fa6";
import { UseQueryResult } from "react-query";
import { useAlertContext } from "@/app/contexts/alert-context";
import CreateProjectModal from "@/app/modal/modal-views/create-project-modal"

interface props {
    queryData : UseQueryResult<any, any>
}

export default function TableHeader(props: props) {
    const alertContext = useAlertContext()
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
                  alertContext.modal.openModal(
                    <CreateProjectModal
                     
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
                  alertContext.modal.openModal(
                    <CreateProjectModal
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
