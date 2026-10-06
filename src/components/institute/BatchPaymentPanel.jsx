import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { PAYMENT } from '../../config/siteConfig.js';
import { submitBatchUtr } from '../../services/instituteService.js';

/**
 * Build a UPI deep-link / QR payload.
 * Spec: upi://pay?pa=<vpa>&pn=<name>&am=<amount>&cu=INR&tn=<note>&tr=<ref>
 */
function buildUpiUri({ amount, ref }) {
  const params = new URLSearchParams({
    pa: PAYMENT.upiVpa,
    pn: PAYMENT.payeeName,
    am: String(amount),
    cu: PAYMENT.currency,
    tn: `${PAYMENT.note}${ref ? ` ${ref}` : ''}`,
  });
  if (ref) params.set('tr', String(ref));
  return `upi://pay?${params.toString()}`;
}

const money = (n) => `${PAYMENT.currencySymbol}${Number(n ?? 0).toLocaleString('en-IN')}`;

/**
 * BatchPaymentPanel
 * Props:
 *  - batch:   BatchResponse (needs id, batchCode, certificateCount, totalAmount, unitAmount, paymentStatus)
 *  - onPaid:  callback(batch) after UTR submitted successfully
 *  - onClose: optional close/back handler
 */
export default function BatchPaymentPanel({ batch, onPaid, onClose }) {
  const [qrDataUrl, setQrDataUrl]     = useState('');
  const [staticQrOk, setStaticQrOk]   = useState(!!PAYMENT.staticQrImage); // try static image first
  const [utr, setUtr]                 = useState('');
  const [submitting, setSubmitting]   = useState(false);
  const [error, setError]             = useState(null);
  const [done, setDone]               = useState(false);
  const [copied, setCopied]           = useState(false);

  const total     = batch.totalAmount ?? (batch.certificateCount * (batch.unitAmount ?? PAYMENT.unitAmount));
  const unit      = batch.unitAmount ?? PAYMENT.unitAmount;
  const upiUri    = buildUpiUri({ amount: total, ref: batch.batchCode });

  // Only generate a dynamic QR when there is no usable static image.
  const useStatic = !!PAYMENT.staticQrImage && staticQrOk;
  useEffect(() => {
    if (useStatic) { setQrDataUrl(''); return; }
    QRCode.toDataURL(upiUri, { width: 240, margin: 1 })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(''));
  }, [upiUri, useStatic]);

  const copyVpa = async () => {
    try {
      await navigator.clipboard.writeText(PAYMENT.upiVpa);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* clipboard unavailable — ignore */ }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = utr.trim();
    if (trimmed.length < 6) { setError('Enter a valid UTR / reference number (min 6 characters).'); return; }
    setSubmitting(true); setError(null);
    try {
      const res = await submitBatchUtr(batch.id, trimmed);
      setDone(true);
      onPaid?.(res?.data ?? batch);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="text-center py-8">
        <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-2xl mx-auto mb-4">⏳</div>
        <h3 className="text-lg font-heading font-bold text-primary-900 mb-1">Payment reference submitted</h3>
        <span className="inline-block mb-3 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
          Awaiting verification
        </span>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">
          Your UTR has been recorded for batch <span className="font-mono font-semibold">{batch.batchCode}</span>.
          Payment is <strong>not confirmed yet</strong> — an AICIT admin will verify it, then your
          certificates will be generated. You can track the status under Batches.
        </p>
        {onClose && (
          <button onClick={onClose} className="btn-primary text-sm mt-5">Done</button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Order summary */}
      <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Batch</span>
          <span className="font-mono font-semibold text-gray-800">{batch.batchCode}</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1.5">
          <span className="text-gray-500">Certificates</span>
          <span className="font-medium text-gray-800">{batch.certificateCount}</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1.5">
          <span className="text-gray-500">Price per certificate</span>
          <span className="font-medium text-gray-800">{money(unit)}</span>
        </div>
        <div className="border-t border-gray-200 mt-3 pt-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700">Total payable</span>
          <span className="text-xl font-bold text-primary-900">{money(total)}</span>
        </div>
      </div>

      {/* UPI payment */}
      <div className="rounded-xl border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-gray-700">Pay via UPI</p>
          <span className="text-xs font-semibold text-primary-700">Scan &amp; pay with any app</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
          {/* QR */}
          <div className="flex-shrink-0 text-center">
            {useStatic ? (
              <img
                src={PAYMENT.staticQrImage}
                alt={`UPI QR for ${PAYMENT.payeeName}`}
                className="w-44 h-44 rounded-lg border border-gray-200 object-contain bg-white"
                onError={() => setStaticQrOk(false)}  /* fall back to generated QR if image missing */
              />
            ) : qrDataUrl ? (
              <img src={qrDataUrl} alt="UPI QR code" className="w-44 h-44 rounded-lg border border-gray-200" />
            ) : (
              <div className="w-44 h-44 rounded-lg border border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400">
                Generating QR…
              </div>
            )}
            <p className="text-[11px] text-gray-400 mt-1">PhonePe · GPay · Paytm · BHIM · any UPI app</p>
          </div>

          {/* Details */}
          <div className="flex-1 w-full space-y-2.5 text-sm">
            {/* Amount — most prominent */}
            <div className="rounded-lg bg-primary-50 border border-primary-100 px-3 py-2.5 flex items-center justify-between">
              <span className="text-xs font-semibold text-primary-700 uppercase tracking-wide">Amount to pay</span>
              <span className="text-lg font-bold text-primary-900">{money(total)}</span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="text-gray-500">UPI ID</span>
              <span className="flex items-center gap-2">
                <span className="font-mono font-semibold text-gray-800">{PAYMENT.upiVpa}</span>
                <button type="button" onClick={copyVpa}
                  className="text-[11px] font-semibold text-primary-600 hover:underline">
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-gray-500">Payee</span>
              <span className="font-medium text-gray-800 text-right">{PAYMENT.payeeName}</span>
            </div>

            {/* Manual amount notice for static QR */}
            {useStatic && (
              <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-[11px] text-amber-800 leading-relaxed">
                This is a static QR. After scanning, <strong>enter the exact amount {money(total)}</strong>{' '}
                manually in your UPI app before paying.
              </div>
            )}

            {/* Mobile: open UPI app directly (dynamic deep-link carries the amount) */}
            {!useStatic && (
              <a href={upiUri}
                className="btn-primary text-sm w-full justify-center mt-1 inline-flex sm:hidden">
                Open UPI app
              </a>
            )}

            <p className="text-[11px] text-gray-400 leading-relaxed pt-1">
              After paying, enter the UTR / transaction reference below. Add batch
              code <span className="font-mono">{batch.batchCode}</span> to the payment note if your app allows it.
            </p>
          </div>
        </div>
      </div>

      {/* UTR submission */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="label label-req">UTR / Transaction reference</label>
          <input
            type="text"
            value={utr}
            onChange={(e) => setUtr(e.target.value)}
            placeholder="e.g. 412345678901"
            maxLength={50}
            className="input"
          />
          <p className="text-[11px] text-gray-400 mt-1">
            Found in your UPI app transaction details (6–50 characters).
          </p>
        </div>
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
        )}
        <div className="flex gap-3 justify-end pt-1">
          {onClose && (
            <button type="button" onClick={onClose} className="btn-ghost text-sm">Later</button>
          )}
          <button type="submit" disabled={submitting} className="btn-primary text-sm disabled:opacity-50">
            {submitting ? 'Submitting…' : 'Submit Payment'}
          </button>
        </div>
      </form>
    </div>
  );
}
