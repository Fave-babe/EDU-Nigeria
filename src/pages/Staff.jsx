import { useState, useEffect } from 'react';
import Header from '../components/Header';
import { loadData, saveData, addItem, deleteItem } from '../data/store';
import { useAuth } from '../context/AuthContext';

export default function Staff() {
  const { user } = useAuth();
  const canManage = user && (user.role === 'admin' || user.role === 'teacher');
  const [staff, setStaff] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', role: 'teacher', department: 'Academic', phone: '', dateEmployed: '', branch: 'Main Campus', status: 'active'
  });

  useEffect(() => {
    setStaff(loadData('staff'));
  }, []);

  function refresh() {
    setStaff(loadData('staff'));
  }

  function handleSubmit(e) {
    e.preventDefault();
    addItem('staff', form);
    setShowForm(false);
    setForm({ name: '', email: '', role: 'teacher', department: 'Academic', phone: '', dateEmployed: '', branch: 'Main Campus', status: 'active' });
    refresh();
  }

  function handleDelete(id) {
    if (window.confirm('Delete this staff record?')) {
      deleteItem('staff', id);
      refresh();
    }
  }

  return (
    <div className="page">
      <Header title="Staff Management" subtitle="Manage staff profiles and roles" />

      <div className="page-actions">
        {canManage && <button className="btn-primary" onClick={() => setShowForm(true)}>+ Add Staff</button>}
        {!canManage && <p className="role-note">You have read-only access to the staff directory.</p>}
      </div>

      {canManage && showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Add Staff</h2>
            <form onSubmit={handleSubmit} className="form-grid">
              <div className="form-group">
                <label>Full Name</label>
                <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                  <option value="bursar">Bursar</option>
                </select>
              </div>
              <div className="form-group">
                <label>Department</label>
                <select value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}>
                  <option>Academic</option>
                  <option>Finance</option>
                  <option>Administration</option>
                </select>
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Date Employed</label>
                <input type="date" required value={form.dateEmployed} onChange={e => setForm({ ...form, dateEmployed: e.target.value })} />
              </div>
              <div className="form-actions full-width">
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Department</th>
              <th>Phone</th>
              <th>Date Employed</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
             {staff.map(s => {
               const isCurrent = user && s.email && user.email &&
                 s.email.toLowerCase() === user.email.toLowerCase();
               return (
                 <tr key={s.id} className={isCurrent ? 'row-highlight' : ''}>
                   <td>{s.name}{isCurrent && <span className="you-badge"> (You)</span>}</td>
                   <td>{s.email}</td>
                   <td>{s.role}</td>
                   <td>{s.department}</td>
                   <td>{s.phone}</td>
                   <td>{s.dateEmployed}</td>
                   <td><span className="badge badge-success">{s.status}</span></td>
                   {canManage
                     ? <td><button className="btn-sm btn-danger" onClick={() => handleDelete(s.id)}>Delete</button></td>
                     : <td>—</td>}
                 </tr>
               );
             })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
