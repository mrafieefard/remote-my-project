"use client";

import { useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import { FaRightFromBracket } from "react-icons/fa6";

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const menuItems = ["logs","projects", "overview", "settings"];
  const activeItem = menuItems.indexOf(pathname.split("/")[2]);

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <p className="font-bold text-inherit">RMP</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-6" justify="center">
        {menuItems.map((value, index) => (
          <NavbarItem key={`${value}-${index}`}>
            <Link
            className="cursor-pointer"
              color={activeItem == index ? "primary" : "foreground"}
              onClick={() => {
                router.push(`/panel/${value}`, { scroll: false });
              }}
            >
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Dropdown>
            <DropdownTrigger>
              <Button as={Link} color="danger" variant="flat">
                Logout
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem
                key="logout"
                color="danger"
                onClick={() => {
                  localStorage.removeItem("token");
                  setTimeout(() => {
                    router.push("/login", { scroll: false });
                  }, 1000);
                }}
              >
                Logout confirm
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((value, index) => (
          <NavbarMenuItem key={`${value}-${index}`}>
            <Link
              className={"w-full"}
              color={activeItem == index ? "primary" : "foreground"}
              onClick={() => {
                router.push(`/panel/${value}`, { scroll: false });
              }}
              size="lg"
            >
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
