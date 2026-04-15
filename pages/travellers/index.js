import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { format } from 'date-fns';

export default function TravellersList() {
  const [travellers, setTravellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/travellers')
      .then((r) => r.json())
      .then((data) => { if (data.success) setTravellers(data.data); else setError(data.error); })
      .catch(() => setError('Failed to load travellers'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this traveller?')) return;
    const res = await fetch(`/api/travellers/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) setTravellers((prev) => prev.filter((t) => t._id !== id));
  };

  const filtered = travellers.filter((t) =>
    !search || t.name?.toLowerCase().includes(search.toLowerCase()) ||
    t.contact?.includes(search) || t.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout title="Travellers">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 fw-bold">👥 Travellers</h2>
        <Link href="/travellers/new" className="btn btn-success">+ Add Traveller</Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mb-3">
        <input type="text" className="form-control" placeholder="Search by name, contact or email..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" role="status" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted">No travellers found.</p>
          <Link href="/travellers/new" className="btn btn-success">Add First Traveller</Link>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-primary">
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Email</th>
                <th>DOB</th>
                <th>Pax</th>
                <th>ID Proof</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t._id}>
                  <td className="fw-semibold">{t.name}</td>
                  <td>{t.contact || '-'}</td>
                  <td>{t.email || '-'}</td>
                  <td>{t.dateOfBirth ? format(new Date(t.dateOfBirth), 'dd MMM yyyy') : '-'}</td>
                  <td>{t.numberOfPax}</td>
                  <td>{t.idProofType ? `${t.idProofType}` : '-'}</td>
                  <td>
                    <Link href={`/travellers/${t._id}`} className="btn btn-sm btn-outline-primary me-1">View</Link>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(t._id)}>Del</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}
