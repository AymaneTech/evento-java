import type React from "react"
import { useState, useEffect } from "react"
import { Outlet } from "react-router-dom"
import { LayoutDashboard, Calendar, Users, Tag, Settings, LogOut, Menu, X } from "lucide-react"
import { cn } from "../lib/utils"
import { Button } from "../components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { handleLogout } from "../api/axios"

interface SidebarItemProps {
  icon: React.ElementType
  title: string
  isActive?: boolean
  href: string
}

const SidebarItem = ({ icon: Icon, title, isActive, href }: SidebarItemProps) => {
  return (
    <a
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
        isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{title}</span>
    </a>
  )
}

export default function AdminLayout () {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top navbar */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold">Event Management</h1>
        </div>
        <Avatar>
          <AvatarImage src="/placeholder.svg" alt="User" />
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
      </header>

      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed z-20 h-[calc(100vh-4rem)] w-64 border-r bg-background transition-all duration-200 ease-in-out",
            isMobile ? (sidebarOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0",
          )}
        >
          <div className="flex h-full flex-col">
            <div className="flex h-14 items-center border-b px-4">
              {isMobile && sidebarOpen && (
                <Button variant="ghost" size="icon" className="ml-auto" onClick={toggleSidebar}>
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close menu</span>
                </Button>
              )}
            </div>
            <div className="flex-1 overflow-auto py-2">
              <nav className="grid items-start px-2 text-sm">
                <SidebarItem icon={LayoutDashboard} title="Dashboard" href="/dashboard" />
                <SidebarItem icon={Calendar} title="Events" href="/dashboard/events" />
                <SidebarItem icon={Tag} title="Categories" href="/dashboard/categories" isActive={true} />
                <SidebarItem icon={Users} title="Users" href="/dashboard/users" />
                <SidebarItem icon={Settings} title="Settings" href="/admin/settings" />
              </nav>
            </div>
            <div className="mt-auto border-t p-4">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-muted-foreground"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span>Log out</span>
              </Button>
            </div>
          </div>
        </aside>

        {/* Main content - with proper margin to account for sidebar */}
        <main
          className={cn(
            "flex-1 transition-all duration-200 ease-in-out",
            !isMobile && "ml-64",
            isMobile && sidebarOpen && "ml-64",
          )}
        >
          <div className="container mx-auto p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

