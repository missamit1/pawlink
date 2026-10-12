import {updateTelemetry,exploreSystem,setTwinHologram} from './twin-scene.js?v=119';
const systems={heart:'heart',hydration:'water',movement:'steps',temperature:'thermal',overview:'overview'};
if(new URLSearchParams(location.search).has('embed')||window.self!==window.top){
 document.body.dataset.embed='dashboard';
}

window.pawlinkDigitalTwin=Object.freeze({
 updateTelemetry(snapshot){updateTelemetry(snapshot??{}, {source:'external',connection:'unknown'});},
 selectSystem(system){if(systems[system])exploreSystem(systems[system]);},
 returnToRay(){document.querySelector('#return-ray')?.click();},
 setHologram(active){setTwinHologram(!!active);},
 isHologram(){return document.body.dataset.twinState==='revealing'||document.body.dataset.twinState==='hologram';},
 
 setArchiveMode(open){
  if(open) document.body.dataset.archive='open';
  else delete document.body.dataset.archive;
  const cue=document.querySelector('#proof-cue');
  const rayUi=document.querySelector('#ray-react-ui');
  const apply=(el)=>{
   if(!el) return;
   if(open){
    el.setAttribute('hidden','');
    el.setAttribute('aria-hidden','true');
    el.style.setProperty('display','none','important');
    el.style.setProperty('visibility','hidden','important');
    el.style.setProperty('opacity','0','important');
   }else{
    el.removeAttribute('hidden');
    el.removeAttribute('aria-hidden');
    el.style.removeProperty('display');
    el.style.removeProperty('visibility');
    el.style.removeProperty('opacity');
   }
  };
  apply(cue);
  apply(rayUi);
 },
});
window.dispatchEvent(new Event('pawlink:digital-twin-ready'));

const archiveObserver=new MutationObserver(()=>{
 if(document.body.dataset.archive!=='open') return;
 const cue=document.querySelector('#proof-cue');
 const rayUi=document.querySelector('#ray-react-ui');
 if(cue&&!cue.hasAttribute('hidden')) window.pawlinkDigitalTwin.setArchiveMode(true);
 if(rayUi&&document.body.dataset.archive==='open'&&getComputedStyle(rayUi).display!=='none'){
  window.pawlinkDigitalTwin.setArchiveMode(true);
 }
});
archiveObserver.observe(document.body,{childList:true,subtree:true});

if(new URLSearchParams(location.search).get('calibrate')==='1'){
 import('./ray-placement-calibrate.js?v=11').then((m)=>m.mountRayPlacementCalibrate()).catch((err)=>{
  console.warn('[PawLink DEV] composition editor failed to mount', err);
 });
}
