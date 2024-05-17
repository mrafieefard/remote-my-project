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
import { LogData, LogsResponse } from "../../http/base";
import { FaTrash } from "react-icons/fa";
import { FaEllipsisVertical } from "react-icons/fa6";
import { ModalViewProps } from "../modal/modal-base";

import PanelHttp from "../../http/panel";
import toast from "react-hot-toast";

interface props {
  logs: LogData[];
  isLoading: boolean;
  modal: ModalViewProps;
  http: PanelHttp;
  toastContext : typeof toast
  refetchLogs: () => void;
  pagination : JSX.Element
}

function timeAgo(timestamp: number): string {

  const timestampMs = timestamp * 1000;

  const timestampDate = new Date(timestampMs);

  const timeDiff = Date.now() - timestampDate.getTime();

  const units: [string, number][] = [
    ["year", 365 * 24 * 60 * 60 * 1000],
    ["month", 30 * 24 * 60 * 60 * 1000],
    ["week", 7 * 24 * 60 * 60 * 1000],
    ["day", 24 * 60 * 60 * 1000],
    ["hour", 60 * 60 * 1000],
    ["minute", 60 * 1000],
    ["second", 1000],
  ];


  for (const [unit, millisecondsPerUnit] of units) {
    const interval = Math.floor(timeDiff / millisecondsPerUnit);
    if (interval > 0) {
      if (interval === 1) {
        return `${interval} ${unit} ago`;
      } else {
        return `${interval} ${unit}s ago`;
      }
    }
  }

  return "Just now";
}

export default function LogsTable(props: props) {

  const actions = [
    {
      name: "Delete",
      icon: <FaTrash />,
      onClick: (log: LogData) => {
        props.http.delete_log(log.id).then((value) => {
          if (value.success){
            props.refetchLogs();
            props.toastContext.success(value.data!)
          }else{
            props.toastContext.error(value.error!)
          }
          
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
                    onClick={() => value.onClick(log)}
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
                      onClick={() => value.onClick(log)}
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
        console.log(cellValue);
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
