import { Routes, Route } from "react-router-dom";
import { BookingPage } from "@/components/booking/BookingPage";
import { BookingConfirmation } from "@/components/booking/BookingConfirmation";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { DashboardPage } from "@/components/admin/DashboardPage";
import { SchedulePage } from "@/components/admin/SchedulePage";
import { ClientsPage } from "@/components/admin/ClientsPage";
import { ServicesPage } from "@/components/admin/ServicesPage";
import { StaffPage } from "@/components/admin/StaffPage";
import { SettingsPage } from "@/components/admin/SettingsPage";
import { Toaster } from "@/components/ui/toast";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/book/:businessSlug" element={<BookingPage />} />
        <Route path="/book/:businessSlug/success" element={<BookingConfirmation />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="schedule" element={<SchedulePage />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="staff" element={<StaffPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}
