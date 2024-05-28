import { LogsResponse } from "@/app/http/base";
import {
  Button,
  Input,
} from "@nextui-org/react";
import {  FaTrash } from "react-icons/fa";
import { FaMagnifyingGlass, FaRotate } from "react-icons/fa6";
import { UseQueryResult } from "react-query";
import React from "react";
import Filters from "./filters";
import ClearLogConfirm from "@/app/modal/modal-views/logs/clear-log-confirm";
import { useAlertContext } from "@/app/contexts/alert-context";
import { useLogsContext } from "@/app/contexts/log-context";

interface props {
  logsData: UseQueryResult<LogsResponse | undefined, unknown>;
}

export default function TableHeader(props: props) {
  const alertContext = useAlertContext()
  const logsContext = useLogsContext()
  const clearLogs = () => {
    alertContext.modal.openModal(
      <ClearLogConfirm
        refetchLogs={props.logsData.refetch}
      />
    );
  };

  return (
    <div className="flex justify-between">
      <div className="flex flex-row gap-2">
        <div className="flex md:hidden flex-col gap-2">
          <Input
            placeholder="Search in logs"
            startContent={<FaMagnifyingGlass />}
            value={logsContext.filters.search.value}
            onValueChange={logsContext.filters.search.set}
          />
          <div className="flex flex-row gap-2">
            <Filters />
          </div>
        </div>
        <div className="hidden md:flex gap-2">
          <Input
            placeholder="Search in logs"
            startContent={<FaMagnifyingGlass />}
            value={logsContext.filters.search.value}
            onValueChange={logsContext.filters.search.set}
          />
          <Filters />
        </div>
      </div>
      <div className="flex flex-row gap-2">
        <Button
          isLoading={props.logsData.isLoading || props.logsData.isFetching}
          isIconOnly
          color="primary"
          onPress={() => {
            props.logsData.refetch();
          }}
        >
          {props.logsData.isLoading || props.logsData.isFetching ? (
            <></>
          ) : (
            <FaRotate />
          )}
        </Button>
        <Button className="hidden md:flex" color="danger" onPress={clearLogs}>
          Clear all logs <FaTrash />
        </Button>

        <Button
          className="flex md:hidden"
          isIconOnly
          onPress={clearLogs}
          color="danger"
        >
          <FaTrash />
        </Button>
      </div>
    </div>
  );
}
