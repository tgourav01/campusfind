import React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, X, ArrowRight } from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function Claims() {
  const { user } = useAuth();
  const [claims, setClaims] = useState([]);
  const [received, setReceived] = useState([]);
  const [tab, setTab] = useState('sent');
  const [message, setMessage] = useState('');

  async function load() {
    const mine = await api.get('/claims/mine');
    setClaims(mine.data.claims);
    if (user?.role !== 'ADMIN') {
      const rec = await api.get('/claims/for-my-items');
      setReceived(rec.data.claims);
    }
  }

  useEffect(() => { load(); }, [user]);

  async function update(id, status) {
    try {
      await api.patch(`/claims/${id}`, { status });
      setMessage(status === 'APPROVED' ? 'Claim approved and item returned.' : 'Claim rejected.');
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Unable to update claim');
    }
  }

  const list = tab === 'sent' ? claims : received;

  return (
    <div>
      <div className="page-heading"><div><div className="eyebrow">Ownership verification</div><h1>Claims</h1><p>Review claims you submitted or received for your reports.</p></div></div>
      <div className="tabs"><button className={tab === 'sent' ? 'active' : ''} onClick={() => setTab('sent')}>My claims</button><button className={tab === 'received' ? 'active' : ''} onClick={() => setTab('received')}>Claims on my items</button></div>
      {message && <div className="inline-message">{message}</div>}
      <div className="claim-list">
        {list.map(claim => (
          <div className="claim-card" key={claim._id}>
            <div className="claim-main">
              <div className="claim-avatar">{claim.item?.title?.slice(0, 1)}</div>
              <div><Link to={`/items/${claim.item?._id}`}><h3>{claim.item?.title}</h3></Link><p>{claim.item?.location?.building}{claim.item?.location?.room && ` · ${claim.item.location.room}`}</p></div>
            </div>
            <div className="claim-info"><span className={`status-tag ${claim.status.toLowerCase()}`}>{claim.status}</span>{tab === 'received' && <><strong>{claim.claimant?.name}</strong><small>{claim.reason}</small><small><b>Verification:</b> {claim.verification}</small></>}</div>
            {tab === 'received' && claim.status === 'PENDING' && <div className="claim-actions"><button className="approve" onClick={() => update(claim._id, 'APPROVED')}><Check size={17} /> Approve</button><button className="reject" onClick={() => update(claim._id, 'REJECTED')}><X size={17} /> Reject</button></div>}
            {tab === 'sent' && <ArrowRight size={18} />}
          </div>
        ))}
      </div>
      {!list.length && <div className="empty-state"><h3>No claims here</h3><p>Claims will appear when someone submits an ownership request.</p></div>}
    </div>
  );
}
