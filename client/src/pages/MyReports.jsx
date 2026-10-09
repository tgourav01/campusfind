import React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, CheckCircle2, ArrowRight } from 'lucide-react';
import api from '../api';

export default function MyReports() {
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState('');

  async function load() {
    const res = await api.get('/items', { params: { status: 'ALL' } });
    const user = JSON.parse(localStorage.getItem('campusfind_user'));
    setItems(res.data.items.filter(i => i.reportedBy?._id === user?.id));
  }

  useEffect(() => { load(); }, []);

  async function remove(id) {
    if (!confirm('Delete this report?')) return;
    try {
      await api.delete(`/items/${id}`);
      setMessage('Report deleted.');
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Unable to delete');
    }
  }

  async function markReturned(id) {
    try {
      await api.patch(`/items/${id}/return`);
      setMessage('Item marked as returned.');
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Unable to update');
    }
  }

  return (
    <div>
      <div className="page-heading split"><div><div className="eyebrow">Your activity</div><h1>My reports</h1><p>Keep track of everything you have reported.</p></div><Link className="btn btn-primary" to="/report">Report new item</Link></div>
      {message && <div className="inline-message">{message}</div>}
      <div className="reports-table">
        <div className="table-head"><span>Item</span><span>Location</span><span>Status</span><span>Actions</span></div>
        {items.map(item => (
          <div className="table-row" key={item._id}>
            <div><strong>{item.title}</strong><small>{item.category} · {item.type}</small></div>
            <span>{item.location.building}{item.location.room && ` · ${item.location.room}`}</span>
            <span className={`status-tag ${item.status.toLowerCase()}`}>{item.status}</span>
            <div className="row-actions">
              <Link to={`/items/${item._id}`}><ArrowRight size={17} /></Link>
              {item.status !== 'RETURNED' && <button onClick={() => markReturned(item._id)} title="Mark returned"><CheckCircle2 size={17} /></button>}
              <button onClick={() => remove(item._id)} title="Delete"><Trash2 size={17} /></button>
            </div>
          </div>
        ))}
      </div>
      {!items.length && <div className="empty-state"><h3>No reports yet</h3><p>Report your first lost or found item.</p><Link className="btn btn-primary" to="/report">Create report</Link></div>}
    </div>
  );
}
