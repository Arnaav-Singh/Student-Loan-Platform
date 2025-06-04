
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  LogIn,
  UserPlus,
  Home,
  CreditCard,
  User,
  Users,
  Settings,
  HelpCircle,
  UserMinus,
} from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isAuthenticated = false; // This will be replaced with actual auth state later

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navigation = [
    { name: "Home", path: "/", icon: <Home className="w-4 h-4 mr-2" /> },
    { name: "About", path: "/about", icon: <HelpCircle className="w-4 h-4 mr-2" /> },
  ];

  const authenticatedNavigation = [
    { name: "Dashboard", path: "/dashboard", icon: <CreditCard className="w-4 h-4 mr-2" /> },
    { name: "Profile", path: "/profile", icon: <User className="w-4 h-4 mr-2" /> },
  ];

  const adminNavigation = [
    { name: "Admin", path: "/admin", icon: <Users className="w-4 h-4 mr-2" /> },
    { name: "Settings", path: "/settings", icon: <Settings className="w-4 h-4 mr-2" /> },
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-primary">ScholarLoan</span>
              <span className="text-2xl font-light text-muted-foreground">Hub</span>
            </Link>
            
            {/* Desktop menu */}
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${
                    location.pathname === item.path
                      ? "border-primary text-primary"
                      : "border-transparent text-foreground hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
              
              {isAuthenticated && authenticatedNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${
                    location.pathname === item.path
                      ? "border-primary text-primary"
                      : "border-transparent text-foreground hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Desktop auth buttons */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {!isAuthenticated ? (
              <>
                <Link to="/login">
                  <Button size="sm" className="flex items-center">
                    <UserMinus className="mr-2 h-4 w-4" /> Sign out
                  </Button>
                </Link>
              </>
            ) : (
              <Link to="/dashboard">
                <Button size="sm">My Dashboard</Button>
              </Link>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="-mr-2 flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  location.pathname === item.path
                    ? "bg-primary-foreground border-primary text-primary"
                    : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                }`}
                onClick={closeMenu}
              >
                <div className="flex items-center">
                  {item.icon}
                  {item.name}
                </div>
              </Link>
            ))}
            
            {isAuthenticated && authenticatedNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  location.pathname === item.path
                    ? "bg-primary-foreground border-primary text-primary"
                    : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                }`}
                onClick={closeMenu}
              >
                <div className="flex items-center">
                  {item.icon}
                  {item.name}
                </div>
              </Link>
            ))}
          </div>
          
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4 space-x-3">
              {!isAuthenticated ? (
                <>
                  <Link 
                    to="/login" 
                    className="block text-base font-medium text-gray-500 hover:text-gray-800"
                    onClick={closeMenu}
                  >
                    <Button variant="outline" size="sm" className="w-full flex items-center justify-center">
                      <LogIn className="mr-2 h-4 w-4" /> Sign In
                    </Button>
                  </Link>
                  <Link 
                    to="/register" 
                    className="block text-base font-medium text-gray-500 hover:text-gray-800"
                    onClick={closeMenu}
                  >
                    <Button size="sm" className="w-full flex items-center justify-center">
                      <UserPlus className="mr-2 h-4 w-4" /> Sign Up
                    </Button>
                  </Link>
                </>
              ) : (
                <Link 
                  to="/dashboard" 
                  className="block text-base font-medium text-gray-500 hover:text-gray-800"
                  onClick={closeMenu}
                >
                  <Button size="sm" className="w-full">My Dashboard</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
