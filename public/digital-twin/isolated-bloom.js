import * as T from 'three';

export function isolatedBloom(renderer,scene,camera,signals){
 const supported=renderer.capabilities.isWebGL2&&renderer.extensions.has('EXT_color_buffer_float');
 if(!supported)return {resize(){},render(){renderer.render(scene,camera);},supported:false};
 const make=()=>new T.WebGLRenderTarget(1,1,{type:T.HalfFloatType,depthBuffer:true});
 const beauty=make(),emission=make(),horizontal=make(),soft=make();
 beauty.samples=2;horizontal.depthBuffer=false;soft.depthBuffer=false;
 const screen=new T.Scene(),cam=new T.OrthographicCamera(-1,1,1,-1,0,1);
 const vertexShader='varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}';
 const blur=new T.ShaderMaterial({depthTest:false,depthWrite:false,uniforms:{image:{value:null},stepSize:{value:new T.Vector2()}},vertexShader,fragmentShader:`varying vec2 vUv;uniform sampler2D image;uniform vec2 stepSize;
 void main(){vec3 c=texture2D(image,vUv).rgb*.227027;c+=(texture2D(image,vUv+stepSize*1.384615).rgb+texture2D(image,vUv-stepSize*1.384615).rgb)*.316216;c+=(texture2D(image,vUv+stepSize*3.230769).rgb+texture2D(image,vUv-stepSize*3.230769).rgb)*.070270;gl_FragColor=vec4(c,1.);}`});
 const composite=new T.ShaderMaterial({depthTest:false,depthWrite:false,premultipliedAlpha:true,uniforms:{beauty:{value:beauty.texture},glow:{value:soft.texture},strength:signals.bloomStrength},vertexShader,fragmentShader:`varying vec2 vUv;uniform sampler2D beauty,glow;uniform float strength;
 void main(){vec4 b=texture2D(beauty,vUv);vec3 g=texture2D(glow,vUv).rgb*strength;float coverage=clamp(max(g.r,max(g.g,g.b))*.65,0.,.55);float a=b.a+coverage*(1.-b.a);gl_FragColor=vec4((b.rgb+g)/max(a,.00001),a);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
 #include <premultiplied_alpha_fragment>
 }`});
 const quad=new T.Mesh(new T.PlaneGeometry(2,2),composite);screen.add(quad);
 function resize(){const size=renderer.getDrawingBufferSize(new T.Vector2());beauty.setSize(size.x,size.y);const w=Math.max(1,Math.round(size.x/2)),h=Math.max(1,Math.round(size.y/2));for(const rt of [emission,horizontal,soft])rt.setSize(w,h);}
 resize();
 return {supported:true,resize,render(){
  if(signals.amount.value<=.0001&&signals.heartReveal.value<=.0001){renderer.setRenderTarget(null);renderer.render(scene,camera);return;}
  const hidden=[];
  try{
   renderer.setRenderTarget(beauty);renderer.clear();renderer.render(scene,camera);
   scene.traverse(o=>{if(o.isMesh&&o.visible){const mats=Array.isArray(o.material)?o.material:[o.material];if(!mats.some(m=>m.userData.opticalEmission)){hidden.push(o);o.visible=false;}}});
   signals.bloomPass.value=1;renderer.setRenderTarget(emission);renderer.clear();renderer.render(scene,camera);
  }finally{signals.bloomPass.value=0;for(const o of hidden)o.visible=true;renderer.setRenderTarget(null);}
  quad.material=blur;blur.uniforms.image.value=emission.texture;blur.uniforms.stepSize.value.set(1.6/emission.width,0);renderer.setRenderTarget(horizontal);renderer.render(screen,cam);
  blur.uniforms.image.value=horizontal.texture;blur.uniforms.stepSize.value.set(0,1.6/emission.height);renderer.setRenderTarget(soft);renderer.render(screen,cam);
  quad.material=composite;renderer.setRenderTarget(null);renderer.render(screen,cam);
 }};
}
