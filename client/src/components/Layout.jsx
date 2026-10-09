import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Search, PlusCircle, LayoutDashboard, FileText, LogOut,
  ShieldCheck, Menu, X, UserCircle, ClipboardCheck
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/browse', label: 'Browse Items', icon: Search },
    { to: '/report', label: 'Report Item', icon: PlusCircle },
    { to: '/my-reports', label: 'My Reports', icon: FileText },
    { to: '/claims', label: 'My Claims', icon: ClipboardCheck }
  ];

  if (user?.role === 'ADMIN') {
    links.push({ to: '/admin', label: 'Admin Panel', icon: ShieldCheck });
  }

  function signOut() {
    logout();
    navigate('/');
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink to="/" className="brand">
          <span className="brand-mark">CF</span>
          <span>Campus<span>Find</span></span>
        </NavLink>

        <button className="mobile-menu" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>

        <nav className={`nav ${open ? 'open' : ''}`}>
          <NavLink to="/browse" onClick={() => setOpen(false)}>Browse</NavLink>
          <NavLink to="/report" onClick={() => setOpen(false)}>Report</NavLink>
          <div className="nav-divider" />
          <div className="user-chip">
            <UserCircle size={18} />
            <span>{user?.name}</span>
          </div>
          <button className="logout-btn" onClick={signOut}>
            <LogOut size={17} /> Logout
          </button>
        </nav>
      </header>

      <div className="body-layout">
        <aside className="sidebar">
          <div className="sidebar-label">Workspace</div>
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className="side-link">
              <Icon size={19} />
              <span>{label}</span>
            </NavLink>
          ))}
        </aside>

        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
