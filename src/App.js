import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext.jsx";
import { Toaster } from "./components/ui/toaster.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import Booking from "./pages/Booking.jsx";
import DashboardLayout from "./pages/DashboardLayout.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import RegistrationsPortal from "./pages/RegistrationsPortal.jsx";
import PassengersPortal from "./pages/PassengersPortal.jsx";
import TripAssignPortal from "./pages/TripAssignPortal.jsx";
import AdminRegistration from "./pages/registration/AdminRegistration.jsx";
import AttenderRegistration from "./pages/registration/AttenderRegistration.jsx";
import DriverRegistration from "./pages/registration/DriverRegistration.jsx";
import BusRegistration from "./pages/registration/BusRegistration.jsx";
import RouteRegistration from "./pages/registration/RouteRegistration.jsx";

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<RegistrationsPortal />} />
              <Route path="registration" element={<RegistrationsPortal />} />
              <Route path="passengers" element={<PassengersPortal />} />
              <Route path="trip-assign" element={<TripAssignPortal />} />
            </Route>
            {/* Registration Form Routes */}
            <Route path="/dashboard/registration/admin" element={<AdminRegistration />} />
            <Route path="/dashboard/registration/attender" element={<AttenderRegistration />} />
            <Route path="/dashboard/registration/driver" element={<DriverRegistration />} />
            <Route path="/dashboard/registration/bus" element={<BusRegistration />} />
            <Route path="/dashboard/registration/route" element={<RouteRegistration />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;