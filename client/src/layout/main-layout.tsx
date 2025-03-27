import { useState, useEffect } from "react"
import { Link, Outlet, useLocation } from "react-router-dom"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { Menu, X, User, LogOut, Settings, Calendar } from "lucide-react"
import { useAuthStore } from "../store"
import { useUserInfo } from "../types/user-info"
import { cn } from "../lib/utils"
import { Button } from "../components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"


export function MainLayout() {
  const location = useLocation()
  const { isAuthenticated, logout } = useAuthStore()
  const { fullName, isAdmin, isOrganizer } = useUserInfo()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when location changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location])

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Events", href: "/events" },
  ]

  const userInitials = fullName
    ? fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
    : "U"

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-200",
          scrolled
            ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b"
            : "bg-background",
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <Calendar className="h-6 w-6" />
                <span className="font-bold text-xl">EventHub</span>
              </Link>
              <nav className="hidden md:ml-10 md:flex md:items-center md:space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary",
                      location.pathname === item.href ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  {(isAdmin || isOrganizer) && (
                    <Button asChild variant="outline" className="hidden md:flex">
                      <Link to="/dashboard/events">Dashboard</Link>
                    </Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg" alt={fullName} />
                          <AvatarFallback>{userInitials}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <div className="flex items-center justify-start gap-2 p-2">
                        <div className="flex flex-col space-y-1 leading-none">
                          {fullName && <p className="font-medium">{fullName}</p>}
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/profile" className="cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      {(isAdmin || isOrganizer) && (
                        <DropdownMenuItem asChild>
                          <Link to="/admin/dashboard" className="cursor-pointer">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Dashboard</span>
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer" onClick={logout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div className="hidden md:flex md:items-center md:space-x-4">
                  <Button asChild variant="ghost">
                    <Link to="/login">Sign in</Link>
                  </Button>
                  <Button asChild>
                    <Link to="/register">Sign up</Link>
                  </Button>
                </div>
              )}

              <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <nav className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary",
                      location.pathname === item.href ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/profile"
                      className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                    >
                      Profile
                    </Link>
                    {(isAdmin || isOrganizer) && (
                      <Link
                        to="/admin/dashboard"
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                      >
                        Dashboard
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary text-left"
                    >
                      Log out
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col space-y-2 pt-2">
                    <Button asChild>
                      <Link to="/login">Sign in</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link to="/register">Sign up</Link>
                    </Button>
                  </div>
                )}
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/40">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-6 w-6" />
                <span className="font-bold text-xl">EventHub</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Discover and book amazing events in your area. From concerts to workshops, we've got you covered.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/" className="text-muted-foreground hover:text-primary">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/events" className="text-muted-foreground hover:text-primary">
                    Events
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-muted-foreground hover:text-primary">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-muted-foreground hover:text-primary">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/terms" className="text-muted-foreground hover:text-primary">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-muted-foreground hover:text-primary">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/cookies" className="text-muted-foreground hover:text-primary">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-primary" aria-label="Facebook">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary" aria-label="Twitter">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary" aria-label="Instagram">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} EventHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}


