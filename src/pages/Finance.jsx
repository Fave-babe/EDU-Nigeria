import { useState, useEffect } from 'react';
import Header from '../components/Header';
import { loadData, saveData, addItem, updateItem } from '../data/store';

export default function Finance() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [fees, setFees] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [activeTab, setActiveTab] = useState('invoices');
  const [showFeeForm, setShowFeeForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const [feeForm, setFeeForm] = useState({ classId: '', category: 'Tuition', amount: '', term: 'First Term', session: '2024/2025' });
  const [paymentForm, setPaymentForm] = useState({ invoiceId: '', amount: '', method: 'bank_transfer', date: '', reference: '' });

  useEffect(() => {
    setStudents(loadData('students'));
    setClasses(loadData('classes'));
    setFees(loadData('fees'));
    setInvoices(loadData('invoices'));
    setPayments(loadData('payments'));
  }, []);

  function refresh() {
    setStudents(loadData('students'));
    setClasses(loadData('classes'));
    setFees(loadData('fees'));
    setInvoices(loadData('invoices'));
    setPayments(loadData('payments'));
  }

  function handleFeeSubmit(e) {
    e.preventDefault();
    addItem('fees', { ...feeForm, classId: parseInt(feeForm.classId), amount: parseFloat(feeForm.amount), branch: 'Main Campus' });
    setShowFeeForm(false);
    setFeeForm({ classId: '', category: 'Tuition', amount: '', term: 'First Term', session: '2024/2025' });
    refresh();
  }

  function handlePaymentSubmit(e) {
    e.preventDefault();
    const payment = {
      invoiceId: parseInt(paymentForm.invoiceId),
      studentId: selectedInvoice ? selectedInvoice.studentId : 0,
      amount: parseFloat(paymentForm.amount),
      method: paymentForm.method,
      date: paymentForm.date || new Date().toISOString().split('T')[0],
      reference: paymentForm.reference,
      receivedBy: 'Mr. Bursar',
      branch: 'Main Campus'
    };
    addItem('payments', payment);
    if (selectedInvoice) {
      const remaining = selectedInvoice.amount - payment.amount;
      updateItem('invoices', selectedInvoice.id, { status: remaining <= 0 ? 'paid' : 'partial' });
    }
    setShowPaymentForm(false);
    setSelectedInvoice(null);
    setPaymentForm({ invoiceId: '', amount: '', method: 'bank_transfer', date: '', reference: '' });
    refresh();
  }

  function generateReceipt(payment) {
    const invoice = invoices.find(i => i.id === payment.invoiceId);
    const student = students.find(s => s.id === payment.studentId);
    const methodLabel = { bank_transfer: 'Bank Transfer', ussd: 'USSD', mobile_money: 'Mobile Money', cash: 'Cash' }[payment.method] || payment.method;
    
    const html = `<!DOCTYPE html><html><head><title>Receipt</title><style>
      body{font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;}
      h1{text-align:center;color:#1a73e8;}
      .receipt-box{border:1px solid #ddd;padding:20px;margin-top:20px;}
      .row{display:flex;justify-content:space-between;margin:10px 0;padding-bottom:10px;border-bottom:1px solid #eee;}
    </style></head><body>`;
    html += `<h1>Payment Receipt</h1>`;
    html += `<div class="receipt-box">`;
    html += `<div class="row"><span>Receipt No:</span><span>RCP-${payment.id}</span></div>`;
    html += `<div class="row"><span>Date:</span><span>${payment.date}</span></div>`;
    html += `<div class="row"><span>Student:</span><span>${student ? `${student.firstName} ${student.lastName}` : '-'}</span></div>`;
    html += `<div class="row"><span>Amount:</span><span>NGN ${payment.amount.toLocaleString()}</span></div>`;
    html += `<div class="row"><span>Method:</span><span>${methodLabel}</span></div>`;
    html += `<div class="row"><span>Reference:</span><span>${payment.reference || '-'}</span></div>`;
    html += `</div></body></html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${payment.id}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter(i => i.status === 'paid').length;
  const pendingAmount = invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.amount, 0);
  const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="page">
      <Header title="Finance & Fees" subtitle="Manage invoicing, payments, and receipts" />

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon green">C</div>
          <div className="stat-info">
            <div className="stat-value">{(totalCollected / 1000).toFixed(0)}K</div>
            <div className="stat-label">Total Collected</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">P</div>
          <div className="stat-info">
            <div className="stat-value">{(pendingAmount / 1000).toFixed(0)}K</div>
            <div className="stat-label">Pending</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue">I</div>
          <div className="stat-info">
            <div className="stat-value">{totalInvoices}</div>
            <div className="stat-label">Total Invoices</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">R</div>
          <div className="stat-info">
            <div className="stat-value">{paidInvoices}</div>
            <div className="stat-label">Paid</div>
          </div>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab ${activeTab === 'invoices' ? 'active' : ''}`} onClick={() => setActiveTab('invoices')}>Invoices</button>
        <button className={`tab ${activeTab === 'payments' ? 'active' : ''}`} onClick={() => setActiveTab('payments')}>Payments</button>
        <button className={`tab ${activeTab === 'fees' ? 'active' : ''}`} onClick={() => setActiveTab('fees')}>Fee Structures</button>
      </div>

      {activeTab === 'invoices' && (
        <div>
          <div className="page-actions">
            <button className="btn-primary" onClick={() => alert('Invoices are generated automatically based on fee structures.')}>+ Generate Invoices</button>
          </div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Invoice ID</th>
                  <th>Student</th>
                  <th>Amount</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map(inv => {
                  const student = students.find(s => s.id === inv.studentId);
                  return (
                    <tr key={inv.id}>
                      <td>INV-{inv.id}</td>
                      <td>{student ? `${student.firstName} ${student.lastName}` : '-'}</td>
                      <td>NGN {inv.amount.toLocaleString()}</td>
                      <td>{inv.dueDate}</td>
                      <td><span className={`badge ${inv.status === 'paid' ? 'badge-success' : inv.status === 'partial' ? 'badge-warning' : 'badge-danger'}`}>{inv.status}</span></td>
                      <td>
                        {inv.status !== 'paid' && (
                          <button className="btn-sm" onClick={() => { setSelectedInvoice(inv); setShowPaymentForm(true); setPaymentForm({ ...paymentForm, invoiceId: inv.id }); }}>Record Payment</button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Receipt No</th>
                <th>Student</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Date</th>
                <th>Reference</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => {
                const student = students.find(s => s.id === p.studentId);
                return (
                  <tr key={p.id}>
                    <td>RCP-{p.id}</td>
                    <td>{student ? `${student.firstName} ${student.lastName}` : '-'}</td>
                    <td>NGN {p.amount.toLocaleString()}</td>
                    <td>{p.method.replace('_', ' ')}</td>
                    <td>{p.date}</td>
                    <td>{p.reference || '-'}</td>
                    <td><button className="btn-sm" onClick={() => generateReceipt(p)}>Receipt</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'fees' && (
        <div>
          <div className="page-actions">
            <button className="btn-primary" onClick={() => setShowFeeForm(true)}>+ Add Fee Structure</button>
          </div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Class</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Term</th>
                  <th>Session</th>
                </tr>
              </thead>
              <tbody>
                {fees.map(f => {
                  const cls = classes.find(c => c.id === f.classId);
                  return (
                    <tr key={f.id}>
                      <td>{cls ? `${cls.name} ${cls.arm}` : '-'}</td>
                      <td>{f.category}</td>
                      <td>NGN {f.amount.toLocaleString()}</td>
                      <td>{f.term}</td>
                      <td>{f.session}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showFeeForm && (
        <div className="modal-overlay" onClick={() => setShowFeeForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Add Fee Structure</h2>
            <form onSubmit={handleFeeSubmit} className="form-grid">
              <div className="form-group">
                <label>Class</label>
                <select required value={feeForm.classId} onChange={e => setFeeForm({ ...feeForm, classId: e.target.value })}>
                  <option value="">Select Class</option>
                  {classes.map(c => <option key={c.id} value={c.id}>{c.name} {c.arm}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Category</label>
                <select value={feeForm.category} onChange={e => setFeeForm({ ...feeForm, category: e.target.value })}>
                  <option>Tuition</option>
                  <option>Examination</option>
                  <option>Development</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Amount</label>
                <input type="number" required value={feeForm.amount} onChange={e => setFeeForm({ ...feeForm, amount: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Term</label>
                <select value={feeForm.term} onChange={e => setFeeForm({ ...feeForm, term: e.target.value })}>
                  <option>First Term</option>
                  <option>Second Term</option>
                  <option>Third Term</option>
                </select>
              </div>
              <div className="form-group">
                <label>Session</label>
                <input required value={feeForm.session} onChange={e => setFeeForm({ ...feeForm, session: e.target.value })} />
              </div>
              <div className="form-actions full-width">
                <button type="button" className="btn-secondary" onClick={() => setShowFeeForm(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPaymentForm && (
        <div className="modal-overlay" onClick={() => setShowPaymentForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Record Payment</h2>
            <form onSubmit={handlePaymentSubmit} className="form-grid">
              <div className="form-group">
                <label>Invoice</label>
                <input disabled value={selectedInvoice ? `INV-${selectedInvoice.id}` : ''} />
              </div>
              <div className="form-group">
                <label>Amount</label>
                <input type="number" required value={paymentForm.amount} onChange={e => setPaymentForm({ ...paymentForm, amount: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Method</label>
                <select value={paymentForm.method} onChange={e => setPaymentForm({ ...paymentForm, method: e.target.value })}>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="ussd">USSD</option>
                  <option value="mobile_money">Mobile Money</option>
                  <option value="cash">Cash</option>
                </select>
              </div>
              <div className="form-group">
                <label>Date</label>
                <input type="date" required value={paymentForm.date} onChange={e => setPaymentForm({ ...paymentForm, date: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Reference</label>
                <input value={paymentForm.reference} onChange={e => setPaymentForm({ ...paymentForm, reference: e.target.value })} />
              </div>
              <div className="form-actions full-width">
                <button type="button" className="btn-secondary" onClick={() => setShowPaymentForm(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
