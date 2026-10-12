

export async function createStatusLight(host) {
  let renderer, material, geometry;
  try {
    const THREE = await import('./vendor/three.module.js');
    renderer = new THREE.WebGLRenderer({alpha:true, antialias:false, powerPreference:'low-power'});
    renderer.setPixelRatio(Math.min(devicePixelRatio,1));
    host.append(renderer.domElement);
    const scene=new THREE.Scene(), camera=new THREE.OrthographicCamera(-1,1,1,-1,0,1);
    const uniforms={resolution:{value:new THREE.Vector2()},center:{value:new THREE.Vector2()},size:{value:new THREE.Vector2()},alpha:{value:0}};
    material=new THREE.ShaderMaterial({transparent:true,depthTest:false,depthWrite:false,uniforms,
      vertexShader:'varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}',
      fragmentShader:`precision highp float;
      varying vec2 vUv; uniform vec2 resolution,center,size; uniform float alpha;
      void main(){vec2 p=vUv*resolution-center;float radius=size.y*.5;
      vec2 q=abs(p)-vec2(max(0.,size.x*.5-radius),0.);
      float d=length(max(q,0.))+min(max(q.x,q.y),0.)-radius;
      float core=1.-smoothstep(-3.,6.,d);
      float glow=exp(-max(d,0.)/20.)*.38;
      vec3 color=mix(vec3(1.,.84,.72),vec3(1.,.982,.975),core);
      gl_FragColor=vec4(color,max(core,glow)*alpha);}`});
    geometry=new THREE.PlaneGeometry(2,2);scene.add(new THREE.Mesh(geometry,material));
    return {
      render(progress,opacity){const w=host.clientWidth,h=host.clientHeight;
        if(renderer.domElement.width!==Math.round(w*renderer.getPixelRatio())||renderer.domElement.height!==Math.round(h*renderer.getPixelRatio()))renderer.setSize(w,h,false);
        const vw=Math.min(w,h*16/9),vh=vw*9/16;
        uniforms.resolution.value.set(w,h);
        uniforms.center.value.set(w/2+vw*.007*(1-progress),h/2-vh*.002*(1-progress));
        uniforms.size.value.set(vw*.522+(w*2-vw*.522)*progress,vh*.16+(h*2.8-vh*.16)*progress);
        uniforms.alpha.value=opacity;renderer.render(scene,camera);
      },dispose(){geometry.dispose();material.dispose();renderer.dispose();renderer.domElement.remove();}
    };
  } catch(error) {
    renderer?.dispose();material?.dispose();geometry?.dispose();
    
    const light=document.createElement('i');light.className='fallback-light';host.append(light);
    return {render(p,a){const w=host.clientWidth,h=host.clientHeight,vw=Math.min(w,h*16/9);light.style.width=(vw*.522+(w*2-vw*.522)*p)+'px';light.style.height=(vw*9/16*.16+(h*2.8-vw*9/16*.16)*p)+'px';light.style.opacity=a;},dispose(){light.remove()}};
  }
}
