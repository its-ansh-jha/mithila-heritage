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
  roomOffer:{discountPercent:20,validFrom:'2026-10-07',validThrough:'2026-11-15',label:'20% OFF till 15 November 2026'},
  ...publishedPolicies,
  rooms: [
    {id:'heritage-classic',name:'Heritage Classic',eyebrow:'A RESTFUL RETREAT',image:'https://drive.google.com/thumbnail?id=1xoLsPM7eR5_OyLD0EtA5zL9O014LRNQK&sz=w1600',gallery:[{src:'https://drive.google.com/thumbnail?id=1KJ1VjZUiBaTfIYDe8YaZwEOLDIRG2ZJ0&sz=w1600',alt:'Heritage Classic bed and room interior'},{src:'https://drive.google.com/thumbnail?id=1LhOpLdOeCH9t9eoovOL4hnhXi3YdE5UZ&sz=w1600',alt:'Heritage Classic wide room view'},{src:'https://drive.google.com/thumbnail?id=1cQlo4g3tnMrQKZ944m7wby89eEcPlTOk&sz=w1600',alt:'Heritage Classic room from the entrance'},{src:'https://drive.google.com/thumbnail?id=1Mmivj5Qxbyk0B-Rak5Scny0GQ0ezCnJr&sz=w1600',alt:'Heritage Classic seating corner'},{src:'https://drive.google.com/thumbnail?id=13jwNV9IaSo81bv4AhGX3XTFt7KLU6z8K&sz=w1600',alt:'Private bathroom vanity'},{src:'https://drive.google.com/thumbnail?id=14jgddXGJhyRkikf5nPynQZfrlBOfkPyV&sz=w1600',alt:'Private bathroom'}],rate:3499,capacity:2,description:'A considered space to slow down. Soft tones, comfortable furnishings, and the little essentials for an easy stay in Patna.',amenities:publishedAmenities},
    {id:'heritage-deluxe',name:'Heritage Deluxe',eyebrow:'ROOM TO UNWIND',image:'https://drive.google.com/thumbnail?id=1lh44DuI2N20xfQIMjb5VB73vGHXJxoZj&sz=w1600',gallery:[{src:'https://drive.google.com/thumbnail?id=1qbmmtH6tiEZdW-G9OSSFPaSEssrAz-bG&sz=w1600',alt:'Twin bed room with both beds in view'},{src:'https://drive.google.com/thumbnail?id=1NxkC12TKgITSwsFe_kURmY4jgs5Mmy0Q&sz=w1600',alt:'Twin bed room front view'},{src:'https://drive.google.com/thumbnail?id=1w5Cy8K3pZb-uBAdp8-VxzLrB2ROcMWHX&sz=w1600',alt:'Twin bed room television and seating area'},{src:'https://drive.google.com/thumbnail?id=18o1XRzNKqrzoyxeB-DglBNhEdxXlTuw5&sz=w1600',alt:'Twin bed room seating and television wall'},{src:'https://drive.google.com/thumbnail?id=13jwNV9IaSo81bv4AhGX3XTFt7KLU6z8K&sz=w1600',alt:'Private bathroom vanity'},{src:'https://drive.google.com/thumbnail?id=14jgddXGJhyRkikf5nPynQZfrlBOfkPyV&sz=w1600',alt:'Private bathroom'}],rate:4499,capacity:2,description:'Settle into an inviting room with a little more space to make your own. An easy choice for unhurried mornings and restful evenings.',amenities:publishedAmenities},
    {id:'royal-premium',name:'Royal Premium Deluxe',eyebrow:'AN ELEVATED EVERYDAY',image:'https://drive.google.com/thumbnail?id=19h2LEVn8T3F5dj4mm489ViAxnQYHsXuI&sz=w1600',gallery:[{src:'https://drive.google.com/thumbnail?id=1us4Ua3vYQrbnjIeWmy5pTkVQIo5sjG5i&sz=w1600',alt:'Royal Premium room wide view with sofa'},{src:'https://drive.google.com/thumbnail?id=1C4l63t2LRKon-PAWht39zn1T40bnyzg2&sz=w1600',alt:'Royal Premium bed and lounge area'},{src:'https://drive.google.com/thumbnail?id=1P980-3gMgHpV2bgyORKuydDroDHtQbQ3&sz=w1600',alt:'Royal Premium room television and wardrobe view'},{src:'https://drive.google.com/thumbnail?id=1VuLwXjiOUGHhs4qQo789R-IPn81zG_Vm&sz=w1600',alt:'Royal Premium room wide interior'},{src:'https://drive.google.com/thumbnail?id=13jwNV9IaSo81bv4AhGX3XTFt7KLU6z8K&sz=w1600',alt:'Private bathroom vanity'},{src:'https://drive.google.com/thumbnail?id=14jgddXGJhyRkikf5nPynQZfrlBOfkPyV&sz=w1600',alt:'Private bathroom'}],rate:5499,capacity:2,description:'Warm interiors and thoughtful comfort come together in our premium retreat. A welcoming base for exploring the city or simply staying in.',amenities:publishedAmenities},
    {id:'maharaja-suite',name:'Maharaja Suite',eyebrow:'STAY A LITTLE GRANDER',image:'https://drive.google.com/thumbnail?id=1PpCCfj8PovyTFlm-mafyVqb82I9Usz9R&sz=w1600',gallery:[{src:'https://drive.google.com/thumbnail?id=1WwNK4ltCCdQpRiDshiAxIELD0rg_DNYh&sz=w1600',alt:'Maharaja Suite spacious room view'},{src:'https://drive.google.com/thumbnail?id=18GYav3TOzxxGiaR7LHe6lQvm5ZaXnBTc&sz=w1600',alt:'Maharaja Suite bed and television view'},{src:'https://drive.google.com/thumbnail?id=1GOg1FyejlVFF53v8QlVWAFAcxM2xgcHf&sz=w1600',alt:'Maharaja Suite private sitting area'},{src:'https://drive.google.com/thumbnail?id=1J4ilN5gOzhXKWSRAe6_6Egk8tdsjHiSE&sz=w1600',alt:'Maharaja Suite bed front view'},{src:'https://drive.google.com/thumbnail?id=13jwNV9IaSo81bv4AhGX3XTFt7KLU6z8K&sz=w1600',alt:'Private bathroom vanity'},{src:'https://drive.google.com/thumbnail?id=14jgddXGJhyRkikf5nPynQZfrlBOfkPyV&sz=w1600',alt:'Private bathroom'}],rate:6499,capacity:2,description:'Our signature suite invites you to take your time. A generous, comfortable setting for special stays and moments worth lingering over.',amenities:publishedAmenities}
  ],
  gallery:[
  {
    "src": "https://drive.google.com/thumbnail?id=1KJ1VjZUiBaTfIYDe8YaZwEOLDIRG2ZJ0&sz=w1600",
    "category": "Rooms",
    "alt": "Heritage Classic guest room"
  },
  {
    "src": "https://drive.google.com/thumbnail?id=1cQlo4g3tnMrQKZ944m7wby89eEcPlTOk&sz=w1600",
    "category": "Rooms",
    "alt": "Heritage Classic guest room"
  },
  {
    "src": "https://drive.google.com/thumbnail?id=1LhOpLdOeCH9t9eoovOL4hnhXi3YdE5UZ&sz=w1600",
    "category": "Rooms",
    "alt": "Heritage Classic guest room"
  },
  {
    "src": "https://drive.google.com/thumbnail?id=1xoLsPM7eR5_OyLD0EtA5zL9O014LRNQK&sz=w1600",
    "category": "Rooms",
    "alt": "Heritage Classic guest room"
  },
  {
    "src": "https://drive.google.com/thumbnail?id=1Mmivj5Qxbyk0B-Rak5Scny0GQ0ezCnJr&sz=w1600",
    "category": "Rooms",
    "alt": "Heritage Classic guest room"
  },
  {
    "src": "https://drive.google.com/thumbnail?id=1w5Cy8K3pZb-uBAdp8-VxzLrB2ROcMWHX&sz=w1600",
    "category": "Rooms",
    "alt": "Heritage Deluxe double-bed guest room"
  },
  {
    "src": "https://drive.google.com/thumbnail?id=18o1XRzNKqrzoyxeB-DglBNhEdxXlTuw5&sz=w1600",
    "category": "Rooms",
    "alt": "Heritage Deluxe double-bed guest room"
  },
  {
    "src": "https://drive.google.com/thumbnail?id=1NxkC12TKgITSwsFe_kURmY4jgs5Mmy0Q&sz=w1600",
    "category": "Rooms",
    "alt": "Heritage Deluxe double-bed guest room"
  },
  {
    "src": "https://drive.google.com/thumbnail?id=1qbmmtH6tiEZdW-G9OSSFPaSEssrAz-bG&sz=w1600",
    "category": "Rooms",
    "alt": "Heritage Deluxe double-bed guest room"
  },
  {
    "src": "https://drive.google.com/thumbnail?id=1lh44DuI2N20xfQIMjb5VB73vGHXJxoZj&sz=w1600",
    "category": "Rooms",
    "alt": "Heritage Deluxe double-bed guest room"
  },
  {
    "src": "https://drive.google.com/thumbnail?id=14jgddXGJhyRkikf5nPynQZfrlBOfkPyV&sz=w1600",
    "category": "Rooms",
    "alt": "Royal Premium Deluxe guest room"
  },
  {
    "src": "https://drive.google.com/thumbnail?id=13jwNV9IaSo81bv4AhGX3XTFt7KLU6z8K&sz=w1600",
    "category": "Rooms",
    "alt": "Royal Premium Deluxe guest room"
  },
  {
    "src": "https://drive.google.com/thumbnail?id=1C4l63t2LRKon-PAWht39zn1T40bnyzg2&sz=w1600",
    "category": "Rooms",
    "alt": "Royal Premium Deluxe guest room"
  },
  {
    "src": "https://drive.google.com/thumbnail?id=19h2LEVn8T3F5dj4mm489ViAxnQYHsXuI&sz=w1600",
    "category": "Rooms",
    "alt": "Royal Premium Deluxe guest room"
  },
  {
    "src": "https://drive.google.com/thumbnail?id=1VuLwXjiOUGHhs4qQo789R-IPn81zG_Vm&sz=w1600",
    "category": "Rooms",
    "alt": "Royal Premium Deluxe guest room"
  },
  {
    "src": "https://drive.google.com/thumbnail?id=1us4Ua3vYQrbnjIeWmy5pTkVQIo5sjG5i&sz=w1600",
    "category": "Rooms",
    "alt": "Royal Premium Deluxe guest room"
  },
  {
    "src": "https://drive.google.com/thumbnail?id=1P980-3gMgHpV2bgyORKuydDroDHtQbQ3&sz=w1600",
    "category": "Rooms",
    "alt": "Royal Premium Deluxe guest room"
  },
  {
    "src": "https://drive.google.com/thumbnail?id=1J4ilN5gOzhXKWSRAe6_6Egk8tdsjHiSE&sz=w1600",
    "category": "Rooms",
    "alt": "Maharaja Suite"
  },
  {
    "src": "https://drive.google.com/thumbnail?id=1WwNK4ltCCdQpRiDshiAxIELD0rg_DNYh&sz=w1600",
    "category": "Rooms",
    "alt": "Maharaja Suite"
  },
  {
    "src": "https://drive.google.com/thumbnail?id=1PpCCfj8PovyTFlm-mafyVqb82I9Usz9R&sz=w1600",
    "category": "Rooms",
    "alt": "Maharaja Suite"
  },
  {
    "src": "https://drive.google.com/thumbnail?id=18GYav3TOzxxGiaR7LHe6lQvm5ZaXnBTc&sz=w1600",
    "category": "Rooms",
    "alt": "Maharaja Suite"
  },
  {
    "src": "https://drive.google.com/thumbnail?id=1GOg1FyejlVFF53v8QlVWAFAcxM2xgcHf&sz=w1600",
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
export const money = (paise) => {const amount=paise/100;return new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',minimumFractionDigits:Number.isInteger(amount)?0:2,maximumFractionDigits:2}).format(amount);};
export const roomOfferActive=(offer,now=Date.now())=>{
 if(!offer?.discountPercent)return false;
 const start=offer.validFrom?Date.parse(offer.validFrom+'T00:00:00+05:30'):0;
 const end=offer.validThrough?Date.parse(offer.validThrough+'T23:59:59+05:30'):Infinity;
 return now>=start&&now<=end;
};
export const roomSaleRate=(room,offer,now=Date.now())=>roomOfferActive(offer,now)?Math.round((room.rate*(100-offer.discountPercent)/100)*100)/100:room.rate;
