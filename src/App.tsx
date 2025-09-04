import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import DashboardLayout from './components/Dashboard/DashboardLayout';

import LoadingPage from './components/LoadingPage';
import ScrollToTop from './components/ScrollToTop';

// Pages
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import HotelsList from './pages/Hotels/HotelsList';
import HotelSingle from './pages/Hotels/HotelSingle';
import RoomsList from './pages/Rooms/RoomsList';
import RoomSingle from './pages/Rooms/RoomSingle';
import About from './pages/About';
import Contact from './pages/Contact';

// Dashboard Pages
import AdminDashboard from './pages/Dashboard/Admin/AdminDashboard';
import OwnerDashboard from './pages/Dashboard/Owner/OwnerDashboard';
import CustomerDashboard from './pages/Dashboard/Customer/CustomerDashboard';


// Home Page Wrapper with Loading (only first time)
const HomeWithLoading = () => {
  const [showLoading, setShowLoading] = useState(() => {
    // Check if user has visited before in this session
    const hasVisited = sessionStorage.getItem('pearlstay-visited');
    return !hasVisited; // Show loading only if not visited before
  });

  const handleLoadingComplete = () => {
    setShowLoading(false);
    // Mark as visited for this session
    sessionStorage.setItem('pearlstay-visited', 'true');
  };

  return (
    <>
      {showLoading && <LoadingPage onComplete={handleLoadingComplete} />}
      <div className={showLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}>
        <Home />
      </div>
    </>
  );
};


// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({ 
  children, 
  allowedRoles = [] 
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-32 h-32 border-b-2 rounded-full animate-spin border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Main App Component
const AppContent: React.FC = () => {
  const { user } = useAuth();

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-background-100">
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/*" 
            element={
              <>
                <Navbar />
                <Routes>
                  <Route path="/" element={<HomeWithLoading />} />
                  <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
                  <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register />} />
                  <Route path="/hotels" element={<HotelsList />} />
                  <Route path="/hotels/:id" element={<HotelSingle />} />
                  <Route path="/rooms" element={<RoomsList />} />
                  <Route path="/rooms/:id" element={<RoomSingle />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                </Routes>
                <Footer />
              </>
            } 
          />

          {/* Dashboard Routes */}
          <Route 
            path="/dashboard/*" 
            element={
              <ProtectedRoute>
                  <Routes>
                    {/* Admin Routes */}
                    <Route 
                      path="admin" 
                      element={
                        <ProtectedRoute allowedRoles={['admin']}>
                          <AdminDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="admin/*" 
                      element={
                        <ProtectedRoute allowedRoles={['admin']}>
                          <div className="py-8 text-center">
                            <h2 className="mb-2 text-xl font-semibold text-gray-800">Page Under Development</h2>
                            <p className="text-gray-600">This admin feature is coming soon!</p>
                          </div>
                        </ProtectedRoute>
                      } 
                    />

                    {/* Owner Routes */}
                    <Route 
                      path="owner" 
                      element={
                        <ProtectedRoute allowedRoles={['owner']}>
                          <OwnerDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="owner/*" 
                      element={
                        <ProtectedRoute allowedRoles={['owner']}>
                          <div className="py-8 text-center">
                            <h2 className="mb-2 text-xl font-semibold text-gray-800">Page Under Development</h2>
                            <p className="text-gray-600">This owner feature is coming soon!</p>
                          </div>
                        </ProtectedRoute>
                      } 
                    />

                    {/* Customer Routes */}
                    <Route 
                      path="customer" 
                      element={
                        <ProtectedRoute allowedRoles={['customer']}>
                          <CustomerDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="customer/*" 
                      element={
                        <ProtectedRoute allowedRoles={['customer']}>
                          <div className="py-8 text-center">
                            <h2 className="mb-2 text-xl font-semibold text-gray-800">Page Under Development</h2>
                            <p className="text-gray-600">This customer feature is coming soon!</p>
                          </div>
                        </ProtectedRoute>
                      } 
                    />

                    {/* Default Dashboard Redirect */}
                    <Route 
                      path="/" 
                      element={
                        user ? (
                          <Navigate 
                            to={`/dashboard/${user.role}`} 
                            replace 
                          />
                        ) : (
                          <Navigate to="/login" replace />
                        )
                      } 
                    />
                  </Routes>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;