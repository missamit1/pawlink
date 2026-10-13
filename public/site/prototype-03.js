import {createBoundaryDirector} from './boundary-director.js';
import {createStatusLight} from './status-light.js';

const $=s=>document.querySelector(s);
const scene=$('#experience'),stage=$('.cinema');
const campaign=$('#campaign'),ray=$('#ray'),pov=$('#pov');
let movement=$('#movement');
const firstRun=movement,continuation=$('#runContinuation');
const sideRun=$('#sideRun'),collarReturn=$('#collarReturn');
const shadowFinale=$('#shadowFinale');
const runDecks=[firstRun,continuation,sideRun,collarReturn,shadowFinale];
let editShot='run',returnStarted=false,cutPending=false,cutRevision=0;let runTime=0,overlap=false;
function updateRunClock(){runTime=movement.currentTime+(movement===continuation?(firstRun.duration||8.042):0);}
const movementPicture=$('.movement-picture');
let signalAudio=null,signalChimePlayed=false,gateTimeline=null;
function prepareSignalAudio(){const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;signalAudio??=new Audio();signalAudio.resume().catch(()=>{});}
function playSignalChime(){if(!sound||!signalAudio||signalAudio.state!=="running")return;const now=signalAudio.currentTime;[660,880].forEach((frequency,i)=>{const tone=signalAudio.createOscillator(),gain=signalAudio.createGain();tone.type="sine";tone.frequency.value=frequency;const start=now+i*.13;gain.gain.setValueAtTime(0,start);gain.gain.linearRampToValueAtTime(.045,start+.015);gain.gain.exponentialRampToValueAtTime(.0001,start+.16);tone.connect(gain);gain.connect(signalAudio.destination);tone.start(start);tone.stop(start+.18);tone.onended=()=>{tone.disconnect();gain.disconnect()};});}

const movementCues=[{time:1.25,heart:82,activity:'Walking',temp:'38.3'},{time:2.2,heart:87,activity:'Walking',temp:'38.3'},{time:3.1,heart:94,activity:'Active',temp:'38.3'},{time:4.25,heart:98,activity:'Running',temp:'38.4'},{time:5.4,heart:101,activity:'Running',temp:'38.4'},{time:6.55,heart:103,activity:'Running',temp:'38.4'}];
let movementCue=-1;
function armVideo(v){if(!v)return;const src=v.dataset.src;if(src&&v.getAttribute('src')!==src){v.src=src;}}
function prepareMovement(){runDecks.forEach(v=>{armVideo(v);v.preload='auto';v.load()});
 for(const [v,t] of [[sideRun,.05],[collarReturn,6.7]]){if(v.readyState>=1)v.currentTime=t;else v.addEventListener('loadedmetadata',()=>{v.currentTime=t},{once:true});}zoneFieldPromise??=createBoundaryDirector($('#boundaryFX'),movement,stage).then(field=>zoneField=field);}
function startMovement(){editShot='run';returnStarted=false;stage.dataset.edit='run';shadowFinale.style.opacity=0;$('.movement-edition').textContent='RAY / IN MOTION';$('#signalInsight').textContent='';sideRun.style.opacity=0;collarReturn.style.opacity=0;movement=firstRun;continuation.style.opacity=0;runTime=0;movement.playbackRate=1;movement.preservesPitch=true;setPhase('outdoor');movement.volume=0;playVideo(movement);$('#sceneName').textContent='';}
let sample=-1,stepSample=-1,focusSignal='';
function updateMovement(){
  const t=runTime;
 stage.dataset.featured=focusSignal||(['heart','activity','hydration','temperature'][Math.floor(t/2.8)%4]);
  
  
  const packet=Math.floor(t/(reduced?1:.32));
  if(t>=.65&&packet!==sample){
    sample=packet;
    if(!signalChimePlayed){signalChimePlayed=true;playSignalChime();}
    let left=movementCues[0],right=movementCues.at(-1);
    for(let i=0;i<movementCues.length-1;i++)if(t>=movementCues[i].time&&t<movementCues[i+1].time){left=movementCues[i];right=movementCues[i+1];break}
    const blend=clamp((t-left.time)/Math.max(.1,right.time-left.time));
    const heart=Math.round(left.heart+(right.heart-left.heart)*blend)+[0,1,0,-1][packet%4];
    const value=$('#movementHeart');value.innerHTML=heart+' <small>BPM</small>';
    if(!reduced)value.animate([{transform:'translateY(5px)',opacity:.7},{transform:'translateY(0)',opacity:1}],{duration:150,easing:'cubic-bezier(.2,.8,.2,1)'});
    $('#movementActivity').textContent=t<3.1?'Walking':t<4.25?'Active':'Running';
    $('#movementTemperature').innerHTML=(t<4.4?'38.3':'38.4')+' <small>°C</small>';
    $('#movementHydration').innerHTML=(t<9?'82':'81')+' <small>%</small>'; 
  }
  const step=Math.floor(t*1.65+t*t*.1);
  if(step!==stepSample){stepSample=step;$('#stepRhythm').textContent='STEP / '+String(step).padStart(3,'0');
    if(!reduced)$('#stepRhythm').animate([{opacity:.9,transform:'translateX(-3px)'},{opacity:.55,transform:'translateX(0)'}],{duration:220});
  }
  stage.style.setProperty('--heart-visible',t>=.65?1:0);stage.style.setProperty('--activity-visible',t>=1.2?1:0);stage.style.setProperty('--temperature-visible',t>=1.8?1:0);stage.style.setProperty('--hydration-visible',t>=2.3?1:0);
  if(!reduced){stage.style.setProperty('--signal-breath',String(.5+.5*Math.sin(t*Math.PI*3)));}
}
document.querySelectorAll('[data-focus]').forEach(button=>button.addEventListener('click',()=>{
  focusSignal=focusSignal===button.dataset.focus?'':button.dataset.focus;
  stage.dataset.signalFocus=focusSignal;stage.dataset.featured=focusSignal||'heart';
  const insights={heart:'A rhythm to understand in the context of his day.',activity:'Every stride becomes part of his daily story.',temperature:'One reading. More meaning alongside his own history.',hydration:'Illustrative hydration percentage for this concept. Not a measured value.'};
  $('#signalInsight').textContent=insights[focusSignal]||'';
  document.querySelectorAll('[data-focus]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.focus===focusSignal)));
}));
stage.addEventListener('pointermove',event=>{if(reduced||phase!=='movement')return;const r=stage.getBoundingClientRect();stage.style.setProperty('--sense-x',((event.clientX-r.left)/r.width-.5)*12+'px');stage.style.setProperty('--sense-y',((event.clientY-r.top)/r.height-.5)*8+'px')},{passive:true});
stage.addEventListener('pointerleave',()=>{stage.style.setProperty('--sense-x','0px');stage.style.setProperty('--sense-y','0px')});
const campaignPicture=$('.campaign-picture'),rayPicture=$('.ray-picture'),povPicture=$('.pov-picture');
const playButton=$('#play'),enterButton=$('#enter'),replayButton=$('#replay');
const connection=$('.connection'),words=$('#connectionWords'),invitation=$('#invitation');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>x*x*(3-2*x);
let light=await createStatusLight($('#light'));
let phase='idle',active=campaign,paused=false,visible=false,sound=false;
let elapsed=0,last=0,raf=0,portal=0,portalAnchor=0,autoPortal=false,connectionStep=-1;
let handoffReady=false;

function setPhase(next){phase=next;stage.dataset.phase=next;elapsed=0;
  
  if(next==='opening'){const top=stage.getBoundingClientRect().top;if(Math.abs(top)>.5)scrollBy({top,behavior:'instant'});}
}
function syncPlay(){playButton.textContent=paused?'Continue':'Pause';playButton.setAttribute('aria-label',paused?'Continue experience':'Pause experience');}
async function playVideo(v){zoneField?.resume();gateTimeline?.resume();if(v.ended)return;active=v;if(overlap&&runDecks.includes(v)&&!paused&&visible)runDecks.find(other=>other!==v).play().catch(()=>{});v.muted=!sound;if(paused||!visible)return;try{await v.play();syncPlay()}catch(error){if(v!==active||error.name==='AbortError')return;paused=true;syncPlay();invitation.textContent='Press Continue to play with sound.'}}
function wake(){if(!raf&&visible&&!document.hidden)raf=requestAnimationFrame(tick)}
function begin(){if(phase!=='idle')return;setPhase('campaign');paused=false;armVideo(campaign);campaign.preload='auto';campaign.load();armVideo(ray);ray.preload='auto';ray.load();playVideo(campaign);wake()}
function prepareHandoff(){if(phase!=='campaign')return;setPhase('handoff');campaign.pause();ray.currentTime=0;ray.pause();handoffReady=ray.readyState>=2;$('#sceneName').textContent='THEIR WORLD → HIS WORLD';invitation.textContent='';}
ray.addEventListener('loadeddata',()=>{handoffReady=true;wake()});
campaign.addEventListener('ended',prepareHandoff);
ray.addEventListener('ended',()=>{
  if(phase!=='ray')return;setPhase('light');portalAnchor=scrollY;
  
  scene.style.height=Math.max(innerHeight*2.2,scrollY-scene.offsetTop+innerHeight*2.2)+'px';
  enterButton.hidden=false;invitation.textContent=reduced?'Enter through the light.':'Scroll into the light.';
  $('#sceneName').textContent='';armVideo(pov);pov.preload='auto';pov.load();wake();
});
pov.addEventListener('play',()=>{if(movement.preload==='none')prepareMovement()});
pov.addEventListener('ended',()=>{if(phase==='pov')startMovement();});
firstRun.addEventListener('ended',()=>{if(movement===firstRun)cutTo(continuation,0);});
continuation.addEventListener('ended',()=>{if(editShot==='returned')startFinale();});
shadowFinale.addEventListener('ended',()=>{
 if(phase!=='zone-finale')return;
 setPhase('site-opening');playSignalChime();wake();
});
async function startFinale(){
 if(!['returned','finale'].includes(editShot)||cutPending)return;
 editShot='finale';stopBoundaryAlert();prepareDogWorld();
 await cutTo(shadowFinale,0);
 if(movement!==shadowFinale)return;
 stage.dataset.edit='finale';setPhase('zone-finale');wake();
}
function openWebsiteGate(){
 const progress=ease(clamp(elapsed/(reduced?700:2500)));
 zoneField?.portal(progress);
 
 $('.finale-veil').style.opacity=stage.classList.contains('fx-fallback')?progress:0;
 if(progress===1){stage.dataset.edit='complete';setPhase('zone-ended');revealWebsiteGate();}
}

function prepareDogWorld(){
 const frame=$('#dogWorld');if(!frame.hasAttribute('src'))frame.src=frame.dataset.src;
}
function revealWebsiteGate(){
 gateTimeline?.kill();prepareDogWorld();
 [campaign,ray,pov,...runDecks].forEach(v=>v.pause());paused=true;stopBoundaryAlert();zoneField?.pause();
 scene.style.height='100dvh';scene.scrollIntoView({behavior:'instant'});
 stage.dataset.edit='complete';setPhase('zone-ended');
 
 $('#dogWorld').focus({preventScroll:true});
}
function exploreDogWorld(){
 prepareDogWorld();revealWebsiteGate();
 history.replaceState(null,'','#portraits');
}
window.addEventListener('message',event=>{
 const frame=$('#dogWorld');
 if(event.origin!==location.origin||event.source!==frame.contentWindow)return;
 if(event.data?.type==='pawlink:replay'){
   frame.removeAttribute('src');history.replaceState(null,'','#experience');
   stage.dataset.edit='run';replayButton.click();
 }
});
document.querySelector('.portrait-shortcut').addEventListener('click',event=>{event.preventDefault();exploreDogWorld()});

function drawPortal(){const p=ease(portal);light.render(p,clamp(elapsed/650));
  
  rayPicture.style.transformOrigin='50.7% 50.2%';rayPicture.style.transform=`scale(${1+p*3})`;
  $('#ivory').style.opacity=clamp((p-.54)/.46);
}
function setConnectionStep(n){if(n===connectionStep)return;connectionStep=n;
  const text=['CONNECTING<small>TO RAY</small>','Ray<small>GERMAN SHEPHERD</small>','SIGNAL FOUND','CONNECTED'];
  words.innerHTML=text[n];words.classList.remove('resolve');connection.classList.remove('pulse');
  void words.offsetWidth;words.classList.add('resolve');connection.classList.add('pulse');
}
function tick(time){raf=0;const dt=last?Math.min(time-last,80):0;last=time;
  if(phase==='handoff'&&ray.readyState>=2)handoffReady=true;
  if(!paused&&visible&&!document.hidden){
    if(phase!=='handoff'||handoffReady)elapsed+=dt;
    if(phase==='handoff'&&handoffReady){
      const p=ease(clamp(elapsed/(reduced?450:1700)));
      
      
      campaignPicture.style.transform=`scale(${1+p*.5})`;
      campaignPicture.style.opacity=1-p;
      rayPicture.style.opacity=p;
      rayPicture.style.transform=`scale(${.88+.12*p})`;
      if(p===1){setPhase('ray');campaignPicture.style.opacity=0;$('#sceneName').textContent='';playVideo(ray);}
    }
    if(phase==='pov'&&Number.isFinite(pov.duration)&&pov.duration-pov.currentTime<=.38&&firstRun.readyState>=2)startMovement();
    if(phase==='outdoor'&&movement.readyState>=2){
      const p=ease(clamp(movement.currentTime/(reduced?.4:.9)));
      movementPicture.style.opacity=p;
      pov.volume=Math.cos(p*Math.PI/2);movement.volume=Math.sin(p*Math.PI/2);
      if(p===1){pov.pause();pov.volume=Number(document.querySelector("#film-volume")?.value??1);movement.volume=1;setPhase('movement');}
    }
    if(['outdoor','movement','zone-crossing','zone-finale','site-opening','zone-ended'].includes(phase))updateRunClock();
    if(phase==='movement'){if(movement===firstRun&&firstRun.duration-firstRun.currentTime<.055&&!cutPending)cutTo(continuation,0);updateMovement();if(movement===continuation&&movement.currentTime>=3)startSideShot();}
    if(phase==='zone-crossing'){updateEdit();}
    if(phase==='site-opening')openWebsiteGate();
    if(phase==='light'){
      const scrollProgress=clamp((scrollY-portalAnchor)/(innerHeight*.85));
      portal=Math.max(portal,scrollProgress);
      if(autoPortal)portal=Math.min(1,portal+dt/1700);
      drawPortal();
      if(portal>=1&&elapsed>650){setPhase('connecting');connection.style.opacity=1;$('#ivory').style.opacity=1;enterButton.hidden=true;invitation.textContent='';setConnectionStep(0);}
    }
    if(phase==='connecting'){
      setConnectionStep(elapsed<1400?0:elapsed<3000?1:elapsed<4100?2:3);
      if(elapsed>5500&&pov.readyState>=2){setPhase('opening');povPicture.style.opacity=1;connection.style.opacity=0;playVideo(pov);}
    }
    if(phase==='opening'){
      const p=ease(clamp(elapsed/(reduced?500:2100)));
      
      
      povPicture.style.clipPath=`inset(${49.8*(1-p)}% ${46*(1-Math.min(p*2,1))}% round ${5*(1-p)}px)`;
      if(p===1){setPhase('pov');light.render(0,0);}
    }
  }
  if(visible&&!document.hidden&&phase!=='ended'&&phase!=='zone-ended')wake();
}
playButton.addEventListener('click',()=>{if(phase==='idle'){begin();return}paused=!paused;if(paused){zoneField?.pause();gateTimeline?.pause();active.pause();pov.pause();runDecks.forEach(v=>v.pause());stopBoundaryAlert()}else if(['campaign','ray','opening','pov','outdoor','movement','zone-crossing','zone-finale','site-opening','zone-ended'].includes(phase))playVideo(active);syncPlay();wake()});
enterButton.addEventListener('click',()=>{autoPortal=true;paused=false;syncPlay();wake()});

function setSound(enabled){
  sound=enabled;
  if(sound)prepareSignalAudio();else{stopBoundaryAlert();signalAudio?.suspend().catch(()=>{});}
  [campaign,ray,pov,...runDecks].forEach(v=>{v.muted=!sound;v.defaultMuted=!sound;v.volume=Number(document.querySelector("#film-volume")?.value??1)});
  document.querySelectorAll('[data-sound]').forEach(b=>{b.textContent=sound?'Sound on':'Enable sound';b.setAttribute('aria-pressed',String(sound));b.setAttribute('aria-label',sound?'Mute original video audio':'Enable original video audio')});
  if(['campaign','ray','opening','pov','outdoor','movement','zone-crossing','zone-finale','site-opening','zone-ended'].includes(phase)){
    paused=false;
    
    (active.ended?Promise.resolve():active.play()).then(syncPlay).catch(()=>{paused=true;syncPlay();invitation.textContent='Press Continue to play with sound.'});
  }
}
$('#begin').addEventListener('click',()=>{paused=false;begin();setSound(true);wake()});
document.querySelectorAll('[data-sound]').forEach(b=>b.addEventListener('click',()=>{if(phase==='idle')begin();setSound(!sound);wake()}));

let controlsTimer;
function showControls(){stage.classList.add('controls-visible');clearTimeout(controlsTimer);controlsTimer=setTimeout(()=>stage.classList.remove('controls-visible'),1800)}
['pointermove','pointerdown','keydown','focusin'].forEach(event=>stage.addEventListener(event,showControls));
replayButton.addEventListener('click',()=>{
  [campaign,ray,pov,...runDecks].forEach(v=>{v.pause();v.currentTime=0});
  resetZone();movementPicture.style.opacity=0;movementCue=-1;sample=-1;stepSample=-1;focusSignal='';stage.dataset.signalFocus='';document.querySelectorAll('[data-focus]').forEach(b=>b.setAttribute('aria-pressed','false'));signalChimePlayed=false;stage.style.setProperty('--heart-visible',0);stage.style.setProperty('--activity-visible',0);stage.style.setProperty('--temperature-visible',0);
  phase='idle';portal=0;autoPortal=false;connectionStep=-1;paused=false;
  campaignPicture.style.cssText='';rayPicture.style.cssText='';povPicture.style.cssText='';
  $('#ivory').style.opacity=0;connection.style.opacity=0;light.render(0,0);
  enterButton.hidden=true;replayButton.hidden=true;playButton.hidden=false;$('#sceneName').textContent='THEIR WORLD';invitation.textContent='Let them come to you.';
  scene.style.height='';scene.scrollIntoView({behavior:'instant'});begin();
});
new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible){last=0;if(phase==='idle'&&!reduced)begin();else if(!paused&&['campaign','ray','opening','pov','outdoor','movement','zone-crossing','zone-finale','site-opening','zone-ended'].includes(phase))playVideo(active);wake()}else{active.pause();pov.pause();runDecks.forEach(v=>v.pause());stopBoundaryAlert();zoneField?.pause();gateTimeline?.pause();cancelAnimationFrame(raf);raf=0;last=0;}},{threshold:.4}).observe(stage);
addEventListener('scroll',wake,{passive:true});
addEventListener('resize',()=>{if(phase==='light')drawPortal();wake()});
document.addEventListener('visibilitychange',()=>{if(document.hidden){zoneField?.pause();gateTimeline?.pause();active.pause();pov.pause();runDecks.forEach(v=>v.pause());cancelAnimationFrame(raf);raf=0;}else{last=0;if(!paused&&visible&&['campaign','ray','opening','pov','outdoor','movement','zone-crossing','zone-finale','site-opening','zone-ended'].includes(phase))playVideo(active);wake()}});
for(const v of [campaign,ray,pov,...runDecks])v.addEventListener('error',()=>{$('#mediaError').hidden=false;});
addEventListener('pagehide',()=>{cancelAnimationFrame(raf);[campaign,ray,pov,...runDecks].forEach(v=>v.pause());light.dispose();zoneField?.dispose();gateTimeline?.kill();signalAudio?.close().catch(()=>{})},{once:true});

let zoneField=null,zoneFieldPromise=null,zoneCrossed=false;
const zoneCrossTime=11.3;
const alarmTones=new Set();
function stopBoundaryAlert(){for(const tone of alarmTones){try{tone.stop()}catch{}}alarmTones.clear()}
function resetZone(){gateTimeline?.kill();window.gsap?.set('.gate-word,.entry-overline,.site-entry,.entry-caption,.entry-footnote,#filmReplay',{clearProps:'all'});cutRevision++;cutPending=false;stopBoundaryAlert();zoneCrossed=false;stage.classList.remove('zone-active','zone-outside');stage.dataset.edit='run';shadowFinale.style.opacity=0;$('.movement-edition').textContent='RAY / IN MOTION';$('#signalInsight').textContent='';sideRun.style.opacity=0;collarReturn.style.opacity=0;$('.return-light').style.opacity=0;$('.finale-veil').style.opacity=0;zoneField?.clear();zoneField?.setVideo(firstRun);continuation.style.opacity=0;movement.playbackRate=1;$('#zoneState').textContent='Inside.';$('#zoneStateLabel').textContent='SAFE ZONE';$('#zoneDetail').textContent='Ray is approaching the edge.';playButton.hidden=false;}
function enterZone(){setPhase('zone-crossing');stage.classList.add('zone-active');zoneField?.start();focusSignal='';stage.dataset.signalFocus='';}
function crossedZone(){if(zoneCrossed)return;zoneCrossed=true;stage.classList.add('zone-outside');zoneField?.cross();$('#zoneState').textContent='Outside.';$('#zoneDetail').textContent='Ray left his Safe Zone.';playBoundaryAlert();playBoundaryImpact();}
function updateZone(){const rawProgress=Math.max(0,(runTime-10.1)/(zoneCrossTime-10.1));if(runTime>=zoneCrossTime)crossedZone();stage.style.setProperty('--crossing-progress',clamp(rawProgress));}
function playBoundaryAlert(){if(!sound||!signalAudio||signalAudio.state!=='running')return;stopBoundaryAlert();const now=signalAudio.currentTime;
  
  [0,.58,1.16].forEach((offset,i)=>{
   const tone=signalAudio.createOscillator(),gain=signalAudio.createGain(),filter=signalAudio.createBiquadFilter();
   const t=now+.20+offset;tone.type='triangle';
   tone.frequency.setValueAtTime(470,t);tone.frequency.exponentialRampToValueAtTime(940,t+.12);tone.frequency.exponentialRampToValueAtTime(620,t+.38);
   filter.type='lowpass';filter.frequency.value=1800;
   gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(.115-i*.012,t+.035);gain.gain.exponentialRampToValueAtTime(.0001,t+.43);
   tone.connect(filter);filter.connect(gain);gain.connect(signalAudio.destination);alarmTones.add(tone);tone.start(t);tone.stop(t+.45);
   tone.onended=()=>{alarmTones.delete(tone);tone.disconnect();filter.disconnect();gain.disconnect()};
  });}

$('#repeatBoundary').addEventListener('click',()=>{resetZone();runDecks.forEach(v=>{v.pause();v.currentTime=0;v.volume=Number(document.querySelector("#film-volume")?.value??1);v.style.opacity=0});overlap=false;movement=runDecks[0];movement.style.opacity=1;sample=-1;stepSample=-1;signalChimePlayed=false;active=movement;paused=false;playButton.hidden=false;stage.style.setProperty('--heart-visible',0);stage.style.setProperty('--activity-visible',0);stage.style.setProperty('--temperature-visible',0);startMovement();wake();});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopBoundaryAlert()});

async function cutTo(video,time){
 if(cutPending)return;
 cutPending=true;const revision=++cutRevision,previous=active;
 try{
  
  if(video.readyState<1)await new Promise(resolve=>video.addEventListener('loadedmetadata',resolve,{once:true}));
  if(Math.abs(video.currentTime-time)>.08)video.currentTime=time;
  video.playbackRate=1;video.preservesPitch=true;video.muted=!sound;
  if(paused||!visible){cutPending=false;return;}
  await video.play();
  if(video.requestVideoFrameCallback)await new Promise(resolve=>video.requestVideoFrameCallback(resolve));
  if(revision!==cutRevision||paused||!visible||document.hidden){video.pause();return;}
  previous.pause();movement=video;active=video;
  runDecks.forEach(v=>v.style.opacity=v===video?1:0);
  zoneField?.setVideo(video);syncPlay();wake();
 }catch(error){
  if(revision===cutRevision&&error.name!=='AbortError'){active=video;movement=video;paused=true;syncPlay();invitation.textContent='Press Continue to resume the film.';}
 }finally{if(revision===cutRevision)cutPending=false;}
}
function startSideShot(){
 editShot='side';stage.dataset.edit='side';enterZone();cutTo(sideRun,.05);
}
function updateEdit(){
 if(cutPending)return;
 if(editShot==='side'){
  const t=sideRun.currentTime-.05;
  stage.style.setProperty('--overhead-softness',(5*(1-ease(clamp((t-2.8)/1.4))))+'px');
  
  
  const slowIn=ease(clamp((t-1.6)/.18));
  const recover=ease(clamp((t-2.4)/.65));
  sideRun.playbackRate=reduced?1:1-.45*slowIn*(1-recover);
  stage.style.setProperty('--boundary-shift',((t-1.35)*23+24)+'vw');
  stage.style.setProperty('--boundary-opacity',String(Math.min(1,t/.4)*Math.max(0,Math.min(1,(3.5-t)/.65))));
  sideRun.volume=reduced?1:1-.72*ease(clamp((t-1.72)/.18))*(1-ease(clamp((t-2.45)/.6)));
  if(t>=1.9&&!zoneCrossed)crossedZone();
  if(sideRun.currentTime>=8.85){editShot='collar';stage.dataset.edit='collar';stopBoundaryAlert();cutTo(collarReturn,6.7);}
 }else if(editShot==='finale'){
  if(movement!==shadowFinale)startFinale();
 }else if(editShot==='returned'){
  updateMovement();
  if(continuation.duration-continuation.currentTime<.07)startFinale();
 }else if(editShot==='collar'){
  const t=collarReturn.currentTime;
  $('.return-light').style.opacity=clamp((t-9.3)/.5);
  if(t>=9.83&&!returnStarted){
   returnStarted=true;editShot='returned';stage.dataset.edit='returned';cutTo(continuation,3);
   window.gsap.to($('.return-light'),{opacity:0,duration:reduced?.1:.65,ease:'power2.out'});
   if(!reduced)document.querySelectorAll('.reading').forEach((el,i)=>el.animate([{opacity:0,transform:'translateY(16px)'},{opacity:1,transform:'translateY(0)'}],{duration:650,delay:300+i*180,fill:'backwards',easing:'cubic-bezier(.16,1,.3,1)'}));
  }
 }
}

function playBoundaryImpact(){
 if(!sound||!signalAudio||signalAudio.state!=='running')return;
 const t=signalAudio.currentTime,o=signalAudio.createOscillator(),g=signalAudio.createGain();
 o.type='sine';o.frequency.setValueAtTime(125,t);o.frequency.exponentialRampToValueAtTime(42,t+.65);
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.095,t+.025);g.gain.exponentialRampToValueAtTime(.0001,t+.85);
 o.connect(g);g.connect(signalAudio.destination);alarmTones.add(o);o.start(t);o.stop(t+.9);o.onended=()=>{alarmTones.delete(o);o.disconnect();g.disconnect();};
}

$('#filmReplay').addEventListener('click',()=>$('#repeatBoundary').click());

if(location.hash==="#portraits")exploreDogWorld();

const volumeControl=document.querySelector("#film-volume");volumeControl?.addEventListener("input",()=>{const level=Number(volumeControl.value);[campaign,ray,pov,...runDecks].forEach(v=>v.volume=level);if(level>0&&!sound)setSound(true);});
