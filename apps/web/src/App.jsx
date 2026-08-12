import { Route, Routes } from 'react-router-dom';
import { GuestRoute, HomeRoute, ProtectedRoute } from './auth/AuthRoutes.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import LoginPage from './pages/LoginPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRoute />} />
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>
      <Route path="*" element={<HomeRoute />} />
    </Routes>
  );
}
