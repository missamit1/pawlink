(()=>{
const video=document.getElementById('heroVideo');
if(video){
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  video.muted=true;
  video.defaultMuted=true;
  video.playsInline=true;
  video.loop=true;
  video.preload='auto';
  if(reduce){video.autoplay=false;video.pause();}
  else{
    const start=()=>video.play().catch(()=>{});
    if(video.readyState>=3)start();
    else video.addEventListener('canplaythrough',start,{once:true});
    document.addEventListener('visibilitychange',()=>{if(!document.hidden&&video.paused)start();});
  }
}
const hero=document.querySelector('.hero');
if(hero){
  const mark=()=>{
    const past=hero.getBoundingClientRect().bottom<innerHeight*0.35;
    hero.classList.toggle('is-past',past);
    document.body.classList.toggle('hero-past',past);
  };
  mark();
  addEventListener('scroll',mark,{passive:true});
  addEventListener('resize',mark);
}
})();
