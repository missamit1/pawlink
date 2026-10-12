(()=>{
 const button=document.querySelector('#pawlink-sound');if(!button)return;
 const videos=[...document.querySelectorAll('video')];
 let enabled=false,audio,queued=false;

 function shown(v){
  if(v.paused||v.ended||document.hidden)return 0;
  let n=v;
  while(n&&n!==document.body){
    const s=getComputedStyle(n);
    if(s.display==='none'||s.visibility==='hidden'||Number(s.opacity)<.15)return 0;
    n=n.parentElement;
  }
  const r=v.getBoundingClientRect();
  return Math.max(0,Math.min(r.bottom,innerHeight)-Math.max(r.top,0))*Math.max(0,Math.min(r.right,innerWidth)-Math.max(r.left,0));
 }

 function sync(){
  queued=false;
  let best=null,area=0;
  for(const v of videos){
    const a=shown(v);
    if(a>area){area=a;best=v;}
  }
  for(const v of videos)v.muted=!enabled||v!==best;
 }

 function schedule(){if(!queued){queued=true;requestAnimationFrame(sync);}}

 function chime(){
  if(!enabled||!audio||audio.state!=='running')return;
  const o=audio.createOscillator(),g=audio.createGain(),now=audio.currentTime;
  o.type='sine';
  o.frequency.setValueAtTime(660,now);
  o.frequency.exponentialRampToValueAtTime(880,now+.09);
  g.gain.setValueAtTime(0,now);
  g.gain.linearRampToValueAtTime(.025,now+.012);
  g.gain.exponentialRampToValueAtTime(.0001,now+.16);
  o.connect(g);g.connect(audio.destination);
  o.start(now);o.stop(now+.18);
  o.onended=()=>{o.disconnect();g.disconnect();};
 }

 button.addEventListener('click',()=>{
  enabled=!enabled;
  button.setAttribute('aria-pressed',String(enabled));
  button.setAttribute('aria-label',enabled?'Mute website sound':'Enable website sound');
  button.querySelector('span').textContent=enabled?'Sound on':'Sound off';
  if(enabled){
    try{audio??=new(window.AudioContext||window.webkitAudioContext)();audio.resume().then(chime).catch(()=>{});}catch{}
  }else audio?.suspend();
  sync();
 });

 videos.forEach(v=>{
  v.muted=true;
  ['play','pause','ended','volumechange'].forEach(event=>v.addEventListener(event,event==='volumechange'?()=>{if(!enabled&&!v.muted)v.muted=true;}:schedule));
 });

 // Remove any leftover overlay chrome from older builds
 document.querySelectorAll('.pl-media-controls').forEach(el=>el.remove());

 document.addEventListener('click',e=>{
  if(e.target.closest('.pl-signup-next,#signup-open-envelope,.pl-detail,.pl-film-toggle,#twinReveal,.meaning-stations button'))chime();
 });
 addEventListener('scroll',schedule,{passive:true});
 addEventListener('resize',schedule);
 document.addEventListener('visibilitychange',sync);
 const observer=new IntersectionObserver(schedule,{threshold:[0,.15,.5,1]});
 videos.forEach(v=>observer.observe(v));
 addEventListener('pagehide',()=>{observer.disconnect();videos.forEach(v=>v.muted=true);audio?.close();},{once:true});
})();
