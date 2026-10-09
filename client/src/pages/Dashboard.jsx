import React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, ArrowRight, MapPin, FileText, CheckCircle2 } from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import ItemCard from '../components/ItemCard';

export default function Dashboard() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [mine, setMine] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get('/items', { params: { status: 'ALL' } }),
      api.get('/items', { params: { status: 'ALL', search: user?.name || '' } })
    ]).then(([all]) => {
      setItems(all.data.items.slice(0, 4));
    });
    api.get('/items', { params: { status: 'ALL' } }).then(res => {
      setMine(res.data.items.filter(i => i.reportedBy?._id === user?.id).slice(0, 3));
    });
  }, [user]);

  return (
    <div>
      <div className="welcome-row">
        <div><div className="eyebrow">Good to see you</div><h1>{user?.name?.split(' ')[0]}, what happened?</h1><p>Find a report or help someone get their belongings back.</p></div>
        <Link className="btn btn-primary" to="/report"><Plus size={18} /> Report item</Link>
      </div>

      <div className="quick-actions">
        <Link to="/browse"><span className="qa-icon blue"><Search /></span><div><strong>Search reports</strong><small>Look through lost & found items</small></div><ArrowRight /></Link>
        <Link to="/report"><span className="qa-icon green"><MapPin /></span><div><strong>Report something</strong><small>Add a lost or found item</small></div><ArrowRight /></Link>
        <Link to="/my-reports"><span className="qa-icon amber"><FileText /></span><div><strong>My reports</strong><small>Manage your submissions</small></div><ArrowRight /></Link>
      </div>

      <div className="section-title-row"><div><div className="eyebrow">Community activity</div><h2>Latest reports</h2></div><Link to="/browse">View all <ArrowRight size={16} /></Link></div>
      <div className="item-grid compact">{items.map(item => <ItemCard key={item._id} item={item} />)}</div>

      {mine.length > 0 && (
        <>
          <div className="section-title-row top-gap"><div><div className="eyebrow">Your activity</div><h2>Recent reports</h2></div><Link to="/my-reports">Manage <ArrowRight size={16} /></Link></div>
          <div className="mini-list">
            {mine.map(item => <Link to={`/items/${item._id}`} key={item._id}><div className={`mini-status ${item.type.toLowerCase()}`} /> <div><strong>{item.title}</strong><span>{item.location.building}{item.location.room && ` · ${item.location.room}`}</span></div><span className="mini-right">{item.status === 'RETURNED' ? <CheckCircle2 size={18} /> : item.type}</span></Link>)}
          </div>
        </>
      )}
    </div>
  );
}
