import { useState, useEffect } from 'react';
import Header from '../components/Header';
import { loadData, saveData, addItem } from '../data/store';

export default function Communications() {
  const [messages, setMessages] = useState([]);
  const [students, setStudents] = useState([]);
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ receiverId: '', subject: '', body: '' });

  useEffect(() => {
    setMessages(loadData('messages'));
    setStudents(loadData('students'));
    setUsers(loadData('users'));
  }, []);

  function refresh() {
    setMessages(loadData('messages'));
  }

  function handleSubmit(e) {
    e.preventDefault();
    addItem('messages', {
      senderId: 2,
      receiverId: parseInt(form.receiverId),
      subject: form.subject,
      body: form.body,
      date: new Date().toISOString().split('T')[0],
      branch: 'Main Campus'
    });
    setShowForm(false);
    setForm({ receiverId: '', subject: '', body: '' });
    refresh();
  }

  function getReceiverName(id) {
    const user = users.find(u => u.id === parseInt(id));
    if (user) return user.name;
    const student = students.find(s => s.id === parseInt(id));
    if (student) return `${student.firstName} ${student.lastName}`;
    return '-';
  }

  return (
    <div className="page">
      <Header title="Communications" subtitle="Messages and notifications" />

      <div className="page-actions">
        <button className="btn-primary" onClick={() => setShowForm(true)}>+ New Message</button>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>New Message</h2>
            <form onSubmit={handleSubmit} className="form-grid">
              <div className="form-group">
                <label>To</label>
                <select required value={form.receiverId} onChange={e => setForm({ ...form, receiverId: e.target.value })}>
                  <option value="">Select Recipient</option>
                  {users.filter(u => u.role === 'parent').map(u => <option key={u.id} value={u.id}>{u.name} (Parent)</option>)}
                  {users.filter(u => u.role === 'teacher').map(u => <option key={u.id} value={u.id}>{u.name} (Teacher)</option>)}
                </select>
              </div>
              <div className="form-group full-width">
                <label>Subject</label>
                <input required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
              </div>
              <div className="form-group full-width">
                <label>Message</label>
                <textarea required value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} rows={4} />
              </div>
              <div className="form-actions full-width">
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Send</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="messages-list">
        {messages.slice().reverse().map(m => (
          <div key={m.id} className="message-card">
            <div className="message-header">
              <strong>To: {getReceiverName(m.receiverId)}</strong>
              <span className="message-date">{m.date}</span>
            </div>
            <div className="message-subject">{m.subject}</div>
            <div className="message-body">{m.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
