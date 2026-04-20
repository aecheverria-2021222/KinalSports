import { Routes, Route } from 'react-router-dom'
import { AuthPage } from '../../features/auth/pages/AuthPage.jsx'
import { DashboardPage } from '../layouts/DashboardPage.jsx'
import { ProtectedRoutes } from './ProtectedRoutes.jsx'
import { UnauthorizedPage } from '../../features/auth/pages/UnauthorizedPage.jsx'
import { Teams } from '../../features/teams/components/Teams.jsx'
import { Tournaments } from '../../features/tournaments/components/Tournaments.jsx'
import { Users } from '../../features/users/components/Users.jsx'
import { Reservations } from '../../features/reservations/components/Reservations.jsx'
import { Fields } from '../../features/fields/components/Fields.jsx'
import { RoleGuard } from './RoleGuard.jsx'

export const AppRoutes = () => {
  return (
    <Routes>
        <Route path='/' element={<AuthPage />} />
        <Route path='/unauthorized' element={<UnauthorizedPage />} />
        <Route 
          path='/dashboard/*' 
          element={
            <ProtectedRoutes>
              <RoleGuard allowedRoles={["ADMIN_ROLE"]}>
                <DashboardPage />
              </RoleGuard>
            </ProtectedRoutes>
          }
        >
          <Route path='fields' element={<Fields />} />
          <Route path='teams' element={<Teams />} />
          <Route path='tournaments' element={<Tournaments />} />
          <Route path='reservations' element={<Reservations />} />
          <Route path='users' element={<Users />} />
        </Route>
    </Routes>
  )
}