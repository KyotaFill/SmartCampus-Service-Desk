import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './context.js';

function SessionLoader() {
  return (
    <main className="session-loader" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <p>Đang kiểm tra phiên đăng nhập…</p>
    </main>
  );
}

export function ProtectedRoute() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'checking') return <SessionLoader />;
  if (status !== 'authenticated') {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <Outlet />;
}

export function GuestRoute() {
  const { status } = useAuth();

  if (status === 'checking') return <SessionLoader />;
  if (status === 'authenticated') return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}

export function HomeRoute() {
  const { status } = useAuth();

  if (status === 'checking') return <SessionLoader />;
  return <Navigate to={status === 'authenticated' ? '/dashboard' : '/login'} replace />;
}
