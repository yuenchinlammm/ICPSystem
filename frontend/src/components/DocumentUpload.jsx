import { useState } from "react";
import axios from "axios";

const ALLOWED = ['application/pdf','image/jpeg','image/png'];
const MAX = 10 * 1024 * 1024;

export default function DocumentUpload({ claimId, onUploaded }) {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED.includes(file.type)) return setError('PDF/JPEG/PNG only');
    if (file.size > MAX) return setError('Max 10MB');
    setError('');

    const fd = new FormData();
    fd.append('file', file);

    try {
      setBusy(true);
      const token = localStorage.getItem('token');
      await axios.post(`/api/claims/${claimId}/documents`, fd, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      onUploaded?.();
      e.target.value = ''; // reset input
    } catch (err) {
      setError(err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <input type="file" accept=".pdf,image/jpeg,image/png" onChange={onFile} disabled={busy} />
      {error && <div className="text-danger small mt-1">{error}</div>}
    </div>
  );
}
