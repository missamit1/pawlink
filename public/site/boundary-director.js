import * as THREE from './vendor/three.module.js';
export async function createBoundaryDirector(host,video,stage){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 let renderer;
 try{renderer=new THREE.WebGLRenderer({alpha:false,antialias:false,powerPreference:'low-power'});}catch{stage.classList.add('fx-fallback');return {start(){},cross(){},portal(){},finish(){},clear(){},pause(){},resume(){},setVideo(){},dispose(){}};}
 renderer.setPixelRatio(Math.min(devicePixelRatio,1));host.append(renderer.domElement);
 let texture=new THREE.VideoTexture(video);texture.minFilter=THREE.LinearFilter;
 const u={film:{value:texture},aspect:{value:1},mediaAspect:{value:16/9},clock:{value:0},wave:{value:0},impact:{value:0},ending:{value:0},aerial:{value:0},shotTime:{value:0},fracture:{value:0},blackout:{value:0},aperture:{value:0},exitLight:{value:0},pointer:{value:new THREE.Vector2()}};
 const material=new THREE.ShaderMaterial({uniforms:u,vertexShader:`varying vec2 uvp;void main(){uvp=uv;gl_Position=vec4(position.xy,0.,1.);}`,fragmentShader:`
 precision highp float;
 uniform sampler2D film;uniform float aspect,mediaAspect,clock,wave,impact,ending,aerial,shotTime,fracture,blackout,aperture,exitLight;uniform vec2 pointer;varying vec2 uvp;
 vec2 crop(vec2 p){if(aspect>mediaAspect)p.y*=mediaAspect/aspect;else p.x=(p.x-.5)*aspect/mediaAspect+.5;p=mix(vec2(.5,.505),p,1./(1.+exitLight*exitLight*7.));return clamp(p,vec2(.001),vec2(.999));}
 vec3 softFilm(vec2 uv,float radius){
 vec2 d=vec2(radius/max(aspect,.5),radius)/3.;
 vec3 sum=vec3(0.);float total=0.;
 for(int x=-3;x<=3;x++){for(int y=-3;y<=3;y++){
 float weight=exp(-float(x*x+y*y)*.35);
 sum+=texture2D(film,crop(uv+vec2(float(x),float(y))*d)).rgb*weight;total+=weight;
 }}return sum/total;
 }
 void main(){
 vec2 p=uvp;vec2 q=(p-.5)*vec2(aspect,1.);float r=length(q);
 float ring=exp(-pow((r-wave*1.7)*13.,2.))*impact;
 vec2 bend=q/(r+.2)*ring*.009;
 vec2 source=crop(p);
 float protect=1.-smoothstep(.10,.24,length((source-vec2(.48,.49))*vec2(1.,.65)));
 float angle=atan(q.y,q.x);float sector=floor((angle+3.141593)/.785398);
 float seed=fract(sin(sector*127.1)*43758.5453);
 vec2 outward=normalize(q+vec2(.0001));
 vec2 shard=outward*fracture*(.018+seed*.065)*(1.-protect);
 shard+=vec2(-outward.y,outward.x)*fracture*.014*sin(sector*2.4)*(1.-protect);
 vec2 uv=p+bend+shard+pointer*.004*ending;
 float split=ring*.004+fracture*.0025*(1.-protect);
 vec3 c=vec3(texture2D(film,crop(uv+vec2(split,0))).r,texture2D(film,crop(uv)).g,texture2D(film,crop(uv-vec2(split,0))).b);
 float lineY=.84-shotTime*.135+.16*(source.x-.5);
 float distanceToEdge=abs(source.y-lineY);
 float overheadFocus=aerial*(1.-smoothstep(2.8,4.2,shotTime));
 if(overheadFocus>.001){
   c=softFilm(uv,.018*overheadFocus);
 }
 float vignette=smoothstep(.18,1.1,r);c*=1.-vignette*.48*(1.-aerial);
 c+=ring*vec3(.25,.10,.015);
 float edge=exp(-distanceToEdge*430.)+.24*exp(-distanceToEdge*54.);
 float show=smoothstep(.12,.55,shotTime)*(1.-smoothstep(2.9,3.8,shotTime))*aerial;
 vec3 boundaryColor=mix(vec3(.8,.9,.75),vec3(1.,.32,.08),smoothstep(1.85,2.,shotTime));
 c+=boundaryColor*edge*show*(1.-protect)*1.45;
 float seam=exp(-abs(sin(angle*4.))*180.);
 c+=vec3(.24,.16,.09)*seam*fracture*(1.-protect);
 c*=1.-blackout*(.32+.38*(1.-protect))*(1.-aerial);
 c=mix(c,c*vec3(.75,.87,1.04),fracture*.28*(1.-protect)*(1.-aerial));
 float edgeLight=exp(-abs(abs(q.x)-(.06+aperture*aspect)) * 38.);
 c+=vec3(.48,.19,.055)*edgeLight*impact*(1.-protect);
 vec2 drift=q+pointer*.15;
 float glow=exp(-length(drift-vec2(.48*sin(clock*.18),.20*cos(clock*.13)))*1.9);
 float membrane=pow(.5+.5*sin(length(drift+vec2(.4,.1))*5.-clock*.24),5.);
 vec3 field=mix(vec3(.024,.04,.046),vec3(.24,.12,.066),glow)+membrane*vec3(.075,.037,.015);
 c=mix(c,field,ending);
 float reveal=smoothstep(.24,1.,exitLight);
 vec2 center=vec2(.5,.505);if(aspect>mediaAspect)center.y*=aspect/mediaAspect;
 vec2 aperturePoint=abs((p-center)*vec2(aspect,1.));
 vec2 size=mix(vec2(.018,.0015),vec2(aspect+1.,1.5),vec2(pow(reveal,.7),pow(reveal,2.6)));
 float sd=length(max(aperturePoint-size,0.))+min(max(aperturePoint.x-size.x,aperturePoint.y-size.y),0.);
 float opening=(1.-smoothstep(-.002,.008,sd))*smoothstep(0.,.16,exitLight);
 c+=vec3(.19,.16,.12)*exp(-max(sd,0.)*55.)*sin(exitLight*3.141593);
 c=mix(c,vec3(.965,.949,.918),opening);gl_FragColor=vec4(c,1.);
 }`});
 const scene=new THREE.Scene(),camera=new THREE.Camera(),geometry=new THREE.PlaneGeometry(2,2);scene.add(new THREE.Mesh(geometry,material));
 let frame=0,running=false,suspended=false,tl=null,finishTween=null;
 function resize(){renderer.setSize(host.clientWidth,host.clientHeight,false);u.aspect.value=host.clientWidth/Math.max(1,host.clientHeight);u.mediaAspect.value=(video.videoWidth||1920)/(video.videoHeight||1080);}
 const ro=new ResizeObserver(resize);ro.observe(host);
 function draw(t){frame=0;if(!running||suspended||document.hidden)return;u.clock.value=reduced?0:t*.001;u.aerial.value=video.id==='sideRun'?1:0;u.shotTime.value=video.currentTime-.05;renderer.render(scene,camera);frame=requestAnimationFrame(draw);}
 const move=e=>{if(reduced)return;const b=host.getBoundingClientRect();u.pointer.value.set((e.clientX-b.left)/b.width-.5,.5-(e.clientY-b.top)/b.height);};stage.addEventListener('pointermove',move,{passive:true});
 const gs=window.gsap;
 return {
 setVideo(next){video=next;texture.dispose();texture=new THREE.VideoTexture(video);texture.minFilter=THREE.LinearFilter;u.film.value=texture;resize();},
 start(){resize();running=true;suspended=false;if(!frame)frame=requestAnimationFrame(draw);},
 cross(){
 if(!gs||reduced)return;
 tl?.kill();u.wave.value=0;u.impact.value=0;u.fracture.value=0;u.aperture.value=0;
 const words=stage.querySelectorAll('.breach-word');
 tl=gs.timeline();
 tl.to(u.blackout,{value:1,duration:.18,ease:'power2.in'},0)
   .to(u.blackout,{value:0,duration:1.25,ease:'power2.out'},.38)
   .to(u.impact,{value:1,duration:.12},.16)
   .to(u.fracture,{value:1,duration:.32,ease:'expo.out'},.18)
   .to(u.fracture,{value:0,duration:1.6,ease:'power3.out'},.50)
   .to(u.aperture,{value:1,duration:1.65,ease:'power3.out'},.18)
   .to(u.wave,{value:1,duration:1.65,ease:'power2.out'},.18)
   .to(u.impact,{value:0,duration:.8},1.05)
   .fromTo(words,{opacity:0,z:-600,rotationX:36,yPercent:45,filter:'blur(14px)'},
     {opacity:1,z:0,rotationX:0,yPercent:0,filter:'blur(0px)',duration:.85,stagger:.10,ease:'expo.out'},.22)
   .to(stage.querySelector('.breach-left'),{xPercent:-34,z:120,rotationY:-16,opacity:0,filter:'blur(7px)',duration:1.05,ease:'power3.in'},2.05)
   .to(stage.querySelector('.breach-right'),{xPercent:34,z:120,rotationY:16,opacity:0,filter:'blur(7px)',duration:1.05,ease:'power3.in'},2.05)
   .fromTo(stage.querySelector('.alarm-title p'),{opacity:0,y:15},{opacity:1,y:0,duration:.7,ease:'power2.out'},1.05)
   .to(stage.querySelector('.alarm-title p'),{opacity:0,duration:.7},3.10)
   .fromTo(stage.querySelector('.alarm-marker'),{opacity:0,x:-18},{opacity:1,x:0,duration:.6},.65)
   .fromTo(stage.querySelector('.ray-identity'),{opacity:0,y:18},{opacity:1,y:0,duration:.7},2.70);

 },
 portal(progress){u.exitLight.value=reduced?0:progress;if(reduced)u.ending.value=0;},
 finish(){if(gs){finishTween=gs.to(u.ending,{value:1,duration:reduced?.1:2.5,ease:'power2.inOut'});}else u.ending.value=1;},
 clear(){running=false;cancelAnimationFrame(frame);frame=0;tl?.kill();finishTween?.kill();u.ending.value=0;u.impact.value=0;u.fracture.value=0;u.wave.value=0;u.blackout.value=0;u.aperture.value=0;u.exitLight.value=0;if(gs)gs.set('.breach-word,.alarm-title p,.alarm-marker,.ray-identity,.alarm-context',{clearProps:'all'});},
 pause(){suspended=true;tl?.pause();finishTween?.pause();cancelAnimationFrame(frame);frame=0;},
 resume(){suspended=false;tl?.resume();finishTween?.resume();if(running&&!frame)frame=requestAnimationFrame(draw);},
 dispose(){running=false;cancelAnimationFrame(frame);tl?.kill();finishTween?.kill();ro.disconnect();stage.removeEventListener('pointermove',move);texture.dispose();material.dispose();geometry.dispose();renderer.dispose();}
 };
}
