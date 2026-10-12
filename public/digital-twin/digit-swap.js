

const records=new WeakMap();
const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
export function renderReading(element,{value,unit='',state=''}){
 const text=value==null?'—':String(value);
 let record=records.get(element);
 if(!record||!element.contains(record.visual)){
  element.replaceChildren();
  const number=document.createElement('span');number.className='digit-swap';
  const accessible=document.createElement('span');accessible.className='digit-swap-accessible';
  const visual=document.createElement('span');visual.className='digit-swap-visual';visual.setAttribute('aria-hidden','true');
  const suffix=document.createElement('small'),status=document.createElement('span');status.className='movement-state';
  number.append(accessible,visual);element.append(number,suffix,status);
  record={accessible,visual,suffix,status,slots:new Map(),text:null};records.set(element,record);
 }
 record.suffix.textContent=unit;record.suffix.hidden=!unit;record.status.textContent=state;record.status.hidden=!state;
 if(record.text===text)return;
 const previous=Number(record.text?.replaceAll(',','')),next=Number(text.replaceAll(',',''));
 const direction=Number.isFinite(previous)&&Number.isFinite(next)&&next<previous?-1:1;
 const animate=record.text!==null&&!motionPreference.matches;
 const pivot=text.includes('.')?text.indexOf('.'):text.length;
 const keep=new Set();
 Array.from(text).forEach((character,index)=>{
  const key=index-pivot;keep.add(key);
  let slot=record.slots.get(key);
  if(!slot){const node=document.createElement('span');node.className='digit-swap-slot';slot={node,character:null};record.slots.set(key,slot);}
  record.visual.append(slot.node);
  slot.node.classList.toggle('punctuation',character===','||character==='.');
  if(slot.character===character)return;
  
  for(const child of slot.node.children){for(const animation of child.getAnimations())animation.cancel();}
  slot.node.replaceChildren();
  const glyph=document.createElement('span');glyph.className='digit-swap-glyph';glyph.textContent=character;
  if(animate){
   if(slot.character!==null){const outgoing=document.createElement('span');outgoing.className='digit-swap-glyph';outgoing.textContent=slot.character;slot.node.append(outgoing);const exit=outgoing.animate([{opacity:1,transform:'translateY(0)'},{opacity:0,transform:`translateY(${-direction*45}%)`}],{duration:180,easing:'cubic-bezier(.2,.8,.2,1)',fill:'both'});exit.onfinish=()=>outgoing.remove();}
   slot.node.append(glyph);glyph.animate([{opacity:0,transform:`translateY(${direction*45}%)`},{opacity:1,transform:'translateY(0)'}],{duration:180,delay:Math.min(index*6,36),easing:'cubic-bezier(.2,.8,.2,1)',fill:'backwards'});
  }else slot.node.append(glyph);
  slot.character=character;
 });
 for(const [key,slot] of record.slots)if(!keep.has(key)){slot.node.remove();record.slots.delete(key);}
 record.accessible.textContent=text;record.text=text;
}
