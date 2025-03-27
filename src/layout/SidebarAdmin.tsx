import { Button } from "@heroui/button";
import { Image } from "@heroui/image";
import { LayoutDashboardIcon, Trash, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router";
import { useState, useEffect } from "react";
import { Card } from "@heroui/card";
import { Divider } from "@heroui/divider";

interface SidebarAdminProps {
    isCollapsed: boolean;
    setIsCollapsed: (isCollapsed: boolean) => void;
}

export default function SidebarAdmin({ isCollapsed, setIsCollapsed }: SidebarAdminProps) {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    // Cerrar el menú móvil cuando cambia la ruta
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    const menuItems = [
        {
            id: 1,
            icon: <LayoutDashboardIcon className="w-5 h-5" />,
            label: "Dashboard",
            to: '/admin'
        },
        {
            id: 2,
            icon: <Trash className="w-5 h-5" />,
            label: "Parcelas eliminadas",
            to: '/admin/deletedPlots'
        }
    ];

    return (
        <>
            {/* Botón del menú móvil */}
            <Button
                onPress={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden fixed top-4 left-4 z-50"
                size="sm"
                radius="sm"
                variant="flat"
                color="secondary"
                isIconOnly
            >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>

            {/* Overlay para el menú móvil */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <Card 
                className={`fixed lg:relative h-full flex flex-col transition-all duration-300 ease-in-out z-50 rounded-none
                    ${isCollapsed ? 'w-20' : 'w-64'}
                    ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
            >
                <div className="p-4 flex justify-between items-center">
                    <Link to="/admin" className="flex-1 min-w-0">
                        {!isCollapsed && (
                            <Image 
                                className="max-w-full h-auto" 
                                alt="Logo" 
                                src="/Bamboo.svg" 
                                width={140} 
                                height={35} 
                            />
                        )}
                    </Link>
                    <Button
                        onPress={() => setIsCollapsed(!isCollapsed)}
                        className="hidden lg:flex"
                        size="sm"
                        radius="sm"
                        variant="light"
                        color="secondary"
                        isIconOnly
                    >
                        <Menu className="w-5 h-5" />
                    </Button>
                </div>

                <Divider />

                <nav className="flex-1 p-2 overflow-y-auto">
                    <div className="flex flex-col gap-1">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.to;
                            return (
                                <Link key={item.id} to={item.to}>
                                    <Button
                                        className={`w-full justify-start ${isCollapsed ? 'px-0' : 'px-4'}`}
                                        size="sm"
                                        radius="sm"
                                        variant={isActive ? "flat" : "light"}
                                        color={isActive ? "secondary" : "default"}
                                        startContent={!isCollapsed && item.icon}
                                    >
                                        {isCollapsed ? (
                                            <div className="flex justify-center w-full">
                                                {item.icon}
                                            </div>
                                        ) : (
                                            <span>{item.label}</span>
                                        )}
                                    </Button>
                                </Link>
                            );
                        })}
                    </div>
                </nav>
            </Card>
        </>
    );
}
