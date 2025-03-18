import { Button } from "@heroui/button";
import { Image } from "@heroui/image";
import { DoorClosed, LayoutDashboardIcon, Menu } from "lucide-react"
import { Link } from "react-router";
interface SidebarAdminProps {
    onClose: () => void;
}
export default function SidebarAdmin({ onClose }: SidebarAdminProps) {
    const menuItems = [
        {
            id: 1,
            icon: <LayoutDashboardIcon className="text-inherit" />,
            label: "Dashboard",
            to: ''
        }
    ]

    return (
        <div className="w-64 h-full bg-[#F1F2F7] p-4 flex flex-col shadow-md">
            <div className="flex justify-between items-center mb-6">
                <Link to="">
                    <Image className="justify-center" alt="Logo" src="./../../public/Bamboo.svg" width={180} height={42} />
                </Link>
                <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    color="secondary"
                    onPress={onClose}
                    className="lg:hidden"
                    aria-label="Close sidebar"
                >
                    <Menu size={20} />
                </Button>
            </div>

            <nav className="flex flex-col space-y-2">
                {menuItems.map((item) => (
                    <Link key={item.id} to={item.to}>
                        <Button
                            key={item.id}
                            className="flex items-center justify-start gap-x-4 pl-4 w-full h-[42px] font-medium"
                            size="md"
                            radius="sm"
                            variant="light"
                            color="secondary"
                            type="submit"
                        >
                            {item.icon}
                            {item.label}
                        </Button>
                    </Link>
                ))}
            </nav>

            <div className="mt-auto pt-4">
                <Button
                    startContent={<DoorClosed />}
                    className="w-full h-[42px]"
                    size="md"
                    variant="solid"
                    color="secondary"
                    onPress={onClose}
                >
                    Cerrar
                </Button>
            </div>
        </div>
    )
}