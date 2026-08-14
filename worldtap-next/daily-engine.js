// WorldTap Daily Engine v1 — deterministic daily sets, persistence, streaks, tap guard.
export const ENGINE_VERSION = 1;
export const ROUNDS = 5;
export const TAP_GUARD_MS = 420;

// Curated starter bank. Each day is assembled with one item from each category.
export const BANK = [
 ['City','Nairobi','Where is Nairobi?',[36.8219,-1.2921],'🇰🇪','Africa'],['City','Kyoto','Where is Kyoto?',[135.7681,35.0116],'🇯🇵','Asia'],['City','Reykjavik','Where is Reykjavik?',[-21.9426,64.1466],'🇮🇸','Europe'],['City','Buenos Aires','Where is Buenos Aires?',[-58.3816,-34.6037],'🇦🇷','Americas'],['City','Marrakesh','Where is Marrakesh?',[-7.9811,31.6295],'🇲🇦','Africa'],['City','Singapore','Where is Singapore?',[103.8198,1.3521],'🇸🇬','Asia'],
 ['Flag','Laos','🇱🇦 Where does this flag belong?',[102.6,17.97],'🇱🇦','Asia'],['Flag','Uruguay','🇺🇾 Where does this flag belong?',[-56.1645,-34.9011],'🇺🇾','Americas'],['Flag','Nepal','🇳🇵 Where does this flag belong?',[84.124,28.3949],'🇳🇵','Asia'],['Flag','Ghana','🇬🇭 Where does this flag belong?',[-1.0232,7.9465],'🇬🇭','Africa'],['Flag','Estonia','🇪🇪 Where does this flag belong?',[25.0136,58.5953],'🇪🇪','Europe'],['Flag','New Zealand','🇳🇿 Where does this flag belong?',[174.886, -40.9006],'🇳🇿','Oceania'],
 ['Landmark','Machu Picchu','Find Machu Picchu.',[-72.545,-13.1631],'🇵🇪','Americas'],['Landmark','Petra','Find Petra.',[35.4444,30.3285],'🇯🇴','Asia'],['Landmark','Angkor Wat','Find Angkor Wat.',[103.867,13.4125],'🇰🇭','Asia'],['Landmark','Christ the Redeemer','Find Christ the Redeemer.',[-43.2105,-22.9519],'🇧🇷','Americas'],['Landmark','Mount Fuji','Find Mount Fuji.',[138.7274,35.3606],'🇯🇵','Asia'],['Landmark','Great Pyramid of Giza','Find the Great Pyramid of Giza.',[31.1342,29.9792],'🇪🇬','Africa'],
 ['History','Cape Canaveral','Where did Apollo 11 launch?',[-80.604,28.6084],'🇺🇸','Americas'],['History','Sarajevo','Where was Archduke Franz Ferdinand assassinated?',[18.4131,43.8563],'🇧🇦','Europe'],['History','Hiroshima','Where was the first atomic bomb used in war?',[132.4553,34.3853],'🇯🇵','Asia'],['History','Waterloo','Where was Napoleon decisively defeated in 1815?',[4.4213,50.6806],'🇧🇪','Europe'],['History','Philadelphia','Where was the U.S. Declaration of Independence adopted?',[-75.1652,39.9526],'🇺🇸','Americas'],['History','Constantinople / Istanbul','Where did the Byzantine Empire fall in 1453?',[28.9784,41.0082],'🇹🇷','Europe'],
 ['Geography','Strait of Hormuz','Find the Strait of Hormuz.',[56.25,26.55],'','Asia'],['Geography','Panama Canal','Find the Panama Canal.',[-79.68,9.08],'🇵🇦','Americas'],['Geography','Suez Canal','Find the Suez Canal.',[32.35,30.45],'🇪🇬','Africa'],['Geography','Strait of Gibraltar','Find the Strait of Gibraltar.',[-5.6,35.96],'','Europe'],['Geography','Lake Victoria','Find Lake Victoria.',[33.0,-1.0],'','Africa'],['Geography','Bering Strait','Find the Bering Strait.',[-169.0,65.8],'','Arctic']
].map((x,i)=>({id:`q${i+1}`,category:x[0],name:x[1],prompt:x[2],coords:x[3],flag:x[4],region:x[5]}));

const cats=['City','Flag','Landmark','History','Geography'];
export function dateKey(d=new Date()){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function hash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function mulberry32(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
export function dailySet(key=dateKey()){const rnd=mulberry32(hash(`worldtap:${key}:v${ENGINE_VERSION}`));return cats.map(cat=>{const pool=BANK.filter(q=>q.category===cat);return pool[Math.floor(rnd()*pool.length)]})}
const storageKey=k=>`worldtap.daily.${k}.v${ENGINE_VERSION}`;
export function loadDay(key=dateKey()){try{return JSON.parse(localStorage.getItem(storageKey(key)))||null}catch{return null}}
export function saveDay(state,key=dateKey()){localStorage.setItem(storageKey(key),JSON.stringify({...state,key,updatedAt:Date.now()}))}
export function clearDay(key=dateKey()){localStorage.removeItem(storageKey(key))}
export function initialState(key=dateKey()){return{key,index:0,total:0,results:[],completed:false,startedAt:Date.now()}}
export function recordRound(state,result){const results=[...state.results,result];return{...state,results,total:results.reduce((n,r)=>n+(r.score||0),0),index:Math.min(results.length,ROUNDS),completed:results.length>=ROUNDS}}
export function recentHistory(days=30,now=new Date()){const out=[];for(let i=0;i<days;i++){const d=new Date(now);d.setDate(d.getDate()-i);const key=dateKey(d),s=loadDay(key);if(s?.completed)out.push({key,total:s.total})}return out}
export function streak(now=new Date()){let n=0;for(let i=0;i<366;i++){const d=new Date(now);d.setDate(d.getDate()-i);if(loadDay(dateKey(d))?.completed)n++;else if(i>0||!loadDay(dateKey(d)))break}return n}
export function sevenDayAverage(now=new Date()){const h=recentHistory(7,now);return h.length?Math.round(h.reduce((n,x)=>n+x.total,0)/h.length):0}
export class TapGuard{constructor(ms=TAP_GUARD_MS){this.ms=ms;this.blockedUntil=0;this.moved=false}interaction(){this.blockedUntil=performance.now()+this.ms;this.moved=true}settled(){this.moved=false}canSubmit(){return !this.moved&&performance.now()>=this.blockedUntil}}
