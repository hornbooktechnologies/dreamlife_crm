import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { Toaster } from "sonner";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Employee from "./pages/Employee";
import EmployeeFormPage from "./pages/EmployeeFormPage";
import Leaves from "./pages/Leaves";
import Holiday from "./pages/Holiday";
import Settings from "./pages/Settings";
import ServiceTaxPage from "./pages/ServiceTax";
import EmployeeDocuments from "./pages/EmployeeDocuments";
import ActivityLogs from "./pages/ActivityLogs";
import EmployeeProfile from "./pages/EmployeeProfile";
import ProjectManagement from "./pages/ProjectManagement";
import ResumeBuilder from "./pages/ResumeBuilder";
import AttendanceTracking from "./pages/AttendanceTracking";
import PrivateRoute from "./components/guards/PrivateRoute";
import SidebarWrapper from "./components/shared/sidebar/SidebarWrapper";
import { AuthProvider, useAuthStore } from "./context/AuthContext";
import { LayoutProvider } from "./context/LayoutContext";
import AllHolidays from "./components/holiday/AllHolidays";

function AppContent() {
  const { tokens } = useAuthStore();

  return (
    <>
      <Router>
        <LayoutProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/auth/login" element={<Login />} />

            {/* Protected Routes */}
            <Route
              element={
                <PrivateRoute>
                  <SidebarWrapper>
                    <Outlet />
                  </SidebarWrapper>
                </PrivateRoute>
              }
            >
              <Route
                path="/"
                element={
                  tokens ? <Dashboard /> : <Navigate to="/dashboard" replace />
                }
              />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/users" element={<Users />} />
              <Route path="/employee" element={<Employee />} />
              <Route path="/employee/add" element={<EmployeeFormPage />} />
              <Route path="/employee/edit/:id" element={<EmployeeFormPage />} />
              <Route path="/leave" element={<Leaves />} />
              <Route path="/holiday" element={<Holiday />} />
              <Route path="/holiday/all-holidays" element={<AllHolidays />} />
              <Route path="/service-tax" element={<ServiceTaxPage />} />
              <Route path="/documents" element={<EmployeeDocuments />} />
              <Route path="/activity-logs" element={<ActivityLogs />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<EmployeeProfile />} />

              <Route path="/project-management" element={<ProjectManagement />} />
              <Route path="/resume-builder" element={<ResumeBuilder />} />
              <Route path="/attendance-tracking" element={<AttendanceTracking />} />
            </Route>
          </Routes>
        </LayoutProvider>
      </Router>

      {/* Toast Notifications */}
      <Toaster position="top-right" richColors />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
