import { useAuthStore } from "../store/useAuthStore"
import { Link } from "react-router-dom"
import { LogOut, Settings, MessageSquare, User } from "lucide-react"

const Navbar = () => {
  const { logout, authUser } = useAuthStore()

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-base-100/80 backdrop-blur-md shadow-sm">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Left side - Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
          <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xl font-bold tracking-wide">Chatty</span>
        </Link>

        {/* Right side - Actions */}
        <div className="flex items-center gap-3">
          <Link
            to="/settings"
            className="btn btn-sm flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Settings</span>
          </Link>

          {authUser && (
            <>
              <Link to="/profile" className="btn btn-sm flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </Link>

              <button
                onClick={logout}
                className="btn btn-sm flex items-center gap-2 text-white"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Navbar
