# Mithila Heritage

Royal dark hotel website with original Mithila Heritage photography, cultural vector ornament, Anime.js motion, React/Vite, and direct WhatsApp enquiries.

## Start

```sh
npm install --ignore-scripts --no-bin-links
npm run dev
```

Open http://localhost:5173. For production, run `npm run build` then `npm start`. The Express port defaults to 3001; use `PORT=5173 npm start` for the local production preview. The Android launcher builds in an executable temporary directory and copies the output to `dist`.

## WhatsApp reservations

All enquiries go to **+91 72958 07999** through `https://wa.me/917295807999`. The number and message builders are centralized in `shared/whatsapp.js`.

- Homepage Check on WhatsApp includes the room category, dates, number of guests and required rooms.
- The booking page adds optional name and special requests, with an indicative stay estimate using the published rate and tax.
- Dining and banquet pages prepare relevant date, time, occasion and guest details.
- Contact and reservation-help forms prepare general, change, cancellation and refund messages.
- A visible retry link is shown if the browser blocks the new WhatsApp window.

The guest reviews the prefilled message and taps **Send** inside WhatsApp. Opening a link does not send a message, reserve inventory, charge money or confirm a stay. The hotel handles availability, payment arrangements, confirmation, cancellations and booking changes in the conversation. Completed payments are non-refundable.

There is no guest or admin login. Old /account links redirect to /book; /admin redirects to the homepage. Firebase Authentication is no longer imported into the website. Account, admin, online-checkout and database-enquiry endpoints return HTTP 410 with the WhatsApp contact. Historical database records, secure legacy receipt APIs and payment webhooks remain intact; no customer records were deleted.

The public catalog may still load from the existing read-only /api/site endpoint. Published local content is the fallback, so WhatsApp enquiry preparation works even if the database is unavailable. Original site policy text remains, with an explanation of the current WhatsApp handoff.

## Motion and graphics

Sections stay opaque and move into place once. Scrolling updates only a narrow progress indicator; it no longer applies per-frame transforms to photographs or updates a CSS variable inherited across the document. Large blurred/fixed layers and 3D card transforms were removed. Decorative line drawing, cultural geometric frames, image hover treatments and a motion toggle remain. Reduced-motion preferences are respected; small screens use a static cultural ribbon.

## Verification

```sh
npm test
npm run build
```

Tests cover WhatsApp message encoding, the destination number, dates, guest capacity, room estimates and retired API routes, plus existing historical data protections. No test sends WhatsApp messages or makes payments.

## Git and configuration

Git was initialized before the WhatsApp changes with a checkpoint of the preceding application. The repository is local; no remote is configured or pushed. On Android shared storage, use `git -c safe.directory=/storage/emulated/0/mithilaheritage status` if Git flags directory ownership.

Secrets stay in ignored `.env` files. Database snapshots, dependencies and generated build files are ignored. Do not commit database credentials.

## Sources and assets

See [SOURCE-AUDIT.md](SOURCE-AUDIT.md) for the four original room categories, hotel content and policies. All photography remains from mithilaheritage.in; no extra hotels or services were added. Cormorant Garamond and Manrope fonts include their OFL licenses. The vector motifs are original decorative work inspired by Mithila.

References: [WhatsApp click to chat](https://faq.whatsapp.com/5913398998672934), [Anime.js documentation](https://animejs.com/documentation/).

No public deployment or domain change has been performed.
