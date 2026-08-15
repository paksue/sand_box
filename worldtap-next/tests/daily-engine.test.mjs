import assert from 'node:assert/strict';
// Minimal localStorage shim for Node.
globalThis.localStorage={m:new Map(),getItem(k){return this.m.get(k)??null},setItem(k,v){this.m.set(k,String(v))},removeItem(k){this.m.delete(k)}};
globalThis.performance={now:()=>1000};
const E=await import('../daily-engine.js');
const a=E.dailySet('2026-08-14'),b=E.dailySet('2026-08-14'),c=E.dailySet('2026-08-15');
assert.deepEqual(a.map(x=>x.id),b.map(x=>x.id),'same date must be deterministic');
assert.equal(a.length,5);assert.deepEqual(a.map(x=>x.category),['City','Flag','Landmark','History','Geography']);
assert.notDeepEqual(a.map(x=>x.id),c.map(x=>x.id),'adjacent dates should normally differ');
for(const q of E.BANK.filter(q=>q.category==='Flag')){
  assert.equal(q.prompt,'Where does this flag belong?','flag prompt must not duplicate the emoji stored in q.flag');
  assert.ok(q.flag,'flag questions must keep their emoji in q.flag');
}
let s=E.initialState('2026-08-14');s=E.recordRound(s,{id:a[0].id,score:150});assert.equal(s.index,1);assert.equal(s.total,150);assert.equal(s.completed,false);
for(let i=1;i<5;i++)s=E.recordRound(s,{id:a[i].id,score:100});assert.equal(s.completed,true);assert.equal(s.total,550);E.saveDay(s,'2026-08-14');assert.equal(E.loadDay('2026-08-14').total,550);
const g=new E.TapGuard();assert.equal(g.canSubmit(),true);g.interaction();assert.equal(g.canSubmit(),false);g.settled();assert.equal(g.canSubmit(),false);
console.log('WorldTap daily engine tests passed');
