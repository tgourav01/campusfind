import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, UserRound, Mail, LockKeyhole, Phone, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', studentId: '', phone: '', role: 'STUDENT'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create account');
    } finally {
      setLoading(false);
    }
  }

  const update = e => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="auth-page">
      <Link className="back-home" to="/"><ArrowLeft size={17} /> Back to CampusFind</Link>
      <div className="auth-card register-card">
        <div className="auth-heading">
          <div className="eyebrow">Join your campus</div>
          <h1>Create your account</h1>
          <p>Students and staff can report and recover belongings.</p>
        </div>
        {error && <div className="form-error">{error}</div>}
        <form onSubmit={submit} className="form two-col">
          <label className="span-2">Full name<div className="input-wrap"><UserRound size={18} /><input name="name" value={form.name} onChange={update} required /></div></label>
          <label>Email<div className="input-wrap"><Mail size={18} /><input name="email" type="email" value={form.email} onChange={update} required /></div></label>
          <label>Password<div className="input-wrap"><LockKeyhole size={18} /><input name="password" type="password" minLength="6" value={form.password} onChange={update} required /></div></label>
          <label>Student / Staff ID<div className="input-wrap"><GraduationCap size={18} /><input name="studentId" value={form.studentId} onChange={update} /></div></label>
          <label>Phone<div className="input-wrap"><Phone size={18} /><input name="phone" value={form.phone} onChange={update} /></div></label>
          <label className="span-2">Account type<select name="role" value={form.role} onChange={update}><option value="STUDENT">Student</option><option value="STAFF">Staff</option></select></label>
          <button className="btn btn-primary btn-full span-2" disabled={loading}>{loading ? 'Creating…' : 'Create account'}</button>
        </form>
        <p className="auth-switch">Already registered? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
}
