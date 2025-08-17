import { useEffect, useState } from "react";
import axios from "axios";
import { submitClaim } from "../../api/claim";
import DocumentUpload from "./DocumentUpload";
import DocumentList from "./DocumentList";

export default function ClaimDetail({ claimId, onBack }) {
  const [claim, setClaim] = useState(null);
  const [err, setErr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!claimId) return;
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(`/api/claims/${claimId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setClaim(data);
      } catch (e) {
        setErr(e.response?.data?.message || e.message);
      }
    })();
  }, [claimId]);

  if (!claimId) return null;
  if (err) return <p className="text-danger">Error: {err}</p>;
  if (!claim) return <p>Loading…</p>;

  return (
    <div>
      <button className="btn btn-link p-0 mb-3" onClick={onBack}>← Back</button>
      <h3>Claim {claim.policyNumber}</h3>
      <p><b>Type:</b> {claim.claimType}</p>
      <p><b>Incident Date:</b> {claim.incidentDate?.slice(0,10)}</p>
      <p><b>Status:</b> {claim.status}</p>
      <p><b>Description:</b> {claim.description}</p>
      <h5 className="mt-4">Documents</h5>
      <DocumentUpload claimId={claim._id} onUploaded={() => {/* optional refresh below */}} />
      <div className="mt-2">
        <DocumentList claimId={claim._id} onChanged={() => {/* optional refresh */}} />
      </div>
       {claim.status === 'Draft' && (
        <button
          className="btn btn-success"
          disabled={submitting}
          onClick={async () => {
            try {
              setSubmitting(true);
              const { data } = await submitClaim(claim._id);
              setClaim(data); // updates status to Pending after success
            } catch (e) {
              const msg = e.response?.data?.message || e.message;
              alert(`Submit failed: ${msg}`);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {submitting ? 'Submitting…' : 'Submit for review'}
        </button>
      )}
    </div>
  );
}
