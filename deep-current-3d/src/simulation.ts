/** Ground-truth submarine simulation. All positions are metres: X east, Z south, positive heading clockwise from north. */
export const KNOT = 0.514444;
export const RAD = Math.PI / 180;
export const clamp = (v:number, lo:number, hi:number) => Math.min(hi, Math.max(lo, v));
export const norm = (v:number) => (v % 360 + 360) % 360;
export const signedAngle = (a:number,b:number) => ((a-b+540)%360)-180;
export const bearing = (a:Vec2,b:Vec2) => norm(Math.atan2(b.x-a.x,-(b.z-a.z))/RAD);
export const range = (a:Vec2,b:Vec2) => Math.hypot(a.x-b.x,a.z-b.z);
export type Vec2 = {x:number; z:number};
export type Ship = Vec2 & {id:string; name:string; kind:'merchant'|'escort'; heading:number; speed:number; length:number; health:number; tonnage:number; sunk:boolean; search:number; cooldown:number; wake:number};
export type Torpedo = Vec2 & {heading:number; speed:number; age:number; tube:number};
export type Impact = Vec2 & {age:number; type:'torpedo'|'charge'};
export type Player = Vec2 & {heading:number; orderedHeading:number; speed:number; orderedSpeed:number; depth:number; orderedDepth:number; hull:number; battery:number; torpedoes:number; tubes:number[]; quiet:boolean; mast:number; mastTarget:number; scopeYaw:number; scopePitch:number; zoom:number; gyro:number; selectedTube:number};
export type Mission = {id:string; name:string; subtitle:string; time:string; objective:number; escortSkill:number; description:string};
export type Game = {player:Player; ships:Ship[]; weapons:Torpedo[]; impacts:Impact[]; mission:Mission; elapsed:number; clockMinutes:number; paused:boolean; speedFactor:number; status:'running'|'won'|'lost'|'finished'; tonnage:number; shots:number; hits:number; alerts:number; logs:string[]; seed:number; nextId:number; selectedShip:string; station:'scope'|'map'|'sonar'|'damage'; missionEnded:boolean; rng:number};
export const MISSIONS:Mission[]=[
 {id:'first-light',name:'FIRST LIGHT',subtitle:'Intercept a merchant convoy at dawn',time:'05:42',objective:6200,escortSkill:0.6,description:'Three freighters are passing across your bow. Find the solution, launch, then evade the destroyer.'},
 {id:'black-water',name:'BLACK WATER',subtitle:'Undercover at midnight',time:'01:16',objective:5000,escortSkill:0.78,description:'A dim night horizon. Sound matters more than sight; survive an aggressive escort search.'},
 {id:'iron-ring',name:'IRON RING',subtitle:'A heavily defended transport group',time:'06:04',objective:12000,escortSkill:1,description:'High-value ships, two alert escorts, limited time. Patience and stealth are rewarded.'}
];
function headingVector(heading:number,speed=1){return {x:Math.sin(heading*RAD)*speed,z:-Math.cos(heading*RAD)*speed}}
function approach(a:number,b:number,max:number){return a+clamp(b-a,-max,max)}
function turn(a:number,b:number,max:number){return norm(a+clamp(signedAngle(b,a),-max,max))}
function random(g:Game){let x=g.rng|0;x^=x<<13;x^=x>>>17;x^=x<<5;g.rng=x;return (x>>>0)/4294967296}
export function log(g:Game,message:string){g.logs.unshift(message);g.logs.length=Math.min(12,g.logs.length)}
export function startMission(id:string='first-light',seed=19430312):Game{
 const mission=MISSIONS.find(m=>m.id===id)||MISSIONS[0];
 const p:Player={x:0,z:0,heading:75,orderedHeading:75,speed:3.5,orderedSpeed:3.5,depth:45,orderedDepth:45,hull:100,battery:98,torpedoes:12,tubes:[0,0,0,0],quiet:false,mast:1,mastTarget:1,scopeYaw:75,scopePitch:0,zoom:3.2,gyro:0,selectedTube:0};
 const ships:Ship[]=[];
 for(let i=0;i<3;i++){ships.push({id:'M'+(i+1),name:['AKAGI MARU','HOKUTO MARU','SHINSEI MARU'][i],kind:'merchant',x:1730+i*520,z:-460+(i%2)*165,heading:0,speed:9.2+i*.45,length:[146,131,167][i],health:100,tonnage:[6800,5300,7900][i],sunk:false,search:0,cooldown:0,wake:0})}
 ships.push({id:'E1',name:'ESCORT ONE',kind:'escort',x:2450,z:-930,heading:250,speed:15,length:107,health:100,tonnage:1650,sunk:false,search:0,cooldown:24,wake:0});
 if(mission.escortSkill>=1)ships.push({id:'E2',name:'ESCORT TWO',kind:'escort',x:1550,z:-1450,heading:235,speed:16,length:100,health:100,tonnage:1650,sunk:false,search:0,cooldown:30,wake:0});
 return {player:p,ships,weapons:[],impacts:[],mission,elapsed:0,clockMinutes:mission.time==='01:16'?76:mission.time==='06:04'?364:342,paused:false,speedFactor:1,status:'running',tonnage:0,shots:0,hits:0,alerts:0,logs:['CONVOY REPORTED. MAKE READY FOR ACTION.'],seed,nextId:1,selectedShip:'M1',station:'scope',missionEnded:false,rng:seed};
}
export type Action = {type:'HEADING'|'SPEED'|'DEPTH'|'SCOPE_YAW'|'SCOPE_PITCH'|'ZOOM'|'GYRO'|'MAST'|'TUBE'|'FACTOR'; value:number} | {type:'FIRE'|'SOLVE'|'QUIET'|'PAUSE'|'REPAIR'} | {type:'STATION'; value:Game['station']};
export function execute(g:Game,c:Action){
 const p=g.player;
 if(c.type==='STATION'){g.station=c.value;return}
 if(c.type==='PAUSE'){g.paused=!g.paused;return}
 if(g.status!=='running')return;
 switch(c.type){
 case 'HEADING':p.orderedHeading=norm(c.value);break;
 case 'SPEED':p.orderedSpeed=clamp(c.value,0,20);break;
 case 'DEPTH':p.orderedDepth=clamp(c.value,0,400);if(p.orderedDepth>55)p.mastTarget=0;break;
 case 'SCOPE_YAW':p.scopeYaw=norm(c.value);break;
 case 'SCOPE_PITCH':p.scopePitch=clamp(c.value,-21,23);break;
 case 'ZOOM':p.zoom=clamp(c.value,1,6);break;
 case 'GYRO':p.gyro=clamp(c.value,-55,55);break;
 case 'MAST':if(c.value>0&&p.depth>58){log(g,'TOO DEEP — RISE TO PERISCOPE DEPTH FIRST');break}p.mastTarget=clamp(c.value,0,1);log(g,c.value>0?'RAISING PERISCOPE MAST':'LOWERING PERISCOPE MAST');break;
 case 'TUBE':p.selectedTube=clamp(Math.round(c.value),0,3);break;
 case 'FACTOR':g.speedFactor=[1,4,12].includes(c.value)?c.value:1;break;
 case 'QUIET':p.quiet=!p.quiet;if(p.quiet)p.orderedSpeed=Math.min(3,p.orderedSpeed);log(g,p.quiet?'SILENT RUNNING':'NORMAL RUNNING');break;
 case 'REPAIR':p.hull=clamp(p.hull+6,0,100);log(g,'DAMAGE PARTY REPORTS REPAIRS');break;
 case 'SOLVE':{const target=g.ships.find(s=>s.id===g.selectedShip&&!s.sunk);if(target){const sol=leadFor(p,target);if(sol){p.gyro=clamp(signedAngle(sol.bearing,p.scopeYaw),-55,55);log(g,'TDC LEAD SOLUTION '+sol.bearing.toFixed(1)+'°')}}break}
 case 'FIRE':{
  const tube=p.selectedTube;
  if(p.torpedoes<=0||p.tubes[tube]>0){log(g,'TUBE '+(tube+1)+' UNAVAILABLE');break}
  if(p.depth>95){log(g,'TOO DEEP TO FIRE');break}
  const h=norm(p.scopeYaw+p.gyro);
  g.weapons.push({x:p.x,z:p.z,heading:h,speed:43,age:0,tube});
  p.tubes[tube]=28;p.torpedoes--;g.shots++;g.alerts=1;g.speedFactor=1;
  log(g,'TUBE '+(tube+1)+' — TORPEDO AWAY, BEARING '+h.toFixed(0)+'°');break;
 }
 }}
export function leadFor(from:Vec2,ship:Ship,torpedoSpeed=43):{bearing:number,seconds:number}|null{
 const shipVel=headingVector(ship.heading,ship.speed*KNOT);
 const r={x:ship.x-from.x,z:ship.z-from.z};const v=torpedoSpeed*KNOT;
 const a=shipVel.x*shipVel.x+shipVel.z*shipVel.z-v*v,b=2*(r.x*shipVel.x+r.z*shipVel.z),c=r.x*r.x+r.z*r.z;
 const d=b*b-4*a*c;if(d<0||Math.abs(a)<1e-10)return null;
 const roots=[(-b+Math.sqrt(d))/(2*a),(-b-Math.sqrt(d))/(2*a)].filter(t=>t>0).sort((x,y)=>x-y);const t=roots[0];
 if(!Number.isFinite(t))return null;
 return {bearing:norm(Math.atan2(r.x+shipVel.x*t,-(r.z+shipVel.z*t))/RAD),seconds:t};
}
export function tick(g:Game,dt=1/30){
 if(g.paused||g.status!=='running')return;
 const p=g.player;g.elapsed+=dt;g.clockMinutes+=dt/60;
 p.heading=turn(p.heading,p.orderedHeading,3.5*dt);
 p.speed=approach(p.speed,p.quiet?Math.min(3,p.orderedSpeed):p.orderedSpeed,1.8*dt);
 p.depth=approach(p.depth,p.orderedDepth,8.0*dt);
 if(p.depth>58)p.mastTarget=0;
 p.mast=approach(p.mast,p.mastTarget,0.33*dt);
 const v=headingVector(p.heading,p.speed*KNOT);p.x+=v.x*dt;p.z+=v.z*dt;
 p.battery=clamp(p.battery-(p.depth>15?(.013+.026*(p.speed/13)**2):-.008)*dt,0,100);
 for(let i=0;i<4;i++)p.tubes[i]=Math.max(0,p.tubes[i]-dt);
 for(const s of g.ships){
  if(s.sunk)continue;
  if(s.kind==='escort'&&g.alerts){
   const d=range(s,p);s.heading=turn(s.heading,bearing(s,p)+(random(g)-.5)*(p.quiet?36:12),g.mission.escortSkill*2*dt);
   s.speed=17+g.mission.escortSkill*4;s.cooldown-=dt;
   if(d<530&&s.cooldown<=0){s.cooldown=14+random(g)*10;g.impacts.push({x:p.x+(random(g)-.5)*145,z:p.z+(random(g)-.5)*145,age:0,type:'charge'});
    if(d<185&&random(g)>.4){p.hull=clamp(p.hull-(12+random(g)*14),0,100);log(g,'DEPTH CHARGE — HULL DAMAGE');}
    else log(g,'DEPTH CHARGES — CLOSE ABOARD');g.speedFactor=1;
   }
  }
  const d=headingVector(s.heading,s.speed*KNOT);s.x+=d.x*dt;s.z+=d.z*dt;s.wake+=dt;
 }
 for(const t of g.weapons){
  const v=headingVector(t.heading,t.speed*KNOT);t.x+=v.x*dt;t.z+=v.z*dt;t.age+=dt;
  for(const s of g.ships){if(s.sunk)continue;
   if(range(t,s)<Math.max(19,s.length*.32)){
    s.health-=110;t.age=1000;g.hits++;g.impacts.push({x:s.x,z:s.z,age:0,type:'torpedo'});log(g,'IMPACT — '+s.name);
    if(s.health<=0){s.sunk=true;g.tonnage+=s.tonnage;log(g,s.name+' SINKING · '+s.tonnage+' GRT')}break
   }
  }
 }
 g.weapons=g.weapons.filter(t=>t.age<270);
 g.impacts.forEach(i=>i.age+=dt);g.impacts=g.impacts.filter(i=>i.age<7);
 if(g.alerts)g.alerts=Math.max(0,g.alerts-dt/(p.quiet?110:150));
 if(p.hull<=0){g.status='lost';log(g,'SUBMARINE LOST')}
 else if(g.tonnage>=g.mission.objective&&!g.alerts){g.status='won';log(g,'MISSION COMPLETE — ESCAPED ENEMY ESCORTS')}
 else if(g.elapsed>1600){g.status=g.tonnage>=g.mission.objective?'won':'finished';log(g,'PATROL RECALLED')}
}
export function contacts(g:Game){return g.ships.filter(s=>!s.sunk).map(s=>({id:s.id,name:s.name,type:s.kind,bearing:bearing(g.player,s),range:range(g.player,s),speed:s.speed})).sort((a,b)=>a.range-b.range)}
export function fmtDeg(v:number){return Math.round(norm(v)).toString().padStart(3,'0')+'°'}
export function clock(g:Game){const h=Math.floor(g.clockMinutes/60)%24;const m=Math.floor(g.clockMinutes%60);return String(h).padStart(2,'0')+':'+String(m).padStart(2,'0')}
