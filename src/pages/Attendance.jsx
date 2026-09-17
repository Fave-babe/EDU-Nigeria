import { useState, useEffect } from 'react';
import Header from '../components/Header';
import { loadData, saveData, addItem } from '../data/store';

export default function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('');
  const [records, setRecords] = useState({});

  useEffect(() => {
    setAttendance(loadData('attendance'));
    setClasses(loadData('classes'));
    setStudents(loadData('students'));
  }, []);

  function getClassStudents() {
    if (!selectedClass) return [];
    return students.filter(s => s.classId === parseInt(selectedClass) && s.status === 'active');
  }

  function handleStatusChange(studentId, status) {
    setRecords(prev => ({ ...prev, [studentId]: status }));
  }

  function saveAttendance() {
    const classId = parseInt(selectedClass);
    if (!classId) {
      alert('Please select a class');
      return;
    }

    const classStudents = getClassStudents();
    const newRecords = [];
    const existing = attendance.filter(a => a.date === selectedDate && a.classId === classId);

    classStudents.forEach(student => {
      const existingRecord = existing.find(e => e.studentId === student.id);
      const status = records[student.id] || (existingRecord ? existingRecord.status : 'present');
      newRecords.push({
        id: existingRecord ? existingRecord.id : Date.now() + student.id,
        date: selectedDate,
        classId,
        studentId: student.id,
        status,
        teacherId: 2,
        branch: 'Main Campus'
      });
    });

    const updated = attendance.filter(a => !(a.date === selectedDate && a.classId === classId));
    saveData('attendance', [...updated, ...newRecords]);
    setAttendance([...updated, ...newRecords]);
    alert('Attendance saved successfully');
  }

  function getStatusBadge(status) {
    const map = {
      present: 'badge-success',
      absent: 'badge-danger',
      late: 'badge-warning',
      excused: 'badge-info'
    };
    return map[status] || 'badge-info';
  }

  const classStudents = getClassStudents();
  const existingRecords = attendance.filter(a => a.date === selectedDate && a.classId === parseInt(selectedClass));

  return (
    <div className="page">
      <Header title="Attendance" subtitle="Track daily student attendance" />

      <div className="filters-bar">
        <div className="form-group">
          <label>Date</label>
          <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Class</label>
          <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
            <option value="">Select Class</option>
            {classes.map(c => <option key={c.id} value={c.id}>{c.name} {c.arm}</option>)}
          </select>
        </div>
        <button className="btn-primary" onClick={saveAttendance}>Save Attendance</button>
      </div>

      {selectedClass && (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Admission No</th>
                <th>Student Name</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {classStudents.map(student => {
                const existing = existingRecords.find(e => e.studentId === student.id);
                const currentStatus = records[student.id] || existing?.status || 'present';
                return (
                  <tr key={student.id}>
                    <td>{student.admissionNo}</td>
                    <td>{student.firstName} {student.lastName}</td>
                    <td>
                      <select value={currentStatus} onChange={e => handleStatusChange(student.id, e.target.value)} className="status-select">
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                        <option value="late">Late</option>
                        <option value="excused">Excused</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="dashboard-card" style={{ marginTop: '24px' }}>
        <h3>Recent Attendance Records</h3>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Class</th>
                <th>Student</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.slice(-10).reverse().map(a => {
                const student = students.find(s => s.id === a.studentId);
                const cls = classes.find(c => c.id === a.classId);
                return (
                  <tr key={a.id}>
                    <td>{a.date}</td>
                    <td>{cls ? `${cls.name} ${cls.arm}` : '-'}</td>
                    <td>{student ? `${student.firstName} ${student.lastName}` : '-'}</td>
                    <td><span className={`badge ${getStatusBadge(a.status)}`}>{a.status}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
