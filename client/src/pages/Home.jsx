import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight, Search, MapPin, ShieldCheck, Clock3,
  Building2, BookOpen, Users, CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const locations = [
  ['Academic Blocks', 'A, B, C and more', Building2],
  ['Library', 'Books, cards, electronics', BookOpen],
  ['Hostels', 'Rooms and common areas', Users],
  ['Canteen & Parking', 'Food court, parking, sports', MapPin]
];

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="landing">
      <header className="landing-nav">
        <Link to="/" className="brand">
          <span className="brand-mark">CF</span>
          <span>Campus<span>Find</span></span>
        </Link>
        <div className="landing-actions">
          <Link to="/browse">Browse Items</Link>
          {user ? (
            <Link className="btn btn-primary" to="/dashboard">Dashboard <ArrowRight size={17} /></Link>
          ) : (
            <Link className="btn btn-primary" to="/login">Sign in <ArrowRight size={17} /></Link>
          )}
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span /> University community platform</div>
          <h1>Lost something on campus? <em>Let’s find it.</em></h1>
          <p>
            CampusFind connects students and staff to report, discover and return
            belongings lost anywhere across the university.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary btn-large" onClick={() => navigate(user ? '/report' : '/login')}>
              <Search size={19} /> Report an item
            </button>
            <Link className="btn btn-secondary btn-large" to="/browse">
              Browse found items
            </Link>
          </div>
          <div className="trust-row">
            <span><CheckCircle2 size={16} /> Campus-focused</span>
            <span><ShieldCheck size={16} /> Secure accounts</span>
            <span><Clock3 size={16} /> Quick claims</span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="campus-card">
            <div className="campus-card-top">
              <span className="mini-label">TODAY ON CAMPUS</span>
              <span className="live-dot">● Live</span>
            </div>
            <div className="campus-map">
              <div className="map-block block-a">A</div>
              <div className="map-block block-b">B</div>
              <div className="map-block block-c">C</div>
              <div className="map-library">LIBRARY</div>
              <div className="map-canteen">CANTEEN</div>
              <div className="map-path" />
            </div>
            <div className="campus-card-footer">
              <div><strong>Block C · Room 204</strong><span>3 active reports</span></div>
              <MapPin size={22} />
            </div>
          </div>
        </div>
      </section>

      <section className="stats-strip">
        <div><strong>Campus-wide</strong><span>One place for lost & found</span></div>
        <div><strong>Block + Room</strong><span>Precise campus locations</span></div>
        <div><strong>Claim workflow</strong><span>Safer item recovery</span></div>
      </section>

      <section className="section locations-section">
        <div className="section-heading">
          <div><div className="eyebrow">Built for your campus</div><h2>Search where it actually happened.</h2></div>
          <p>From a classroom desk to the hostel corridor, every report keeps a clear campus location.</p>
        </div>
        <div className="location-grid">
          {locations.map(([title, sub, Icon]) => (
            <div className="location-card" key={title}>
              <div className="icon-box"><Icon size={22} /></div>
              <h3>{title}</h3>
              <p>{sub}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section how-section">
        <div className="section-heading centered">
          <div className="eyebrow">Simple process</div>
          <h2>From lost to found in three steps.</h2>
        </div>
        <div className="steps">
          <div><span>01</span><h3>Report</h3><p>Add the item, date and exact block/room.</p></div>
          <div><span>02</span><h3>Discover</h3><p>Search active lost and found reports.</p></div>
          <div><span>03</span><h3>Claim</h3><p>Verify ownership and arrange the return.</p></div>
        </div>
      </section>

      <footer className="landing-footer">
        <span>CampusFind © 2026</span>
        <span>University Lost & Found Management System</span>
      </footer>
    </div>
  );
}
