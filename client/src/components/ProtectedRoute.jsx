import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ admin = false }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="screen-loader">Loading CampusFind…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (admin && user.role !== 'ADMIN') return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}
