import {cutReveal} from './editorial-cut.js?v=62';
import * as T from 'three';
import {gsap} from './dist/motion.js?v=34';
import {renderReading} from './digit-swap.js?v=25';
const specs={water:{index:'02 / HYDRATION',statement:'A quieter current.',field:'hydration',unit:'%',note:'Hydration reading · optical interpretation'},steps:{index:'03 / MOVEMENT',statement:'Every step, connected.',field:'steps',unit:'STEPS',note:''},thermal:{index:'04 / TEMPERATURE',statement:'Warmth, understood.',field:'temperature',unit:'°C',note:'Single sensor reading · not a thermal map'}};
export function systemAnnotations({camera,getAnchor,getDog,onSelect}){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,items={};let selected='',reading={},source='preview',timeline;const progress={value:0};
 for(const [key,spec] of Object.entries(specs)){
  const el=document.createElement('section');el.className='system-annotation system-'+key;el.hidden=true;el.setAttribute('aria-label',spec.index.slice(5));
  el.innerHTML=`<div class="annotation-index">${spec.index}</div><p class="annotation-statement">${spec.statement}</p><div class="annotation-reading"></div><div class="system-activity-state"></div><p class="system-note">${spec.note}</p><p class="annotation-meta"><span class="annotation-source"></span></p>`;
  el.tabIndex=0;el.setAttribute('role','button');el.onclick=()=>onSelect?.(key);el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onSelect?.(key);}};document.body.append(el);const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.classList.add('system-relationship');svg.innerHTML='<circle r="1.7"/><path/>';svg.hidden=true;svg.style.display='none';document.body.append(svg);items[key]={el,svg};
 }
 function select(key){selected=specs[key]?key:'';timeline?.kill();progress.value=0;
  for(const [k,{el,svg}]of Object.entries(items)){el.hidden=k!==selected;svg.style.display=k===selected?'block':'none';}
  if(!selected)return;const {el}=items[selected],parts=[el.querySelector('.annotation-index'),el.querySelector('.annotation-reading'),el.querySelector('.system-activity-state'),el.querySelector('.system-note'),el.querySelector('.annotation-meta')];
  timeline=gsap.timeline().set(parts,{opacity:0,y:reduced?0:7,clipPath:'inset(0 0 100% 0)'}).to(progress,{value:1,duration:reduced?0:.5,ease:'power2.out'},0).to(parts,{opacity:1,y:0,clipPath:'inset(0 0 0% 0)',duration:reduced?0:.55,stagger:reduced?0:.08,ease:'power3.out'},reduced?0:.12);
  timeline.set(el.querySelector('.annotation-statement'),{opacity:1,y:0,clipPath:'none'},0);
  cutReveal(timeline,el.querySelector('.annotation-statement'),.24);
  document.querySelector('#portrait-status').textContent=specs[selected].index.slice(5)+' selected.';
 }
 function data(next,origin){reading=next;source=origin;for(const [key,spec]of Object.entries(specs)){let v=reading[spec.field];v=Number.isFinite(v)?(key==='steps'?v.toLocaleString('en-US'):v):null;renderReading(items[key].el.querySelector('.annotation-reading'),{value:v,unit:spec.unit});items[key].el.querySelector('.system-activity-state').textContent=key==='steps'?(reading.activity_state||'STATE UNAVAILABLE').toUpperCase():'';}}
 function update(){if(!selected)return;const {el,svg}=items[selected],world=getAnchor(selected);const shown=!!getDog()?.visible&&!!world;el.style.visibility=svg.style.visibility=shown?'visible':'hidden';if(!shown)return;
  const p=world.clone().project(camera),ax=(p.x*.5+.5)*innerWidth,ay=(-p.y*.5+.5)*innerHeight,w=el.offsetWidth,h=el.offsetHeight,mobile=innerWidth<=700;
  let x=innerWidth*.31,y=innerHeight*.49;
  if(selected==='steps')y=innerHeight*.51;
  if(selected==='thermal')y=innerHeight*.48;
  if(mobile){x=18;y=innerHeight*.48;}
  x=Math.max(18,Math.min(innerWidth-w-18,x));y=Math.max(28,Math.min(innerHeight-h-24,y));el.style.transform=`translate(${x}px,${y}px)`;
  const sx=x>ax?x-9:x+w+9,sy=y+8,dx=sx-ax,dy=sy-ay,len=Math.hypot(dx,dy)||1,ux=dx/len,uy=dy/len,n=Math.min(22,len*.22)*progress.value;
  svg.querySelector('circle').setAttribute('cx',ax);svg.querySelector('circle').setAttribute('cy',ay);svg.querySelector('path').setAttribute('d',`M ${ax+ux*5} ${ay+uy*5} l ${ux*n} ${uy*n} M ${sx-ux*n} ${sy-uy*n} L ${sx} ${sy}`);svg.style.opacity=progress.value;
  el.dataset.readingState=Number.isFinite(reading[specs[selected].field])?'available':'missing';
  const stamp=Date.parse(reading.created_at),age=Math.max(0,Math.floor((Date.now()-stamp)/1000));el.querySelector('.annotation-source').textContent=el.dataset.readingState==='missing'?'READING UNAVAILABLE':source==='preview'?'PREVIEW READING':!Number.isFinite(stamp)?'UPDATE TIME UNAVAILABLE':age>60?'LAST READING · STALE':'UPDATED '+age+' SEC AGO';
 }
 return {select,data,update};
}
