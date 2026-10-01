import {test} from 'node:test';
import assert from 'node:assert/strict';
import {villageWalkPath,villageWalkPoint,villageDirection} from '../src/content/villageWalk';
test('workshop stair paths stay on the registered floor',()=>{
 for(const from of [{x:145,y:395},{x:310,y:400},{x:730,y:530}])for(const to of [{x:80,y:580},{x:915,y:535},{x:175,y:395}]){
  const path=villageWalkPath(from,to);assert.deepEqual(path.at(-1),villageWalkPoint(to));
  for(let i=1;i<path.length;i++)for(let k=0;k<=50;k++){const t=k/50,a=path[i-1],b=path[i],p={x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t};assert.ok(villageWalkPoint(p).y<=p.y+.11);}
 }
});
test('walking toward and away uses front and back rather than a side pose',()=>{
 assert.equal(villageDirection(0,-35),'back');assert.equal(villageDirection(0,35),'front');assert.equal(villageDirection(60,10),'side');
});
