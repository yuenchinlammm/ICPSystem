import { useEffect, useState } from "react";
import { getClaimById, submitClaim, updateClaim, deleteClaim } from "../../api/claims";
import ClaimForm from "./ClaimForm";
import DocumentUpload from "./DocumentUpload";
import DocumentList from "./DocumentList";

export default function ClaimDetail({ claimId, onBack }) {
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [submitting, setSubmitting] = useState(false); // used for submit & save
  const [editing, setEditing] = useState(false);
  const [docsKey, setDocsKey] = useState(0); // bump to force DocumentList to reload after upload

  // Load claim on mount / when claimId changes
  useEffect(() => {
    let ignore = false;
    setErr("");
    setEditing(false);
    setSubmitting(false);
    setLoading(true);

    (async () => {
      try {
        if (!claimId) return;
        const { data } = await getClaimById(claimId);
        if (!ignore) setClaim(data);
      } catch (e) {
        if (!ignore) setErr(e?.response?.data?.message || e.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [claimId]);

  if (!claimId) return null;
  if (loading) return <p>Loading…</p>;
  if (err) return (
    <div>
      <button className="btn btn-link p-0 mb-3" onClick={onBack}>← Back</button>
      <p className="text-danger">Error: {err}</p>
    </div>
  );
  if (!claim) return null;

  const startEdit = () => setEditing(true);
  const cancelEdit = () => setEditing(false);

  const saveEdit = async (form) => {
    try {
      setSubmitting(true);
      const { data } = await updateClaim(claim._id, form);
      setClaim(data);
      setEditing(false);
    } catch (e) {
      alert(e?.response?.data?.errors?.[0]?.msg || e?.response?.data?.message || e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const removeClaim = async () => {
    if (!window.confirm("Delete this draft claim?")) return;
    try {
      await deleteClaim(claim._id);
      onBack?.();
    } catch (e) {
      alert(e?.response?.data?.message || e.message);
    }
  };

  const doSubmit = async () => {
    try {
      setSubmitting(true);
      const { data } = await submitClaim(claim._id);
      setClaim(data); // status should become "Pending"
    } catch (e) {
      const msg = e?.response?.data?.message || e.message;
      alert(`Submit failed: ${msg}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <button className="btn btn-link p-0 mb-3" onClick={onBack}>← Back</button>

      {!editing ? (
        <>
          <h3>Claim {claim.policyNumber}</h3>
          <p><b>Type:</b> {claim.claimType}</p>
          <p><b>Incident Date:</b> {claim.incidentDate?.slice(0, 10)}</p>
          <p><b>Status:</b> {claim.status}</p>
          <p><b>Description:</b> {claim.description}</p>

          {/* Documents section */}
          <h5 className="mt-4">Documents</h5>
          <DocumentUpload
            claimId={claim._id}
            onUploaded={() => setDocsKey((k) => k + 1)} // force list to reload after upload
          />
          <div className="mt-2">
            <DocumentList key={docsKey} claimId={claim._id} />
          </div>

          {/* Draft-only action buttons */}
          {claim.status === "Draft" && (
            <div className="d-flex gap-2 mt-3">
              <button className="btn btn-outline-primary" onClick={startEdit}>
                Edit
              </button>
              <button className="btn btn-outline-danger" onClick={removeClaim}>
                Delete
              </button>
              <button className="btn btn-success" disabled={submitting} onClick={doSubmit}>
                {submitting ? "Submitting…" : "Submit for review"}
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          <h3>Edit Draft Claim</h3>
          <div className="card p-3">
            <ClaimForm initial={claim} onSubmit={saveEdit} submitting={submitting} />
            <button className="btn btn-link mt-2" onClick={cancelEdit}>
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
}
