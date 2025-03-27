import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown"
import { Input } from "@heroui/input"
import { Navbar, NavbarBrand, NavbarContent } from "@heroui/navbar"
import { User } from "@heroui/user"
import { LogOut, SearchIcon, Bell } from "lucide-react"
import { Button } from "@heroui/button"

export default function NavbarAdmin() {
    return (
        <Navbar 
            isBordered 
            classNames={{
                wrapper: "px-4 sm:px-6",
                base: "bg-white/70 backdrop-blur-md",
                brand: "gap-0"
            }}
        >
            <NavbarBrand className="gap-0">
            </NavbarBrand>

            <NavbarContent as="div" className="items-center gap-2 sm:gap-4" justify="end">
                <Input
                    classNames={{
                        base: "hidden sm:block max-w-[300px] h-10",
                        mainWrapper: "h-full",
                        input: "text-small",
                        inputWrapper: "h-full font-normal text-default-500 bg-default-100 hover:bg-default-200 focus-within:bg-default-100",
                    }}
                    placeholder="Escribe para buscar..."
                    size="sm"
                    type="search"
                    startContent={<SearchIcon className="text-default-400" />}
                />

                <Button
                    isIconOnly
                    variant="light"
                    color="secondary"
                    className="h-10 w-10"
                    aria-label="Buscar"
                >
                    <SearchIcon className="w-5 h-5" />
                </Button>

                <Button
                    isIconOnly
                    variant="light"
                    color="secondary"
                    className="h-10 w-10"
                    aria-label="Notificaciones"
                >
                    <Bell className="w-5 h-5" />
                </Button>

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
                            classNames={{ 
                                base: "transition-transform hover:scale-105",
                                name: "font-medium",
                                description: "text-default-500"
                            }}
                        />
                    </DropdownTrigger>
                    <DropdownMenu 
                        aria-label="Profile Actions" 
                        variant="flat"
                        className="p-2"
                    >
                        <DropdownItem 
                            key="profile" 
                            className="gap-2"
                        >
                            Mi Perfil
                        </DropdownItem>
                        <DropdownItem 
                            key="settings" 
                            className="gap-2"
                        >
                            Configuración
                        </DropdownItem>
                        <DropdownItem 
                            key="logout" 
                            className="gap-2 text-danger" 
                            color="danger" 
                            variant="flat"
                            startContent={<LogOut className="w-4 h-4" />}
                            href="/"
                        >
                            Cerrar sesión
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </NavbarContent>
        </Navbar>
    )
}

