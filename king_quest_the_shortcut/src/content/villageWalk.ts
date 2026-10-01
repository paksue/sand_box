import type {Point} from './world';
// Floor boundary registered to the workshop steps and cobbled lane. Walls,
// counter, river and distant scenery are outside this walkable foreground.
const edge=[[80,480],[140,390],[300,390],[370,465],[520,490],[920,490]];
export function villageWalkPoint(p:Point):Point{
 const x=Math.max(80,Math.min(920,p.x));let floor=490;
 for(let i=1;i<edge.length;i++){const [ax,ay]=edge[i-1],[bx,by]=edge[i];if(x<=bx){floor=ay+(by-ay)*(x-ax)/(bx-ax);break;}}
 return {x,y:Math.max(floor,Math.min(580,p.y))};
}

export type MaraDirection='side'|'front'|'back';
export const villageDepth=(y:number)=>.98+(y-490)/650;
export function villageDirection(dx:number,dy:number):MaraDirection{
 return Math.abs(dy)>Math.abs(dx)*.65?(dy<0?'back':'front'):'side';
}
// Visibility graph follows the stair lip instead of dragging a straight-line
// tween through the workshop wall or clamping it sideways on every frame.
export function villageWalkPath(from:Point,to:Point):Point[]{
 const start=villageWalkPoint(from),target=villageWalkPoint(to);
 const nodes=[start,target,...edge.map(([x,y])=>({x,y:y+3}))];
 const clear=(a:Point,b:Point)=>{const n=Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)/4);for(let i=0;i<=n;i++){const t=n?i/n:0,p={x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t};if(villageWalkPoint(p).y>p.y+.1)return false;}return true;};
 const costs=nodes.map(()=>Infinity),previous=nodes.map(()=>-1),visited=new Set<number>();costs[0]=0;
 while(visited.size<nodes.length){let at=-1;for(let i=0;i<nodes.length;i++)if(!visited.has(i)&&(at<0||costs[i]<costs[at]))at=i;if(at<0||!Number.isFinite(costs[at]))break;if(at===1)break;visited.add(at);for(let j=0;j<nodes.length;j++){if(visited.has(j)||!clear(nodes[at],nodes[j]))continue;const cost=costs[at]+Math.hypot(nodes[j].x-nodes[at].x,nodes[j].y-nodes[at].y);if(cost<costs[j]){costs[j]=cost;previous[j]=at;}}}
 if(!Number.isFinite(costs[1]))return [start,{x:start.x,y:580},{x:target.x,y:580},target];
 const path:Point[]=[];for(let at=1;at>=0;at=previous[at])path.unshift(nodes[at]);return path;
}
