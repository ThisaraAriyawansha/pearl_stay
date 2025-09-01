import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const DashboardLayout = ({ children, role }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = {
    admin: [
      { path: "/dashboard/admin/users", label: "Manage Users" },
      { path: "/dashboard/admin/hotels", label: "Manage Hotels" },
      { path: "/dashboard/admin/rooms", label: "Manage Rooms" },
      { path: "/dashboard/admin/bookings", label: "Manage Bookings" },
    ],
    owner: [
      { path: "/dashboard/owner/profile", label: "Profile" },
      { path: "/dashboard/owner/hotels", label: "My Hotels" },
      { path: "/dashboard/owner/rooms", label: "My Rooms" },
      { path: "/dashboard/owner/bookings", label: "Bookings" },
    ],
    customer: [
      { path: "/dashboard/customer/profile", label: "Profile" },
      { path: "/dashboard/customer/search", label: "Search Hotels" },
      { path: "/dashboard/customer/bookings", label: "My Bookings" },
    ],
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-pearlstay-bg">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-pearlstay-primary text-white transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="p-4">
          <h2 className="text-2xl font-bold">PearlStay</h2>
          <button
            className="absolute md:hidden top-4 right-4"
            onClick={() => setIsSidebarOpen(false)}
          >
            ✕
          </button>
        </div>
        <nav className="mt-4">
          {navItems[role].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block py-2 px-4 hover:bg-pearlstay-secondary ${
                location.pathname === item.path ? "bg-pearlstay-accent" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="block w-full px-4 py-2 text-left hover:bg-pearlstay-secondary"
          >
            Logout
          </button>
        </nav>
      </aside>
      <div className="flex-1 md:ml-64">
        <header className="flex items-center justify-between p-4 bg-pearlstay-neutral">
          <button
            className="md:hidden text-pearlstay-primary"
            onClick={() => setIsSidebarOpen(true)}
          >
            ☰
          </button>
          <h1 className="text-xl font-semibold text-pearlstay-primary">
            {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
          </h1>
        </header>
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;