// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import Companies from "./pages/Companies";
import Locations from "./pages/Locations";
import Analytics from "./pages/Analytics";
import JobDetails from "./pages/JobDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ApplyJob from "./pages/Apply Now"; // ✅ Fixed import to match the route element

// 🛡️ Protected Route component (Access for authenticated users only)
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// 🚪 Guest Route component (Prevents authenticated users from accessing Login/Register)
function GuestRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/jobs" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      {/* Wrap the entire application with AuthProvider to share user state */}
      <AuthProvider>
        <Routes>
          {/* 1. Auth Routes (Blocked for logged-in users, open for guests) */}
          <Route
            path="/login"
            element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            }
          />
          <Route
            path="/register"
            element={
              <GuestRoute>
                <Register />
              </GuestRoute>
            }
          />

          {/* 2. Main Application Routes inside MainLayout */}
          <Route element={<MainLayout />}>
            {/* Default route and Home page */}
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/apply/:id" element={<ApplyJob />} />
            
            {/* 🔒 Protected Analytics route (Example of a private page) */}
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              }
            />
            
            <Route path="/jobs/:id" element={<JobDetails />} />
          </Route>

          {/* Redirect any undefined random path to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;