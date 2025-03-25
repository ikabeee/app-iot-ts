import { Button } from "@heroui/button";
import { Image } from "@heroui/image";
import { LayoutDashboardIcon, Trash, Menu } from "lucide-react";
import { Link } from "react-router";

interface SidebarAdminProps {
    isCollapsed: boolean;
    setIsCollapsed: (isCollapsed: boolean) => void;
}

export default function SidebarAdmin({ isCollapsed, setIsCollapsed }: SidebarAdminProps) {
    const menuItems = [
        {
            id: 1,
            icon: <LayoutDashboardIcon className="text-inherit" />,
            label: "Dashboard",
            to: ''
        },
        {
            id: 2,
            icon: <Trash className="text-inherit" />,
            label: "Parcelas eliminadas",
            to: 'deletedPlots'
        }
    ];

    return (
        <div className={`h-full bg-[#F1F2F7] p-4 flex flex-col shadow-md transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
            <div className="flex justify-between items-center mb-6">
                <Link to="/admin" className="flex-1">
                    {!isCollapsed && (
                        <Image className="justify-center items-center" alt="Logo" src="./../../public/Bamboo.svg" width={180} height={42} />
                    )}
                </Link>
                <Button
                    onPress={() => setIsCollapsed(!isCollapsed)}
                    className={`flex items-center justify-center transition-all duration-300 ${isCollapsed ? 'w-8 h-12' : 'w-12 h-12'}`}
                    size="md"
                    radius="sm"
                    variant="light"
                    color="secondary"
                    type="submit">
                    <Menu />
                </Button>
            </div>

            <nav className="flex flex-col space-y-2">
                {menuItems.map((item) => (
                    <Link key={item.id} to={item.to} className="group">
                        <Button
                            key={item.id}
                            className={`flex items-center justify-start gap-x-4 w-full ${isCollapsed ? 'h-10' : 'h-[42px]'} font-medium transition-all duration-300 ${isCollapsed ? 'pl-0' : 'pl-4'}`}
                            size={isCollapsed ? "sm" : "md"}
                            radius="sm"
                            variant="light"
                            color="secondary"
                            type="submit"
                        >
                            {item.icon}
                            <span className={`transition-opacity duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
                                {item.label}
                            </span>
                        </Button>
                    </Link>
                ))}
            </nav>
        </div>
    );
}
