import { Link, useLocation, useNavigate } from "react-router-dom";
import finlogo from "../../assets/finlogo.svg";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import useSignOut from "react-auth-kit/hooks/useSignOut";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone_number?: string;
}

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const isAuthenticated = useIsAuthenticated();
  const signOut = useSignOut();
  const auth = useAuthUser<AuthUser>();
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === "/";
  const showPublicNav = isHomePage || !isAuthenticated;
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };
  const handleLogout = () => {
    signOut();
    setShowDropdown(false);
    navigate("/login");
  };
  console.log({ auth });
  const getUserInitials = () => {
    if (auth && auth.name) {
      return auth.name.charAt(0).toUpperCase();
    }
    return "U";
  };
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  return (
    <div className="w-full p-8 flex items-center justify-between">
      <div className="flex text-lg font-bold">
        <img src={finlogo} alt="logo" className="w-10 h-10 mr-2" />
        <h2>Fin Vision</h2>
      </div>
      {showPublicNav ? (
        <div className="flex gap-4">
          <Link to="/" className="btn btn-outline">
            Home
          </Link>
          <Link to="/login" className="btn btn-outline">
            Login
          </Link>
          <Link to="/signup" className="btn btn-primary">
            Sign up
          </Link>
        </div>
      ) : (
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center focus:outline-none"
            aria-label="User Menu"
          >
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[rgb(var(--color-primary))] to-[rgb(var(--color-secondary))] flex items-center justify-center text-white font-medium mr-2 shadow-md border border-[rgb(var(--color-border))]">
              {getUserInitials()}
              <FaChevronDown
                size={15}
                className="text-[rgb(var(--color-muted))]"
              />
            </div>
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-[rgb(var(--color-card))] rounded-md shadow-lg py-1 z-10 border border-[rgb(var(--color-border))]">
              <Link
                to="/profile"
                className="block px-4 py-2 text-sm text-[rgb(var(--color-muted))] hover:bg-[rgb(var(--color-card-hover))] hover:text-[rgb(var(--color-foreground))]"
                onClick={() => setShowDropdown(false)}
              >
                User Profile
              </Link>
              <button
                className="block w-full text-left px-4 py-2 text-sm text-[rgb(var(--color-muted))] hover:bg-[rgb(var(--color-card-hover))] hover:text-[rgb(var(--color-foreground))]"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Header;
