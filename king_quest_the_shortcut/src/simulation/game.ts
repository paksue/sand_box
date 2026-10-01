import {villageWalkPoint} from '../content/villageWalk';
import {play,hintFor} from './puzzles';
import { locations, locationIds, type Location, type Point, type Hotspot } from '../content/world';
export const SAVE_KEY='the-shortcut:moon-bell:v2';
export type Event={at:number;location:Location;actor:string;action:string;target:string;witnesses:string[];result:string};
export type State={version:2;minute:number;location:Location;player:Point;inventory:string[];flags:Record<string,boolean>;values:Record<string,number|string>;memories:Record<string,string[]>;clues:string[];hints:Record<string,number>;events:Event[];provenance:Record<string,{from:string;permission:string;owner:string;returned?:boolean}>;itemLocations:Record<string,string>;message:string;finished:boolean};
export type Action={type:'travel';to:Location}|{type:'interact';id:string;verb:string;item?:string}|{type:'move';point:Point}|{type:'wait';minutes:number}|{type:'hint'};
export function initialState():State{return {version:2,minute:930,location:'village',player:{x:470,y:530},inventory:['sun'],flags:{},values:{},memories:{aldus:['entrusted-key'],bram:[],ysabet:[],brindle:[],sella:[]},clues:[],hints:{},events:[],provenance:{sun:{from:'Aldus',permission:'entrusted',owner:'Crown'}},itemLocations:{thread:'village',mirror:'village',bottle:'village',cake:'village',lantern:'cottage',disc:'chapel',key:'bridge'},message:'Aldus Reed: “The royal road is gone. Take the Briar Road, Mara. This Sun Key must reach the Moon Bell before the ninth evening bell.”',finished:false};}
export function timeLabel(s:State){return `${String(Math.floor(s.minute/60)).padStart(2,'0')}:${String(s.minute%60).padStart(2,'0')}`;}
export function phase(s:State){return s.minute>=1260?'late':s.minute>=1230?'moonrise':s.minute>=1110?'dusk':s.minute>=1050?'golden':'afternoon';}
export function npcStates(s:State){return {ysabet:s.minute>=1050&&s.minute<1080?'gathering':'home',brindle:s.minute>=1155||s.flags.woke?'awake':'asleep',sella:s.minute<1260?'gate':'inside',bram:s.flags.wheel&&s.minute>=1170?'home':'mill'};}
export function visibleHotspots(s:State):Hotspot[]{
const list=locations[s.location].hotspots.filter(h=>!(['thread','mirror','bottle','cake'].includes(h.id)&&s.itemLocations[h.id]!=='village')&&!(h.id==='ysabet'&&npcStates(s).ysabet!=='home')&&!(h.id==='sella'&&npcStates(s).sella!=='gate')&&!(h.id==='bram'&&npcStates(s).bram!=='mill')&&!(h.id==='moths'&&s.minute<1110)&&!(h.id==='fireflies'&&s.minute<1110)&&!(h.id==='postern'&&!s.flags.postern)&&!(h.id==='briars'&&s.minute<1260)&&!(h.id==='lantern'&&s.itemLocations.lantern!=='cottage')&&!(h.id==='mallow'&&s.flags['hen-found'])&&!(h.id==='disc'&&s.flags['disc-taken'])&&!(h.id==='bridge-key'&&s.itemLocations.key!=='bridge'));
if(s.minute>=1320&&!s.finished)list.push({id:'courier',name:'Relief courier',x:570,y:530,description:'A last royal runner has followed the road to find the Sun Key. Time for long work has run out, but the bell can still be rung.',verbs:['Entrust key']});
return list.map(h=>({...h,verbs:h.id==='beam'?['Place','Secure']:h.id==='ledge'&&s.flags.ledge?['Walk']:h.id==='rope'&&s.flags['rope-damaged']?['Pull','Tie']:h.verbs}));}
export function reduce(s:State,a:Action):State{
if(s.finished)return s;
const n:State=structuredClone(s);
if(a.type==='move'){n.player=s.location==='village'?villageWalkPoint(a.point):{x:Math.max(80,Math.min(920,a.point.x)),y:Math.max(490,Math.min(580,a.point.y))};return n;}
if(a.type==='hint'){n.message=hintFor(n);return n;}
if(a.type==='travel'){const h=visibleHotspots(s).find(h=>h.exit===a.to);if(!h||s.minute>=1320)return s;n.location=a.to;n.player={x:470,y:530};n.message=locations[a.to].subtitle;record(n,'travel',a.to,n.message);advance(n,8);return n;}
if(a.type==='wait'){if(s.minute>=1320){n.message='The relief courier waits. There is no time left for a longer task.';return n;}n.message='You wait as the light shifts through the trees.';record(n,'wait','world',n.message);advance(n,Math.max(1,Math.min(30,a.minutes)));return n;}
const h=visibleHotspots(s).find(h=>h.id===a.id);if(!h)return s;
if(a.verb!=='Look'&&a.verb!=='Use'&&!h.verbs?.includes(a.verb))return s;
const result=play(n,h,a.verb,a.item);n.message=result.message;record(n,a.verb,h.id,result.message);if(result.cost)advance(n,result.cost);return n;
}
export const serialize=(s:State)=>JSON.stringify(s);
export function deserialize(raw:string):State{const s=JSON.parse(raw);if(s.version!==2||!locationIds.includes(s.location)||!Number.isInteger(s.minute)||s.minute<930||s.minute>1500||!Array.isArray(s.inventory)||!s.inventory.includes('sun')||!s.flags||!s.values||!s.memories||!s.clues||!s.events||!s.provenance||!s.itemLocations||typeof s.message!=='string')throw Error('A new adventure has begun.');return s;}

export function give(s:State,id:string,from:string,permission='given',owner='Mara') {if(!s.inventory.includes(id))s.inventory.push(id);s.itemLocations[id]='inventory';s.provenance[id]={from,permission,owner};}
export function remember(s:State,npc:string,memory:string){if(!s.memories[npc].includes(memory))s.memories[npc].push(memory);}
export function clue(s:State,text:string){if(!s.clues.includes(text))s.clues.push(text);}
export function witnesses(s:State){const n=npcStates(s);return s.location==='village'?['aldus']:s.location==='mill'&&n.bram==='mill'?['bram']:s.location==='cottage'&&n.ysabet==='home'?['ysabet']:s.location==='bridge'&&n.brindle==='awake'?['brindle']:s.location==='castle'&&n.sella==='gate'?['sella']:[];}
export function record(s:State,action:string,target:string,result:string,actor='Mara'){s.events.push({at:s.minute,location:s.location,actor,action,target,witnesses:witnesses(s),result});}
export function advance(s:State,duration:number){
 const from=s.minute;s.minute+=duration;
 const boundaries:[number,string][]=[[1050,'Ysabet lifts her herb basket and leaves her cottage.'],[1080,'Ysabet returns from gathering dusk-thyme.'],[1110,'Dusk settles. Fireflies kindle; the ferry begins; moonflowers open.'],[1140,'Moonlight reaches the old inscriptions.'],[1155,'Brindle wakes beneath his bridge.'],[1230,'The moon rises. Briar stirs along the castle road.'],[1260,'The ninth evening bell sounds. Captain Sella bars the main gate.'],[1320,'A royal relief courier finds Mara. The key can still be entrusted to the last runner.']];
 for(const [at,text] of boundaries)if(from<at&&s.minute>=at){s.events.push({at,location:s.location,actor:'world',action:'boundary',target:String(at),witnesses:[],result:text});if(at===1080&&s.itemLocations.lantern==='inventory'&&!s.flags.permission){remember(s,'ysabet','lantern-missing');}if((s.location==='cottage'&&(at===1050||at===1080))||(s.location==='bridge'&&at===1155)||at===1110||at===1260||at===1320)s.message+=' '+text;}
 if(s.location==='cottage'&&npcStates(s).ysabet==='home'&&s.inventory.includes('lantern')&&!s.flags.permission){remember(s,'ysabet','saw-lantern-with-mara');}
 if(s.location==='bridge'&&npcStates(s).brindle==='awake'&&s.inventory.includes('key'))remember(s,'brindle','saw-key-with-mara');
}
