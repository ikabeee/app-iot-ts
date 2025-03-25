import { Outlet } from "react-router"
import NavbarAdmin from "./NavbarAdmin"
import SidebarAdmin from "./SidebarAdmin"


export default function LayoutAdmin() {

    return (
        <div className="flex h-screen overflow-hidden">
            <aside className="w-64">
                <SidebarAdmin />
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
    )
}

