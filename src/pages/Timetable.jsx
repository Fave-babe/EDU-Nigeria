import { useState, useEffect } from 'react';
import Header from '../components/Header';
import { loadData, addItem, deleteItem } from '../data/store';
import { useAuth } from '../context/AuthContext';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function Timetable() {
  const { user } = useAuth();
  const canManage = user && (user.role === 'admin' || user.role === 'teacher');

  const [entries, setEntries] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    classId: '', day: 'Monday', period: 1, startTime: '08:00', endTime: '08:45', subject: '', teacher: user?.name || ''
  });

  useEffect(() => {
    setEntries(loadData('timetable'));
    setClasses(loadData('classes'));
    setSubjects(loadData('subjects'));
    const cls = loadData('classes');
    if (cls.length) setSelectedClass(String(cls[0].id));
  }, []);

  function refresh() {
    setEntries(loadData('timetable'));
  }

  function handleSubmit(e) {
    e.preventDefault();
    addItem('timetable', {
      ...form,
      classId: parseInt(form.classId),
      period: parseInt(form.period),
      branch: 'Main Campus'
    });
    setShowForm(false);
    setForm({ classId: '', day: 'Monday', period: 1, startTime: '08:00', endTime: '08:45', subject: '', teacher: user?.name || '' });
    refresh();
  }

  function handleDelete(id) {
    if (window.confirm('Delete this timetable entry?')) {
      deleteItem('timetable', id);
      refresh();
    }
  }

  const visibleEntries = selectedClass
    ? entries.filter(en => en.classId === parseInt(selectedClass))
    : entries;

  function entriesForDay(day) {
    return visibleEntries
      .filter(en => en.day === day)
      .sort((a, b) => a.period - b.period);
  }

  return (
    <div className="page">
      <Header title="Timetable" subtitle="Create and manage class timetables" />

      <div className="page-actions">
        <div className="form-group" style={{ minWidth: '220px', margin: 0 }}>
          <label>Class</label>
          <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name} {c.arm}</option>
            ))}
          </select>
        </div>
        {canManage && (
          <button className="btn-primary" onClick={() => setShowForm(true)}>+ Add Period</button>
        )}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Add Timetable Period</h2>
            <form onSubmit={handleSubmit} className="form-grid">
              <div className="form-group">
                <label>Class</label>
                <select required value={form.classId} onChange={e => setForm({ ...form, classId: e.target.value })}>
                  <option value="">Select Class</option>
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name} {c.arm}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Day</label>
                <select value={form.day} onChange={e => setForm({ ...form, day: e.target.value })}>
                  {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Period</label>
                <input type="number" min="1" max="12" required value={form.period} onChange={e => setForm({ ...form, period: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Subject</label>
                <input required list="subject-list" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="e.g. Mathematics" />
                <datalist id="subject-list">
                  {subjects.map(s => <option key={s.id} value={s.name} />)}
                </datalist>
              </div>
              <div className="form-group">
                <label>Start Time</label>
                <input type="time" required value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} />
              </div>
              <div className="form-group">
                <label>End Time</label>
                <input type="time" required value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} />
              </div>
              <div className="form-group full-width">
                <label>Teacher</label>
                <input required value={form.teacher} onChange={e => setForm({ ...form, teacher: e.target.value })} />
              </div>
              <div className="form-actions full-width">
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="timetable-grid">
        {DAYS.map(day => (
          <div key={day} className="timetable-day">
            <h3>{day}</h3>
            {entriesForDay(day).length === 0 ? (
              <p className="empty-day">No periods</p>
            ) : (
              entriesForDay(day).map(en => (
                <div key={en.id} className="timetable-period">
                  <div className="period-time">{en.startTime} - {en.endTime}</div>
                  <div className="period-subject">{en.subject}</div>
                  <div className="period-meta">Period {en.period} • {en.teacher}</div>
                  {canManage && (
                    <button className="btn-sm btn-danger" onClick={() => handleDelete(en.id)}>Delete</button>
                  )}
                </div>
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
