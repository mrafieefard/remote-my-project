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
import { ProjectResponse } from "../../http/base";
import { FaEye, FaPen, FaScroll, FaTrash } from "react-icons/fa";
import { FaEllipsisVertical } from "react-icons/fa6";
import { ModalViewProps } from "../modal/modal-base";
import DetailModal from "../modal/modal-views/detail-project-modal";
import LogsModal from "../modal/modal-views/logs-project-modal";
import DeleteModal from "../modal/modal-views/delete-project-modal";
import toast from "react-hot-toast";

interface props {
  projects: ProjectResponse[];
  isLoading: boolean;
  modal: ModalViewProps;
  refetchProjects: () => void;
}

export default function ProjectPage(props: props) {
  
  const openModal = (modal: JSX.Element) => {
    props.modal.setModalContent(modal);
    props.modal.disclosure.onOpen();
  };

  const actions = [
    {
      name: "Details",
      icon: <FaEye />,
      onClick: (project: ProjectResponse) => {
        openModal(
          <DetailModal
            project={project}
            modal={{
              disclosure: props.modal.disclosure,
              notificationContext: toast,
            }}
          />
        );
      },
    },
    {
      name: "Logs",
      icon: <FaScroll />,
      onClick: (project: ProjectResponse) => {
        openModal(
          <LogsModal
            disclosure={props.modal.disclosure}
            notificationContext={toast}
          />
        );
      },
    },
    {
      name: "Edit",
      icon: <FaPen />,
      onClick: (project: ProjectResponse) => {
        openModal(
           <DeleteModal
            refetchProjects={props.refetchProjects}
            project={project}
            modal={{
              disclosure: props.modal.disclosure,
              notificationContext: toast,
            }}
          />
        );
      },
    },
    {
      name: "Delete",
      icon: <FaTrash />,
      onClick: (project: ProjectResponse) => {
        openModal(
          <DeleteModal
            refetchProjects={props.refetchProjects}
            project={project}
            modal={{
              disclosure: props.modal.disclosure,
              notificationContext: toast,
            }}
          />
        );
      },
    },
  ];

  const renderCell = useCallback((project: ProjectResponse, columnKey: Key) => {
    const cellValue = project[columnKey as keyof ProjectResponse];

    switch (columnKey) {
      case "up_time":
        const up_time = parseFloat(cellValue.toString());
        return (
          <p
            className={
              up_time <= 25
                ? "text-danger-500"
                : up_time <= 50
                ? "text-warning-500"
                : up_time <= 75
                ? "text-success-500"
                : "text-success-500"
            }
          >
            {up_time <= 0 ? "0" : up_time}
          </p>
        );

      case "is_active":
        return (
          <Chip
            className="capitalize"
            color={cellValue ? "success" : "danger"}
            size="sm"
            variant="flat"
          >
            {cellValue ? "Online" : "Offline"}
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
                      project.is_active && value.name == "Edit"
                        ? "text-default-200 cursor-not-allowed"
                        : value.name == "Delete"
                        ? "text-danger cursor-pointer "
                        : "text-default-400 cursor-pointer "
                    } active:opacity-50`}
                    onClick={() => {
                      if (project.is_active && value.name == "Edit") return;
                      value.onClick(project);
                    }}
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
                      isReadOnly={project.is_ready}
                      onClick={() => value.onClick(project)}
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
    <Table isStriped>
      <TableHeader
        columns={[
          { name: "ID", uid: "id" },
          { name: "NAME", uid: "title" },
          { name: "STATUS", uid: "is_active" },
          { name: "UPTIME ( % )", uid: "up_time" },
          { name: "ACTIONS", uid: "actions" },
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
      <TableBody items={props.projects} emptyContent={"No project to display."}>
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
