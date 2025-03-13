import { Avatar } from "@heroui/avatar";
import { Input } from "@heroui/input";
import { Navbar, NavbarContent } from "@heroui/navbar";
import { SearchIcon } from "lucide-react";

export default function NavbarAdmin() {
    return (
        <Navbar isBordered>
            <NavbarContent as="div" justify="end">
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
                    startContent={<SearchIcon/>}
                />
                <Avatar
                    isBordered
                    as="button"
                    className="transition-transform"
                    name="John Doe"
                    size="sm"
                    src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                />
            </NavbarContent>
        </Navbar>
    )
}