import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: 'student@campusfind.com', password: 'Student@123' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to sign in');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <Link className="back-home" to="/"><ArrowLeft size={17} /> Back to CampusFind</Link>
      <div className="auth-card">
        <div className="auth-logo"><span className="brand-mark">CF</span></div>
        <div className="auth-heading">
          <div className="eyebrow">Welcome back</div>
          <h1>Sign in to CampusFind</h1>
          <p>Manage your campus reports and claims.</p>
        </div>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={submit} className="form">
          <label>Email<div className="input-wrap"><Mail size={18} /><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></div></label>
          <label>Password<div className="input-wrap"><LockKeyhole size={18} /><input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required /></div></label>
          <button className="btn btn-primary btn-full" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
        </form>

        <div className="demo-box">
          <ShieldCheck size={18} />
          <div><strong>Demo student</strong><span>student@campusfind.com · Student@123</span></div>
        </div>
        <p className="auth-switch">New to CampusFind? <Link to="/register">Create an account</Link></p>
      </div>
    </div>
  );
}
