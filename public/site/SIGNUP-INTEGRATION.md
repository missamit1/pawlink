# PawLink waitlist preview

The signup section is #join-pawlink in index.html, styled by signup.css and controlled by signup.js.

User chose a PawLink waitlist with receiving-system integration later. The form currently performs validation and displays a personalized invitation preview only. It performs no fetch, storage, email delivery, or registration. All entered values stay in the current page and are cleared on reset/reload.

Before enabling real registration, configure a server-side destination, validate inputs and consent on the server, add duplicate handling and rate limiting, and show registered status only after a successful response. Do not embed provider secrets in browser code. Update both preview notices and the submit/success copy when the destination is live.
