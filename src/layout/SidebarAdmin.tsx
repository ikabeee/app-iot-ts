import { Button } from "@heroui/button";
import { Image } from "@heroui/image";
import { LayoutDashboardIcon, Trash } from "lucide-react"
import { Link } from "react-router";

export default function SidebarAdmin() {
    const menuItems = [
        {
            id: 1,
            icon: <LayoutDashboardIcon className="text-inherit" />,
            label: "Dashboard",
            to: ''
        },
        {
            id: 2,
            icon: <Trash className="text-inherit"/>,
            label: "Parcelas eliminadas",
            to: 'deletedPlots'
        }
    ]

    return (
        <div className="w-64 h-full bg-[#F1F2F7] p-4 flex flex-col shadow-md">
            <div className="flex justify-between items-center mb-6">
                <Link to="/admin">
                    <Image className="justify-center items-center" alt="Logo" src="./../../public/Bamboo.svg" width={180} height={42} />
                </Link>
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
        </div>
    )
}