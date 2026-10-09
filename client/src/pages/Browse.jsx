import React from 'react';
import { useEffect, useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import api from '../api';
import ItemCard from '../components/ItemCard';

const buildings = ['Block A', 'Block B', 'Block C', 'Library', 'Hostel A', 'Hostel B', 'Canteen', 'Parking', 'Sports Complex', 'Auditorium'];
const categories = ['Electronics', 'Bags', 'Books', 'ID Cards', 'Wallets', 'Keys', 'Clothing', 'Accessories', 'Documents', 'Stationery', 'Other'];

export default function Browse() {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({ search: '', type: 'ALL', category: 'ALL', building: 'ALL' });
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await api.get('/items', { params: filters });
      setItems(res.data.items);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(load, 250);
    return () => clearTimeout(timer);
  }, [filters.search, filters.type, filters.category, filters.building]);

  function clear() {
    setFilters({ search: '', type: 'ALL', category: 'ALL', building: 'ALL' });
  }

  return (
    <div>
      <div className="page-heading">
        <div><div className="eyebrow">Campus inventory</div><h1>Browse lost & found</h1><p>Search reports by item, building, room or area.</p></div>
      </div>

      <div className="filter-panel">
        <div className="search-box"><Search size={19} /><input placeholder="Search iPhone, Block C, Room 204…" value={filters.search} onChange={e => setFilters({ ...filters, search: e.target.value })} /></div>
        <select value={filters.type} onChange={e => setFilters({ ...filters, type: e.target.value })}><option value="ALL">All types</option><option value="LOST">Lost</option><option value="FOUND">Found</option></select>
        <select value={filters.category} onChange={e => setFilters({ ...filters, category: e.target.value })}><option value="ALL">All categories</option>{categories.map(c => <option key={c}>{c}</option>)}</select>
        <select value={filters.building} onChange={e => setFilters({ ...filters, building: e.target.value })}><option value="ALL">All locations</option>{buildings.map(b => <option key={b}>{b}</option>)}</select>
        <button className="filter-clear" onClick={clear}><X size={16} /> Clear</button>
      </div>

      <div className="result-row"><span>{loading ? 'Loading…' : `${items.length} reports found`}</span><SlidersHorizontal size={16} /></div>

      {loading ? <div className="empty-state">Loading campus reports…</div> :
        items.length ? <div className="item-grid">{items.map(item => <ItemCard key={item._id} item={item} />)}</div> :
        <div className="empty-state"><div className="empty-icon"><Search /></div><h3>No reports found</h3><p>Try a different search or location.</p></div>
      }
    </div>
  );
}
