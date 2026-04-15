import Link from 'next/link';
import { format } from 'date-fns';

const statusColors = {
  Draft: 'secondary',
  Sent: 'info',
  Accepted: 'success',
  Rejected: 'danger',
};

export default function QuotationCard({ quotation, onDelete }) {
  const advance = quotation.finalPrice ? Math.round(quotation.finalPrice * 0.4) : 0;

  return (
    <div className="card shadow-sm h-100">
      <div className="card-header d-flex justify-content-between align-items-center bg-white">
        <span className="fw-bold text-primary">{quotation.quotationNumber || 'Draft'}</span>
        <span className={`badge bg-${statusColors[quotation.status] || 'secondary'}`}>
          {quotation.status}
        </span>
      </div>
      <div className="card-body">
        <h6 className="card-title mb-1">{quotation.clientName}</h6>
        <p className="text-muted small mb-2">
          📍 {quotation.destination || 'N/A'} &bull; {quotation.tripDuration || 'N/A'}
        </p>
        <p className="text-muted small mb-2">
          👥 {quotation.numberOfPax} Pax &bull; 🚗 {quotation.vehicleType || 'N/A'}
        </p>
        {quotation.finalPrice ? (
          <p className="fw-semibold text-success mb-1">
            ₹{quotation.finalPrice.toLocaleString('en-IN')}
            <small className="text-muted fw-normal"> (Advance: ₹{advance.toLocaleString('en-IN')})</small>
          </p>
        ) : null}
        <p className="text-muted small mb-0">
          {quotation.createdAt
            ? format(new Date(quotation.createdAt), 'dd MMM yyyy')
            : ''}
        </p>
      </div>
      <div className="card-footer bg-white border-top-0 d-flex gap-2">
        <Link href={`/quotations/${quotation._id}`} className="btn btn-sm btn-outline-primary flex-fill">
          View
        </Link>
        {onDelete && (
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => onDelete(quotation._id)}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
