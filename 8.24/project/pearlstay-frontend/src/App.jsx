import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import HotelsList from './pages/HotelsList.jsx';
import RoomsList from './pages/RoomsList.jsx';
import AdminDashboard from "./pages/AdminDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/hotels" element={<HotelsList />} />
          <Route path="/rooms" element={<RoomsList />} />
          
          {/* Protected Routes */}
        <Route
          path="/dashboard/admin/*"
          element={
            <PrivateRoute roles={["admin"]}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/owner/*"
          element={
            <PrivateRoute roles={["owner"]}>
              <OwnerDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/customer/*"
          element={
            <PrivateRoute roles={["customer"]}>
              <CustomerDashboard />
            </PrivateRoute>
          }
        />
          
          {/* 404 */}
          <Route path="*" element={
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
              <div className="text-center">
                <h1 className="mb-4 text-4xl font-bold text-gray-900">404</h1>
                <p className="mb-6 text-gray-600">Page not found</p>
                <Link to="/" className="btn-primary">Go Home</Link>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;