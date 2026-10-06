import React, { useState, useEffect } from 'react';
import {
  listStudents,
  createSingleBatch,
  validateBulkCsv,
  createBulkBatch,
  downloadBatchTemplate,
} from '../../services/instituteService.js';
import { getPublicCourses } from '../../services/publicService.js';
import { PAYMENT } from '../../config/siteConfig.js';
import BatchPaymentPanel from './BatchPaymentPanel.jsx';

const money = (n) => `${PAYMENT.currencySymbol}${Number(n ?? 0).toLocaleString('en-IN')}`;

/**
 * NewBatchModal — drives both the SINGLE and BULK certificate flows.
 * Steps:
 *   mode  → choose single | bulk
 *   single:  form → preview → payment
 *   bulk:    upload → validate/preview → payment
 * Props: onClose(), onComplete() — called after a batch is created & UTR submitted.
 */
export default function NewBatchModal({ onClose, onComplete }) {
  const [mode, setMode] = useState(null);        // null | 'single' | 'bulk'
  const [batch, setBatch] = useState(null);      // created BatchResponse → shows payment

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-3xl shadow-hero max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-3xl z-10">
          <h3 className="text-lg font-heading font-bold text-primary-900">
            {batch ? 'Payment' : 'New Certificate Application'}
          </h3>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:bg-gray-100" aria-label="Close">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {batch ? (
            <BatchPaymentPanel
              batch={batch}
              onClose={() => { onComplete?.(); }}
              onPaid={() => { /* stay on confirmation; user closes via Done */ }}
            />
          ) : mode === null ? (
            <ModeChooser onPick={setMode} />
          ) : mode === 'single' ? (
            <SingleFlow onBack={() => setMode(null)} onCreated={setBatch} />
          ) : (
            <BulkFlow onBack={() => setMode(null)} onCreated={setBatch} />
          )}
        </div>
      </div>
    </div>
  );
}

// ── Mode chooser ──────────────────────────────────────────────
function ModeChooser({ onPick }) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <button onClick={() => onPick('single')}
        className="card-flat text-left p-5 hover:shadow-card-hover transition-shadow border border-gray-100 rounded-2xl">
        <div className="text-2xl mb-2">🎓</div>
        <div className="font-heading font-bold text-primary-900">Single certificate</div>
        <p className="text-sm text-gray-500 mt-1">Apply for one student at {money(PAYMENT.unitAmount)}.</p>
      </button>
      <button onClick={() => onPick('bulk')}
        className="card-flat text-left p-5 hover:shadow-card-hover transition-shadow border border-gray-100 rounded-2xl">
        <div className="text-2xl mb-2">📑</div>
        <div className="font-heading font-bold text-primary-900">Bulk upload (CSV)</div>
        <p className="text-sm text-gray-500 mt-1">Apply for many students at once via a CSV file.</p>
      </button>
    </div>
  );
}

// ── Single flow ───────────────────────────────────────────────
function SingleFlow({ onBack, onCreated }) {
  const [students, setStudents] = useState([]);
  const [courses, setCourses]   = useState([]);
  const [form, setForm]         = useState({ studentId: '', courseId: '', marks: '', grade: '' });
  const [step, setStep]         = useState('form');   // form | preview
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  useEffect(() => {
    listStudents({ size: 100 }).then(r => setStudents(r.data?.content ?? [])).catch(() => {});
    getPublicCourses().then(r => setCourses(r.data ?? [])).catch(() => {});
  }, []);

  const student = students.find(s => String(s.id) === String(form.studentId));
  const course  = courses.find(c => String(c.id) === String(form.courseId));

  const goPreview = (e) => {
    e.preventDefault();
    if (!form.studentId || !form.courseId) { setError('Select a student and a course.'); return; }
    setError(null);
    setStep('preview');
  };

  const create = async () => {
    setLoading(true); setError(null);
    try {
      const res = await createSingleBatch({
        studentId: parseInt(form.studentId, 10),
        courseId:  parseInt(form.courseId, 10),
        marks:     form.marks || null,
        grade:     form.grade || null,
      });
      onCreated(res.data);
    } catch (err) { setError(err.message); setLoading(false); }
  };

  if (step === 'preview') {
    return (
      <div className="space-y-5">
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-2 text-sm">
          <Row label="Student" value={`${student?.fullName ?? '—'} (${student?.studentId ?? ''})`} />
          <Row label="Course" value={course?.name ?? '—'} />
          {form.marks && <Row label="Marks" value={form.marks} />}
          {form.grade && <Row label="Grade" value={form.grade} />}
          <div className="border-t border-gray-200 pt-2 flex items-center justify-between">
            <span className="font-semibold text-gray-700">Total</span>
            <span className="text-xl font-bold text-primary-900">{money(PAYMENT.unitAmount)}</span>
          </div>
        </div>
        {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}
        <div className="flex gap-3 justify-between">
          <button onClick={() => setStep('form')} className="btn-ghost text-sm">← Edit</button>
          <button onClick={create} disabled={loading} className="btn-primary text-sm disabled:opacity-50">
            {loading ? 'Creating…' : `Create & pay ${money(PAYMENT.unitAmount)}`}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={goPreview} className="space-y-4">
      <div>
        <label className="label label-req">Student</label>
        <select required value={form.studentId}
          onChange={e => setForm(f => ({ ...f, studentId: e.target.value }))} className="input">
          <option value="">Select student…</option>
          {students.map(s => <option key={s.id} value={s.id}>{s.fullName} ({s.studentId})</option>)}
        </select>
      </div>
      <div>
        <label className="label label-req">Course</label>
        <select required value={form.courseId}
          onChange={e => setForm(f => ({ ...f, courseId: e.target.value }))} className="input">
          <option value="">Select course…</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Marks</label>
          <input type="text" value={form.marks} placeholder="e.g. 450/500"
            onChange={e => setForm(f => ({ ...f, marks: e.target.value }))} className="input" />
        </div>
        <div>
          <label className="label">Grade</label>
          <input type="text" value={form.grade} placeholder="e.g. A+"
            onChange={e => setForm(f => ({ ...f, grade: e.target.value }))} className="input" />
        </div>
      </div>
      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}
      <div className="flex gap-3 justify-between pt-1">
        <button type="button" onClick={onBack} className="btn-ghost text-sm">← Back</button>
        <button type="submit" className="btn-primary text-sm">Continue →</button>
      </div>
    </form>
  );
}

// ── Bulk flow ─────────────────────────────────────────────────
function BulkFlow({ onBack, onCreated }) {
  const [file, setFile]           = useState(null);
  const [validation, setValid]    = useState(null);  // CsvValidationResponse
  const [loading, setLoading]     = useState(false);
  const [creating, setCreating]   = useState(false);
  const [error, setError]         = useState(null);

  const handleTemplate = async () => {
    try {
      const blob = await downloadBatchTemplate();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'aicit-bulk-template.csv'; a.click();
      URL.revokeObjectURL(url);
    } catch (err) { setError('Template download failed: ' + err.message); }
  };

  const handleValidate = async () => {
    if (!file) { setError('Choose a CSV file first.'); return; }
    setLoading(true); setError(null); setValid(null);
    try {
      const res = await validateBulkCsv(file);
      setValid(res.data);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleCreate = async () => {
    setCreating(true); setError(null);
    try {
      const res = await createBulkBatch(file);
      onCreated(res.data);
    } catch (err) { setError(err.message); setCreating(false); }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-dashed border-gray-300 p-5 text-center">
        <input id="bulk-csv" type="file" accept=".csv,text/csv"
          onChange={e => { setFile(e.target.files?.[0] ?? null); setValid(null); }}
          className="hidden" />
        <label htmlFor="bulk-csv" className="cursor-pointer">
          <div className="text-2xl mb-2">📄</div>
          <div className="text-sm font-semibold text-primary-800">
            {file ? file.name : 'Click to choose a CSV file'}
          </div>
          <p className="text-xs text-gray-400 mt-1">Columns: studentId, courseCode, marks, grade</p>
        </label>
        <div className="mt-3">
          <button type="button" onClick={handleTemplate} className="text-xs text-primary-600 hover:underline font-semibold">
            ⬇ Download CSV template
          </button>
        </div>
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}

      {!validation ? (
        <div className="flex gap-3 justify-between">
          <button onClick={onBack} className="btn-ghost text-sm">← Back</button>
          <button onClick={handleValidate} disabled={!file || loading} className="btn-primary text-sm disabled:opacity-50">
            {loading ? 'Validating…' : 'Validate CSV'}
          </button>
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <Stat label="Total rows" value={validation.totalRows} />
            <Stat label="Valid" value={validation.validCount} tone="green" />
            <Stat label="Invalid" value={validation.invalidCount} tone={validation.invalidCount ? 'red' : 'gray'} />
          </div>

          {/* Valid rows preview */}
          {validation.validRows?.length > 0 && (
            <div className="rounded-xl border border-gray-100 overflow-hidden">
              <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase">Valid students</div>
              <div className="max-h-48 overflow-y-auto">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-gray-50">
                    {validation.validRows.map(r => (
                      <tr key={r.rowNumber}>
                        <td className="px-4 py-2 text-gray-800">{r.studentName}</td>
                        <td className="px-4 py-2 text-gray-500">{r.courseName}</td>
                        <td className="px-4 py-2 text-gray-400 text-xs">{r.marks || ''} {r.grade ? `· ${r.grade}` : ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Invalid rows */}
          {validation.invalidRows?.length > 0 && (
            <div className="rounded-xl border border-red-100 bg-red-50/40 overflow-hidden">
              <div className="px-4 py-2 bg-red-50 text-xs font-semibold text-red-600 uppercase">Rows with errors (skipped)</div>
              <div className="max-h-40 overflow-y-auto">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-red-50">
                    {validation.invalidRows.map(r => (
                      <tr key={r.rowNumber}>
                        <td className="px-4 py-2 text-gray-600 whitespace-nowrap">Row {r.rowNumber}</td>
                        <td className="px-4 py-2 text-gray-500 text-xs">{r.studentCode} / {r.courseCode}</td>
                        <td className="px-4 py-2 text-red-600 text-xs">{(r.errors || []).join('; ')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Total */}
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {validation.validCount} × {money(validation.unitAmount ?? PAYMENT.unitAmount)}
            </span>
            <span className="text-xl font-bold text-primary-900">{money(validation.totalAmount)}</span>
          </div>

          <div className="flex gap-3 justify-between">
            <button onClick={() => setValid(null)} className="btn-ghost text-sm">← Re-upload</button>
            <button onClick={handleCreate} disabled={creating || validation.validCount === 0}
              className="btn-primary text-sm disabled:opacity-50">
              {creating ? 'Creating…' : `Create batch & pay ${money(validation.totalAmount)}`}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ── Small helpers ─────────────────────────────────────────────
function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-800 text-right">{value}</span>
    </div>
  );
}

function Stat({ label, value, tone = 'blue' }) {
  const tones = {
    blue:  'text-primary-900',
    green: 'text-trust-700',
    red:   'text-red-600',
    gray:  'text-gray-500',
  };
  return (
    <div className="rounded-xl border border-gray-100 py-3">
      <div className={`text-2xl font-bold ${tones[tone]}`}>{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
}
