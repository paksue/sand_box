import assert from 'node:assert/strict';
import {payment,schedule,simulate,allocations,analyze,breakEven} from './dist/engine.mjs';
import fs from 'node:fs';
const c={balance:340000,rate:.0299,term:27,extra:1000,lump:0,cash:50000,reserve:50000,portfolio:'sp',horizon:12,account:'taxable',mu:.07,sigma:.18,fee:.0005,inflation:.025,cashReturn:.03,incomeTax:.24,gainsTax:.15,divTax:.15,withdrawTax:.24,standard:30000,otherDed:15000,eligible:1,room:7000,access:false,taxOn:true,valuation:'neutral',scenario:'base'};
const near=(a,b,t=.005)=>assert.ok(Math.abs(a-b)<t,`${a} != ${b}`);
// Published Plain Loan Math reference: $340k, 6.75%, 30yr.
near(payment(340000,.0675,360),2205.23);
const ref=schedule({...c,rate:.0675,term:30,horizon:30,extra:0,cash:0,reserve:0},allocations[0]);near(ref.interest,453884.07,.02);near(ref.balance,0);assert.equal(ref.payoff,360);
// Independent closed-form schedule reproduced at every month.
const loan=schedule(c,allocations[4]),i=c.rate/12,p=loan.p;
loan.flows.forEach((f,k)=>near(f.balance,c.balance*Math.pow(1+i,k+1)-p*(Math.pow(1+i,k+1)-1)/i,.001));
// Every monthly household dollar, including final payment leftovers, conserved.
for(const a of allocations){const cc={...c,lump:450000,horizon:30,cash:0,reserve:20000};const s=schedule(cc,a);near(s.initialMort+s.initialInvest+s.initialCash+s.protectedLump,cc.lump);for(const f of s.flows)near(f.spent+f.invest+f.cash,s.p+cc.extra);}
// Equal zero-return and zero-rate budgets yield equal ending wealth.
const zero={...c,rate:0,fee:0,taxOn:false,cashReturn:0,cash:0,reserve:0,lump:10000,horizon:30};const out=allocations.map(a=>simulate(zero,a,Array(30).fill(0)));out.forEach(r=>near(r.wealth,out[0].wealth));near(payment(120000,0,120),1000);
// Guaranteed-rate deterministic equality when investment monthly rate == mortgage monthly rate.
const parity={...c,fee:0,taxOn:false,cash:0,reserve:0,horizon:30};const annual=Math.pow(1+c.rate/12,12)-1;near(simulate(parity,allocations[0],Array(30).fill(annual)).wealth,simulate(parity,allocations[4],Array(30).fill(annual)).wealth,.01);near(breakEven(parity),annual,1e-8);
// Independent FV: contributions invested at month end.
const inv={...zero,rate:.05,horizon:5,lump:12345,extra:456,term:30};const r=.06,monthly=Math.pow(1+r,1/12)-1,res=simulate(inv,allocations[4],Array(5).fill(r));near(res.assets,12345*Math.pow(1+monthly,60)+456*(Math.pow(1+monthly,60)-1)/monthly,.001);
// Reserve shortfall delays investing, no disappearing contribution.
const reserves={...zero,horizon:1,lump:5000,extra:1000,reserve:20000};const rs=schedule(reserves,allocations[4]);near(rs.protectedLump,5000);near(rs.initialInvest,0);assert.ok(rs.flows.every(f=>f.invest===0));
// Traditional gross-up: equal take-home cash, tax on withdrawals.
const trad={...zero,rate:.05,horizon:1,lump:0,extra:1000,taxOn:true,incomeTax:.25,withdrawTax:.25,room:100000,account:'traditional'};near(simulate(trad,allocations[4],[0]).retirement,12000,.01);
// Market histories contiguous and source-backed.
const history=JSON.parse(fs.readFileSync('dist/history.json')).rows;assert.equal(history.length,98);history.forEach((r,i)=>assert.equal(r[0],1928+i));
const started=Date.now();const analysis=analyze(c,history);assert.equal(analysis.views.length,5);for(const v of analysis.views)assert.ok(v.win>=0&&v.win<=1);console.log(JSON.stringify({checks:'passed',publishedPayment:payment(340000,.0675,360),publishedInterest:ref.interest,views:analysis.views.map(v=>({name:v.name,win:v.win,median:v.median})),breakEven:analysis.breakEven,elapsedMs:Date.now()-started},null,2));
// Published deterministic cases from Plain Loan Math, identical inputs.
const pc={...zero,balance:340000,rate:.0675,term:30,extra:250,lump:0,horizon:30};
for(const [r,mort,invest] of [[.045,264460,186766],[.083,305527,372593],[.10,325989,515711]]){near(simulate(pc,allocations[0],Array(30).fill(r)).assets,mort,.51);near(simulate(pc,allocations[4],Array(30).fill(r)).assets,invest,.51);}
const {mortgageYield}=await import('./dist/engine.mjs');near(mortgageYield({...c,taxOn:false}),Math.pow(1+c.rate/12,12)-1,1e-8);
assert.ok(mortgageYield({...c,standard:0,otherDed:0})<mortgageYield({...c,taxOn:false}));
console.log('Published payoff/invest cases and after-tax mortgage equivalent: passed');
