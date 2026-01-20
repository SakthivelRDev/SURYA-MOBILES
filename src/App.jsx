import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";
import PrivateRoute from "./components/PrivateRoute";

// Placeholder Components - We will implement these later
const AdminDashboard = () => <div className="p-4"><h1>Admin Dashboard</h1></div>;
const StaffDashboard = () => <div className="p-4"><h1>Staff Dashboard</h1></div>;
const CustomerHome = () => (
  <div className="p-4">
    <h1>Customer Home</h1>
    <p>Welcome to Smart Mobile Retail. Browse our products below.</p>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/admin/*"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/staff/*"
            element={
              <PrivateRoute allowedRoles={['staff']}>
                <StaffDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/"
            element={
              <PrivateRoute allowedRoles={['customer', 'admin', 'staff']}>
                <CustomerHome />
              </PrivateRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
