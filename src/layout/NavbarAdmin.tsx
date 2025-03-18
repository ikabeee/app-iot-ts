import { Button } from "@heroui/button"
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown"
import { Input } from "@heroui/input"
import { Navbar, NavbarBrand, NavbarContent } from "@heroui/navbar"
import { User } from "@heroui/user"
import { LogOut, Menu, SearchIcon } from "lucide-react"

interface NavbarAdminProps {
    toggleSidebar: () => void
}

export default function NavbarAdmin({ toggleSidebar }: NavbarAdminProps) {
    return (
        <Navbar isBordered classNames={{wrapper: "px-0 sm:px-4",brand: "gap-0"}}>
            <NavbarBrand className="gap-0 pl-2" >
                <Button isIconOnly variant="light" onPress={toggleSidebar} aria-label="Toggle sidebar" className="">
                    <Menu size={24} />
                </Button>
            </NavbarBrand>

            <NavbarContent as="div" className="items-center" justify="end">
                <Input
                    classNames={{
                        base: "max-w-full sm:max-w h-10",
                        mainWrapper: "h-full",
                        input: "text-small",
                        inputWrapper: "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
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
                            avatarProps={{
                                src: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
                                size: "sm",
                                isBordered: true,
                                color: "secondary",
                                as: "button",
                                isFocusable: true,
                            }}
                            name="Jane Doe"
                            description="Administrator"
                            classNames={{ base: "transition-transform" }}
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

