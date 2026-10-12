

export async function createSafeZone(host){
 let renderer,geometry,material;
 try{
  const T=await import('./vendor/three.module.js');renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));host.append(renderer.domElement);
  const scene=new T.Scene(),camera=new T.PerspectiveCamera(58,1,.05,60);camera.position.set(0,1.05,0);camera.lookAt(0,.65,-7);
  geometry=new T.PlaneGeometry(50,2.2);material=new T.ShaderMaterial({transparent:true,depthWrite:false,side:T.DoubleSide,uniforms:{strength:{value:0},outside:{value:0}},vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'varying vec2 vUv;uniform float strength;uniform float outside;void main(){float d=abs(vUv.y-.5);float glow=exp(-d*8.)*.16+exp(-d*70.)*.32;vec3 color=mix(vec3(.96,.92,.76),vec3(1.,.69,.36),outside);gl_FragColor=vec4(color,glow*strength);}' });
  const boundary=new T.Mesh(geometry,material);boundary.rotation.x=-Math.PI/2;boundary.position.y=.01;scene.add(boundary);
  return {render(progress,reveal){const w=host.clientWidth,h=host.clientHeight;if(renderer.domElement.width!==Math.round(w*renderer.getPixelRatio())||renderer.domElement.height!==Math.round(h*renderer.getPixelRatio())){renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}boundary.position.z=-8+progress*8.7;material.uniforms.strength.value=reveal;material.uniforms.outside.value=progress>.92?1:0;renderer.render(scene,camera);},clear(){renderer.clear()},dispose(){geometry.dispose();material.dispose();renderer.dispose();renderer.domElement.remove()}};
 }catch{renderer?.dispose();geometry?.dispose();material?.dispose();const band=document.createElement('i');band.className='zone-fallback';host.append(band);return{render(p,a){band.style.top=(55+p*50)+'%';band.style.opacity=p<1?a*.4:0},clear(){band.style.opacity=0},dispose(){band.remove()}}}
}
