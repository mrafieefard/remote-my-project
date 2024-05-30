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
import { UserResponse } from "../../http/base";
import { FaEye, FaTrash } from "react-icons/fa";
import { FaEllipsisVertical } from "react-icons/fa6";
import { useModalContext } from "@/app/contexts/modal-context";
import { UseQueryResult } from "react-query";
import DeleteUserConfirm from "@/app/modal/modal-views/users/delete-user-confirm";

interface props {
  users: UseQueryResult<UserResponse[] | undefined>;
}

export default function UsersTable(props: props) {
  const modalContext = useModalContext();

  const actions = [
    {
      name: "Delete",
      icon: <FaTrash />,
      onPress: (user: UserResponse) => {
        modalContext.modal.openModal(
          <DeleteUserConfirm
            refetch={props.users.refetch}
            user={user}
          />
        );
      },
    },
  ];

  const renderCell = useCallback((user: UserResponse, columnKey: Key) => {
    const cellValue = user[columnKey as keyof UserResponse];

    switch (columnKey) {

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
                      value.name == "Delete"
                        ? "text-danger cursor-pointer "
                        : "text-default-400 cursor-pointer "
                    } active:opacity-50`}
                    onClick={() => value.onPress(user)}
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
                      onPress={() => value.onPress(user)}
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
          { name: "USERNAME", uid: "username" },
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
      <TableBody items={props.users.data} emptyContent={"No user to display."}>
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
