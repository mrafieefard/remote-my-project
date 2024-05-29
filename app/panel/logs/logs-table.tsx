import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@nextui-org/react";
import { Key, useCallback } from "react";
import { LogData } from "../../http/base";
import { FaTrash } from "react-icons/fa";
import { FaEllipsisVertical } from "react-icons/fa6";

import { useAlertContext } from "@/app/contexts/alert-context";
import { useHttpContext } from "@/app/contexts/http-context";

interface props {
  logs: LogData[];
  isLoading: boolean;
  refetchLogs: () => void;
  pagination : JSX.Element
}

export default function LogsTable(props: props) {
  const alertContext = useAlertContext()
  const httpContext = useHttpContext()
  const actions = [
    {
      name: "Delete",
      icon: <FaTrash />,
      onPress: (log: LogData) => {
        httpContext.httpClient.http_delete_log(log.id).then(() => {
          props.refetchLogs();
          alertContext.toast.success("Log delted")
          
        });
      },
    },
  ];

  const renderCell = useCallback((log: LogData, columnKey: Key) => {
    const cellValue = log[columnKey as keyof LogData];
    
    switch (columnKey) {

      case "level":
        return (
          <Chip
            className="capitalize"
            color={
              cellValue == 0
                ? "default"
                : cellValue == 1
                ? "primary"
                : cellValue == 2
                ? "success"
                : cellValue == 3
                ? "warning"
                : cellValue == 4
                ? "danger"
                : "default"
            }
            size="md"
            variant="flat"
          >
            {cellValue == 0
              ? "INFO"
              : cellValue == 1
              ? "DEBUG"
              : cellValue == 2
              ? "SUCCESS"
              : cellValue == 3
              ? "WARNING"
              : cellValue == 4
              ? "ERROR"
              : "INFO"}
          </Chip>
        );
      case "actions":
        return (
          <>
            <div className="hidden md:flex relative items-center gap-4">
              {actions.map((value,index) => (
                <Tooltip
                key={`${value.name}-${index}`}
                  content={value.name}
                  color={value.name == "Delete" ? "danger" : "default"}
                >
                  <span
                    className={`text-lg ${
                      value.name == "Delete"
                        ? "text-danger"
                        : "text-default-400"
                    } cursor-pointer active:opacity-50`}
                    onClick={() => value.onPress(log)}
                  >
                    {value.icon}
                  </span>
                </Tooltip>
              ))}
            </div>

            <div className="flex md:hidden">
              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly size="sm" variant="light">
                    <FaEllipsisVertical />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  {actions.map((value,index) => (
                    <DropdownItem
                    key={`${value.name}-${index}`}
                      onPress={() => value.onPress(log)}
                      className={value.name == "Delete" ? "text-danger" : ""}
                    >
                      {value.name}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </div>
          </>
        );
      default:
        return <p>{cellValue.toString()}</p>;
    }
  }, []);

  return (
    <Table isStriped bottomContent={props.pagination}>
      <TableHeader
        columns={[
          { name: "LEVEL", uid: "level" },
          { name: "TIME", uid: "time_ago" },
          { name: "PROJECT", uid: "project_name" },
          { name: "CONTENT", uid: "content" },
          { name: "ACTION", uid: "actions" },
        ]}
      >
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={props.logs} emptyContent={"No log to display."}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
