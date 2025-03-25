import { useState } from "react";
import { Outlet } from "react-router";
import NavbarAdmin from "./NavbarAdmin";
import SidebarAdmin from "./SidebarAdmin";

export default function LayoutAdmin() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden">
            <aside className={`${isCollapsed ? 'w-20' : 'w-64'} transition-width duration-300`}>
                <SidebarAdmin isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            </aside>
            <div className="flex flex-col flex-1">
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

