import { Button } from "@heroui/button";
import { LayoutDashboardIcon, LogOut } from "lucide-react"
import { Link } from "react-router";
export default function SidebarAdmin() {
    const menuItems = [
        {
            id: 1,
            icon: <LayoutDashboardIcon className="text-inherit" />,
            label: "Dashboard",
            to: '/'
        },
        {
            id: 2,
            icon: <LogOut className="text-inherit" />,
            label: 'Salir',
            to: '/'
        }
    ]
    return (
        <aside className="relative w-60 h-screen bg-[#F1F2F7] p-4 flex flex-col">
            <div className="space-y-6">
                <nav className="absolute bottom-4 left-4 flex flex-col gap-4">
                    {menuItems.slice(1).map((item) => (
                        <Link key={item.id} to={item.to}>
                            <Button
                                key={item.id}
                                className="flex items-center justify-start gap-x-4 pl-4 w-[200px] h-[42px] font-medium"
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

            <nav className="space-y-2">
                {menuItems.slice(0, 1).map((item) => (
                    <Link key={item.id} to={item.to}>
                        <Button
                            key={item.id}
                            className="flex items-center justify-start gap-x-4 pl-4 w-[200px] h-[42px] font-medium"
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
        </aside>
    )
}