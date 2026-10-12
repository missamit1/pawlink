import * as T from 'three';

export function fluidReveal(renderer,signals){
 const size=192,options={depthBuffer:false,stencilBuffer:false};
 let read=new T.WebGLRenderTarget(size,size,options),write=new T.WebGLRenderTarget(size,size,options);
 const scene=new T.Scene(),camera=new T.OrthographicCamera(-1,1,1,-1,0,1);
 const u={history:{value:read.texture},pointer:{value:new T.Vector2(-2,-2)},previous:{value:new T.Vector2(-2,-2)},aspect:{value:innerWidth/innerHeight},dt:{value:.016},time:{value:0},inject:{value:0}};
 const material=new T.ShaderMaterial({depthTest:false,depthWrite:false,uniforms:u,vertexShader:'varying vec2 uv0;void main(){uv0=uv;gl_Position=vec4(position.xy,0.,1.);}',fragmentShader:`varying vec2 uv0;uniform sampler2D history;uniform vec2 pointer,previous;uniform float aspect,dt,time,inject;
 void main(){vec2 drift=vec2(sin(uv0.y*19.+time*.23),cos(uv0.x*17.-time*.19))*.003*dt;vec2 p=uv0-drift;vec2 px=vec2(1./192.);float c=texture2D(history,p).r*.6; c+=(texture2D(history,p+vec2(px.x,0)).r+texture2D(history,p-vec2(px.x,0)).r+texture2D(history,p+vec2(0,px.y)).r+texture2D(history,p-vec2(0,px.y)).r)*.1;c*=exp(-dt*.72);
 vec2 q=uv0*vec2(aspect,1.),a=previous*vec2(aspect,1.),b=pointer*vec2(aspect,1.);vec2 ab=b-a;float h=clamp(dot(q-a,ab)/max(dot(ab,ab),.00001),0.,1.);float d=length(q-a-ab*h);float stroke=(1.-smoothstep(.045,.14,d))*inject;gl_FragColor=vec4(max(c,stroke),0.,0.,1.);}`});
 scene.add(new T.Mesh(new T.PlaneGeometry(2,2),material));
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let active=false,lastMove=0,wasEnabled=false;
 renderer.domElement.addEventListener('pointermove',e=>{if(e.pointerType==='touch'&&e.buttons===0)return;u.pointer.value.set(e.clientX/innerWidth,1-e.clientY/innerHeight);if(!active)u.previous.value.copy(u.pointer.value);active=true;lastMove=performance.now();},{passive:true});
 renderer.domElement.addEventListener('pointerleave',()=>{active=false;});
 renderer.domElement.addEventListener('pointerup',e=>{if(e.pointerType==='touch')active=false;});
 function clear(){const prior=renderer.getRenderTarget(),color=renderer.getClearColor(new T.Color()),alpha=renderer.getClearAlpha();renderer.setClearColor(0,0);for(const target of [read,write]){renderer.setRenderTarget(target);renderer.clear();}renderer.setRenderTarget(prior);renderer.setClearColor(color,alpha);}
 clear();signals.fluidMap={value:read.texture};signals.fluidResolution={value:renderer.getDrawingBufferSize(new T.Vector2())};signals.fluidActive={value:0};
 return {update(dt,enabled){
  enabled=enabled&&!reduced.matches;
  signals.fluidActive.value=enabled?1:0;
  if(!enabled){if(wasEnabled)clear();wasEnabled=false;active=false;return;}
  wasEnabled=true;u.dt.value=Math.min(dt,.05);u.time.value+=u.dt.value;u.aspect.value=innerWidth/innerHeight;u.inject.value=active&&performance.now()-lastMove<140?1:0;u.history.value=read.texture;
  const prior=renderer.getRenderTarget();renderer.setRenderTarget(write);renderer.render(scene,camera);renderer.setRenderTarget(prior);[read,write]=[write,read];signals.fluidMap.value=read.texture;renderer.getDrawingBufferSize(signals.fluidResolution.value);u.previous.value.copy(u.pointer.value);
 },reset(){clear();active=false;},dispose(){read.dispose();write.dispose();material.dispose();}};
}
