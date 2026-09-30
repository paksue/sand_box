import {useSyncExternalStore} from 'react';
import {initialState,reduce,serialize,deserialize,SAVE_KEY,type Action,type State} from './game';
let state=initialState();let status='';
try{const raw=localStorage.getItem(SAVE_KEY);if(raw)state=deserialize(raw);else if(localStorage.getItem('the-shortcut:save'))status='A new adventure has begun.';}catch{status='A new adventure has begun.';}
const listeners=new Set<()=>void>();
const publish=()=>listeners.forEach(f=>f());
export const snapshot=()=>state;
export function save(){try{localStorage.setItem(SAVE_KEY,serialize(state));status='Adventure saved';}catch{status='This browser could not save the adventure.';}publish();}
export function dispatch(a:Action){state=reduce(state,a);save();}
export function reset(){state=initialState();save();}
export function reload(){try{state=deserialize(localStorage.getItem(SAVE_KEY)||'');status='Adventure restored';}catch{status='No valid adventure to restore.';}publish();}
export const saveStatus=()=>status;
export const useGame=()=>useSyncExternalStore(fn=>{listeners.add(fn);return ()=>{listeners.delete(fn);};},snapshot);
window.addEventListener('pagehide',save);
if(new URLSearchParams(location.search).has('debug'))Object.assign(window,{moonBell:{snapshot,dispatch,replace:(s:State)=>{state=deserialize(serialize(s));publish();}}});
