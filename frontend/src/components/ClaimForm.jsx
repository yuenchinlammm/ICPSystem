import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createClaim, getClaim, updateClaim } from '../api/claims';

const TYPES = ['Motor','Home','Health','Other'];

export default function ClaimForm({ mode }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState({
    policyNumber: '', incidentDate: '', claimType: 'Motor', description: '', status: 'Draft'
  });
  const [loading, setLoading] = useState(mode === 'edit');

  useEffect(() => {
    if (mode === 'edit' && id) {
      (async () => {
        try {
          const data = await getClaim(id);
          setForm({
            policyNumber: data.policyNumber,
            incidentDate: data.incidentDate?.slice(0,10),
            claimType: data.claimType,
            description: data.description,
            status: data.status
          });
        } finally { setLoading(false); }
      })();
    }
  }, [mode, id]);

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (mode === 'create') {
      const created = await createClaim(form);
      navigate(`/claims/${created._id}`);
    } else {
      await updateClaim(id, form);
      navigate(`/claims/${id}`);
    }
  };

  if (loading) return <div style={{padding:24}}>Loading…</div>;

  return (
    <div style={{padding:24, maxWidth:640}}>
      <h2>{mode === 'create' ? 'New Claim' : 'Edit Claim'}</h2>
      <form onSubmit={onSubmit}>
        <label>Policy Number
          <input name="policyNumber" value={form.policyNumber} onChange={onChange} required />
        </label><br/>
        <label>Incident Date
          <input type="date" name="incidentDate" value={form.incidentDate} onChange={onChange} required />
        </label><br/>
        <label>Claim Type
          <select name="claimType" value={form.claimType} onChange={onChange}>
            {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </label><br/>
        <label>Description
          <textarea name="description" value={form.description} onChange={onChange} required rows={4}/>
        </label><br/>
        {/* Status field optional during edit */}
        {mode === 'edit' && (
          <label>Status
            <select name="status" value={form.status} onChange={onChange}>
              {['Draft','Pending','Under Review','Approved','Rejected'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
        )}
        <div style={{marginTop:12}}>
          <button type="submit">{mode === 'create' ? 'Create' : 'Save'}</button>
          <button type="button" onClick={() => navigate(-1)} style={{marginLeft:8}}>Cancel</button>
        </div>
      </form>
    </div>
  );
}