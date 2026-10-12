import {maskGLSL} from './body-mask.js';
import {scanGLSL, scanVertexInject} from './signature-scan.js';
import * as T from 'three';

export function coatOptics(material, signals, curled) {
 
 material.userData.opticalEmission = !(signals.scanSignals?.mode?.value > 0.5);
 material.side = signals.scanSignals?.mode?.value > 0.5 ? T.FrontSide : T.DoubleSide;
 material.forceSinglePass=true;
 material.roughness=.62;
 material.envMapIntensity=.65;
 if(signals.scanSignals?.mode?.value > 0.5){
  material.transparent=true;
  material.depthWrite=true;
  material.alphaToCoverage=false;
  material.dithering=false;
 }
 material.onBeforeCompile=s=>{
  Object.assign(s.uniforms,{uCompleteTwin:signals.completeTwin,uBodyOrigin:signals.body.origin,uBodyProgress:signals.body.progress,uFluidMap:signals.fluidMap,uFluidResolution:signals.fluidResolution,uFluidActive:signals.fluidActive,uBloomPass:signals.bloomPass,uNoiseAmount:signals.noiseAmount,uNoiseScale:signals.noiseScale,uSoftness:signals.edgeSoftness,uFlow:signals.flowAmount,uFlowSpeed:signals.flowSpeed,uFresnel:signals.fresnelIntensity,uTwin:signals.amount,uScan:signals.scan,uFocus:signals.focus,uClock:signals.time,uWater:signals.water,uThermal:signals.thermal,uActivity:signals.activity,uHydration:signals.hydration,uTemperature:signals.temperature,uPulse:signals.pulse,uMotion:signals.motion,uCurled:{value:curled?1:0},uScanPlane:signals.scanSignals.plane,uSignatureMode:signals.scanSignals.mode,uScanActive:signals.scanSignals.active,uHeartDiscover:signals.scanSignals.discover});
  s.vertexShader=s.vertexShader.replace('#include <common>',`#include <common>
 varying vec3 vRest; varying vec3 vView; varying vec3 vScanWorld;
 float rayHash(vec3 p){p=fract(p*vec3(.1031,.1030,.0973));p+=dot(p,p.yxz+33.33);return fract((p.x+p.y)*p.z);}
 float rayNoise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(rayHash(i),rayHash(i+vec3(1,0,0)),f.x),mix(rayHash(i+vec3(0,1,0)),rayHash(i+vec3(1,1,0)),f.x),f.y),mix(mix(rayHash(i+vec3(0,0,1)),rayHash(i+vec3(1,0,1)),f.x),mix(rayHash(i+vec3(0,1,1)),rayHash(i+vec3(1,1,1)),f.x),f.y),f.z);}
 float rayFBM(vec3 p){float n=0.;float a=.5714286;for(int i=0;i<3;i++){n+=a*rayNoise(p);p=p*2.03+vec3(13.1,7.7,19.3);a*=.5;}return n;}`).replace('#include <project_vertex>',`#include <project_vertex>
 vRest=position; vView=mvPosition.xyz; ${scanVertexInject}`);
  s.fragmentShader=s.fragmentShader.replace('#include <common>',`#include <common>
 ${maskGLSL}
 ${scanGLSL}
 uniform sampler2D uFluidMap;uniform vec2 uFluidResolution;uniform float uFluidActive;
 uniform float uCompleteTwin;
 uniform float uBloomPass,uNoiseAmount,uNoiseScale,uSoftness,uFlow,uFlowSpeed,uFresnel;
 uniform float uTwin,uScan,uFocus,uClock,uCurled,uWater,uThermal,uActivity,uHydration,uTemperature,uPulse,uMotion;
 varying vec3 vRest; varying vec3 vView;
 float rayHash(vec3 p){p=fract(p*vec3(.1031,.1030,.0973));p+=dot(p,p.yxz+33.33);return fract((p.x+p.y)*p.z);}
 float rayNoise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(rayHash(i),rayHash(i+vec3(1,0,0)),f.x),mix(rayHash(i+vec3(0,1,0)),rayHash(i+vec3(1,1,0)),f.x),f.y),mix(mix(rayHash(i+vec3(0,0,1)),rayHash(i+vec3(1,0,1)),f.x),mix(rayHash(i+vec3(0,1,1)),rayHash(i+vec3(1,1,1)),f.x),f.y),f.z);}
 float rayFBM(vec3 p){float n=0.;float a=.5714286;for(int i=0;i<3;i++){n+=a*rayNoise(p);p=p*2.03+vec3(13.1,7.7,19.3);a*=.5;}return n;}`)
   .replace('#include <normal_fragment_maps>', '#include <normal_fragment_maps>\n float shellMask=mix(bodyMask(vRest,0.),smoothstep(.02,.55,uBodyProgress),uCurled); float shellNormal=shellMask*(1.-smoothstep(.49,.64,vRest.y)*smoothstep(.12,.29,vRest.z)); if(uSignatureMode<.5)normal=normalize(mix(normal,nonPerturbedNormal,shellNormal*.72));').replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\n float shellRough=mix(bodyMask(vRest,0.),smoothstep(.02,.55,uBodyProgress),uCurled); if(uSignatureMode<.5)roughnessFactor=mix(roughnessFactor,.23,shellRough*(1.-smoothstep(.49,.64,vRest.y)*smoothstep(.12,.29,vRest.z)));').replace('#include <opaque_fragment>',`
 float standingFace=smoothstep(.49,.64,vRest.y)*smoothstep(.12,.29,vRest.z);
 float curledFace=max(
  (1.-smoothstep(.12,.30,vRest.y))*smoothstep(.06,.28,vRest.z),
  (1.-smoothstep(.20,.36,vRest.y))*smoothstep(.16,.38,vRest.z)*smoothstep(-.18,.12,vRest.x)
 );
 float face=mix(standingFace,curledFace,uCurled);
 if(uSignatureMode>.5){if(!gl_FrontFacing)discard;}
 else if(!gl_FrontFacing && face<.70)discard;

 if(uSignatureMode>.5){
  float cut=scanCut(vScanWorld);
  float lip=1.-smoothstep(0.,.016,abs(scanSide(vScanWorld)));
  float ndv=abs(dot(normalize(normal),normalize(-vView)));
  float silhouette=pow(clamp(1.-ndv,0.,1.),1.6);
  if(cut<.5){
   diffuseColor.a=1.0;
   #include <opaque_fragment>
   if(uBloomPass>.5)gl_FragColor=vec4(0.,0.,0.,1.);
  }else{
   vec3 tissue=vec3(.92,.84,.76);
   outgoingLight=tissue*(.62+.28*silhouette);
   outgoingLight+=vec3(.76,.60,.52)*lip*.08;
   diffuseColor.a=mix(.035,.10,silhouette)+lip*.04;
   #include <opaque_fragment>
   if(uBloomPass>.5)gl_FragColor=vec4(0.,0.,0.,diffuseColor.a);
  }
 }else{
 float torso=smoothstep(.25,.42,vRest.y)*(1.0-smoothstep(.23,.40,vRest.z));
 float chest=exp(-pow((vRest.y-.46)/.16,4.0)-pow((vRest.z-.16)/.21,4.0));
 float regional=max(torso*.46,chest*.98)*(1.0-face);
 regional=mix(regional, mix(.55,.92,smoothstep(.02,.55,uBodyProgress))*(1.0-face), uCurled);
 float travel=bodyDistance(vRest);
 float arrived=mix(bodyMask(vRest,0.),smoothstep(.02,.55,uBodyProgress),uCurled);
 float amount=max(arrived,uCompleteTwin);
 float fluidMask=texture2D(uFluidMap,gl_FragCoord.xy*(uBloomPass>.5?2.0:1.0)/uFluidResolution).r*uFluidActive*amount;
 fluidMask=smoothstep(.035,.70,fluidMask)*(1.-face*.82);
 float edge=pow(1.0-abs(dot(normalize(normal),normalize(-vView))),3.2);
 float lineY=1.0-smoothstep(.015,.045,abs(fract(vRest.y*32.0)-.5));
 float lineZ=1.0-smoothstep(.012,.035,abs(fract(vRest.z*28.0)-.5));
 float scan=mix(arrived*(1.-arrived)*1.4, amount*edge*1.05, uCurled);
 float opticalLip=mix(pow(max(0.,4.*arrived*(1.-arrived)),5.), pow(edge,2.4)*amount*.75, uCurled);
 float layerWeight=smoothstep(.22,.48,uBodyProgress)*(1.-face);
 float shellSheen=pow(1.-abs(dot(normalize(normal),normalize(-vView))),1.6);
 vec3 spectral=vec3(.64,.79,.75);
 vec3 emission=spectral*amount*edge*uFresnel*(1.0-face*.98)*.65+spectral*scan*.06*(1.-face);
 emission+=spectral*amount*edge*uCurled*(1.0-face)*.22;
 outgoingLight=mix(outgoingLight,outgoingLight*.94+vec3(.035,.035,.03),amount*regional*.45);
 outgoingLight+=spectral*amount*(edge*uFresnel*.26+regional*(lineY+lineZ)*.009)*(1.0-face*.95);
 outgoingLight+=mix(vec3(.85,.82,.73),spectral,edge)*scan*uTwin*(.19+edge*.10)*(1.0-face);
 outgoingLight+=vec3(.77,.78,.71)*opticalLip*(.10+layerWeight*.24+edge*.12)*(1.-face);
 outgoingLight=mix(outgoingLight,outgoingLight*.78+vec3(.095,.10,.09)*( .35+shellSheen),amount*layerWeight*regional);
 outgoingLight+=vec3(.68,.75,.70)*pow(shellSheen,2.)*amount*layerWeight*.24;
 float pearlLobe=pow(max(0.,dot(normalize(normal),normalize(vec3(-.45,.65,.60)))),12.);
 outgoingLight+=vec3(.72,.75,.67)*pearlLobe*amount*layerWeight*regional*.32;
 float drift=rayFBM(vRest*uNoiseScale+vec3(0.,-uClock*uFlowSpeed*uMotion,0.));
 outgoingLight+=spectral*regional*amount*uFlow*pow(drift,3.0);
 float envelope=regional*(1.0-face)*amount;
 float flowField=rayFBM(vRest*15.0+vec3(0.,-uClock*.12*uMotion,uClock*.035*uMotion));
 float fluidRidge=pow(1.0-abs(flowField*2.0-1.0),14.0);
 float innerField=rayFBM(vRest*23.0+vec3(4.,uClock*.06*uMotion,7.));
 outgoingLight*=1.0-envelope*uWater*.14;
 outgoingLight+=vec3(.19,.54,.51)*envelope*uWater*(.045+fluidRidge*.95+pow(innerField,4.0)*.22)*(.25+.75*uHydration);
 outgoingLight+=vec3(.46,.22,.10)*envelope*uThermal*(.22+.36*uTemperature)*(chest*.6+edge*.7+innerField*.35);
 outgoingLight+=vec3(.32,.66,.59)*amount*uActivity*edge*.13*(1.0-face);
 outgoingLight+=vec3(.48,.23,.30)*envelope*chest*uFocus*uPulse*.55;
 outgoingLight=mix(outgoingLight,outgoingLight*.48+spectral*.18,fluidMask*.72);
 outgoingLight+=spectral*fluidMask*(edge*.90+(lineY+lineZ)*.19);
 emission+=spectral*fluidMask*edge*.32;
 emission+=vec3(.18,.48,.44)*envelope*uWater*fluidRidge*.22;
 emission+=vec3(.42,.20,.08)*envelope*uThermal*edge*.12;
 float alpha=1.0-regional*.24-mix(chest,amount,uCurled)*(1.0-face)*(.45+uFocus*.035);
 outgoingLight=mix(outgoingLight,outgoingLight*.96+vec3(.035,.035,.03),amount*regional*.45);
 alpha-=envelope*uWater*.07;
 alpha=mix(alpha,min(alpha,.20),fluidMask*.92);
 float spot=1.-smoothstep(.025,.24,dot(diffuseColor.rgb,vec3(.2126,.7152,.0722)));
 alpha=mix(alpha,max(alpha,.88),spot*.78);
 alpha=max(alpha,face*.92);
 alpha=max(alpha,edge*.38);
 alpha=mix(alpha,min(alpha,.38),uCurled*amount*.85*(1.0-face));
 float identity=1.-smoothstep(.03,.25,dot(diffuseColor.rgb,vec3(.2126,.7152,.0722)));
 float full=uCompleteTwin*(1.-face*.96);
 float opticalRim=pow(1.-abs(dot(normalize(normal),normalize(-vView))),2.1);
 vec3 pearl=vec3(.68,.66,.60);
 float shellLight=pow(max(0.,dot(normalize(normal),normalize(vec3(-.4,.8,.6)))),8.);
 outgoingLight=mix(outgoingLight,outgoingLight*mix(.82,.97,identity)+pearl*(.035+shellLight*.22+opticalRim*.19)*(1.-identity*.75),full);
 outgoingLight+=vec3(.46,.69,.64)*(lineY+lineZ)*full*.026;
 emission+=vec3(.43,.69,.63)*opticalRim*full*.15;
 float fullAlpha=mix(.62,.94,identity);
 fullAlpha=max(fullAlpha,opticalRim*.72);
 alpha=mix(alpha,min(alpha,fullAlpha),full);
 diffuseColor.a=mix(1.0,alpha,amount);
 #include <opaque_fragment>
 if(uBloomPass>.5)gl_FragColor=vec4(emission,diffuseColor.a);
 }
`);
 };
 material.customProgramCacheKey=()=>`signature-peel-coat-77-${curled}-${signals.scanSignals?.mode?.value>0.5?1:0}`;
}

export function stageReflection(renderer,scene,camera) {
 const rt=new T.WebGLRenderTarget(512,256,{depthBuffer:true});
 const mirror=new T.PerspectiveCamera();
 const matrix=new T.Matrix4();
 const bias=new T.Matrix4().set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1);
 const material=new T.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{image:{value:rt.texture},projection:{value:matrix}},
 vertexShader:`uniform mat4 projection; varying vec4 projected; varying vec3 floorPoint;
 void main(){vec4 w=modelMatrix*vec4(position,1.);floorPoint=w.xyz;projected=projection*w;gl_Position=projectionMatrix*viewMatrix*w;}`,
 fragmentShader:`uniform sampler2D image;varying vec4 projected;varying vec3 floorPoint;
 void main(){vec2 uv=projected.xy/projected.w;vec4 sum=vec4(0.);for(int x=-1;x<=1;x++){for(int y=-1;y<=1;y++){sum+=texture2D(image,uv+vec2(float(x),float(y))*.004);}}
 sum/=9.;float fade=1.-smoothstep(.12,.55,length(floorPoint.xz));gl_FragColor=vec4(sum.rgb,sum.a*.19*fade);}`});
 const plane=new T.Mesh(new T.PlaneGeometry(1.4,1.35),material);plane.rotation.x=-Math.PI/2;plane.position.y=-.024;scene.add(plane);
 let count=0;
 return {plane,update(dog,heart,ribs){
  if(!dog)return;count++;
  mirror.copy(camera);mirror.position.y=-.036-camera.position.y;
  const dir=camera.getWorldDirection(new T.Vector3());dir.y=-dir.y;
  mirror.up.set(0,-1,0);mirror.lookAt(mirror.position.clone().add(dir));mirror.updateMatrixWorld();
  matrix.copy(bias).multiply(mirror.projectionMatrix).multiply(mirror.matrixWorldInverse);
  const hidden=[];for(const object of scene.children){if(object!==dog&&object!==heart&&object!==ribs&&!object.isLight&&object.visible){hidden.push(object);object.visible=false;}}
  const prior=renderer.getRenderTarget();renderer.setRenderTarget(rt);renderer.clear();renderer.render(scene,mirror);renderer.setRenderTarget(prior);hidden.forEach(o=>o.visible=true);
 }};
}

export function holographicHeart(signals){
 const signature = signals.scanSignals?.mode?.value > 0.5;
 const material=new T.MeshPhysicalMaterial({
  color: signature ? 0x7a2e38 : 0x9a3548,
  roughness: signature ? .42 : .26,
  metalness:.04,
  clearcoat: signature ? .12 : .55,
  clearcoatRoughness: signature ? .4 : .18,
  transparent: !signature,
  opacity: signature ? 1 : .78,
  depthTest:true,
  depthWrite:true,
  side:T.FrontSide,
  emissive: signature ? 0x4a1820 : 0x6b2034,
  emissiveIntensity: signature ? .22 : .28,
  envMapIntensity: signature ? .7 : 1.05,
 });
 
 if(signature){material.depthTest=false;}
 material.userData.opticalEmission=true;
 material.onBeforeCompile=s=>{
  s.uniforms.uBloomPass=signals.bloomPass;s.uniforms.uHeartLight=signals.heartLight;
  s.uniforms.uHeartTime=signals.time;s.uniforms.uHeartReveal=signals.heartReveal;s.uniforms.uHeartFocus=signals.focus;s.uniforms.uOtherFocus=signals.water;s.uniforms.uThermalFocus=signals.thermal;
  Object.assign(s.uniforms,{uScanPlane:signals.scanSignals.plane,uSignatureMode:signals.scanSignals.mode,uScanActive:signals.scanSignals.active,uHeartDiscover:signals.scanSignals.discover});
  s.vertexShader=s.vertexShader.replace('#include <common>',`#include <common>\nvarying vec3 vHeartView; varying vec3 vHeartWorld; varying vec3 vScanWorld;`).replace('#include <project_vertex>',`#include <project_vertex>\nvHeartView=mvPosition.xyz;vHeartWorld=(modelMatrix*vec4(transformed,1.0)).xyz; vScanWorld=vHeartWorld;`);
  s.fragmentShader=s.fragmentShader.replace('#include <common>',`#include <common>\n${scanGLSL}\nvarying vec3 vHeartView; varying vec3 vHeartWorld; uniform float uBloomPass,uHeartLight,uHeartTime,uHeartReveal,uHeartFocus,uOtherFocus,uThermalFocus;`).replace('#include <opaque_fragment>',`
  if(uSignatureMode>.5){
   float cut=scanCut(vScanWorld);
   if(cut < .45) discard;
   float discover=uHeartDiscover;
   float edge=pow(1.0-abs(dot(normalize(normal),normalize(-vHeartView))),2.0);
   float form=smoothstep(-.45,.85,dot(normalize(normal),normalize(vec3(-.45,.65,.70))));
   outgoingLight*=mix(.75,1.28,form);
   outgoingLight=mix(outgoingLight, outgoingLight*vec3(1.12, .92, .88), discover*.55);
   outgoingLight+=vec3(.55,.22,.24)*edge*(.12+discover*.45);
   diffuseColor.a=1.0;
   vec3 emission=vec3(.52,.16,.20)*( .35+discover*1.4+edge*.5);
   #include <opaque_fragment>
   if(uBloomPass>.5)gl_FragColor=vec4(emission*uHeartLight,1.0);
  }else{
  float edge=pow(1.0-abs(dot(normalize(normal),normalize(-vHeartView))),1.85);
  float filament=pow(.5+.5*cos(vHeartWorld.y*980.0+uHeartTime*2.4),18.0);
  float heartForm=smoothstep(-.45,.85,dot(normalize(normal),normalize(vec3(-.45,.65,.70))));
  float vein=pow(.5+.5*sin(vHeartWorld.x*620.0+vHeartWorld.z*480.0),10.0);
  outgoingLight*=mix(.62,1.32,heartForm);
  outgoingLight+=vec3(.86,.42,.48)*edge*.28;
  outgoingLight+=vec3(.62,.82,.78)*edge*edge*.16;
  outgoingLight+=vec3(.70,.88,.84)*filament*.02;
  outgoingLight+=vec3(.55,.22,.30)*vein*.06*uHeartFocus;
  outgoingLight*=(1.0+uHeartFocus*.28)*uHeartLight;
  diffuseColor.a=clamp(.74+edge*.22,.74,.94)*uHeartReveal*(1.0-.35*max(uOtherFocus,uThermalFocus));
  #include <opaque_fragment>
  if(uBloomPass>.5)gl_FragColor=vec4((vec3(.58,.20,.32)+vec3(.40,.72,.68)*edge*.9)*uHeartLight*(.7+uHeartFocus*.5),diffuseColor.a);
  }
`);
 };
 material.customProgramCacheKey=()=> `anatomical-heart-holo-78-${signature?1:0}`;
 return material;
}
