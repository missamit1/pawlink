
const labels={heart:['01','HEART','The rhythm within.'],water:['02','HYDRATION','A quieter current.'],steps:['03','MOVEMENT','Every step, connected.'],thermal:['04','TEMPERATURE','Warmth, understood.']};
export function spatialContext(){
 const chapter=document.createElement('div');chapter.className='spatial-chapter';chapter.innerHTML='<span></span><p></p>';document.body.append(chapter);
 const scan=document.createElement('div');scan.className='scan-caption';scan.setAttribute('aria-hidden','true');document.body.append(scan);
 let stamp=null,source='unavailable',lastSecond=-1,lastMode='';
 const captions={heart:'Heart-rate reading',water:'Hydration reading · optical interpretation',steps:'Measured steps · reported activity',thermal:'Single sensor reading · not a thermal image'};
 for(const [id,key] of [['heartMark','heart'],['waterMark','water'],['feetMark','steps'],['temperatureMark','thermal']]){
  const el=document.getElementById(id);el.tabIndex=-1;el.querySelector('.marker-copy').insertAdjacentHTML('beforeend','<span class="reading-context"></span><span class="reading-age"></span>');el.querySelector('.reading-context').textContent=captions[key];
 }
 return {
  received(reading,origin){stamp=typeof reading.created_at==='string'?Date.parse(reading.created_at):NaN;source=origin;lastSecond=-1;},
  update(mode,progress,phase){
   if(lastMode!==mode){lastMode=mode;const data=labels[mode];chapter.hidden=!data;if(data){chapter.querySelector('span').textContent=data[0]+' / '+data[1];chapter.querySelector('p').textContent=data[2];}}
   scan.hidden=phase!=='reveal'||progress<.01||progress>.995;
   scan.textContent=progress<.25?'A SIGNAL. A CONNECTION.':progress<.65?'SEEING BENEATH THE FAMILIAR.':'HIS WORLD, WITHIN.';
   const second=Math.floor(Date.now()/1000);if(second!==lastSecond){lastSecond=second;const age=Number.isFinite(stamp)?Math.max(0,Math.floor((Date.now()-stamp)/1000)):null;
    const text=['demo','preview'].includes(source)?'PREVIEW READING':age===null?'AWAITING SENSOR UPDATE':age<60?'UPDATED '+String(age).padStart(2,'0')+' SEC AGO':(age>60?'STALE · ':'')+'UPDATED '+Math.floor(age/60)+' MIN AGO';
    document.querySelectorAll('.reading-age').forEach(el=>el.textContent=text);
   }
  }
 };
}
