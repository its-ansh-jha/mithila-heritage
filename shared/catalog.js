import {publishedPolicies} from './policies.js';
export const roomTypes=['heritage-classic','heritage-deluxe','royal-premium','maharaja-suite'];
export const publishedAmenities=['Free Wi-Fi','Smart TV','Minibar','Tea & coffee maker','Safe deposit box','Queen bed','Modern bathroom','Essential toiletries','Workspace desk','Air conditioning','In-room dining'];
export const initialSite = {
  name: 'Mithila Heritage', tagline: 'Rooted in culture. Crafted for you.',
  phone: '+917295848999', secondaryPhone: '+917295807999', email: 'info@mithilaheritage.in',
  address: 'B-2, Jayprakash Nagar, Ashiana Kurji Nala Road, Patna, Bihar 800025',
  story: 'In Patna’s Jayprakash Nagar, Mithila Heritage brings together four room categories, a rooftop restaurant, and a banquet hall. Comfortable rooms, round-the-clock room service, and a welcoming team make space for stays, meals, and celebrations.',
  checkIn: '12:00', checkOut: '11:00', restaurantOpen: '07:00', restaurantClose: '23:00',
  bookingEnabled: false, verified: false, taxPercent: 5,
  ...publishedPolicies,
  rooms: [
    {id:'heritage-classic',name:'Heritage Classic',eyebrow:'A RESTFUL RETREAT',image:'/images/room1.webp',rate:2700,capacity:2,description:'A considered space to slow down. Soft tones, comfortable furnishings, and the little essentials for an easy stay in Patna.',amenities:publishedAmenities},
    {id:'heritage-deluxe',name:'Heritage Deluxe',eyebrow:'ROOM TO UNWIND',image:'/images/room4.webp',rate:2999,capacity:2,description:'Settle into an inviting room with a little more space to make your own. An easy choice for unhurried mornings and restful evenings.',amenities:publishedAmenities},
    {id:'royal-premium',name:'Royal Premium Deluxe',eyebrow:'AN ELEVATED EVERYDAY',image:'/images/room3.webp',rate:3499,capacity:2,description:'Warm interiors and thoughtful comfort come together in our premium retreat. A welcoming base for exploring the city or simply staying in.',amenities:publishedAmenities},
    {id:'maharaja-suite',name:'Maharaja Suite',eyebrow:'STAY A LITTLE GRANDER',image:'/images/room2.webp',rate:3999,capacity:2,description:'Our signature suite invites you to take your time. A generous, comfortable setting for special stays and moments worth lingering over.',amenities:publishedAmenities}
  ],
  gallery:[
  {
    "src": "/images/room1.webp",
    "category": "Rooms",
    "alt": "Heritage Classic guest room"
  },
  {
    "src": "/images/room4.webp",
    "category": "Rooms",
    "alt": "Heritage Deluxe guest room"
  },
  {
    "src": "/images/room3.webp",
    "category": "Rooms",
    "alt": "Royal Premium Deluxe guest room"
  },
  {
    "src": "/images/room2.webp",
    "category": "Rooms",
    "alt": "Maharaja Suite"
  },
  {
    "src": "/images/IMG_3330.webp",
    "category": "Dining",
    "alt": "Restaurant seating at Mithila Heritage"
  },
  {
    "src": "/images/IMG_3331.webp",
    "category": "Dining",
    "alt": "Mithila Heritage dining interior"
  },
  {
    "src": "/images/IMG_3338.webp",
    "category": "Spaces",
    "alt": "An interior view of Mithila Heritage"
  },
  {
    "src": "/images/IMG_3346.webp",
    "category": "Spaces",
    "alt": "Hotel interiors at Mithila Heritage"
  },
  {
    "src": "/images/IMG_3349.webp",
    "category": "Spaces",
    "alt": "A detail inside Mithila Heritage"
  },
  {
    "src": "/images/IMG_3350.webp",
    "category": "Spaces",
    "alt": "Mithila Heritage interior details"
  },
  {
    "src": "/images/IMG_3352.webp",
    "category": "Celebrations",
    "alt": "Mithila Heritage event space"
  },
  {
    "src": "/images/IMG_3354.webp",
    "category": "Celebrations",
    "alt": "Mithila Heritage banquet hall"
  },
  {
    "src": "/images/IMG_3523.webp",
    "category": "Spaces",
    "alt": "Mithila Heritage hotel spaces"
  },
  {
    "src": "/images/IMG_3505.webp",
    "category": "Spaces",
    "alt": "Inside Mithila Heritage"
  },
  {
    "src": "/images/IMG_3362.webp",
    "category": "Dining",
    "alt": "Mithila Heritage restaurant interior"
  },
  {
    "src": "/images/IMG_3375.webp",
    "category": "Dining",
    "alt": "Open rooftop restaurant at Mithila Heritage"
  }
]
};
export const money = (paise) => new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:2}).format(paise/100);
