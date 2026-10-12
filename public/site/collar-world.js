import * as T from './vendor/three.module.js';
const $=s=>document.querySelector(s),reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
let renderer;try{renderer=new T.WebGLRenderer({antialias:true,powerPreference:'high-performance'});}catch{$('#fallback').hidden=false;$('#begin').hidden=true;}
if(renderer)boot();
function boot(){
renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.setClearColor(0x0b1111);renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=.9;$('#world').append(renderer.domElement);
const scene=new T.Scene();scene.fog=new T.FogExp2(0x0b1111,.023);const camera=new T.PerspectiveCamera(48,innerWidth/innerHeight,.1,160);
scene.add(new T.HemisphereLight(0xfff0d8,0x364841,2));const key=new T.DirectionalLight(0xfff2df,3);key.position.set(4,5,5);scene.add(key);const rim=new T.PointLight(0xc7e5df,65,30);rim.position.set(-4,1,2);scene.add(rim);

const envScene=new T.Scene();envScene.background=new T.Color(0x33403e);
for(const [x,y,z,sx,sy] of [[0,5,0,9,3],[-6,1,0,3,7],[6,0,-2,2,9]]){const panel=new T.Mesh(new T.PlaneGeometry(sx,sy),new T.MeshBasicMaterial({color:0xf4f1e8,side:T.DoubleSide}));panel.position.set(x,y,z);panel.lookAt(0,0,0);envScene.add(panel);}
const pmrem=new T.PMREMGenerator(renderer),environment=pmrem.fromScene(envScene);scene.environment=environment.texture;
function capsule(w,h){const s=new T.Shape(),r=h/2;s.moveTo(-w/2+r,-r);s.lineTo(w/2-r,-r);s.absarc(w/2-r,0,r,-Math.PI/2,Math.PI/2,false);s.lineTo(-w/2+r,r);s.absarc(-w/2+r,0,r,Math.PI/2,Math.PI*1.5,false);return s;}
const bodyGeo=new T.ExtrudeGeometry(capsule(4.5,2.2),{depth:.42,bevelEnabled:true,bevelSegments:5,steps:1,bevelSize:.12,bevelThickness:.12,curveSegments:36});bodyGeo.center();
const object=new T.Group();scene.add(object);object.position.set(2.3,0,0);
const chrome=new T.MeshPhysicalMaterial({color:0xd9c7b1,metalness:1,roughness:.19,clearcoat:1});const ceramic=new T.MeshPhysicalMaterial({color:0xede3d4,metalness:.08,roughness:.2,clearcoat:1});
const trim=new T.Mesh(bodyGeo,chrome);object.add(trim);const face=new T.Mesh(bodyGeo,ceramic);face.scale.set(.94,.91,.78);face.position.z=.16;object.add(face);
const slotGeo=new T.ExtrudeGeometry(capsule(.68,.11),{depth:.03,bevelEnabled:false,curveSegments:24});const slotMaterial=new T.MeshBasicMaterial({color:0xfff6de});const slot=new T.Mesh(slotGeo,slotMaterial);slot.position.set(.98,0,.48);object.add(slot);

const labelCanvas=document.createElement('canvas');labelCanvas.width=256;labelCanvas.height=256;const lc=labelCanvas.getContext('2d');lc.fillStyle='#ae9c85';lc.font='120px Georgia';lc.textAlign='center';lc.fillText('p',128,155);const labelMap=new T.CanvasTexture(labelCanvas);const label=new T.Mesh(new T.PlaneGeometry(.75,.75),new T.MeshBasicMaterial({map:labelMap,transparent:true,depthWrite:false}));label.position.set(-.3,0,.492);object.add(label);

const tunnel=new T.Group();scene.add(tunnel);const contours=[];
const contourCurve=new T.CatmullRomCurve3(capsule(9,5).getPoints(96).map(p=>new T.Vector3(p.x,p.y,0)),true);
const tube=new T.TubeGeometry(contourCurve,160,.018,5,true);
for(let i=0;i<26;i++){const mat=new T.MeshBasicMaterial({color:0xc8d5c4,transparent:true,opacity:.25,blending:T.AdditiveBlending,depthWrite:false});const mesh=new T.Mesh(tube,mat);mesh.position.z=-i*1.4-3;mesh.rotation.z=i*.032;tunnel.add(mesh);contours.push(mesh);}
const beamGeo=new T.CylinderGeometry(.5,5,32,48,1,true);
const beamMat=new T.ShaderMaterial({transparent:true,side:T.DoubleSide,depthWrite:false,blending:T.AdditiveBlending,uniforms:{t:{value:0},tint:{value:new T.Color(0xc8d5c4)}},vertexShader:'varying vec2 v;void main(){v=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'varying vec2 v;uniform float t;uniform vec3 tint;void main(){float streak=pow(.5+.5*sin(v.x*87.+sin(v.y*8.+t)*.4),16.);float fade=sin(v.y*3.14159);gl_FragColor=vec4(tint,(.025+streak*.07)*fade);}' });
const beams=new T.Mesh(beamGeo,beamMat);beams.rotation.x=Math.PI/2;beams.position.z=-15;scene.add(beams);
const pointCount=1800,positions=new Float32Array(pointCount*3),seeds=[];for(let i=0;i<pointCount;i++){const a=Math.random()*Math.PI*2,r=2.4+Math.random()*5.5;seeds.push({a,r,z:-Math.random()*48});positions.set([Math.cos(a)*r,Math.sin(a)*r*.65,seeds[i].z],i*3);}
const dustGeo=new T.BufferGeometry();dustGeo.setAttribute('position',new T.BufferAttribute(positions,3));const dustMat=new T.PointsMaterial({color:0xf7d7aa,size:.045,transparent:true,opacity:.65,blending:T.AdditiveBlending,depthWrite:false});scene.add(new T.Points(dustGeo,dustMat));
const shell=new T.Mesh(new T.IcosahedronGeometry(1.45,3),new T.MeshPhysicalMaterial({color:0xcfddd2,metalness:.45,roughness:.15,transparent:true,opacity:.14,wireframe:true}));shell.position.set(2.8,0,-14);scene.add(shell);
const photoTex=new T.TextureLoader().load('assets/ray/closing-ray.jpg');photoTex.colorSpace=T.SRGBColorSpace;
const portraitMat=new T.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{photo:{value:photoTex},alpha:{value:0}},vertexShader:'varying vec2 v;void main(){v=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:`uniform sampler2D photo;uniform float alpha;varying vec2 v;void main(){vec2 p=(v-.5)*vec2(1.,1.35);float d=length(vec2(p.x,max(abs(p.y)-.21,0.)));float mask=1.-smoothstep(.47,.49,d);vec3 col=texture2D(photo,vec2(v.x*.65+.1,v.y)).rgb;gl_FragColor=vec4(col,mask*alpha);}`});
const portrait=new T.Mesh(new T.PlaneGeometry(8,9),portraitMat);portrait.position.set(3.4,0,-29);scene.add(portrait);

const target=new T.WebGLRenderTarget(1,1,{type:T.HalfFloatType});const postScene=new T.Scene(),postCamera=new T.Camera();const pu={image:{value:target.texture},resolution:{value:new T.Vector2()},impact:{value:0},time:{value:0}};
const postMat=new T.ShaderMaterial({uniforms:pu,vertexShader:'varying vec2 v;void main(){v=uv;gl_Position=vec4(position.xy,0.,1.);}',fragmentShader:`precision highp float;uniform sampler2D image;uniform vec2 resolution;uniform float impact,time;varying vec2 v;void main(){vec2 q=v-.5;float r=length(q);vec2 bend=q/(r+.15)*sin(r*22.-time*5.)*.012*impact;vec2 uv=clamp(v+bend,.001,.999);vec3 c=texture2D(image,uv).rgb;vec3 glow=vec3(0.);for(int i=0;i<8;i++){float a=float(i)*.785398;vec2 o=vec2(cos(a),sin(a))*7./resolution;glow+=max(texture2D(image,clamp(uv+o,.001,.999)).rgb-.65,0.);}c+=glow*.095;c+=vec3(.12,.034,.009)*impact*pow(r,1.5);c*=1.-.3*dot(q,q);gl_FragColor=vec4(c,1.);
#include <tonemapping_fragment>
#include <colorspace_fragment>
}`});postScene.add(new T.Mesh(new T.PlaneGeometry(2,2),postMat));
let elapsed=0,started=false,paused=false,last=0,raf=0,signal='heart',act='',pointer=new T.Vector2(),smoothPointer=new T.Vector2();
const acts=[{id:'object',at:0,chapter:'01 / THE OBJECT',kicker:'IT STARTS WITH A SMALL LIGHT.',title:'Closer<br><i>begins here.</i>',caption:'A collar on him.<br>A connection between you.',status:'RAY · CONNECTION AVAILABLE'}, {id:'signal',at:3,chapter:'02 / UNDER THE SURFACE',kicker:'EVERY SIGNAL BELONGS TO SOMEONE.',title:'Not just<br><i>a number.</i>',caption:'His rhythm. His movement.<br>Choose a signal. Change the space.',status:'RAY · SIGNAL FOUND'}, {id:'breach',at:8,chapter:'03 / THE INVISIBLE EDGE',kicker:'HE CROSSED THE BOUNDARY.',title:'Outside.<br><i>Not beyond reach.</i>',caption:'The Safe Zone changes.<br>The connection holds.',status:'RAY · OUTSIDE SAFE ZONE'}, {id:'portrait',at:12,chapter:'04 / THE CONNECTION',kicker:'ON THE OTHER SIDE OF EVERY SIGNAL.',title:'Still Ray.<br><i>Still connected.</i>',caption:'A little more understanding.<br>A whole lot of him.',status:'RAY · CONNECTION HELD'}];
function setAct(a){if(act===a.id)return;act=a.id;document.body.dataset.act=act;$('#chapter').textContent=a.chapter;$('#kicker').textContent=a.kicker;$('#headline').innerHTML=a.title;$('#caption').innerHTML=a.caption;$('#status').textContent=a.status;$('.signals').hidden=act==='object';$('.story').classList.remove('changing');void $('.story').offsetWidth;$('.story').classList.add('changing');}
setAct(acts[0]);
const clamp=T.MathUtils.clamp,lerp=T.MathUtils.lerp,ease=x=>{x=clamp(x,0,1);return x*x*(3-2*x);};
function resize(){const w=innerWidth,h=innerHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();target.setSize(w*renderer.getPixelRatio(),h*renderer.getPixelRatio());pu.resolution.value.set(target.width,target.height);}resize();addEventListener('resize',resize);
addEventListener('pointermove',e=>pointer.set(e.clientX/innerWidth-.5,.5-e.clientY/innerHeight),{passive:true});
$('#begin').onclick=()=>{started=true;$('.entry').hidden=true;};$('#motion').onclick=()=>{paused=!paused;$('#motion').textContent=paused?'RESUME ▷':'PAUSE Ⅱ';$('#motion').setAttribute('aria-label',paused?'Resume experience':'Pause experience');};$('#replay').onclick=()=>{elapsed=0;started=true;paused=false;$('#replay').hidden=true;$('#motion').textContent='PAUSE Ⅱ';};
const meanings={heart:'Every pulse gives the connection a rhythm.',activity:'Movement stretches the signal forward.',hydration:'An illustrative hydration signal becomes a cool, fluid field.'};document.querySelectorAll('[data-signal]').forEach(b=>b.onclick=()=>{signal=b.dataset.signal;document.querySelectorAll('[data-signal]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));$('#meaning').textContent=meanings[signal];});
function draw(now){raf=requestAnimationFrame(draw);const dt=last?Math.min((now-last)/1000,.05):0;last=now;if(!paused&&started)elapsed=Math.min(15,elapsed+dt);if(paused)return;
 const t=elapsed,ambient=reduce?0:now*.001;setAct([...acts].reverse().find(a=>t>=a.at));if(t>=15)$('#replay').hidden=false;
 const travel=reduce?(t>=3?1:0):ease((t-.5)/10.8);const mobile=innerWidth<700;
 smoothPointer.lerp(pointer,.045);camera.position.set((mobile?1.6:0)+smoothPointer.x*(reduce?0:.7),smoothPointer.y*(reduce?0:.4)+(mobile?1:0),lerp(12,-18,travel));camera.lookAt(mobile?1.6:0,0,camera.position.z-12);
 object.rotation.set(Math.sin(ambient*.45)*.09,-.25+smoothPointer.x*.22,Math.sin(ambient*.24)*.04);object.position.y=mobile?-1.2:Math.sin(ambient*.6)*.08;object.visible=t<3.5;object.scale.setScalar(1-ease((t-2.5)/1));
 const breach=ease((t-8)/.35)*(1-ease((t-10.3)/1.3));pu.impact.value=reduce?0:breach;pu.time.value=ambient;
 const color=new T.Color(signal==='hydration'?0xa2e4dc:signal==='activity'?0xe6d5b2:0xe8e3d3);color.lerp(new T.Color(0xff9253),breach);dustMat.color.copy(color);beamMat.uniforms.tint.value.copy(color);beamMat.uniforms.t.value=ambient;beams.rotation.z=ambient*.02;
 const beat=reduce?0:Math.pow(Math.max(0,Math.sin(ambient*5.4)),8)*.075;
 contours.forEach((m,i)=>{const dist=Math.abs(m.position.z-camera.position.z);m.material.color.copy(color);m.material.opacity=(.26+.42*Math.exp(-dist*.14))*(t<2?.2:1)*(1-.8*ease((t-11.5)/2));m.rotation.z=i*.032+(reduce?0:ambient*(signal==='activity'?.06:.014))+breach*Math.sin(i)*.35;m.position.x=breach*Math.sin(i*1.7)*.9;m.scale.setScalar(1+(signal==='heart'?beat:0)+breach*.1);});
 for(let i=0;i<pointCount;i++){const s=seeds[i],a=s.a+(reduce?0:ambient*(signal==='hydration'?.10:.018));positions[i*3]=Math.cos(a)*s.r;positions[i*3+1]=Math.sin(a)*s.r*.65;positions[i*3+2]=reduce?s.z:-(((-s.z)+(ambient*(signal==='activity'?4:.4)))%48);}dustGeo.attributes.position.needsUpdate=true;
 shell.visible=t>3&&t<12;shell.rotation.set(ambient*.09,ambient*.16,0);shell.scale.setScalar(1+beat*2+breach*.3);shell.material.color.copy(color);
 portraitMat.uniforms.alpha.value=ease((t-11.3)/2);portrait.position.x=mobile?1.5:3.4;portrait.position.y=mobile?-1.5:0;
 renderer.setRenderTarget(target);renderer.render(scene,camera);renderer.setRenderTarget(null);renderer.render(postScene,postCamera);
}
raf=requestAnimationFrame(draw);document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;}else if(!raf){last=0;raf=requestAnimationFrame(draw);}});addEventListener('pagehide',()=>{cancelAnimationFrame(raf);renderer.dispose();target.dispose();environment.dispose();pmrem.dispose();scene.traverse(o=>{o.geometry?.dispose();if(o.material){for(const m of [o.material].flat())m.dispose();}});photoTex.dispose();labelMap.dispose();postMat.dispose();},{once:true});
}
