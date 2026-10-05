import React from 'react';
import {Link,NavLink,Navigate,useParams} from 'react-router-dom';
import {ArrowUpRight,ArrowRight,ChevronRight,FileText,Mail,Phone,Printer,ShieldCheck,CalendarClock} from 'lucide-react';
import {Lotus} from './components';
import {publishedPolicies} from '../../shared/policies';
import './policies.css';

const documents={
 privacy:{key:'privacy',title:'Privacy',accent:'& your information',nav:'Privacy policy',icon:ShieldCheck,intro:'How your personal information supports your stay, and how to contact us about it.'},
 terms:{key:'terms',title:'The details of',accent:'a thoughtful stay.',nav:'Terms & conditions',icon:FileText,intro:'Reservation, arrival and guest information for your time at Mithila Heritage.'},
 cancellation:{key:'cancellationPolicy',title:'When your',accent:'plans change.',nav:'Cancellations & refunds',icon:CalendarClock,intro:'Read the cancellation and refund conditions before making or changing a reservation.'}
};
function sectionTitle(text,type,index){
 const checks=type==='cancellation'?[
  [/at least 24 hours|until 24 hours/i,'Cancelling in advance'],
  [/within 24 hours|no.show/i,'Late cancellations & no-shows'],
  [/banquet|event agreement/i,'Banquet & event reservations'],
  [/business days|processing time/i,'Refund processing'],
  [/promotion|non.refundable when/i,'Special reservation conditions'],
  [/contact|reception/i,'Questions about a refund']
 ]:type==='terms'?[
  [/identification|valid.*id/i,'Reservations & identification'],
  [/check.in.*12|check.out.*11|early arrival/i,'Arrival & departure'],
  [/banquet|event bookings/i,'Banquet & event bookings'],
  [/cancellation|cancellations/i,'Cancellation conditions'],
  [/outside food|restaurant hours/i,'Dining at the hotel'],
  [/damage|hotel rules/i,'A considerate stay'],
  [/personal information|privacy/i,'Your information']
 ]:[
  [/collects|collect your/i,'Information we collect'],
  [/security measures|does not sell/i,'Protecting your information'],
  [/cookies|traffic analysis/i,'Cookies & website use'],
  [/payment gateways|card details/i,'Payment information'],
  [/access, correct|request deletion/i,'Your information requests'],
  [/reservations depend|accurate details/i,'Reservation information'],
  [/cctv|public areas/i,'Safety in public spaces'],
  [/policy may change|updates will/i,'Policy updates']
 ];
 return checks.find(([match])=>match.test(text))?.[1]||('Policy details'+(index?' · '+(index+1):''));
}
export default function Policy({site}){
 const {type='terms'}=useParams();
 const document=documents[type];
 if(!document)return <Navigate to="/not-found" replace/>;
 const paragraphs=String(site?.[document.key]||publishedPolicies[document.key]).replace(/\r\n/g,'\n').split(/\n\s*\n/).map(text=>text.trim()).filter(Boolean);
 const edition=/^Published (terms|privacy policy|refund policy)/i.test(paragraphs[0]||'')?paragraphs.shift():null;
 const sections=paragraphs.map((text,index)=>({text,id:'policy-'+type+'-'+(index+1),title:sectionTitle(text,type,index)}));
 const Icon=document.icon;
 return <div className="policy-page">
  <section className="policy-masthead container">
   <nav className="policy-breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link><ChevronRight size={13}/><span>Guest information</span></nav>
   <div className="policy-masthead-inner"><div><p className="policy-kicker"><span/>THE FINER DETAILS</p><h1>{document.title}<br/><em>{document.accent}</em></h1><p className="policy-introduction">{document.intro}</p></div><Lotus className="policy-lotus"/></div>
  </section>
  <div className="policy-layout container">
   <aside className="policy-sidebar">
    <nav aria-label="Guest policies"><span className="policy-nav-label">GUEST POLICIES</span>{Object.entries(documents).map(([key,value])=>{const NavigationIcon=value.icon;return <NavLink to={'/policies/'+key} key={key}><NavigationIcon size={18}/><span>{value.nav}</span><ArrowUpRight size={15}/></NavLink>;})}</nav>
    <div className="policy-help"><Lotus/><h2>A personal<br/><em>conversation.</em></h2><p>For questions about your stay or a specific reservation, our hotel team can help.</p>{site?.phone&&<a href={'tel:'+site.phone}><Phone size={15}/><span>{site.phone}</span></a>}{site?.email&&<a href={'mailto:'+site.email}><Mail size={15}/><span>{site.email}</span></a>}<Link to="/contact" className="policy-contact-link">Contact & directions <ArrowRight size={15}/></Link></div>
   </aside>
   <article className="policy-document" aria-labelledby="policy-document-title">
    <header className="policy-document-header"><div><span className="policy-document-icon"><Icon size={23}/></span><h2 id="policy-document-title">{document.nav}</h2>{edition&&<p>{edition}</p>}</div><button className="policy-print" type="button" onClick={()=>window.print()} aria-label={'Print '+document.nav.toLowerCase()}><Printer size={17}/><span>Print policy</span></button></header>
    {sections.length>1&&<nav className="policy-contents" aria-label="On this page"><span>IN THIS POLICY</span><ol>{sections.map((section,index)=><li key={section.id}><a href={'#'+section.id}><span>{String(index+1).padStart(2,'0')}</span>{section.title}</a></li>)}</ol></nav>}
    <div className="policy-sections">{sections.map((section,index)=><section className="policy-section" id={section.id} key={section.id}><span className="policy-section-number" aria-hidden="true">{String(index+1).padStart(2,'0')}</span><div><h3>{section.title}</h3><p>{section.text}</p></div></section>)}</div>
    {type==='cancellation'&&<section className="policy-reservation-help" aria-labelledby="policy-manage-title"><CalendarClock size={27}/><div><p className="policy-kicker">AN EXISTING RESERVATION</p><h3 id="policy-manage-title">Manage your booking</h3><p>Open your account to view your bookings and available cancellation actions. For an earlier reservation, use the booking reference and secure access details from your confirmation.</p><div><Link className="policy-action" to="/account">My bookings <ArrowUpRight size={16}/></Link><Link className="policy-action policy-action-outline" to="/manage">Find a reservation <ArrowUpRight size={16}/></Link></div></div></section>}
    <footer className="policy-document-footer"><span>ALSO USEFUL</span>{Object.entries(documents).filter(([key])=>key!==type).map(([key,value])=><Link to={'/policies/'+key} key={key}>{value.nav}<ArrowUpRight size={16}/></Link>)}</footer>
   </article>
  </div>
  <section className="policy-return container"><span>Thoughtfully hosted. Personally cared for.</span><Link to="/rooms">Find your room <ArrowRight size={18}/></Link></section>
 </div>;
}
