# Mithila Heritage

A modern, animated hotel website and reservation application. **React + Vite**, **Anime.js**, **Node/Express**, **Neon PostgreSQL**, and **Firebase Authentication**. Original Mithila-inspired vector artwork sits alongside real hotel photography. Razorpay and Resend integrations are ready to configure.

## Start locally

```sh
npm install --ignore-scripts --no-bin-links
npm run dev
```

Open **http://localhost:5173**, with the hotel dashboard at **/admin**. The API uses port 3001. `npm run build` creates the production frontend; `npm start` serves that build and the API at port 3001. Set `APP_URL` to the frontend's actual origin.

On Android/Termux, the Vite launcher mirrors frontend source and dependencies into an executable temporary directory; edits are synchronized automatically. No server `.env` is copied to the frontend. Other platforms use the ordinary project directory. The first Android start after changing dependencies takes longer while build tools are prepared.

## Database

`DATABASE_URL` belongs in the gitignored root `.env`. The supplied Neon database is connected, and the schema is provisioned with:

```sh
npm run db:migrate
npm run setup:check
```

Migrations create tables without dropping existing data. Importing the real hotel catalog does not create fictional rooms, tables, bookings, or reviews. PostgreSQL transactions and a transaction-scoped advisory lock protect inventory. `sslmode=require` is normalized to certificate-verified TLS by the application.

Hotel image uploads now use the `media_assets` table and a public immutable image endpoint. Owner access is required to upload JPEG, PNG, or WebP, up to 4 MB each. This works with Neon immediately and does not need Supabase or a Firebase service-account credential. All other database tables are private to the server. Firebase Storage is not used by this version.

## Firebase sign-in and owner access

The supplied public Firebase web configuration lives in `shared/firebase-config.js`. The existing Firebase project recognizes `localhost` as an authorized domain. Google is already enabled in the supplied Firebase project, and localhost is authorized (checked without creating an account). Enable **Authentication → Sign-in method → Email/Password** if needed for password accounts. Before production Google sign-in, add **mithilaheritage.in** and **www.mithilaheritage.in** under **Authentication → Settings → Authorized domains**; neither domain was present when checked. Google sign-up/sign-in is available on both guest and hotel-team screens; the first successful Google sign-in creates the Firebase identity, while the server allowlist still determines hotel-team access. The browser opens the Google account chooser only after the button is clicked. Create your account at **/account**, then verify your email. The supplied owner email is configured in the local server environment; sign in with that verified account to open **/admin**.

Set **one** of these on the server before signing in:

```dotenv
OWNER_EMAILS=your-verified-owner-email@example.com
# Or pin the stable Firebase account UID:
OWNER_UIDS=your-firebase-user-uid
```

Staff can be authorized with comma-separated `STAFF_EMAILS` or `STAFF_UIDS`. Email-based authorization requires a verified Firebase email. A UID allowlist authorizes the exact account without relying on email verification. New public signups receive guest access. There is no automatic first-user admin assignment.

The browser authenticates directly with Firebase. Passwords do not pass through Express. The backend verifies Firebase ID-token signatures against Google's published certificates and checks issuer, project audience, subject, expiry, issued-at time, and authentication time. It sets an HttpOnly, SameSite cookie expiring with the token. Every admin request separately checks the server-side owner/staff allowlist. Firebase session persistence refreshes the ID token while the dashboard is in use. Removing a user from the allowlist revokes application access on the next request; Firebase account disable/revocation alone can take until an issued ID token expires. For immediate revocation, remove its server allowlist entry as well.

No private Firebase service-account key is needed for this authentication flow. Analytics is not initialized by the sign-in module. Password reset is available through Firebase from the sign-in screen. Public web config contains no database password.

## Guest accounts and booking

Guests can use Google or email/password to create an account or sign in at **/account**, before sending a room, restaurant, or banquet request, and during paid room checkout. Email verification is required before sending a reservation request or completing paid checkout. Password reset and verification resend are available in the account panel. Selected dates remain in place during signup.

New reservations are linked server-side to the verified Firebase UID and use the authenticated email. **My bookings** shows each guest’s own reservations, receipts, payment status, cancellation requests, and hotel-reviewed reservation requests. An email match alone never claims an existing reservation. Earlier or staff-created bookings remain accessible through their secure management links.

The additive guest-account migration preserves existing booking records. Normal token refreshes do not consume the failed-sign-in rate limit.

## Hotel setup

1. **Content & gallery:** verify hotel details, photographs, each category's nightly price and guest capacity.
2. **Guest rooms:** enter each real room under one of the four published categories. Physical room capacity must fit its category’s configured capacity. Restaurant and banquet enquiries use reservation requests.
3. **Settings & policies:** configure check-in/out, restaurant hours, tax percentage, hotel-approved terms, privacy, and cancellation/refund policies.
4. Mark the hotel details verified, then enable reservations when ready. Paid room confirmations also require Razorpay and email configuration. Guests can send account-linked room requests before paid checkout is configured.
5. Add phone/OTA bookings and maintenance blocks through the dashboard. This application is the inventory source; it does not synchronize a separate PMS or channel manager.

Room estimates use the published nightly rates and 5% GST. Dining and banquet requests have no invented reservation fee. The hotel confirms their availability and arrangements directly with the guest. Whole-property rentals are not offered. All times use Asia/Kolkata.

## Payments and email

Configure `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `RAZORPAY_WEBHOOK_SECRET` with test credentials first. Enable automatic capture. Register `/api/payments/webhook` for `payment.captured`, `order.paid`, `refund.processed`, and `refund.failed`. Local webhook testing needs an HTTPS tunnel to the API; the application itself can remain on localhost.

Configure a verified sender in Resend and set `RESEND_API_KEY`, `EMAIL_FROM`, and `APP_URL`. Booking management links use `APP_URL`. With no email provider, contact enquiries are still saved and their acknowledgements wait in the notification outbox; paid checkout remains unavailable.

Checkout holds expire after 15 minutes, and availability ignores expired holds without a scheduler. All prices are recomputed server-side; a price change requires a fresh quote. Callbacks and webhooks are signature-verified and idempotent. Late captured payments are confirmed only if inventory remains available, otherwise they enter reconciliation. Cancellation and refund are separate owner/staff actions; only the owner can issue a full refund. Ambiguous refund responses are reconciled with **Check payment**, never retried blindly.

Email failures do not undo reservations. Use dashboard retry or schedule `GET /api/jobs/notifications` with `Authorization: Bearer <CRON_SECRET>`. Secure guest links use random 256-bit tokens in URL fragments, stored as hashes in the access table and valid for 180 days. A reference/email match can request a new link.

## Design and motion

The royal dark interface uses warm charcoal, ivory, antique gold, the original hotel logo, a selectable room preview, an editorial split hero, layered room and rooftop photographs, word reveals, SVG line drawing, cultural marquee, scroll reveals, parallax imagery, interactive cards, and magnetic buttons. Animation instances and listeners are disposed on route changes. The **Motion on/off** control persists the visitor's choice; system reduced-motion preference takes priority. Forms, gallery controls, and navigation remain usable without decorative motion.

The guest policy pages have contents navigation, printable source-backed terms, privacy and cancellation details, and direct booking-management links. Guest cancellation requests require an explicit review before submission. The hotel desk includes arrival/departure lists, operational shortcuts, reservation and enquiry filters, and export of the current reservation view. Button foreground/background pairs are defined together to prevent older component colors from overriding their contrast.

Design references reviewed: [Taj Umaid Bhawan Palace](https://www.tajhotels.com/en-in/hotels/umaid-bhawan-palace-jodhpur), [The Oberoi Udaivilas](https://www.oberoihotels.com/hotels-in-udaipur-udaivilas-resort/), and [Raffles Udaipur rooms](https://www.raffles.com/udaipur/rooms-and-suites/). Their accommodation and guest-information structure informed the presentation; all hotel photographs and offerings remain Mithila Heritage’s.

References: [Firebase Google sign-in](https://firebase.google.com/docs/auth/web/google-signin), [Anime.js with React](https://animejs.com/documentation/getting-started/using-with-react/) and [Firebase token verification](https://firebase.google.com/docs/auth/admin/verify-id-tokens).

## Verification

```sh
npm test
node scripts/test-database.mjs
npm run build
npm run setup:check
```

Unit/API tests do not connect to the configured production database. Database checks use two real Neon connections, exercise the advisory lock, availability, room prices, hold expiry, guest account isolation, and request ownership, and roll back all test rows and settings. No payment or email is sent by these checks.

Before live payments, test real Firebase owner/staff sign-in, a Razorpay test checkout for rooms, captured and replayed webhooks, abandoned/late payments, cancellations, refunds, and email delivery. Inspect mobile/desktop rendering, keyboard navigation, and both motion settings in a browser.

## Vercel later

Use the repository root with the Vite preset. `vercel.json` serves `dist` and the Express API and contains redirects from the original PHP pages. Set server environment variables, add the final domain to Firebase authorized domains, and set `APP_URL`. Provision migrations separately. Configure provider webhooks, notification retries, backups, and shared edge rate limits before enabling live reservations. The included in-process rate limiter is basic protection, not a shared serverless limit.

No production deployment or domain change has been performed.

## Source alignment

See [SOURCE-AUDIT.md](SOURCE-AUDIT.md) for the checked pages, four allowed room categories, pricing, policy sources, and conflicting banquet capacity. The live Neon catalog is synchronized to the source-backed content; the previous public settings are saved in the ignored `.local-backups/` directory.

## Assets

Hotel photography is from the authorized redesign source, https://mithilaheritage.in. Fonts are Cormorant Garamond and Manrope, with SIL OFL files in `frontend/public/fonts`. The original vector motifs are inspired by Mithila's cultural tradition; they are decorative artwork, not photographs of the property.
