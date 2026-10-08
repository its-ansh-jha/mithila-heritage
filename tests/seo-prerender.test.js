import test from 'node:test';
import assert from 'node:assert/strict';
import {initialSite} from '../shared/catalog.js';
import {getSeo} from '../frontend/src/seo.js';
import {renderStaticBody} from '../scripts/static-page-content.mjs';

const routes=['/','/rooms',...initialSite.rooms.map(r=>'/rooms/'+r.id),'/restaurant','/banquet','/about','/gallery','/contact'];
const count=(html,pattern)=>(html.match(pattern)||[]).length;

test('each indexable route sends meaningful HTML without JavaScript',()=>{
 for(const route of routes){
  const body=renderStaticBody(route,initialSite);
  assert.equal(count(body,/<h1(?:\s|>)/g),1,route+' requires one H1');
  assert.ok(count(body,/<h2(?:\s|>)/g)>=1,route+' needs subheadings');
  assert.ok(count(body,/<a\s/g)>=8,route+' needs discoverable links');
  assert.ok(count(body,/<p(?:\s|>)/g)>=2,route+' needs readable paragraphs');
  assert.ok(body.includes('<main id="main">'),route+' needs semantic main content');
  assert.ok(body.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim().split(/\s+/).length>=120,route+' needs indexable text');
 }
});
test('homepage exposes real local information and internal navigation',()=>{
 const body=renderStaticBody('/',initialSite);
 assert.match(body,/hotels in Patna/i);
 assert.match(body,/Jayprakash Nagar/i);
 for(const target of ['/rooms','/restaurant','/banquet','/about','/gallery','/contact']){
  assert.ok(body.includes('href="'+target+'"'),target+' should be linked in plain HTML');
 }
 assert.ok(body.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim().split(/\s+/).length>=250);
 assert.equal(getSeo('/',initialSite).title,'Hotel in Patna | Mithila Heritage');
});
test('room and venue prerenders contain the relevant details',()=>{
 for(const room of initialSite.rooms){
  const body=renderStaticBody('/rooms/'+room.id,initialSite);
  assert.ok(body.includes(room.name));
  assert.ok(body.includes(room.image));
 }
 assert.ok(renderStaticBody('/restaurant',initialSite).includes('Restaurant Menu'));
 assert.ok(renderStaticBody('/banquet',initialSite).includes('banquet hall in Patna'));
});
