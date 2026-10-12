import {gsap} from './dist/motion.js?v=34';

export function radialSelector(nav,buttons){
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
 svg.classList.add('radial-track');svg.setAttribute('viewBox','0 0 360 420');svg.setAttribute('aria-hidden','true');
 svg.innerHTML='<path d="M -60.824 26.474 A 190 190 0 0 1 -60.824 393.526" fill="none"/>';
 nav.prepend(svg);
 const orbit=buttons.map((button,i)=>{
  button.setAttribute('aria-label',`${button.dataset.systemKey==='water'?'Hydration':button.querySelector('.system-label').textContent} — ${String(i+1).padStart(2,'0')}`);
  button.querySelector('.system-caption').remove();
  const pin=document.createElement('i');pin.className='radial-point';pin.setAttribute('aria-hidden','true');button.append(pin);
  return {button,angle:(i-1)*27,emphasis:0};
 });
 
 
 const wheel={position:0};
 let selected=-1,target=0;
 const smooth=t=>t*t*(3-2*t);
 function paint(){
  const scale=nav.clientWidth/360;
  orbit.forEach((item,i)=>{
   const angle=((i*27-wheel.position+67.5)%108+108)%108-67.5;
   const radians=angle*Math.PI/180;
   const edge=Math.min(1,(angle+67.5)/10,(40.5-angle)/10);
   const emphasis=selected===i?smooth(Math.max(0,1-Math.abs(angle)/27)):0;
   item.button.style.left=`${(-110+190*Math.cos(radians)+23)*scale}px`;
   item.button.style.top=`${(210+190*Math.sin(radians)-34)*scale}px`;
   item.button.style.opacity=smooth(Math.max(0,edge));
   item.button.style.setProperty('--orbit-angle',`${angle*.65}deg`);
   item.button.style.setProperty('--orbit-scale',scale);
   item.button.style.setProperty('--orbit-emphasis',emphasis);
   item.button.style.setProperty('--orbit-label',smooth(Math.max(0,1-Math.abs(angle)/16)));
  });
 }
 function update(key,animate){
  const chosen=buttons.findIndex(b=>b.dataset.systemKey===key);
  if(chosen===selected){paint();return;}
  selected=chosen;
  const stop=Math.max(0,chosen)*27;
  let delta=((stop-wheel.position+54)%108+108)%108-54;
  if(Math.abs(delta+54)<.001)delta=54;
  target=wheel.position+delta;
  gsap.killTweensOf(wheel);
  gsap.to(wheel,{position:target,duration:animate&&!reduce.matches ? .95 : 0,
   ease:'power2.inOut',onUpdate:paint});
 }
 paint();
 return {update};
}
