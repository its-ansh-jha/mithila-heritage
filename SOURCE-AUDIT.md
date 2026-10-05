# Mithila Heritage source audit

Checked on 5 October 2026. The reference is the existing hotel website, https://mithilaheritage.in. The site describes one hotel at B-2, Jayprakash Nagar, Ashiana Kurji Nala Road, Patna 800025.

## Offerings carried forward

| Offering | Published information | Source |
| --- | --- | --- |
| Heritage Classic | ₹2,700/night + 5% GST; 2 guests; 35 m²; queen bed; city view | https://mithilaheritage.in/heritage-classic-rooms.php |
| Heritage Deluxe | ₹2,999/night + 5% GST; 2 guests; 35 m²; queen bed; city view | https://mithilaheritage.in/heritage-deluxe-room.php |
| Royal Premium Deluxe | ₹3,499/night + 5% GST; 2 guests; 35 m²; queen bed; city view | https://mithilaheritage.in/royal-premium-Deluxe-room.php |
| Maharaja Suite | ₹3,999/night + 5% GST; 2 guests; 35 m²; queen bed; city view | https://mithilaheritage.in/maharaja-suite-room.php |
| Rooftop restaurant | Indian, Continental, Chinese; vegetarian and non-vegetarian; reservation requests by date/time/party size | https://mithilaheritage.in/rooftop-restaurant.php |
| Banquet hall | Weddings, receptions, birthdays, corporate meetings; catering, decor, AV and event support | https://mithilaheritage.in/grand-banquet-hall.php |

The homepage publishes check-in 12:00, check-out 11:00, rooftop dining 07:00–23:00, complimentary breakfast, free parking, and transfer arrangements on request with possible charges. Room amenities are taken from the four room pages.

## Scope corrections

- Removed whole-property rentals and the invented per-minute table/property fees.
- Only the four existing room category IDs can be created through room booking/settings APIs. Physical rooms can still be entered for inventory under those categories.
- Restaurant and banquet forms create requests for hotel review. A request never reserves inventory or claims payment/confirmation.
- Rooms support the same request workflow while paid booking setup is incomplete. Rates are estimates and availability needs hotel confirmation. Existing paid-room checkout remains available after proper configuration.
- Kept customer registration, verification, account requests, booking receipts, and owner/staff access.
- Old booking records and their payment/refund handling are preserved. Historical property occupancy is honored; new property bookings are rejected.
- Redirected the former /property URL to /banquet and corrected sitemap/navigation links.

## Content decisions

The source contradicts itself on banquet capacity: the home/about pages say 100 seats, another homepage section says 200 guests, and the banquet page says 300–500. The rebuilt site does not publish a capacity; guests discuss seating with the hotel. No room-count inventory, live availability, or hotel rating has been invented.

Team names and roles come from https://mithilaheritage.in/our-team.php. Its dummy staff photographs were omitted. Original hotel photography comes from the four room pages and https://mithilaheritage.in/gallery.php. No stock hotels or generated property images were added.

The three published policies were carried over in concise form from:
- https://mithilaheritage.in/terms-conditions.php
- https://mithilaheritage.in/privacy-plocy.php
- https://mithilaheritage.in/refund-policy.php

Other checked pages: /index.php, /rooms.php, /about-hotel.php, /contact-us.php, /reservation.php, /testomonials.php, and /blog-details.php. Duplicate generic blog links, dummy counters, and undated promotions were not added to the new interface.

## Dark design

Charcoal and deep green surfaces, warm ivory text, antique gold controls, and restrained clay accents. Existing Mithila-inspired fish, lotus, and mandala linework provide the cultural details. The original logo is used on dark surfaces. Room previews, image reveals, and subtle scroll motion respect the motion toggle and reduced-motion preference.
