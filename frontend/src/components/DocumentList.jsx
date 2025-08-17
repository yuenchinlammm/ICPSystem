import { useEffect, useState } from "react";
import axios from "axios";

function fmtSize(bytes = 0) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DocumentList({ claimId, onChanged }) {
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null); // tracks the doc being acted on

  const authHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const load = async () => {
    if (!claimId) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/claims/${claimId}/documents`, {
        headers: authHeaders(),
      });
      setRows(data);
      setErr("");
    } catch (e) {
      setErr(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [claimId]);

  const remove = async (docId) => {
    if (!window.confirm("Delete this document?")) return;
    try {
      setBusyId(docId);
      await axios.delete(`/api/documents/${docId}`, { headers: authHeaders() });
      await load();
      onChanged?.();
    } catch (e) {
      alert(e.response?.data?.message || e.message);
    } finally {
      setBusyId(null);
    }
  };

  // Open preview in a new tab using a blob URL (sends Authorization header)
  const view = async (doc) => {
    try {
      setBusyId(doc._id);
      const res = await axios.get(`/api/documents/${doc._id}/preview`, {
        headers: authHeaders(),
        responseType: "blob",
      });
      const url = URL.createObjectURL(res.data);
      window.open(url, "_blank", "noreferrer");
      // Revoke later to free memory
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (e) {
      alert(e.response?.data?.message || e.message);
    } finally {
      setBusyId(null);
    }
  };

  // Force a file download (sends Authorization header)
  const download = async (doc) => {
    try {
      setBusyId(doc._id);
      const res = await axios.get(`/api/documents/${doc._id}/download`, {
        headers: authHeaders(),
        responseType: "blob",
      });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.filename || "download";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (e) {
      alert(e.response?.data?.message || e.message);
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <p>Loading…</p>;
  if (err) return <p className="text-danger">Error: {err}</p>;
  if (!rows.length) return <p>No documents uploaded yet.</p>;

  return (
    <ul className="list-group">
      {rows.map((d) => (
        <li
          key={d._id}
          className="list-group-item d-flex justify-content-between align-items-center"
        >
          <div className="me-3">
            <div className="fw-semibold">{d.filename}</div>
            <small className="text-muted">
              {fmtSize(d.size)} • {new Date(d.createdAt).toLocaleString()}
            </small>
          </div>
          <div className="d-flex gap-2">
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => view(d)}
              disabled={busyId === d._id}
              title="Preview in a new tab"
            >
              {busyId === d._id ? "Opening…" : "View"}
            </button>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => download(d)}
              disabled={busyId === d._id}
              title="Download file"
            >
              {busyId === d._id ? "Preparing…" : "Download"}
            </button>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => remove(d._id)}
              disabled={busyId === d._id}
              title="Delete document"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
