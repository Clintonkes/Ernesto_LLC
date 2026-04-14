import { Navigate, Outlet } from 'react-router-dom';

export default function AdminRoute() {
  const isAuthenticated = !!localStorage.getItem('ra_admin_session');

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/admin/login" replace />;
  }

  // Render the child routes
  return <Outlet />;
}
