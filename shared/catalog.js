import {publishedPolicies} from './policies.js';
export const roomTypes=['heritage-classic','heritage-deluxe','royal-premium','maharaja-suite'];
export const publishedAmenities=['Free Wi-Fi','Smart TV','Minibar','Tea & coffee maker','Safe deposit box','Queen bed','Modern bathroom','Essential toiletries','Workspace desk','Air conditioning','In-room dining'];
export const initialSite = {
  name: 'Mithila Heritage', tagline: 'Rooted in culture. Crafted for you.',
  phone: '+917295848999', secondaryPhone: '+917295807999', email: 'sales@mithilaheritage.in',
  address: 'B-2, Jayprakash Nagar, Ashiana Kurji Nala Road, Patna, Bihar 800025',
  story: 'In Patna’s Jayprakash Nagar, Mithila Heritage brings together four room categories, a rooftop restaurant, and a banquet hall. Comfortable rooms, round-the-clock room service, and a welcoming team make space for stays, meals, and celebrations.',
  checkIn: '12:00', checkOut: '11:00', restaurantOpen: '07:00', restaurantClose: '23:00',
  bookingEnabled: false, verified: false, taxPercent: 5,
  roomOffer:{discountPercent:20,validFrom:'2026-10-07',validThrough:'2026-11-01',label:'20% OFF till 1 November 2026'},
  restaurantMenus:[
    {name:'Restaurant Menu',label:'Full multi-cuisine menu',url:'https://drive.google.com/file/d/134ZPSJS-b-2aLNyBjiYRJnXBL7K-FAin/view'},
    {name:'Café Menu',label:'Coffee, mocktails, snacks & café favourites',url:'https://drive.google.com/file/d/1t0qK8eCuXpXCLN-2fskQsA7WFlIenZNX/view'}
  ],
  ...publishedPolicies,
  rooms: [
    {id:'heritage-classic',name:'Heritage Classic',eyebrow:'A RESTFUL RETREAT',image:'/images/drive/1xoLsPM7eR5_OyLD0EtA5zL9O014LRNQK.jpg',gallery:[{src:'/images/drive/1KJ1VjZUiBaTfIYDe8YaZwEOLDIRG2ZJ0.jpg',alt:'Heritage Classic bed and room interior'},{src:'/images/drive/1LhOpLdOeCH9t9eoovOL4hnhXi3YdE5UZ.jpg',alt:'Heritage Classic wide room view'},{src:'/images/drive/1cQlo4g3tnMrQKZ944m7wby89eEcPlTOk.jpg',alt:'Heritage Classic room from the entrance'},{src:'/images/drive/1Mmivj5Qxbyk0B-Rak5Scny0GQ0ezCnJr.jpg',alt:'Heritage Classic seating corner'},{src:'/images/drive/13jwNV9IaSo81bv4AhGX3XTFt7KLU6z8K.jpg',alt:'Private bathroom vanity'},{src:'/images/drive/14jgddXGJhyRkikf5nPynQZfrlBOfkPyV.jpg',alt:'Private bathroom'}],rate:3499,capacity:2,description:'A considered space to slow down. Soft tones, comfortable furnishings, and the little essentials for an easy stay in Patna.',amenities:publishedAmenities},
    {id:'heritage-deluxe',name:'Heritage Deluxe',eyebrow:'ROOM TO UNWIND',image:'/images/drive/1lh44DuI2N20xfQIMjb5VB73vGHXJxoZj.jpg',gallery:[{src:'/images/drive/1qbmmtH6tiEZdW-G9OSSFPaSEssrAz-bG.jpg',alt:'Twin bed room with both beds in view'},{src:'/images/drive/1NxkC12TKgITSwsFe_kURmY4jgs5Mmy0Q.jpg',alt:'Twin bed room front view'},{src:'/images/drive/1w5Cy8K3pZb-uBAdp8-VxzLrB2ROcMWHX.jpg',alt:'Twin bed room television and seating area'},{src:'/images/drive/18o1XRzNKqrzoyxeB-DglBNhEdxXlTuw5.jpg',alt:'Twin bed room seating and television wall'},{src:'/images/drive/13jwNV9IaSo81bv4AhGX3XTFt7KLU6z8K.jpg',alt:'Private bathroom vanity'},{src:'/images/drive/14jgddXGJhyRkikf5nPynQZfrlBOfkPyV.jpg',alt:'Private bathroom'}],rate:4499,capacity:2,description:'Settle into an inviting room with a little more space to make your own. An easy choice for unhurried mornings and restful evenings.',amenities:publishedAmenities},
    {id:'royal-premium',name:'Royal Premium Deluxe',eyebrow:'AN ELEVATED EVERYDAY',image:'/images/drive/19h2LEVn8T3F5dj4mm489ViAxnQYHsXuI.jpg',gallery:[{src:'/images/drive/1us4Ua3vYQrbnjIeWmy5pTkVQIo5sjG5i.jpg',alt:'Royal Premium room wide view with sofa'},{src:'/images/drive/1C4l63t2LRKon-PAWht39zn1T40bnyzg2.jpg',alt:'Royal Premium bed and lounge area'},{src:'/images/drive/1P980-3gMgHpV2bgyORKuydDroDHtQbQ3.jpg',alt:'Royal Premium room television and wardrobe view'},{src:'/images/drive/1VuLwXjiOUGHhs4qQo789R-IPn81zG_Vm.jpg',alt:'Royal Premium room wide interior'},{src:'/images/drive/13jwNV9IaSo81bv4AhGX3XTFt7KLU6z8K.jpg',alt:'Private bathroom vanity'},{src:'/images/drive/14jgddXGJhyRkikf5nPynQZfrlBOfkPyV.jpg',alt:'Private bathroom'}],rate:5499,capacity:2,description:'Warm interiors and thoughtful comfort come together in our premium retreat. A welcoming base for exploring the city or simply staying in.',amenities:publishedAmenities},
    {id:'maharaja-suite',name:'Maharaja Suite',eyebrow:'STAY A LITTLE GRANDER',image:'/images/drive/1PpCCfj8PovyTFlm-mafyVqb82I9Usz9R.jpg',gallery:[{src:'/images/drive/1WwNK4ltCCdQpRiDshiAxIELD0rg_DNYh.jpg',alt:'Maharaja Suite spacious room view'},{src:'/images/drive/18GYav3TOzxxGiaR7LHe6lQvm5ZaXnBTc.jpg',alt:'Maharaja Suite bed and television view'},{src:'/images/drive/1GOg1FyejlVFF53v8QlVWAFAcxM2xgcHf.jpg',alt:'Maharaja Suite private sitting area'},{src:'/images/drive/1J4ilN5gOzhXKWSRAe6_6Egk8tdsjHiSE.jpg',alt:'Maharaja Suite bed front view'},{src:'/images/drive/13jwNV9IaSo81bv4AhGX3XTFt7KLU6z8K.jpg',alt:'Private bathroom vanity'},{src:'/images/drive/14jgddXGJhyRkikf5nPynQZfrlBOfkPyV.jpg',alt:'Private bathroom'}],rate:6499,capacity:2,description:'Our signature suite invites you to take your time. A generous, comfortable setting for special stays and moments worth lingering over.',amenities:publishedAmenities}
  ],
  gallery:[
  {
    "src": "/images/drive/1KJ1VjZUiBaTfIYDe8YaZwEOLDIRG2ZJ0.jpg",
    "category": "Rooms",
    "alt": "Heritage Classic guest room"
  },
  {
    "src": "/images/drive/1cQlo4g3tnMrQKZ944m7wby89eEcPlTOk.jpg",
    "category": "Rooms",
    "alt": "Heritage Classic guest room"
  },
  {
    "src": "/images/drive/1LhOpLdOeCH9t9eoovOL4hnhXi3YdE5UZ.jpg",
    "category": "Rooms",
    "alt": "Heritage Classic guest room"
  },
  {
    "src": "/images/drive/1xoLsPM7eR5_OyLD0EtA5zL9O014LRNQK.jpg",
    "category": "Rooms",
    "alt": "Heritage Classic guest room"
  },
  {
    "src": "/images/drive/1Mmivj5Qxbyk0B-Rak5Scny0GQ0ezCnJr.jpg",
    "category": "Rooms",
    "alt": "Heritage Classic guest room"
  },
  {
    "src": "/images/drive/1w5Cy8K3pZb-uBAdp8-VxzLrB2ROcMWHX.jpg",
    "category": "Rooms",
    "alt": "Heritage Deluxe double-bed guest room"
  },
  {
    "src": "/images/drive/18o1XRzNKqrzoyxeB-DglBNhEdxXlTuw5.jpg",
    "category": "Rooms",
    "alt": "Heritage Deluxe double-bed guest room"
  },
  {
    "src": "/images/drive/1NxkC12TKgITSwsFe_kURmY4jgs5Mmy0Q.jpg",
    "category": "Rooms",
    "alt": "Heritage Deluxe double-bed guest room"
  },
  {
    "src": "/images/drive/1qbmmtH6tiEZdW-G9OSSFPaSEssrAz-bG.jpg",
    "category": "Rooms",
    "alt": "Heritage Deluxe double-bed guest room"
  },
  {
    "src": "/images/drive/1lh44DuI2N20xfQIMjb5VB73vGHXJxoZj.jpg",
    "category": "Rooms",
    "alt": "Heritage Deluxe double-bed guest room"
  },
  {
    "src": "/images/drive/14jgddXGJhyRkikf5nPynQZfrlBOfkPyV.jpg",
    "category": "Rooms",
    "alt": "Royal Premium Deluxe guest room"
  },
  {
    "src": "/images/drive/13jwNV9IaSo81bv4AhGX3XTFt7KLU6z8K.jpg",
    "category": "Rooms",
    "alt": "Royal Premium Deluxe guest room"
  },
  {
    "src": "/images/drive/1C4l63t2LRKon-PAWht39zn1T40bnyzg2.jpg",
    "category": "Rooms",
    "alt": "Royal Premium Deluxe guest room"
  },
  {
    "src": "/images/drive/19h2LEVn8T3F5dj4mm489ViAxnQYHsXuI.jpg",
    "category": "Rooms",
    "alt": "Royal Premium Deluxe guest room"
  },
  {
    "src": "/images/drive/1VuLwXjiOUGHhs4qQo789R-IPn81zG_Vm.jpg",
    "category": "Rooms",
    "alt": "Royal Premium Deluxe guest room"
  },
  {
    "src": "/images/drive/1us4Ua3vYQrbnjIeWmy5pTkVQIo5sjG5i.jpg",
    "category": "Rooms",
    "alt": "Royal Premium Deluxe guest room"
  },
  {
    "src": "/images/drive/1P980-3gMgHpV2bgyORKuydDroDHtQbQ3.jpg",
    "category": "Rooms",
    "alt": "Royal Premium Deluxe guest room"
  },
  {
    "src": "/images/drive/1J4ilN5gOzhXKWSRAe6_6Egk8tdsjHiSE.jpg",
    "category": "Rooms",
    "alt": "Maharaja Suite"
  },
  {
    "src": "/images/drive/1WwNK4ltCCdQpRiDshiAxIELD0rg_DNYh.jpg",
    "category": "Rooms",
    "alt": "Maharaja Suite"
  },
  {
    "src": "/images/drive/1PpCCfj8PovyTFlm-mafyVqb82I9Usz9R.jpg",
    "category": "Rooms",
    "alt": "Maharaja Suite"
  },
  {
    "src": "/images/drive/18GYav3TOzxxGiaR7LHe6lQvm5ZaXnBTc.jpg",
    "category": "Rooms",
    "alt": "Maharaja Suite"
  },
  {
    "src": "/images/drive/1GOg1FyejlVFF53v8QlVWAFAcxM2xgcHf.jpg",
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
  },
  {
    "src": "/images/IMG_3357.webp",
    "category": "Dining",
    "alt": "Restaurant seating at Mithila Heritage"
  },
  {
    "src": "/images/IMG_3482.webp",
    "category": "Dining",
    "alt": "Mithila Heritage restaurant dining hall"
  },
  {
    "src": "/images/IMG_3522.webp",
    "category": "Dining",
    "alt": "Restaurant lounge seating at Mithila Heritage"
  },
  {
    "src": "/images/IMG_3574.webp",
    "category": "Dining",
    "alt": "Wide view of the Mithila Heritage restaurant"
  },
  {
    "src": "/images/drive/1kggUPkYENFuenavQRbEyKk8IKh_NnNEc.jpg",
    "category": "Dining",
    "alt": "Beverage counter at Mithila Heritage restaurant"
  },
  {
    "src": "/images/drive/1hDysgMUINL4sBMD3gq9FwAduh2YYP0kG.jpg",
    "category": "Dining",
    "alt": "Rooftop café seating at Mithila Heritage"
  },
  {
    "src": "/images/drive/1RDIIFipO-vmny2APqBz0xh6Jz0TMTUia.jpg",
    "category": "Dining",
    "alt": "Restaurant seating beside the floral wall at Mithila Heritage"
  },
  {
    "src": "/images/drive/11uxBMVuDACkMqHuXCLBDTxZa3mlBb-f8.jpg",
    "category": "Dining",
    "alt": "Elegant restaurant table seating at Mithila Heritage"
  },
  {
    "src": "/images/drive/1zseqO9OqGTsfqvNL_LCq2dVPtUWZ-fY4.jpg",
    "category": "Dining",
    "alt": "Restaurant table setting detail at Mithila Heritage"
  },
  {
    "src": "/images/drive/14d39jfh9wGPDbkQpvh8lRWwpV7W6Sn5R.jpg",
    "category": "Dining",
    "alt": "Restaurant bar counter at Mithila Heritage"
  },
  {
    "src": "/images/drive/1t_plL_fDiqxkR0Hdi2dHVzDxGMa1zIb_.jpg",
    "category": "Celebrations",
    "alt": "Celebration-ready restaurant setting at Mithila Heritage"
  },
  {
    "src": "/images/drive/1Pncnmy-vBCML7VAsM1d2vBe3JoGVCA_o.jpg",
    "category": "Celebrations",
    "alt": "Buffet setup for events at Mithila Heritage"
  },
  {
    "src": "/images/drive/1QQJdkej1ycH6rabkfn5CS9QU5ZUF2Ha-.jpg",
    "category": "Spaces",
    "alt": "Guest corridor at Mithila Heritage"
  },
  {
    "src": "/images/drive/19AODof0gZYF5YGv1HaWB0UJRg_TYsB5q.jpg",
    "category": "Celebrations",
    "alt": "Floral celebration backdrop at Mithila Heritage"
  },
  {
    "src": "/images/drive/1AY-GmIP1CYQ9VCzQCyB_wF6jMQedRDMy.jpg",
    "category": "Dining",
    "alt": "Window-side restaurant seating at Mithila Heritage"
  },
  {
    "src": "/images/drive/1DLUFbTnN1ivDDks5ySmcYIjwp82q2m72.jpg",
    "category": "Dining",
    "alt": "Rooftop café table at Mithila Heritage"
  },
  {
    "src": "/images/drive/1s5s_uUkBnFzBnFXerqaqwK2oqZhJ46-1.jpg",
    "category": "Dining",
    "alt": "Restaurant beverage bar at Mithila Heritage"
  },
  {
    "src": "/images/drive/115Rwe7ugvMllaWdePv1zvFxPP0wRpDH1.jpg",
    "category": "Dining",
    "alt": "Restaurant tableware detail at Mithila Heritage"
  },
  {
    "src": "/images/drive/1v5ACQ9hPxLcNl98R_AObantQxApoYevp.jpg",
    "category": "Dining",
    "alt": "Restaurant and bar interior at Mithila Heritage"
  },
  {
    "src": "/images/drive/1DURqhlqPt-VmMseSlOJfuu7p8ToLClSc.jpg",
    "category": "Dining",
    "alt": "Rooftop café seating area at Mithila Heritage"
  },
  {
    "src": "/images/drive/1ndPJNwhl3BVLIBOLjwYs_Kc7Xistlnu2.jpg",
    "category": "Dining",
    "alt": "Restaurant seating beside the bar at Mithila Heritage"
  },
  {
    "src": "/images/drive/1eGMyjd-9m7SGEAxMqE9jNFyVbb6m0nb4.jpg",
    "category": "Spaces",
    "alt": "Hotel lounge seating by the window at Mithila Heritage"
  },
  {
    "src": "/images/drive/1iyXhYCRnW-NXp41IVKJvHcsbAg6ZnJcA.jpg",
    "category": "Dining",
    "alt": "Wide view of the Mithila Heritage restaurant"
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
