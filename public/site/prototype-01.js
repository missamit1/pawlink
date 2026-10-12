import {createStatusLight} from './status-light.js';

const $=s=>document.querySelector(s);
const scene=$('#experience'),stage=$('.cinema');
const campaign=$('#campaign'),ray=$('#ray'),pov=$('#pov');
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
async function playVideo(v){active=v;v.muted=!sound;if(paused||!visible)return;try{await v.play();syncPlay()}catch{paused=true;syncPlay();invitation.textContent='Press Continue to play with sound.'}}
function wake(){if(!raf&&visible&&!document.hidden)raf=requestAnimationFrame(tick)}
function begin(){if(phase!=='idle')return;setPhase('campaign');paused=false;ray.preload='auto';ray.load();playVideo(campaign);wake()}
function prepareHandoff(){if(phase!=='campaign')return;setPhase('handoff');campaign.pause();ray.currentTime=0;ray.pause();handoffReady=ray.readyState>=2;$('#sceneName').textContent='THEIR WORLD → HIS WORLD';invitation.textContent='';}
ray.addEventListener('loadeddata',()=>{handoffReady=true;wake()});
campaign.addEventListener('ended',prepareHandoff);
ray.addEventListener('ended',()=>{
  if(phase!=='ray')return;setPhase('light');portalAnchor=scrollY;
  
  scene.style.height=Math.max(innerHeight*2.2,scrollY-scene.offsetTop+innerHeight*2.2)+'px';
  enterButton.hidden=false;invitation.textContent=reduced?'Enter through the light.':'Scroll into the light.';
  $('#sceneName').textContent='';pov.preload='auto';pov.load();wake();
});
pov.addEventListener('ended',()=>{setPhase('ended');replayButton.hidden=false;playButton.hidden=true;invitation.textContent='';scene.style.height=Math.max(innerHeight,scrollY-scene.offsetTop+innerHeight)+'px';});
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
  if(visible&&!document.hidden&&phase!=='ended')wake();
}
playButton.addEventListener('click',()=>{if(phase==='idle'){begin();return}paused=!paused;if(paused)active.pause();else if(['campaign','ray','opening','pov'].includes(phase))playVideo(active);syncPlay();wake()});
enterButton.addEventListener('click',()=>{autoPortal=true;paused=false;syncPlay();wake()});

function setSound(enabled){
  sound=enabled;
  [campaign,ray,pov].forEach(v=>{v.muted=!sound;v.defaultMuted=!sound;v.volume=1});
  document.querySelectorAll('[data-sound]').forEach(b=>{b.textContent=sound?'Sound on':'Enable sound';b.setAttribute('aria-pressed',String(sound));b.setAttribute('aria-label',sound?'Mute original video audio':'Enable original video audio')});
  if(['campaign','ray','opening','pov'].includes(phase)){
    paused=false;
    
    active.play().then(syncPlay).catch(()=>{paused=true;syncPlay();invitation.textContent='Press Continue to play with sound.'});
  }
}
$('#begin').addEventListener('click',()=>{paused=false;begin();setSound(true);wake()});
document.querySelectorAll('[data-sound]').forEach(b=>b.addEventListener('click',()=>{if(phase==='idle')begin();setSound(!sound);wake()}));

let controlsTimer;
function showControls(){stage.classList.add('controls-visible');clearTimeout(controlsTimer);controlsTimer=setTimeout(()=>stage.classList.remove('controls-visible'),1800)}
['pointermove','pointerdown','keydown','focusin'].forEach(event=>stage.addEventListener(event,showControls));
replayButton.addEventListener('click',()=>{
  [campaign,ray,pov].forEach(v=>{v.pause();v.currentTime=0});
  phase='idle';portal=0;autoPortal=false;connectionStep=-1;paused=false;
  campaignPicture.style.cssText='';rayPicture.style.cssText='';povPicture.style.cssText='';
  $('#ivory').style.opacity=0;connection.style.opacity=0;light.render(0,0);
  enterButton.hidden=true;replayButton.hidden=true;playButton.hidden=false;$('#sceneName').textContent='THEIR WORLD';invitation.textContent='Let them come to you.';
  scene.style.height='';scene.scrollIntoView({behavior:'instant'});begin();
});
new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible){last=0;if(phase==='idle'&&!reduced)begin();else if(!paused&&['campaign','ray','opening','pov'].includes(phase))playVideo(active);wake()}else{active.pause();cancelAnimationFrame(raf);raf=0;last=0;}},{threshold:.4}).observe(stage);
addEventListener('scroll',wake,{passive:true});
addEventListener('resize',()=>{if(phase==='light')drawPortal();wake()});
document.addEventListener('visibilitychange',()=>{if(document.hidden){active.pause();cancelAnimationFrame(raf);raf=0;}else{last=0;if(!paused&&visible&&['campaign','ray','opening','pov'].includes(phase))playVideo(active);wake()}});
for(const v of [campaign,ray,pov])v.addEventListener('error',()=>{$('#mediaError').hidden=false;});
addEventListener('pagehide',()=>{cancelAnimationFrame(raf);[campaign,ray,pov].forEach(v=>v.pause());light.dispose()},{once:true});
