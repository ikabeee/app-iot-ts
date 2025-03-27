import { useState } from "react";
import { Outlet } from "react-router";
import NavbarAdmin from "./NavbarAdmin";
import SidebarAdmin from "./SidebarAdmin";

export default function LayoutAdmin() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden">
            <SidebarAdmin isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            <div className="flex flex-col flex-1 w-full">
                <nav className="w-full">
                    <NavbarAdmin />
                </nav>
                <main className="flex-1 p-4 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

