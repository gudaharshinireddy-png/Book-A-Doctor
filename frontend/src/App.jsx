import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import { ROLES } from "./utils/constants";
import DoctorLayout from "./layouts/DoctorLayout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Doctors from "./pages/Doctors";
import DoctorDetail from "./pages/DoctorDetail";
import PatientDashboard from "./pages/PatientDashboard";
import BookAppointment from "./pages/BookAppointment";
import MyAppointments from "./pages/MyAppointments";
import Profile from "./pages/Profile";
import ApplyDoctor from "./pages/ApplyDoctor";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorAppointments from "./pages/DoctorAppointments";
import DoctorProfile from "./pages/DoctorProfile";
import AdminDashboard from "./pages/AdminDashboard";
import PendingDoctors from "./pages/PendingDoctors";
import UserManagement from "./pages/UserManagement";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";

const AppLayout = ({ children }) => {
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register";
  const isDoctorModule = location.pathname.startsWith("/doctor/");

  return (
    <>
      {!isAuthPage && !isDoctorModule && <Navbar />}
      <main>{children}</main>
      {!isAuthPage && !isDoctorModule && location.pathname === "/" && <Footer />}
    </>
  );
};

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:id" element={<DoctorDetail />} />
        <Route
          path="/patient/dashboard"
          element={
            <ProtectedRoute roles={[ROLES.PATIENT]}>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book-appointment/:doctorId"
          element={
            <ProtectedRoute roles={[ROLES.PATIENT]}>
              <BookAppointment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/appointments"
          element={
            <ProtectedRoute roles={[ROLES.PATIENT]}>
              <MyAppointments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/apply"
          element={
            <ProtectedRoute roles={[ROLES.PATIENT]}>
              <ApplyDoctor />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor"
          element={
            <ProtectedRoute roles={[ROLES.DOCTOR]}>
              <DoctorLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<DoctorDashboard />} />
          <Route path="appointments" element={<DoctorAppointments />} />
          <Route path="profile" element={<DoctorProfile />} />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={[ROLES.ADMIN]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/doctors"
          element={
            <ProtectedRoute roles={[ROLES.ADMIN]}>
              <PendingDoctors />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute roles={[ROLES.ADMIN]}>
              <UserManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute roles={[ROLES.PATIENT]}>
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute roles={[ROLES.PATIENT]}>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  );
}

export default App;
