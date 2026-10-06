# AICIT UPI payment QR

Place the bank-issued static UPI QR image here as:

    public/payment/aicitQR.jpeg

This exact image is shown on the certificate payment screen (single + bulk).
The file path is configured by `VITE_UPI_QR_IMAGE` (see `.env.production`) and
`PAYMENT.staticQrImage` in `src/config/siteConfig.js`.

Notes:
- A bank static QR does NOT embed the amount, so the payer enters the amount
  (₹250 × certificates) manually in their UPI app. The screen tells them to.
- The displayed UPI ID comes from `VITE_UPI_VPA` and must match the account
  behind this QR. Keep them in sync.
- If this image is absent, the screen falls back to a QR generated dynamically
  from `VITE_UPI_VPA` + amount, so payment still works.
