import {smoothWalkingClip,walkingWeight} from './gait-refinement.js?v=60';
import {bodyZones} from './twin-body-zones.js?v=51';
import {heartInterface} from './twin-interface.js?v=68';
import {addInnerEnvelope} from './twin-envelope.js?v=57';
import {bodyMaskSignals,maskAnatomy,maskGLSL} from './body-mask.js';
import {bodyInteraction} from './body-interaction.js?v=63';
import {normalizeTelemetry,isStale} from './telemetry.js';
import {spatialContext} from './spatial-context.js?v=31';
import {fluidReveal} from './fluid-reveal.js?v=27';
import {renderReading} from './digit-swap.js?v=25';
import * as T from 'three';
import {SIGNATURE_SCAN,createScanSignals,updateScanPlane,scanGLSL} from './signature-scan.js?v=76';
import {coatOptics,stageReflection,holographicHeart} from './twin-optics.js?v=84';
import {advancePulse} from './reveal.js?v=19';
import {SignatureReveal} from './dist/motion.js?v=34';
import {isolatedBloom} from './isolated-bloom.js?v=24';
import {GLTFLoader} from './vendor/loaders/GLTFLoader.js';
import {OrbitControls} from './vendor/controls/OrbitControls.js';
import {RoomEnvironment} from './vendor/environments/RoomEnvironment.js';
import {MACBOOK_16,ULTRAWIDE,pickDashboardPreset,matchPreset,snapshotFromPreset,applyPresetBackground} from './composition-lock.js?v=12';
// Embed is set on body after this module loads — read the URL now so gait never freezes on Dashboard.
const isDashboardEmbed=new URLSearchParams(location.search).has('embed')||window.self!==window.top;
const renderer=new T.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.shadowMap.autoUpdate=false;renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;document.body.prepend(renderer.domElement);
const scene=new T.Scene();scene.fog=new T.Fog(0x252923,5,12);const camera=new T.PerspectiveCamera(36,innerWidth/innerHeight,.01,30);camera.position.set(1.35,.70,2.0);
const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,.38,0);controls.enabled=false;controls.enableDamping=false;controls.enableRotate=false;controls.enableZoom=false;controls.enablePan=false;controls.minDistance=2.05;controls.maxDistance=2.8;controls.minPolarAngle=1.20;controls.maxPolarAngle=1.40;controls.minAzimuthAngle=-.8;controls.maxAzimuthAngle=1.5;controls.rotateSpeed=.3;controls.zoomSpeed=.35;
const pm=new T.PMREMGenerator(renderer);scene.environment=pm.fromScene(new RoomEnvironment(),.04).texture;
// Warm architectural key with a soft, neutral fill; the coat stays recognizably white.
scene.add(new T.HemisphereLight(0xfff1e0,0x75604c,.78));
const light=new T.DirectionalLight(0xffdfbd,2.05);light.position.set(-2,3,2);light.castShadow=true;
light.shadow.mapSize.set(1024,1024);Object.assign(light.shadow.camera,{left:-1.1,right:1.1,top:1.3,bottom:-.9,near:.1,far:8});light.shadow.bias=-.00035;light.shadow.normalBias=.028;light.shadow.radius=3;scene.add(light);
const fill=new T.DirectionalLight(0xf1e7e3,.65);fill.position.set(2,1,2);scene.add(fill);
const rim=new T.DirectionalLight(0xffd6b1,.55);rim.position.set(-1,1.4,-2);scene.add(rim);
// Soft thoracic glow — only when heart anatomy is revealed (does not alter outer coat)
const chestGlow=new T.PointLight(0xff9a8a,0,.95,2);chestGlow.position.set(-.02,.45,.08);scene.add(chestGlow);
let telemetry={heart_rate:null,hydration:null,steps:null,activity:null,activity_state:null,temperature:null,latitude:null,longitude:null,created_at:null};let pulsePhase=0,modeChanged=0;const clock=new T.Clock(),uniforms={bloomPass:{value:0},noiseAmount:{value:.045},noiseScale:{value:12},edgeSoftness:{value:.065},flowAmount:{value:.018},flowSpeed:{value:.10},fresnelIntensity:{value:.52},bloomStrength:{value:.24},heartLight:{value:1.15},amount:{value:0},time:{value:0},focus:{value:0},scan:{value:0},bodyAmount:{value:0},heartReveal:{value:0},water:{value:0},thermal:{value:0},activity:{value:0},hydration:{value:.82},temperature:{value:.56},pulse:{value:0},motion:{value:matchMedia('(prefers-reduced-motion: reduce)').matches?0:1}};const coatMaterials=[];let gaitWeight=()=>{};let dog,mixer,bones={},paused=false,hologram=false,mode='overview',elapsed=0,stepCount=0;
uniforms.body=bodyMaskSignals();uniforms.completeTwin={value:0};uniforms.scanSignals=createScanSignals();
if(SIGNATURE_SCAN){document.body.dataset.scanPath='signature-peel';console.info('[PawLink] Signature Peel R&D · opt-in only (?scan=signature)');}
else{document.body.dataset.scanPath='normal';}
const fluid=fluidReveal(renderer,uniforms);
const glowMat=(color,opacity=1)=>new T.MeshBasicMaterial({color,transparent:true,opacity,depthWrite:false,blending:T.AdditiveBlending});
// A softly lit architectural studio, independent of the PawLink application.
// Contact plane: just under paw pads. Follows measured support so feet read planted
// without changing locked Ray bake position (Dashboard composition).
const CONTACT_Y=-.018;
const SHADOW_UNDER=.0032;
const ground=new T.Mesh(new T.PlaneGeometry(1.5,1.4),new T.ShadowMaterial({color:0x503829,opacity:.15}));ground.rotation.x=-Math.PI/2;ground.position.y=CONTACT_Y-SHADOW_UNDER;ground.receiveShadow=true;ground.material.depthWrite=false;scene.add(ground);
const shadowCanvas=document.createElement('canvas');shadowCanvas.width=shadowCanvas.height=256;const sc=shadowCanvas.getContext('2d');const sg=sc.createRadialGradient(128,128,5,128,128,125);sg.addColorStop(0,'rgba(37,29,21,.9)');sg.addColorStop(.15,'rgba(37,29,21,.84)');sg.addColorStop(.42,'rgba(37,29,21,.62)');sg.addColorStop(1,'rgba(37,29,21,0)');sc.fillStyle=sg;sc.fillRect(0,0,256,256);const shadow=new T.Mesh(new T.PlaneGeometry(.85,.65),new T.MeshBasicMaterial({map:new T.CanvasTexture(shadowCanvas),transparent:true,depthWrite:false,depthTest:true,polygonOffset:true,polygonOffsetFactor:1,polygonOffsetUnits:1}));shadow.rotation.x=-Math.PI/2;shadow.position.y=CONTACT_Y-SHADOW_UNDER-.001;shadow.material.opacity=.22;scene.add(shadow);
const pawShadows=Array.from({length:4},()=>{const m=new T.Mesh(new T.PlaneGeometry(.12,.16),new T.MeshBasicMaterial({map:shadow.material.map,transparent:true,depthWrite:false,depthTest:true,polygonOffset:true,polygonOffsetFactor:1,polygonOffsetUnits:1,opacity:.62}));m.rotation.x=-Math.PI/2;m.position.y=CONTACT_Y-SHADOW_UNDER;m.renderOrder=-1;scene.add(m);return m;});const pawSurface=Array.from({length:4},()=>new T.Vector3());let supportSamples=[];const groundPoint=new T.Vector3();
function syncContactPlane(supportY){
  if(!Number.isFinite(supportY)) return;
  const under=supportY-SHADOW_UNDER;
  ground.position.y=under;
  shadow.position.y=under-.001;
}
const stone=new T.MeshStandardMaterial({color:0x30372f,roughness:.85});
for(const x of [-3,-1.9,1.6,3]){const column=new T.Mesh(new T.BoxGeometry(.24,4,.34),stone);column.position.set(x,1.7,-2);column.visible=false;scene.add(column)}
const wall=new T.Mesh(new T.PlaneGeometry(18,8),stone);wall.position.set(0,2,-4);wall.visible=false;scene.add(wall);
const dust=new T.Group();scene.add(dust);
// Both anatomy objects below are loaded from the user's supplied GLB files.
const ribFrame={value:new T.Matrix4()};const heart=new T.Group(),ribs=new T.Group();heart.name='PawLinkHeart';ribs.name='PawLinkRibs';heart.visible=ribs.visible=false;scene.add(heart,ribs);let heartMesh=null;
// Optical depth behind the anatomy; a contained thoracic volume, not a second dog.
const interior=new T.Mesh(new T.SphereGeometry(1,32,24),new T.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{reveal:uniforms.heartReveal},vertexShader:`varying vec3 n;varying vec3 v;void main(){vec4 p=modelViewMatrix*vec4(position,1.);n=normalize(normalMatrix*normal);v=-p.xyz;gl_Position=projectionMatrix*p;}`,fragmentShader:`varying vec3 n;varying vec3 v;uniform float reveal;void main(){float thickness=pow(abs(dot(normalize(n),normalize(v))),.7);gl_FragColor=vec4(vec3(.12,.24,.23),thickness*.19*reveal);}` }));interior.scale.set(.087,.112,.128);interior.renderOrder=0;scene.add(interior);
Object.assign(interior.material.uniforms,{uBodyOrigin:uniforms.body.origin,uBodyProgress:uniforms.body.progress,uBodyWorldToRest:uniforms.body.worldToRest});
interior.material.vertexShader=interior.material.vertexShader.replace('varying vec3 n;','varying vec3 w;varying vec3 n;').replace('gl_Position=','w=(modelMatrix*vec4(position,1.)).xyz;gl_Position=');
interior.material.fragmentShader=maskGLSL+'\nuniform mat4 uBodyWorldToRest;varying vec3 w;'+interior.material.fragmentShader.replace('thickness*.19*reveal','thickness*.20*reveal*bodyMask((uBodyWorldToRest*vec4(w,1.)).xyz,.028)').replace('vec3(.12,.24,.23)','vec3(.075,.085,.08)');
let anatomyReady=0,dogReady=false;
function ready(){if(dogReady&&anatomyReady===2){const l=document.querySelector('#loading');if(l){l.style.opacity=0;setTimeout(()=>l.remove(),700)}}}
function anatomyError(e){console.error(e);document.querySelector('#loading').innerHTML='An asset could not load.<small>Please reload to try again.</small>'}
function fitAsset(g,target,dimensions){
 const box=new T.Box3().setFromObject(g),size=box.getSize(new T.Vector3()),center=box.getCenter(new T.Vector3());
 const wrapper=new T.Group();g.position.sub(center);wrapper.add(g);wrapper.scale.set(dimensions[0]/size.x,dimensions[1]/size.y,dimensions[2]/size.z);target.add(wrapper);return wrapper;
}
new GLTFLoader().load('./heart.glb',g=>{
 fitAsset(g.scene,heart,[.077,.10,.062]);heart.rotation.set(.05,.25,-.15);
 g.scene.traverse(o=>{if(o.isMesh){heartMesh=o;o.material=holographicHeart(uniforms);if(!SIGNATURE_SCAN)maskAnatomy(o.material,uniforms.body,.045);o.renderOrder=SIGNATURE_SCAN?5:1;
 // Derived preview morph; original GLB remains untouched.
 const pos=o.geometry.attributes.position,bb=new T.Box3().setFromBufferAttribute(pos),c=bb.getCenter(new T.Vector3()),span=bb.max.y-bb.min.y,arr=new Float32Array(pos.array.length);
 for(let i=0;i<pos.count;i++){const x=pos.getX(i),y=pos.getY(i),z=pos.getZ(i),w=1-T.MathUtils.smoothstep((y-bb.min.y)/span,.45,1);const twist=.024*w,dx=x-c.x,dz=z-c.z;arr[i*3]=c.x+(dx*Math.cos(twist)-dz*Math.sin(twist))*(1-.06*w);arr[i*3+1]=y+span*.035*w;arr[i*3+2]=c.z+(dx*Math.sin(twist)+dz*Math.cos(twist))*(1-.045*w);}
 o.geometry.morphAttributes.position=[new T.BufferAttribute(arr,3)];o.updateMorphTargets();o.morphTargetDictionary={systole:0};
 }});anatomyReady++;ready();},undefined,anatomyError);
new GLTFLoader().load('./ribs.glb',g=>{
 fitAsset(g.scene,ribs,[.15,.28,.19]);ribs.rotation.set(-Math.PI/2,Math.PI,0);ribs.rotateOnWorldAxis(new T.Vector3(0,0,1),Math.PI/2);
 g.scene.traverse(o=>{if(o.isMesh){
  o.material=new T.MeshPhysicalMaterial(SIGNATURE_SCAN
   ?{color:0xe4d7c6,roughness:.72,metalness:0,transparent:false,opacity:1,depthWrite:true,depthTest:false,emissive:0x8a7a68,emissiveIntensity:.02}
   :{color:0xdce2d8,roughness:.28,metalness:.06,transparent:true,opacity:.26,depthWrite:false,clearcoat:.9,clearcoatRoughness:.14,envMapIntensity:1.25,emissive:0x7eb8ae,emissiveIntensity:.055});
  o.renderOrder=SIGNATURE_SCAN?4:2;o.material.userData.opticalEmission=!SIGNATURE_SCAN;o.material.onBeforeCompile=s=>{
 s.uniforms.uThorax=ribFrame;
 s.uniforms.uBloomPass=uniforms.bloomPass;
 Object.assign(s.uniforms,{uScanPlane:uniforms.scanSignals.plane,uSignatureMode:uniforms.scanSignals.mode,uScanActive:uniforms.scanSignals.active,uHeartDiscover:uniforms.scanSignals.discover});
 s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vAnatomyWorld; varying vec3 vScanWorld;').replace('#include <project_vertex>','#include <project_vertex>\nvAnatomyWorld=(modelMatrix*vec4(transformed,1.0)).xyz; vScanWorld=vAnatomyWorld;');
 s.fragmentShader=s.fragmentShader.replace('#include <common>','#include <common>\n'+scanGLSL+'\nuniform mat4 uThorax; uniform float uBloomPass; varying vec3 vAnatomyWorld;').replace('#include <opaque_fragment>',`
 if(uSignatureMode>.5){float cut=scanCut(vScanWorld);if(cut<.45)discard;}
 vec3 local=(uThorax*vec4(vAnatomyWorld,1.0)).xyz;float boundary=length(local/vec3(.105,.105,.16));if(boundary>1.0)discard;float ribDepth=smoothstep(-.08,.08,local.x);
 float ribEdge=pow(1.-abs(dot(normalize(normal),normalize(vViewPosition))),1.55);
 outgoingLight*=mix(.52,1.14,ribDepth);
 outgoingLight+=vec3(.82,.78,.70)*ribEdge*.48;
 outgoingLight+=vec3(.48,.74,.68)*pow(ribEdge,2.2)*.22;
 if(uSignatureMode>.5){outgoingLight=mix(outgoingLight,outgoingLight*vec3(1.05,.98,.90),.2);diffuseColor.a=1.0;}
 else{
  diffuseColor.a*=mix(.48,.95,ribDepth)*(1.0-smoothstep(.80,1.0,boundary));
  diffuseColor.a=max(diffuseColor.a,ribEdge*.38);
 }
 #include <opaque_fragment>
 if(uBloomPass>.5 && uSignatureMode<.5)gl_FragColor=vec4(vec3(.40,.60,.56)*ribEdge*.85,diffuseColor.a);
`);
 };o.material.customProgramCacheKey=()=>`ribs-holo-78-${SIGNATURE_SCAN?1:0}`;
 if(!SIGNATURE_SCAN)maskAnatomy(o.material,uniforms.body,.018);
 }});anatomyReady++;ready();},undefined,anatomyError);
// One continuous optical drop with a shaped liquid volume and a moving meniscus.
const drop=new T.Group();scene.add(drop);
const profile=new T.CubicBezierCurve(new T.Vector2(0,0),new T.Vector2(.070,.003),new T.Vector2(.025,.062),new T.Vector2(0,.115));
const pts=profile.getPoints(96);
const waterGlass=new T.MeshPhysicalMaterial({color:0xe4fbff,metalness:0,roughness:.055,transparent:true,opacity:.42,depthWrite:false,transmission:.97,thickness:.026,ior:1.333,clearcoat:1,clearcoatRoughness:.04,envMapIntensity:.8,attenuationColor:0x8ed7e8,attenuationDistance:.2});
const shell=new T.Mesh(new T.LatheGeometry(pts,96),waterGlass);drop.add(shell);
const waterPts=pts.filter(p=>p.y<.065).map(p=>new T.Vector2(p.x*.94,p.y+.002));
const surfaceY=waterPts[waterPts.length-1].y,surfaceRadius=waterPts[waterPts.length-1].x;
waterPts.push(new T.Vector2(0,surfaceY));
const liquid=new T.Mesh(new T.LatheGeometry(waterPts,80),new T.MeshPhysicalMaterial({color:0x458fa5,metalness:0,roughness:.12,transmission:.65,thickness:.035,ior:1.333,clearcoat:1,envMapIntensity:1.5,transparent:true,opacity:.85}));drop.add(liquid);
const liquidBase=Float32Array.from(liquid.geometry.attributes.position.array);
const footLights=Array.from({length:4},()=>{const o=new T.Mesh(new T.TorusGeometry(.012,.0018,6,32),glowMat(0x9fffe1,.25));scene.add(o);return o});
const footprints=[];function footprint(pos){const group=new T.Group(),mat=glowMat(0xdaf2e9,.18);const ring=new T.Mesh(new T.RingGeometry(.022,.02265,64),mat);ring.rotation.x=-Math.PI/2;group.add(ring);group.position.copy(pos);group.position.y=-.016;scene.add(group);footprints.push({group,mat,born:elapsed});}
let activePose='walking',requestedPose=null,poseRequest=0;let heartBone,heartOffset,ribOffset,heartRotation=new T.Quaternion(),ribRotation=new T.Quaternion(),feet=[];const chestRotation=new T.Quaternion();const heartPos=new T.Vector3(-.030,.443,.052),footPos=new T.Vector3(),lastPhases=[0,0,0,0];
const modelFiles={walking:'./dog.glb',sleeping:'./sleeping.glb',resting:'./resting.glb'};
function disposeDog(object){if(!object)return;object.traverse(o=>{if(o.isMesh){o.geometry.dispose();for(const m of Array.isArray(o.material)?o.material:[o.material]){for(const value of Object.values(m))if(value?.isTexture)value.dispose();m.dispose();}}});}
/** Three PropertyBinding treats `:` as reserved — `tripo::Spine_0` tracks never bind, so Ray freezes. */
function sanitizeGltfAnimationNames(root,animations=[]){
 const rename=new Map();
 root.traverse(o=>{
  if(!o.name||!o.name.includes(':'))return;
  const next=o.name.replaceAll(':','');
  rename.set(o.name,next);
  o.name=next;
 });
 for(const clip of animations){
  for(const track of clip.tracks){
   const dot=track.name.indexOf('.');
   if(dot<0)continue;
   const node=track.name.slice(0,dot);
   const prop=track.name.slice(dot);
   const next=rename.get(node)??(node.includes(':')?node.replaceAll(':',''):null);
   if(next)track.name=next+prop;
  }
 }
}
async function switchPose(state){
 // Missing state must not kill a live gait (empty host push used to set timeScale=0).
 if(!state){if(mixer&&telemetry.activity_state)mixer.timeScale=1;return;}
 const pose=state==='running'?'walking':state;fluid.reset();
 const note=document.querySelector('#pose-status');
 if(!modelFiles[pose]){if(!dog&&requestedPose)return;poseRequest++;requestedPose=null;if(mixer)mixer.timeScale=0;note.textContent='State unavailable · last pose retained';return;}
 if(requestedPose===pose)return;
 if(dog&&activePose===pose){poseRequest++;requestedPose=null;if(mixer)mixer.timeScale=1;note.textContent=state==='running'?'Running data · walking animation fallback':pose==='walking'?'Walking animation':'Breathing animation · chest heart view';return;}
 const token=++poseRequest;requestedPose=pose;note.textContent='Loading '+pose+'…';
 try{
 const g=await new GLTFLoader().loadAsync(modelFiles[pose]);
 if(token!==poseRequest){disposeDog(g.scene);return;}
 sanitizeGltfAnimationNames(g.scene,g.animations);
 const old=dog;if(mixer){mixer.stopAllAction();mixer.uncacheRoot(old);}if(old)scene.remove(old);
 coatMaterials.length=0;bones={};feet=[];dog=g.scene;activePose=pose;requestedPose=null;document.body.dataset.pose=pose;
 if(pose!=='walking'){
  const box=new T.Box3().setFromObject(dog),size=box.getSize(new T.Vector3()),c=box.getCenter(new T.Vector3());
  const scale=.83/Math.max(size.x,size.z);dog.scale.multiplyScalar(scale);dog.position.set(-c.x*scale,-.018-box.min.y*scale,-c.z*scale);
 }
 scene.add(dog);
// Cache possible contact vertices once, then evaluate the actual animated positions.
supportSamples=[];dog.traverse(o=>{if(!o.isMesh||o.userData.innerEnvelope)return;const pos=o.geometry.attributes.position;o.geometry.computeBoundingBox();const box=o.geometry.boundingBox;const limit=activePose==='walking'?.18:box.min.y+(box.max.y-box.min.y)*.38;const indices=[];for(let i=0;i<pos.count;i++)if(pos.getY(i)<=limit)indices.push(i);supportSamples.push({mesh:o,indices});});
dog.traverse(o=>{if(o.isBone)bones[o.name]=o;if(o.isMesh){o.castShadow=true;o.receiveShadow=false;o.frustumCulled=false;const materials=Array.isArray(o.material)?o.material:[o.material];materials.forEach(mat=>{coatMaterials.push(mat);mat.transparent=true;mat.depthWrite=true;o.renderOrder=SIGNATURE_SCAN?2:3;coatOptics(mat,uniforms,pose!=='walking');mat.needsUpdate=true;});}});

 addInnerEnvelope(dog,uniforms.body,uniforms.completeTwin);
 collarBone=Object.values(bones).find(b=>b.name.includes('Head_0'))||dog;collarOffset=collarBone.worldToLocal(new T.Vector3(0,.605,.255));
 heartBone=bones['tripoSpine_1']||Object.values(bones).find(b=>b.name.includes('Spine_1'))||dog;dog.updateMatrixWorld(true);heartOffset=heartBone.worldToLocal(pose==='walking'?heartPos.clone():new T.Vector3(-.12,.20,.035));heart.scale.setScalar(1);heart.rotation.set(.05,pose==='walking'?.25:-.35,pose==='walking'?-.15:-.65);ribOffset=heartBone.worldToLocal(pose==='walking'?new T.Vector3(0,.465,.075):new T.Vector3(-.08,.22,.05));
 heartBone.getWorldQuaternion(chestRotation);heartRotation.copy(chestRotation).invert().multiply(heart.quaternion);ribRotation.copy(chestRotation).invert().multiply(ribs.quaternion);
 const names=['tripo0_Left_Limb_4','bone_24','tripo1_Left_Limb_2','tripo0_Right_Limb_2'];feet=pose==='walking'?names.map(n=>bones[n]||Object.values(bones).find(b=>b.name.replaceAll(':','')===n)):[];
 const clip=g.animations.length?(pose==='walking'?smoothWalkingClip(g.animations[0]):g.animations[0]):null;
 gaitWeight=clip&&pose==='walking'?walkingWeight(dog,clip,feet):()=>{};
 mixer=new T.AnimationMixer(dog);if(clip)mixer.clipAction(clip).play();mixer.timeScale=(isDashboardEmbed||telemetry.activity_state)?1:0;
 footLights.forEach(o=>o.visible=pose==='walking');pawShadows.forEach(o=>o.visible=pose==='walking');for(const f of footprints){scene.remove(f.group);f.group.traverse(o=>o.geometry?.dispose());f.mat.dispose();}footprints.length=0;
 shadow.scale.set(pose==='walking'?1:1.08,pose==='walking'?1:.8,1);shadow.material.opacity=.68;shadow.position.z=pose==='walking'?0:.08;
 if(innerWidth>760){camera.position.set(1.35,.70,2.0);controls.target.set(0,.27,0);}else{camera.position.set(1.35,.70,2.0);controls.target.set(0,.27,0);}
 note.textContent=telemetry.activity_state==='running'?'Running data · walking animation fallback':pose==='walking'?'Walking animation':'Breathing animation · chest heart view';
 disposeDog(old);dogReady=true;ready();
 }catch(e){if(token!==poseRequest)return;requestedPose=null;note.textContent='Model unavailable — choose a state to retry';const l=document.querySelector('#loading');if(l)l.textContent='Unable to load model. Please reload.';console.error(e);}
}
switchPose(telemetry.activity_state||'walking');
const info={overview:['Ray, a living portrait','','Select a system to explore.'],heart:['The rhythm within','','Beneath the familiar, a rhythm all his own. Select a system to explore the connection.'],steps:['Made to wander','','Four paws. One unmistakable rhythm. Contact lights follow this illustrative walk cycle.'],thermal:['Warmth, understood','','A single temperature reading, shown in context. This is not a spatial thermal scan.'],water:['A little replenishment','','A fluid portrait of hydration. An illustrative value for the product concept, not a measurement.']};
const temperatureMark=document.createElement('button');temperatureMark.id='temperatureMark';temperatureMark.className='marker';temperatureMark.dataset.mode='thermal';document.body.append(temperatureMark);
const markerSpecs=[['heartMark','heart','Heart'],['feetMark','steps','Movement'],['waterMark','water','Hydration'],['temperatureMark','thermal','Temperature']];
const links=document.createElementNS('http://www.w3.org/2000/svg','svg');links.classList.add('body-links');links.setAttribute('aria-hidden','true');document.body.append(links);
const markerLinks={};
for(const [id,key,name] of markerSpecs){
 const el=document.getElementById(id),icon=document.querySelector('.tabs button[data-mode="'+key+'"] .symbol').innerHTML;
 el.innerHTML='<span class="marker-copy"><span class="marker-name">'+({heart:'01 / HEART',water:'02 / HYDRATION',steps:'03 / MOVEMENT',thermal:'04 / TEMPERATURE'}[key])+'</span><span class="marker-reading"></span></span><span class="marker-icon" aria-hidden="true">'+icon+'</span>';
 const path=document.createElementNS(links.namespaceURI,'path'),dot=document.createElementNS(links.namespaceURI,'circle');dot.setAttribute('r','2.5');links.append(path,dot);markerLinks[id]={path,dot};
}
function updateMarkers(){for(const [id,key,name] of markerSpecs){const el=document.getElementById(id);const reading=el.querySelector('.marker-reading');paintReading(reading,key);el.setAttribute('aria-label',name+': '+[reading.querySelector('.digit-swap-accessible').textContent,reading.querySelector('small').textContent,reading.querySelector('.movement-state').textContent].filter(Boolean).join(' ')+'. Explore '+name.toLowerCase());el.setAttribute('aria-pressed',String(mode===key));}}
function select(next){if(!info[next])return;if(next!=='overview'&&document.body.dataset.experience!=='explore')return;mode=next;updateMarkers();document.body.dataset.system=next;document.querySelector('#label').textContent=info[next][0];document.querySelector('#description').textContent=info[next][2];paintReading(document.querySelector('#value'),next);document.querySelectorAll('.tabs button,#system-navigation [data-mode]').forEach(b=>{b.classList.toggle('active',b.dataset.mode===next);b.setAttribute('aria-pressed',String(b.dataset.mode===next));});}
const reveal=new SignatureReveal();
function setAppearance(value){
 hologram=!!value;
 reveal.set(hologram,performance.now()/1000);
 const button=document.querySelector('#appearance');
 if(button){
  button.innerHTML=hologram?'Real <span>Digital Twin</span>':'<span>Real</span> Digital Twin';
  button.setAttribute('aria-pressed',String(hologram));
 }
 if(!hologram)select('overview');
 // Product host (Dashboard Location) shows Return to Ray while hologram is open.
 if(window.parent&&window.parent!==window){
  try{
   window.parent.postMessage(
    {type:'pawlink:hologram',active:hologram},
    window.location.origin,
   );
  }catch{/* cross-origin ignore */}
 }
}
export function setTwinHologram(value){setAppearance(!!value);}
document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>select(b.dataset.mode));document.querySelector('#appearance').onclick=()=>setAppearance(!hologram);document.querySelector('#pause').onclick=e=>{paused=!paused;e.currentTarget.querySelector('span').textContent=paused?'Resume motion':'Pause motion';};document.querySelector('#overview').onclick=()=>{camera.position.set(1.35,.70,2.0);controls.target.set(0,.27,0);select('overview');};
const context=spatialContext();
const interaction=bodyInteraction({renderer,camera,getDog:()=>dog,signals:uniforms.body,setAppearance,select});
let requestedSystem=null;

let hoveredBody='',hoverFlash=0;
const resolveBodyZone=bodyZones({getDog:()=>dog,getHeart:()=>heart,getFeet:()=>feet,getPaws:()=>pawSurface});
const heartUI=heartInterface({hitZone:resolveBodyZone,onHover:key=>{if(key!==hoveredBody){hoveredBody=key;hoverFlash=key?1:0;}},canvas:renderer.domElement,camera,getDog:()=>dog,getHeart:()=>heart,getState:interaction.state,getAnchor:key=>key==='steps'?(pawSurface[0].y<pawSurface[1].y?pawSurface[0]:pawSurface[1]):key==='water'?ribs.position:heart.position.clone().add(new T.Vector3(0,.10,-.06)),select});
function project(el,pos){
 const p=pos.clone().project(camera);let x=(p.x*.5+.5)*innerWidth,y=(-p.y*.5+.5)*innerHeight;
 if(innerWidth<=700){const width=Math.min(180,innerWidth-40);el.style.width=width+'px';x=24;y=innerHeight*.70;}
 else{el.style.width='';x=innerWidth*(el.id==='heartMark'?.27:.69);y=innerHeight*(el.id==='feetMark'?.57:.42);x=Math.min(x,innerWidth-el.offsetWidth-30);}
 x=Math.max(12,Math.min(innerWidth-el.offsetWidth-12,x));y=Math.max(12,Math.min(innerHeight-el.offsetHeight-12,y));
 el.style.transform=`translate(${x}px,${y}px)`;el.style.opacity=labelAmount;
 const chosen=el.id==='heartMark'?(mode==='heart'||(mode==='overview'&&interaction.holding)):el.id==='feetMark'?mode==='steps':el.id==='waterMark'?mode==='water':mode==='thermal';
 const visible=chosen&&hologram&&labelAmount>.95&&p.z<1;el.style.pointerEvents=visible?'auto':'none';el.style.visibility=visible?'visible':'hidden';el.tabIndex=-1;
 const link=markerLinks[el.id],anchor=(el.id==='heartMark'?heart.position:pos).clone().project(camera);
 const ax=(anchor.x*.5+.5)*innerWidth,ay=(-anchor.y*.5+.5)*innerHeight;
 const sx=el.id==='heartMark'?x+el.offsetWidth:x,sy=y+el.offsetHeight*.70;
 if(el.id==='feetMark'){const dx=sx-ax,dy=sy-ay,length=Math.hypot(dx,dy)||1;link.path.setAttribute('d',`M ${sx} ${sy} l -22 0 M ${ax+dx/length*5} ${ay+dy/length*5} l ${dx/length*24} ${dy/length*24}`);}else link.path.setAttribute('d',`M ${sx} ${sy} C ${(sx+ax)/2} ${sy}, ${(sx+ax)/2} ${ay}, ${ax} ${ay}`);
 link.dot.setAttribute('cx',ax);link.dot.setAttribute('cy',ay);
 const opacity=visible&&innerWidth>700?(el.getAttribute('aria-pressed')==='true'?.75:.32):0;
 link.path.style.opacity=link.dot.style.opacity=opacity;

}
let contextZoom=1;
const stageAnchor=new T.Vector3(0,-.018,.06);
/* Default framing — MacBook 16 lock uses exact HUD bake only on that viewport. */
let HERO_SCALE=.85;
const PAW_DOCK_AIR=30;
const DOCK_BOTTOM_PX=20;
const DOCK_HEIGHT_PX=154;
const PAW_BELOW_ANCHOR=53;
let rayCal=null;
let lockedBgId=null;
function computeDefaultStageY(heroScale){
 const mobile=innerWidth<=700;
 if(mobile)return innerHeight*.72;
 const pawOffset=PAW_BELOW_ANCHOR*(heroScale??HERO_SCALE);
 const dockTop=innerHeight-DOCK_BOTTOM_PX-DOCK_HEIGHT_PX;
 return dockTop-PAW_DOCK_AIR-pawOffset;
}
function computeDefaultFrameX(){
 return innerWidth<=700?innerWidth*.555:innerWidth*.52;
}
function ensureCompositionLock(){
 if(!dog||innerWidth<=700)return;
 if(rayCal?.fromEditor)return;
 // Dashboard: MacBook lock by default; clearly ultrawide → existing ULTRAWIDE bake.
 // Never unlock to default centered framing on desktop embed.
 const preset=
  document.body?.dataset?.embed==='dashboard'
   ? pickDashboardPreset(innerWidth,innerHeight)
   : matchPreset(innerWidth,innerHeight);
 if(!preset){
  if(rayCal?.fromLock)rayCal=null;
  lockedBgId=null;
  return;
 }
 const snap=snapshotFromPreset(preset,{w:innerWidth,h:innerHeight});
 HERO_SCALE=snap.heroScale;
 if(!rayCal||rayCal.fromLock){
  rayCal={active:true,...snap,baseline:{...snap},codeDefaults:{...snap},fromLock:true,lockId:preset.id};
 }
 dog.position.set(rayCal.x,rayCal.y,rayCal.z);
 dog.scale.setScalar(rayCal.scale);
 dog.updateMatrixWorld(true);
 // Re-apply on every lock/resize so plate size tracks the live iframe.
 applyPresetBackground(preset,document.body);
 lockedBgId=preset.id;
}
function alignStage(){
 const mobile=innerWidth<=700;
 ensureCompositionLock();
 const heroScale=Number.isFinite(window.__pawlinkHeroScale)?window.__pawlinkHeroScale:HERO_SCALE;
 camera.zoom=mobile?.62:contextZoom*heroScale;
 camera.clearViewOffset();camera.updateMatrixWorld();camera.updateProjectionMatrix();
 const anchor=stageAnchor.clone().project(camera);
 const stageY=rayCal?.active?rayCal.frameY:computeDefaultStageY(heroScale);
 const targetX=rayCal?.active&&Number.isFinite(rayCal.frameX)?rayCal.frameX:computeDefaultFrameX();
 const x=(anchor.x*.5+.5)*innerWidth-targetX;
 const y=(-anchor.y*.5+.5)*innerHeight-stageY;
 camera.setViewOffset(innerWidth,innerHeight,x,y,innerWidth,innerHeight);
 camera.updateProjectionMatrix();
}
window.__pawlinkSetHeroScale=s=>{HERO_SCALE=s;window.__pawlinkHeroScale=s;alignStage();};
function resize(){camera.aspect=innerWidth/innerHeight;renderer.setSize(innerWidth,innerHeight);alignStage();}addEventListener('resize',resize);resize();
const reflection=stageReflection(renderer,scene,camera);
const finishing=isolatedBloom(renderer,scene,camera,uniforms);addEventListener("resize",()=>finishing.resize());
let labelAmount=0;let collarBone,collarOffset;const collarRotation=new T.Quaternion();
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const contactDown=[false,false,false,false];
const collarSignal=new T.Mesh(new T.TorusGeometry(.055,.0015,8,48),glowMat(0xe3f9ec,0));scene.add(collarSignal);collarSignal.visible=false;
renderer.setAnimationLoop(()=>{const realDt=clock.getDelta(),dt=Math.min(realDt,.05);elapsed+=realDt;uniforms.time.value=elapsed;
 const stale=isStale(telemetry);document.body.dataset.dataFreshness=stale?'stale':telemetry.created_at?'current':'unknown';
 const p=interaction.tick();
 const liveBpm=Number.isFinite(telemetry.heart_rate)&&!stale?telemetry.heart_rate:null;
 const heartLikely=SIGNATURE_SCAN?p>.02:p>.08;
 const bpmForPulse=liveBpm??(heartLikely?74:null);
 const heartbeat=advancePulse(pulsePhase,realDt,bpmForPulse);pulsePhase=heartbeat.phase;heartUI.update(realDt);if(requestedSystem&&interaction.locked&&p===1){heartUI.select(requestedSystem);requestedSystem=null;}
 updateScanPlane(uniforms.scanSignals,p,dog,heart);
 // Signature: unlock radial body-mask so the plane alone reveals anatomy.
 if(SIGNATURE_SCAN&&p>0)uniforms.body.progress.value=1;
 uniforms.completeTwin.value=T.MathUtils.damp(uniforms.completeTwin.value,interaction.locked&&p===1?1:0,reduced?1000:4.5,realDt);
 const frame=SIGNATURE_SCAN
  ?{coat:p>0?1:0,scan:p,heart:p>.02?1:0,ribs:p>.02?1:0,labels:0,collar:0}
  // Sleep/rest: hologram coat first, then ribs, heart last (same end look as walking).
  : activePose!=='walking'
    ?{coat:p>0?1:0,scan:p,heart:T.MathUtils.smoothstep(p,.48,.82),ribs:T.MathUtils.smoothstep(p,.22,.52),labels:0,collar:0}
    :{coat:p>0?1:0,scan:p,heart:T.MathUtils.smoothstep(p,.08,.35),ribs:T.MathUtils.smoothstep(p,.04,.20),labels:0,collar:0};
 contextZoom=T.MathUtils.damp(contextZoom,1,reduced?1000:3,realDt);fluid.update(realDt,false);uniforms.amount.value=SIGNATURE_SCAN?0:frame.coat;uniforms.scan.value=frame.scan;uniforms.heartReveal.value=frame.heart;
 for(const [key,selected,valid] of [['water','water',Number.isFinite(telemetry.hydration)],['thermal','thermal',Number.isFinite(telemetry.temperature)],['activity','steps',activePose==='walking'&&!!telemetry.activity_state&&!stale]])uniforms[key].value=T.MathUtils.damp(uniforms[key].value,hologram&&mode===selected&&valid&&!stale?1:0,4,realDt);
 uniforms.heartLight.value=T.MathUtils.damp(uniforms.heartLight.value,SIGNATURE_SCAN?(.95+uniforms.scanSignals.discover.value*.55):(['water','steps','thermal'].includes(mode)?.82:1.15),3,realDt);
 uniforms.hydration.value=T.MathUtils.damp(uniforms.hydration.value,Number.isFinite(telemetry.hydration)?telemetry.hydration/100:0,3,realDt);
 uniforms.temperature.value=T.MathUtils.damp(uniforms.temperature.value,Number.isFinite(telemetry.temperature)?T.MathUtils.clamp((telemetry.temperature-35)/6,0,1):0,3,realDt);
 hoverFlash=Math.max(0,hoverFlash-realDt*2.4);
 uniforms.focus.value=T.MathUtils.damp(uniforms.focus.value,SIGNATURE_SCAN?uniforms.scanSignals.discover.value:(mode==='heart'?1:hoveredBody==='heart'?.28:0),3,realDt);
 uniforms.bloomStrength.value=SIGNATURE_SCAN?(.18+uniforms.scanSignals.discover.value*.42):.24;
 labelAmount=frame.labels;document.body.style.setProperty('--telemetry-reveal',labelAmount);document.body.dataset.twinState=reveal.state;document.body.style.setProperty('--anatomy-reveal',frame.heart);
 document.querySelector('.tabs').inert=false;
 if(!SIGNATURE_SCAN){const translucent=uniforms.amount.value>0;for(const mat of coatMaterials){if(mat.transparent!==translucent){mat.transparent=translucent;mat.depthWrite=true;mat.needsUpdate=true;}}}
 // Dashboard: walk whenever the walking model is on stage (host metrics alone must not freeze Ray).
 const gaitLive=isDashboardEmbed
  ?(activePose==='walking'||!!telemetry.activity_state)
  :(!!telemetry.activity_state&&!stale&&!reduced&&!paused);
 if(mixer&&gaitLive){if(mixer.timeScale===0)mixer.timeScale=1;mixer.update(dt);gaitWeight(mixer.time,activePose==='walking');}controls.update();alignStage();dust.rotation.y=elapsed*.015;
if(dog){dog.updateMatrixWorld(true);
{
 const measureSupport=()=>{
 if(rayCal?.active){
  dog.position.set(rayCal.x,rayCal.y,rayCal.z);
  dog.scale.setScalar(rayCal.scale);
  dog.updateMatrixWorld(true);
 }
 let lowest=Infinity;const minima=[Infinity,Infinity,Infinity,Infinity];
 for(const {mesh,indices} of supportSamples){const pos=mesh.geometry.attributes.position;for(const i of indices){mesh.getVertexPosition(i,groundPoint);groundPoint.applyMatrix4(mesh.matrixWorld);lowest=Math.min(lowest,groundPoint.y);if(activePose==='walking'){const pi=(pos.getZ(i)>0?0:2)+(pos.getX(i)<0?1:0);if(groundPoint.y<minima[pi]){minima[pi]=groundPoint.y;pawSurface[pi].copy(groundPoint);}}}}
 if(rayCal?.active){
  // Keep bake pose; seat the ground under measured pads so feet don't float.
  dog.userData.supportY=Number.isFinite(lowest)?lowest:dog.position.y;
  syncContactPlane(dog.userData.supportY);
  return;
 }
 if(Number.isFinite(lowest)){const shift=CONTACT_Y-lowest;dog.position.y+=shift;if(activePose==='walking')for(const p of pawSurface)p.y+=shift;dog.updateMatrixWorld(true);dog.userData.supportY=lowest+shift;syncContactPlane(dog.userData.supportY);}
 };measureSupport();
 // Walking is authored in place: never pin a sole in world space.
 // Preserve the clip's stance-to-swing velocity; only the body support height is corrected.
}

interaction.updateAnatomyFrame(heartBone);
heart.position.copy(heartBone.localToWorld(heartOffset.clone()));heartBone.getWorldQuaternion(chestRotation);heart.quaternion.copy(chestRotation).multiply(heartRotation);ribs.quaternion.copy(chestRotation).multiply(ribRotation);const beat=pulsePhase;const pulse=(!reduced&&bpmForPulse!=null?1:0)*(Math.exp(-Math.pow((beat-.12)/.075,2))*.17+Math.exp(-Math.pow((beat-.32)/.08,2))*.09);uniforms.pulse.value=pulse;heart.visible=frame.heart>.001;
if(activePose!=='walking'&&frame.heart>.001){
 // Same organ scale as walking; mild inset so it reads inside the chest, not a sticker.
 heart.scale.setScalar(1);
 heart.position.add(new T.Vector3(0,.006,-.016).applyQuaternion(chestRotation));
}
ribs.scale.setScalar(1);
if(heartMesh){heartMesh.morphTargetInfluences[0]=pulse*(SIGNATURE_SCAN?2.2:4.4);heartMesh.material.emissiveIntensity=(SIGNATURE_SCAN?(.18+uniforms.scanSignals.discover.value*.55):.32)+pulse*.85+uniforms.focus.value*.12+(hoveredBody==='heart'?hoverFlash*.16:0);}ribs.position.copy(heartBone.localToWorld(ribOffset.clone()));interior.position.copy(ribs.position);interior.quaternion.copy(chestRotation);interior.visible=!SIGNATURE_SCAN&&frame.heart>.001;ribFrame.value.makeRotationFromQuaternion(chestRotation).setPosition(ribs.position).invert();ribs.visible=frame.ribs>.001;ribs.traverse(o=>{if(o.isMesh){if(SIGNATURE_SCAN)o.material.opacity=1;else o.material.opacity=(.10+.28*T.MathUtils.smoothstep(p,.22,.5)-.06*uniforms.focus.value-.025*Math.max(uniforms.water.value,uniforms.thermal.value)+.03*uniforms.activity.value)*frame.ribs;}});
// Chest glow tracks heart — soft living light, not a neon lamp
chestGlow.position.copy(heart.position);chestGlow.intensity=T.MathUtils.damp(chestGlow.intensity,(SIGNATURE_SCAN?0:(frame.heart*(.35+pulse*1.4+uniforms.focus.value*.45))),4,realDt);
drop.position.set(activePose==='walking'?.42:.30,(activePose==='walking'?.36:.16)+Math.sin(elapsed*1.3)*.004,.05);drop.rotation.set(.035*Math.sin(elapsed),elapsed*.08,.045*Math.sin(elapsed*.7));drop.scale.setScalar(mode==='water'?1.45:1.1);drop.visible=false;
pawSurface.forEach((fp,i)=>{
 const contact=Number.isFinite(dog?.userData?.supportY)?dog.userData.supportY:CONTACT_Y;
 const lift=Math.max(0,fp.y-contact);
 const shadeY=(lift<.004?fp.y:contact)-SHADOW_UNDER;

 pawShadows[i].visible=activePose==='walking';
 // Discs sit just under pads — planted on the stage, not through the toes.
 pawShadows[i].position.set(fp.x,shadeY,fp.z);
 pawShadows[i].material.opacity=.55*(1.0-T.MathUtils.smoothstep(lift,.004,.065))+.08*(1.0-T.MathUtils.smoothstep(lift,.02,.15));
 pawShadows[i].scale.setScalar(.62+lift*2.1);
 const bone=feet[i];footLights[i].visible=interaction.locked&&activePose==='walking'&&(mode==='steps'||hoveredBody==='steps');
 if(bone){(bone.parent?.isBone?bone.parent:bone).getWorldPosition(footLights[i].position);footLights[i].quaternion.copy(camera.quaternion);footLights[i].material.opacity=mode==='steps'?.09*uniforms.activity.value:.09*hoverFlash;footLights[i].scale.setScalar(.65);}
});
if(mixer&&!paused&&telemetry.activity_state&&!stale){pawSurface.forEach((p,i)=>{const contact=Number.isFinite(dog?.userData?.supportY)?dog.userData.supportY:CONTACT_Y;const lift=p.y-contact;if(!contactDown[i]&&lift<.005){contactDown[i]=true;if(!reduced&&hologram&&mode==='steps'&&interaction.locked&&activePose==='walking')footprint(p);}else if(lift>.014)contactDown[i]=false;});}
 if(collarBone){collarSignal.position.copy(collarBone.localToWorld(collarOffset.clone()));collarBone.getWorldQuaternion(collarRotation);collarSignal.quaternion.copy(collarRotation);}
 collarSignal.visible=frame.collar>.001&&!reduced;collarSignal.material.opacity=frame.collar*.5;


 project(document.querySelector('#heartMark'),heart.position);project(document.querySelector('#waterMark'),ribs.position);project(document.querySelector('#feetMark'),activePose==='walking'?(pawSurface[0].y<pawSurface[1].y?pawSurface[0]:pawSurface[1]):stageAnchor);project(document.querySelector('#temperatureMark'),ribs.position);}

for(let i=footprints.length-1;i>=0;i--){const f=footprints[i],age=elapsed-f.born;f.group.scale.setScalar(1+Math.min(age/.48,1)*.18);f.mat.opacity=Math.pow(Math.max(0,1-age/.48),1.5)*.24*uniforms.amount.value*uniforms.activity.value;if(age>.48){scene.remove(f.group);f.group.traverse(o=>o.geometry?.dispose());f.mat.dispose();footprints.splice(i,1)}}const fluidOn=uniforms.fluidActive.value;uniforms.fluidActive.value=0;renderer.shadowMap.needsUpdate=true;reflection.update(dog,heart,ribs);uniforms.fluidActive.value=fluidOn;finishing.render();});

if(!isDashboardEmbed&&matchMedia('(prefers-reduced-motion: reduce)').matches){paused=true;const pauseLabel=document.querySelector('#pause span');if(pauseLabel)pauseLabel.textContent='Resume motion';}

function paintReading(element,key){
 if(key==='overview'){element.textContent='';return;}
 const field={heart:'heart_rate',water:'hydration',thermal:'temperature',steps:'steps'}[key];
 const value=Number.isFinite(telemetry[field])?(key==='steps'?telemetry.steps.toLocaleString('en-US'):telemetry[field]):null;
 const state=key==='steps'?(telemetry.activity_state||'Unknown'):'';
 renderReading(element,{value,unit:{heart:'bpm',water:'%',thermal:'°C',steps:'steps'}[key],state:state?state.charAt(0).toUpperCase()+state.slice(1):''});
}
function paintPanelReadings(){for(const [id,key] of [['metric-heart','heart'],['metric-water','water'],['metric-temp','thermal'],['metric-activity','steps']])paintReading(document.getElementById(id),key);}
export function updateTelemetry(reading={}, {source='external',alerts=[],connection='connected'}={}){
 context.received(reading,source);
 telemetry=normalizeTelemetry(reading);heartUI.data(telemetry,source);alerts=Array.isArray(reading.alerts)?reading.alerts:Array.isArray(alerts)?alerts:[];
 updateMarkers();switchPose(telemetry.activity_state);
 paintPanelReadings();paintReading(document.querySelector('#value'),mode);
 document.querySelector('#metric-location').textContent=Number.isFinite(telemetry.latitude)&&Number.isFinite(telemetry.longitude)?telemetry.latitude.toFixed(5)+', '+telemetry.longitude.toFixed(5):'Awaiting location';
 document.querySelector('#alert-status').textContent=alerts.length?String(alerts[0].anomaly_type||'Alert')+' · '+String(alerts[0].severity||''):source==='demo'?'Awaiting alerts':'No supplied alerts';
 document.querySelector('#sync-status').textContent=reading.created_at&&!Number.isNaN(Date.parse(reading.created_at))?'Last update '+new Date(reading.created_at).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}):source==='demo'?'Awaiting sync':'Update time unavailable';
 document.querySelector('#data-status').textContent=source==='demo'?'ILLUSTRATIVE ANATOMY · SIMULATED VALUES':String(connection).toUpperCase()+' · EXTERNAL TELEMETRY';
}
select('overview');setAppearance(false);paintPanelReadings();

function projectWorld(x,y,z){
 const v=new T.Vector3(x,y,z).project(camera);
 return{x:(v.x*.5+.5)*innerWidth,y:(-v.y*.5+.5)*innerHeight};
}
function snapshotRayCal(){
 if(!dog)return null;
 const heroScale=Number.isFinite(window.__pawlinkHeroScale)?window.__pawlinkHeroScale:HERO_SCALE;
 return{
  x:dog.position.x,y:dog.position.y,z:dog.position.z,
  scale:dog.scale.x,
  frameX:rayCal?.active&&Number.isFinite(rayCal.frameX)?rayCal.frameX:computeDefaultFrameX(),
  frameY:rayCal?.active?rayCal.frameY:computeDefaultStageY(heroScale),
  heroScale,
 };
}
function applyRayCal(partial){
 if(!rayCal)return;
 Object.assign(rayCal,partial);
 if(dog&&rayCal.active){
  dog.position.set(rayCal.x,rayCal.y,rayCal.z);
  dog.scale.setScalar(rayCal.scale);
  dog.updateMatrixWorld(true);
 }
 alignStage();
}
const _pickRay=new T.Raycaster();
const _pickNdc=new T.Vector2();
function screenBBox(){
 if(!dog)return null;
 dog.updateMatrixWorld(true);
 const min={x:1e9,y:1e9},max={x:-1e9,y:-1e9};
 dog.traverse(o=>{
  if(!o.isMesh||!o.geometry?.attributes?.position)return;
  const pos=o.geometry.attributes.position;
  for(let i=0;i<pos.count;i+=Math.max(1,Math.floor(pos.count/48))){
   groundPoint.set(pos.getX(i),pos.getY(i),pos.getZ(i)).applyMatrix4(o.matrixWorld);
   const s=projectWorld(groundPoint.x,groundPoint.y,groundPoint.z);
   min.x=Math.min(min.x,s.x);min.y=Math.min(min.y,s.y);
   max.x=Math.max(max.x,s.x);max.y=Math.max(max.y,s.y);
  }
 });
 return{minX:min.x,minY:min.y,maxX:max.x,maxY:max.y,w:max.x-min.x,h:max.y-min.y};
}
window.__pawlinkRayCal={
 isReady:()=>!!dog,
 get:()=>rayCal?{...rayCal}:null,
 snapshot:snapshotRayCal,
 enable(baseline){
  ensureCompositionLock();
  const snap=baseline||snapshotRayCal();
  if(!snap)return null;
  rayCal={active:true,...snap,baseline:{...snap},codeDefaults:{...snap},fromEditor:true,fromLock:false};
  applyRayCal({});
  return {...rayCal};
 },
 set(partial){if(rayCal){rayCal.fromEditor=true;rayCal.fromLock=false;}applyRayCal(partial||{});return rayCal?{...rayCal}:null;},
 reset(){if(!rayCal?.baseline)return null;applyRayCal({...rayCal.baseline});return {...rayCal};},
 rebase(){if(!rayCal)return null;const snap=snapshotRayCal();rayCal.baseline={...snap};return {...rayCal};},
 current(){if(!rayCal?.codeDefaults)return null;applyRayCal({...rayCal.codeDefaults});return {...rayCal};},
 disable(){rayCal=null;ensureCompositionLock();alignStage();},
 /** Exact live framing targets currently driving viewOffset (not inferred from paws). */
 liveFraming(){
  const heroScale=Number.isFinite(window.__pawlinkHeroScale)?window.__pawlinkHeroScale:HERO_SCALE;
  return{
   frameX:rayCal?.active&&Number.isFinite(rayCal.frameX)?rayCal.frameX:computeDefaultFrameX(),
   frameY:rayCal?.active&&Number.isFinite(rayCal.frameY)?rayCal.frameY:computeDefaultStageY(heroScale),
   active:!!rayCal?.active,
  };
 },
 screenBBox,
 hitTest(clientX,clientY){
  if(!dog)return false;
  const rect=renderer.domElement.getBoundingClientRect();
  _pickNdc.x=((clientX-rect.left)/rect.width)*2-1;
  _pickNdc.y=-((clientY-rect.top)/rect.height)*2+1;
  _pickRay.setFromCamera(_pickNdc,camera);
  const meshes=[];dog.traverse(o=>{if(o.isMesh)meshes.push(o);});
  return _pickRay.intersectObjects(meshes,true).length>0;
 },
 measure(){
  const dockEl=(window.parent&&window.parent!==window)?window.parent.document.querySelector('.product-screen__dock'):document.querySelector('.product-screen__dock');
  const dockTop=dockEl?dockEl.getBoundingClientRect().top:innerHeight-DOCK_BOTTOM_PX-DOCK_HEIGHT_PX;
  const paws=pawSurface.map(p=>{const s=projectWorld(p.x,p.y,p.z);return{world:[p.x,p.y,p.z],x:s.x,y:s.y};});
  const lowestPaw=paws.length?Math.max(...paws.map(p=>p.y)):null;
  const gap=lowestPaw==null?null:dockTop-lowestPaw;
  const bbox=screenBBox();
  return{vw:innerWidth,vh:innerHeight,dockTop,lowestPaw,gap,paws,bbox,cal:rayCal?{x:rayCal.x,y:rayCal.y,z:rayCal.z,scale:rayCal.scale,frameX:rayCal.frameX,frameY:rayCal.frameY}:snapshotRayCal()};
 },
};
window.twinDemo={scene,camera,controls,select,setAppearance,updateTelemetry,state:()=>({experience:interaction.state(),state:reveal.state,channels:{...reveal.value},phase:pulsePhase,motionTime:mixer?.time??0,mode,systems:{water:uniforms.water.value,thermal:uniforms.thermal.value,activity:uniforms.activity.value,hydration:uniforms.hydration.value,temperature:uniforms.temperature.value},fluid:uniforms.fluidActive.value,pose:activePose,focus:uniforms.focus.value,pulse:uniforms.pulse.value,contacts:footprints.length,bloom:finishing.supported,heartVisible:heart.visible,ribsVisible:ribs.visible,render:renderer.info.render}),grounding:()=>({supportY:dog?.userData.supportY,paws:pawSurface.map(p=>p.toArray()),shadows:pawShadows.map(p=>({position:p.position.toArray(),opacity:p.material.opacity})),bones:feet.map(b=>b?.name),root:dog?.position.toArray()})};

// Host integration: dispatch a validated reading through the existing adapter.
window.addEventListener('pawlink:telemetry',event=>{if(event.detail?.reading)updateTelemetry(event.detail.reading,event.detail.options||{});});

updateTelemetry({}, {source:'external',connection:'unknown'});
window.updateTelemetry=updateTelemetry;
window.rayProof={complete:()=>uniforms.completeTwin.value,state:interaction.state,progress:interaction.captureProgress,release:interaction.release,origin:()=>uniforms.body.origin.value.toArray()};

// Isolated review entry opens the approved complete Twin, then selects Heart.
if(new URLSearchParams(location.search).get('twin')==='1'){
 const openReview=()=>{if(!dogReady||anatomyReady!==2){requestAnimationFrame(openReview);return;}renderer.domElement.dispatchEvent(new KeyboardEvent('keydown',{code:'Enter'}));};openReview();
}

export function exploreSystem(key){if(!['heart','water','steps','thermal','overview'].includes(key))return;requestedSystem=key;interaction.explore();}
