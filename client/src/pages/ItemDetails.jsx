import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, CalendarDays, MapPin, UserRound, Send, CheckCircle2 } from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

export default function ItemDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [reason, setReason] = useState('');
  const [verification, setVerification] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/items/${id}`).then(res => setItem(res.data.item)).catch(() => navigate('/browse')).finally(() => setLoading(false));
  }, [id]);

  async function claim(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/claims', { itemId: id, reason, verification });
      setMessage('Claim submitted successfully.');
      setReason('');
      setVerification('');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Unable to submit claim');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="empty-state">Loading report…</div>;
  if (!item) return null;

  const isOwner = item.reportedBy?._id === user?.id || item.reportedBy?._id === user?._id;

  return (
    <div>
      <Link className="back-link" to="/browse"><ArrowLeft size={16} /> Back to reports</Link>
      <div className="details-layout">
        <div className="details-image">
          <img src={item.imageUrl || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80'} alt={item.title} />
          <span className={`type-pill large ${item.type.toLowerCase()}`}>{item.type}</span>
        </div>
        <div className="details-content">
          <div className="item-category">{item.category}</div>
          <h1>{item.title}</h1>
          <p className="details-description">{item.description}</p>

          <div className="detail-list">
            <div><MapPin /><span><strong>{item.location.building}</strong>{item.location.room && ` · Room ${item.location.room}`}{item.location.area && ` · ${item.location.area}`}</span></div>
            <div><CalendarDays /><span>{new Date(item.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</span></div>
            <div><UserRound /><span>Reported by <strong>{item.reportedBy?.name}</strong></span></div>
          </div>

          {item.status === 'RETURNED' && <div className="success-banner"><CheckCircle2 /> This item has been returned.</div>}

          {!isOwner && item.status === 'ACTIVE' && (
            <form className="claim-box" onSubmit={claim}>
              <div><h3>Is this yours?</h3><p>Submit a claim. The reporter/admin can verify it before approving the return.</p></div>
              <label>Why do you believe this is your item?<textarea value={reason} onChange={e => setReason(e.target.value)} required placeholder="Describe when/where you lost it…" /></label>
              <label>Private verification detail<textarea value={verification} onChange={e => setVerification(e.target.value)} required placeholder="Mention a detail that proves ownership…" /></label>
              <button className="btn btn-primary" disabled={submitting}><Send size={17} /> {submitting ? 'Sending…' : 'Submit claim'}</button>
            </form>
          )}

          {message && <Toast message={message} type={message.includes('successfully') ? 'success' : 'error'} />}
        </div>
      </div>
    </div>
  );
}
