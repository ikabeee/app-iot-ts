"use client"

import { Outlet } from "react-router"
import NavbarAdmin from "./NavbarAdmin"
import SidebarAdmin from "./SidebarAdmin"
import { useState } from "react"

export default function LayoutAdmin() {
    const [isOpen, setIsOpen] = useState(true)

    const toggleSidebar = () => {
        setIsOpen(!isOpen)
    }

    return (
        <div className="flex h-screen overflow-hidden">
            <aside className={`${isOpen ? "w-64" : "w-0"} transition-all duration-300 ease-in-out overflow-hidden`}>
                <SidebarAdmin onClose={() => setIsOpen(false)} />
            </aside>
            <div className="flex flex-col flex-1">
                <nav className="w-full">
                    <NavbarAdmin toggleSidebar={toggleSidebar} />
                </nav>
                <main className="flex-1 p-4 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

