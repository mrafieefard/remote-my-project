import { useOverviewContext } from "@/app/contexts/overview-context";
import { WidgetResponse } from "@/app/http/base";
import { Button, Input } from "@nextui-org/react";
import { FaMagnifyingGlass, FaPlus, FaRotate } from "react-icons/fa6";
import { UseQueryResult } from "react-query";

interface props {
    queryData : UseQueryResult<WidgetResponse[] | undefined>
}


export default function WidgetsHeader(props : props){
    const overviewContext = useOverviewContext()

    return (
        <div className="flex justify-between">
            <div>
              <Input
                placeholder="Search in widgets"
                startContent={<FaMagnifyingGlass />}
                value={overviewContext.filters.search.value}
                onValueChange={overviewContext.filters.search.set}
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
                color="primary"
                
              >
                Add Widget
              </Button>

              
            </div>
          </div>
    )
}