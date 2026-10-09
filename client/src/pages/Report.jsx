import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, CalendarDays, ArrowLeft } from 'lucide-react';
import api from '../api';

const categories = ['Electronics', 'Bags', 'Books', 'ID Cards', 'Wallets', 'Keys', 'Clothing', 'Accessories', 'Documents', 'Stationery', 'Other'];
const buildings = ['Block A', 'Block B', 'Block C', 'Block D', 'Library', 'Hostel A', 'Hostel B', 'Canteen', 'Parking', 'Sports Complex', 'Auditorium', 'Other'];

export default function Report() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    type: 'LOST', title: '', category: 'Electronics', description: '',
    building: 'Block A', room: '', area: '', date: new Date().toISOString().slice(0, 10), imageUrl: ''
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const update = e => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const res = await api.post('/items', form);
      navigate(`/items/${res.data.item._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not submit report');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="narrow-page">
      <button className="back-link button-reset" onClick={() => navigate(-1)}><ArrowLeft size={16} /> Back</button>
      <div className="page-heading">
        <div><div className="eyebrow">Community contribution</div><h1>Report an item</h1><p>Give enough detail to help someone recognise and recover it.</p></div>
      </div>

      <form className="report-form" onSubmit={submit}>
        <div className="type-switch">
          <button type="button" className={form.type === 'LOST' ? 'active lost' : ''} onClick={() => setForm({ ...form, type: 'LOST' })}>I lost something</button>
          <button type="button" className={form.type === 'FOUND' ? 'active found' : ''} onClick={() => setForm({ ...form, type: 'FOUND' })}>I found something</button>
        </div>

        {error && <div className="form-error">{error}</div>}

        <div className="form-section">
          <div className="form-section-title"><span>01</span><div><h3>What is it?</h3><p>Basic information about the item.</p></div></div>
          <div className="form-grid">
            <label>Item name *<input name="title" value={form.title} onChange={update} placeholder="e.g. Black AirPods Pro" required /></label>
            <label>Category *<select name="category" value={form.category} onChange={update}>{categories.map(c => <option key={c}>{c}</option>)}</select></label>
            <label className="span-2">Description *<textarea name="description" value={form.description} onChange={update} placeholder="Describe colour, brand, markings or other useful details…" required /></label>
          </div>
        </div>

        <div className="form-section">
          <div className="form-section-title"><span>02</span><div><h3>Where did it happen?</h3><p>Campus location makes reports much easier to discover.</p></div></div>
          <div className="form-grid">
            <label>Building / block *<select name="building" value={form.building} onChange={update}>{buildings.map(b => <option key={b}>{b}</option>)}</select></label>
            <label>Room / floor<input name="room" value={form.room} onChange={update} placeholder="e.g. 204" /></label>
            <label className="span-2">Specific area<input name="area" value={form.area} onChange={update} placeholder="e.g. Back row, near the door, reception desk…" /></label>
          </div>
        </div>

        <div className="form-section">
          <div className="form-section-title"><span>03</span><div><h3>When & what does it look like?</h3><p>Add a date and optional image.</p></div></div>
          <div className="form-grid">
            <label>Date *<div className="input-with-icon"><CalendarDays size={17} /><input type="date" name="date" value={form.date} onChange={update} required /></div></label>
            <label>Image URL<div className="input-with-icon"><Camera size={17} /><input name="imageUrl" value={form.imageUrl} onChange={update} placeholder="https://…" /></div></label>
          </div>
        </div>

        <div className="form-submit">
          <MapPin size={19} />
          <span>Your report will appear under <strong>{form.building}{form.room ? ` · Room ${form.room}` : ''}</strong>.</span>
          <button className="btn btn-primary" disabled={saving}>{saving ? 'Publishing…' : 'Publish report'}</button>
        </div>
      </form>
    </div>
  );
}
