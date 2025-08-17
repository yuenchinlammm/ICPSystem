import { useEffect, useState } from "react";
import axios from "axios";

export default function ClaimList({ onSelect, onCreateNew }) {
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("/api/claims", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setRows(data);
      } catch (e) {
        setErr(e.response?.data?.message || e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p>Loading…</p>;
  if (err) return <p className="text-danger">Error: {err}</p>;

  if (!rows.length) {
    return (
      <div>
        <p>No claims yet.</p>
        <button className="btn btn-outline-primary" onClick={onCreateNew}>Create claim</button>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table align-middle">
        <thead>
          <tr>
            <th>Policy #</th>
            <th>Type</th>
            <th>Incident</th>
            <th>Status</th>
            <th>Updated</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r._id} style={{ cursor: "pointer" }} onClick={() => onSelect?.(r._id)}>
              <td>{r.policyNumber}</td>
              <td>{r.claimType}</td>
              <td>{r.incidentDate?.slice(0, 10)}</td>
              <td>{r.status}</td>
              <td>{new Date(r.updatedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn btn-outline-primary" onClick={onCreateNew}>Create claim</button>
    </div>
  );
}
