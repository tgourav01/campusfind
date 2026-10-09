import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Browse from './pages/Browse';
import ItemDetails from './pages/ItemDetails';
import Dashboard from './pages/Dashboard';
import Report from './pages/Report';
import MyReports from './pages/MyReports';
import Claims from './pages/Claims';
import Admin from './pages/Admin';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/items/:id" element={<ItemDetails />} />
              <Route path="/report" element={<Report />} />
              <Route path="/my-reports" element={<MyReports />} />
              <Route path="/claims" element={<Claims />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute admin />}>
            <Route element={<Layout />}>
              <Route path="/admin" element={<Admin />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
