import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  Hotel, 
  Calendar, 
  Settings, 
  Menu, 
  X, 
  LogOut,
  Home,
  Bed,
  FileText
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getMenuItems = () => {
    const basePath = `/dashboard/${user?.role}`;
    
    switch (user?.role) {
      case 'admin':
        return [
          { path: basePath, icon: Home, label: 'Overview' },
          { path: `${basePath}/users`, icon: Users, label: 'Manage Users' },
          { path: `${basePath}/hotels`, icon: Hotel, label: 'Manage Hotels' },
          { path: `${basePath}/rooms`, icon: Bed, label: 'Manage Rooms' },
          { path: `${basePath}/bookings`, icon: Calendar, label: 'All Bookings' },
        ];
      case 'owner':
        return [
          { path: basePath, icon: Home, label: 'Overview' },
          { path: `${basePath}/hotels`, icon: Hotel, label: 'My Hotels' },
          { path: `${basePath}/rooms`, icon: Bed, label: 'My Rooms' },
          { path: `${basePath}/bookings`, icon: Calendar, label: 'Bookings' },
          { path: `${basePath}/profile`, icon: Settings, label: 'Profile' },
        ];
      case 'customer':
        return [
          { path: basePath, icon: Home, label: 'Dashboard' },
          { path: `${basePath}/bookings`, icon: Calendar, label: 'My Bookings' },
          { path: `${basePath}/profile`, icon: Settings, label: 'Profile' },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background-200">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Building2 className="w-8 h-8 text-primary-500" />
            <span className="text-xl font-bold text-primary-700">PearlStay</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-500 lg:hidden hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center mb-6 space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-100">
              <span className="font-medium text-primary-600">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-800">{user?.name}</p>
              <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 space-x-3 text-sm font-medium text-gray-700 transition-colors rounded-md hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-500 lg:hidden hover:text-gray-700"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-sm text-gray-600 transition-colors hover:text-primary-600"
            >
              ← Back to Website
            </Link>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;