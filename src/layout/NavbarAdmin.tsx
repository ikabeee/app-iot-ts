import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown";
import { Input } from "@heroui/input";
import { Navbar, NavbarContent } from "@heroui/navbar";
import { User } from "@heroui/user";
import { LogOut, SearchIcon } from "lucide-react";

export default function NavbarAdmin() {
    return (
        <Navbar isBordered>
            <NavbarContent as="div" className="items-center" justify="end">
                <Input
                    classNames={{
                        base: "max-w-full sm:max-w h-10",
                        mainWrapper: "h-full",
                        input: "text-small",
                        inputWrapper:
                            "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
                    }}
                    placeholder="Escribe para buscar"
                    size="sm"
                    type="search"
                    startContent={<SearchIcon />}
                />

                <Dropdown placement="bottom-end" backdrop="blur">
                    <DropdownTrigger>
                        <User
                            as="button"
                            avatarProps={{ src: "https://i.pravatar.cc/150?u=a042581f4e29026704d", size: "sm", isBordered: true, color: "secondary", as: "button", isFocusable: true }}
                            name="Jane Doe"
                            description="Administrator"
                            classNames={{ base: "transition-transform", }}
                        />
                    </DropdownTrigger>
                    <DropdownMenu as="button" aria-label="Profile Actions" variant="flat">
                        <DropdownItem color="danger" variant="faded" key="logout" href="/" startContent={<LogOut />}>
                            Cerrar sesión
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </NavbarContent>
        </Navbar>
    )
}