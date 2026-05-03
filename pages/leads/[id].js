import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { format } from 'date-fns';

const STATUS_COLORS = { New: 'primary', Contacted: 'info', Interested: 'warning', Converted: 'success', Lost: 'danger' };

export default function LeadDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [followUp, setFollowUp] = useState({ date: '', note: '', doneBy: '' });
  const [addingFollowUp, setAddingFollowUp] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/leads/${id}`).then(r => r.json())
      .then(data => {
        if (data.success) {
          setLead(data.data);
          setForm({ ...data.data, travelDate: data.data.travelDate ? data.data.travelDate.substring(0,10) : '' });
        } else setError(data.error);
      }).catch(() => setError('Failed to load')).finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    const body = { ...form };
    if (body.budget) body.budget = Number(body.budget);
    if (body.numberOfPax) body.numberOfPax = Number(body.numberOfPax);
    if (!body.travelDate) delete body.travelDate;
    try {
      const res = await fetch(`/api/leads/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json();
      if (data.success) { setLead(data.data); setEditing(false); }
      else setError(data.error);
    } catch { setError('Failed to save'); } finally { setSaving(false); }
  };

  const handleAddFollowUp = async () => {
    if (!followUp.note) return;
    setAddingFollowUp(true);
    try {
      const res = await fetch(`/api/leads/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(followUp) });
      const data = await res.json();
      if (data.success) { setLead(data.data); setFollowUp({ date: '', note: '', doneBy: '' }); }
      else setError(data.error);
    } catch { setError('Failed to add follow-up'); } finally { setAddingFollowUp(false); }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this lead?')) return;
    await fetch(`/api/leads/${id}`, { method: 'DELETE' });
    router.push('/leads');
  };

  if (loading) return <Layout title="Lead"><div className="text-center py-5"><div className="spinner-border text-primary" role="status" /></div></Layout>;
  if (!lead) return <Layout title="Error"><div className="alert alert-danger">{error}</div></Layout>;

  return (
    <Layout title={`Lead - ${lead.clientName}`}>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div className="d-flex align-items-center gap-2">
          <button onClick={() => router.push('/leads')} className="btn btn-outline-secondary btn-sm">← Back</button>
          <div>
            <h2 className="mb-0 fw-bold">{lead.clientName}</h2>
            <span className={`badge bg-${STATUS_COLORS[lead.status]}`}>{lead.status}</span>
          </div>
        </div>
        <div className="d-flex gap-2">
          {!editing ? (
            <>
              <button onClick={() => setEditing(true)} className="btn btn-outline-primary btn-sm">✏️ Edit</button>
              <button onClick={handleDelete} className="btn btn-outline-danger btn-sm">🗑️ Delete</button>
            </>
          ) : (
            <>
              <button onClick={handleSave} className="btn btn-primary btn-sm" disabled={saving}>{saving ? <span className="spinner-border spinner-border-sm" /> : <><i className="bi bi-floppy me-1"></i>Save</>}</button>
              <button onClick={() => setEditing(false)} className="btn btn-outline-secondary btn-sm">Cancel</button>
            </>
          )}
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-white"><h6 className="mb-0 fw-bold">Lead Details</h6></div>
            <div className="card-body">
              {editing ? (
                <div className="row g-3">
                  {[['clientName','Client Name','text',true],['contact','Contact','text'],['email','Email','email'],['destination','Destination','text'],['interestedPackage','Package','text'],['budget','Budget (₹)','number'],['numberOfPax','Number of Pax','number'],['assignedTo','Assigned To','text']].map(([name,label,type,req]) => (
                    <div className="col-md-6" key={name}>
                      <label className="form-label">{label}</label>
                      <input type={type} className="form-control" name={name} value={form[name]||''} onChange={handleChange} required={!!req} />
                    </div>
                  ))}
                  <div className="col-md-4">
                    <label className="form-label">Travel Date</label>
                    <input type="date" className="form-control" name="travelDate" value={form.travelDate||''} onChange={handleChange} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Source</label>
                    <select className="form-select" name="source" value={form.source||''} onChange={handleChange}>
                      {['Website','WhatsApp','Referral','Social Media','Walk-in','Other'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Status</label>
                    <select className="form-select" name="status" value={form.status||''} onChange={handleChange}>
                      {['New','Contacted','Interested','Converted','Lost'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label">Notes</label>
                    <textarea className="form-control" name="notes" value={form.notes||''} onChange={handleChange} rows="3" />
                  </div>
                </div>
              ) : (
                <div className="row g-3">
                  {[
                    ['Contact', lead.contact],
                    ['Email', lead.email],
                    ['Source', lead.source],
                    ['Destination', lead.destination],
                    ['Interested Package', lead.interestedPackage],
                    ['Budget', lead.budget ? `₹${lead.budget.toLocaleString('en-IN')}` : null],
                    ['Number of Pax', lead.numberOfPax],
                    ['Travel Date', lead.travelDate ? format(new Date(lead.travelDate), 'dd MMM yyyy') : null],
                    ['Assigned To', lead.assignedTo],
                  ].filter(([,v]) => v).map(([label, value]) => (
                    <div className="col-md-6" key={label}>
                      <small className="text-muted d-block">{label}</small>
                      <span className="fw-semibold">{value}</span>
                    </div>
                  ))}
                  {lead.notes && (
                    <div className="col-12">
                      <small className="text-muted d-block">Notes</small>
                      <p className="mb-0">{lead.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          {/* Follow-ups */}
          <div className="card shadow-sm">
            <div className="card-header bg-warning text-dark">
              <h6 className="mb-0 fw-bold">📝 Follow-ups ({lead.followUps?.length || 0})</h6>
            </div>
            <div className="card-body">
              <div className="row g-2 mb-3">
                <div className="col-12">
                  <label className="form-label small">Note *</label>
                  <textarea className="form-control form-control-sm" rows="2" value={followUp.note} onChange={e => setFollowUp(p => ({ ...p, note: e.target.value }))} placeholder="Follow-up note..." />
                </div>
                <div className="col-6">
                  <label className="form-label small">Date</label>
                  <input type="date" className="form-control form-control-sm" value={followUp.date} onChange={e => setFollowUp(p => ({ ...p, date: e.target.value }))} />
                </div>
                <div className="col-6">
                  <label className="form-label small">Done By</label>
                  <input type="text" className="form-control form-control-sm" value={followUp.doneBy} onChange={e => setFollowUp(p => ({ ...p, doneBy: e.target.value }))} placeholder="Name" />
                </div>
                <div className="col-12">
                  <button className="btn btn-sm btn-warning text-dark w-100" onClick={handleAddFollowUp} disabled={addingFollowUp || !followUp.note}>
                    {addingFollowUp ? <span className="spinner-border spinner-border-sm" /> : '+ Add Follow-up'}
                  </button>
                </div>
              </div>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {lead.followUps?.length === 0 ? (
                  <p className="text-muted small text-center mb-0">No follow-ups yet</p>
                ) : (
                  lead.followUps.slice().reverse().map((fu, i) => (
                    <div key={i} className="border rounded p-2 mb-2 bg-light">
                      <p className="mb-1 small">{fu.note}</p>
                      <div className="d-flex justify-content-between">
                        <small className="text-muted">{fu.date ? format(new Date(fu.date), 'dd MMM yyyy') : ''}</small>
                        <small className="text-muted">{fu.doneBy}</small>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
