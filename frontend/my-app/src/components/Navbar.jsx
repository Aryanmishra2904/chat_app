import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { LogOut, MessageSquare, User } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-base-100/70 backdrop-blur-md border-b border-base-300 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Left side - Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 group"
        >
          <div className="size-10 rounded-xl bg-primary/15 flex items-center justify-center group-hover:bg-primary/25 transition">
            <MessageSquare className="w-6 h-6 text-primary" />
          </div>
          <span className="text-2xl font-bold tracking-tight group-hover:text-primary transition">
            Chatty
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-3">
          {authUser ? (
            <>
              <Link
                to="/profile"
                className="btn btn-ghost btn-sm rounded-xl flex items-center gap-2 hover:bg-primary/10"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </Link>

              <button
                onClick={logout}
                aria-label="Logout"
                className="btn btn-error btn-sm rounded-xl flex items-center gap-2 hover:scale-105 transition"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="btn btn-primary btn-sm rounded-xl px-4 hover:scale-105 transition"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="dropdown dropdown-end md:hidden">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </label>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 p-2 shadow-lg bg-base-100 rounded-xl w-48 z-[60]"
          >
            {authUser ? (
              <>
                <li>
                  <Link to="/profile">
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                </li>
                <li>
                  <button onClick={logout} className="text-error flex items-center gap-2">
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link to="/login" className="text-primary">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
