import { useEffect, useState } from "react";
import axios from "axios";

export default function DocumentList({ claimId, onChanged }) {
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState('');

  const load = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`/api/claims/${claimId}/documents`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setRows(data);
      setErr('');
    } catch (e) {
      setErr(e.response?.data?.message || e.message);
    }
  };

  useEffect(() => { if (claimId) load(); /* eslint-disable-next-line */ }, [claimId]);

  const remove = async (docId) => {
    if (!window.confirm('Delete this document?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/documents/${docId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      await load();
      onChanged?.();
    } catch (e) {
      alert(e.response?.data?.message || e.message);
    }
  };

  if (err) return <p className="text-danger">Error: {err}</p>;
  if (!rows.length) return <p>No documents uploaded yet.</p>;

  return (
    <ul className="list-group">
      {rows.map(d => (
        <li key={d._id} className="list-group-item d-flex justify-content-between align-items-center">
          <div>
            <div>{d.filename}</div>
            <small className="text-muted">{(d.size/1024).toFixed(1)} KB • {new Date(d.createdAt).toLocaleString()}</small>
          </div>
          <button className="btn btn-sm btn-outline-danger" onClick={() => remove(d._id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
