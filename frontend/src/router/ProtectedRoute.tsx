import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = Cookies.get('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

export function PublicRoute({ children }: { children: React.ReactNode }) {
  const token = Cookies.get('token');
  if (token) {
    return <Navigate to="/user/dashboard" replace />;
  }
  return <>{children}</>;
}
