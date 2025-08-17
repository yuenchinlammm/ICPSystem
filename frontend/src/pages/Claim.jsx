// src/pages/Claim.jsx
import { useState } from "react";
import axios from "axios";
import ClaimList from "../components/ClaimList";
import ClaimForm from "../components/ClaimForm";
import ClaimDetail from "../components/ClaimDetail";

export default function Claim() {
  const [mode, setMode] = useState("list");  // "list" | "new" | "detail"
  const [selectedId, setSelectedId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const openNew = () => { setMode("new"); setSelectedId(null); };
  const openList = () => { setMode("list"); setSelectedId(null); };
  const openDetail = (id) => { setSelectedId(id); setMode("detail"); };

  const createClaim = async (form) => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      const { data } = await axios.post("/api/claims", form, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      // After create, go to detail
      setSelectedId(data._id);
      setMode("detail");
    } catch (e) {
      const msg = e.response?.data?.errors?.[0]?.msg || e.response?.data?.message || e.message;
      alert(`Create failed: ${msg}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-3">
      <h1 className="mb-3">Insurance Claims</h1>

      {mode === "list" && (
        <ClaimList onSelect={openDetail} onCreateNew={openNew} />
      )}

      {mode === "new" && (
        <>
          <button className="btn btn-link p-0 mb-3" onClick={openList}>← Back</button>
          <div className="card p-3">
            <h3 className="mb-3">Create Claim</h3>
            <ClaimForm onSubmit={createClaim} submitting={submitting} />
          </div>
        </>
      )}

      {mode === "detail" && (
        <ClaimDetail claimId={selectedId} onBack={openList} />
      )}
    </div>
  );
}
