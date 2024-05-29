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
import { FaEye, FaPen, FaTrash } from "react-icons/fa";
import { FaCirclePlay, FaEllipsisVertical } from "react-icons/fa6";
import { useAlertContext } from "@/app/contexts/alert-context";
import DetailProject from "@/app/modal/modal-views/projects/detail-project";
import UseProject from "@/app/modal/modal-views/projects/use-project";
import EditProject from "@/app/modal/modal-views/projects/edit-project";
import DeleteProject from "@/app/modal/modal-views/projects/delete-project";
import { useModalContext } from "@/app/contexts/modal-context";

interface props {
  projects: ProjectResponse[];
  isLoading: boolean;
  refetchProjects: () => void;
}

export default function ProjectPage(props: props) {
  const modalContext = useModalContext()
  
  const actions = [
    {
      name: "Details",
      icon: <FaEye />,
      onPress: (project: ProjectResponse) => {
        modalContext.modal.openModal(<DetailProject project={project} />);
      },
    },
    {
      name: "Use project",
      icon: <FaCirclePlay />,

      onPress: (project: ProjectResponse) => {
        modalContext.modal.openModal(<UseProject project={project} />, "5xl");
      },
    },
    {
      name: "Edit",
      icon: <FaPen />,
      onPress: (project: ProjectResponse) => {
        if (!project.is_active) {
          modalContext.modal.openModal(
            <EditProject
              refetchProjects={props.refetchProjects}
              project={project}
            />
          );
        }
      },
    },
    {
      name: "Delete",
      icon: <FaTrash />,
      onPress: (project: ProjectResponse) => {
        modalContext.modal.openModal(
          <DeleteProject
            refetchProjects={props.refetchProjects}
            project={project}
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
              {actions.map((value, index) => (
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
                    onClick={() => value.onPress(project)}
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
                  {actions.map((value, index) => (
                    <DropdownItem
                      key={`${value.name}-${index}`}
                      isReadOnly={project.is_ready}
                      onPress={() => value.onPress(project)}
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
