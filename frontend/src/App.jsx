import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import { MainLayout } from './components/layout/MainLayout';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import MyRoom from './pages/student/MyRoom';
import MyProfile from './pages/student/MyProfile';
import StudentNotices from './pages/student/StudentNotices';
import StudentComplaints from './pages/student/StudentComplaints';
import StudentLeave from './pages/student/StudentLeave';
import StudentAttendance from './pages/student/StudentAttendance';
import StudentBus from './pages/student/StudentBus';
import StudentMess from './pages/student/StudentMess';
import StudentVisitors from './pages/student/StudentVisitors';
import StudentEmergency from './pages/student/StudentEmergency';
import StudentSettings from './pages/student/StudentSettings';

// Warden Pages
import WardenDashboard from './pages/warden/WardenDashboard';
import StudentList from './pages/warden/StudentList';
import RoomManagement from './pages/warden/RoomManagement';
import NoticeCenter from './pages/warden/NoticeCenter';
import ComplaintBoard from './pages/warden/ComplaintBoard';
import LeaveApproval from './pages/warden/LeaveApproval';
import AttendanceManager from './pages/warden/AttendanceManager';
import BusManager from './pages/warden/BusManager';
import MessManager from './pages/warden/MessManager';
import VisitorManager from './pages/warden/VisitorManager';
import EmergencyContactsManager from './pages/warden/EmergencyContactsManager';
import ReportsAnalytics from './pages/warden/ReportsAnalytics';
import WardenSettings from './pages/warden/WardenSettings';
import WardenProfile from './pages/warden/WardenProfile';

const RootRedirect = () => {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;
  return user.role === 'ROLE_WARDEN' 
    ? <Navigate to="/warden/dashboard" replace /> 
    : <Navigate to="/student/dashboard" replace />;
};

export const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<RootRedirect />} />

      {/* Protected Student Routes */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={['ROLE_STUDENT']}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/student/dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="profile" element={<MyProfile />} />
        <Route path="room" element={<MyRoom />} />
        <Route path="notices" element={<StudentNotices />} />
        <Route path="complaints" element={<StudentComplaints />} />
        <Route path="leave" element={<StudentLeave />} />
        <Route path="attendance" element={<StudentAttendance />} />
        <Route path="bus" element={<StudentBus />} />
        <Route path="mess" element={<StudentMess />} />
        <Route path="visitors" element={<StudentVisitors />} />
        <Route path="emergency" element={<StudentEmergency />} />
        <Route path="settings" element={<StudentSettings />} />
      </Route>

      {/* Protected Warden Routes */}
      <Route
        path="/warden"
        element={
          <ProtectedRoute allowedRoles={['ROLE_WARDEN']}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/warden/dashboard" replace />} />
        <Route path="dashboard" element={<WardenDashboard />} />
        <Route path="students" element={<StudentList />} />
        <Route path="rooms" element={<RoomManagement />} />
        <Route path="notices" element={<NoticeCenter />} />
        <Route path="complaints" element={<ComplaintBoard />} />
        <Route path="leaves" element={<LeaveApproval />} />
        <Route path="leave" element={<LeaveApproval />} />
        <Route path="attendance" element={<AttendanceManager />} />
        <Route path="bus" element={<BusManager />} />
        <Route path="mess" element={<MessManager />} />
        <Route path="visitors" element={<VisitorManager />} />
        <Route path="emergency" element={<EmergencyContactsManager />} />
        <Route path="reports" element={<ReportsAnalytics />} />
        <Route path="settings" element={<WardenSettings />} />
        <Route path="profile" element={<WardenProfile />} />
      </Route>

      {/* 404 Catch-All */}
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
};

export default App;
