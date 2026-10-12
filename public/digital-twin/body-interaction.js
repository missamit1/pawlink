import * as T from 'three';
import {gsap} from './dist/motion.js?v=34';
import {HoldIntent} from './hold-intent.js';
export function bodyInteraction({renderer,camera,getDog,signals,setAppearance}){
 const canvas=renderer.domElement,raycaster=new T.Raycaster(),pointer=new T.Vector2(),value={p:0};let skin=null,heldId=null,pending=null,keyboard=false,last=0;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const timeline=gsap.timeline({paused:true}).to(value,{p:1,duration:reduced?.7:4.4,ease:'none'});
 const intent=new HoldIntent(v=>{setAppearance(v);if(v)timeline.timeScale(1).play();else timeline.timeScale(1.35).reverse();});
 canvas.tabIndex=0;canvas.setAttribute('role','button');canvas.setAttribute('aria-label','See within Ray');canvas.setAttribute('aria-describedby','proof-cue');canvas.style.touchAction='pan-y';
 const cue=document.createElement('p');cue.id='proof-cue';cue.innerHTML='PRESS + HOLD RAY<br><span>TO SEE WITHIN</span>';document.body.append(cue);
 const back=document.querySelector('#return-ray');back.onclick=()=>{intent.close();canvas.focus();};
 
 function isCoatHit(h){return h.object.isMesh&&!h.object.userData.innerEnvelope;}
 function preferCoat(root){let skinned=null,mesh=null;root?.traverse(o=>{if(!o.isMesh||o.userData.innerEnvelope)return;if(o.isSkinnedMesh&&!skinned)skinned=o;else if(!mesh)mesh=o;});return skinned||mesh;}
 function pick(x,y){pointer.set(x/innerWidth*2-1,-y/innerHeight*2+1);raycaster.setFromCamera(pointer,camera);return getDog()?raycaster.intersectObject(getDog(),true).find(isCoatHit):null;}
 function origin(hit){if(value.p>0)return;skin=hit.object;const a=new T.Vector3(),b=new T.Vector3(),c=new T.Vector3();skin.getVertexPosition(hit.face.a,a);skin.getVertexPosition(hit.face.b,b);skin.getVertexPosition(hit.face.c,c);const local=skin.worldToLocal(hit.point.clone()),weights=new T.Vector3();T.Triangle.getBarycoord(local,a,b,c,weights);const attr=skin.geometry.attributes.position;signals.origin.value.set(0,0,0).addScaledVector(a.fromBufferAttribute(attr,hit.face.a),weights.x).addScaledVector(b.fromBufferAttribute(attr,hit.face.b),weights.y).addScaledVector(c.fromBufferAttribute(attr,hit.face.c),weights.z);}
 function begin(hit,id){origin(hit);heldId=id;intent.begin();cue.classList.add('discovered');if(id!==null)canvas.setPointerCapture(id);}
 function release(){clearTimeout(pending?.timer);pending=null;intent.release(value.p);heldId=null;keyboard=false;}
 canvas.addEventListener('pointerdown',e=>{if(e.button!==0||intent.locked)return;const hit=pick(e.clientX,e.clientY);if(!hit)return;if(e.pointerType==='touch'){pending={x:e.clientX,y:e.clientY,timer:setTimeout(()=>{pending=null;const fresh=pick(e.clientX,e.clientY);if(fresh)begin(fresh,e.pointerId);},160)};}else{e.preventDefault();begin(hit,e.pointerId);}});
 canvas.addEventListener('pointermove',e=>{if(pending&&Math.hypot(e.clientX-pending.x,e.clientY-pending.y)>9){clearTimeout(pending.timer);pending=null;}if(e.pointerType!=='touch'&&!intent.held)canvas.style.cursor=pick(e.clientX,e.clientY)?'pointer':'default';});
 canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);canvas.addEventListener('lostpointercapture',()=>{if(intent.held)release();});window.addEventListener('blur',release);document.addEventListener('visibilitychange',()=>{if(document.hidden)release();});canvas.addEventListener('contextmenu',e=>e.preventDefault());
 canvas.addEventListener('keydown',e=>{if(['Space','Enter'].includes(e.code)&&!e.repeat){e.preventDefault();keyboard=true;if(value.p===0){skin=preferCoat(getDog());const curled=document.body.dataset.pose==='sleeping'||document.body.dataset.pose==='resting';signals.origin.value.set(curled?-.05:.065,curled?.18:.46,curled?.12:.20);}intent.explore();cue.classList.add('discovered');}if(e.code==='Escape')intent.close();});
 return {get holding(){return intent.held;},get locked(){return intent.locked;},release,explore(){intent.explore();},state:()=>({progress:value.p,locked:intent.locked,held:intent.held,origin:signals.origin.value.toArray()}),captureProgress(p){timeline.pause().progress(p);signals.progress.value=value.p;},updateAnatomyFrame(bone){if(!skin)skin=preferCoat(getDog());if(!skin?.skeleton||!bone)return;const i=skin.skeleton.bones.indexOf(bone);if(i>=0)signals.worldToRest.value.copy(skin.bindMatrixInverse).multiply(new T.Matrix4().copy(skin.skeleton.boneInverses[i]).invert()).multiply(new T.Matrix4().copy(bone.matrixWorld).invert());},tick(){signals.progress.value=value.p;intent.sample(value.p);document.body.dataset.experience=intent.locked&&value.p===1?'explore':value.p>0?'reveal':'portrait';back.hidden=!intent.locked;canvas.setAttribute('aria-pressed',String(intent.locked));return value.p;}};
}
