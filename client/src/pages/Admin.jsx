import React from 'react';
import { useEffect, useState } from 'react';
import { Users, PackageSearch, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import api from '../api';

export default function Admin() {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);

  async function load() {
    const [s, u, i] = await Promise.all([
      api.get('/admin/stats'),
      api.get('/admin/users'),
      api.get('/items', { params: { status: 'ALL' } })
    ]);
    setStats(s.data.stats);
    setUsers(u.data.users);
    setItems(i.data.items);
  }

  useEffect(() => { load(); }, []);

  async function remove(id) {
    if (!confirm('Delete this report permanently?')) return;
    await api.delete(`/items/${id}`);
    load();
  }

  return (
    <div>
      <div className="page-heading"><div><div className="eyebrow">Administration</div><h1>CampusFind control room</h1><p>Monitor reports, users and recovery activity.</p></div></div>

      <div className="admin-stats">
        {[
          ['Users', stats.users, Users, 'blue'],
          ['Lost reports', stats.lost, PackageSearch, 'red'],
          ['Found reports', stats.found, PackageSearch, 'green'],
          ['Returned', stats.returned, CheckCircle2, 'purple'],
          ['Pending claims', stats.pendingClaims, AlertCircle, 'amber']
        ].map(([label, value, Icon, color]) => (
          <div className="admin-stat" key={label}><div className={`admin-stat-icon ${color}`}><Icon size={20} /></div><span>{label}</span><strong>{value ?? '—'}</strong></div>
        ))}
      </div>

      <div className="admin-section">
        <div className="section-title-row"><div><div className="eyebrow">Moderation</div><h2>Recent reports</h2></div><ShieldCheck size={20} /></div>
        <div className="reports-table">
          <div className="table-head"><span>Item</span><span>Reporter</span><span>Location</span><span>Action</span></div>
          {items.slice(0, 10).map(item => (
            <div className="table-row" key={item._id}>
              <div><strong>{item.title}</strong><small>{item.type} · {item.category}</small></div>
              <span>{item.reportedBy?.name}</span>
              <span>{item.location.building}{item.location.room && ` · ${item.location.room}`}</span>
              <button className="danger-text" onClick={() => remove(item._id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-section">
        <div className="section-title-row"><div><div className="eyebrow">Registered community</div><h2>Users</h2></div></div>
        <div className="users-grid">{users.slice(0, 12).map(u => <div className="user-row" key={u._id}><div className="user-avatar">{u.name.slice(0,1)}</div><div><strong>{u.name}</strong><span>{u.email}</span></div><b>{u.role}</b></div>)}</div>
      </div>
    </div>
  );
}
