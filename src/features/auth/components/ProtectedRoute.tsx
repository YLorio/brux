import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Loader } from '@shared/components/feedback';
import { useAuth } from '../providers/AuthProvider';

export function ProtectedRoute() {
  const { profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="grid min-h-dvh place-items-center px-4">
        <Loader label="Cargando tu cuenta…" />
      </div>
    );
  }

  if (!profile) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

export function PublicOnlyRoute() {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="grid min-h-dvh place-items-center px-4">
        <Loader />
      </div>
    );
  }

  if (profile) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
