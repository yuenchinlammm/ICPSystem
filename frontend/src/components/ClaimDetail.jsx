import { useEffect, useState } from "react";
import axios from "axios";

export default function ClaimDetail({ claimId, onBack }) {
  const [claim, setClaim] = useState(null);
  const [err, setErr] = useState("");

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
    </div>
  );
}
