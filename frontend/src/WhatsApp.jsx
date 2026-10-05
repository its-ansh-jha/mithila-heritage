import React from 'react';
import {MessageCircle,ArrowUpRight} from 'lucide-react';
import {WHATSAPP_DISPLAY,whatsappUrl} from '../../shared/whatsapp';
export function openWhatsApp(message){const url=whatsappUrl(message);window.open(url,'_blank','noopener,noreferrer');return url;}
export function WhatsAppReady({url}){return url?<div className="whatsapp-ready" role="status"><MessageCircle size={22}/><div><strong>Your message is ready.</strong><p>Tap Send in WhatsApp to share it with the hotel. If WhatsApp didn’t open, use the link below.</p><a href={url} target="_blank" rel="noreferrer" className="text-link">Open your message <ArrowUpRight size={16}/></a></div></div>:null;}
export function WhatsAppFloat(){return <a className="whatsapp-float" href={whatsappUrl('Namaste Mithila Heritage! I would like to plan a visit. Please help me with availability.')} target="_blank" rel="noreferrer" aria-label={'Chat with Mithila Heritage on WhatsApp at '+WHATSAPP_DISPLAY}><MessageCircle size={23}/><span>Let’s plan your stay</span></a>;}
