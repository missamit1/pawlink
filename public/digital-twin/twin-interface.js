import {radialSelector} from './radial-selector.js?v=67';
import {cutReveal} from './editorial-cut.js?v=62';
import * as T from 'three';
import {systemAnnotations} from './twin-system-annotations.js?v=62';
import {mountRayCursor} from './dist/ray-cursor.js?v=52';
import {gsap} from './dist/motion.js?v=34';
import {renderReading} from './digit-swap.js?v=25';

export function heartInterface({canvas,camera,getDog,getHeart,getState,getAnchor,select,hitZone,onHover}){
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
 const nav=document.querySelector('#system-navigation');
 nav.replaceChildren();
 const systems=[['heart','01','Heart',''],['water','02','Hydration',''],['steps','03','Movement',''],['thermal','04','Temperature','']];
 const buttons=systems.map(([key,n,title,copy])=>{const b=document.createElement('button');b.dataset.systemKey=key;b.innerHTML=`<span class="system-index">${n}</span><span class="system-label">${title}</span><span class="system-caption">${copy}</span>`;nav.append(b);b.onclick=()=>choose(key);return b;});
 const shared=document.createElement('span');shared.className='shared-rule';shared.setAttribute('aria-hidden','true');nav.append(shared);
 const lens=document.createElement('span');lens.className='glass-selection';lens.setAttribute('aria-hidden','true');nav.append(lens);
 const engraving=document.createElement('div');engraving.className='glass-index-heading';engraving.setAttribute('aria-hidden','true');engraving.innerHTML='<span>RAY / INNER SYSTEMS</span><span>01—04</span>';nav.append(engraving);
 const radial=radialSelector(nav,buttons);
 const all=document.createElement('button');all.className='whole-ray';all.textContent='WHOLE PORTRAIT';all.onclick=()=>choose('');nav.append(all);
 const annotation=document.createElement('section');annotation.id='heart-annotation';annotation.setAttribute('aria-label','Ray heart rate');annotation.hidden=true;
 annotation.innerHTML='<div class="annotation-index">HEART RATE</div><div class="annotation-reading"></div><p class="annotation-statement">The rhythm within.</p><p class="annotation-meta"><span class="annotation-source"></span></p>';
 annotation.tabIndex=0;annotation.setAttribute('role','button');annotation.onclick=()=>choose('heart');annotation.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose('heart');}};document.body.append(annotation);
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.id='heart-relationship';svg.setAttribute('aria-hidden','true');svg.innerHTML='<circle r="2"/><path class="origin-fragment"/><path class="type-fragment"/>';document.body.append(svg);
 const dot=svg.querySelector('circle'),origin=svg.querySelector('.origin-fragment'),end=svg.querySelector('.type-fragment');
 const cursor=mountRayCursor({morph:false});
 const additional=systemAnnotations({camera,getAnchor,getDog,onSelect:choose});
 const raycaster=new T.Raycaster(),pointer=new T.Vector2();let x=0,y=0,onCanvas=false,hover=false,heartHover=false,hoverZone='',zoneSeen=0,lastPick=0,hoverSince=0,lastState='',selected='',locked=false,reading=null,source='preview',timeline,navTween;
 const fragments={progress:0};const cursorPoint={x:0,y:0};let initialized=false;
 canvas.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;x=e.clientX;y=e.clientY;onCanvas=true;});
 canvas.addEventListener('pointerleave',()=>{onCanvas=false;hover=heartHover=false;});
 window.addEventListener('blur',()=>{onCanvas=false;hover=heartHover=false;});
 function pickRegion(px,py){pointer.set(px/innerWidth*2-1,-py/innerHeight*2+1);raycaster.setFromCamera(pointer,camera);const dog=getDog();const hit=dog&&raycaster.intersectObject(dog,true).find(h=>h.object.isMesh&&!h.object.userData.innerEnvelope);return {hit,zone:hitZone?.(hit)||''};}
 let press=null;canvas.addEventListener('pointerdown',e=>{press={x:e.clientX,y:e.clientY,locked};});
 canvas.addEventListener('click',e=>{if(!locked||!press?.locked||Math.hypot(e.clientX-press.x,e.clientY-press.y)>8)return;const {zone}=pickRegion(e.clientX,e.clientY);if(zone)choose(zone);});
 function positionSelection(animate=false){
  navTween?.kill();gsap.killTweensOf(lens);
  const chosen=buttons.find(b=>b.dataset.systemKey===selected);
  buttons.forEach(b=>{const active=b===chosen;b.setAttribute('aria-pressed',String(active));b.classList.toggle('selected',active);});
  radial.update(selected,animate);
 }
 buttons.forEach((b,i)=>b.addEventListener('keydown',e=>{
  const delta=e.key==='ArrowDown'?1:e.key==='ArrowUp'?-1:0;
  if(!delta&&e.key!=='Home'&&e.key!=='End')return;
  e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?buttons.length-1:(i+delta+buttons.length)%buttons.length;
  buttons[next].focus();choose(buttons[next].dataset.systemKey);
 }));
 new ResizeObserver(()=>positionSelection()).observe(nav);
 function choose(key){if(!locked||key===selected)return;selected=key;document.body.dataset.focusSystem=key||'overview';select(key||'overview');additional.select(key);
  positionSelection(true);
  timeline?.kill();gsap.killTweensOf(fragments);gsap.set([dot,origin,end],{opacity:0});fragments.progress=0;
  const active=key==='heart';annotation.hidden=!active;annotation.inert=!active;
  if(active){const index=annotation.querySelector('.annotation-index'),number=annotation.querySelector('.annotation-reading'),meta=annotation.querySelector('.annotation-meta'),statement=annotation.querySelector('.annotation-statement');
   timeline=gsap.timeline({defaults:{ease:'power3.out',duration:reduce?0:.55}});
   timeline.set([index,number,meta],{opacity:0,y:reduce?0:8,filter:reduce?'none':'blur(3px)',clipPath:'inset(0 0 100% 0)'})
    .to(dot,{opacity:1,duration:reduce?0:.2},0).to([origin,end],{opacity:.82,duration:reduce?0:.3},.08)
    .to(fragments,{progress:1,duration:reduce?0:.6},.08)
    .to(index,{opacity:1,y:0,filter:'blur(0px)',clipPath:'inset(0 0 0% 0)'},.16)
    .to(number,{opacity:1,y:0,filter:'blur(0px)',clipPath:'inset(0 0 0% 0)',duration:reduce?0:.75},.40)
    .set(statement,{opacity:1,y:0,filter:'none',clipPath:'none'},0)
    .to(meta,{opacity:1,y:0,filter:'blur(0px)',clipPath:'inset(0 0 0% 0)'},.65);
   cutReveal(timeline,statement,.46);
   document.querySelector('#portrait-status').textContent='Heart selected.';
  }
 }
 function data(value,originName){additional.data(value,originName);reading=value;source=originName;const bpm=Number.isFinite(value.heart_rate)?value.heart_rate:null;renderReading(annotation.querySelector('.annotation-reading'),{value:bpm,unit:'BPM'});}
 function update(dt){additional.update();const state=getState();const now=performance.now();locked=state.locked&&state.progress===1;nav.inert=!locked;
  const phase=locked?'explore':state.progress>0?'reveal':'portrait';
  if(lastState!==phase){if(phase!=='explore'){selected='';additional.select('');positionSelection();document.body.dataset.focusSystem='overview';annotation.hidden=true;timeline?.kill();gsap.set([dot,origin,end],{opacity:0});select('overview');}lastState=phase;if(phase==='explore'&&document.body.classList.contains('spatial-heart-proof'))choose('heart');}
  if(fine&&onCanvas&&now-lastPick>70){lastPick=now;const picked=pickRegion(x,y),wasHover=hover;hover=!!picked.hit;if(hover&&!wasHover)hoverSince=now;if(locked&&picked.zone){hoverZone=picked.zone;zoneSeen=now;}else if(now-zoneSeen>220)hoverZone='';}
  if(!onCanvas||!locked)hoverZone='';
  canvas.dataset.bodyRegion=hoverZone;onHover?.(hoverZone);
  const visible=fine&&onCanvas&&(hover||state.held);canvas.classList.toggle('context-hit',visible);
  cursor.update({x,y,visible,word:state.held?'WITHIN':locked?(hoverZone==='heart'?'HEART':hoverZone==='steps'?'MOVEMENT':'EXPLORE'):'HOLD'});
  if(locked&&selected==='heart'){
   const dog=getDog(),heart=getHeart();
   
   const shown=!!dog?.visible&&heart.visible;annotation.style.visibility=shown?'visible':'hidden';svg.style.visibility=shown?'visible':'hidden';
   const p=heart.getWorldPosition(new T.Vector3()).project(camera),ax=(p.x*.5+.5)*innerWidth,ay=(-p.y*.5+.5)*innerHeight;
   const width=166,right=false;
   let tx=innerWidth<=700?18:innerWidth*.31,ty=innerHeight*.49;
   tx=Math.max(18,Math.min(innerWidth-width-18,tx));ty=Math.max(90,Math.min(innerHeight-125,ty));
   annotation.style.transform=`translate(${tx}px,${ty}px)`;
   const sx=right?tx-10:tx+width+10,sy=ty+7,dx=sx-ax,dy=sy-ay,length=Math.hypot(dx,dy)||1;
   const ux=dx/length,uy=dy/length,segment=Math.min(24,length*.22),t=fragments.progress;
   dot.setAttribute('cx',ax);dot.setAttribute('cy',ay);
   origin.setAttribute('d',`M ${ax+ux*5} ${ay+uy*5} L ${ax+ux*(5+segment*t)} ${ay+uy*(5+segment*t)}`);
   const ex=sx-ux*segment,ey=sy-uy*segment;
   end.setAttribute('d',`M ${ex} ${ey} L ${ex+(sx-ex)*t} ${ey+(sy-ey)*t}`);
   const stamp=Date.parse(reading?.created_at),stale=Number.isFinite(stamp)&&Date.now()-stamp>60000;annotation.querySelector('.annotation-source').textContent=!Number.isFinite(reading?.heart_rate)?'READING UNAVAILABLE':source==='preview'?'PREVIEW READING':stale?'LAST READING · STALE':Number.isFinite(stamp)?'UPDATED '+String(Math.max(0,Math.floor((Date.now()-stamp)/1000))).padStart(2,'0')+' SEC AGO':'UPDATE TIME UNAVAILABLE';
  }
 }
 window.addEventListener('resize',()=>positionSelection());
 return {update,data,select:choose};
}
