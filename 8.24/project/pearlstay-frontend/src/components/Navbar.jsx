import { Link, useNavigate } from 'react-router-dom';
import { Hotel, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { isAuthenticated, getUserFromToken, logout } from '../utils/auth.js';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const user = getUserFromToken();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Hotel className="h-8 w-8 text-pearlstay-primary" />
            <span className="text-xl font-bold text-gray-900">PearlStay</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-pearlstay-primary transition-colors">
              Home
            </Link>
            <Link to="/hotels" className="text-gray-700 hover:text-pearlstay-primary transition-colors">
              Hotels
            </Link>
            <Link to="/rooms" className="text-gray-700 hover:text-pearlstay-primary transition-colors">
              Rooms
            </Link>
            
            {isAuthenticated() ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to={`/dashboard/${user?.role}`} 
                  className="text-gray-700 hover:text-pearlstay-primary transition-colors"
                >
                  Dashboard
                </Link>
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-700">{user?.email}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-pearlstay-primary transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-pearlstay-primary"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-2">
              <Link to="/" className="text-gray-700 hover:text-pearlstay-primary py-2">
                Home
              </Link>
              <Link to="/hotels" className="text-gray-700 hover:text-pearlstay-primary py-2">
                Hotels
              </Link>
              <Link to="/rooms" className="text-gray-700 hover:text-pearlstay-primary py-2">
                Rooms
              </Link>
              
              {isAuthenticated() ? (
                <>
                  <Link 
                    to={`/dashboard/${user?.role}`} 
                    className="text-gray-700 hover:text-pearlstay-primary py-2"
                  >
                    Dashboard
                  </Link>
                  <div className="py-2 text-gray-600 text-sm">
                    {user?.email}
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-700 py-2 text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-pearlstay-primary py-2">
                    Login
                  </Link>
                  <Link to="/register" className="btn-primary w-fit mt-2">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}