(()=>{
const frame=document.querySelector('#dogWorld'),stage=document.querySelector('.cinema');if(!frame||!stage)return;
const hint=document.createElement('div');hint.className='canvas-flow-hint';hint.setAttribute('role','status');document.body.append(hint);
let active=false,ready=false,leaving=false,elapsed=0,last=performance.now(),touchY=null,boundDoc=null;
function visible(){return stage.dataset.edit==='complete'&&frame.hasAttribute('src');}
function advance(e){if(!active||!ready||leaving)return; e?.preventDefault();e?.stopImmediatePropagation();leaving=true;hint.textContent='A little closer…';document.body.classList.add('canvas-flow-leaving');setTimeout(()=>location.assign('/story'),matchMedia('(prefers-reduced-motion: reduce)').matches?0:650);}
function bind(){try{const doc=frame.contentDocument;if(!doc||doc===boundDoc)return;boundDoc=doc;doc.addEventListener('wheel',e=>{if(e.deltaY>8)advance(e);},{capture:true,passive:false});doc.addEventListener('touchstart',e=>{touchY=e.touches[0]?.clientY;},{passive:true,capture:true});doc.addEventListener('touchmove',e=>{if(touchY!==null&&touchY-e.touches[0].clientY>45)advance(e);},{passive:false,capture:true});doc.addEventListener('keydown',e=>{if(['ArrowDown','PageDown',' '].includes(e.key))advance(e);},true);}catch{}}
frame.addEventListener('load',bind);bind();
addEventListener('wheel',e=>{if(e.deltaY>8)advance(e);},{passive:false,capture:true});
addEventListener('keydown',e=>{if(!document.querySelector('dialog[open]')&&['ArrowDown','PageDown',' '].includes(e.key))advance(e);},true);
setInterval(()=>{const now=performance.now(),on=visible()&&!!boundDoc;if(!on){active=false;ready=false;elapsed=0;hint.hidden=true;}else{if(!active){active=true;elapsed=0;}else if(!document.hidden)elapsed+=Math.min(now-last,250);ready=elapsed>=8000;hint.hidden=false; if(!leaving)hint.textContent=ready?'SCROLL TO CONTINUE ↓':'MOVE TO EXPLORE · '+Math.max(1,Math.ceil((8000-elapsed)/1000))+'s';}last=now;},100);
})();
