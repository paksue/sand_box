const missions = [
  {
    id:"ordinary", kicker:"MISSION 01 · ORDINARY RISK", title:"People Aren’t You", desc:"The world does not require villains to create trouble. Learn opportunism, curiosity, carelessness, and boundary testing.",
    cases:[
      c("password-box","The Password Box","Low drama, real risk","You keep a small box in your room with old recovery codes and passwords. A cousin your age is visiting. You trust them and leave the box on your desk while you go downstairs.","Later, the box looks exactly where you left it. Nothing seems missing.",[
        "No problem. If nothing is missing, nothing happened.",
        "Move sensitive information somewhere secured. You do not need to accuse anyone.",
        "Ask your cousin whether they opened it and judge their face."
      ],1,"Security should not depend on every nearby person making the choice you hope they make.",["opportunity","access","privacy"],"Your cousin may never have touched it. The lesson is about removing unnecessary opportunity, not assuming guilt.","Secure the information; change anything especially sensitive if exposure is plausible.","Ask: Why do decent people sometimes snoop even when there is little to gain?"),
      c("phone-borrow","Can I Use Your Phone?","Everyday boundary","A classmate says their phone died and asks to use yours to call a parent. You hand over your unlocked phone.","They walk a few steps away and start tapping for longer than a normal call would take.",[
        "Let them finish. Taking the phone back would be rude.",
        "Walk over, ask for it back, and offer to place the call yourself.",
        "Grab it and accuse them of stealing information."
      ],1,"You can tighten access without turning uncertainty into an accusation.",["access","boundary","calibration"],"They might simply be looking up the number or struggling with the call.","Keep control of unlocked devices; offer the narrow access actually needed.","Discuss the difference between being kind and giving broad access."),
      c("desk-drawer","The Desk Drawer","Low stakes test","At a summer job, another teen opens a coworker’s desk drawer while the coworker is away and says, ‘Relax, I’m just looking for a pen.’", "There are pens sitting in a cup on top of the desk.",[
        "It is harmless because the object they want is small.",
        "Notice the unnecessary boundary crossing and avoid leaving private things exposed around them.",
        "Report them as a thief immediately."
      ],1,"Small unnecessary violations can tell you how someone treats boundaries when nobody is watching.",["boundary test","opportunity","pattern"],"They may be thoughtless rather than malicious.","Update your trust gradually based on repeated behavior.","Would your judgment change if they apologized immediately? If it happened three times?"),
      c("secret-screenshot","The Screenshot","Social risk","A friend tells you something embarrassing about another student and says, ‘Don’t tell anybody.’", "Then she shows you a screenshot of that student’s private message.",[
        "Listen; you are not the one who took the screenshot.",
        "Recognize that someone who casually exposes another person’s private message may do the same with yours.",
        "Tell everyone she cannot be trusted."
      ],1,"How people handle other people’s privacy is evidence about how they may handle yours.",["gossip","privacy","reputation"],"She may believe she has a legitimate reason to share it. Context matters.","Share less sensitive information until her behavior earns more trust.","Ask what kinds of secrets are appropriate to keep and what kinds require telling an adult."),
      c("forgotten-wallet","The Wallet","Calibration case","You leave your wallet at a friend’s house. The next morning your friend texts you immediately: ‘You forgot this. I put it in my desk so my little brother wouldn’t mess with it.’", "Everything is still inside when you get it back.",[
        "Be suspicious because your friend had access to your wallet.",
        "Treat the protective behavior as positive evidence while still avoiding leaving valuables around.",
        "Count the money in front of them to see whether they act nervous."
      ],1,"Good judgment notices positive evidence too. Caution is not the same thing as distrust.",["calibration","trust","evidence"],"The straightforward explanation is also the best-supported one here: your friend protected your property.","Thank them and improve your own habit of keeping track of valuables.","Why is it important that some cases have innocent outcomes?"),
    ]
  },
  {
    id:"manipulation", kicker:"MISSION 02 · SOCIAL LEVERS", title:"How People Move You", desc:"Spot pressure without pretending you can read minds: urgency, guilt, pity, flattery, secrecy, and repeated small asks.",
    cases:[
      c("midnight-favor","Do It Tonight","Pressure","A friend messages at 11:40 p.m.: ‘I need you to send me your completed assignment. Please. If I fail this, my parents will destroy me.’", "When you hesitate: ‘Why are you making this into such a big deal? I’d do it for you.’",[
        "Send it. A real friend helps in an emergency.",
        "Offer help that does not require handing over your work, and refuse the urgent demand.",
        "Tell them they are a manipulator and block them."
      ],1,"Urgency + guilt can narrow your thinking. You can help without accepting the demanded solution.",["urgency","guilt","reciprocity"],"The friend may truly be panicking rather than deliberately manipulating you.","Slow the decision and offer a safer form of help.","Can someone use manipulative pressure without consciously planning to manipulate?"),
      c("mature-compliment","You’re So Mature","Flattery","An older coworker repeatedly tells a 16-year-old, ‘You’re way more mature than people your age. Talking to you is different.’", "They begin asking about family rules and whether her parents monitor where she goes.",[
        "It proves they respect her intelligence.",
        "Treat the combination of flattery and questions about supervision as a reason for stronger boundaries.",
        "Assume every older coworker who gives compliments is dangerous."
      ],1,"Flattery can be sincere, but when it is paired with attempts to map supervision or boundaries, the pattern matters more than the compliment.",["flattery","information gathering","boundary"],"An older coworker may simply be friendly. One compliment is not a diagnosis.","Keep conversations public and do not provide unnecessary details about when you are isolated or unsupervised.","What additional behavior would increase or decrease your concern?"),
      c("loan-pity","Nobody Else Will Help","Pity","A friend asks to borrow $120 and says, ‘You’re literally the only person I can trust. Please don’t ask what it’s for.’", "When you ask when they can repay you, they start crying and say your questions prove you do not care.",[
        "Give the money because asking more questions is cruel.",
        "Care about the distress but keep the boundary: no money without enough information and a plan.",
        "Publicly warn everyone that the friend is a scammer."
      ],1,"Another person’s distress does not automatically determine what you must do.",["pity","secrecy","financial access"],"The distress may be genuine. Genuine distress and a bad request can coexist.","Separate emotional support from financial access.","How can you say no without humiliating someone?"),
      c("tiny-favors","Just One More Thing","Escalation","A teammate first asks you to cover one small task. Then another. Then asks you to lie to the coach about why their part is unfinished.", "They say, ‘Come on, you already helped me this far.’",[
        "Keep going because stopping now makes your earlier help pointless.",
        "Notice escalation and stop at the first request that violates your own rule.",
        "Never help teammates again."
      ],1,"Past cooperation does not create an obligation to accept a bigger or different request.",["escalation","commitment","boundary"],"The teammate may be disorganized rather than calculating.","Re-evaluate each request on its own merits.","Where should the boundary have been drawn in this sequence?"),
      c("surprise-party","Keep This Secret","Calibration case","Your sister’s friend says, ‘Do not tell her we’re meeting Saturday. We’re planning a surprise birthday dinner.’", "They show you the group reservation and ask about her favorite dessert.",[
        "Secrecy itself proves something bad is happening.",
        "This secrecy has a plausible, limited purpose with corroborating evidence; treat it differently from secrecy used to isolate or control.",
        "Tell your sister immediately because secrets are always unsafe."
      ],1,"A warning sign is context, not a magic rule. Ask what the secrecy is protecting and who benefits.",["calibration","secrecy","verification"],"The evidence strongly supports an ordinary surprise plan.","Keep the harmless surprise while remaining alert if the request changes into something unsafe.","Compare protective privacy, harmless secrecy, and coercive secrecy."),
    ]
  },
  {
    id:"relationships", kicker:"MISSION 03 · FRIENDS & DATING", title:"When Closeness Becomes Control", desc:"Practice the difference between affection and possession, concern and monitoring, intimacy and forced access.",
    cases:[
      c("location-share","Share Your Location","Dating pressure","Someone you are dating asks for permanent location sharing: ‘Couples who trust each other have nothing to hide.’", "When you suggest sharing only when meeting up, they become angry and demand your phone.",[
        "Hand over the phone to prove there is nothing to hide.",
        "Keep the boundary. Trust does not require unlimited surveillance or device access.",
        "Assume the person is definitely abusive from this one incident."
      ],1,"A healthy relationship can tolerate a reasonable no. Anger at losing access is important information.",["monitoring","guilt","access"],"Some couples mutually choose location sharing. The concern is coercion, not the feature itself.","Keep device and account access voluntary; talk to a trusted person if monitoring escalates.","What would mutual, non-coercive location sharing look like?"),
      c("friend-isolation","She’s Bad for You","Social control","A close friend says another friend is ‘toxic’ and wants you to stop seeing her.", "When you ask for examples, your close friend gives only vague answers and gets upset whenever you spend time with anyone else.",[
        "Cut the other friend off because your closest friend knows you best.",
        "Ask for concrete behavior, keep multiple relationships, and judge the evidence yourself.",
        "End the close friendship immediately."
      ],1,"Isolation becomes easier when one person controls your information about everyone else.",["isolation","jealousy","information control"],"Your close friend might have noticed a real problem but be explaining it badly.","Preserve independent relationships and verify specific claims.","How can jealousy and legitimate concern look similar at first?"),
      c("instant-soulmate","Three Days In","Rapid intimacy","You meet someone online through mutual friends. After three days they say, ‘I’ve never connected with anyone like this. You’re the only person I can really talk to.’", "They want hours of private messaging every night and get hurt if you are unavailable.",[
        "Match their intensity so they know the feeling is mutual.",
        "Slow the pace. Strong feelings can be real, but knowledge and trust need time.",
        "Block them because fast attraction is always manipulation."
      ],1,"Intensity is not the same thing as intimacy. Time gives you data that chemistry cannot.",["rapid intimacy","attention","pace"],"Some people genuinely attach quickly. The safer response is slower pacing, not automatic condemnation.","Keep routines, friends, sleep, and boundaries while the relationship develops.","What information about a person can only be learned over time?"),
      c("photo-pressure","If You Trust Me","Sexual boundary","Someone you like asks for a private sexual photo and says, ‘I would never show anyone. Don’t you trust me?’", "When you say no, they offer to send one first so you will ‘owe’ them nothing.",[
        "Agree because they offered equal risk.",
        "Keep the no. Another person taking a risk does not obligate you to take the same risk.",
        "Send something less revealing as a compromise."
      ],1,"Reciprocity can be used to create pressure. Digital material can be copied, forwarded, altered, or used for coercion after a relationship changes.",["sexual pressure","reciprocity","digital access"],"The person may sincerely believe they will keep it private. Sincere promises cannot eliminate the technical risk.","Do not create or send sexual images under pressure; if someone threatens you over images, involve a trusted adult and report the account.","Why can a promise be genuine and still fail to make a situation safe?"),
      c("ride-home","The Ride Home","Protective behavior","At a party, a friend notices you are uncomfortable around someone and quietly says, ‘Want me to make an excuse so we can leave?’", "When you say you are okay, the friend accepts your answer and stays nearby without making a scene.",[
        "They are controlling because they tried to influence your decision.",
        "This looks like support: they offered an exit, respected your answer, and did not demand control.",
        "Leave immediately because your friend must know something you do not."
      ],1,"Respect for your no is one of the clearest differences between support and control.",["calibration","support","exit"],"Your friend may simply be cautious; there is no evidence the other person is dangerous.","Keep your own judgment while appreciating a low-pressure exit option.","What behaviors make help feel empowering rather than controlling?"),
    ]
  },
  {
    id:"scams", kicker:"MISSION 04 · LIES & SOCIAL ENGINEERING", title:"Stop. Verify Elsewhere.", desc:"You do not need magical lie-detection skills. Slow down, protect access, and verify using a channel the other person does not control.",
    cases:[
      c("bank-text","Fraud Alert","Impersonation","A text says: ‘BANK ALERT: $842 charge blocked. Reply YES if this was you or call this number now.’", "The message includes the bank’s logo and the last four digits of a card.",[
        "Call the number because the message knows card details.",
        "Do not use the message link or number. Open the official banking app or use a trusted number independently.",
        "Reply NO so the bank knows it is fraud."
      ],1,"Real-looking details do not make the communication channel trustworthy. Independent verification breaks many impersonation scams.",["impersonation","urgency","verification"],"A real bank may send fraud alerts. That is why independent verification is stronger than guessing from appearance.","Use a known official channel and never hand over codes or passwords to an incoming caller or message.","Why is ‘verify elsewhere’ stronger than trying to judge whether the text looks real?"),
      c("principal-call","The Authority Call","Authority","A caller claims to be a school administrator and says there is an urgent disciplinary problem. They demand a student’s login information ‘to preserve evidence.’", "Caller ID displays the school’s name.",[
        "Comply because school officials have authority over school accounts.",
        "End the call and contact the school through its published number or known staff contact.",
        "Argue with the caller until they admit it is fake."
      ],1,"Authority can be impersonated. Caller ID and confidence are not independent proof.",["authority","impersonation","credentials"],"There could be a real school problem, which makes independent contact even more appropriate.","Never give passwords or one-time codes through an unsolicited call.","What kinds of authority make people stop asking normal questions?"),
      c("concert-ticket","Sold Out Tickets","Scarcity","Someone in a local social-media group offers sold-out concert tickets below market price: ‘Three people are messaging me. Pay in the next five minutes or I’m moving on.’", "They refuse a platform with buyer protection because ‘the fees are annoying.’",[
        "Pay quickly because scarcity explains the pressure.",
        "Walk away unless the transaction can be independently verified and protected.",
        "Send half now as a compromise."
      ],1,"Scarcity + urgency + avoidance of protections is a high-risk combination.",["scarcity","urgency","payment"],"A legitimate seller may dislike fees. That still does not require you to accept unnecessary risk.","Use protected payment/transfer mechanisms or skip the deal.","Why are good deals especially effective at making people suspend normal caution?"),
      c("job-offer","Easy Remote Job","Financial access","A ‘recruiter’ messages a teen about a remote assistant job paying unusually well. After a short text interview, they say she is hired.", "They send a check and tell her to deposit it, then immediately buy equipment from a specified vendor.",[
        "Deposit it; the bank will reject it if it is fake.",
        "Stop and verify the employer independently before moving any money.",
        "Buy only a small amount of equipment first."
      ],1,"Money appearing in an account is not the same thing as a payment being final. A job that immediately routes your money elsewhere deserves verification.",["fake job","money movement","verification"],"Some real jobs purchase equipment, but legitimate employers can be checked through independently found channels.","Do not move money or buy gift cards/equipment for an unverified recruiter.","Why does receiving money first make a scam feel safer?"),
      c("awkward-teacher","The Awkward Explanation","Calibration case","A teacher gives a confusing explanation for why a deadline changed. They avoid eye contact and stumble over their words.", "Later you see the updated deadline posted in the official class system exactly as described.",[
        "The body language means the teacher was probably lying.",
        "Use the independently verifiable evidence. Nervousness or awkwardness is not a reliable lie detector.",
        "Assume the online system was changed to cover the lie."
      ],1,"People are poor lie detectors. Prefer records, consistency, incentives, and independent verification over folk rules about faces and gestures.",["calibration","deception","evidence"],"The teacher may simply have been tired, anxious, or thinking while speaking.","Check reliable records rather than trying to decode body language.","What kinds of evidence are harder for a liar to control?"),
    ]
  },
  {
    id:"groups", kicker:"MISSION 05 · GROUP PRESSURE", title:"When the Crowd Changes People", desc:"Groups can distribute responsibility, amplify status games, and make a bad idea feel normal.",
    cases:[
      c("group-chat","The Pile-On","Online crowd","A class group chat starts mocking one student’s awkward video. People who are usually kind pile on with memes.", "Someone writes, ‘Relax. She isn’t even in this chat.’",[
        "Join lightly so you do not become the next target.",
        "Do not add fuel. Change the subject, challenge it if safe, or leave/save evidence if harassment is serious.",
        "Privately insult everyone in the group for being terrible people."
      ],1,"Groups can make cruelty feel costless because responsibility is spread across many people.",["conformity","humiliation","diffusion"],"Some participants may be following the tone rather than intending serious harm.","Do not contribute content you would not defend one-on-one; get adult help if threats or sustained harassment appear.","Why might individually decent people act worse in a group chat?"),
      c("hazing","Prove You Belong","Belonging pressure","New team members are told everyone has to complete a humiliating challenge because ‘we all did it.’", "An older member says refusing means you do not really want to be part of the team.",[
        "Do it because shared hardship creates belonging.",
        "Separate belonging from obedience. Refuse unsafe or degrading demands and involve a trusted adult if needed.",
        "Quit every group that has traditions."
      ],1,"A group can turn belonging into leverage. Tradition does not automatically make a demand safe or legitimate.",["belonging","authority","hazing"],"Many traditions are harmless and positive. Evaluate the specific behavior, not the existence of tradition.","Keep an exit and consult someone outside the group when insiders insist outsiders must not know.","What makes an initiation bonding versus coercive?"),
      c("coach-secret","Don’t Tell Your Parents","Authority + secrecy","A respected coach changes a training rule and says, ‘Parents won’t understand this, so keep it between the team.’", "The rule involves taking injured players to an off-site session without informing families.",[
        "Follow it because the coach is the expert.",
        "The combination of authority, secrecy, and bypassing guardians deserves immediate outside verification.",
        "Assume the coach is a criminal."
      ],1,"Expertise does not cancel normal safeguards. Requests to bypass ordinary oversight are especially important to verify.",["authority","secrecy","isolation"],"There could be a benign administrative explanation, but secrecy is unnecessary if the process is legitimate.","Tell a parent/guardian or another trusted adult and verify the policy.","When should an authority figure reasonably ask for privacy, and when is secrecy inappropriate?"),
      c("drunk-driver","Everybody’s Getting In","Immediate physical risk","After an event, the person who drove your group says they had ‘only a couple drinks.’ Everyone else gets in the car and says you are overreacting.", "The driver laughs loudly, fumbles the keys, and says they are completely fine.",[
        "Get in because staying alone creates a different risk.",
        "Do not ride with an impaired driver. Use another ride, call a trusted adult, or stay in a safe public place while arranging one.",
        "Take the keys and physically fight the driver if necessary."
      ],1,"A unanimous group can still be wrong. Immediate physical safety outranks embarrassment.",["conformity","impairment","exit"],"You do not need to determine the exact level of impairment before choosing a safer ride.","Have a backup ride plan before situations where alcohol may be present.","Why does it become harder to say no after everyone else has already said yes?"),
      c("study-group","The Wrong Answer","Calibration case","Four classmates all insist the teacher said the test is Thursday. You remember hearing Friday.", "The official course page says Friday.",[
        "Assume the group must know something you missed.",
        "Use the stronger evidence and show the group the official page without treating disagreement as manipulation.",
        "Conclude they are coordinating to mislead you."
      ],1,"Groups are not inherently malicious. Consensus is evidence, but a reliable external record can be better evidence.",["calibration","conformity","verification"],"They likely misremembered or copied one another’s mistake.","Check the strongest available source.","How does one person’s confident mistake become a group belief?"),
    ]
  },
  {
    id:"judgment", kicker:"MISSION 06 · STREET WISDOM", title:"Make the Call", desc:"Mixed cases. No single red-flag rule will save you. Look for motive, access, pressure, reaction to no, and independent verification.",
    cases:[
      c("lost-dog","Help Me Find My Dog","Mixed judgment","An unfamiliar adult in a parking lot tells a teen they lost a dog and asks her to walk behind a nearby building to help look.", "There are other adults and store employees close by, but the stranger approached the teen specifically.",[
        "Help because finding a lost pet is time-sensitive.",
        "Do not go to an isolated area. Offer to alert store staff or call someone who can help from the public area.",
        "Scream that the person is a kidnapper."
      ],1,"You can respond compassionately without accepting isolation or unnecessary risk.",["isolation","stranger","exit"],"The dog may genuinely be missing. The safer alternative still helps.","Stay in populated areas and recruit other adults rather than going somewhere secluded.","Why is offering a safer alternative useful for testing a request?"),
      c("account-code","Send Me the Code","Digital access","A friend messages from their normal social account: ‘I’m locked out of something and accidentally sent a verification code to your number. Send it to me ASAP.’", "The account uses the same writing style your friend normally uses.",[
        "Send it because the account is genuine.",
        "Do not send the code. Contact the friend through another channel and read what the code message actually says.",
        "Ask the account a personal question; if they answer correctly, send the code."
      ],1,"A compromised account can look exactly like your friend because it is your friend’s account. One-time codes are access credentials.",["account takeover","urgency","verification"],"Your friend may genuinely be confused about a code, but independent contact is cheap and safer.","Never forward authentication codes unless you initiated the exact process and understand what the code authorizes.","Why can ‘something only my friend would know’ still be weak proof online?"),
      c("angry-customer","The Furious Stranger","Non-evil danger","At a store, a customer is shouting at an employee and slamming objects on the counter. He has not threatened anyone directly.", "Other shoppers move closer to watch and film.",[
        "Move closer too; public witnesses make the situation safer.",
        "Create distance and keep an exit route. You do not need to decide whether he is a bad person before reacting to unstable behavior.",
        "Confront him to defend the employee."
      ],1,"Danger can come from anger, impairment, panic, or recklessness—not only evil intent.",["volatility","distance","non-evil danger"],"He may calm down without hurting anyone. Distance is still a proportionate precaution.","Move away, alert staff/security if appropriate, and avoid trapping yourself in the conflict.","Why is intent sometimes less important than present capability and behavior?"),
      c("new-friend-ride","A Nice New Friend","Ambiguous","A new classmate has been friendly for two weeks and offers you a ride home when it starts raining.", "You know their full name, have mutual classmates, and they suggest texting your parent the car details before leaving.",[
        "Refuse because accepting rides from newer friends is always unsafe.",
        "This has several positive signals. If it fits your family rules, verify the plan and keep ordinary safeguards rather than inventing danger.",
        "Accept without telling anyone because mutual friends prove safety."
      ],1,"Good judgment must be able to recognize ordinary social trust growing normally.",["calibration","positive evidence","communication"],"Nothing here indicates manipulation. Ordinary precautions are enough.","Share plans as appropriate and keep normal transportation boundaries.","What positive behaviors increase trust over time?"),
      c("final-mix","The Party Plan","Final synthesis","A friend invites you to a party hosted by people you barely know. She says her older brother can drive everyone home later.", "Then you learn the brother plans to drink, your friend says ‘we’ll figure it out,’ and the host asks everyone to surrender phones at the door so ‘nobody posts anything.’",[
        "Go because you can decide what to do once you are there.",
        "Change the plan before going: arrange independent transportation, keep your phone, tell someone where you are, or skip it if those conditions are rejected.",
        "Call police because the party must be criminal."
      ],1,"Several manageable risks are stacking: transportation dependence, impaired driving, loss of communication, unfamiliar setting, and social pressure. Fix the structure before entering it.",["stacked risk","access","exit","group pressure"],"The hosts may simply want privacy and the brother may later decide not to drink. You still do not need to make your safety depend on those hopes.","Preserve communication and an independent exit; if reasonable safeguards are treated as disloyal, that itself is information.","Which single change would reduce the most risk here? Which changes are cheap?"),
    ]
  }
];

function c(id,title,risk,scenario,clue,choices,best,lesson,patterns,innocent,protect,parent){return{id,title,risk,scenario,clue,choices,best,lesson,patterns,innocent,protect,parent}}

const app=document.querySelector('#app');
const homeTemplate=document.querySelector('#homeTemplate');
const missionTemplate=document.querySelector('#missionTemplate');
const state=loadState();
let currentMission=null,currentIndex=0;

function loadState(){
  try{return JSON.parse(localStorage.getItem('humansState'))||{answers:{},parent:false}}catch{return{answers:{},parent:false}}
}
function saveState(){localStorage.setItem('humansState',JSON.stringify(state))}
function answerKey(mid,cid){return `${mid}:${cid}`}
function completedCount(m){return m.cases.filter(x=>state.answers[answerKey(m.id,x.id)]!==undefined).length}
function totalCompleted(){return missions.reduce((n,m)=>n+completedCount(m),0)}

function renderHome(){
  currentMission=null;app.replaceChildren(homeTemplate.content.cloneNode(true));
  const grid=app.querySelector('#missionGrid');
  missions.forEach((m,i)=>{
    const done=completedCount(m),pct=Math.round(done/m.cases.length*100);
    const card=document.createElement('article');card.className='mission-card';card.tabIndex=0;
    card.innerHTML=`<span class="mission-num">0${i+1}</span><h3>${m.title}</h3><p>${m.desc}</p><div class="meta"><span>${done}/${m.cases.length} CASES</span><span>${pct}%</span></div><div class="mini-progress"><i style="width:${pct}%"></i></div>`;
    card.onclick=()=>openMission(i);card.onkeydown=e=>{if(e.key==='Enter'||e.key===' ')openMission(i)};grid.appendChild(card);
  });
  app.querySelector('#overallProgress').textContent=`${totalCompleted()} / ${missions.reduce((n,m)=>n+m.cases.length,0)} cases explored`;
  updateParentButton();window.scrollTo({top:0,behavior:'instant'});
}

function openMission(index,startIndex){
  currentMission=index;currentIndex=startIndex??firstUnanswered(missions[index]);
  app.replaceChildren(missionTemplate.content.cloneNode(true));
  const m=missions[index];app.querySelector('#missionKicker').textContent=m.kicker;app.querySelector('#missionTitle').textContent=m.title;app.querySelector('#missionDesc').textContent=m.desc;
  app.querySelector('#backHome').onclick=renderHome;renderCase();updateParentButton();window.scrollTo({top:0,behavior:'instant'});
}
function firstUnanswered(m){const i=m.cases.findIndex(x=>state.answers[answerKey(m.id,x.id)]===undefined);return i===-1?0:i}
function renderProgress(){const m=missions[currentMission],done=completedCount(m);app.querySelector('#missionProgress i').style.width=`${done/m.cases.length*100}%`}

function renderCase(){
  const m=missions[currentMission],mount=app.querySelector('#caseMount');renderProgress();
  if(currentIndex>=m.cases.length){renderComplete(m,mount);return}
  const item=m.cases[currentIndex],key=answerKey(m.id,item.id),chosen=state.answers[key];
  mount.innerHTML=`<article class="case-shell">
    <div class="case-top"><span class="case-counter">CASE ${currentIndex+1} OF ${m.cases.length}</span><span class="risk-tag">${item.risk}</span></div>
    <div class="case-body">
      <h2 class="case-title">${item.title}</h2>
      <p class="scenario">${item.scenario}</p>
      <div class="clue-box"><b>THEN YOU NOTICE</b>${item.clue}</div>
      <p class="question">What is the strongest response?</p>
      <div class="choices">${item.choices.map((x,i)=>`<button class="choice ${chosen===i?'selected':''}" data-choice="${i}">${String.fromCharCode(65+i)}. ${x}</button>`).join('')}</div>
      <div id="debriefMount">${chosen===undefined?'':debriefHTML(item,chosen)}</div>
    </div>
    <div class="case-nav"><button class="secondary" id="prevCase" ${currentIndex===0?'disabled':''}>← Previous</button><button class="primary" id="nextCase" ${chosen===undefined?'disabled':''}>${currentIndex===m.cases.length-1?'Finish mission':'Next case →'}</button></div>
  </article>`;
  mount.querySelectorAll('.choice').forEach(btn=>btn.onclick=()=>choose(Number(btn.dataset.choice)));
  mount.querySelector('#prevCase').onclick=()=>{if(currentIndex>0){currentIndex--;renderCase();window.scrollTo({top:0,behavior:'smooth'})}};
  mount.querySelector('#nextCase').onclick=()=>{currentIndex++;renderCase();window.scrollTo({top:0,behavior:'smooth'})};
}

function choose(i){
  const m=missions[currentMission],item=m.cases[currentIndex],key=answerKey(m.id,item.id);state.answers[key]=i;saveState();renderCase();
  setTimeout(()=>document.querySelector('.debrief')?.scrollIntoView({behavior:'smooth',block:'nearest'}),30)
}

function debriefHTML(item,chosen){
  const right=chosen===item.best;
  return `<section class="debrief">
    <span class="verdict">${right?'STRONG CALL':'RECALIBRATE'}</span>
    <h3>${item.lesson}</h3>
    <div class="pattern-row">${item.patterns.map(x=>`<span class="pattern">${x}</span>`).join('')}</div>
    ${!right?`<p><strong>Why the stronger option is ${String.fromCharCode(65+item.best)}:</strong> ${item.choices[item.best]}</p>`:''}
    <div class="judgment-grid">
      <div class="judgment-box"><b>AN INNOCENT EXPLANATION</b>${item.innocent}</div>
      <div class="judgment-box"><b>CHEAPEST PROTECTION</b>${item.protect}</div>
    </div>
    ${state.parent?`<div class="parent-note"><b>PARENT DISCUSSION PROMPT</b><br>${item.parent}</div>`:''}
  </section>`
}

function renderComplete(m,mount){
  const correct=m.cases.filter(item=>state.answers[answerKey(m.id,item.id)]===item.best).length;
  mount.innerHTML=`<section class="mission-complete"><div class="big">✓</div><p class="eyebrow">MISSION COMPLETE</p><h2>${m.title}</h2><p>You explored all ${m.cases.length} cases and made the strongest call on ${correct}. The point is not a perfect score—it is learning to slow down and see the structure of a situation.</p><button class="primary" id="completeHome">Back to all missions</button></section>`;
  mount.querySelector('#completeHome').onclick=renderHome;renderProgress();
}

function updateParentButton(){
  const btn=document.querySelector('#parentToggle');if(btn)btn.textContent=`Parent mode: ${state.parent?'on':'off'}`
}
document.querySelector('#homeBtn').onclick=renderHome;
document.querySelector('#parentToggle').onclick=()=>{state.parent=!state.parent;saveState();updateParentButton();if(currentMission!==null)renderCase()};
document.querySelector('#resetBtn').onclick=()=>{if(confirm('Reset all case progress?')){state.answers={};saveState();renderHome()}};

renderHome();
