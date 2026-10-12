import {gsap} from './dist/motion.js?v=34';

const prepared=new WeakMap();
export function cutReveal(timeline,element,at=0){
 if(!element)return;
 let words=prepared.get(element);
 if(!words){
  const text=element.textContent;const accessible=document.createElement('span');accessible.className='sr-only';accessible.textContent=text;
  const visual=document.createElement('span');visual.setAttribute('aria-hidden','true');
  words=text.trim().split(/\s+/).map((word,i)=>{if(i)visual.append(' ');const mask=document.createElement('span'),ink=document.createElement('span');mask.className='editorial-cut-mask';ink.className='editorial-cut-ink';ink.textContent=word;mask.append(ink);visual.append(mask);return ink;});
  element.replaceChildren(accessible,visual);prepared.set(element,words);
 }
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 timeline.set(words,{yPercent:reduced?0:112,rotate:reduced?0:2,opacity:1},0)
  .to(words,{yPercent:0,rotate:0,duration:reduced?0:.72,stagger:reduced?0:.055,ease:'power4.out'},reduced?0:at);
}
