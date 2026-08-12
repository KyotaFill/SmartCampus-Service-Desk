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

function SessionUnavailable() {
  const { sessionError, retrySession, logout } = useAuth();

  return (
    <main className="session-error">
      <span className="session-error__icon" aria-hidden="true">!</span>
      <h1>Chưa thể kiểm tra phiên đăng nhập</h1>
      <p role="alert">{sessionError}</p>
      <div className="session-error__actions">
        <button className="primary-button primary-button--compact" type="button" onClick={retrySession}>
          Thử lại
        </button>
        <button className="secondary-button" type="button" onClick={logout}>
          Đăng xuất
        </button>
      </div>
    </main>
  );
}

function SessionState({ status }) {
  return status === 'checking' ? <SessionLoader /> : <SessionUnavailable />;
}

export function ProtectedRoute() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'checking' || status === 'unavailable') {
    return <SessionState status={status} />;
  }
  if (status !== 'authenticated') {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <Outlet />;
}

export function GuestRoute() {
  const { status } = useAuth();

  if (status === 'checking' || status === 'unavailable') {
    return <SessionState status={status} />;
  }
  if (status === 'authenticated') return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}

export function HomeRoute() {
  const { status } = useAuth();

  if (status === 'checking' || status === 'unavailable') {
    return <SessionState status={status} />;
  }
  return <Navigate to={status === 'authenticated' ? '/dashboard' : '/login'} replace />;
}
