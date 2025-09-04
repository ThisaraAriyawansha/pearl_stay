import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const isHomeRoute = location.pathname === '/';
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'admin': return '/dashboard/admin';
      case 'owner': return '/dashboard/owner';
      case 'customer': return '/dashboard/customer';
      default: return '/login';
    }
  };

  useEffect(() => {
    if (isHomeRoute) {
      const handleScroll = () => {
        const scrollPosition = window.scrollY;
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercentage = (scrollPosition / windowHeight) * 100;
        setIsScrolled(scrollPercentage > 10);
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    } else {
      setIsScrolled(false);
    }
  }, [isHomeRoute]);

  return (
    <nav className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-2 lg:py-4 flex justify-between items-center shadow-sm transition-all duration-300 rounded-2xl max-w-6xl w-[90%] font-sans ${isHomeRoute && !isScrolled ? 'bg-transparent backdrop-blur-sm' : 'bg-white'}`}>
      <div className="flex items-center">
        <Link to="/" className="flex items-center">
          <img src="/plogo-Picsart-AiImageEnhancer.png" alt="PearlStay Logo" className="w-auto h-8" />
          <span className="hidden text-2xl font-bold text-purple-500">earlStay</span>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div className="items-center hidden space-x-8 md:flex">
        <Link
          to="/"
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive('/')
              ? `${isHomeRoute && !isScrolled ? 'text-white bg-transparent' : 'text-primary-600 bg-primary-50'}`
              : `${isHomeRoute && !isScrolled ? 'text-white' : 'text-gray-700'} hover:text-primary-600`
          }`}
        >
          Home
        </Link>
        <Link
          to="/hotels"
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive('/hotels')
              ? `${isHomeRoute && !isScrolled ? 'text-white bg-transparent' : 'text-primary-600 bg-primary-50'}`
              : `${isHomeRoute && !isScrolled ? 'text-white' : 'text-gray-700'} hover:text-primary-600`
          }`}
        >
          Hotels
        </Link>
        <Link
          to="/rooms"
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive('/rooms')
              ? `${isHomeRoute && !isScrolled ? 'text-white bg-transparent' : 'text-primary-600 bg-primary-50'}`
              : `${isHomeRoute && !isScrolled ? 'text-white' : 'text-gray-700'} hover:text-primary-600`
          }`}
        >
          Rooms
        </Link>
        <Link
          to="/about"
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive('/about')
              ? `${isHomeRoute && !isScrolled ? 'text-white bg-transparent' : 'text-primary-600 bg-primary-50'}`
              : `${isHomeRoute && !isScrolled ? 'text-white' : 'text-gray-700'} hover:text-primary-600`
          }`}
        >
          About
        </Link>
        <Link
          to="/contact"
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive('/contact')
              ? `${isHomeRoute && !isScrolled ? 'text-white bg-transparent' : 'text-primary-600 bg-primary-50'}`
              : `${isHomeRoute && !isScrolled ? 'text-white' : 'text-gray-700'} hover:text-primary-600`
          }`}
        >
          Contact
        </Link>

        {user ? (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={`flex items-center px-3 py-2 space-x-2 text-sm font-medium transition-colors rounded-md ${
                isHomeRoute && !isScrolled ? 'text-white' : 'text-gray-700'
              } hover:text-primary-600`}
            >
              <User className="w-4 h-4" />
              <span>{user.name}</span>
            </button>
            
            {showUserMenu && (
              <div className="absolute right-0 z-50 w-48 py-1 mt-2 bg-white rounded-md shadow-lg">
                <Link
                  to={getDashboardPath()}
                  className="block px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-primary-50"
                  onClick={() => setShowUserMenu(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-primary-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className={`px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                isHomeRoute && !isScrolled ? 'text-white' : 'text-gray-700'
              } hover:text-primary-600`}
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-sm font-medium text-white transition-colors rounded-md bg-primary-600 hover:bg-primary-700"
            >
              Register
            </Link>
          </div>
        )}
      </div>

      {/* Mobile menu button */}
      <div className="flex items-center md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`${
            isHomeRoute && !isScrolled ? 'text-white' : 'text-gray-700'
          } hover:text-primary-600 focus:outline-none focus:text-primary-600`}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-1/2 transform -translate-x-1/2 w-[90%] max-w-6xl">
            <div
              className={`px-3 pt-2 pb-3 space-y-1 border shadow-sm rounded-2xl transition-all duration-300 ${
                isHomeRoute && !isScrolled
                  ? 'bg-white' 
                  : 'bg-white'
              }`}
            >
          
            <Link
              to="/"
              className="block px-3 py-2 text-base font-medium text-gray-700 transition-colors rounded-md hover:text-primary-600 hover:bg-primary-50"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/hotels"
              className="block px-3 py-2 text-base font-medium text-gray-700 transition-colors rounded-md hover:text-primary-600 hover:bg-primary-50"
              onClick={() => setIsOpen(false)}
            >
              Hotels
            </Link>
            <Link
              to="/rooms"
              className="block px-3 py-2 text-base font-medium text-gray-700 transition-colors rounded-md hover:text-primary-600 hover:bg-primary-50"
              onClick={() => setIsOpen(false)}
            >
              Rooms
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 text-base font-medium text-gray-700 transition-colors rounded-md hover:text-primary-600 hover:bg-primary-50"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block px-3 py-2 text-base font-medium text-gray-700 transition-colors rounded-md hover:text-primary-600 hover:bg-primary-50"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            
            {user ? (
              <>
                <Link
                  to={getDashboardPath()}
                  className="block px-3 py-2 text-base font-medium text-gray-700 transition-colors rounded-md hover:text-primary-600 hover:bg-primary-50"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full px-3 py-2 text-base font-medium text-left text-gray-700 transition-colors rounded-md hover:text-primary-600 hover:bg-primary-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 text-base font-medium text-gray-700 transition-colors rounded-md hover:text-primary-600 hover:bg-primary-50"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 text-base font-medium text-white transition-colors rounded-md bg-primary-600 hover:bg-primary-700"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;