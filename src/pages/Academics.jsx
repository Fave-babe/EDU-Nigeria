import { useState, useEffect, useMemo } from 'react';
import Header from '../components/Header';
import { loadData, saveData, addItem, updateItem } from '../data/store';

export default function Academics() {
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [settings, setSettings] = useState({});

  const [activeTab, setActiveTab] = useState('grades');
  const [showGradeForm, setShowGradeForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');

  const [gradeForm, setGradeForm] = useState({
    studentId: '', subjectId: '', classId: '', term: 'First Term', session: '2024/2025', score: ''
  });

  useEffect(() => {
    setSubjects(loadData('subjects'));
    setClasses(loadData('classes'));
    setStudents(loadData('students'));
    setGrades(loadData('grades'));
    setSettings(loadData('settings'));
  }, []);

  function getGradeForScore(score) {
    if (!settings.gradingScale) return 'N/A';
    const scale = settings.gradingScale.find(g => score >= g.min && score <= g.max);
    return scale ? scale.grade : 'N/A';
  }

  function getRemarkForScore(score) {
    if (!settings.gradingScale) return '';
    const scale = settings.gradingScale.find(g => score >= g.min && score <= g.max);
    return scale ? scale.remark : '';
  }

  function handleGradeSubmit(e) {
    e.preventDefault();
    const score = parseInt(gradeForm.score);
    const existing = grades.find(g => g.studentId === parseInt(gradeForm.studentId) && g.subjectId === parseInt(gradeForm.subjectId) && g.term === gradeForm.term && g.session === gradeForm.session);
    
    const data = {
      studentId: parseInt(gradeForm.studentId),
      subjectId: parseInt(gradeForm.subjectId),
      classId: parseInt(gradeForm.classId),
      term: gradeForm.term,
      session: gradeForm.session,
      score,
      grade: getGradeForScore(score),
      remark: getRemarkForScore(score),
      teacherId: 2
    };

    if (existing) {
      updateItem('grades', existing.id, data);
    } else {
      addItem('grades', data);
    }
    setGrades(loadData('grades'));
    setShowGradeForm(false);
    setGradeForm({ studentId: '', subjectId: '', classId: '', term: 'First Term', session: '2024/2025', score: '' });
  }

  const filteredGrades = selectedStudent ? grades.filter(g => g.studentId === parseInt(selectedStudent)) : grades;

  const studentPerformance = useMemo(() => {
    if (!selectedStudent) return [];
    const sid = parseInt(selectedStudent);
    const studentGrades = grades.filter(g => g.studentId === sid);
    const termMap = {};
    studentGrades.forEach(g => {
      if (!termMap[g.term]) termMap[g.term] = [];
      termMap[g.term].push(g.score);
    });
    return Object.entries(termMap).map(([term, scores]) => ({
      term,
      avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    }));
  }, [grades, selectedStudent]);

  function exportReportCard(student) {
    const s = students.find(st => st.id === parseInt(student));
    if (!s) return;
    const studentGrades = grades.filter(g => g.studentId === parseInt(student));
    const classObj = classes.find(c => c.id === s.classId);
    
    let html = `<!DOCTYPE html><html><head><title>Report Card - ${s.firstName} ${s.lastName}</title><style>
      body{font-family:Arial,sans-serif;max-width:800px;margin:0 auto;padding:20px;}
      h1{text-align:center;border-bottom:2px solid #1a73e8;padding-bottom:10px;}
      table{width:100%;border-collapse:collapse;margin-top:20px;}
      th,td{border:1px solid #ddd;padding:8px;text-align:left;}
      th{background:#1a73e8;color:white;}
    </style></head><body>`;
    html += `<h1>Report Card</h1>`;
    html += `<p><strong>Name:</strong> ${s.firstName} ${s.lastName}</p>`;
    html += `<p><strong>Admission No:</strong> ${s.admissionNo}</p>`;
    html += `<p><strong>Class:</strong> ${classObj ? classObj.name : '-'}</p>`;
    html += `<p><strong>Session:</strong> ${s.session}</p>`;
    html += `<table><tr><th>Subject</th><th>Score</th><th>Grade</th><th>Remark</th></tr>`;
    studentGrades.forEach(g => {
      const subject = subjects.find(sub => sub.id === g.subjectId);
      html += `<tr><td>${subject ? subject.name : '-'}</td><td>${g.score}</td><td>${g.grade}</td><td>${g.remark}</td></tr>`;
    });
    html += `</table></body></html>`;
    
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-card-${s.firstName}-${s.lastName}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="page">
      <Header title="Academics" subtitle="Manage subjects, grades, and report cards" />

      <div className="tabs">
        <button className={`tab ${activeTab === 'grades' ? 'active' : ''}`} onClick={() => setActiveTab('grades')}>Grades</button>
        <button className={`tab ${activeTab === 'performance' ? 'active' : ''}`} onClick={() => setActiveTab('performance')}>Performance</button>
        <button className={`tab ${activeTab === 'reportcards' ? 'active' : ''}`} onClick={() => setActiveTab('reportcards')}>Report Cards</button>
      </div>

      {activeTab === 'grades' && (
        <div>
          <div className="page-actions">
            <button className="btn-primary" onClick={() => setShowGradeForm(true)}>+ Add Grade</button>
          </div>

          {showGradeForm && (
            <div className="modal-overlay" onClick={() => setShowGradeForm(false)}>
              <div className="modal" onClick={e => e.stopPropagation()}>
                <h2>Record Grade</h2>
                <form onSubmit={handleGradeSubmit} className="form-grid">
                  <div className="form-group">
                    <label>Student</label>
                    <select required value={gradeForm.studentId} onChange={e => setGradeForm({ ...gradeForm, studentId: e.target.value })}>
                      <option value="">Select Student</option>
                      {students.map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Subject</label>
                    <select required value={gradeForm.subjectId} onChange={e => setGradeForm({ ...gradeForm, subjectId: e.target.value })}>
                      <option value="">Select Subject</option>
                      {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Class</label>
                    <select required value={gradeForm.classId} onChange={e => setGradeForm({ ...gradeForm, classId: e.target.value })}>
                      <option value="">Select Class</option>
                      {classes.map(c => <option key={c.id} value={c.id}>{c.name} {c.arm}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Term</label>
                    <select value={gradeForm.term} onChange={e => setGradeForm({ ...gradeForm, term: e.target.value })}>
                      {(settings.termStructure || ['First Term', 'Second Term', 'Third Term']).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Score (0-100)</label>
                    <input type="number" min="0" max="100" required value={gradeForm.score} onChange={e => setGradeForm({ ...gradeForm, score: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Session</label>
                    <input required value={gradeForm.session} onChange={e => setGradeForm({ ...gradeForm, session: e.target.value })} />
                  </div>
                  <div className="form-actions full-width">
                    <button type="button" className="btn-secondary" onClick={() => setShowGradeForm(false)}>Cancel</button>
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
                  <th>Student</th>
                  <th>Subject</th>
                  <th>Term</th>
                  <th>Score</th>
                  <th>Grade</th>
                  <th>Remark</th>
                </tr>
              </thead>
              <tbody>
                {filteredGrades.slice(0, 20).map(g => {
                  const student = students.find(s => s.id === g.studentId);
                  const subject = subjects.find(s => s.id === g.subjectId);
                  return (
                    <tr key={g.id}>
                      <td>{student ? `${student.firstName} ${student.lastName}` : '-'}</td>
                      <td>{subject ? subject.name : '-'}</td>
                      <td>{g.term}</td>
                      <td>{g.score}</td>
                      <td><span className="badge badge-info">{g.grade}</span></td>
                      <td>{g.remark}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'performance' && (
        <div className="dashboard-card">
          <h3>Student Performance Trends</h3>
          <div className="form-group" style={{ maxWidth: '300px', marginBottom: '20px' }}>
            <label>Select Student</label>
            <select value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)}>
              <option value="">All Students</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
            </select>
          </div>
          {studentPerformance.length > 0 ? (
            <div className="performance-bars">
              {studentPerformance.map(p => (
                <div key={p.term} className="perf-item">
                  <div className="perf-label">{p.term}</div>
                  <div className="perf-bar-bg">
                    <div className="perf-bar" style={{ width: `${p.avg}%` }}></div>
                  </div>
                  <div className="perf-value">{p.avg}%</div>
                </div>
              ))}
            </div>
          ) : (
            <p>No performance data available.</p>
          )}
        </div>
      )}

      {activeTab === 'reportcards' && (
        <div className="dashboard-card">
          <h3>Generate Report Cards</h3>
          <div className="form-group" style={{ maxWidth: '300px', marginBottom: '20px' }}>
            <label>Select Student</label>
            <select value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)}>
              <option value="">Select Student</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
            </select>
          </div>
          {selectedStudent && (
            <button className="btn-primary" onClick={() => exportReportCard(selectedStudent)}>Download Report Card</button>
          )}
        </div>
      )}
    </div>
  );
}
