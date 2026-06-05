import { Routes, Route } from "react-router-dom";
import { DashboardPage } from "../layouts/DashboardPage.jsx";
import { AuthPage } from "../../features/auth/pages/AuthPage.jsx";
import { VerifyEmailPage } from "../../features/auth/pages/VerifyEmailPage.jsx";
import { RoleGuard } from "./RoleGuard.jsx";
import { ProtectedRoute } from "./ProtectedRoute.jsx";
import { UnauthorizedPage } from "../../features/auth/pages/UnauthorizedPage.jsx";
import { Fields } from "../../features/fields/components/Fields.jsx";
import { Reservations } from "../../features/reservations/components/Reservations.jsx";
import { ResetPasswordPage } from "../../features/auth/pages/ResetPasswordPage.jsx";
import { Teams } from "../../features/teams/components/Teams.jsx";
import { Tournaments } from "../../features/tournaments/components/Tournaments.jsx";
import { Users } from "../../features/users/components/Users.jsx";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/" element={<AuthPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* PROTECTED + ROLE */}
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={["ADMIN_ROLE"]}>
              <DashboardPage />
            </RoleGuard>
          </ProtectedRoute>
        }
      >
        <Route path="fields" element={<Fields />} />
        <Route path="reservations" element={<Reservations />} />
        <Route path="teams" element={<Teams />} />
        <Route path="tournaments" element={<Tournaments />} />
        <Route path="users" element={<Users />} />
      </Route>
    </Routes>
  );
};
