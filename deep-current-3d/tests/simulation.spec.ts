import {test,expect} from '@playwright/test';
import {startMission,execute,tick,bearing,leadFor,range} from '../src/simulation';

test('periscope mast, optical pitch and submarine depth are independent',()=>{
 const g=startMission();
 const initialDepth=g.player.depth;
 execute(g,{type:'SCOPE_PITCH',value:12});
 expect(g.player.scopePitch).toBe(12);
 expect(g.player.depth).toBe(initialDepth);
 execute(g,{type:'MAST',value:0});
 for(let i=0;i<120;i++)tick(g);
 expect(g.player.mast).toBeLessThan(.05);
 expect(g.player.depth).toBe(initialDepth);
 execute(g,{type:'DEPTH',value:95});
 for(let i=0;i<220;i++)tick(g);
 expect(g.player.depth).toBeGreaterThan(58);
 execute(g,{type:'MAST',value:1});
 expect(g.player.mastTarget).toBe(0);
});

test('target geometry supplies a real lead solution and moving torpedo can hit',()=>{
 const g=startMission();
 const freighter=g.ships.find(s=>s.id==='M1')!;
 const initialBearing=bearing(g.player,freighter);
 expect(initialBearing).toBeGreaterThan(70);
 expect(initialBearing).toBeLessThan(80);
 const startRange=range(g.player,freighter);
 const solution=leadFor(g.player,freighter);
 expect(solution).not.toBeNull();
 execute(g,{type:'SCOPE_YAW',value:solution!.bearing});
 execute(g,{type:'FIRE'});
 expect(g.player.torpedoes).toBe(11);
 for(let i=0;i<30*130&&g.hits===0;i++)tick(g);
 expect(g.hits).toBeGreaterThan(0);
 expect(freighter.sunk).toBe(true);
 expect(range(g.player,freighter)).not.toBe(startRange);
});

test('same mission seed and commands produce reproducible snapshots',()=>{
 const a=startMission('first-light',10983),b=startMission('first-light',10983);
 for(const g of [a,b]){
  execute(g,{type:'HEADING',value:60});
  execute(g,{type:'SPEED',value:7});
  execute(g,{type:'DEPTH',value:65});
  for(let i=0;i<300;i++)tick(g);
 }
 expect(a).toEqual(b);
});
