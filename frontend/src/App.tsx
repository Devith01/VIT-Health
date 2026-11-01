import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardLayout } from './layouts/DashboardLayout';

// 8 Dedicated Role Primary Dashboards
import { StudentDashboard } from './pages/StudentDashboard';
import { DoctorDashboard } from './pages/DoctorDashboard';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { SecurityDashboard } from './pages/SecurityDashboard';
import { AmbulanceDashboard } from './pages/AmbulanceDashboard';
import { FloorRepresentativeDashboard } from './pages/FloorRepresentativeDashboard';
import { PharmacyDashboard } from './pages/PharmacyDashboard';
import { FacultyDashboard } from './pages/FacultyDashboard';

// Shared Feature Module Pages
import { AppointmentsPage } from './pages/AppointmentsPage';
import { SymptomCheckerPage } from './pages/SymptomCheckerPage';
import { SurveillancePage } from './pages/SurveillancePage';
import { EmergencyPage } from './pages/EmergencyPage';
import { PharmacyPage } from './pages/PharmacyPage';
import { MentalHealthPage } from './pages/MentalHealthPage';
import { HealthRecordsPage } from './pages/HealthRecordsPage';
import { AuthPage } from './pages/AuthPage';

function RoleBasedHomeRedirect() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.roleName) {
    case 'STUDENT':
      return <Navigate to="/student/dashboard" replace />;
    case 'DOCTOR':
      return <Navigate to="/doctor/dashboard" replace />;
    case 'ADMIN':
      return <Navigate to="/admin/dashboard" replace />;
    case 'SECURITY_OFFICER':
      return <Navigate to="/security/dashboard" replace />;
    case 'AMBULANCE_OFFICER':
      return <Navigate to="/ambulance/dashboard" replace />;
    case 'FLOOR_REPRESENTATIVE':
      return <Navigate to="/floor-representative/dashboard" replace />;
    case 'PHARMACY_DESK':
      return <Navigate to="/pharmacy/dashboard" replace />;
    case 'FACULTY':
      return <Navigate to="/faculty/dashboard" replace />;
    default:
      return <Navigate to="/student/dashboard" replace />;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RoleBasedHomeRedirect />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/auth" element={<AuthPage />} />

          <Route element={<ProtectedRoute />}>
            {/* 1. STUDENT DASHBOARD & SUB-ROUTES */}
            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <DashboardLayout>
                    <StudentDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/records"
              element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <DashboardLayout>
                    <HealthRecordsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* 2. DOCTOR DASHBOARD & SUB-ROUTES */}
            <Route
              path="/doctor/dashboard"
              element={
                <ProtectedRoute allowedRoles={['DOCTOR']}>
                  <DashboardLayout>
                    <DoctorDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/queue"
              element={
                <ProtectedRoute allowedRoles={['DOCTOR']}>
                  <DashboardLayout>
                    <DoctorDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/ai-insights"
              element={
                <ProtectedRoute allowedRoles={['DOCTOR']}>
                  <DashboardLayout>
                    <DoctorDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/prescriptions"
              element={
                <ProtectedRoute allowedRoles={['DOCTOR']}>
                  <DashboardLayout>
                    <DoctorDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/follow-ups"
              element={
                <ProtectedRoute allowedRoles={['DOCTOR']}>
                  <DashboardLayout>
                    <DoctorDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/medical-leave"
              element={
                <ProtectedRoute allowedRoles={['DOCTOR']}>
                  <DashboardLayout>
                    <DoctorDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* 3. ADMIN DASHBOARD & SUB-ROUTES */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <DashboardLayout>
                    <AdminDashboardPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/heatmap"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <DashboardLayout>
                    <SurveillancePage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/outbreaks"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <DashboardLayout>
                    <SurveillancePage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/emergency-ops"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <DashboardLayout>
                    <AdminDashboardPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/ambulances"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <DashboardLayout>
                    <AdminDashboardPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <DashboardLayout>
                    <AdminDashboardPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <DashboardLayout>
                    <AdminDashboardPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/ai-performance"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <DashboardLayout>
                    <AdminDashboardPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* 4. SECURITY OFFICER DASHBOARD & SUB-ROUTES */}
            <Route
              path="/security/dashboard"
              element={
                <ProtectedRoute allowedRoles={['SECURITY_OFFICER']}>
                  <DashboardLayout>
                    <SecurityDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/security/emergencies"
              element={
                <ProtectedRoute allowedRoles={['SECURITY_OFFICER']}>
                  <DashboardLayout>
                    <SecurityDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/security/history"
              element={
                <ProtectedRoute allowedRoles={['SECURITY_OFFICER']}>
                  <DashboardLayout>
                    <SecurityDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/security/location"
              element={
                <ProtectedRoute allowedRoles={['SECURITY_OFFICER']}>
                  <DashboardLayout>
                    <SecurityDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/security/ambulance-coordination"
              element={
                <ProtectedRoute allowedRoles={['SECURITY_OFFICER']}>
                  <DashboardLayout>
                    <SecurityDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/security/incidents"
              element={
                <ProtectedRoute allowedRoles={['SECURITY_OFFICER']}>
                  <DashboardLayout>
                    <SecurityDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* 5. SMART AMBULANCE DASHBOARD & SUB-ROUTES */}
            <Route
              path="/ambulance/dashboard"
              element={
                <ProtectedRoute allowedRoles={['AMBULANCE_OFFICER']}>
                  <DashboardLayout>
                    <AmbulanceDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/ambulance/current-assignment"
              element={
                <ProtectedRoute allowedRoles={['AMBULANCE_OFFICER']}>
                  <DashboardLayout>
                    <AmbulanceDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/ambulance/live-map"
              element={
                <ProtectedRoute allowedRoles={['AMBULANCE_OFFICER']}>
                  <DashboardLayout>
                    <AmbulanceDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/ambulance/emergencies"
              element={
                <ProtectedRoute allowedRoles={['AMBULANCE_OFFICER']}>
                  <DashboardLayout>
                    <AmbulanceDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/ambulance/status"
              element={
                <ProtectedRoute allowedRoles={['AMBULANCE_OFFICER']}>
                  <DashboardLayout>
                    <AmbulanceDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/ambulance/history"
              element={
                <ProtectedRoute allowedRoles={['AMBULANCE_OFFICER']}>
                  <DashboardLayout>
                    <AmbulanceDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* 6. FLOOR REPRESENTATIVE DASHBOARD & SUB-ROUTES */}
            <Route
              path="/floor-representative/dashboard"
              element={
                <ProtectedRoute allowedRoles={['FLOOR_REPRESENTATIVE']}>
                  <DashboardLayout>
                    <FloorRepresentativeDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/floor-representative/alerts"
              element={
                <ProtectedRoute allowedRoles={['FLOOR_REPRESENTATIVE']}>
                  <DashboardLayout>
                    <FloorRepresentativeDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/floor-representative/trends"
              element={
                <ProtectedRoute allowedRoles={['FLOOR_REPRESENTATIVE']}>
                  <DashboardLayout>
                    <FloorRepresentativeDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/floor-representative/emergency-alerts"
              element={
                <ProtectedRoute allowedRoles={['FLOOR_REPRESENTATIVE']}>
                  <DashboardLayout>
                    <FloorRepresentativeDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/floor-representative/report-issue"
              element={
                <ProtectedRoute allowedRoles={['FLOOR_REPRESENTATIVE']}>
                  <DashboardLayout>
                    <FloorRepresentativeDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/floor-representative/notifications"
              element={
                <ProtectedRoute allowedRoles={['FLOOR_REPRESENTATIVE']}>
                  <DashboardLayout>
                    <FloorRepresentativeDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* 7. PHARMACY DESK DASHBOARD & SUB-ROUTES */}
            <Route
              path="/pharmacy/dashboard"
              element={
                <ProtectedRoute allowedRoles={['PHARMACY_DESK']}>
                  <DashboardLayout>
                    <PharmacyDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/pharmacy/orders"
              element={
                <ProtectedRoute allowedRoles={['PHARMACY_DESK']}>
                  <DashboardLayout>
                    <PharmacyDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/pharmacy/prescriptions"
              element={
                <ProtectedRoute allowedRoles={['PHARMACY_DESK']}>
                  <DashboardLayout>
                    <PharmacyDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/pharmacy/inventory"
              element={
                <ProtectedRoute allowedRoles={['PHARMACY_DESK']}>
                  <DashboardLayout>
                    <PharmacyDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/pharmacy/delivery"
              element={
                <ProtectedRoute allowedRoles={['PHARMACY_DESK']}>
                  <DashboardLayout>
                    <PharmacyDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/pharmacy/history"
              element={
                <ProtectedRoute allowedRoles={['PHARMACY_DESK']}>
                  <DashboardLayout>
                    <PharmacyDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* 8. FACULTY DASHBOARD & SUB-ROUTES */}
            <Route
              path="/faculty/dashboard"
              element={
                <ProtectedRoute allowedRoles={['FACULTY']}>
                  <DashboardLayout>
                    <FacultyDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/faculty/records"
              element={
                <ProtectedRoute allowedRoles={['FACULTY']}>
                  <DashboardLayout>
                    <FacultyDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Shared Module Feature Pages */}
            <Route
              path="/symptoms"
              element={
                <ProtectedRoute allowedRoles={['STUDENT', 'FACULTY', 'DOCTOR']}>
                  <DashboardLayout>
                    <SymptomCheckerPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/appointments"
              element={
                <ProtectedRoute allowedRoles={['STUDENT', 'FACULTY', 'DOCTOR']}>
                  <DashboardLayout>
                    <AppointmentsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/surveillance"
              element={
                <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN', 'DOCTOR', 'FLOOR_REPRESENTATIVE']}>
                  <DashboardLayout>
                    <SurveillancePage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/emergency"
              element={
                <ProtectedRoute allowedRoles={['STUDENT', 'FACULTY', 'SECURITY_OFFICER', 'AMBULANCE_OFFICER', 'ADMIN']}>
                  <DashboardLayout>
                    <EmergencyPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/pharmacy"
              element={
                <ProtectedRoute allowedRoles={['STUDENT', 'FACULTY', 'PHARMACY_DESK']}>
                  <DashboardLayout>
                    <PharmacyPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/mental-health"
              element={
                <ProtectedRoute allowedRoles={['STUDENT', 'FACULTY']}>
                  <DashboardLayout>
                    <MentalHealthPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
