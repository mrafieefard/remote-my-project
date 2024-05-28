import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { memo } from "react";
import { FaChevronDown } from "react-icons/fa";
import { useLogsContext } from "../../../contexts/log-context";
import {  useQuery } from "react-query";
import { http_get_projects } from "@/app/http/client";

const LOG_LEVELS = ["Info", "Debug", "Success", "Warning", "Error"];

export function Filters() {
  const context = useLogsContext();

  const projects_res = useQuery(
    "projects",
    async () => {
      try {
        return await http_get_projects("");
      } catch (error) {
        // handle_error(error, toast, router);
      }
    },
    {
      refetchOnWindowFocus: false,
    }
  );


  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button
            className="min-w-min"
            endContent={<FaChevronDown className="text-xs" />}
          >
            Level
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          disallowEmptySelection
          closeOnSelect={false}
          selectionMode="multiple"
          selectedKeys={context.filters.level.value}
          onSelectionChange={context.filters.level.set}
        >
          {LOG_LEVELS.map((value) => (
            <DropdownItem key={value}>{value}</DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
      <Dropdown>
        <DropdownTrigger>
          <Button
            isLoading={projects_res.isLoading}
            className="min-w-min"
            endContent={<FaChevronDown className="text-xs" />}
          >
            Project
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          disallowEmptySelection
          closeOnSelect={false}
          selectionMode="multiple"
          selectedKeys={context.filters.project.value}
          onSelectionChange={context.filters.project.set}
        >
          {projects_res.data ? (
            projects_res.data.map((value) => (
              <DropdownItem key={value.id}>{value.title}</DropdownItem>
            ))
          ) : (
            <></>
          )}
        </DropdownMenu>
      </Dropdown>
    </>
  );
}

export default memo(Filters);
