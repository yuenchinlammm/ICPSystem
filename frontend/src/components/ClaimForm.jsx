import { useState } from "react";

const POLICY_RE = /^[A-Za-z0-9-]{6,20}$/;
const CLAIM_TYPES = ["Motor", "Home", "Health", "Other"];

export default function ClaimForm({ initial = {}, onSubmit, submitting = false }) {
  const [form, setForm] = useState({
    policyNumber: initial.policyNumber || "",
    incidentDate: initial.incidentDate || "",
    claimType: initial.claimType || "",
    description: initial.description || "",
  });
  const [errors, setErrors] = useState({});

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!POLICY_RE.test(form.policyNumber)) e.policyNumber = "6–20 letters/digits/-";
    if (!form.incidentDate || new Date(form.incidentDate) > new Date())
      e.incidentDate = "No future dates";
    if (!CLAIM_TYPES.includes(form.claimType)) e.claimType = "Select a valid type";
    const len = (form.description || "").trim().length;
    if (len < 10 || len > 1000) e.description = "10–1000 chars";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    onSubmit?.(form);
  };

  return (
    <form onSubmit={submit}>
      <div className="mb-3">
        <label className="form-label">Policy Number</label>
        <input className="form-control" value={form.policyNumber} onChange={set("policyNumber")} />
        {errors.policyNumber && <small className="text-danger">{errors.policyNumber}</small>}
      </div>

      <div className="mb-3">
        <label className="form-label">Incident Date</label>
        <input type="date" className="form-control" value={form.incidentDate} onChange={set("incidentDate")} />
        {errors.incidentDate && <small className="text-danger">{errors.incidentDate}</small>}
      </div>

      <div className="mb-3">
        <label className="form-label">Claim Type</label>
        <select className="form-select" value={form.claimType} onChange={set("claimType")}>
          <option value="">Select…</option>
          {["Motor","Home","Health","Other"].map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        {errors.claimType && <small className="text-danger">{errors.claimType}</small>}
      </div>

      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea rows={5} className="form-control" value={form.description} onChange={set("description")} />
        {errors.description && <small className="text-danger">{errors.description}</small>}
      </div>

      <button className="btn btn-primary" type="submit" disabled={submitting}>
        {submitting ? "Creating…" : "Create Claim"}
      </button>
    </form>
  );
}
